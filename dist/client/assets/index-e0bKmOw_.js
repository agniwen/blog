import { z as s, r as m, j as r } from "./main-Cq61YlVT.js";
import { S as a, A as n } from "./studio-shell-CUrvf9zZ.js";
import { e as c } from "./index-UGsZvMoO.js";
import { e as l } from "./env-hDWImd5Y.js";
import "./scroll-area-UjqO8AyE.js";
import "./utils-8lG47UID.js";
import "./element-CMmi1D3q.js";
import "./button-DCFLH-17.js";
import "./auth-client-BbRWIRUF.js";
import "./useRender-Bb_d4GQb.js";
const d = l.NEXT_PUBLIC_UMAMI_SHARE_URL;
function u() {
  const { theme: e, resolvedTheme: t } = s(),
    { src: o, isDark: i } = m.useMemo(
      () => ({ src: d, isDark: (e === "system" ? t : e) === "dark" }),
      [e, t],
    );
  return c()
    ? r.jsx("iframe", {
        title: "Umami Dashboard",
        src: o,
        className: "h-[calc(100vh-4rem)] w-full rounded-md",
        style: i ? { filter: "invert(1) hue-rotate(180deg)" } : void 0,
      })
    : null;
}
function T() {
  return r.jsx(a, { children: r.jsx(n, { children: r.jsx(u, {}) }) });
}
export { T as component };
