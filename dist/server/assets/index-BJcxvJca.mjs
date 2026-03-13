import { jsx, jsxs } from "react/jsx-runtime";
import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { B as Button } from "./button-IvqLSGSY.mjs";
import { P as PageContainer } from "./page-container-DVzgPATo.mjs";
import { P as PostCard } from "./post-card-Ctz1oU3z.mjs";
import { R as Route } from "./router-CV8uKWT2.mjs";
import "@base-ui/react/button";
import "class-variance-authority";
import "react";
import "./utils-H80jjgLf.mjs";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "motion/react";
import "@base-ui/react/merge-props";
import "@base-ui/react/use-render";
import "./dayjs-Bfb-Qhhu.mjs";
import "dayjs";
import "dayjs/plugin/relativeTime.js";
import "sonner";
import "@tanstack/react-query";
import "next-themes";
import "../server.mjs";
import "node:async_hooks";
import "node:stream";
import "@tanstack/react-router/ssr/server";
import "zod";
import "hono";
import "hono/cors";
import "./auth-BaGll2Xr.mjs";
import "drizzle-orm";
import "./db-a0rvcoi6.mjs";
import "drizzle-orm/node-postgres";
import "@paralleldrive/cuid2";
import "drizzle-orm/pg-core";
import "@t3-oss/env-core";
import "zod/v4-mini";
import "hono/factory";
import "@aws-sdk/client-s3";
import "@hono/zod-validator";
import "@aws-sdk/s3-request-presigner";
function PostList({ posts }) {
  return /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 grid-cols-1 gap-4 px-4", children: posts.map((post) => /* @__PURE__ */ jsx(Link, { to: "/blog/$id", params: { id: post.id }, className: "block cursor-default", children: /* @__PURE__ */ jsx(
    PostCard,
    {
      post,
      showMeta: false
    }
  ) }, post.id)) });
}
function BlogListPage() {
  const {
    posts
  } = Route.useLoaderData();
  return /* @__PURE__ */ jsxs(PageContainer, { className: "pt-12 pb-8 max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "px-4 mb-8", children: /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(Button, { size: "icon", variant: "secondary", className: "rounded-full text-xl", children: /* @__PURE__ */ jsx(Icon, { icon: "ri:arrow-left-line" }) }) }) }),
    /* @__PURE__ */ jsx(PostList, { posts })
  ] });
}
export {
  BlogListPage as component
};
