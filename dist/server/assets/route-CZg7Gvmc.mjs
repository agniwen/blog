import { jsxs, jsx } from "react/jsx-runtime";
import { Outlet } from "@tanstack/react-router";
import { M as MotionProvider } from "./motion-provider-DWbSmhQ1.mjs";
import { S as ScrollArea } from "./scroll-area-BzCNRtjT.mjs";
import "motion/react";
import "@base-ui/react/scroll-area";
import "./utils-H80jjgLf.mjs";
import "clsx";
import "tailwind-merge";
function BlogLayout() {
  return /* @__PURE__ */ jsxs(MotionProvider, { children: [
    /* @__PURE__ */ jsx("script", { src: "https://cloud.umami.is/script.js", "data-website-id": "db54fa9c-6564-4c24-a997-058b8012f7b7" }),
    /* @__PURE__ */ jsx(ScrollArea, { className: "h-screen", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
export {
  BlogLayout as component
};
