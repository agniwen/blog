import { jsx } from "react/jsx-runtime";
import { S as StudioShell, A as AdminContainer } from "./studio-shell-XAoOk8iz.mjs";
import { useIsClient } from "foxact/use-is-client";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { f as env } from "./auth-BaGll2Xr.mjs";
import "@tiptap/pm/state";
import "hono/client";
import "./scroll-area-BzCNRtjT.mjs";
import "@base-ui/react/scroll-area";
import "./utils-H80jjgLf.mjs";
import "clsx";
import "tailwind-merge";
import "@base-ui/react/merge-props";
import "@base-ui/react/use-render";
import "class-variance-authority";
import "lucide-react";
import "./button-IvqLSGSY.mjs";
import "@base-ui/react/button";
import "@base-ui/react/dialog";
import "@base-ui/react/tooltip";
import "@tanstack/react-router";
import "@base-ui/react/avatar";
import "@base-ui/react/menu";
import "./auth-client-BQ73uQ-S.mjs";
import "drizzle-orm";
import "zod";
import "./db-a0rvcoi6.mjs";
import "drizzle-orm/node-postgres";
import "@paralleldrive/cuid2";
import "drizzle-orm/pg-core";
import "@t3-oss/env-core";
import "zod/v4-mini";
const umamiShareUrl = env.NEXT_PUBLIC_UMAMI_SHARE_URL;
function UmamiDashboard() {
  const { theme, resolvedTheme } = useTheme();
  const { src, isDark } = useMemo(() => {
    const activeTheme = theme === "system" ? resolvedTheme : theme;
    return {
      src: umamiShareUrl,
      isDark: activeTheme === "dark"
    };
  }, [theme, resolvedTheme]);
  const isClient = useIsClient();
  if (!isClient) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "iframe",
    {
      title: "Umami Dashboard",
      src,
      className: "h-[calc(100vh-4rem)] w-full rounded-md",
      style: isDark ? { filter: "invert(1) hue-rotate(180deg)" } : void 0
    }
  );
}
function StudioDashboardPage() {
  return /* @__PURE__ */ jsx(StudioShell, { children: /* @__PURE__ */ jsx(AdminContainer, { children: /* @__PURE__ */ jsx(UmamiDashboard, {}) }) });
}
export {
  StudioDashboardPage as component
};
