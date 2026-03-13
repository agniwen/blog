import { jsx } from "react/jsx-runtime";
import { LazyMotion, domMax } from "motion/react";
function MotionProvider({ children }) {
  return /* @__PURE__ */ jsx(LazyMotion, { features: domMax, strict: true, children });
}
export { MotionProvider as M };
