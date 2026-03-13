import { jsxs, jsx } from "react/jsx-runtime";
import { ScrollArea as ScrollArea$1 } from "@base-ui/react/scroll-area";
import { c as cn } from "./utils-H80jjgLf.mjs";
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    ScrollArea$1.Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          ScrollArea$1.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsx(ScrollBar, {}),
        /* @__PURE__ */ jsx(ScrollArea$1.Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    ScrollArea$1.Scrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      "data-orientation": orientation,
      orientation,
      className: "data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent flex touch-none p-px transition-colors select-none",
      ...props,
      children: /* @__PURE__ */ jsx(
        ScrollArea$1.Thumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "rounded-full bg-border relative flex-1"
        }
      )
    }
  );
}
export {
  ScrollArea as S
};
