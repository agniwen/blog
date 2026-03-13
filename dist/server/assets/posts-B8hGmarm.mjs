import { c as createServerRpc } from "./createServerRpc-CRIxACHR.mjs";
import { z } from "zod";
import { d as db } from "./db-a0rvcoi6.mjs";
import { e as createServerFn } from "../server.mjs";
import "drizzle-orm/node-postgres";
import "drizzle-orm";
import "@paralleldrive/cuid2";
import "drizzle-orm/pg-core";
import "node:async_hooks";
import "node:stream";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "@tanstack/react-router";
const getPublishedPostsServerFn_createServerFn_handler = createServerRpc(
  {
    id: "bb30a4188a05b4facb3163937ab48afc49025a8af1bf16b8b7fbafe07d39d1ed",
    name: "getPublishedPostsServerFn",
    filename: "src/server-fns/posts.ts",
  },
  (opts) => getPublishedPostsServerFn.__executeServer(opts),
);
const getPublishedPostsServerFn = createServerFn({
  method: "GET",
}).handler(getPublishedPostsServerFn_createServerFn_handler, async () => {
  const posts = await db().query.posts.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts.map((post) => ({
    ...post,
    jsonContent: post.jsonContent ?? {},
  }));
});
const getPublishedPostServerFn_createServerFn_handler = createServerRpc(
  {
    id: "11f6f2ea6dc0df5f8dca10bda1841334d6eaf9067b68c92f9e4104633e08aff5",
    name: "getPublishedPostServerFn",
    filename: "src/server-fns/posts.ts",
  },
  (opts) => getPublishedPostServerFn.__executeServer(opts),
);
const getPublishedPostServerFn = createServerFn({
  method: "GET",
})
  .inputValidator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(getPublishedPostServerFn_createServerFn_handler, async ({ data }) => {
    const post = await db().query.posts.findFirst({
      where: {
        id: data.id,
        published: true,
      },
    });
    if (!post) {
      return null;
    }
    return {
      ...post,
      jsonContent: post.jsonContent ?? {},
    };
  });
export {
  getPublishedPostServerFn_createServerFn_handler,
  getPublishedPostsServerFn_createServerFn_handler,
};
