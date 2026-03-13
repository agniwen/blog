import { c as createServerRpc } from "./createServerRpc-CRIxACHR.mjs";
import { z } from "zod";
import { d as db, c as comments } from "./db-a0rvcoi6.mjs";
import { a as auth } from "./auth-BaGll2Xr.mjs";
import { e as createServerFn, g as getRequestHeaders } from "../server.mjs";
import "drizzle-orm/node-postgres";
import "drizzle-orm";
import "@paralleldrive/cuid2";
import "drizzle-orm/pg-core";
import "@t3-oss/env-core";
import "zod/v4-mini";
import "node:async_hooks";
import "node:stream";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "@tanstack/react-router";
const getCommentsServerFn_createServerFn_handler = createServerRpc(
  {
    id: "552b33777e12c1e63bf67a573af18ee971800506c1a4bd6a1a586b09541c55b0",
    name: "getCommentsServerFn",
    filename: "src/server-fns/comments.ts",
  },
  (opts) => getCommentsServerFn.__executeServer(opts),
);
const getCommentsServerFn = createServerFn({
  method: "GET",
})
  .inputValidator(
    z.object({
      postId: z.string(),
    }),
  )
  .handler(getCommentsServerFn_createServerFn_handler, async ({ data }) => {
    return db().query.comments.findMany({
      where: {
        postId: data.postId,
      },
      with: {
        user: true,
      },
    });
  });
const createCommentServerFn_createServerFn_handler = createServerRpc(
  {
    id: "4deedae7517058e5c3d7a96e9cc471958a98cbca0cf278ecb344624071b87c52",
    name: "createCommentServerFn",
    filename: "src/server-fns/comments.ts",
  },
  (opts) => createCommentServerFn.__executeServer(opts),
);
const createCommentServerFn = createServerFn({
  method: "POST",
})
  .inputValidator(
    z.object({
      postId: z.string(),
      content: z.string(),
    }),
  )
  .handler(createCommentServerFn_createServerFn_handler, async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    });
    if (!session) {
      throw new Error("Unauthorized");
    }
    const [comment] = await db()
      .insert(comments)
      .values({
        postId: data.postId,
        content: data.content,
        createdAt: /* @__PURE__ */ new Date(),
        userId: session.user.id,
      })
      .returning();
    return comment;
  });
export { createCommentServerFn_createServerFn_handler, getCommentsServerFn_createServerFn_handler };
