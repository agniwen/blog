import { r, j as v } from "./main-Cq61YlVT.js";
import { c as k } from "./utils-8lG47UID.js";
import {
  ak as j,
  a1 as A,
  D as R,
  al as $,
  T as B,
  _,
  $ as z,
  ah as p,
  P as T,
  ad as U,
  am as q,
  a3 as X,
  A as Y,
  U as Z,
  Z as J,
  ag as I,
  aj as K,
  E as Q,
  ai as tt,
  af as et,
  L as nt,
  an as ot,
} from "./is-ref-object-f5CSWQ4m.js";
function at(t) {
  const e = r.useRef(null);
  return (e.current === null && (e.current = t()), e.current);
}
const F = typeof window < "u",
  it = F ? r.useLayoutEffect : r.useEffect,
  D = r.createContext({ transformPagePoint: (t) => t, isStatic: !1, reducedMotion: "never" }),
  rt = new Set([
    "animate",
    "exit",
    "variants",
    "initial",
    "style",
    "values",
    "variants",
    "transition",
    "transformTemplate",
    "custom",
    "inherit",
    "onBeforeLayoutMeasure",
    "onAnimationStart",
    "onAnimationComplete",
    "onUpdate",
    "onDragStart",
    "onDrag",
    "onDragEnd",
    "onMeasureDragConstraints",
    "onDirectionLock",
    "onDragTransitionEnd",
    "_dragX",
    "_dragY",
    "onHoverStart",
    "onHoverEnd",
    "onViewportEnter",
    "onViewportLeave",
    "globalTapTarget",
    "propagate",
    "ignoreStrict",
    "viewport",
  ]);
function h(t) {
  return (
    t.startsWith("while") ||
    (t.startsWith("drag") && t !== "draggable") ||
    t.startsWith("layout") ||
    t.startsWith("onTap") ||
    t.startsWith("onPan") ||
    t.startsWith("onLayout") ||
    rt.has(t)
  );
}
let E = (t) => !h(t);
function st(t) {
  typeof t == "function" && (E = (e) => (e.startsWith("on") ? !h(e) : t(e)));
}
try {
  st(require("@emotion/is-prop-valid").default);
} catch {}
function ut(t, e, n) {
  const o = {};
  for (const a in t)
    (a === "values" && typeof t.values == "object") ||
      ((E(a) || (n === !0 && h(a)) || (!e && !h(a)) || (t.draggable && a.startsWith("onDrag"))) &&
        (o[a] = t[a]));
  return o;
}
const V = r.createContext({});
function ct(t, e) {
  if (j(t)) {
    const { initial: n, animate: o } = t;
    return { initial: n === !1 || A(n) ? n : void 0, animate: A(o) ? o : void 0 };
  }
  return t.inherit !== !1 ? e : {};
}
function lt(t) {
  const { initial: e, animate: n } = ct(t, r.useContext(V));
  return r.useMemo(() => ({ initial: e, animate: n }), [L(e), L(n)]);
}
function L(t) {
  return Array.isArray(t) ? t.join(" ") : t;
}
const b = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} });
function G(t, e, n) {
  for (const o in e) !R(e[o]) && !$(o, n) && (t[o] = e[o]);
}
function ft({ transformTemplate: t }, e) {
  return r.useMemo(() => {
    const n = b();
    return (B(n, e, t), Object.assign({}, n.vars, n.style));
  }, [e]);
}
function dt(t, e) {
  const n = t.style || {},
    o = {};
  return (G(o, n, t), Object.assign(o, ft(t, e)), o);
}
function mt(t, e) {
  const n = {},
    o = dt(t, e);
  return (
    t.drag &&
      t.dragListener !== !1 &&
      ((n.draggable = !1),
      (o.userSelect = o.WebkitUserSelect = o.WebkitTouchCallout = "none"),
      (o.touchAction = t.drag === !0 ? "none" : `pan-${t.drag === "x" ? "y" : "x"}`)),
    t.tabIndex === void 0 && (t.onTap || t.onTapStart || t.whileTap) && (n.tabIndex = 0),
    (n.style = o),
    n
  );
}
const H = () => ({ ...b(), attrs: {} });
function yt(t, e, n, o) {
  const a = r.useMemo(() => {
    const i = H();
    return (_(i, e, z(o), t.transformTemplate, t.style), { ...i.attrs, style: { ...i.style } });
  }, [e]);
  if (t.style) {
    const i = {};
    (G(i, t.style, t), (a.style = { ...i, ...a.style }));
  }
  return a;
}
function gt(t, e, n, { latestValues: o }, a, i = !1, s) {
  const m = ((s ?? p(t)) ? yt : mt)(e, o, a, t),
    d = ut(e, typeof t == "string", i),
    y = t !== r.Fragment ? { ...d, ...m, ref: n } : {},
    { children: l } = e,
    c = r.useMemo(() => (R(l) ? l.get() : l), [l]);
  return r.createElement(t, { ...y, children: c });
}
function Mt({ scrapeMotionValuesFromProps: t, createRenderState: e }, n, o, a) {
  return { latestValues: Ct(n, o, a, t), renderState: e() };
}
function Ct(t, e, n, o) {
  const a = {},
    i = o(t, {});
  for (const c in i) a[c] = U(i[c]);
  let { initial: s, animate: f } = t;
  const m = j(t),
    d = q(t);
  e &&
    d &&
    !m &&
    t.inherit !== !1 &&
    (s === void 0 && (s = e.initial), f === void 0 && (f = e.animate));
  let y = n ? n.initial === !1 : !1;
  y = y || s === !1;
  const l = y ? f : s;
  if (l && typeof l != "boolean" && !X(l)) {
    const c = Array.isArray(l) ? l : [l];
    for (let g = 0; g < c.length; g++) {
      const u = Y(t, c[g]);
      if (u) {
        const { transitionEnd: C, transition: x, ...S } = u;
        for (const M in S) {
          let P = S[M];
          if (Array.isArray(P)) {
            const N = y ? P.length - 1 : 0;
            P = P[N];
          }
          P !== null && (a[M] = P);
        }
        for (const M in C) a[M] = C[M];
      }
    }
  }
  return a;
}
const O = (t) => (e, n) => {
    const o = r.useContext(V),
      a = r.useContext(T),
      i = () => Mt(t, e, o, a);
    return n ? i() : at(i);
  },
  St = O({ scrapeMotionValuesFromProps: Z, createRenderState: b }),
  xt = O({ scrapeMotionValuesFromProps: J, createRenderState: H }),
  Pt = Symbol.for("motionComponentSymbol");
function ht(t, e, n) {
  const o = r.useRef(n);
  r.useInsertionEffect(() => {
    o.current = n;
  });
  const a = r.useRef(null);
  return r.useCallback(
    (i) => {
      (i && t.onMount?.(i), e && (i ? e.mount(i) : e.unmount()));
      const s = o.current;
      if (typeof s == "function")
        if (i) {
          const f = s(i);
          typeof f == "function" && (a.current = f);
        } else a.current ? (a.current(), (a.current = null)) : s(i);
      else s && (s.current = i);
    },
    [e],
  );
}
function Vt(t, e, n, o, a, i) {
  const { visualElement: s } = r.useContext(V),
    f = r.useContext(I),
    m = r.useContext(T),
    d = r.useContext(D),
    y = d.reducedMotion,
    l = d.skipAnimations,
    c = r.useRef(null),
    g = r.useRef(!1);
  ((o = o || f.renderer),
    !c.current &&
      o &&
      ((c.current = o(t, {
        visualState: e,
        parent: s,
        props: n,
        presenceContext: m,
        blockInitialAnimation: m ? m.initial === !1 : !1,
        reducedMotionConfig: y,
        skipAnimations: l,
        isSVG: i,
      })),
      g.current && c.current && (c.current.manuallyAnimateOnMount = !0)));
  const u = c.current,
    C = r.useContext(K);
  u && !u.projection && a && (u.type === "html" || u.type === "svg") && wt(c.current, n, a, C);
  const x = r.useRef(!1);
  r.useInsertionEffect(() => {
    u && x.current && u.update(n, m);
  });
  const S = n[Q],
    M = r.useRef(
      !!S && !window.MotionHandoffIsComplete?.(S) && window.MotionHasOptimisedAnimation?.(S),
    );
  return (
    it(() => {
      ((g.current = !0),
        u &&
          ((x.current = !0),
          (window.MotionIsMounted = !0),
          u.updateFeatures(),
          u.scheduleRenderMicrotask(),
          M.current && u.animationState && u.animationState.animateChanges()));
    }),
    r.useEffect(() => {
      u &&
        (!M.current && u.animationState && u.animationState.animateChanges(),
        M.current &&
          (queueMicrotask(() => {
            window.MotionHandoffMarkAsComplete?.(S);
          }),
          (M.current = !1)),
        (u.enteringChildren = void 0));
    }),
    u
  );
}
function wt(t, e, n, o) {
  const {
    layoutId: a,
    layout: i,
    drag: s,
    dragConstraints: f,
    layoutScroll: m,
    layoutRoot: d,
    layoutCrossfade: y,
  } = e;
  ((t.projection = new n(t.latestValues, e["data-framer-portal-id"] ? void 0 : W(t.parent))),
    t.projection.setOptions({
      layoutId: a,
      layout: i,
      alwaysMeasureLayout: !!s || (f && tt(f)),
      visualElement: t,
      animationType: typeof i == "string" ? i : "both",
      initialPromotionConfig: o,
      crossfade: y,
      layoutScroll: m,
      layoutRoot: d,
    }));
}
function W(t) {
  if (t) return t.options.allowProjection !== !1 ? t.projection : W(t.parent);
}
function w(t, { forwardMotionProps: e = !1, type: n } = {}, o, a) {
  o && et(o);
  const i = n ? n === "svg" : p(t),
    s = i ? xt : St;
  function f(d, y) {
    let l;
    const c = { ...r.useContext(D), ...d, layoutId: vt(d) },
      { isStatic: g } = c,
      u = lt(d),
      C = s(d, g);
    if (!g && F) {
      bt();
      const x = At(c);
      ((l = x.MeasureLayout), (u.visualElement = Vt(t, C, c, a, x.ProjectionNode, i)));
    }
    return v.jsxs(V.Provider, {
      value: u,
      children: [
        l && u.visualElement ? v.jsx(l, { visualElement: u.visualElement, ...c }) : null,
        gt(t, d, ht(C, u.visualElement, y), C, g, e, i),
      ],
    });
  }
  f.displayName = `motion.${typeof t == "string" ? t : `create(${t.displayName ?? t.name ?? ""})`}`;
  const m = r.forwardRef(f);
  return ((m[Pt] = t), m);
}
function vt({ layoutId: t }) {
  const e = r.useContext(nt).id;
  return e && t !== void 0 ? e + "-" + t : t;
}
function bt(t, e) {
  r.useContext(I).strict;
}
function At(t) {
  const e = ot(),
    { drag: n, layout: o } = e;
  if (!n && !o) return {};
  const a = { ...n, ...o };
  return {
    MeasureLayout: n?.isEnabled(t) || o?.isEnabled(t) ? a.MeasureLayout : void 0,
    ProjectionNode: a.ProjectionNode,
  };
}
function Lt(t, e) {
  if (typeof Proxy > "u") return w;
  const n = new Map(),
    o = (i, s) => w(i, s, t, e),
    a = (i, s) => o(i, s);
  return new Proxy(a, {
    get: (i, s) => (s === "create" ? o : (n.has(s) || n.set(s, w(s, void 0, t, e)), n.get(s))),
  });
}
const jt = Lt();
function It({ children: t, className: e }) {
  return v.jsx(jt.div, {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    className: k("page-container", e),
    children: t,
  });
}
export { D as M, It as P, it as a, jt as m, at as u };
