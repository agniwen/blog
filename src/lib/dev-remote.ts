/** Only the local Vite config supplies this capability URL. Never deployed. */
export async function devRemote<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error('Local connection to remote services failed. Check proxy and Wrangler login.');
  return response.json();
}

interface Statement { sql: string; params: unknown[] }
interface RawResult { success: boolean; results: { columns: string[]; rows: unknown[][] }; meta: D1Meta }

export function devD1Binding(url: string): D1Database {
  const prepared = new WeakMap<object, Statement>();
  function prepare(sql: string, params: unknown[] = []): D1PreparedStatement {
    const statement = { sql, params };
    const query = async () => {
      const results = await devRemote<D1Result<Record<string, unknown>>[]>(url, { operation: 'd1', mode: 'query', statements: statement });
      if (!results[0]?.success) throw new Error('Remote D1 statement failed');
      return results[0];
    };
    const item = {
      bind: (...values: unknown[]) => prepare(sql, values),
      all: query,
      run: query,
      first: async (column?: string) => { const row = (await query()).results[0]; return column ? row?.[column] ?? null : row ?? null; },
      raw: async (options?: { columnNames?: boolean }) => {
        const result = (await devRemote<RawResult[]>(url, { operation: 'd1', mode: 'raw', statements: statement }))[0];
        if (!result?.success) throw new Error('Remote D1 statement failed');
        return options?.columnNames ? [result.results.columns, ...result.results.rows] : result.results.rows;
      },
    } as D1PreparedStatement;
    prepared.set(item, statement);
    return item;
  }
  return {
    prepare,
    batch: async (items: D1PreparedStatement[]) => {
      const statements = items.map((item) => { const statement = prepared.get(item); if (!statement) throw new Error('Unknown D1 statement'); return statement; });
      return devRemote<D1Result<Record<string, unknown>>[]>(url, { operation: 'd1', mode: 'query', statements });
    },
    exec: async () => { throw new Error('Use bun run db:migrate for schema changes'); },
    dump: async () => { throw new Error('Use Wrangler for database exports'); },
    withSession: () => { throw new Error('D1 sessions are not used by this development adapter'); },
  } as D1Database;
}
