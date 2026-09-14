import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, primaryKey, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable('accounts', {
  id: text().primaryKey().$defaultFn(createId),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp_ms' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp_ms' }),
  scope: text(),
  password: text(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const comments = sqliteTable('comments', {
  id: text().primaryKey().$defaultFn(createId),
  postId: text('post_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parentId: text('parent_id'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  content: text().notNull(),
});

export const postTags = sqliteTable(
  'post_tags',
  {
    postId: text('post_id')
      .notNull()
      .references(() => posts.id),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id),
  },
  (table) => [primaryKey({ columns: [table.postId, table.tagId], name: 'post_tags_pkey' })],
);

export const posts = sqliteTable(
  'posts',
  {
    id: text().primaryKey().$defaultFn(createId),
    title: text(),
    description: text(),
    summary: text(),
    banner: text(),
    published: integer({ mode: 'boolean' }).default(false),
    htmlContent: text('html_content'),
    textContent: text('text_content'),
    jsonContent: text('json_content', { mode: 'json' }),
    slug: text(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(unixepoch() * 1000)`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(unixepoch() * 1000)`)
      .notNull(),
  },
  (table) => [uniqueIndex('posts_slug_unique').on(table.slug)],
);

export const sessions = sqliteTable(
  'sessions',
  {
    id: text().primaryKey(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    token: text().notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    impersonatedBy: text('impersonated_by'),
  },
  (table) => [uniqueIndex('sessions_token_unique').on(table.token)],
);

export const tags = sqliteTable(
  'tags',
  {
    id: text().primaryKey(),
    name: text().notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(unixepoch() * 1000)`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [uniqueIndex('tags_name_unique').on(table.name)],
);

export const users = sqliteTable(
  'users',
  {
    id: text().primaryKey(),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
    image: text(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
    banExpires: integer('ban_expires', { mode: 'timestamp_ms' }),
    banReason: text('ban_reason'),
    banned: integer({ mode: 'boolean' }).default(false),
    role: text(),
  },
  (table) => [uniqueIndex('users_email_unique').on(table.email)],
);

export const verifications = sqliteTable('verifications', {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
});
