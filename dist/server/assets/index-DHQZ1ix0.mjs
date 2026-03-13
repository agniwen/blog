import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { AnimatePresence, m } from "motion/react";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { M as MotionProvider } from "./motion-provider-DWbSmhQ1.mjs";
import { B as Button } from "./button-IvqLSGSY.mjs";
import { P as PageContainer } from "./page-container-DVzgPATo.mjs";
import { S as ScrollArea } from "./scroll-area-BzCNRtjT.mjs";
import { f as env } from "./auth-BaGll2Xr.mjs";
import "clsx";
import "tailwind-merge";
import "@base-ui/react/button";
import "class-variance-authority";
import "react";
import "lucide-react";
import "@base-ui/react/scroll-area";
import "drizzle-orm";
import "zod";
import "./db-a0rvcoi6.mjs";
import "drizzle-orm/node-postgres";
import "@paralleldrive/cuid2";
import "drizzle-orm/pg-core";
import "@t3-oss/env-core";
import "zod/v4-mini";
const socials = [
  {
    name: "Twitter",
    url: "https://twitter.com/wenhouman",
    icon: /* @__PURE__ */ jsx(Icon, { className: "size-5", icon: "ri:twitter-x-fill" })
  },
  {
    name: "github",
    url: "https://github.com/agniwen",
    icon: /* @__PURE__ */ jsx(Icon, { className: "size-5", icon: "ri:github-line" })
  },
  {
    name: "bilibili",
    url: "https://space.bilibili.com/2940875",
    icon: /* @__PURE__ */ jsx(Icon, { className: "size-5", icon: "ri:bilibili-line" })
  },
  {
    name: "email",
    url: "mailto:wisakura@outlook.com",
    icon: /* @__PURE__ */ jsx(Icon, { className: "size-5", icon: "ri:mail-line" })
  }
];
function Social({ className }) {
  return /* @__PURE__ */ jsx("div", { className: cn("flex h-8 space-x-5", className), children: /* @__PURE__ */ jsx(AnimatePresence, { children: socials.map((s, index) => {
    return /* @__PURE__ */ jsx(
      m.div,
      {
        transition: { delay: index * 0.05 },
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        children: /* @__PURE__ */ jsx(
          "a",
          {
            href: s.url,
            target: "_blank",
            rel: "noreferrer",
            className: "inline-block p-2 cursor-default rounded-full transition-colors text-secondary-foreground hover:bg-secondary  ",
            children: s.icon
          }
        )
      },
      s.url
    );
  }) }) });
}
function HomePage() {
  return /* @__PURE__ */ jsxs(MotionProvider, { children: [
    /* @__PURE__ */ jsx("script", { src: "https://cloud.umami.is/script.js", "data-website-id": "db54fa9c-6564-4c24-a997-058b8012f7b7" }),
    /* @__PURE__ */ jsx(ScrollArea, { className: "h-screen", children: /* @__PURE__ */ jsx(PageContainer, { className: "home overflow-hidden container mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col w-full justify-center space-y-8 items-center", children: [
      /* @__PURE__ */ jsx("div", { className: "size-24 rounded-full bg-zinc-50", children: /* @__PURE__ */ jsx("img", { src: env.NEXT_PUBLIC_AVATAR_URL, className: "w-full shadow-xl object-contain shrink-0 pointer-events-none rounded-full", alt: "avatar" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl mb-4 text-gray-800", children: "Wen's Blog" }),
          /* @__PURE__ */ jsx("p", { className: "text-base max-w-xs text-balance text-gray-600", children: "I am a Node.js developer. Currently, I don't have more to introduce about myself." })
        ] }),
        /* @__PURE__ */ jsx(Social, {}),
        /* @__PURE__ */ jsx(Link, { to: "/blog", children: /* @__PURE__ */ jsx(Button, { size: "lg", variant: "secondary", className: "px-8 rounded-full", children: "Blog" }) })
      ] })
    ] }) }) })
  ] });
}
export {
  HomePage as component
};
