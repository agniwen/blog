import { drizzle as drizzle$1 } from "drizzle-orm/node-postgres";
import { sql, defineRelations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import {
  pgTable,
  timestamp,
  text,
  json,
  boolean,
  uniqueIndex,
  pgSchema,
  bigint,
  serial,
  primaryKey,
} from "drizzle-orm/pg-core";
const drizzle = pgSchema("drizzle");
const drizzleMigrationsInDrizzle = drizzle.table("__drizzle_migrations", {
  id: serial().primaryKey(),
  hash: text().notNull(),
  createdAt: bigint("created_at", { mode: "number" }),
});
const accounts = pgTable("accounts", {
  id: text().primaryKey().$defaultFn(createId),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text(),
  password: text(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
const comments = pgTable("comments", {
  id: text().primaryKey().$defaultFn(createId),
  postId: text("post_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  parentId: text("parent_id"),
  createdAt: timestamp("created_at").notNull(),
  content: text().notNull(),
});
const postTags = pgTable(
  "post_tags",
  {
    postId: text("post_id")
      .notNull()
      .references(() => posts.id),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id),
  },
  (table) => [primaryKey({ columns: [table.postId, table.tagId], name: "post_tags_pkey" })],
);
const posts = pgTable(
  "posts",
  {
    id: text().primaryKey().$defaultFn(createId),
    title: text(),
    description: text(),
    summary: text(),
    banner: text(),
    published: boolean().default(false),
    htmlContent: text("html_content"),
    textContent: text("text_content"),
    jsonContent: json("json_content"),
    slug: text(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [uniqueIndex("posts_slug_unique").using("btree", table.slug.asc().nullsLast())],
);
const sessions = pgTable(
  "sessions",
  {
    id: text().primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text().notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [uniqueIndex("sessions_token_unique").using("btree", table.token.asc().nullsLast())],
);
const tags = pgTable(
  "tags",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [uniqueIndex("tags_name_unique").using("btree", table.name.asc().nullsLast())],
);
const users = pgTable(
  "users",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: boolean("email_verified").notNull(),
    image: text(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    banExpires: timestamp("ban_expires"),
    banReason: text("ban_reason"),
    banned: boolean().default(false),
    role: text(),
  },
  (table) => [uniqueIndex("users_email_unique").using("btree", table.email.asc().nullsLast())],
);
const verifications = pgTable("verifications", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
const schema = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      accounts,
      comments,
      drizzle,
      drizzleMigrationsInDrizzle,
      postTags,
      posts,
      sessions,
      tags,
      users,
      verifications,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
const relations = defineRelations(schema, (r) => ({
  accounts: {
    user: r.one.users({
      from: r.accounts.userId,
      to: r.users.id,
    }),
  },
  users: {
    accounts: r.many.accounts(),
    comments: r.many.comments(),
    sessions: r.many.sessions(),
  },
  comments: {
    user: r.one.users({
      from: r.comments.userId,
      to: r.users.id,
    }),
  },
  posts: {
    tags: r.many.tags({
      from: r.posts.id.through(r.postTags.postId),
      to: r.tags.id.through(r.postTags.tagId),
    }),
  },
  tags: {
    posts: r.many.posts(),
  },
  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id,
    }),
  },
}));
let drizzleClient = null;
function db() {
  if (!drizzleClient) {
    drizzleClient = drizzle$1(process.env.DATABASE_URL, {
      schema,
      relations,
    });
  }
  return drizzleClient;
}
export { comments as c, db as d, posts as p };
