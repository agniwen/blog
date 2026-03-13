import { j as s, L as a, R as i } from "./main-Cq61YlVT.js";
import { I as t } from "./iconify-VgZ200O7.js";
import { B as e } from "./button-DCFLH-17.js";
import { P as m } from "./page-container-CScIFj6H.js";
import { P as n } from "./post-card-BL_fUURl.js";
import "./utils-8lG47UID.js";
import "./is-ref-object-f5CSWQ4m.js";
import "./useRender-Bb_d4GQb.js";
import "./dayjs-DguT4X4p.js";
function l({ posts: o }) {
  return s.jsx("div", {
    className: "grid md:grid-cols-2 grid-cols-1 gap-4 px-4",
    children: o.map((r) =>
      s.jsx(
        a,
        {
          to: "/blog/$id",
          params: { id: r.id },
          className: "block cursor-default",
          children: s.jsx(n, { post: r, showMeta: !1 }),
        },
        r.id,
      ),
    ),
  });
}
function P() {
  const { posts: o } = i.useLoaderData();
  return s.jsxs(m, {
    className: "pt-12 pb-8 max-w-2xl mx-auto",
    children: [
      s.jsx("div", {
        className: "px-4 mb-8",
        children: s.jsx(a, {
          to: "/",
          children: s.jsx(e, {
            size: "icon",
            variant: "secondary",
            className: "rounded-full text-xl",
            children: s.jsx(t, { icon: "ri:arrow-left-line" }),
          }),
        }),
      }),
      s.jsx(l, { posts: o }),
    ],
  });
}
export { P as component };
