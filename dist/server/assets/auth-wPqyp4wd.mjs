import { c as createServerRpc } from "./createServerRpc-CRIxACHR.mjs";
import { a as auth } from "./auth-BaGll2Xr.mjs";
import { e as createServerFn, g as getRequestHeaders } from "../server.mjs";
import "drizzle-orm";
import "zod";
import "./db-a0rvcoi6.mjs";
import "drizzle-orm/node-postgres";
import "@paralleldrive/cuid2";
import "drizzle-orm/pg-core";
import "@t3-oss/env-core";
import "zod/v4-mini";
import "node:async_hooks";
import "node:stream";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "@tanstack/react-router";
const getSessionServerFn_createServerFn_handler = createServerRpc(
  {
    id: "d34b813c0f18d135c36bb2d9e67c184fdf92f0f8baa83e302195da0bfaaaa07b",
    name: "getSessionServerFn",
    filename: "src/server-fns/auth.ts",
  },
  (opts) => getSessionServerFn.__executeServer(opts),
);
const getSessionServerFn = createServerFn({
  method: "GET",
}).handler(getSessionServerFn_createServerFn_handler, async () => {
  return auth.api.getSession({
    headers: getRequestHeaders(),
  });
});
export { getSessionServerFn_createServerFn_handler };
