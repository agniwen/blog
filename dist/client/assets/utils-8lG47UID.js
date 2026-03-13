import { r as E, i as dt } from "./main-Cq61YlVT.js";
const Ee = {};
function be(e, t) {
  const o = E.useRef(Ee);
  return (o.current === Ee && (o.current = e(t)), o);
}
const ce = dt[`useInsertionEffect${Math.random().toFixed(1)}`.slice(0, -3)],
  ut = ce && ce !== E.useLayoutEffect ? ce : (e) => e();
function _o(e) {
  const t = be(ft).current;
  return ((t.next = e), ut(t.effect), t.trampoline);
}
function ft() {
  const e = {
    next: void 0,
    callback: mt,
    trampoline: (...t) => e.callback?.(...t),
    effect: () => {
      e.callback = e.next;
    },
  };
  return e;
}
function mt() {}
function pt(e, ...t) {
  const o = new URL("https://base-ui.com/production-error");
  return (
    o.searchParams.set("code", e.toString()),
    t.forEach((r) => o.searchParams.append("args[]", r)),
    `Base UI error #${e}; visit ${o} for the full message.`
  );
}
function Re(e, t, o, r) {
  const n = be(Ve).current;
  return (gt(n, e, t, o, r) && _e(n, [e, t, o, r]), n.callback);
}
function bt(e) {
  const t = be(Ve).current;
  return (ht(t, e) && _e(t, e), t.callback);
}
function Ve() {
  return { callback: null, cleanup: null, refs: [] };
}
function gt(e, t, o, r, n) {
  return e.refs[0] !== t || e.refs[1] !== o || e.refs[2] !== r || e.refs[3] !== n;
}
function ht(e, t) {
  return e.refs.length !== t.length || e.refs.some((o, r) => o !== t[r]);
}
function _e(e, t) {
  if (((e.refs = t), t.every((o) => o == null))) {
    e.callback = null;
    return;
  }
  e.callback = (o) => {
    if ((e.cleanup && (e.cleanup(), (e.cleanup = null)), o != null)) {
      const r = Array(t.length).fill(null);
      for (let n = 0; n < t.length; n += 1) {
        const s = t[n];
        if (s != null)
          switch (typeof s) {
            case "function": {
              const a = s(o);
              typeof a == "function" && (r[n] = a);
              break;
            }
            case "object": {
              s.current = o;
              break;
            }
          }
      }
      e.cleanup = () => {
        for (let n = 0; n < t.length; n += 1) {
          const s = t[n];
          if (s != null)
            switch (typeof s) {
              case "function": {
                const a = r[n];
                typeof a == "function" ? a() : s(null);
                break;
              }
              case "object": {
                s.current = null;
                break;
              }
            }
        }
      };
    }
  };
}
const yt = parseInt(E.version, 10);
function wt(e) {
  return yt >= e;
}
function Pe(e) {
  if (!E.isValidElement(e)) return null;
  const t = e,
    o = t.props;
  return (wt(19) ? o?.ref : t.ref) ?? null;
}
function ue(e, t) {
  if (e && !t) return e;
  if (!e && t) return t;
  if (e || t) return { ...e, ...t };
}
function kt(e, t) {
  const o = {};
  for (const r in e) {
    const n = e[r];
    if (t?.hasOwnProperty(r)) {
      const s = t[r](n);
      s != null && Object.assign(o, s);
      continue;
    }
    n === !0
      ? (o[`data-${r.toLowerCase()}`] = "")
      : n && (o[`data-${r.toLowerCase()}`] = n.toString());
  }
  return o;
}
function xt(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function vt(e, t) {
  return typeof e == "function" ? e(t) : e;
}
const Y = {};
function Ct(e, t, o, r, n) {
  let s = { ...fe(e, Y) };
  return (t && (s = te(s, t)), o && (s = te(s, o)), r && (s = te(s, r)), s);
}
function St(e) {
  if (e.length === 0) return Y;
  if (e.length === 1) return fe(e[0], Y);
  let t = { ...fe(e[0], Y) };
  for (let o = 1; o < e.length; o += 1) t = te(t, e[o]);
  return t;
}
function te(e, t) {
  return Fe(t) ? t(e) : zt(e, t);
}
function zt(e, t) {
  if (!t) return e;
  for (const o in t) {
    const r = t[o];
    switch (o) {
      case "style": {
        e[o] = ue(e.style, r);
        break;
      }
      case "className": {
        e[o] = We(e.className, r);
        break;
      }
      default:
        At(o, r) ? (e[o] = Et(e[o], r)) : (e[o] = r);
    }
  }
  return e;
}
function At(e, t) {
  const o = e.charCodeAt(0),
    r = e.charCodeAt(1),
    n = e.charCodeAt(2);
  return o === 111 && r === 110 && n >= 65 && n <= 90 && (typeof t == "function" || typeof t > "u");
}
function Fe(e) {
  return typeof e == "function";
}
function fe(e, t) {
  return Fe(e) ? e(t) : (e ?? Y);
}
function Et(e, t) {
  return t
    ? e
      ? (o) => {
          if (Pt(o)) {
            const n = o;
            Rt(n);
            const s = t(n);
            return (n.baseUIHandlerPrevented || e?.(n), s);
          }
          const r = t(o);
          return (e?.(o), r);
        }
      : t
    : e;
}
function Rt(e) {
  return (
    (e.preventBaseUIHandler = () => {
      e.baseUIHandlerPrevented = !0;
    }),
    e
  );
}
function We(e, t) {
  return t ? (e ? t + " " + e : t) : e;
}
function Pt(e) {
  return e != null && typeof e == "object" && "nativeEvent" in e;
}
function Fo() {}
const Wo = Object.freeze([]),
  W = Object.freeze({});
function Bo(e, t, o = {}) {
  const r = t.render,
    n = It(t, o);
  if (o.enabled === !1) return null;
  const s = o.state ?? W;
  return Tt(e, r, n, s);
}
function It(e, t = {}) {
  const { className: o, style: r, render: n } = e,
    { state: s = W, ref: a, props: f, stateAttributesMapping: u, enabled: p = !0 } = t,
    b = p ? xt(o, s) : void 0,
    x = p ? vt(r, s) : void 0,
    S = p ? kt(s, u) : W,
    y = p ? (ue(S, Array.isArray(f) ? St(f) : f) ?? W) : W;
  return (
    typeof document < "u" &&
      (p
        ? Array.isArray(a)
          ? (y.ref = bt([y.ref, Pe(n), ...a]))
          : (y.ref = Re(y.ref, Pe(n), a))
        : Re(null, null)),
    p
      ? (b !== void 0 && (y.className = We(y.className, b)),
        x !== void 0 && (y.style = ue(y.style, x)),
        y)
      : W
  );
}
const Nt = Symbol.for("react.lazy");
function Tt(e, t, o, r) {
  if (t) {
    if (typeof t == "function") return t(o, r);
    const n = Ct(o, t.props);
    n.ref = o.ref;
    let s = t;
    return (s?.$$typeof === Nt && (s = E.Children.toArray(t)[0]), E.cloneElement(s, n));
  }
  if (e && typeof e == "string") return Mt(e, o);
  throw new Error(pt(8));
}
function Mt(e, t) {
  return e === "button"
    ? E.createElement("button", { type: "button", ...t, key: t.key })
    : e === "img"
      ? E.createElement("img", { alt: "", ...t, key: t.key })
      : E.createElement(e, t);
}
function re() {
  return typeof window < "u";
}
function ge(e) {
  return Be(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function B(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Lt(e) {
  var t;
  return (t = (Be(e) ? e.ownerDocument : e.document) || window.document) == null
    ? void 0
    : t.documentElement;
}
function Be(e) {
  return re() ? e instanceof Node || e instanceof B(e).Node : !1;
}
function De(e) {
  return re() ? e instanceof Element || e instanceof B(e).Element : !1;
}
function $e(e) {
  return re() ? e instanceof HTMLElement || e instanceof B(e).HTMLElement : !1;
}
function Ie(e) {
  return !re() || typeof ShadowRoot > "u"
    ? !1
    : e instanceof ShadowRoot || e instanceof B(e).ShadowRoot;
}
const Ot = new Set(["inline", "contents"]);
function Ue(e) {
  const { overflow: t, overflowX: o, overflowY: r, display: n } = Xe(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + r + o) && !Ot.has(n);
}
const jt = new Set(["table", "td", "th"]);
function Do(e) {
  return jt.has(ge(e));
}
const Gt = [":popover-open", ":modal"];
function Vt(e) {
  return Gt.some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
const _t = ["transform", "translate", "scale", "rotate", "perspective"],
  Ft = ["transform", "translate", "scale", "rotate", "perspective", "filter"],
  Wt = ["paint", "layout", "strict", "content"];
function Bt(e) {
  const t = Dt(),
    o = De(e) ? Xe(e) : e;
  return (
    _t.some((r) => (o[r] ? o[r] !== "none" : !1)) ||
    (o.containerType ? o.containerType !== "normal" : !1) ||
    (!t && (o.backdropFilter ? o.backdropFilter !== "none" : !1)) ||
    (!t && (o.filter ? o.filter !== "none" : !1)) ||
    Ft.some((r) => (o.willChange || "").includes(r)) ||
    Wt.some((r) => (o.contain || "").includes(r))
  );
}
function $o(e) {
  let t = me(e);
  for (; $e(t) && !Ye(t); ) {
    if (Bt(t)) return t;
    if (Vt(t)) return null;
    t = me(t);
  }
  return null;
}
function Dt() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const $t = new Set(["html", "body", "#document"]);
function Ye(e) {
  return $t.has(ge(e));
}
function Xe(e) {
  return B(e).getComputedStyle(e);
}
function Uo(e) {
  return De(e)
    ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
    : { scrollLeft: e.scrollX, scrollTop: e.scrollY };
}
function me(e) {
  if (ge(e) === "html") return e;
  const t = e.assignedSlot || e.parentNode || (Ie(e) && e.host) || Lt(e);
  return Ie(t) ? t.host : t;
}
function qe(e) {
  const t = me(e);
  return Ye(t) ? (e.ownerDocument ? e.ownerDocument.body : e.body) : $e(t) && Ue(t) ? t : qe(t);
}
function Ne(e, t, o) {
  var r;
  (t === void 0 && (t = []), o === void 0 && (o = !0));
  const n = qe(e),
    s = n === ((r = e.ownerDocument) == null ? void 0 : r.body),
    a = B(n);
  if (s) {
    const f = Ut(a);
    return t.concat(a, a.visualViewport || [], Ue(n) ? n : [], f && o ? Ne(f) : []);
  }
  return t.concat(n, Ne(n, [], o));
}
function Ut(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
const Yt = () => {},
  Yo = typeof document < "u" ? E.useLayoutEffect : Yt;
function He(e) {
  var t,
    o,
    r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object")
    if (Array.isArray(e)) {
      var n = e.length;
      for (t = 0; t < n; t++) e[t] && (o = He(e[t])) && (r && (r += " "), (r += o));
    } else for (o in e) e[o] && (r && (r += " "), (r += o));
  return r;
}
function Xt() {
  for (var e, t, o = 0, r = "", n = arguments.length; o < n; o++)
    (e = arguments[o]) && (t = He(e)) && (r && (r += " "), (r += t));
  return r;
}
const qt = (e, t) => {
    const o = new Array(e.length + t.length);
    for (let r = 0; r < e.length; r++) o[r] = e[r];
    for (let r = 0; r < t.length; r++) o[e.length + r] = t[r];
    return o;
  },
  Ht = (e, t) => ({ classGroupId: e, validator: t }),
  Je = (e = new Map(), t = null, o) => ({ nextPart: e, validators: t, classGroupId: o }),
  oe = "-",
  Te = [],
  Jt = "arbitrary..",
  Zt = (e) => {
    const t = Qt(e),
      { conflictingClassGroups: o, conflictingClassGroupModifiers: r } = e;
    return {
      getClassGroupId: (a) => {
        if (a.startsWith("[") && a.endsWith("]")) return Kt(a);
        const f = a.split(oe),
          u = f[0] === "" && f.length > 1 ? 1 : 0;
        return Ze(f, u, t);
      },
      getConflictingClassGroupIds: (a, f) => {
        if (f) {
          const u = r[a],
            p = o[a];
          return u ? (p ? qt(p, u) : u) : p || Te;
        }
        return o[a] || Te;
      },
    };
  },
  Ze = (e, t, o) => {
    if (e.length - t === 0) return o.classGroupId;
    const n = e[t],
      s = o.nextPart.get(n);
    if (s) {
      const p = Ze(e, t + 1, s);
      if (p) return p;
    }
    const a = o.validators;
    if (a === null) return;
    const f = t === 0 ? e.join(oe) : e.slice(t).join(oe),
      u = a.length;
    for (let p = 0; p < u; p++) {
      const b = a[p];
      if (b.validator(f)) return b.classGroupId;
    }
  },
  Kt = (e) =>
    e.slice(1, -1).indexOf(":") === -1
      ? void 0
      : (() => {
          const t = e.slice(1, -1),
            o = t.indexOf(":"),
            r = t.slice(0, o);
          return r ? Jt + r : void 0;
        })(),
  Qt = (e) => {
    const { theme: t, classGroups: o } = e;
    return eo(o, t);
  },
  eo = (e, t) => {
    const o = Je();
    for (const r in e) {
      const n = e[r];
      he(n, o, r, t);
    }
    return o;
  },
  he = (e, t, o, r) => {
    const n = e.length;
    for (let s = 0; s < n; s++) {
      const a = e[s];
      to(a, t, o, r);
    }
  },
  to = (e, t, o, r) => {
    if (typeof e == "string") {
      oo(e, t, o);
      return;
    }
    if (typeof e == "function") {
      ro(e, t, o, r);
      return;
    }
    no(e, t, o, r);
  },
  oo = (e, t, o) => {
    const r = e === "" ? t : Ke(t, e);
    r.classGroupId = o;
  },
  ro = (e, t, o, r) => {
    if (so(e)) {
      he(e(r), t, o, r);
      return;
    }
    (t.validators === null && (t.validators = []), t.validators.push(Ht(o, e)));
  },
  no = (e, t, o, r) => {
    const n = Object.entries(e),
      s = n.length;
    for (let a = 0; a < s; a++) {
      const [f, u] = n[a];
      he(u, Ke(t, f), o, r);
    }
  },
  Ke = (e, t) => {
    let o = e;
    const r = t.split(oe),
      n = r.length;
    for (let s = 0; s < n; s++) {
      const a = r[s];
      let f = o.nextPart.get(a);
      (f || ((f = Je()), o.nextPart.set(a, f)), (o = f));
    }
    return o;
  },
  so = (e) => "isThemeGetter" in e && e.isThemeGetter === !0,
  ao = (e) => {
    if (e < 1) return { get: () => {}, set: () => {} };
    let t = 0,
      o = Object.create(null),
      r = Object.create(null);
    const n = (s, a) => {
      ((o[s] = a), t++, t > e && ((t = 0), (r = o), (o = Object.create(null))));
    };
    return {
      get(s) {
        let a = o[s];
        if (a !== void 0) return a;
        if ((a = r[s]) !== void 0) return (n(s, a), a);
      },
      set(s, a) {
        s in o ? (o[s] = a) : n(s, a);
      },
    };
  },
  pe = "!",
  Me = ":",
  io = [],
  Le = (e, t, o, r, n) => ({
    modifiers: e,
    hasImportantModifier: t,
    baseClassName: o,
    maybePostfixModifierPosition: r,
    isExternal: n,
  }),
  lo = (e) => {
    const { prefix: t, experimentalParseClassName: o } = e;
    let r = (n) => {
      const s = [];
      let a = 0,
        f = 0,
        u = 0,
        p;
      const b = n.length;
      for (let z = 0; z < b; z++) {
        const v = n[z];
        if (a === 0 && f === 0) {
          if (v === Me) {
            (s.push(n.slice(u, z)), (u = z + 1));
            continue;
          }
          if (v === "/") {
            p = z;
            continue;
          }
        }
        v === "[" ? a++ : v === "]" ? a-- : v === "(" ? f++ : v === ")" && f--;
      }
      const x = s.length === 0 ? n : n.slice(u);
      let S = x,
        y = !1;
      x.endsWith(pe)
        ? ((S = x.slice(0, -1)), (y = !0))
        : x.startsWith(pe) && ((S = x.slice(1)), (y = !0));
      const T = p && p > u ? p - u : void 0;
      return Le(s, y, S, T);
    };
    if (t) {
      const n = t + Me,
        s = r;
      r = (a) => (a.startsWith(n) ? s(a.slice(n.length)) : Le(io, !1, a, void 0, !0));
    }
    if (o) {
      const n = r;
      r = (s) => o({ className: s, parseClassName: n });
    }
    return r;
  },
  co = (e) => {
    const t = new Map();
    return (
      e.orderSensitiveModifiers.forEach((o, r) => {
        t.set(o, 1e6 + r);
      }),
      (o) => {
        const r = [];
        let n = [];
        for (let s = 0; s < o.length; s++) {
          const a = o[s],
            f = a[0] === "[",
            u = t.has(a);
          f || u ? (n.length > 0 && (n.sort(), r.push(...n), (n = [])), r.push(a)) : n.push(a);
        }
        return (n.length > 0 && (n.sort(), r.push(...n)), r);
      }
    );
  },
  uo = (e) => ({ cache: ao(e.cacheSize), parseClassName: lo(e), sortModifiers: co(e), ...Zt(e) }),
  fo = /\s+/,
  mo = (e, t) => {
    const {
        parseClassName: o,
        getClassGroupId: r,
        getConflictingClassGroupIds: n,
        sortModifiers: s,
      } = t,
      a = [],
      f = e.trim().split(fo);
    let u = "";
    for (let p = f.length - 1; p >= 0; p -= 1) {
      const b = f[p],
        {
          isExternal: x,
          modifiers: S,
          hasImportantModifier: y,
          baseClassName: T,
          maybePostfixModifierPosition: z,
        } = o(b);
      if (x) {
        u = b + (u.length > 0 ? " " + u : u);
        continue;
      }
      let v = !!z,
        M = r(v ? T.substring(0, z) : T);
      if (!M) {
        if (!v) {
          u = b + (u.length > 0 ? " " + u : u);
          continue;
        }
        if (((M = r(T)), !M)) {
          u = b + (u.length > 0 ? " " + u : u);
          continue;
        }
        v = !1;
      }
      const X = S.length === 0 ? "" : S.length === 1 ? S[0] : s(S).join(":"),
        D = y ? X + pe : X,
        V = D + M;
      if (a.indexOf(V) > -1) continue;
      a.push(V);
      const _ = n(M, v);
      for (let L = 0; L < _.length; ++L) {
        const $ = _[L];
        a.push(D + $);
      }
      u = b + (u.length > 0 ? " " + u : u);
    }
    return u;
  },
  po = (...e) => {
    let t = 0,
      o,
      r,
      n = "";
    for (; t < e.length; ) (o = e[t++]) && (r = Qe(o)) && (n && (n += " "), (n += r));
    return n;
  },
  Qe = (e) => {
    if (typeof e == "string") return e;
    let t,
      o = "";
    for (let r = 0; r < e.length; r++) e[r] && (t = Qe(e[r])) && (o && (o += " "), (o += t));
    return o;
  },
  bo = (e, ...t) => {
    let o, r, n, s;
    const a = (u) => {
        const p = t.reduce((b, x) => x(b), e());
        return ((o = uo(p)), (r = o.cache.get), (n = o.cache.set), (s = f), f(u));
      },
      f = (u) => {
        const p = r(u);
        if (p) return p;
        const b = mo(u, o);
        return (n(u, b), b);
      };
    return ((s = a), (...u) => s(po(...u)));
  },
  go = [],
  g = (e) => {
    const t = (o) => o[e] || go;
    return ((t.isThemeGetter = !0), t);
  },
  et = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  tt = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  ho = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
  yo = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  wo =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  ko = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  xo = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  vo =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  P = (e) => ho.test(e),
  m = (e) => !!e && !Number.isNaN(Number(e)),
  I = (e) => !!e && Number.isInteger(Number(e)),
  de = (e) => e.endsWith("%") && m(e.slice(0, -1)),
  R = (e) => yo.test(e),
  ot = () => !0,
  Co = (e) => wo.test(e) && !ko.test(e),
  ye = () => !1,
  So = (e) => xo.test(e),
  zo = (e) => vo.test(e),
  Ao = (e) => !i(e) && !l(e),
  Eo = (e) => N(e, st, ye),
  i = (e) => et.test(e),
  j = (e) => N(e, at, Co),
  Oe = (e) => N(e, Oo, m),
  Ro = (e) => N(e, lt, ot),
  Po = (e) => N(e, it, ye),
  je = (e) => N(e, rt, ye),
  Io = (e) => N(e, nt, zo),
  Q = (e) => N(e, ct, So),
  l = (e) => tt.test(e),
  U = (e) => G(e, at),
  No = (e) => G(e, it),
  Ge = (e) => G(e, rt),
  To = (e) => G(e, st),
  Mo = (e) => G(e, nt),
  ee = (e) => G(e, ct, !0),
  Lo = (e) => G(e, lt, !0),
  N = (e, t, o) => {
    const r = et.exec(e);
    return r ? (r[1] ? t(r[1]) : o(r[2])) : !1;
  },
  G = (e, t, o = !1) => {
    const r = tt.exec(e);
    return r ? (r[1] ? t(r[1]) : o) : !1;
  },
  rt = (e) => e === "position" || e === "percentage",
  nt = (e) => e === "image" || e === "url",
  st = (e) => e === "length" || e === "size" || e === "bg-size",
  at = (e) => e === "length",
  Oo = (e) => e === "number",
  it = (e) => e === "family-name",
  lt = (e) => e === "number" || e === "weight",
  ct = (e) => e === "shadow",
  jo = () => {
    const e = g("color"),
      t = g("font"),
      o = g("text"),
      r = g("font-weight"),
      n = g("tracking"),
      s = g("leading"),
      a = g("breakpoint"),
      f = g("container"),
      u = g("spacing"),
      p = g("radius"),
      b = g("shadow"),
      x = g("inset-shadow"),
      S = g("text-shadow"),
      y = g("drop-shadow"),
      T = g("blur"),
      z = g("perspective"),
      v = g("aspect"),
      M = g("ease"),
      X = g("animate"),
      D = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"],
      V = () => [
        "center",
        "top",
        "bottom",
        "left",
        "right",
        "top-left",
        "left-top",
        "top-right",
        "right-top",
        "bottom-right",
        "right-bottom",
        "bottom-left",
        "left-bottom",
      ],
      _ = () => [...V(), l, i],
      L = () => ["auto", "hidden", "clip", "visible", "scroll"],
      $ = () => ["auto", "contain", "none"],
      c = () => [l, i, u],
      C = () => [P, "full", "auto", ...c()],
      we = () => [I, "none", "subgrid", l, i],
      ke = () => ["auto", { span: ["full", I, l, i] }, I, l, i],
      q = () => [I, "auto", l, i],
      xe = () => ["auto", "min", "max", "fr", l, i],
      ne = () => [
        "start",
        "end",
        "center",
        "between",
        "around",
        "evenly",
        "stretch",
        "baseline",
        "center-safe",
        "end-safe",
      ],
      F = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"],
      A = () => ["auto", ...c()],
      O = () => [
        P,
        "auto",
        "full",
        "dvw",
        "dvh",
        "lvw",
        "lvh",
        "svw",
        "svh",
        "min",
        "max",
        "fit",
        ...c(),
      ],
      se = () => [P, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...c()],
      ae = () => [P, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...c()],
      d = () => [e, l, i],
      ve = () => [...V(), Ge, je, { position: [l, i] }],
      Ce = () => ["no-repeat", { repeat: ["", "x", "y", "space", "round"] }],
      Se = () => ["auto", "cover", "contain", To, Eo, { size: [l, i] }],
      ie = () => [de, U, j],
      w = () => ["", "none", "full", p, l, i],
      k = () => ["", m, U, j],
      H = () => ["solid", "dashed", "dotted", "double"],
      ze = () => [
        "normal",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion",
        "hue",
        "saturation",
        "color",
        "luminosity",
      ],
      h = () => [m, de, Ge, je],
      Ae = () => ["", "none", T, l, i],
      J = () => ["none", m, l, i],
      Z = () => ["none", m, l, i],
      le = () => [m, l, i],
      K = () => [P, "full", ...c()];
    return {
      cacheSize: 500,
      theme: {
        animate: ["spin", "ping", "pulse", "bounce"],
        aspect: ["video"],
        blur: [R],
        breakpoint: [R],
        color: [ot],
        container: [R],
        "drop-shadow": [R],
        ease: ["in", "out", "in-out"],
        font: [Ao],
        "font-weight": [
          "thin",
          "extralight",
          "light",
          "normal",
          "medium",
          "semibold",
          "bold",
          "extrabold",
          "black",
        ],
        "inset-shadow": [R],
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
        perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
        radius: [R],
        shadow: [R],
        spacing: ["px", m],
        text: [R],
        "text-shadow": [R],
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"],
      },
      classGroups: {
        aspect: [{ aspect: ["auto", "square", P, i, l, v] }],
        container: ["container"],
        columns: [{ columns: [m, i, l, f] }],
        "break-after": [{ "break-after": D() }],
        "break-before": [{ "break-before": D() }],
        "break-inside": [{ "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] }],
        "box-decoration": [{ "box-decoration": ["slice", "clone"] }],
        box: [{ box: ["border", "content"] }],
        display: [
          "block",
          "inline-block",
          "inline",
          "flex",
          "inline-flex",
          "table",
          "inline-table",
          "table-caption",
          "table-cell",
          "table-column",
          "table-column-group",
          "table-footer-group",
          "table-header-group",
          "table-row-group",
          "table-row",
          "flow-root",
          "grid",
          "inline-grid",
          "contents",
          "list-item",
          "hidden",
        ],
        sr: ["sr-only", "not-sr-only"],
        float: [{ float: ["right", "left", "none", "start", "end"] }],
        clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }],
        isolation: ["isolate", "isolation-auto"],
        "object-fit": [{ object: ["contain", "cover", "fill", "none", "scale-down"] }],
        "object-position": [{ object: _() }],
        overflow: [{ overflow: L() }],
        "overflow-x": [{ "overflow-x": L() }],
        "overflow-y": [{ "overflow-y": L() }],
        overscroll: [{ overscroll: $() }],
        "overscroll-x": [{ "overscroll-x": $() }],
        "overscroll-y": [{ "overscroll-y": $() }],
        position: ["static", "fixed", "absolute", "relative", "sticky"],
        inset: [{ inset: C() }],
        "inset-x": [{ "inset-x": C() }],
        "inset-y": [{ "inset-y": C() }],
        start: [{ "inset-s": C(), start: C() }],
        end: [{ "inset-e": C(), end: C() }],
        "inset-bs": [{ "inset-bs": C() }],
        "inset-be": [{ "inset-be": C() }],
        top: [{ top: C() }],
        right: [{ right: C() }],
        bottom: [{ bottom: C() }],
        left: [{ left: C() }],
        visibility: ["visible", "invisible", "collapse"],
        z: [{ z: [I, "auto", l, i] }],
        basis: [{ basis: [P, "full", "auto", f, ...c()] }],
        "flex-direction": [{ flex: ["row", "row-reverse", "col", "col-reverse"] }],
        "flex-wrap": [{ flex: ["nowrap", "wrap", "wrap-reverse"] }],
        flex: [{ flex: [m, P, "auto", "initial", "none", i] }],
        grow: [{ grow: ["", m, l, i] }],
        shrink: [{ shrink: ["", m, l, i] }],
        order: [{ order: [I, "first", "last", "none", l, i] }],
        "grid-cols": [{ "grid-cols": we() }],
        "col-start-end": [{ col: ke() }],
        "col-start": [{ "col-start": q() }],
        "col-end": [{ "col-end": q() }],
        "grid-rows": [{ "grid-rows": we() }],
        "row-start-end": [{ row: ke() }],
        "row-start": [{ "row-start": q() }],
        "row-end": [{ "row-end": q() }],
        "grid-flow": [{ "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] }],
        "auto-cols": [{ "auto-cols": xe() }],
        "auto-rows": [{ "auto-rows": xe() }],
        gap: [{ gap: c() }],
        "gap-x": [{ "gap-x": c() }],
        "gap-y": [{ "gap-y": c() }],
        "justify-content": [{ justify: [...ne(), "normal"] }],
        "justify-items": [{ "justify-items": [...F(), "normal"] }],
        "justify-self": [{ "justify-self": ["auto", ...F()] }],
        "align-content": [{ content: ["normal", ...ne()] }],
        "align-items": [{ items: [...F(), { baseline: ["", "last"] }] }],
        "align-self": [{ self: ["auto", ...F(), { baseline: ["", "last"] }] }],
        "place-content": [{ "place-content": ne() }],
        "place-items": [{ "place-items": [...F(), "baseline"] }],
        "place-self": [{ "place-self": ["auto", ...F()] }],
        p: [{ p: c() }],
        px: [{ px: c() }],
        py: [{ py: c() }],
        ps: [{ ps: c() }],
        pe: [{ pe: c() }],
        pbs: [{ pbs: c() }],
        pbe: [{ pbe: c() }],
        pt: [{ pt: c() }],
        pr: [{ pr: c() }],
        pb: [{ pb: c() }],
        pl: [{ pl: c() }],
        m: [{ m: A() }],
        mx: [{ mx: A() }],
        my: [{ my: A() }],
        ms: [{ ms: A() }],
        me: [{ me: A() }],
        mbs: [{ mbs: A() }],
        mbe: [{ mbe: A() }],
        mt: [{ mt: A() }],
        mr: [{ mr: A() }],
        mb: [{ mb: A() }],
        ml: [{ ml: A() }],
        "space-x": [{ "space-x": c() }],
        "space-x-reverse": ["space-x-reverse"],
        "space-y": [{ "space-y": c() }],
        "space-y-reverse": ["space-y-reverse"],
        size: [{ size: O() }],
        "inline-size": [{ inline: ["auto", ...se()] }],
        "min-inline-size": [{ "min-inline": ["auto", ...se()] }],
        "max-inline-size": [{ "max-inline": ["none", ...se()] }],
        "block-size": [{ block: ["auto", ...ae()] }],
        "min-block-size": [{ "min-block": ["auto", ...ae()] }],
        "max-block-size": [{ "max-block": ["none", ...ae()] }],
        w: [{ w: [f, "screen", ...O()] }],
        "min-w": [{ "min-w": [f, "screen", "none", ...O()] }],
        "max-w": [{ "max-w": [f, "screen", "none", "prose", { screen: [a] }, ...O()] }],
        h: [{ h: ["screen", "lh", ...O()] }],
        "min-h": [{ "min-h": ["screen", "lh", "none", ...O()] }],
        "max-h": [{ "max-h": ["screen", "lh", ...O()] }],
        "font-size": [{ text: ["base", o, U, j] }],
        "font-smoothing": ["antialiased", "subpixel-antialiased"],
        "font-style": ["italic", "not-italic"],
        "font-weight": [{ font: [r, Lo, Ro] }],
        "font-stretch": [
          {
            "font-stretch": [
              "ultra-condensed",
              "extra-condensed",
              "condensed",
              "semi-condensed",
              "normal",
              "semi-expanded",
              "expanded",
              "extra-expanded",
              "ultra-expanded",
              de,
              i,
            ],
          },
        ],
        "font-family": [{ font: [No, Po, t] }],
        "font-features": [{ "font-features": [i] }],
        "fvn-normal": ["normal-nums"],
        "fvn-ordinal": ["ordinal"],
        "fvn-slashed-zero": ["slashed-zero"],
        "fvn-figure": ["lining-nums", "oldstyle-nums"],
        "fvn-spacing": ["proportional-nums", "tabular-nums"],
        "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
        tracking: [{ tracking: [n, l, i] }],
        "line-clamp": [{ "line-clamp": [m, "none", l, Oe] }],
        leading: [{ leading: [s, ...c()] }],
        "list-image": [{ "list-image": ["none", l, i] }],
        "list-style-position": [{ list: ["inside", "outside"] }],
        "list-style-type": [{ list: ["disc", "decimal", "none", l, i] }],
        "text-alignment": [{ text: ["left", "center", "right", "justify", "start", "end"] }],
        "placeholder-color": [{ placeholder: d() }],
        "text-color": [{ text: d() }],
        "text-decoration": ["underline", "overline", "line-through", "no-underline"],
        "text-decoration-style": [{ decoration: [...H(), "wavy"] }],
        "text-decoration-thickness": [{ decoration: [m, "from-font", "auto", l, j] }],
        "text-decoration-color": [{ decoration: d() }],
        "underline-offset": [{ "underline-offset": [m, "auto", l, i] }],
        "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }],
        indent: [{ indent: c() }],
        "vertical-align": [
          {
            align: [
              "baseline",
              "top",
              "middle",
              "bottom",
              "text-top",
              "text-bottom",
              "sub",
              "super",
              l,
              i,
            ],
          },
        ],
        whitespace: [
          { whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"] },
        ],
        break: [{ break: ["normal", "words", "all", "keep"] }],
        wrap: [{ wrap: ["break-word", "anywhere", "normal"] }],
        hyphens: [{ hyphens: ["none", "manual", "auto"] }],
        content: [{ content: ["none", l, i] }],
        "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }],
        "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }],
        "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }],
        "bg-position": [{ bg: ve() }],
        "bg-repeat": [{ bg: Ce() }],
        "bg-size": [{ bg: Se() }],
        "bg-image": [
          {
            bg: [
              "none",
              {
                linear: [{ to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"] }, I, l, i],
                radial: ["", l, i],
                conic: [I, l, i],
              },
              Mo,
              Io,
            ],
          },
        ],
        "bg-color": [{ bg: d() }],
        "gradient-from-pos": [{ from: ie() }],
        "gradient-via-pos": [{ via: ie() }],
        "gradient-to-pos": [{ to: ie() }],
        "gradient-from": [{ from: d() }],
        "gradient-via": [{ via: d() }],
        "gradient-to": [{ to: d() }],
        rounded: [{ rounded: w() }],
        "rounded-s": [{ "rounded-s": w() }],
        "rounded-e": [{ "rounded-e": w() }],
        "rounded-t": [{ "rounded-t": w() }],
        "rounded-r": [{ "rounded-r": w() }],
        "rounded-b": [{ "rounded-b": w() }],
        "rounded-l": [{ "rounded-l": w() }],
        "rounded-ss": [{ "rounded-ss": w() }],
        "rounded-se": [{ "rounded-se": w() }],
        "rounded-ee": [{ "rounded-ee": w() }],
        "rounded-es": [{ "rounded-es": w() }],
        "rounded-tl": [{ "rounded-tl": w() }],
        "rounded-tr": [{ "rounded-tr": w() }],
        "rounded-br": [{ "rounded-br": w() }],
        "rounded-bl": [{ "rounded-bl": w() }],
        "border-w": [{ border: k() }],
        "border-w-x": [{ "border-x": k() }],
        "border-w-y": [{ "border-y": k() }],
        "border-w-s": [{ "border-s": k() }],
        "border-w-e": [{ "border-e": k() }],
        "border-w-bs": [{ "border-bs": k() }],
        "border-w-be": [{ "border-be": k() }],
        "border-w-t": [{ "border-t": k() }],
        "border-w-r": [{ "border-r": k() }],
        "border-w-b": [{ "border-b": k() }],
        "border-w-l": [{ "border-l": k() }],
        "divide-x": [{ "divide-x": k() }],
        "divide-x-reverse": ["divide-x-reverse"],
        "divide-y": [{ "divide-y": k() }],
        "divide-y-reverse": ["divide-y-reverse"],
        "border-style": [{ border: [...H(), "hidden", "none"] }],
        "divide-style": [{ divide: [...H(), "hidden", "none"] }],
        "border-color": [{ border: d() }],
        "border-color-x": [{ "border-x": d() }],
        "border-color-y": [{ "border-y": d() }],
        "border-color-s": [{ "border-s": d() }],
        "border-color-e": [{ "border-e": d() }],
        "border-color-bs": [{ "border-bs": d() }],
        "border-color-be": [{ "border-be": d() }],
        "border-color-t": [{ "border-t": d() }],
        "border-color-r": [{ "border-r": d() }],
        "border-color-b": [{ "border-b": d() }],
        "border-color-l": [{ "border-l": d() }],
        "divide-color": [{ divide: d() }],
        "outline-style": [{ outline: [...H(), "none", "hidden"] }],
        "outline-offset": [{ "outline-offset": [m, l, i] }],
        "outline-w": [{ outline: ["", m, U, j] }],
        "outline-color": [{ outline: d() }],
        shadow: [{ shadow: ["", "none", b, ee, Q] }],
        "shadow-color": [{ shadow: d() }],
        "inset-shadow": [{ "inset-shadow": ["none", x, ee, Q] }],
        "inset-shadow-color": [{ "inset-shadow": d() }],
        "ring-w": [{ ring: k() }],
        "ring-w-inset": ["ring-inset"],
        "ring-color": [{ ring: d() }],
        "ring-offset-w": [{ "ring-offset": [m, j] }],
        "ring-offset-color": [{ "ring-offset": d() }],
        "inset-ring-w": [{ "inset-ring": k() }],
        "inset-ring-color": [{ "inset-ring": d() }],
        "text-shadow": [{ "text-shadow": ["none", S, ee, Q] }],
        "text-shadow-color": [{ "text-shadow": d() }],
        opacity: [{ opacity: [m, l, i] }],
        "mix-blend": [{ "mix-blend": [...ze(), "plus-darker", "plus-lighter"] }],
        "bg-blend": [{ "bg-blend": ze() }],
        "mask-clip": [
          { "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"] },
          "mask-no-clip",
        ],
        "mask-composite": [{ mask: ["add", "subtract", "intersect", "exclude"] }],
        "mask-image-linear-pos": [{ "mask-linear": [m] }],
        "mask-image-linear-from-pos": [{ "mask-linear-from": h() }],
        "mask-image-linear-to-pos": [{ "mask-linear-to": h() }],
        "mask-image-linear-from-color": [{ "mask-linear-from": d() }],
        "mask-image-linear-to-color": [{ "mask-linear-to": d() }],
        "mask-image-t-from-pos": [{ "mask-t-from": h() }],
        "mask-image-t-to-pos": [{ "mask-t-to": h() }],
        "mask-image-t-from-color": [{ "mask-t-from": d() }],
        "mask-image-t-to-color": [{ "mask-t-to": d() }],
        "mask-image-r-from-pos": [{ "mask-r-from": h() }],
        "mask-image-r-to-pos": [{ "mask-r-to": h() }],
        "mask-image-r-from-color": [{ "mask-r-from": d() }],
        "mask-image-r-to-color": [{ "mask-r-to": d() }],
        "mask-image-b-from-pos": [{ "mask-b-from": h() }],
        "mask-image-b-to-pos": [{ "mask-b-to": h() }],
        "mask-image-b-from-color": [{ "mask-b-from": d() }],
        "mask-image-b-to-color": [{ "mask-b-to": d() }],
        "mask-image-l-from-pos": [{ "mask-l-from": h() }],
        "mask-image-l-to-pos": [{ "mask-l-to": h() }],
        "mask-image-l-from-color": [{ "mask-l-from": d() }],
        "mask-image-l-to-color": [{ "mask-l-to": d() }],
        "mask-image-x-from-pos": [{ "mask-x-from": h() }],
        "mask-image-x-to-pos": [{ "mask-x-to": h() }],
        "mask-image-x-from-color": [{ "mask-x-from": d() }],
        "mask-image-x-to-color": [{ "mask-x-to": d() }],
        "mask-image-y-from-pos": [{ "mask-y-from": h() }],
        "mask-image-y-to-pos": [{ "mask-y-to": h() }],
        "mask-image-y-from-color": [{ "mask-y-from": d() }],
        "mask-image-y-to-color": [{ "mask-y-to": d() }],
        "mask-image-radial": [{ "mask-radial": [l, i] }],
        "mask-image-radial-from-pos": [{ "mask-radial-from": h() }],
        "mask-image-radial-to-pos": [{ "mask-radial-to": h() }],
        "mask-image-radial-from-color": [{ "mask-radial-from": d() }],
        "mask-image-radial-to-color": [{ "mask-radial-to": d() }],
        "mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
        "mask-image-radial-size": [
          { "mask-radial": [{ closest: ["side", "corner"], farthest: ["side", "corner"] }] },
        ],
        "mask-image-radial-pos": [{ "mask-radial-at": V() }],
        "mask-image-conic-pos": [{ "mask-conic": [m] }],
        "mask-image-conic-from-pos": [{ "mask-conic-from": h() }],
        "mask-image-conic-to-pos": [{ "mask-conic-to": h() }],
        "mask-image-conic-from-color": [{ "mask-conic-from": d() }],
        "mask-image-conic-to-color": [{ "mask-conic-to": d() }],
        "mask-mode": [{ mask: ["alpha", "luminance", "match"] }],
        "mask-origin": [
          { "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"] },
        ],
        "mask-position": [{ mask: ve() }],
        "mask-repeat": [{ mask: Ce() }],
        "mask-size": [{ mask: Se() }],
        "mask-type": [{ "mask-type": ["alpha", "luminance"] }],
        "mask-image": [{ mask: ["none", l, i] }],
        filter: [{ filter: ["", "none", l, i] }],
        blur: [{ blur: Ae() }],
        brightness: [{ brightness: [m, l, i] }],
        contrast: [{ contrast: [m, l, i] }],
        "drop-shadow": [{ "drop-shadow": ["", "none", y, ee, Q] }],
        "drop-shadow-color": [{ "drop-shadow": d() }],
        grayscale: [{ grayscale: ["", m, l, i] }],
        "hue-rotate": [{ "hue-rotate": [m, l, i] }],
        invert: [{ invert: ["", m, l, i] }],
        saturate: [{ saturate: [m, l, i] }],
        sepia: [{ sepia: ["", m, l, i] }],
        "backdrop-filter": [{ "backdrop-filter": ["", "none", l, i] }],
        "backdrop-blur": [{ "backdrop-blur": Ae() }],
        "backdrop-brightness": [{ "backdrop-brightness": [m, l, i] }],
        "backdrop-contrast": [{ "backdrop-contrast": [m, l, i] }],
        "backdrop-grayscale": [{ "backdrop-grayscale": ["", m, l, i] }],
        "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [m, l, i] }],
        "backdrop-invert": [{ "backdrop-invert": ["", m, l, i] }],
        "backdrop-opacity": [{ "backdrop-opacity": [m, l, i] }],
        "backdrop-saturate": [{ "backdrop-saturate": [m, l, i] }],
        "backdrop-sepia": [{ "backdrop-sepia": ["", m, l, i] }],
        "border-collapse": [{ border: ["collapse", "separate"] }],
        "border-spacing": [{ "border-spacing": c() }],
        "border-spacing-x": [{ "border-spacing-x": c() }],
        "border-spacing-y": [{ "border-spacing-y": c() }],
        "table-layout": [{ table: ["auto", "fixed"] }],
        caption: [{ caption: ["top", "bottom"] }],
        transition: [
          { transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", l, i] },
        ],
        "transition-behavior": [{ transition: ["normal", "discrete"] }],
        duration: [{ duration: [m, "initial", l, i] }],
        ease: [{ ease: ["linear", "initial", M, l, i] }],
        delay: [{ delay: [m, l, i] }],
        animate: [{ animate: ["none", X, l, i] }],
        backface: [{ backface: ["hidden", "visible"] }],
        perspective: [{ perspective: [z, l, i] }],
        "perspective-origin": [{ "perspective-origin": _() }],
        rotate: [{ rotate: J() }],
        "rotate-x": [{ "rotate-x": J() }],
        "rotate-y": [{ "rotate-y": J() }],
        "rotate-z": [{ "rotate-z": J() }],
        scale: [{ scale: Z() }],
        "scale-x": [{ "scale-x": Z() }],
        "scale-y": [{ "scale-y": Z() }],
        "scale-z": [{ "scale-z": Z() }],
        "scale-3d": ["scale-3d"],
        skew: [{ skew: le() }],
        "skew-x": [{ "skew-x": le() }],
        "skew-y": [{ "skew-y": le() }],
        transform: [{ transform: [l, i, "", "none", "gpu", "cpu"] }],
        "transform-origin": [{ origin: _() }],
        "transform-style": [{ transform: ["3d", "flat"] }],
        translate: [{ translate: K() }],
        "translate-x": [{ "translate-x": K() }],
        "translate-y": [{ "translate-y": K() }],
        "translate-z": [{ "translate-z": K() }],
        "translate-none": ["translate-none"],
        accent: [{ accent: d() }],
        appearance: [{ appearance: ["none", "auto"] }],
        "caret-color": [{ caret: d() }],
        "color-scheme": [
          { scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"] },
        ],
        cursor: [
          {
            cursor: [
              "auto",
              "default",
              "pointer",
              "wait",
              "text",
              "move",
              "help",
              "not-allowed",
              "none",
              "context-menu",
              "progress",
              "cell",
              "crosshair",
              "vertical-text",
              "alias",
              "copy",
              "no-drop",
              "grab",
              "grabbing",
              "all-scroll",
              "col-resize",
              "row-resize",
              "n-resize",
              "e-resize",
              "s-resize",
              "w-resize",
              "ne-resize",
              "nw-resize",
              "se-resize",
              "sw-resize",
              "ew-resize",
              "ns-resize",
              "nesw-resize",
              "nwse-resize",
              "zoom-in",
              "zoom-out",
              l,
              i,
            ],
          },
        ],
        "field-sizing": [{ "field-sizing": ["fixed", "content"] }],
        "pointer-events": [{ "pointer-events": ["auto", "none"] }],
        resize: [{ resize: ["none", "", "y", "x"] }],
        "scroll-behavior": [{ scroll: ["auto", "smooth"] }],
        "scroll-m": [{ "scroll-m": c() }],
        "scroll-mx": [{ "scroll-mx": c() }],
        "scroll-my": [{ "scroll-my": c() }],
        "scroll-ms": [{ "scroll-ms": c() }],
        "scroll-me": [{ "scroll-me": c() }],
        "scroll-mbs": [{ "scroll-mbs": c() }],
        "scroll-mbe": [{ "scroll-mbe": c() }],
        "scroll-mt": [{ "scroll-mt": c() }],
        "scroll-mr": [{ "scroll-mr": c() }],
        "scroll-mb": [{ "scroll-mb": c() }],
        "scroll-ml": [{ "scroll-ml": c() }],
        "scroll-p": [{ "scroll-p": c() }],
        "scroll-px": [{ "scroll-px": c() }],
        "scroll-py": [{ "scroll-py": c() }],
        "scroll-ps": [{ "scroll-ps": c() }],
        "scroll-pe": [{ "scroll-pe": c() }],
        "scroll-pbs": [{ "scroll-pbs": c() }],
        "scroll-pbe": [{ "scroll-pbe": c() }],
        "scroll-pt": [{ "scroll-pt": c() }],
        "scroll-pr": [{ "scroll-pr": c() }],
        "scroll-pb": [{ "scroll-pb": c() }],
        "scroll-pl": [{ "scroll-pl": c() }],
        "snap-align": [{ snap: ["start", "end", "center", "align-none"] }],
        "snap-stop": [{ snap: ["normal", "always"] }],
        "snap-type": [{ snap: ["none", "x", "y", "both"] }],
        "snap-strictness": [{ snap: ["mandatory", "proximity"] }],
        touch: [{ touch: ["auto", "none", "manipulation"] }],
        "touch-x": [{ "touch-pan": ["x", "left", "right"] }],
        "touch-y": [{ "touch-pan": ["y", "up", "down"] }],
        "touch-pz": ["touch-pinch-zoom"],
        select: [{ select: ["none", "text", "all", "auto"] }],
        "will-change": [{ "will-change": ["auto", "scroll", "contents", "transform", l, i] }],
        fill: [{ fill: ["none", ...d()] }],
        "stroke-w": [{ stroke: [m, U, j, Oe] }],
        stroke: [{ stroke: ["none", ...d()] }],
        "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }],
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: [
          "inset-x",
          "inset-y",
          "inset-bs",
          "inset-be",
          "start",
          "end",
          "top",
          "right",
          "bottom",
          "left",
        ],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        size: ["w", "h"],
        "font-size": ["leading"],
        "fvn-normal": [
          "fvn-ordinal",
          "fvn-slashed-zero",
          "fvn-figure",
          "fvn-spacing",
          "fvn-fraction",
        ],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        "line-clamp": ["display", "overflow"],
        rounded: [
          "rounded-s",
          "rounded-e",
          "rounded-t",
          "rounded-r",
          "rounded-b",
          "rounded-l",
          "rounded-ss",
          "rounded-se",
          "rounded-ee",
          "rounded-es",
          "rounded-tl",
          "rounded-tr",
          "rounded-br",
          "rounded-bl",
        ],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": [
          "border-w-x",
          "border-w-y",
          "border-w-s",
          "border-w-e",
          "border-w-bs",
          "border-w-be",
          "border-w-t",
          "border-w-r",
          "border-w-b",
          "border-w-l",
        ],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": [
          "border-color-x",
          "border-color-y",
          "border-color-s",
          "border-color-e",
          "border-color-bs",
          "border-color-be",
          "border-color-t",
          "border-color-r",
          "border-color-b",
          "border-color-l",
        ],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        translate: ["translate-x", "translate-y", "translate-none"],
        "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
        "scroll-m": [
          "scroll-mx",
          "scroll-my",
          "scroll-ms",
          "scroll-me",
          "scroll-mbs",
          "scroll-mbe",
          "scroll-mt",
          "scroll-mr",
          "scroll-mb",
          "scroll-ml",
        ],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": [
          "scroll-px",
          "scroll-py",
          "scroll-ps",
          "scroll-pe",
          "scroll-pbs",
          "scroll-pbe",
          "scroll-pt",
          "scroll-pr",
          "scroll-pb",
          "scroll-pl",
        ],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"],
        touch: ["touch-x", "touch-y", "touch-pz"],
        "touch-x": ["touch"],
        "touch-y": ["touch"],
        "touch-pz": ["touch"],
      },
      conflictingClassGroupModifiers: { "font-size": ["leading"] },
      orderSensitiveModifiers: [
        "*",
        "**",
        "after",
        "backdrop",
        "before",
        "details-content",
        "file",
        "first-letter",
        "first-line",
        "marker",
        "placeholder",
        "selection",
      ],
    };
  },
  Go = bo(jo);
function Xo(...e) {
  return Go(Xt(e));
}
export {
  Re as A,
  wt as B,
  Wo as C,
  Rt as D,
  W as E,
  Xt as F,
  Fo as N,
  Bo as a,
  $e as b,
  Xo as c,
  De as d,
  Lt as e,
  B as f,
  Ne as g,
  Ut as h,
  Ie as i,
  Xe as j,
  Vt as k,
  me as l,
  Ct as m,
  Ye as n,
  Do as o,
  Bt as p,
  $o as q,
  ge as r,
  Ue as s,
  Uo as t,
  be as u,
  Dt as v,
  Be as w,
  pt as x,
  _o as y,
  Yo as z,
};
