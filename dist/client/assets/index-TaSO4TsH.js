import { r, j as t, L as J, t as q, u as Z, a as ee } from "./main-Cq61YlVT.js";
import {
  u as te,
  D as oe,
  a as re,
  b as ae,
  c as ne,
  d as se,
  e as ie,
  f as le,
  g as ce,
  h as de,
  C as ue,
  M as fe,
  i as ge,
  j as pe,
  k as xe,
  p as me,
  s as he,
  l as ve,
  m as ye,
  n as je,
  o as Ce,
  q as be,
  r as F,
  t as U,
  S as Re,
  A as we,
} from "./studio-shell-CUrvf9zZ.js";
import { u as Pe } from "./useQuery-BG577FP4.js";
import { P as ke } from "./post-card-BL_fUURl.js";
import { c as Me, B } from "./button-DCFLH-17.js";
import { u as De, c as v, a as Oe } from "./utils-8lG47UID.js";
import { u as Ee, g as $, c as _ } from "./element-CMmi1D3q.js";
import { o as X, c as Y, b as Te, t as Ne } from "./auth-client-BbRWIRUF.js";
import { u as G } from "./scroll-area-UjqO8AyE.js";
import "./useRender-Bb_d4GQb.js";
import "./dayjs-DguT4X4p.js";
import "./env-hDWImd5Y.js";
const Se = [
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
    ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
    ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
    ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }],
  ],
  ze = Me("trash-2", Se);
var b = function () {
  return (
    (b =
      Object.assign ||
      function (o) {
        for (var a, n = 1, i = arguments.length; n < i; n++) {
          a = arguments[n];
          for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && (o[c] = a[c]);
        }
        return o;
      }),
    b.apply(this, arguments)
  );
};
function Ie(e, o) {
  var a = {};
  for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && o.indexOf(n) < 0 && (a[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, n = Object.getOwnPropertySymbols(e); i < n.length; i++)
      o.indexOf(n[i]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, n[i]) &&
        (a[n[i]] = e[n[i]]);
  return a;
}
var Ae = function (e) {
    var o = e.animate,
      a = o === void 0 ? !0 : o,
      n = e.backgroundColor,
      i = n === void 0 ? "#f5f6f7" : n,
      c = e.backgroundOpacity,
      y = c === void 0 ? 1 : c,
      p = e.baseUrl,
      g = p === void 0 ? "" : p,
      x = e.children,
      l = e.foregroundColor,
      m = l === void 0 ? "#eee" : l,
      u = e.foregroundOpacity,
      O = u === void 0 ? 1 : u,
      R = e.gradientRatio,
      N = R === void 0 ? 2 : R,
      w = e.uniqueKey,
      P = e.rtl,
      j = P === void 0 ? !1 : P,
      k = e.speed,
      S = k === void 0 ? 1.2 : k,
      M = e.style,
      z = M === void 0 ? {} : M,
      I = e.title,
      A = I === void 0 ? "Loading..." : I,
      L = e.beforeMask,
      E = L === void 0 ? null : L,
      V = Ie(e, [
        "animate",
        "backgroundColor",
        "backgroundOpacity",
        "baseUrl",
        "children",
        "foregroundColor",
        "foregroundOpacity",
        "gradientRatio",
        "uniqueKey",
        "rtl",
        "speed",
        "style",
        "title",
        "beforeMask",
      ]),
      T = r.useId();
    w && (T = w);
    var s = "".concat(T, "-diff"),
      d = "".concat(T, "-animated-diff"),
      f = "".concat(T, "-aria"),
      h = j ? { transform: "scaleX(-1)" } : null,
      D = "".concat(S, "s"),
      K = "".concat(N * -1, " 0"),
      H = "".concat(N, " 0");
    return r.createElement(
      "svg",
      b({ "aria-labelledby": f, role: "img", style: b(b({}, z), h) }, V),
      A ? r.createElement("title", { id: f }, A) : null,
      E && r.isValidElement(E) ? E : null,
      r.createElement("rect", {
        role: "presentation",
        x: "0",
        y: "0",
        width: "100%",
        height: "100%",
        clipPath: "url(".concat(g, "#").concat(s, ")"),
        style: { fill: "url(".concat(g, "#").concat(d, ")") },
      }),
      r.createElement(
        "defs",
        null,
        r.createElement("clipPath", { id: s }, x),
        r.createElement(
          "linearGradient",
          { id: d, gradientTransform: "translate(".concat(K, ")") },
          r.createElement("stop", { offset: "0%", stopColor: i, stopOpacity: y }),
          r.createElement("stop", { offset: "50%", stopColor: m, stopOpacity: O }),
          r.createElement("stop", { offset: "100%", stopColor: i, stopOpacity: y }),
          a &&
            r.createElement("animateTransform", {
              attributeName: "gradientTransform",
              type: "translate",
              values: "".concat(K, "; 0 0; ").concat(H),
              dur: D,
              repeatCount: "indefinite",
            }),
        ),
      ),
    );
  },
  W = function (e) {
    return e.children ? r.createElement(Ae, b({}, e)) : r.createElement(Le, b({}, e));
  },
  Le = function (e) {
    return r.createElement(
      W,
      b({ viewBox: "0 0 476 124" }, e),
      r.createElement("rect", { x: "48", y: "8", width: "88", height: "6", rx: "3" }),
      r.createElement("rect", { x: "48", y: "26", width: "52", height: "6", rx: "3" }),
      r.createElement("rect", { x: "0", y: "56", width: "410", height: "6", rx: "3" }),
      r.createElement("rect", { x: "0", y: "72", width: "380", height: "6", rx: "3" }),
      r.createElement("rect", { x: "0", y: "88", width: "178", height: "6", rx: "3" }),
      r.createElement("circle", { cx: "20", cy: "20", r: "20" }),
    );
  };
function _e(e) {
  const {
      children: o,
      open: a,
      defaultOpen: n = !1,
      onOpenChange: i,
      onOpenChangeComplete: c,
      actionsRef: y,
      handle: p,
      triggerId: g,
      defaultTriggerId: x = null,
    } = e,
    l = te(),
    m = !!l,
    u = De(
      () =>
        p?.store ??
        new oe({
          open: n,
          openProp: a,
          activeTriggerId: x,
          triggerIdProp: g,
          modal: !0,
          disablePointerDismissal: !0,
          nested: m,
          role: "alertdialog",
        }),
    ).current;
  (u.useControlledProp("openProp", a),
    u.useControlledProp("triggerIdProp", g),
    u.useSyncedValue("nested", m),
    u.useContextCallback("onOpenChange", i),
    u.useContextCallback("onOpenChangeComplete", c));
  const O = u.useState("payload");
  re({ store: u, actionsRef: y, parentContext: l?.store.context });
  const R = r.useMemo(() => ({ store: u }), [u]);
  return t.jsx(ae.Provider, { value: R, children: typeof o == "function" ? o({ payload: O }) : o });
}
function Be({ ...e }) {
  return t.jsx(_e, { "data-slot": "alert-dialog", ...e });
}
function qe({ ...e }) {
  return t.jsx(ce, { "data-slot": "alert-dialog-portal", ...e });
}
function Fe({ className: e, ...o }) {
  return t.jsx(de, {
    "data-slot": "alert-dialog-overlay",
    className: v(
      "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/80 duration-100 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 isolate z-50",
      e,
    ),
    ...o,
  });
}
function Ue({ className: e, size: o = "default", ...a }) {
  return t.jsxs(qe, {
    children: [
      t.jsx(Fe, {}),
      t.jsx(ne, {
        "data-slot": "alert-dialog-content",
        "data-size": o,
        className: v(
          "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 bg-background ring-foreground/5 gap-6 rounded-4xl p-6 ring-1 duration-100 data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-md group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 outline-none",
          e,
        ),
        ...a,
      }),
    ],
  });
}
function Ve({ className: e, ...o }) {
  return t.jsx("div", {
    "data-slot": "alert-dialog-header",
    className: v(
      "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
      e,
    ),
    ...o,
  });
}
function Ke({ className: e, ...o }) {
  return t.jsx("div", {
    "data-slot": "alert-dialog-footer",
    className: v(
      "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
      e,
    ),
    ...o,
  });
}
function $e({ className: e, ...o }) {
  return t.jsx(se, {
    "data-slot": "alert-dialog-title",
    className: v(
      "text-lg font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
      e,
    ),
    ...o,
  });
}
function Xe({ className: e, ...o }) {
  return t.jsx(ie, {
    "data-slot": "alert-dialog-description",
    className: v(
      "text-muted-foreground *:[a]:hover:text-foreground text-sm text-balance md:text-pretty *:[a]:underline *:[a]:underline-offset-3",
      e,
    ),
    ...o,
  });
}
function Ye({ className: e, variant: o = "outline", size: a = "default", ...n }) {
  return t.jsx(le, {
    "data-slot": "alert-dialog-cancel",
    className: v(e),
    render: t.jsx(B, { variant: o, size: a }),
    ...n,
  });
}
function Ge(e) {
  const [o, a] = r.useState({
      getBoundingClientRect() {
        return DOMRect.fromRect({ width: 0, height: 0, x: 0, y: 0 });
      },
    }),
    n = r.useRef(null),
    i = r.useRef(null),
    c = r.useRef(null),
    y = r.useRef(null),
    p = r.useRef(!0),
    g = r.useRef(null),
    x = Ee(),
    l = r.useMemo(
      () => ({
        anchor: o,
        setAnchor: a,
        actionsRef: c,
        backdropRef: n,
        internalBackdropRef: i,
        positionerRef: y,
        allowMouseUpTriggerRef: p,
        initialCursorPointRef: g,
        rootId: x,
      }),
      [o, x],
    );
  return t.jsx(ue.Provider, {
    value: l,
    children: t.jsx(fe.Provider, { value: void 0, children: t.jsx(ge, { ...e }) }),
  });
}
const Q = 500,
  Qe = r.forwardRef(function (o, a) {
    const { render: n, className: i, ...c } = o,
      {
        setAnchor: y,
        actionsRef: p,
        internalBackdropRef: g,
        backdropRef: x,
        positionerRef: l,
        allowMouseUpTriggerRef: m,
        initialCursorPointRef: u,
        rootId: O,
      } = pe(!1),
      { store: R } = xe(!1),
      N = R.useState("open"),
      w = R.useState("disabled"),
      P = r.useRef(null),
      j = r.useRef(null),
      k = G(),
      S = G(),
      M = r.useRef(!1);
    function z(s, d, f) {
      const h = f.type.startsWith("touch");
      ((u.current = { x: s, y: d }),
        y({
          getBoundingClientRect() {
            return DOMRect.fromRect({ width: h ? 10 : 0, height: h ? 10 : 0, x: s, y: d });
          },
        }),
        (M.current = !1),
        p.current?.setOpen(!0, Y(Ne, f)),
        S.start(Q, () => {
          M.current = !0;
        }));
    }
    function I(s) {
      if (w) return;
      ((m.current = !0),
        he(s),
        z(s.clientX, s.clientY, s.nativeEvent),
        X(P.current).addEventListener(
          "mouseup",
          (f) => {
            if (((m.current = !1), !M.current)) return;
            (S.clear(), (M.current = !1));
            const h = $(f);
            _(l.current, h) || (O && h && ve(h) === O) || p.current?.setOpen(!1, Y(Te, f));
          },
          { once: !0 },
        ));
    }
    function A(s) {
      if (!w && ((m.current = !1), s.touches.length === 1)) {
        s.stopPropagation();
        const d = s.touches[0];
        ((j.current = { x: d.clientX, y: d.clientY }),
          k.start(Q, () => {
            j.current && z(j.current.x, j.current.y, s.nativeEvent);
          }));
      }
    }
    function L(s) {
      if (k.isStarted() && j.current && s.touches.length === 1) {
        const d = s.touches[0],
          f = 10,
          h = Math.abs(d.clientX - j.current.x),
          D = Math.abs(d.clientY - j.current.y);
        (h > f || D > f) && k.clear();
      }
    }
    function E() {
      (k.clear(), (j.current = null));
    }
    return (
      r.useEffect(() => {
        function s(f) {
          if (w) return;
          const D = $(f);
          (_(P.current, D) || _(g.current, D) || _(x.current, D)) && f.preventDefault();
        }
        const d = X(P.current);
        return (
          d.addEventListener("contextmenu", s),
          () => {
            d.removeEventListener("contextmenu", s);
          }
        );
      }, [x, w, g]),
      Oe("div", o, {
        state: { open: N },
        ref: [P, a],
        props: [
          {
            onContextMenu: I,
            onTouchStart: A,
            onTouchMove: L,
            onTouchEnd: E,
            onTouchCancel: E,
            style: { WebkitTouchCallout: "none" },
          },
          c,
        ],
        stateAttributesMapping: me,
      })
    );
  });
function We({ ...e }) {
  return t.jsx(Ge, { "data-slot": "context-menu", ...e });
}
function He({ className: e, ...o }) {
  return t.jsx(Qe, { "data-slot": "context-menu-trigger", className: v("select-none", e), ...o });
}
function Je({
  className: e,
  align: o = "start",
  alignOffset: a = 4,
  side: n = "right",
  sideOffset: i = 0,
  ...c
}) {
  return t.jsx(ye, {
    children: t.jsx(je, {
      className: "isolate z-50 outline-none",
      align: o,
      alignOffset: a,
      side: n,
      sideOffset: i,
      children: t.jsx(Ce, {
        "data-slot": "context-menu-content",
        className: v(
          "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/5 bg-popover text-popover-foreground min-w-48 rounded-2xl p-1 shadow-2xl ring-1 duration-100 dark z-50 max-h-(--available-height) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none",
          e,
        ),
        ...c,
      }),
    }),
  });
}
function Ze({ className: e, inset: o, variant: a = "default", ...n }) {
  return t.jsx(be, {
    "data-slot": "context-menu-item",
    "data-inset": o,
    "data-variant": a,
    className: v(
      "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive focus:*:[svg]:text-accent-foreground gap-2.5 rounded-xl px-3 py-2 text-sm [&_svg:not([class*='size-'])]:size-4 group/context-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      e,
    ),
    ...n,
  });
}
function C() {
  const e = r.useId();
  return t.jsxs(W, {
    uniqueKey: e,
    viewBox: "0 0 400 300",
    className: "w-full 2xl:max-w-xs",
    backgroundColor: "var(--secondary)",
    foregroundColor: "var(--background)",
    children: [
      t.jsx("rect", { x: "0", y: "0", rx: "8", ry: "8", width: "400", height: "200" }),
      t.jsx("rect", { x: "0", y: "215", rx: "4", ry: "4", width: "300", height: "16" }),
      t.jsx("rect", { x: "0", y: "240", rx: "4", ry: "4", width: "400", height: "12" }),
      t.jsx("rect", { x: "0", y: "260", rx: "4", ry: "4", width: "400", height: "12" }),
      t.jsx("rect", { x: "0", y: "280", rx: "4", ry: "4", width: "200", height: "10" }),
    ],
  });
}
function et() {
  return t.jsx("div", {
    className: "posts pb-4",
    children: t.jsxs("div", {
      className:
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:flex 2xl:flex-wrap gap-4",
      children: [
        t.jsx(C, {}),
        t.jsx(C, {}),
        t.jsx(C, {}),
        t.jsx(C, {}),
        t.jsx(C, {}),
        t.jsx(C, {}),
        t.jsx(C, {}),
        t.jsx(C, {}),
      ],
    }),
  });
}
function tt() {
  const [e, o] = r.useState(null),
    [a, n] = r.useState(!1),
    {
      data: i,
      isLoading: c,
      isFetching: y,
      refetch: p,
    } = Pe({
      queryFn() {
        return F(U.api.posts.$get());
      },
      queryKey: ["posts"],
    });
  async function g(l) {
    try {
      (await F(U.api.posts[":id"].$delete({ param: { id: l } }))).data.id &&
        (q.success("Post deleted"), n(!1), p());
    } catch (m) {
      (console.error("Failed to delete post", m), q.error("Failed to delete post"));
    } finally {
      o(null);
    }
  }
  function x(l) {
    (o(l), n(!0));
  }
  return c
    ? t.jsx(et, {})
    : t.jsxs(t.Fragment, {
        children: [
          t.jsx("div", {
            className: "posts pb-4",
            children: t.jsx("div", {
              className: v(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:flex 2xl:flex-wrap gap-4",
                y && "opacity-80",
              ),
              children: i?.data.map((l) =>
                t.jsxs(
                  We,
                  {
                    children: [
                      t.jsx(He, {
                        render: t.jsx(J, {
                          to: "/studio/posts/upsert/$id",
                          params: { id: l.id },
                          className: "block 2xl:w-xs",
                          children: t.jsx(ke, { className: "h-full", post: l }),
                        }),
                      }),
                      t.jsx(Je, {
                        children: t.jsxs(Ze, {
                          onClick: () => x(l.id),
                          children: [t.jsx(ze, {}), "Delete"],
                        }),
                      }),
                    ],
                  },
                  l.id,
                ),
              ),
            }),
          }),
          t.jsx(Be, {
            open: a,
            onOpenChange: n,
            children: t.jsxs(Ue, {
              children: [
                t.jsxs(Ve, {
                  children: [
                    t.jsx($e, { children: "Are you sure?" }),
                    t.jsx(Xe, {
                      children:
                        "This action cannot be undone. This will permanently delete the post.",
                    }),
                  ],
                }),
                t.jsxs(Ke, {
                  children: [
                    t.jsx(Ye, { children: "Cancel" }),
                    t.jsx(B, { onClick: () => e && g(e), children: "Delete" }),
                  ],
                }),
              ],
            }),
          }),
        ],
      });
}
function ot() {
  const e = Z();
  async function o() {
    try {
      const a = await F(U.api.posts.$post({ json: {} }));
      a.data.id && e({ to: "/studio/posts/upsert/$id", params: { id: a.data.id } });
    } catch (a) {
      (console.error("Failed to create post", a), q.error("Failed to create post"));
    }
  }
  return t.jsx(B, { onClick: o, children: "New Post" });
}
function rt() {
  const e = ee();
  async function o() {
    return e.invalidateQueries({ queryKey: ["posts"] });
  }
  return t.jsx(B, { onClick: o, variant: "secondary", children: "Refresh" });
}
function mt() {
  return t.jsx(Re, {
    children: t.jsxs(we, {
      className: "space-y-4",
      children: [
        t.jsxs("div", { className: "flex gap-4", children: [t.jsx(ot, {}), t.jsx(rt, {})] }),
        t.jsx(tt, {}),
      ],
    }),
  });
}
export { mt as component };
