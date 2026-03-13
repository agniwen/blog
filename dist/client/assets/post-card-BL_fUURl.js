import { j as e } from "./main-Cq61YlVT.js";
import { a as n } from "./button-DCFLH-17.js";
import { m as o, c as i } from "./utils-8lG47UID.js";
import { u as d } from "./useRender-Bb_d4GQb.js";
import { d as l } from "./dayjs-DguT4X4p.js";
const c = n(
  "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground bg-input/30",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: { variant: "default" },
  },
);
function u({ className: t, variant: r = "default", render: a, ...s }) {
  return d({
    defaultTagName: "span",
    props: o({ className: i(c({ className: t, variant: r })) }, s),
    render: a,
    state: { slot: "badge", variant: r },
  });
}
function x(t) {
  const { post: r, className: a, showMeta: s = !0 } = t;
  return e.jsxs("div", {
    className: i("rounded-xl border shadow-xs overflow-hidden hover:opacity-90 flex flex-col", a),
    children: [
      e.jsx("div", {
        className: "w-full ",
        children: e.jsx("img", {
          className: "w-full h-full min-h-32 md:max-h-48 aspect-video object-fill",
          src: r.banner || "",
          alt: "",
        }),
      }),
      e.jsxs("div", {
        className: "bg-background p-2 flex-1 select-none",
        children: [
          e.jsx("h2", { className: "text-lg font-bold", children: r.title || "Untitled" }),
          e.jsx("p", {
            className: "text-xs mb-2 sm:line-clamp-2 lg:line-clamp-2",
            children: r.description || "No description available",
          }),
          s &&
            e.jsxs("div", {
              className: "flex items-center justify-between",
              children: [
                e.jsx(u, {
                  className: "uppercase",
                  variant: "outline",
                  children: r.published ? "Published" : "Draft",
                }),
                e.jsx("span", {
                  className: "text-xs opacity-50",
                  children: l(r.createdAt).format("YYYY-MM-DD"),
                }),
              ],
            }),
        ],
      }),
    ],
  });
}
export { x as P };
