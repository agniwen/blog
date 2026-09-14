import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import { parse } from 'jsonc-parser';
import { Client, types } from 'pg';

// One-time, source-authoritative import. Never run after accepting new D1 writes.
const apply = process.argv.includes('--apply');
const tables = [
  'users',
  'accounts',
  'posts',
  'tags',
  'post_tags',
  'comments',
  'sessions',
  'verifications',
];
const baseline = '20260914150827_hard_doorman/migration.sql';
const config = parse(readFileSync('wrangler.jsonc', 'utf8'));
const binding = config.d1_databases.find((item) => item.binding === 'DB');
if (
  binding.database_name !== 'blog' ||
  binding.database_id !== '7381a7aa-92cc-411d-aabe-35c74abebea6'
)
  throw new Error('Unexpected D1 target');
const directory = mkdtempSync(join(tmpdir(), 'blog-d1-import-'));
function execute(sql, write = false) {
  const file = join(directory, 'query.sql');
  writeFileSync(file, sql, { mode: 0o600 });
  const result = spawnSync(
    'pnpm',
    [
      'exec',
      'wrangler',
      'd1',
      'execute',
      binding.database_name,
      '--remote',
      ...(write ? ['--file', file] : ['--command', sql]),
      '--json',
    ],
    { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
  );
  // Do not expose SQL, tokens or source data in failure output.
  if (result.status !== 0) throw new Error('D1 command failed; private SQL has not been logged');
  let output;
  try {
    output = JSON.parse(result.stdout.slice(result.stdout.search(/\[\s*\{/)));
  } catch {
    throw new Error('Invalid D1 response; private output has not been logged');
  }
  if (output.some((item) => !item.success)) throw new Error('D1 query unsuccessful');
  return output.map((item) => item.results);
}
function signature(ddl) {
  const database = new DatabaseSync(':memory:');
  database.exec(ddl);
  const result = tables.map((table) => ({
    table,
    columns: database
      .prepare(`PRAGMA table_info(${table})`)
      .all()
      .map((column) => ({
        ...column,
        dflt_value: column.dflt_value?.toLowerCase().replace('false', '0') ?? null,
      })),
    foreignKeys: database.prepare(`PRAGMA foreign_key_list(${table})`).all(),
    indexes: database
      .prepare(`PRAGMA index_list(${table})`)
      .all()
      .map(({ name, unique, origin, partial }) => ({
        name,
        unique,
        origin,
        partial,
        columns: database.prepare(`PRAGMA index_info('${name}')`).all(),
      }))
      .toSorted((a, b) => a.name.localeCompare(b.name)),
  }));
  database.close();
  return JSON.stringify(result);
}
const canonical = (value) =>
  Array.isArray(value)
    ? value.map(canonical)
    : value && typeof value === 'object'
      ? Object.fromEntries(
          Object.keys(value)
            .toSorted()
            .map((key) => [key, canonical(value[key])]),
        )
      : value;
const key = (table, row) =>
  table === 'post_tags' ? JSON.stringify([row.post_id, row.tag_id]) : row.id;
function digest(table, rows) {
  return createHash('sha256')
    .update(
      JSON.stringify(
        rows
          .map((row) =>
            canonical({
              ...row,
              ...(table === 'posts' && row.json_content !== null
                ? { json_content: JSON.parse(row.json_content) }
                : {}),
            }),
          )
          .toSorted((a, b) => key(table, a).localeCompare(key(table, b))),
      ),
    )
    .digest('hex');
}
function literal(value) {
  if (value === null) return 'NULL';
  if (typeof value === 'number' && Number.isSafeInteger(value)) return String(value);
  if (typeof value !== 'string' || value.includes('\0')) throw new Error('Unsupported SQL value');
  return `'${value.replaceAll("'", "''")}'`;
}
types.setTypeParser(1114, (value) => value);
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
});
try {
  if (
    apply &&
    execute(`SELECT name FROM d1_migrations WHERE name=${literal(baseline)}`)[0].length
  ) {
    throw new Error('D1 import was already completed; refusing to overwrite current D1 data');
  }
  await client.connect();
  await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
  const source = {};
  for (const table of tables) {
    const { rows: columns } = await client.query(
      'SELECT column_name,data_type FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2 ORDER BY ordinal_position',
      ['public', table],
    );
    const { rows } = await client.query(`SELECT * FROM "${table}"`);
    source[table] = rows.map((row) =>
      Object.fromEntries(
        columns.map(({ column_name: name, data_type: type }) => {
          let value = row[name];
          if (value !== null) {
            if (type === 'timestamp without time zone')
              value = Date.parse(value.replace(' ', 'T') + 'Z');
            else if (type === 'boolean') value = Number(value);
            else if (type === 'json' || type === 'jsonb') value = JSON.stringify(value);
          }
          return [name, value];
        }),
      ),
    );
  }
  await client.query('COMMIT');
  const [ddl] = execute(
    "SELECT sql FROM sqlite_master WHERE sql IS NOT NULL AND (type='table' OR type='index') AND name NOT LIKE 'sqlite_%' AND name NOT IN ('_cf_KV','d1_migrations')",
  );
  if (
    signature(ddl.map((row) => row.sql + ';').join('\n')) !==
    signature(readFileSync(`drizzle/d1/${baseline}`, 'utf8'))
  )
    throw new Error('Existing D1 schema differs from generated baseline');
  const existing = execute(tables.map((table) => `SELECT * FROM ${table};`).join('\n'));
  for (const [index, table] of tables.entries()) {
    const ids = new Set(source[table].map((row) => key(table, row)));
    if (existing[index].some((row) => !ids.has(key(table, row))))
      throw new Error(`D1 has extra ${table} records; refusing overwrite`);
    console.log(
      `${table}: source=${source[table].length}, D1=${existing[index].length}, equal=${digest(table, source[table]) === digest(table, existing[index])}`,
    );
  }
  if (apply) {
    const statements = tables.flatMap((table) =>
      source[table].map((row) => {
        const columns = Object.keys(row);
        const keys = table === 'post_tags' ? ['post_id', 'tag_id'] : ['id'];
        const updates = columns.filter((column) => !keys.includes(column));
        return `INSERT INTO ${table} (${columns.map((column) => `"${column}"`).join(',')}) VALUES (${columns.map((column) => literal(row[column])).join(',')}) ON CONFLICT (${keys.join(',')}) DO ${updates.length ? `UPDATE SET ${updates.map((column) => `"${column}"=excluded."${column}"`).join(',')}` : 'NOTHING'};`;
      }),
    );
    if (statements.some((sql) => Buffer.byteLength(sql) > 100000))
      throw new Error('A record exceeds safe D1 statement size');
    execute(statements.join('\n'), true);
    const actual = execute(tables.map((table) => `SELECT * FROM ${table};`).join('\n'));
    for (const [index, table] of tables.entries()) {
      if (digest(table, source[table]) !== digest(table, actual[index]))
        throw new Error(`Verification failed: ${table}`);
      console.log(`Verified ${table}: ${actual[index].length} records, SHA-256 matches`);
    }
    if (execute('PRAGMA foreign_key_check;')[0].length)
      throw new Error('Foreign key verification failed');
    execute(
      `INSERT INTO d1_migrations (name) VALUES (${literal(baseline)}) ON CONFLICT(name) DO NOTHING;`,
    );
    console.log(
      'Import verified; existing schema adopted as generated D1 baseline. PostgreSQL was read-only.',
    );
  }
} finally {
  await client.end();
  rmSync(directory, { recursive: true, force: true });
}
