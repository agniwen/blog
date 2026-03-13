import { jsx } from "react/jsx-runtime";
import { m } from "motion/react";
import { c as cn } from "./utils-H80jjgLf.mjs";
function PageContainer({ children, className }) {
  return /* @__PURE__ */ jsx(m.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: cn("page-container", className), children });
}
export {
  PageContainer as P
};
