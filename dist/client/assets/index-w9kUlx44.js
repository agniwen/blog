import { r as o, j as t, L as H } from "./main-Cq61YlVT.js";
import { I as N } from "./iconify-VgZ200O7.js";
import { c as _ } from "./utils-8lG47UID.js";
import { P as U, L as W } from "./is-ref-object-f5CSWQ4m.js";
import { M as D, u as B, a as K, m as V, P as X } from "./page-container-CScIFj6H.js";
import { i as L, u as F, M as G } from "./motion-provider-CySFxYfk.js";
import { B as Y } from "./button-DCFLH-17.js";
import { S as q } from "./scroll-area-UjqO8AyE.js";
import { e as J } from "./env-hDWImd5Y.js";
import "./resolve-elements-DE4kZt9S.js";
import "./element-CMmi1D3q.js";
function $(e, s) {
  if (typeof e == "function") return e(s);
  e != null && (e.current = s);
}
function O(...e) {
  return (s) => {
    let n = !1;
    const i = e.map((u) => {
      const c = $(u, s);
      return (!n && typeof c == "function" && (n = !0), c);
    });
    if (n)
      return () => {
        for (let u = 0; u < i.length; u++) {
          const c = i[u];
          typeof c == "function" ? c() : $(e[u], null);
        }
      };
  };
}
function Q(...e) {
  return o.useCallback(O(...e), e);
}
class Z extends o.Component {
  getSnapshotBeforeUpdate(s) {
    const n = this.props.childRef.current;
    if (n && s.isPresent && !this.props.isPresent && this.props.pop !== !1) {
      const i = n.offsetParent,
        u = (L(i) && i.offsetWidth) || 0,
        c = (L(i) && i.offsetHeight) || 0,
        r = this.props.sizeRef.current;
      ((r.height = n.offsetHeight || 0),
        (r.width = n.offsetWidth || 0),
        (r.top = n.offsetTop),
        (r.left = n.offsetLeft),
        (r.right = u - r.width - r.left),
        (r.bottom = c - r.height - r.top));
    }
    return null;
  }
  componentDidUpdate() {}
  render() {
    return this.props.children;
  }
}
function ee({ children: e, isPresent: s, anchorX: n, anchorY: i, root: u, pop: c }) {
  const r = o.useId(),
    x = o.useRef(null),
    C = o.useRef({ width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 }),
    { nonce: y } = o.useContext(D),
    d = e.props?.ref ?? e?.ref,
    v = Q(x, d);
  return (
    o.useInsertionEffect(() => {
      const { width: a, height: m, top: h, left: g, right: j, bottom: w } = C.current;
      if (s || c === !1 || !x.current || !a || !m) return;
      const E = n === "left" ? `left: ${g}` : `right: ${j}`,
        z = i === "bottom" ? `bottom: ${w}` : `top: ${h}`;
      x.current.dataset.motionPopId = r;
      const f = document.createElement("style");
      y && (f.nonce = y);
      const b = u ?? document.head;
      return (
        b.appendChild(f),
        f.sheet &&
          f.sheet.insertRule(`
          [data-motion-pop-id="${r}"] {
            position: absolute !important;
            width: ${a}px !important;
            height: ${m}px !important;
            ${E}px !important;
            ${z}px !important;
          }
        `),
        () => {
          b.contains(f) && b.removeChild(f);
        }
      );
    }, [s]),
    t.jsx(Z, {
      isPresent: s,
      childRef: x,
      sizeRef: C,
      pop: c,
      children: c === !1 ? e : o.cloneElement(e, { ref: v }),
    })
  );
}
const te = ({
  children: e,
  initial: s,
  isPresent: n,
  onExitComplete: i,
  custom: u,
  presenceAffectsLayout: c,
  mode: r,
  anchorX: x,
  anchorY: C,
  root: y,
}) => {
  const d = B(ne),
    v = o.useId();
  let a = !0,
    m = o.useMemo(
      () => (
        (a = !1),
        {
          id: v,
          initial: s,
          isPresent: n,
          custom: u,
          onExitComplete: (h) => {
            d.set(h, !0);
            for (const g of d.values()) if (!g) return;
            i && i();
          },
          register: (h) => (d.set(h, !1), () => d.delete(h)),
        }
      ),
      [n, d, i],
    );
  return (
    c && a && (m = { ...m }),
    o.useMemo(() => {
      d.forEach((h, g) => d.set(g, !1));
    }, [n]),
    o.useEffect(() => {
      !n && !d.size && i && i();
    }, [n]),
    (e = t.jsx(ee, {
      pop: r === "popLayout",
      isPresent: n,
      anchorX: x,
      anchorY: C,
      root: y,
      children: e,
    })),
    t.jsx(U.Provider, { value: m, children: e })
  );
};
function ne() {
  return new Map();
}
const P = (e) => e.key || "";
function S(e) {
  const s = [];
  return (
    o.Children.forEach(e, (n) => {
      o.isValidElement(n) && s.push(n);
    }),
    s
  );
}
const se = ({
    children: e,
    custom: s,
    initial: n = !0,
    onExitComplete: i,
    presenceAffectsLayout: u = !0,
    mode: c = "sync",
    propagate: r = !1,
    anchorX: x = "left",
    anchorY: C = "top",
    root: y,
  }) => {
    const [d, v] = F(r),
      a = o.useMemo(() => S(e), [e]),
      m = r && !d ? [] : a.map(P),
      h = o.useRef(!0),
      g = o.useRef(a),
      j = B(() => new Map()),
      w = o.useRef(new Set()),
      [E, z] = o.useState(a),
      [f, b] = o.useState(a);
    K(() => {
      ((h.current = !1), (g.current = a));
      for (let p = 0; p < f.length; p++) {
        const l = P(f[p]);
        m.includes(l) ? (j.delete(l), w.current.delete(l)) : j.get(l) !== !0 && j.set(l, !1);
      }
    }, [f, m.length, m.join("-")]);
    const M = [];
    if (a !== E) {
      let p = [...a];
      for (let l = 0; l < f.length; l++) {
        const R = f[l],
          k = P(R);
        m.includes(k) || (p.splice(l, 0, R), M.push(R));
      }
      return (c === "wait" && M.length && (p = M), b(S(p)), z(a), null);
    }
    const { forceRender: T } = o.useContext(W);
    return t.jsx(t.Fragment, {
      children: f.map((p) => {
        const l = P(p),
          R = r && !d ? !1 : a === f || m.includes(l),
          k = () => {
            if (w.current.has(l)) return;
            if ((w.current.add(l), j.has(l))) j.set(l, !0);
            else return;
            let I = !0;
            (j.forEach((A) => {
              A || (I = !1);
            }),
              I && (T?.(), b(g.current), r && v?.(), i && i()));
          };
        return t.jsx(
          te,
          {
            isPresent: R,
            initial: !h.current || n ? void 0 : !1,
            custom: s,
            presenceAffectsLayout: u,
            mode: c,
            root: y,
            onExitComplete: R ? void 0 : k,
            anchorX: x,
            anchorY: C,
            children: p,
          },
          l,
        );
      }),
    });
  },
  oe = [
    {
      name: "Twitter",
      url: "https://twitter.com/wenhouman",
      icon: t.jsx(N, { className: "size-5", icon: "ri:twitter-x-fill" }),
    },
    {
      name: "github",
      url: "https://github.com/agniwen",
      icon: t.jsx(N, { className: "size-5", icon: "ri:github-line" }),
    },
    {
      name: "bilibili",
      url: "https://space.bilibili.com/2940875",
      icon: t.jsx(N, { className: "size-5", icon: "ri:bilibili-line" }),
    },
    {
      name: "email",
      url: "mailto:wisakura@outlook.com",
      icon: t.jsx(N, { className: "size-5", icon: "ri:mail-line" }),
    },
  ];
function re({ className: e }) {
  return t.jsx("div", {
    className: _("flex h-8 space-x-5", e),
    children: t.jsx(se, {
      children: oe.map((s, n) =>
        t.jsx(
          V.div,
          {
            transition: { delay: n * 0.05 },
            initial: { opacity: 0, x: -10 },
            animate: { opacity: 1, x: 0 },
            children: t.jsx("a", {
              href: s.url,
              target: "_blank",
              rel: "noreferrer",
              className:
                "inline-block p-2 cursor-default rounded-full transition-colors text-secondary-foreground hover:bg-secondary  ",
              children: s.icon,
            }),
          },
          s.url,
        ),
      ),
    }),
  });
}
function ge() {
  return t.jsxs(G, {
    children: [
      t.jsx("script", {
        src: "https://cloud.umami.is/script.js",
        "data-website-id": "db54fa9c-6564-4c24-a997-058b8012f7b7",
      }),
      t.jsx(q, {
        className: "h-screen",
        children: t.jsx(X, {
          className: "home overflow-hidden container mx-auto",
          children: t.jsxs("div", {
            className: "min-h-screen flex flex-col w-full justify-center space-y-8 items-center",
            children: [
              t.jsx("div", {
                className: "size-24 rounded-full bg-zinc-50",
                children: t.jsx("img", {
                  src: J.NEXT_PUBLIC_AVATAR_URL,
                  className:
                    "w-full shadow-xl object-contain shrink-0 pointer-events-none rounded-full",
                  alt: "avatar",
                }),
              }),
              t.jsxs("div", {
                className: "flex flex-col items-center justify-center space-y-8",
                children: [
                  t.jsxs("div", {
                    className: "text-center",
                    children: [
                      t.jsx("h1", {
                        className: "text-xl mb-4 text-gray-800",
                        children: "Wen's Blog",
                      }),
                      t.jsx("p", {
                        className: "text-base max-w-xs text-balance text-gray-600",
                        children:
                          "I am a Node.js developer. Currently, I don't have more to introduce about myself.",
                      }),
                    ],
                  }),
                  t.jsx(re, {}),
                  t.jsx(H, {
                    to: "/blog",
                    children: t.jsx(Y, {
                      size: "lg",
                      variant: "secondary",
                      className: "px-8 rounded-full",
                      children: "Blog",
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
      }),
    ],
  });
}
export { ge as component };
