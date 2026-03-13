import { r as $ } from "./main-Cq61YlVT.js";
const Ws = $.createContext({}),
  $s = $.createContext(null);
function Jt(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function te(t, e) {
  const s = t.indexOf(e);
  s > -1 && t.splice(s, 1);
}
const xt = (t, e, s) => (s > e ? e : s < t ? t : s);
let ee = () => {};
const X = {},
  se = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t),
  ne = (t) => /^0[^.\s]+$/u.test(t);
function ie(t) {
  let e;
  return () => (e === void 0 && (e = t()), e);
}
const Ct = (t) => t;
class At {
  constructor() {
    this.subscriptions = [];
  }
  add(e) {
    return (Jt(this.subscriptions, e), () => te(this.subscriptions, e));
  }
  notify(e, s, n) {
    const i = this.subscriptions.length;
    if (i)
      if (i === 1) this.subscriptions[0](e, s, n);
      else
        for (let r = 0; r < i; r++) {
          const a = this.subscriptions[r];
          a && a(e, s, n);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const Ft = (t) => t * 1e3,
  Y = (t) => t / 1e3;
function re(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const ae = (t) => Array.isArray(t) && typeof t[0] == "number",
  k = [
    "setup",
    "read",
    "resolveKeyframes",
    "preUpdate",
    "update",
    "preRender",
    "render",
    "postRender",
  ];
function oe(t, e) {
  let s = new Set(),
    n = new Set(),
    i = !1,
    r = !1;
  const a = new WeakSet();
  let l = { delta: 0, timestamp: 0, isProcessing: !1 };
  function u(c) {
    (a.has(c) && (h.schedule(c), t()), c(l));
  }
  const h = {
    schedule: (c, f = !1, d = !1) => {
      const S = d && i ? s : n;
      return (f && a.add(c), S.has(c) || S.add(c), c);
    },
    cancel: (c) => {
      (n.delete(c), a.delete(c));
    },
    process: (c) => {
      if (((l = c), i)) {
        r = !0;
        return;
      }
      ((i = !0),
        ([s, n] = [n, s]),
        s.forEach(u),
        s.clear(),
        (i = !1),
        r && ((r = !1), h.process(c)));
    },
  };
  return h;
}
const le = 40;
function Pt(t, e) {
  let s = !1,
    n = !0;
  const i = { delta: 0, timestamp: 0, isProcessing: !1 },
    r = () => (s = !0),
    a = k.reduce((y, V) => ((y[V] = oe(r)), y), {}),
    {
      setup: l,
      read: u,
      resolveKeyframes: h,
      preUpdate: c,
      update: f,
      preRender: d,
      render: m,
      postRender: S,
    } = a,
    rt = () => {
      const y = X.useManualTiming ? i.timestamp : performance.now();
      ((s = !1),
        X.useManualTiming || (i.delta = n ? 1e3 / 60 : Math.max(Math.min(y - i.timestamp, le), 1)),
        (i.timestamp = y),
        (i.isProcessing = !0),
        l.process(i),
        u.process(i),
        h.process(i),
        c.process(i),
        f.process(i),
        d.process(i),
        m.process(i),
        S.process(i),
        (i.isProcessing = !1),
        s && e && ((n = !1), t(rt)));
    },
    Zt = () => {
      ((s = !0), (n = !0), i.isProcessing || t(rt));
    };
  return {
    schedule: k.reduce((y, V) => {
      const Gt = a[V];
      return ((y[V] = (Ht, qt = !1, Qt = !1) => (s || Zt(), Gt.schedule(Ht, qt, Qt))), y);
    }, {}),
    cancel: (y) => {
      for (let V = 0; V < k.length; V++) a[k[V]].cancel(y);
    },
    state: i,
    steps: a,
  };
}
const {
  schedule: E,
  cancel: at,
  state: ot,
  steps: Ys,
} = Pt(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Ct, !0);
let D;
function ue() {
  D = void 0;
}
const P = {
    now: () => (
      D === void 0 &&
        P.set(ot.isProcessing || X.useManualTiming ? ot.timestamp : performance.now()),
      D
    ),
    set: (t) => {
      ((D = t), queueMicrotask(ue));
    },
  },
  Rt = (t) => (e) => typeof e == "string" && e.startsWith(t),
  ce = Rt("--"),
  he = Rt("var(--"),
  zs = (t) => (he(t) ? fe.test(t.split("/*")[0].trim()) : !1),
  fe = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function Xs(t) {
  return typeof t != "string" ? !1 : t.split("/*")[0].includes("var(--");
}
const x = { test: (t) => typeof t == "number", parse: parseFloat, transform: (t) => t },
  B = { ...x, transform: (t) => xt(0, 1, t) },
  I = { ...x, default: 1 },
  R = (t) => Math.round(t * 1e5) / 1e5,
  et = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function de(t) {
  return t == null;
}
const pe =
    /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
  st = (t, e) => (s) =>
    !!(
      (typeof s == "string" && pe.test(s) && s.startsWith(t)) ||
      (e && !de(s) && Object.prototype.hasOwnProperty.call(s, e))
    ),
  Et = (t, e, s) => (n) => {
    if (typeof n != "string") return n;
    const [i, r, a, l] = n.match(et);
    return {
      [t]: parseFloat(i),
      [e]: parseFloat(r),
      [s]: parseFloat(a),
      alpha: l !== void 0 ? parseFloat(l) : 1,
    };
  },
  me = (t) => xt(0, 255, t),
  z = { ...x, transform: (t) => Math.round(me(t)) },
  A = {
    test: st("rgb", "red"),
    parse: Et("red", "green", "blue"),
    transform: ({ red: t, green: e, blue: s, alpha: n = 1 }) =>
      "rgba(" +
      z.transform(t) +
      ", " +
      z.transform(e) +
      ", " +
      z.transform(s) +
      ", " +
      R(B.transform(n)) +
      ")",
  };
function ge(t) {
  let e = "",
    s = "",
    n = "",
    i = "";
  return (
    t.length > 5
      ? ((e = t.substring(1, 3)),
        (s = t.substring(3, 5)),
        (n = t.substring(5, 7)),
        (i = t.substring(7, 9)))
      : ((e = t.substring(1, 2)),
        (s = t.substring(2, 3)),
        (n = t.substring(3, 4)),
        (i = t.substring(4, 5)),
        (e += e),
        (s += s),
        (n += n),
        (i += i)),
    {
      red: parseInt(e, 16),
      green: parseInt(s, 16),
      blue: parseInt(n, 16),
      alpha: i ? parseInt(i, 16) / 255 : 1,
    }
  );
}
const lt = { test: st("#"), parse: ge, transform: A.transform },
  N = (t) => ({
    test: (e) => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
    parse: parseFloat,
    transform: (e) => `${e}${t}`,
  }),
  T = N("deg"),
  M = N("%"),
  o = N("px"),
  ye = N("vh"),
  be = N("vw"),
  ut = { ...M, parse: (t) => M.parse(t) / 100, transform: (t) => M.transform(t * 100) },
  L = {
    test: st("hsl", "hue"),
    parse: Et("hue", "saturation", "lightness"),
    transform: ({ hue: t, saturation: e, lightness: s, alpha: n = 1 }) =>
      "hsla(" +
      Math.round(t) +
      ", " +
      M.transform(R(e)) +
      ", " +
      M.transform(R(s)) +
      ", " +
      R(B.transform(n)) +
      ")",
  },
  p = {
    test: (t) => A.test(t) || lt.test(t) || L.test(t),
    parse: (t) => (A.test(t) ? A.parse(t) : L.test(t) ? L.parse(t) : lt.parse(t)),
    transform: (t) =>
      typeof t == "string" ? t : t.hasOwnProperty("red") ? A.transform(t) : L.transform(t),
    getAnimatableNone: (t) => {
      const e = p.parse(t);
      return ((e.alpha = 0), p.transform(e));
    },
  },
  Ve =
    /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function Te(t) {
  return (
    isNaN(t) && typeof t == "string" && (t.match(et)?.length || 0) + (t.match(Ve)?.length || 0) > 0
  );
}
const Bt = "number",
  Nt = "color",
  Se = "var",
  ve = "var(",
  ct = "${}",
  we =
    /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Ot(t) {
  const e = t.toString(),
    s = [],
    n = { color: [], number: [], var: [] },
    i = [];
  let r = 0;
  const l = e
    .replace(
      we,
      (u) => (
        p.test(u)
          ? (n.color.push(r), i.push(Nt), s.push(p.parse(u)))
          : u.startsWith(ve)
            ? (n.var.push(r), i.push(Se), s.push(u))
            : (n.number.push(r), i.push(Bt), s.push(parseFloat(u))),
        ++r,
        ct
      ),
    )
    .split(ct);
  return { values: s, split: l, indexes: n, types: i };
}
function kt(t) {
  return Ot(t).values;
}
function It(t) {
  const { split: e, types: s } = Ot(t),
    n = e.length;
  return (i) => {
    let r = "";
    for (let a = 0; a < n; a++)
      if (((r += e[a]), i[a] !== void 0)) {
        const l = s[a];
        l === Bt ? (r += R(i[a])) : l === Nt ? (r += p.transform(i[a])) : (r += i[a]);
      }
    return r;
  };
}
const Me = (t) => (typeof t == "number" ? 0 : p.test(t) ? p.getAnimatableNone(t) : t);
function xe(t) {
  const e = kt(t);
  return It(t)(e.map(Me));
}
const b = { test: Te, parse: kt, createTransformer: It, getAnimatableNone: xe },
  Ce = (t, e, s) => t + (e - t) * s,
  Ae = (t, e, s = 10) => {
    let n = "";
    const i = Math.max(Math.round(e / s), 2);
    for (let r = 0; r < i; r++) n += Math.round(t(r / (i - 1)) * 1e4) / 1e4 + ", ";
    return `linear(${n.substring(0, n.length - 2)})`;
  },
  Fe = (t) => t !== null;
function Pe(t, { repeat: e, repeatType: s = "loop" }, n, i = 1) {
  const r = t.filter(Fe),
    l = i < 0 || (e && s !== "loop" && e % 2 === 1) ? 0 : r.length - 1;
  return !l || n === void 0 ? r[l] : n;
}
class Re {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((e) => {
      this.resolve = e;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  then(e, s) {
    return this.finished.then(e, s);
  }
}
function Ee(t) {
  for (let e = 1; e < t.length; e++) t[e] ?? (t[e] = t[e - 1]);
}
const v = (t) => (t * 180) / Math.PI,
  j = (t) => {
    const e = v(Math.atan2(t[1], t[0]));
    return U(e);
  },
  Be = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (t) => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
    rotate: j,
    rotateZ: j,
    skewX: (t) => v(Math.atan(t[1])),
    skewY: (t) => v(Math.atan(t[2])),
    skew: (t) => (Math.abs(t[1]) + Math.abs(t[2])) / 2,
  },
  U = (t) => ((t = t % 360), t < 0 && (t += 360), t),
  ht = j,
  ft = (t) => Math.sqrt(t[0] * t[0] + t[1] * t[1]),
  dt = (t) => Math.sqrt(t[4] * t[4] + t[5] * t[5]),
  Ne = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX: ft,
    scaleY: dt,
    scale: (t) => (ft(t) + dt(t)) / 2,
    rotateX: (t) => U(v(Math.atan2(t[6], t[5]))),
    rotateY: (t) => U(v(Math.atan2(-t[2], t[0]))),
    rotateZ: ht,
    rotate: ht,
    skewX: (t) => v(Math.atan(t[4])),
    skewY: (t) => v(Math.atan(t[1])),
    skew: (t) => (Math.abs(t[1]) + Math.abs(t[4])) / 2,
  };
function pt(t) {
  return t.includes("scale") ? 1 : 0;
}
function _(t, e) {
  if (!t || t === "none") return pt(e);
  const s = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let n, i;
  if (s) ((n = Ne), (i = s));
  else {
    const l = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    ((n = Be), (i = l));
  }
  if (!i) return pt(e);
  const r = n[e],
    a = i[1].split(",").map(Oe);
  return typeof r == "function" ? r(a) : a[r];
}
const js = (t, e) => {
  const { transform: s = "none" } = getComputedStyle(t);
  return _(s, e);
};
function Oe(t) {
  return parseFloat(t.trim());
}
const O = [
    "transformPerspective",
    "x",
    "y",
    "z",
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY",
  ],
  nt = new Set(O),
  Us = (t) => t === x || t === o,
  ke = new Set(["x", "y", "z"]),
  Ie = O.filter((t) => !ke.has(t));
function Le(t) {
  const e = [];
  return (
    Ie.forEach((s) => {
      const n = t.getValue(s);
      n !== void 0 && (e.push([s, n.get()]), n.set(s.startsWith("scale") ? 1 : 0));
    }),
    e
  );
}
const K = {
  width: ({ x: t }, { paddingLeft: e = "0", paddingRight: s = "0" }) =>
    t.max - t.min - parseFloat(e) - parseFloat(s),
  height: ({ y: t }, { paddingTop: e = "0", paddingBottom: s = "0" }) =>
    t.max - t.min - parseFloat(e) - parseFloat(s),
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  x: (t, { transform: e }) => _(e, "x"),
  y: (t, { transform: e }) => _(e, "y"),
};
K.translateX = K.x;
K.translateY = K.y;
const w = new Set();
let Z = !1,
  G = !1,
  H = !1;
function Lt() {
  if (G) {
    const t = Array.from(w).filter((n) => n.needsMeasurement),
      e = new Set(t.map((n) => n.element)),
      s = new Map();
    (e.forEach((n) => {
      const i = Le(n);
      i.length && (s.set(n, i), n.render());
    }),
      t.forEach((n) => n.measureInitialState()),
      e.forEach((n) => {
        n.render();
        const i = s.get(n);
        i &&
          i.forEach(([r, a]) => {
            n.getValue(r)?.set(a);
          });
      }),
      t.forEach((n) => n.measureEndState()),
      t.forEach((n) => {
        n.suspendedScrollY !== void 0 && window.scrollTo(0, n.suspendedScrollY);
      }));
  }
  ((G = !1), (Z = !1), w.forEach((t) => t.complete(H)), w.clear());
}
function Dt() {
  w.forEach((t) => {
    (t.readKeyframes(), t.needsMeasurement && (G = !0));
  });
}
function _s() {
  ((H = !0), Dt(), Lt(), (H = !1));
}
class De {
  constructor(e, s, n, i, r, a = !1) {
    ((this.state = "pending"),
      (this.isAsync = !1),
      (this.needsMeasurement = !1),
      (this.unresolvedKeyframes = [...e]),
      (this.onComplete = s),
      (this.name = n),
      (this.motionValue = i),
      (this.element = r),
      (this.isAsync = a));
  }
  scheduleResolve() {
    ((this.state = "scheduled"),
      this.isAsync
        ? (w.add(this), Z || ((Z = !0), E.read(Dt), E.resolveKeyframes(Lt)))
        : (this.readKeyframes(), this.complete()));
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, name: s, element: n, motionValue: i } = this;
    if (e[0] === null) {
      const r = i?.get(),
        a = e[e.length - 1];
      if (r !== void 0) e[0] = r;
      else if (n && s) {
        const l = n.readValue(s, a);
        l != null && (e[0] = l);
      }
      (e[0] === void 0 && (e[0] = a), i && r === void 0 && i.set(e[0]));
    }
    Ee(e);
  }
  setFinalKeyframe() {}
  measureInitialState() {}
  renderEndStyles() {}
  measureEndState() {}
  complete(e = !1) {
    ((this.state = "complete"),
      this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e),
      w.delete(this));
  }
  cancel() {
    this.state === "scheduled" && (w.delete(this), (this.state = "pending"));
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const Ke = (t) => t.startsWith("--");
function We(t, e, s) {
  Ke(e) ? t.style.setProperty(e, s) : (t.style[e] = s);
}
const $e = {};
function Kt(t, e) {
  const s = ie(t);
  return () => $e[e] ?? s();
}
const Ye = Kt(() => window.ScrollTimeline !== void 0, "scrollTimeline"),
  Wt = Kt(() => {
    try {
      document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
    } catch {
      return !1;
    }
    return !0;
  }, "linearEasing"),
  F = ([t, e, s, n]) => `cubic-bezier(${t}, ${e}, ${s}, ${n})`,
  mt = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: F([0, 0.65, 0.55, 1]),
    circOut: F([0.55, 0, 1, 0.45]),
    backIn: F([0.31, 0.01, 0.66, -0.59]),
    backOut: F([0.33, 1.53, 0.69, 0.99]),
  };
function $t(t, e) {
  if (t)
    return typeof t == "function"
      ? Wt()
        ? Ae(t, e)
        : "ease-out"
      : ae(t)
        ? F(t)
        : Array.isArray(t)
          ? t.map((s) => $t(s, e) || mt.easeOut)
          : mt[t];
}
function ze(
  t,
  e,
  s,
  {
    delay: n = 0,
    duration: i = 300,
    repeat: r = 0,
    repeatType: a = "loop",
    ease: l = "easeOut",
    times: u,
  } = {},
  h = void 0,
) {
  const c = { [e]: s };
  u && (c.offset = u);
  const f = $t(l, i);
  Array.isArray(f) && (c.easing = f);
  const d = {
    delay: n,
    duration: i,
    easing: Array.isArray(f) ? "linear" : f,
    fill: "both",
    iterations: r + 1,
    direction: a === "reverse" ? "alternate" : "normal",
  };
  return (h && (d.pseudoElement = h), t.animate(c, d));
}
function Xe(t) {
  return typeof t == "function" && "applyToOptions" in t;
}
function je({ type: t, ...e }) {
  return Xe(t) && Wt()
    ? t.applyToOptions(e)
    : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = "easeOut"), e);
}
class Ue extends Re {
  constructor(e) {
    if (
      (super(),
      (this.finishedTime = null),
      (this.isStopped = !1),
      (this.manualStartTime = null),
      !e)
    )
      return;
    const {
      element: s,
      name: n,
      keyframes: i,
      pseudoElement: r,
      allowFlatten: a = !1,
      finalKeyframe: l,
      onComplete: u,
    } = e;
    ((this.isPseudoElement = !!r),
      (this.allowFlatten = a),
      (this.options = e),
      ee(typeof e.type != "string"));
    const h = je(e);
    ((this.animation = ze(s, n, i, h, r)),
      h.autoplay === !1 && this.animation.pause(),
      (this.animation.onfinish = () => {
        if (((this.finishedTime = this.time), !r)) {
          const c = Pe(i, this.options, l, this.speed);
          (this.updateMotionValue ? this.updateMotionValue(c) : We(s, n, c),
            this.animation.cancel());
        }
        (u?.(), this.notifyFinished());
      }));
  }
  play() {
    this.isStopped ||
      ((this.manualStartTime = null),
      this.animation.play(),
      this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.finish?.();
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {}
  }
  stop() {
    if (this.isStopped) return;
    this.isStopped = !0;
    const { state: e } = this;
    e === "idle" ||
      e === "finished" ||
      (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(),
      this.isPseudoElement || this.cancel());
  }
  commitStyles() {
    const e = this.options?.element;
    !this.isPseudoElement && e?.isConnected && this.animation.commitStyles?.();
  }
  get duration() {
    const e = this.animation.effect?.getComputedTiming?.().duration || 0;
    return Y(Number(e));
  }
  get iterationDuration() {
    const { delay: e = 0 } = this.options || {};
    return this.duration + Y(e);
  }
  get time() {
    return Y(Number(this.animation.currentTime) || 0);
  }
  set time(e) {
    ((this.manualStartTime = null),
      (this.finishedTime = null),
      (this.animation.currentTime = Ft(e)));
  }
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(e) {
    (e < 0 && (this.finishedTime = null), (this.animation.playbackRate = e));
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(e) {
    this.manualStartTime = this.animation.startTime = e;
  }
  attachTimeline({ timeline: e, observe: s }) {
    return (
      this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }),
      (this.animation.onfinish = null),
      e && Ye() ? ((this.animation.timeline = e), Ct) : s(this)
    );
  }
}
function gt(t) {
  const e = [{}, {}];
  return (
    t?.values.forEach((s, n) => {
      ((e[0][n] = s.get()), (e[1][n] = s.getVelocity()));
    }),
    e
  );
}
function _e(t, e, s, n) {
  if (typeof e == "function") {
    const [i, r] = gt(n);
    e = e(s !== void 0 ? s : t.custom, i, r);
  }
  if ((typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function")) {
    const [i, r] = gt(n);
    e = e(s !== void 0 ? s : t.custom, i, r);
  }
  return e;
}
const yt = 30,
  Ze = (t) => !isNaN(parseFloat(t));
class Ge {
  constructor(e, s = {}) {
    ((this.canTrackVelocity = null),
      (this.events = {}),
      (this.updateAndNotify = (n) => {
        const i = P.now();
        if (
          (this.updatedAt !== i && this.setPrevFrameValue(),
          (this.prev = this.current),
          this.setCurrent(n),
          this.current !== this.prev && (this.events.change?.notify(this.current), this.dependents))
        )
          for (const r of this.dependents) r.dirty();
      }),
      (this.hasAnimated = !1),
      this.setCurrent(e),
      (this.owner = s.owner));
  }
  setCurrent(e) {
    ((this.current = e),
      (this.updatedAt = P.now()),
      this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = Ze(this.current)));
  }
  setPrevFrameValue(e = this.current) {
    ((this.prevFrameValue = e), (this.prevUpdatedAt = this.updatedAt));
  }
  onChange(e) {
    return this.on("change", e);
  }
  on(e, s) {
    this.events[e] || (this.events[e] = new At());
    const n = this.events[e].add(s);
    return e === "change"
      ? () => {
          (n(),
            E.read(() => {
              this.events.change.getSize() || this.stop();
            }));
        }
      : n;
  }
  clearListeners() {
    for (const e in this.events) this.events[e].clear();
  }
  attach(e, s) {
    ((this.passiveEffect = e), (this.stopPassiveEffect = s));
  }
  set(e) {
    this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e);
  }
  setWithVelocity(e, s, n) {
    (this.set(s),
      (this.prev = void 0),
      (this.prevFrameValue = e),
      (this.prevUpdatedAt = this.updatedAt - n));
  }
  jump(e, s = !0) {
    (this.updateAndNotify(e),
      (this.prev = e),
      (this.prevUpdatedAt = this.prevFrameValue = void 0),
      s && this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect());
  }
  dirty() {
    this.events.change?.notify(this.current);
  }
  addDependent(e) {
    (this.dependents || (this.dependents = new Set()), this.dependents.add(e));
  }
  removeDependent(e) {
    this.dependents && this.dependents.delete(e);
  }
  get() {
    return this.current;
  }
  getPrevious() {
    return this.prev;
  }
  getVelocity() {
    const e = P.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > yt)
      return 0;
    const s = Math.min(this.updatedAt - this.prevUpdatedAt, yt);
    return re(parseFloat(this.current) - parseFloat(this.prevFrameValue), s);
  }
  start(e) {
    return (
      this.stop(),
      new Promise((s) => {
        ((this.hasAnimated = !0),
          (this.animation = e(s)),
          this.events.animationStart && this.events.animationStart.notify());
      }).then(() => {
        (this.events.animationComplete && this.events.animationComplete.notify(),
          this.clearAnimation());
      })
    );
  }
  stop() {
    (this.animation &&
      (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()),
      this.clearAnimation());
  }
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  destroy() {
    (this.dependents?.clear(),
      this.events.destroy?.notify(),
      this.clearListeners(),
      this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect());
  }
}
function q(t, e) {
  return new Ge(t, e);
}
const g = (t) => !!(t && t.getVelocity);
function He(t) {
  return t.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
const qe = "framerAppearId",
  Zs = "data-" + He(qe),
  Qe = { test: (t) => t === "auto", parse: (t) => t },
  Yt = (t) => (e) => e.test(t),
  zt = [x, o, M, T, be, ye, Qe],
  Gs = (t) => zt.find(Yt(t)),
  Je = new Set(["brightness", "contrast", "saturate", "opacity"]);
function ts(t) {
  const [e, s] = t.slice(0, -1).split("(");
  if (e === "drop-shadow") return t;
  const [n] = s.match(et) || [];
  if (!n) return t;
  const i = s.replace(n, "");
  let r = Je.has(e) ? 1 : 0;
  return (n !== s && (r *= 100), e + "(" + r + i + ")");
}
const es = /\b([a-z-]*)\(.*?\)/gu,
  Q = {
    ...b,
    getAnimatableNone: (t) => {
      const e = t.match(es);
      return e ? e.map(ts).join(" ") : t;
    },
  },
  J = {
    ...b,
    getAnimatableNone: (t) => {
      const e = b.parse(t);
      return b.createTransformer(t)(
        e.map((n) => (typeof n == "number" ? 0 : typeof n == "object" ? { ...n, alpha: 1 } : n)),
      );
    },
  },
  bt = { ...x, transform: Math.round },
  ss = {
    rotate: T,
    rotateX: T,
    rotateY: T,
    rotateZ: T,
    scale: I,
    scaleX: I,
    scaleY: I,
    scaleZ: I,
    skew: T,
    skewX: T,
    skewY: T,
    distance: o,
    translateX: o,
    translateY: o,
    translateZ: o,
    x: o,
    y: o,
    z: o,
    perspective: o,
    transformPerspective: o,
    opacity: B,
    originX: ut,
    originY: ut,
    originZ: o,
  },
  it = {
    borderWidth: o,
    borderTopWidth: o,
    borderRightWidth: o,
    borderBottomWidth: o,
    borderLeftWidth: o,
    borderRadius: o,
    borderTopLeftRadius: o,
    borderTopRightRadius: o,
    borderBottomRightRadius: o,
    borderBottomLeftRadius: o,
    width: o,
    maxWidth: o,
    height: o,
    maxHeight: o,
    top: o,
    right: o,
    bottom: o,
    left: o,
    inset: o,
    insetBlock: o,
    insetBlockStart: o,
    insetBlockEnd: o,
    insetInline: o,
    insetInlineStart: o,
    insetInlineEnd: o,
    padding: o,
    paddingTop: o,
    paddingRight: o,
    paddingBottom: o,
    paddingLeft: o,
    paddingBlock: o,
    paddingBlockStart: o,
    paddingBlockEnd: o,
    paddingInline: o,
    paddingInlineStart: o,
    paddingInlineEnd: o,
    margin: o,
    marginTop: o,
    marginRight: o,
    marginBottom: o,
    marginLeft: o,
    marginBlock: o,
    marginBlockStart: o,
    marginBlockEnd: o,
    marginInline: o,
    marginInlineStart: o,
    marginInlineEnd: o,
    fontSize: o,
    backgroundPositionX: o,
    backgroundPositionY: o,
    ...ss,
    zIndex: bt,
    fillOpacity: B,
    strokeOpacity: B,
    numOctaves: bt,
  },
  ns = {
    ...it,
    color: p,
    backgroundColor: p,
    outlineColor: p,
    fill: p,
    stroke: p,
    borderColor: p,
    borderTopColor: p,
    borderRightColor: p,
    borderBottomColor: p,
    borderLeftColor: p,
    filter: Q,
    WebkitFilter: Q,
    mask: J,
    WebkitMask: J,
  },
  is = (t) => ns[t],
  rs = new Set([Q, J]);
function as(t, e) {
  let s = is(t);
  return (rs.has(s) || (s = b), s.getAnimatableNone ? s.getAnimatableNone(e) : void 0);
}
const os = new Set(["opacity", "clipPath", "filter", "transform"]),
  Xt = (t, e) => (e && typeof t == "number" ? e.transform(t) : t),
  { schedule: ls } = Pt(queueMicrotask, !1),
  us = [...zt, p, b],
  cs = (t) => us.find(Yt(t)),
  Vt = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 }),
  Hs = () => ({ x: Vt(), y: Vt() }),
  Tt = () => ({ min: 0, max: 0 }),
  hs = () => ({ x: Tt(), y: Tt() }),
  fs = new WeakMap();
function ds(t) {
  return t !== null && typeof t == "object" && typeof t.start == "function";
}
function ps(t) {
  return typeof t == "string" || Array.isArray(t);
}
const ms = ["animate", "whileInView", "whileFocus", "whileHover", "whileTap", "whileDrag", "exit"],
  gs = ["initial", ...ms];
function jt(t) {
  return ds(t.animate) || gs.some((e) => ps(t[e]));
}
function ys(t) {
  return !!(jt(t) || t.variants);
}
function bs(t, e, s) {
  for (const n in e) {
    const i = e[n],
      r = s[n];
    if (g(i)) t.addValue(n, i);
    else if (g(r)) t.addValue(n, q(i, { owner: t }));
    else if (r !== i)
      if (t.hasValue(n)) {
        const a = t.getValue(n);
        a.liveStyle === !0 ? a.jump(i) : a.hasAnimated || a.set(i);
      } else {
        const a = t.getStaticValue(n);
        t.addValue(n, q(a !== void 0 ? a : i, { owner: t }));
      }
  }
  for (const n in s) e[n] === void 0 && t.removeValue(n);
  return e;
}
const tt = { current: null },
  Ut = { current: !1 },
  Vs = typeof window < "u";
function Ts() {
  if (((Ut.current = !0), !!Vs))
    if (window.matchMedia) {
      const t = window.matchMedia("(prefers-reduced-motion)"),
        e = () => (tt.current = t.matches);
      (t.addEventListener("change", e), e());
    } else tt.current = !1;
}
const St = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete",
];
let W = {};
function _t(t) {
  W = t;
}
function Ss() {
  return W;
}
class qs {
  scrapeMotionValuesFromProps(e, s, n) {
    return {};
  }
  constructor(
    {
      parent: e,
      props: s,
      presenceContext: n,
      reducedMotionConfig: i,
      skipAnimations: r,
      blockInitialAnimation: a,
      visualState: l,
    },
    u = {},
  ) {
    ((this.current = null),
      (this.children = new Set()),
      (this.isVariantNode = !1),
      (this.isControllingVariants = !1),
      (this.shouldReduceMotion = null),
      (this.shouldSkipAnimations = !1),
      (this.values = new Map()),
      (this.KeyframeResolver = De),
      (this.features = {}),
      (this.valueSubscriptions = new Map()),
      (this.prevMotionValues = {}),
      (this.hasBeenMounted = !1),
      (this.events = {}),
      (this.propEventSubscriptions = {}),
      (this.notifyUpdate = () => this.notify("Update", this.latestValues)),
      (this.render = () => {
        this.current &&
          (this.triggerBuild(),
          this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
      }),
      (this.renderScheduledAt = 0),
      (this.scheduleRender = () => {
        const m = P.now();
        this.renderScheduledAt < m && ((this.renderScheduledAt = m), E.render(this.render, !1, !0));
      }));
    const { latestValues: h, renderState: c } = l;
    ((this.latestValues = h),
      (this.baseTarget = { ...h }),
      (this.initialValues = s.initial ? { ...h } : {}),
      (this.renderState = c),
      (this.parent = e),
      (this.props = s),
      (this.presenceContext = n),
      (this.depth = e ? e.depth + 1 : 0),
      (this.reducedMotionConfig = i),
      (this.skipAnimationsConfig = r),
      (this.options = u),
      (this.blockInitialAnimation = !!a),
      (this.isControllingVariants = jt(s)),
      (this.isVariantNode = ys(s)),
      this.isVariantNode && (this.variantChildren = new Set()),
      (this.manuallyAnimateOnMount = !!(e && e.current)));
    const { willChange: f, ...d } = this.scrapeMotionValuesFromProps(s, {}, this);
    for (const m in d) {
      const S = d[m];
      h[m] !== void 0 && g(S) && S.set(h[m]);
    }
  }
  mount(e) {
    if (this.hasBeenMounted)
      for (const s in this.initialValues)
        (this.values.get(s)?.jump(this.initialValues[s]),
          (this.latestValues[s] = this.initialValues[s]));
    ((this.current = e),
      fs.set(e, this),
      this.projection && !this.projection.instance && this.projection.mount(e),
      this.parent &&
        this.isVariantNode &&
        !this.isControllingVariants &&
        (this.removeFromVariantTree = this.parent.addVariantChild(this)),
      this.values.forEach((s, n) => this.bindToMotionValue(n, s)),
      this.reducedMotionConfig === "never"
        ? (this.shouldReduceMotion = !1)
        : this.reducedMotionConfig === "always"
          ? (this.shouldReduceMotion = !0)
          : (Ut.current || Ts(), (this.shouldReduceMotion = tt.current)),
      (this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1),
      this.parent?.addChild(this),
      this.update(this.props, this.presenceContext),
      (this.hasBeenMounted = !0));
  }
  unmount() {
    (this.projection && this.projection.unmount(),
      at(this.notifyUpdate),
      at(this.render),
      this.valueSubscriptions.forEach((e) => e()),
      this.valueSubscriptions.clear(),
      this.removeFromVariantTree && this.removeFromVariantTree(),
      this.parent?.removeChild(this));
    for (const e in this.events) this.events[e].clear();
    for (const e in this.features) {
      const s = this.features[e];
      s && (s.unmount(), (s.isMounted = !1));
    }
    this.current = null;
  }
  addChild(e) {
    (this.children.add(e),
      this.enteringChildren ?? (this.enteringChildren = new Set()),
      this.enteringChildren.add(e));
  }
  removeChild(e) {
    (this.children.delete(e), this.enteringChildren && this.enteringChildren.delete(e));
  }
  bindToMotionValue(e, s) {
    if (
      (this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)(),
      s.accelerate && os.has(e) && this.current instanceof HTMLElement)
    ) {
      const { factory: a, keyframes: l, times: u, ease: h, duration: c } = s.accelerate,
        f = new Ue({
          element: this.current,
          name: e,
          keyframes: l,
          times: u,
          ease: h,
          duration: Ft(c),
        }),
        d = a(f);
      this.valueSubscriptions.set(e, () => {
        (d(), f.cancel());
      });
      return;
    }
    const n = nt.has(e);
    n && this.onBindTransform && this.onBindTransform();
    const i = s.on("change", (a) => {
      ((this.latestValues[e] = a),
        this.props.onUpdate && E.preRender(this.notifyUpdate),
        n && this.projection && (this.projection.isTransformDirty = !0),
        this.scheduleRender());
    });
    let r;
    (typeof window < "u" &&
      window.MotionCheckAppearSync &&
      (r = window.MotionCheckAppearSync(this, e, s)),
      this.valueSubscriptions.set(e, () => {
        (i(), r && r(), s.owner && s.stop());
      }));
  }
  sortNodePosition(e) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== e.type
      ? 0
      : this.sortInstanceNodePosition(this.current, e.current);
  }
  updateFeatures() {
    let e = "animation";
    for (e in W) {
      const s = W[e];
      if (!s) continue;
      const { isEnabled: n, Feature: i } = s;
      if (
        (!this.features[e] && i && n(this.props) && (this.features[e] = new i(this)),
        this.features[e])
      ) {
        const r = this.features[e];
        r.isMounted ? r.update() : (r.mount(), (r.isMounted = !0));
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : hs();
  }
  getStaticValue(e) {
    return this.latestValues[e];
  }
  setStaticValue(e, s) {
    this.latestValues[e] = s;
  }
  update(e, s) {
    ((e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(),
      (this.prevProps = this.props),
      (this.props = e),
      (this.prevPresenceContext = this.presenceContext),
      (this.presenceContext = s));
    for (let n = 0; n < St.length; n++) {
      const i = St[n];
      this.propEventSubscriptions[i] &&
        (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
      const r = "on" + i,
        a = e[r];
      a && (this.propEventSubscriptions[i] = this.on(i, a));
    }
    ((this.prevMotionValues = bs(
      this,
      this.scrapeMotionValuesFromProps(e, this.prevProps || {}, this),
      this.prevMotionValues,
    )),
      this.handleChildMotionValue && this.handleChildMotionValue());
  }
  getProps() {
    return this.props;
  }
  getVariant(e) {
    return this.props.variants ? this.props.variants[e] : void 0;
  }
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  addVariantChild(e) {
    const s = this.getClosestVariantNode();
    if (s)
      return (s.variantChildren && s.variantChildren.add(e), () => s.variantChildren.delete(e));
  }
  addValue(e, s) {
    const n = this.values.get(e);
    s !== n &&
      (n && this.removeValue(e),
      this.bindToMotionValue(e, s),
      this.values.set(e, s),
      (this.latestValues[e] = s.get()));
  }
  removeValue(e) {
    this.values.delete(e);
    const s = this.valueSubscriptions.get(e);
    (s && (s(), this.valueSubscriptions.delete(e)),
      delete this.latestValues[e],
      this.removeValueFromRenderState(e, this.renderState));
  }
  hasValue(e) {
    return this.values.has(e);
  }
  getValue(e, s) {
    if (this.props.values && this.props.values[e]) return this.props.values[e];
    let n = this.values.get(e);
    return (
      n === void 0 &&
        s !== void 0 &&
        ((n = q(s === null ? void 0 : s, { owner: this })), this.addValue(e, n)),
      n
    );
  }
  readValue(e, s) {
    let n =
      this.latestValues[e] !== void 0 || !this.current
        ? this.latestValues[e]
        : (this.getBaseTargetFromProps(this.props, e) ??
          this.readValueFromInstance(this.current, e, this.options));
    return (
      n != null &&
        (typeof n == "string" && (se(n) || ne(n))
          ? (n = parseFloat(n))
          : !cs(n) && b.test(s) && (n = as(e, s)),
        this.setBaseTarget(e, g(n) ? n.get() : n)),
      g(n) ? n.get() : n
    );
  }
  setBaseTarget(e, s) {
    this.baseTarget[e] = s;
  }
  getBaseTarget(e) {
    const { initial: s } = this.props;
    let n;
    if (typeof s == "string" || typeof s == "object") {
      const r = _e(this.props, s, this.presenceContext?.custom);
      r && (n = r[e]);
    }
    if (s && n !== void 0) return n;
    const i = this.getBaseTargetFromProps(this.props, e);
    return i !== void 0 && !g(i)
      ? i
      : this.initialValues[e] !== void 0 && n === void 0
        ? void 0
        : this.baseTarget[e];
  }
  on(e, s) {
    return (this.events[e] || (this.events[e] = new At()), this.events[e].add(s));
  }
  notify(e, ...s) {
    this.events[e] && this.events[e].notify(...s);
  }
  scheduleRenderMicrotask() {
    ls.render(this.render);
  }
}
const vs = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective",
  },
  ws = O.length;
function Ms(t, e, s) {
  let n = "",
    i = !0;
  for (let r = 0; r < ws; r++) {
    const a = O[r],
      l = t[a];
    if (l === void 0) continue;
    let u = !0;
    if (typeof l == "number") u = l === (a.startsWith("scale") ? 1 : 0);
    else {
      const h = parseFloat(l);
      u = a.startsWith("scale") ? h === 1 : h === 0;
    }
    if (!u || s) {
      const h = Xt(l, it[a]);
      if (!u) {
        i = !1;
        const c = vs[a] || a;
        n += `${c}(${h}) `;
      }
      s && (e[a] = h);
    }
  }
  return ((n = n.trim()), s ? (n = s(e, i ? "" : n)) : i && (n = "none"), n);
}
function xs(t, e, s) {
  const { style: n, vars: i, transformOrigin: r } = t;
  let a = !1,
    l = !1;
  for (const u in e) {
    const h = e[u];
    if (nt.has(u)) {
      a = !0;
      continue;
    } else if (ce(u)) {
      i[u] = h;
      continue;
    } else {
      const c = Xt(h, it[u]);
      u.startsWith("origin") ? ((l = !0), (r[u] = c)) : (n[u] = c);
    }
  }
  if (
    (e.transform ||
      (a || s ? (n.transform = Ms(e, t.transform, s)) : n.transform && (n.transform = "none")),
    l)
  ) {
    const { originX: u = "50%", originY: h = "50%", originZ: c = 0 } = r;
    n.transformOrigin = `${u} ${h} ${c}`;
  }
}
function vt(t, e) {
  return e.max === e.min ? 0 : (t / (e.max - e.min)) * 100;
}
const C = {
    correct: (t, e) => {
      if (!e.target) return t;
      if (typeof t == "string")
        if (o.test(t)) t = parseFloat(t);
        else return t;
      const s = vt(t, e.target.x),
        n = vt(t, e.target.y);
      return `${s}% ${n}%`;
    },
  },
  Cs = {
    correct: (t, { treeScale: e, projectionDelta: s }) => {
      const n = t,
        i = b.parse(t);
      if (i.length > 5) return n;
      const r = b.createTransformer(t),
        a = typeof i[0] != "number" ? 1 : 0,
        l = s.x.scale * e.x,
        u = s.y.scale * e.y;
      ((i[0 + a] /= l), (i[1 + a] /= u));
      const h = Ce(l, u, 0.5);
      return (
        typeof i[2 + a] == "number" && (i[2 + a] /= h),
        typeof i[3 + a] == "number" && (i[3 + a] /= h),
        r(i)
      );
    },
  },
  As = {
    borderRadius: {
      ...C,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
      ],
    },
    borderTopLeftRadius: C,
    borderTopRightRadius: C,
    borderBottomLeftRadius: C,
    borderBottomRightRadius: C,
    boxShadow: Cs,
  };
function Fs(t, { layout: e, layoutId: s }) {
  return (
    nt.has(t) || t.startsWith("origin") || ((e || s !== void 0) && (!!As[t] || t === "opacity"))
  );
}
function Ps(t, e, s) {
  const n = t.style,
    i = e?.style,
    r = {};
  if (!n) return r;
  for (const a in n)
    (g(n[a]) || (i && g(i[a])) || Fs(a, t) || s?.getValue(a)?.liveStyle !== void 0) &&
      (r[a] = n[a]);
  return r;
}
const Rs = { offset: "stroke-dashoffset", array: "stroke-dasharray" },
  Es = { offset: "strokeDashoffset", array: "strokeDasharray" };
function Bs(t, e, s = 1, n = 0, i = !0) {
  t.pathLength = 1;
  const r = i ? Rs : Es;
  ((t[r.offset] = `${-n}`), (t[r.array] = `${e} ${s}`));
}
const Ns = ["offsetDistance", "offsetPath", "offsetRotate", "offsetAnchor"];
function Qs(
  t,
  { attrX: e, attrY: s, attrScale: n, pathLength: i, pathSpacing: r = 1, pathOffset: a = 0, ...l },
  u,
  h,
  c,
) {
  if ((xs(t, l, h), u)) {
    t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
    return;
  }
  ((t.attrs = t.style), (t.style = {}));
  const { attrs: f, style: d } = t;
  (f.transform && ((d.transform = f.transform), delete f.transform),
    (d.transform || f.transformOrigin) &&
      ((d.transformOrigin = f.transformOrigin ?? "50% 50%"), delete f.transformOrigin),
    d.transform && ((d.transformBox = c?.transformBox ?? "fill-box"), delete f.transformBox));
  for (const m of Ns) f[m] !== void 0 && ((d[m] = f[m]), delete f[m]);
  (e !== void 0 && (f.x = e),
    s !== void 0 && (f.y = s),
    n !== void 0 && (f.scale = n),
    i !== void 0 && Bs(f, i, r, a, !1));
}
const Js = (t) => typeof t == "string" && t.toLowerCase() === "svg";
function tn(t, e, s) {
  const n = Ps(t, e, s);
  for (const i in t)
    if (g(t[i]) || g(e[i])) {
      const r = O.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
      n[r] = t[i];
    }
  return n;
}
function en(t) {
  return g(t) ? t.get() : t;
}
const sn = $.createContext({ strict: !1 }),
  wt = {
    animation: [
      "animate",
      "variants",
      "whileHover",
      "whileTap",
      "exit",
      "whileInView",
      "whileFocus",
      "whileDrag",
    ],
    exit: ["exit"],
    drag: ["drag", "dragControls"],
    focus: ["whileFocus"],
    hover: ["whileHover", "onHoverStart", "onHoverEnd"],
    tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
    pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
    inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
    layout: ["layout", "layoutId"],
  };
let Mt = !1;
function Os() {
  if (Mt) return;
  const t = {};
  for (const e in wt) t[e] = { isEnabled: (s) => wt[e].some((n) => !!s[n]) };
  (_t(t), (Mt = !0));
}
function ks() {
  return (Os(), Ss());
}
function nn(t) {
  const e = ks();
  for (const s in t) e[s] = { ...e[s], ...t[s] };
  _t(e);
}
const Is = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view",
];
function rn(t) {
  return typeof t != "string" || t.includes("-") ? !1 : !!(Is.indexOf(t) > -1 || /[A-Z]/u.test(t));
}
const an = $.createContext({});
function on(t) {
  return t && typeof t == "object" && Object.prototype.hasOwnProperty.call(t, "current");
}
export {
  Js as $,
  _e as A,
  O as B,
  q as C,
  g as D,
  Zs as E,
  ne as F,
  as as G,
  Gs as H,
  Xs as I,
  K as J,
  De as K,
  Ws as L,
  X as M,
  Ue as N,
  Us as O,
  $s as P,
  pt as Q,
  js as R,
  ce as S,
  xs as T,
  Ps as U,
  qs as V,
  Re as W,
  He as X,
  hs as Y,
  tn as Z,
  Qs as _,
  ee as a,
  is as a0,
  ps as a1,
  gs as a2,
  ds as a3,
  ms as a4,
  M as a5,
  o as a6,
  Jt as a7,
  te as a8,
  At as a9,
  Ys as aa,
  ls as ab,
  Hs as ac,
  en as ad,
  As as ae,
  nn as af,
  sn as ag,
  rn as ah,
  on as ai,
  an as aj,
  jt as ak,
  Fs as al,
  ys as am,
  ks as an,
  lt as b,
  zs as c,
  p as d,
  b as e,
  Ot as f,
  ot as g,
  L as h,
  ae as i,
  at as j,
  E as k,
  Y as l,
  Ce as m,
  Ct as n,
  xt as o,
  Ae as p,
  Pe as q,
  A as r,
  Ft as s,
  P as t,
  Xe as u,
  re as v,
  ie as w,
  _s as x,
  se as y,
  nt as z,
};
