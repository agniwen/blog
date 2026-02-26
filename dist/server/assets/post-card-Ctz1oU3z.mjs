import { jsxs, jsx } from "react/jsx-runtime";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import { c as cn } from "./utils-H80jjgLf.mjs";
import "./dayjs-Bfb-Qhhu.mjs";
import dayjs from "dayjs";
const badgeVariants = cva(
  "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive: "bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground bg-input/30",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant = "default",
  render,
  ...props
}) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps(
      {
        className: cn(badgeVariants({ className, variant }))
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant
    }
  });
}
function PostCard(props) {
  const { post, className, showMeta = true } = props;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("rounded-xl border shadow-xs overflow-hidden hover:opacity-90 flex flex-col", className),
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full ", children: /* @__PURE__ */ jsx("img", { className: "w-full h-full min-h-32 md:max-h-48 aspect-video object-fill", src: post.banner || "", alt: "" }) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-background p-2 flex-1 select-none", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", children: post.title || "Untitled" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs mb-2 sm:line-clamp-2 lg:line-clamp-2", children: post.description || "No description available" }),
          showMeta && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Badge, { className: "uppercase", variant: "outline", children: post.published ? "Published" : "Draft" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs opacity-50", children: dayjs(post.createdAt).format("YYYY-MM-DD") })
          ] })
        ] })
      ]
    }
  );
}
export {
  PostCard as P
};
