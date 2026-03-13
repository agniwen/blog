import { r as O, j as ee } from "./main-Cq61YlVT.js";
import {
  n as N,
  i as Mi,
  a as Tn,
  m as A,
  r as Pn,
  h as wn,
  b as Ri,
  c as ne,
  d as ve,
  e as Sn,
  f as Gt,
  g as L,
  t as U,
  j as et,
  k as V,
  l as W,
  v as ki,
  o as K,
  s as G,
  p as Ii,
  M as nt,
  W as Dn,
  q as An,
  N as Bi,
  u as ji,
  w as Oi,
  K as Vn,
  x as Fi,
  y as Ui,
  z as ie,
  A as Ni,
  B as Wi,
  C as se,
  D as oe,
  E as Gi,
  F as Ki,
  G as Hi,
  H as xe,
  I as Te,
  J as ft,
  O as Pe,
  V as zi,
  Q as _i,
  R as $i,
  S as Xi,
  T as Yi,
  U as qi,
  X as En,
  Y as E,
  Z as Zi,
  _ as Ji,
  $ as Qi,
  a0 as ts,
  a1 as bn,
  a2 as Cn,
  a3 as Ln,
  a4 as Mn,
  a5 as xt,
  a6 as es,
  a7 as Rn,
  a8 as Kt,
  a9 as ns,
  aa as At,
  ab as kn,
  ac as q,
  ad as Vt,
  ae as we,
  P as is,
  af as Se,
  ag as ss,
  ah as os,
  ai as it,
  L as rs,
  aj as as,
} from "./is-ref-object-f5CSWQ4m.js";
import { r as In } from "./resolve-elements-DE4kZt9S.js";
function Bn(t) {
  return typeof t == "object" && t !== null;
}
const ls = (t, e) => (n) => e(t(n)),
  ct = (...t) => t.reduce(ls),
  at = (t, e, n) => {
    const i = e - t;
    return i === 0 ? 1 : (n - t) / i;
  },
  jn = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t,
  cs = 1e-7,
  us = 12;
function hs(t, e, n, i, s) {
  let r,
    o,
    a = 0;
  do ((o = e + (n - e) / 2), (r = jn(o, i, s) - t), r > 0 ? (n = o) : (e = o));
  while (Math.abs(r) > cs && ++a < us);
  return o;
}
function ut(t, e, n, i) {
  if (t === e && n === i) return N;
  const s = (r) => hs(r, 0, 1, t, n);
  return (r) => (r === 0 || r === 1 ? r : jn(s(r), e, i));
}
const On = (t) => (e) => (e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2),
  Fn = (t) => (e) => 1 - t(1 - e),
  Un = ut(0.33, 1.53, 0.69, 0.99),
  re = Fn(Un),
  Nn = On(re),
  Wn = (t) => ((t *= 2) < 1 ? 0.5 * re(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1)))),
  ae = (t) => 1 - Math.sin(Math.acos(t)),
  Gn = Fn(ae),
  Kn = On(ae),
  fs = ut(0.42, 0, 1, 1),
  ds = ut(0, 0, 0.58, 1),
  Hn = ut(0.42, 0, 0.58, 1),
  ms = (t) => Array.isArray(t) && typeof t[0] != "number",
  ps = {
    linear: N,
    easeIn: fs,
    easeInOut: Hn,
    easeOut: ds,
    circIn: ae,
    circInOut: Kn,
    circOut: Gn,
    backIn: re,
    backInOut: Nn,
    backOut: Un,
    anticipate: Wn,
  },
  ys = (t) => typeof t == "string",
  De = (t) => {
    if (Mi(t)) {
      Tn(t.length === 4);
      const [e, n, i, s] = t;
      return ut(e, n, i, s);
    } else if (ys(t)) return ps[t];
    return t;
  };
function Et(t, e, n) {
  return (
    n < 0 && (n += 1),
    n > 1 && (n -= 1),
    n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t
  );
}
function gs({ hue: t, saturation: e, lightness: n, alpha: i }) {
  ((t /= 360), (e /= 100), (n /= 100));
  let s = 0,
    r = 0,
    o = 0;
  if (!e) s = r = o = n;
  else {
    const a = n < 0.5 ? n * (1 + e) : n + e - n * e,
      l = 2 * n - a;
    ((s = Et(l, a, t + 1 / 3)), (r = Et(l, a, t)), (o = Et(l, a, t - 1 / 3)));
  }
  return {
    red: Math.round(s * 255),
    green: Math.round(r * 255),
    blue: Math.round(o * 255),
    alpha: i,
  };
}
function Tt(t, e) {
  return (n) => (n > 0 ? e : t);
}
const bt = (t, e, n) => {
    const i = t * t,
      s = n * (e * e - i) + i;
    return s < 0 ? 0 : Math.sqrt(s);
  },
  vs = [Ri, Pn, wn],
  xs = (t) => vs.find((e) => e.test(t));
function Ae(t) {
  const e = xs(t);
  if (!e) return !1;
  let n = e.parse(t);
  return (e === wn && (n = gs(n)), n);
}
const Ve = (t, e) => {
    const n = Ae(t),
      i = Ae(e);
    if (!n || !i) return Tt(t, e);
    const s = { ...n };
    return (r) => (
      (s.red = bt(n.red, i.red, r)),
      (s.green = bt(n.green, i.green, r)),
      (s.blue = bt(n.blue, i.blue, r)),
      (s.alpha = A(n.alpha, i.alpha, r)),
      Pn.transform(s)
    );
  },
  Ht = new Set(["none", "hidden"]);
function Ts(t, e) {
  return Ht.has(t) ? (n) => (n <= 0 ? t : e) : (n) => (n >= 1 ? e : t);
}
function Ps(t, e) {
  return (n) => A(t, e, n);
}
function le(t) {
  return typeof t == "number"
    ? Ps
    : typeof t == "string"
      ? ne(t)
        ? Tt
        : ve.test(t)
          ? Ve
          : Ds
      : Array.isArray(t)
        ? zn
        : typeof t == "object"
          ? ve.test(t)
            ? Ve
            : ws
          : Tt;
}
function zn(t, e) {
  const n = [...t],
    i = n.length,
    s = t.map((r, o) => le(r)(r, e[o]));
  return (r) => {
    for (let o = 0; o < i; o++) n[o] = s[o](r);
    return n;
  };
}
function ws(t, e) {
  const n = { ...t, ...e },
    i = {};
  for (const s in n) t[s] !== void 0 && e[s] !== void 0 && (i[s] = le(t[s])(t[s], e[s]));
  return (s) => {
    for (const r in i) n[r] = i[r](s);
    return n;
  };
}
function Ss(t, e) {
  const n = [],
    i = { color: 0, var: 0, number: 0 };
  for (let s = 0; s < e.values.length; s++) {
    const r = e.types[s],
      o = t.indexes[r][i[r]],
      a = t.values[o] ?? 0;
    ((n[s] = a), i[r]++);
  }
  return n;
}
const Ds = (t, e) => {
  const n = Sn.createTransformer(e),
    i = Gt(t),
    s = Gt(e);
  return i.indexes.var.length === s.indexes.var.length &&
    i.indexes.color.length === s.indexes.color.length &&
    i.indexes.number.length >= s.indexes.number.length
    ? (Ht.has(t) && !s.values.length) || (Ht.has(e) && !i.values.length)
      ? Ts(t, e)
      : ct(zn(Ss(i, s), s.values), n)
    : Tt(t, e);
};
function _n(t, e, n) {
  return typeof t == "number" && typeof e == "number" && typeof n == "number"
    ? A(t, e, n)
    : le(t)(t, e);
}
const As = (t) => {
    const e = ({ timestamp: n }) => t(n);
    return {
      start: (n = !0) => V.update(e, n),
      stop: () => et(e),
      now: () => (L.isProcessing ? L.timestamp : U.now()),
    };
  },
  Pt = 2e4;
function ce(t) {
  let e = 0;
  const n = 50;
  let i = t.next(e);
  for (; !i.done && e < Pt; ) ((e += n), (i = t.next(e)));
  return e >= Pt ? 1 / 0 : e;
}
function Vs(t, e = 100, n) {
  const i = n({ ...t, keyframes: [0, e] }),
    s = Math.min(ce(i), Pt);
  return { type: "keyframes", ease: (r) => i.next(s * r).value / e, duration: W(s) };
}
const Es = 5;
function $n(t, e, n) {
  const i = Math.max(e - Es, 0);
  return ki(n - t(i), e - i);
}
const D = {
    stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
    duration: 800,
    bounce: 0.3,
    visualDuration: 0.3,
    restSpeed: { granular: 0.01, default: 2 },
    restDelta: { granular: 0.005, default: 0.5 },
    minDuration: 0.01,
    maxDuration: 10,
    minDamping: 0.05,
    maxDamping: 1,
  },
  Ct = 0.001;
function bs({
  duration: t = D.duration,
  bounce: e = D.bounce,
  velocity: n = D.velocity,
  mass: i = D.mass,
}) {
  let s,
    r,
    o = 1 - e;
  ((o = K(D.minDamping, D.maxDamping, o)),
    (t = K(D.minDuration, D.maxDuration, W(t))),
    o < 1
      ? ((s = (c) => {
          const u = c * o,
            h = u * t,
            f = u - n,
            d = zt(c, o),
            m = Math.exp(-h);
          return Ct - (f / d) * m;
        }),
        (r = (c) => {
          const h = c * o * t,
            f = h * n + n,
            d = Math.pow(o, 2) * Math.pow(c, 2) * t,
            m = Math.exp(-h),
            g = zt(Math.pow(c, 2), o);
          return ((-s(c) + Ct > 0 ? -1 : 1) * ((f - d) * m)) / g;
        }))
      : ((s = (c) => {
          const u = Math.exp(-c * t),
            h = (c - n) * t + 1;
          return -Ct + u * h;
        }),
        (r = (c) => {
          const u = Math.exp(-c * t),
            h = (n - c) * (t * t);
          return u * h;
        })));
  const a = 5 / t,
    l = Ls(s, r, a);
  if (((t = G(t)), isNaN(l))) return { stiffness: D.stiffness, damping: D.damping, duration: t };
  {
    const c = Math.pow(l, 2) * i;
    return { stiffness: c, damping: o * 2 * Math.sqrt(i * c), duration: t };
  }
}
const Cs = 12;
function Ls(t, e, n) {
  let i = n;
  for (let s = 1; s < Cs; s++) i = i - t(i) / e(i);
  return i;
}
function zt(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const Ms = ["duration", "bounce"],
  Rs = ["stiffness", "damping", "mass"];
function Ee(t, e) {
  return e.some((n) => t[n] !== void 0);
}
function ks(t) {
  let e = {
    velocity: D.velocity,
    stiffness: D.stiffness,
    damping: D.damping,
    mass: D.mass,
    isResolvedFromDuration: !1,
    ...t,
  };
  if (!Ee(t, Rs) && Ee(t, Ms))
    if (((e.velocity = 0), t.visualDuration)) {
      const n = t.visualDuration,
        i = (2 * Math.PI) / (n * 1.2),
        s = i * i,
        r = 2 * K(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(s);
      e = { ...e, mass: D.mass, stiffness: s, damping: r };
    } else {
      const n = bs({ ...t, velocity: 0 });
      ((e = { ...e, ...n, mass: D.mass }), (e.isResolvedFromDuration = !0));
    }
  return e;
}
function wt(t = D.visualDuration, e = D.bounce) {
  const n = typeof t != "object" ? { visualDuration: t, keyframes: [0, 1], bounce: e } : t;
  let { restSpeed: i, restDelta: s } = n;
  const r = n.keyframes[0],
    o = n.keyframes[n.keyframes.length - 1],
    a = { done: !1, value: r },
    {
      stiffness: l,
      damping: c,
      mass: u,
      duration: h,
      velocity: f,
      isResolvedFromDuration: d,
    } = ks({ ...n, velocity: -W(n.velocity || 0) }),
    m = f || 0,
    g = c / (2 * Math.sqrt(l * u)),
    y = o - r,
    p = W(Math.sqrt(l / u)),
    v = Math.abs(y) < 5;
  (i || (i = v ? D.restSpeed.granular : D.restSpeed.default),
    s || (s = v ? D.restDelta.granular : D.restDelta.default));
  let x;
  if (g < 1) {
    const T = zt(p, g);
    x = (S) => {
      const b = Math.exp(-g * p * S);
      return o - b * (((m + g * p * y) / T) * Math.sin(T * S) + y * Math.cos(T * S));
    };
  } else if (g === 1) x = (T) => o - Math.exp(-p * T) * (y + (m + p * y) * T);
  else {
    const T = p * Math.sqrt(g * g - 1);
    x = (S) => {
      const b = Math.exp(-g * p * S),
        P = Math.min(T * S, 300);
      return o - (b * ((m + g * p * y) * Math.sinh(P) + T * y * Math.cosh(P))) / T;
    };
  }
  const w = {
    calculatedDuration: (d && h) || null,
    next: (T) => {
      const S = x(T);
      if (d) a.done = T >= h;
      else {
        let b = T === 0 ? m : 0;
        g < 1 && (b = T === 0 ? G(m) : $n(x, T, S));
        const P = Math.abs(b) <= i,
          R = Math.abs(o - S) <= s;
        a.done = P && R;
      }
      return ((a.value = a.done ? o : S), a);
    },
    toString: () => {
      const T = Math.min(ce(w), Pt),
        S = Ii((b) => w.next(T * b).value, T, 30);
      return T + "ms " + S;
    },
    toTransition: () => {},
  };
  return w;
}
wt.applyToOptions = (t) => {
  const e = Vs(t, 100, wt);
  return ((t.ease = e.ease), (t.duration = G(e.duration)), (t.type = "keyframes"), t);
};
function _t({
  keyframes: t,
  velocity: e = 0,
  power: n = 0.8,
  timeConstant: i = 325,
  bounceDamping: s = 10,
  bounceStiffness: r = 500,
  modifyTarget: o,
  min: a,
  max: l,
  restDelta: c = 0.5,
  restSpeed: u,
}) {
  const h = t[0],
    f = { done: !1, value: h },
    d = (P) => (a !== void 0 && P < a) || (l !== void 0 && P > l),
    m = (P) => (a === void 0 ? l : l === void 0 || Math.abs(a - P) < Math.abs(l - P) ? a : l);
  let g = n * e;
  const y = h + g,
    p = o === void 0 ? y : o(y);
  p !== y && (g = p - h);
  const v = (P) => -g * Math.exp(-P / i),
    x = (P) => p + v(P),
    w = (P) => {
      const R = v(P),
        k = x(P);
      ((f.done = Math.abs(R) <= c), (f.value = f.done ? p : k));
    };
  let T, S;
  const b = (P) => {
    d(f.value) &&
      ((T = P),
      (S = wt({
        keyframes: [f.value, m(f.value)],
        velocity: $n(x, P, f.value),
        damping: s,
        stiffness: r,
        restDelta: c,
        restSpeed: u,
      })));
  };
  return (
    b(0),
    {
      calculatedDuration: null,
      next: (P) => {
        let R = !1;
        return (
          !S && T === void 0 && ((R = !0), w(P), b(P)),
          T !== void 0 && P >= T ? S.next(P - T) : (!R && w(P), f)
        );
      },
    }
  );
}
function Is(t, e, n) {
  const i = [],
    s = n || nt.mix || _n,
    r = t.length - 1;
  for (let o = 0; o < r; o++) {
    let a = s(t[o], t[o + 1]);
    if (e) {
      const l = Array.isArray(e) ? e[o] || N : e;
      a = ct(l, a);
    }
    i.push(a);
  }
  return i;
}
function Bs(t, e, { clamp: n = !0, ease: i, mixer: s } = {}) {
  const r = t.length;
  if ((Tn(r === e.length), r === 1)) return () => e[0];
  if (r === 2 && e[0] === e[1]) return () => e[1];
  const o = t[0] === t[1];
  t[0] > t[r - 1] && ((t = [...t].reverse()), (e = [...e].reverse()));
  const a = Is(e, i, s),
    l = a.length,
    c = (u) => {
      if (o && u < t[0]) return e[0];
      let h = 0;
      if (l > 1) for (; h < t.length - 2 && !(u < t[h + 1]); h++);
      const f = at(t[h], t[h + 1], u);
      return a[h](f);
    };
  return n ? (u) => c(K(t[0], t[r - 1], u)) : c;
}
function js(t, e) {
  const n = t[t.length - 1];
  for (let i = 1; i <= e; i++) {
    const s = at(0, e, i);
    t.push(A(n, 1, s));
  }
}
function Os(t) {
  const e = [0];
  return (js(e, t.length - 1), e);
}
function Fs(t, e) {
  return t.map((n) => n * e);
}
function Us(t, e) {
  return t.map(() => e || Hn).splice(0, t.length - 1);
}
function st({ duration: t = 300, keyframes: e, times: n, ease: i = "easeInOut" }) {
  const s = ms(i) ? i.map(De) : De(i),
    r = { done: !1, value: e[0] },
    o = Fs(n && n.length === e.length ? n : Os(e), t),
    a = Bs(o, e, { ease: Array.isArray(s) ? s : Us(e, s) });
  return { calculatedDuration: t, next: (l) => ((r.value = a(l)), (r.done = l >= t), r) };
}
const Ns = { decay: _t, inertia: _t, tween: st, keyframes: st, spring: wt };
function Xn(t) {
  typeof t.type == "string" && (t.type = Ns[t.type]);
}
const Ws = (t) => t / 100;
class ue extends Dn {
  constructor(e) {
    (super(),
      (this.state = "idle"),
      (this.startTime = null),
      (this.isStopped = !1),
      (this.currentTime = 0),
      (this.holdTime = null),
      (this.playbackSpeed = 1),
      (this.stop = () => {
        const { motionValue: n } = this.options;
        (n && n.updatedAt !== U.now() && this.tick(U.now()),
          (this.isStopped = !0),
          this.state !== "idle" && (this.teardown(), this.options.onStop?.()));
      }),
      (this.options = e),
      this.initAnimation(),
      this.play(),
      e.autoplay === !1 && this.pause());
  }
  initAnimation() {
    const { options: e } = this;
    Xn(e);
    const { type: n = st, repeat: i = 0, repeatDelay: s = 0, repeatType: r, velocity: o = 0 } = e;
    let { keyframes: a } = e;
    const l = n || st;
    l !== st &&
      typeof a[0] != "number" &&
      ((this.mixKeyframes = ct(Ws, _n(a[0], a[1]))), (a = [0, 100]));
    const c = l({ ...e, keyframes: a });
    (r === "mirror" &&
      (this.mirroredGenerator = l({ ...e, keyframes: [...a].reverse(), velocity: -o })),
      c.calculatedDuration === null && (c.calculatedDuration = ce(c)));
    const { calculatedDuration: u } = c;
    ((this.calculatedDuration = u),
      (this.resolvedDuration = u + s),
      (this.totalDuration = this.resolvedDuration * (i + 1) - s),
      (this.generator = c));
  }
  updateTime(e) {
    const n = Math.round(e - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? (this.currentTime = this.holdTime) : (this.currentTime = n);
  }
  tick(e, n = !1) {
    const {
      generator: i,
      totalDuration: s,
      mixKeyframes: r,
      mirroredGenerator: o,
      resolvedDuration: a,
      calculatedDuration: l,
    } = this;
    if (this.startTime === null) return i.next(0);
    const {
      delay: c = 0,
      keyframes: u,
      repeat: h,
      repeatType: f,
      repeatDelay: d,
      type: m,
      onUpdate: g,
      finalKeyframe: y,
    } = this.options;
    (this.speed > 0
      ? (this.startTime = Math.min(this.startTime, e))
      : this.speed < 0 && (this.startTime = Math.min(e - s / this.speed, this.startTime)),
      n ? (this.currentTime = e) : this.updateTime(e));
    const p = this.currentTime - c * (this.playbackSpeed >= 0 ? 1 : -1),
      v = this.playbackSpeed >= 0 ? p < 0 : p > s;
    ((this.currentTime = Math.max(p, 0)),
      this.state === "finished" && this.holdTime === null && (this.currentTime = s));
    let x = this.currentTime,
      w = i;
    if (h) {
      const P = Math.min(this.currentTime, s) / a;
      let R = Math.floor(P),
        k = P % 1;
      (!k && P >= 1 && (k = 1),
        k === 1 && R--,
        (R = Math.min(R, h + 1)),
        R % 2 && (f === "reverse" ? ((k = 1 - k), d && (k -= d / a)) : f === "mirror" && (w = o)),
        (x = K(0, 1, k) * a));
    }
    const T = v ? { done: !1, value: u[0] } : w.next(x);
    r && (T.value = r(T.value));
    let { done: S } = T;
    !v &&
      l !== null &&
      (S = this.playbackSpeed >= 0 ? this.currentTime >= s : this.currentTime <= 0);
    const b =
      this.holdTime === null && (this.state === "finished" || (this.state === "running" && S));
    return (
      b && m !== _t && (T.value = An(u, this.options, y, this.speed)),
      g && g(T.value),
      b && this.finish(),
      T
    );
  }
  then(e, n) {
    return this.finished.then(e, n);
  }
  get duration() {
    return W(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: e = 0 } = this.options || {};
    return this.duration + W(e);
  }
  get time() {
    return W(this.currentTime);
  }
  set time(e) {
    ((e = G(e)),
      (this.currentTime = e),
      this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0
        ? (this.holdTime = e)
        : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed),
      this.driver?.start(!1));
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(e) {
    this.updateTime(U.now());
    const n = this.playbackSpeed !== e;
    ((this.playbackSpeed = e), n && (this.time = W(this.currentTime)));
  }
  play() {
    if (this.isStopped) return;
    const { driver: e = As, startTime: n } = this.options;
    (this.driver || (this.driver = e((s) => this.tick(s))), this.options.onPlay?.());
    const i = this.driver.now();
    (this.state === "finished"
      ? (this.updateFinished(), (this.startTime = i))
      : this.holdTime !== null
        ? (this.startTime = i - this.holdTime)
        : this.startTime || (this.startTime = n ?? i),
      this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration),
      (this.holdTime = null),
      (this.state = "running"),
      this.driver.start());
  }
  pause() {
    ((this.state = "paused"), this.updateTime(U.now()), (this.holdTime = this.currentTime));
  }
  complete() {
    (this.state !== "running" && this.play(), (this.state = "finished"), (this.holdTime = null));
  }
  finish() {
    (this.notifyFinished(),
      this.teardown(),
      (this.state = "finished"),
      this.options.onComplete?.());
  }
  cancel() {
    ((this.holdTime = null),
      (this.startTime = 0),
      this.tick(0),
      this.teardown(),
      this.options.onCancel?.());
  }
  teardown() {
    ((this.state = "idle"), this.stopDriver(), (this.startTime = this.holdTime = null));
  }
  stopDriver() {
    this.driver && (this.driver.stop(), (this.driver = void 0));
  }
  sample(e) {
    return ((this.startTime = 0), this.tick(e, !0));
  }
  attachTimeline(e) {
    return (
      this.options.allowFlatten &&
        ((this.options.type = "keyframes"), (this.options.ease = "linear"), this.initAnimation()),
      this.driver?.stop(),
      e.observe(this)
    );
  }
}
const Yn = { anticipate: Wn, backInOut: Nn, circInOut: Kn };
function Gs(t) {
  return t in Yn;
}
function Ks(t) {
  typeof t.ease == "string" && Gs(t.ease) && (t.ease = Yn[t.ease]);
}
const Lt = 10;
class Hs extends Bi {
  constructor(e) {
    (Ks(e),
      Xn(e),
      super(e),
      e.startTime !== void 0 && (this.startTime = e.startTime),
      (this.options = e));
  }
  updateMotionValue(e) {
    const { motionValue: n, onUpdate: i, onComplete: s, element: r, ...o } = this.options;
    if (!n) return;
    if (e !== void 0) {
      n.set(e);
      return;
    }
    const a = new ue({ ...o, autoplay: !1 }),
      l = Math.max(Lt, U.now() - this.startTime),
      c = K(0, Lt, l - Lt);
    (n.setWithVelocity(a.sample(Math.max(0, l - c)).value, a.sample(l).value, c), a.stop());
  }
}
const be = (t, e) =>
  e === "zIndex"
    ? !1
    : !!(
        typeof t == "number" ||
        Array.isArray(t) ||
        (typeof t == "string" && (Sn.test(t) || t === "0") && !t.startsWith("url("))
      );
function zs(t) {
  const e = t[0];
  if (t.length === 1) return !0;
  for (let n = 0; n < t.length; n++) if (t[n] !== e) return !0;
}
function _s(t, e, n, i) {
  const s = t[0];
  if (s === null) return !1;
  if (e === "display" || e === "visibility") return !0;
  const r = t[t.length - 1],
    o = be(s, e),
    a = be(r, e);
  return !o || !a ? !1 : zs(t) || ((n === "spring" || ji(n)) && i);
}
function $t(t) {
  ((t.duration = 0), (t.type = "keyframes"));
}
const $s = new Set(["opacity", "clipPath", "filter", "transform"]),
  Xs = Oi(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function Ys(t) {
  const { motionValue: e, name: n, repeatDelay: i, repeatType: s, damping: r, type: o } = t;
  if (!(e?.owner?.current instanceof HTMLElement)) return !1;
  const { onUpdate: l, transformTemplate: c } = e.owner.getProps();
  return (
    Xs() &&
    n &&
    $s.has(n) &&
    (n !== "transform" || !c) &&
    !l &&
    !i &&
    s !== "mirror" &&
    r !== 0 &&
    o !== "inertia"
  );
}
const qs = 40;
class Zs extends Dn {
  constructor({
    autoplay: e = !0,
    delay: n = 0,
    type: i = "keyframes",
    repeat: s = 0,
    repeatDelay: r = 0,
    repeatType: o = "loop",
    keyframes: a,
    name: l,
    motionValue: c,
    element: u,
    ...h
  }) {
    (super(),
      (this.stop = () => {
        (this._animation && (this._animation.stop(), this.stopTimeline?.()),
          this.keyframeResolver?.cancel());
      }),
      (this.createdAt = U.now()));
    const f = {
        autoplay: e,
        delay: n,
        type: i,
        repeat: s,
        repeatDelay: r,
        repeatType: o,
        name: l,
        motionValue: c,
        element: u,
        ...h,
      },
      d = u?.KeyframeResolver || Vn;
    ((this.keyframeResolver = new d(
      a,
      (m, g, y) => this.onKeyframesResolved(m, g, f, !y),
      l,
      c,
      u,
    )),
      this.keyframeResolver?.scheduleResolve());
  }
  onKeyframesResolved(e, n, i, s) {
    this.keyframeResolver = void 0;
    const { name: r, type: o, velocity: a, delay: l, isHandoff: c, onUpdate: u } = i;
    ((this.resolvedAt = U.now()),
      _s(e, r, o, a) ||
        ((nt.instantAnimations || !l) && u?.(An(e, i, n)),
        (e[0] = e[e.length - 1]),
        $t(i),
        (i.repeat = 0)));
    const f = {
        startTime: s
          ? this.resolvedAt
            ? this.resolvedAt - this.createdAt > qs
              ? this.resolvedAt
              : this.createdAt
            : this.createdAt
          : void 0,
        finalKeyframe: n,
        ...i,
        keyframes: e,
      },
      d = !c && Ys(f),
      m = f.motionValue?.owner?.current,
      g = d ? new Hs({ ...f, element: m }) : new ue(f);
    (g.finished
      .then(() => {
        this.notifyFinished();
      })
      .catch(N),
      this.pendingTimeline &&
        ((this.stopTimeline = g.attachTimeline(this.pendingTimeline)),
        (this.pendingTimeline = void 0)),
      (this._animation = g));
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(e, n) {
    return this.finished.finally(e).then(() => {});
  }
  get animation() {
    return (this._animation || (this.keyframeResolver?.resume(), Fi()), this._animation);
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(e) {
    this.animation.time = e;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(e) {
    this.animation.speed = e;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(e) {
    return (
      this._animation
        ? (this.stopTimeline = this.animation.attachTimeline(e))
        : (this.pendingTimeline = e),
      () => this.stop()
    );
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    (this._animation && this.animation.cancel(), this.keyframeResolver?.cancel());
  }
}
function qn(t, e, n, i = 0, s = 1) {
  const r = Array.from(t)
      .sort((c, u) => c.sortNodePosition(u))
      .indexOf(e),
    o = t.size,
    a = (o - 1) * i;
  return typeof n == "function" ? n(r, o) : s === 1 ? r * i : a - r * i;
}
const Js = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function Qs(t) {
  const e = Js.exec(t);
  if (!e) return [,];
  const [, n, i, s] = e;
  return [`--${n ?? i}`, s];
}
function Zn(t, e, n = 1) {
  const [i, s] = Qs(t);
  if (!i) return;
  const r = window.getComputedStyle(e).getPropertyValue(i);
  if (r) {
    const o = r.trim();
    return Ui(o) ? parseFloat(o) : o;
  }
  return ne(s) ? Zn(s, e, n + 1) : s;
}
const to = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
  eo = (t) => ({
    type: "spring",
    stiffness: 550,
    damping: t === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10,
  }),
  no = { type: "keyframes", duration: 0.8 },
  io = { type: "keyframes", ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
  so = (t, { keyframes: e }) =>
    e.length > 2 ? no : ie.has(t) ? (t.startsWith("scale") ? eo(e[1]) : to) : io,
  oo = (t) => t !== null;
function ro(t, { repeat: e, repeatType: n = "loop" }, i) {
  const s = t.filter(oo),
    r = e && n !== "loop" && e % 2 === 1 ? 0 : s.length - 1;
  return s[r];
}
function Jn(t, e) {
  if (t?.inherit && e) {
    const { inherit: n, ...i } = t;
    return { ...e, ...i };
  }
  return t;
}
function he(t, e) {
  const n = t?.[e] ?? t?.default ?? t;
  return n !== t ? Jn(n, t) : n;
}
function ao({
  when: t,
  delay: e,
  delayChildren: n,
  staggerChildren: i,
  staggerDirection: s,
  repeat: r,
  repeatType: o,
  repeatDelay: a,
  from: l,
  elapsed: c,
  ...u
}) {
  return !!Object.keys(u).length;
}
const fe =
  (t, e, n, i = {}, s, r) =>
  (o) => {
    const a = he(i, t) || {},
      l = a.delay || i.delay || 0;
    let { elapsed: c = 0 } = i;
    c = c - G(l);
    const u = {
      keyframes: Array.isArray(n) ? n : [null, n],
      ease: "easeOut",
      velocity: e.getVelocity(),
      ...a,
      delay: -c,
      onUpdate: (f) => {
        (e.set(f), a.onUpdate && a.onUpdate(f));
      },
      onComplete: () => {
        (o(), a.onComplete && a.onComplete());
      },
      name: t,
      motionValue: e,
      element: r ? void 0 : s,
    };
    (ao(a) || Object.assign(u, so(t, u)),
      u.duration && (u.duration = G(u.duration)),
      u.repeatDelay && (u.repeatDelay = G(u.repeatDelay)),
      u.from !== void 0 && (u.keyframes[0] = u.from));
    let h = !1;
    if (
      ((u.type === !1 || (u.duration === 0 && !u.repeatDelay)) &&
        ($t(u), u.delay === 0 && (h = !0)),
      (nt.instantAnimations || nt.skipAnimations || s?.shouldSkipAnimations) &&
        ((h = !0), $t(u), (u.delay = 0)),
      (u.allowFlatten = !a.type && !a.ease),
      h && !r && e.get() !== void 0)
    ) {
      const f = ro(u.keyframes, a);
      if (f !== void 0) {
        V.update(() => {
          (u.onUpdate(f), u.onComplete());
        });
        return;
      }
    }
    return a.isSync ? new ue(u) : new Zs(u);
  };
function tt(t, e, n) {
  const i = t.getProps();
  return Ni(i, e, n !== void 0 ? n : i.custom, t);
}
const Qn = new Set(["width", "height", "top", "left", "right", "bottom", ...Wi]),
  Xt = (t) => Array.isArray(t);
function lo(t, e, n) {
  t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, se(n));
}
function co(t) {
  return Xt(t) ? t[t.length - 1] || 0 : t;
}
function uo(t, e) {
  const n = tt(t, e);
  let { transitionEnd: i = {}, transition: s = {}, ...r } = n || {};
  r = { ...r, ...i };
  for (const o in r) {
    const a = co(r[o]);
    lo(t, o, a);
  }
}
function ho(t) {
  return !!(oe(t) && t.add);
}
function Yt(t, e) {
  const n = t.getValue("willChange");
  if (ho(n)) return n.add(e);
  if (!n && nt.WillChange) {
    const i = new nt.WillChange("auto");
    (t.addValue("willChange", i), i.add(e));
  }
}
function ti(t) {
  return t.props[Gi];
}
function fo({ protectedKeys: t, needsAnimating: e }, n) {
  const i = t.hasOwnProperty(n) && e[n] !== !0;
  return ((e[n] = !1), i);
}
function ei(t, e, { delay: n = 0, transitionOverride: i, type: s } = {}) {
  let { transition: r, transitionEnd: o, ...a } = e;
  const l = t.getDefaultTransition();
  r = r ? Jn(r, l) : l;
  const c = r?.reduceMotion;
  i && (r = i);
  const u = [],
    h = s && t.animationState && t.animationState.getState()[s];
  for (const f in a) {
    const d = t.getValue(f, t.latestValues[f] ?? null),
      m = a[f];
    if (m === void 0 || (h && fo(h, f))) continue;
    const g = { delay: n, ...he(r || {}, f) },
      y = d.get();
    if (y !== void 0 && !d.isAnimating && !Array.isArray(m) && m === y && !g.velocity) continue;
    let p = !1;
    if (window.MotionHandoffAnimation) {
      const w = ti(t);
      if (w) {
        const T = window.MotionHandoffAnimation(w, f, V);
        T !== null && ((g.startTime = T), (p = !0));
      }
    }
    Yt(t, f);
    const v = c ?? t.shouldReduceMotion;
    d.start(fe(f, d, m, v && Qn.has(f) ? { type: !1 } : g, t, p));
    const x = d.animation;
    x && u.push(x);
  }
  if (o) {
    const f = () =>
      V.update(() => {
        o && uo(t, o);
      });
    u.length ? Promise.all(u).then(f) : f();
  }
  return u;
}
function qt(t, e, n = {}) {
  const i = tt(t, e, n.type === "exit" ? t.presenceContext?.custom : void 0);
  let { transition: s = t.getDefaultTransition() || {} } = i || {};
  n.transitionOverride && (s = n.transitionOverride);
  const r = i ? () => Promise.all(ei(t, i, n)) : () => Promise.resolve(),
    o =
      t.variantChildren && t.variantChildren.size
        ? (l = 0) => {
            const { delayChildren: c = 0, staggerChildren: u, staggerDirection: h } = s;
            return mo(t, e, l, c, u, h, n);
          }
        : () => Promise.resolve(),
    { when: a } = s;
  if (a) {
    const [l, c] = a === "beforeChildren" ? [r, o] : [o, r];
    return l().then(() => c());
  } else return Promise.all([r(), o(n.delay)]);
}
function mo(t, e, n = 0, i = 0, s = 0, r = 1, o) {
  const a = [];
  for (const l of t.variantChildren)
    (l.notify("AnimationStart", e),
      a.push(
        qt(l, e, {
          ...o,
          delay: n + (typeof i == "function" ? 0 : i) + qn(t.variantChildren, l, i, s, r),
        }).then(() => l.notify("AnimationComplete", e)),
      ));
  return Promise.all(a);
}
function po(t, e, n = {}) {
  t.notify("AnimationStart", e);
  let i;
  if (Array.isArray(e)) {
    const s = e.map((r) => qt(t, r, n));
    i = Promise.all(s);
  } else if (typeof e == "string") i = qt(t, e, n);
  else {
    const s = typeof e == "function" ? tt(t, e, n.custom) : e;
    i = Promise.all(ei(t, s, n));
  }
  return i.then(() => {
    t.notify("AnimationComplete", e);
  });
}
function yo(t) {
  return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || Ki(t) : !0;
}
const go = new Set(["auto", "none", "0"]);
function vo(t, e, n) {
  let i = 0,
    s;
  for (; i < t.length && !s; ) {
    const r = t[i];
    (typeof r == "string" && !go.has(r) && Gt(r).values.length && (s = t[i]), i++);
  }
  if (s && n) for (const r of e) t[r] = Hi(n, s);
}
class xo extends Vn {
  constructor(e, n, i, s, r) {
    super(e, n, i, s, r, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, element: n, name: i } = this;
    if (!n || !n.current) return;
    super.readKeyframes();
    for (let u = 0; u < e.length; u++) {
      let h = e[u];
      if (typeof h == "string" && ((h = h.trim()), ne(h))) {
        const f = Zn(h, n.current);
        (f !== void 0 && (e[u] = f), u === e.length - 1 && (this.finalKeyframe = h));
      }
    }
    if ((this.resolveNoneKeyframes(), !Qn.has(i) || e.length !== 2)) return;
    const [s, r] = e,
      o = xe(s),
      a = xe(r),
      l = Te(s),
      c = Te(r);
    if (l !== c && ft[i]) {
      this.needsMeasurement = !0;
      return;
    }
    if (o !== a)
      if (Pe(o) && Pe(a))
        for (let u = 0; u < e.length; u++) {
          const h = e[u];
          typeof h == "string" && (e[u] = parseFloat(h));
        }
      else ft[i] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: e, name: n } = this,
      i = [];
    for (let s = 0; s < e.length; s++) (e[s] === null || yo(e[s])) && i.push(s);
    i.length && vo(e, i, n);
  }
  measureInitialState() {
    const { element: e, unresolvedKeyframes: n, name: i } = this;
    if (!e || !e.current) return;
    (i === "height" && (this.suspendedScrollY = window.pageYOffset),
      (this.measuredOrigin = ft[i](e.measureViewportBox(), window.getComputedStyle(e.current))),
      (n[0] = this.measuredOrigin));
    const s = n[n.length - 1];
    s !== void 0 && e.getValue(i, s).jump(s, !1);
  }
  measureEndState() {
    const { element: e, name: n, unresolvedKeyframes: i } = this;
    if (!e || !e.current) return;
    const s = e.getValue(n);
    s && s.jump(this.measuredOrigin, !1);
    const r = i.length - 1,
      o = i[r];
    ((i[r] = ft[n](e.measureViewportBox(), window.getComputedStyle(e.current))),
      o !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = o),
      this.removedTransforms?.length &&
        this.removedTransforms.forEach(([a, l]) => {
          e.getValue(a).set(l);
        }),
      this.resolveNoneKeyframes());
  }
}
function To(t) {
  return Bn(t) && "offsetHeight" in t;
}
const j = { x: !1, y: !1 };
function ni() {
  return j.x || j.y;
}
function Po(t) {
  return t === "x" || t === "y"
    ? j[t]
      ? null
      : ((j[t] = !0),
        () => {
          j[t] = !1;
        })
    : j.x || j.y
      ? null
      : ((j.x = j.y = !0),
        () => {
          j.x = j.y = !1;
        });
}
function ii(t, e) {
  const n = In(t),
    i = new AbortController(),
    s = { passive: !0, ...e, signal: i.signal };
  return [n, s, () => i.abort()];
}
function wo(t) {
  return !(t.pointerType === "touch" || ni());
}
function So(t, e, n = {}) {
  const [i, s, r] = ii(t, n);
  return (
    i.forEach((o) => {
      let a = !1,
        l = !1,
        c;
      const u = () => {
          o.removeEventListener("pointerleave", m);
        },
        h = (y) => {
          (c && (c(y), (c = void 0)), u());
        },
        f = (y) => {
          ((a = !1),
            window.removeEventListener("pointerup", f),
            window.removeEventListener("pointercancel", f),
            l && ((l = !1), h(y)));
        },
        d = () => {
          ((a = !0),
            window.addEventListener("pointerup", f, s),
            window.addEventListener("pointercancel", f, s));
        },
        m = (y) => {
          if (y.pointerType !== "touch") {
            if (a) {
              l = !0;
              return;
            }
            h(y);
          }
        },
        g = (y) => {
          if (!wo(y)) return;
          l = !1;
          const p = e(o, y);
          typeof p == "function" && ((c = p), o.addEventListener("pointerleave", m, s));
        };
      (o.addEventListener("pointerenter", g, s), o.addEventListener("pointerdown", d, s));
    }),
    r
  );
}
const si = (t, e) => (e ? (t === e ? !0 : si(t, e.parentElement)) : !1),
  de = (t) =>
    t.pointerType === "mouse" ? typeof t.button != "number" || t.button <= 0 : t.isPrimary !== !1,
  Do = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]);
function Ao(t) {
  return Do.has(t.tagName) || t.isContentEditable === !0;
}
const Vo = new Set(["INPUT", "SELECT", "TEXTAREA"]);
function Eo(t) {
  return Vo.has(t.tagName) || t.isContentEditable === !0;
}
const mt = new WeakSet();
function Ce(t) {
  return (e) => {
    e.key === "Enter" && t(e);
  };
}
function Mt(t, e) {
  t.dispatchEvent(new PointerEvent("pointer" + e, { isPrimary: !0, bubbles: !0 }));
}
const bo = (t, e) => {
  const n = t.currentTarget;
  if (!n) return;
  const i = Ce(() => {
    if (mt.has(n)) return;
    Mt(n, "down");
    const s = Ce(() => {
        Mt(n, "up");
      }),
      r = () => Mt(n, "cancel");
    (n.addEventListener("keyup", s, e), n.addEventListener("blur", r, e));
  });
  (n.addEventListener("keydown", i, e),
    n.addEventListener("blur", () => n.removeEventListener("keydown", i), e));
};
function Le(t) {
  return de(t) && !ni();
}
const Me = new WeakSet();
function Co(t, e, n = {}) {
  const [i, s, r] = ii(t, n),
    o = (a) => {
      const l = a.currentTarget;
      if (!Le(a) || Me.has(a)) return;
      (mt.add(l), n.stopPropagation && Me.add(a));
      const c = e(l, a),
        u = (d, m) => {
          (window.removeEventListener("pointerup", h),
            window.removeEventListener("pointercancel", f),
            mt.has(l) && mt.delete(l),
            Le(d) && typeof c == "function" && c(d, { success: m }));
        },
        h = (d) => {
          u(d, l === window || l === document || n.useGlobalTarget || si(l, d.target));
        },
        f = (d) => {
          u(d, !1);
        };
      (window.addEventListener("pointerup", h, s), window.addEventListener("pointercancel", f, s));
    };
  return (
    i.forEach((a) => {
      ((n.useGlobalTarget ? window : a).addEventListener("pointerdown", o, s),
        To(a) &&
          (a.addEventListener("focus", (c) => bo(c, s)),
          !Ao(a) && !a.hasAttribute("tabindex") && (a.tabIndex = 0)));
    }),
    r
  );
}
function me(t) {
  return Bn(t) && "ownerSVGElement" in t;
}
const pt = new WeakMap();
let yt;
const oi = (t, e, n) => (i, s) =>
    s && s[0] ? s[0][t + "Size"] : me(i) && "getBBox" in i ? i.getBBox()[e] : i[n],
  Lo = oi("inline", "width", "offsetWidth"),
  Mo = oi("block", "height", "offsetHeight");
function Ro({ target: t, borderBoxSize: e }) {
  pt.get(t)?.forEach((n) => {
    n(t, {
      get width() {
        return Lo(t, e);
      },
      get height() {
        return Mo(t, e);
      },
    });
  });
}
function ko(t) {
  t.forEach(Ro);
}
function Io() {
  typeof ResizeObserver > "u" || (yt = new ResizeObserver(ko));
}
function Bo(t, e) {
  yt || Io();
  const n = In(t);
  return (
    n.forEach((i) => {
      let s = pt.get(i);
      (s || ((s = new Set()), pt.set(i, s)), s.add(e), yt?.observe(i));
    }),
    () => {
      n.forEach((i) => {
        const s = pt.get(i);
        (s?.delete(e), s?.size || yt?.unobserve(i));
      });
    }
  );
}
const gt = new Set();
let Z;
function jo() {
  ((Z = () => {
    const t = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      },
    };
    gt.forEach((e) => e(t));
  }),
    window.addEventListener("resize", Z));
}
function Oo(t) {
  return (
    gt.add(t),
    Z || jo(),
    () => {
      (gt.delete(t),
        !gt.size &&
          typeof Z == "function" &&
          (window.removeEventListener("resize", Z), (Z = void 0)));
    }
  );
}
function Re(t, e) {
  return typeof t == "function" ? Oo(t) : Bo(t, e);
}
function Fo(t) {
  return me(t) && t.tagName === "svg";
}
class ri extends zi {
  constructor() {
    (super(...arguments), (this.KeyframeResolver = xo));
  }
  sortInstanceNodePosition(e, n) {
    return e.compareDocumentPosition(n) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(e, n) {
    const i = e.style;
    return i ? i[n] : void 0;
  }
  removeValueFromRenderState(e, { vars: n, style: i }) {
    (delete n[e], delete i[e]);
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: e } = this.props;
    oe(e) &&
      (this.childSubscription = e.on("change", (n) => {
        this.current && (this.current.textContent = `${n}`);
      }));
  }
}
class H {
  constructor(e) {
    ((this.isMounted = !1), (this.node = e));
  }
  update() {}
}
function ai({ top: t, left: e, right: n, bottom: i }) {
  return { x: { min: e, max: n }, y: { min: t, max: i } };
}
function Uo({ x: t, y: e }) {
  return { top: e.min, right: t.max, bottom: e.max, left: t.min };
}
function No(t, e) {
  if (!e) return t;
  const n = e({ x: t.left, y: t.top }),
    i = e({ x: t.right, y: t.bottom });
  return { top: n.y, left: n.x, bottom: i.y, right: i.x };
}
function Rt(t) {
  return t === void 0 || t === 1;
}
function Zt({ scale: t, scaleX: e, scaleY: n }) {
  return !Rt(t) || !Rt(e) || !Rt(n);
}
function $(t) {
  return Zt(t) || li(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY;
}
function li(t) {
  return ke(t.x) || ke(t.y);
}
function ke(t) {
  return t && t !== "0%";
}
function St(t, e, n) {
  const i = t - n,
    s = e * i;
  return n + s;
}
function Ie(t, e, n, i, s) {
  return (s !== void 0 && (t = St(t, s, i)), St(t, n, i) + e);
}
function Jt(t, e = 0, n = 1, i, s) {
  ((t.min = Ie(t.min, e, n, i, s)), (t.max = Ie(t.max, e, n, i, s)));
}
function ci(t, { x: e, y: n }) {
  (Jt(t.x, e.translate, e.scale, e.originPoint), Jt(t.y, n.translate, n.scale, n.originPoint));
}
const Be = 0.999999999999,
  je = 1.0000000000001;
function Wo(t, e, n, i = !1) {
  const s = n.length;
  if (!s) return;
  e.x = e.y = 1;
  let r, o;
  for (let a = 0; a < s; a++) {
    ((r = n[a]), (o = r.projectionDelta));
    const { visualElement: l } = r.options;
    (l && l.props.style && l.props.style.display === "contents") ||
      (i &&
        r.options.layoutScroll &&
        r.scroll &&
        r !== r.root &&
        Q(t, { x: -r.scroll.offset.x, y: -r.scroll.offset.y }),
      o && ((e.x *= o.x.scale), (e.y *= o.y.scale), ci(t, o)),
      i && $(r.latestValues) && Q(t, r.latestValues));
  }
  (e.x < je && e.x > Be && (e.x = 1), e.y < je && e.y > Be && (e.y = 1));
}
function J(t, e) {
  ((t.min = t.min + e), (t.max = t.max + e));
}
function Oe(t, e, n, i, s = 0.5) {
  const r = A(t.min, t.max, s);
  Jt(t, e, n, r, i);
}
function Q(t, e) {
  (Oe(t.x, e.x, e.scaleX, e.scale, e.originX), Oe(t.y, e.y, e.scaleY, e.scale, e.originY));
}
function ui(t, e) {
  return ai(No(t.getBoundingClientRect(), e));
}
function Go(t, e, n) {
  const i = ui(t, n),
    { scroll: s } = e;
  return (s && (J(i.x, s.offset.x), J(i.y, s.offset.y)), i);
}
function hi(t, { style: e, vars: n }, i, s) {
  const r = t.style;
  let o;
  for (o in e) r[o] = e[o];
  s?.applyProjectionStyles(r, i);
  for (o in n) r.setProperty(o, n[o]);
}
function Ko(t) {
  return window.getComputedStyle(t);
}
class Ho extends ri {
  constructor() {
    (super(...arguments), (this.type = "html"), (this.renderInstance = hi));
  }
  readValueFromInstance(e, n) {
    if (ie.has(n)) return this.projection?.isProjecting ? _i(n) : $i(e, n);
    {
      const i = Ko(e),
        s = (Xi(n) ? i.getPropertyValue(n) : i[n]) || 0;
      return typeof s == "string" ? s.trim() : s;
    }
  }
  measureInstanceViewportBox(e, { transformPagePoint: n }) {
    return ui(e, n);
  }
  build(e, n, i) {
    Yi(e, n, i.transformTemplate);
  }
  scrapeMotionValuesFromProps(e, n, i) {
    return qi(e, n, i);
  }
}
const fi = new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust",
]);
function zo(t, e, n, i) {
  hi(t, e, void 0, i);
  for (const s in e.attrs) t.setAttribute(fi.has(s) ? s : En(s), e.attrs[s]);
}
class _o extends ri {
  constructor() {
    (super(...arguments),
      (this.type = "svg"),
      (this.isSVGTag = !1),
      (this.measureInstanceViewportBox = E));
  }
  getBaseTargetFromProps(e, n) {
    return e[n];
  }
  readValueFromInstance(e, n) {
    if (ie.has(n)) {
      const i = ts(n);
      return (i && i.default) || 0;
    }
    return ((n = fi.has(n) ? n : En(n)), e.getAttribute(n));
  }
  scrapeMotionValuesFromProps(e, n, i) {
    return Zi(e, n, i);
  }
  build(e, n, i) {
    Ji(e, n, this.isSVGTag, i.transformTemplate, i.style);
  }
  renderInstance(e, n, i, s) {
    zo(e, n, i, s);
  }
  mount(e) {
    ((this.isSVGTag = Qi(e.tagName)), super.mount(e));
  }
}
const $o = Cn.length;
function di(t) {
  if (!t) return;
  if (!t.isControllingVariants) {
    const n = t.parent ? di(t.parent) || {} : {};
    return (t.props.initial !== void 0 && (n.initial = t.props.initial), n);
  }
  const e = {};
  for (let n = 0; n < $o; n++) {
    const i = Cn[n],
      s = t.props[i];
    (bn(s) || s === !1) && (e[i] = s);
  }
  return e;
}
function mi(t, e) {
  if (!Array.isArray(e)) return !1;
  const n = e.length;
  if (n !== t.length) return !1;
  for (let i = 0; i < n; i++) if (e[i] !== t[i]) return !1;
  return !0;
}
const Xo = [...Mn].reverse(),
  Yo = Mn.length;
function qo(t) {
  return (e) => Promise.all(e.map(({ animation: n, options: i }) => po(t, n, i)));
}
function Zo(t) {
  let e = qo(t),
    n = Fe(),
    i = !0;
  const s = (l) => (c, u) => {
    const h = tt(t, u, l === "exit" ? t.presenceContext?.custom : void 0);
    if (h) {
      const { transition: f, transitionEnd: d, ...m } = h;
      c = { ...c, ...m, ...d };
    }
    return c;
  };
  function r(l) {
    e = l(t);
  }
  function o(l) {
    const { props: c } = t,
      u = di(t.parent) || {},
      h = [],
      f = new Set();
    let d = {},
      m = 1 / 0;
    for (let y = 0; y < Yo; y++) {
      const p = Xo[y],
        v = n[p],
        x = c[p] !== void 0 ? c[p] : u[p],
        w = bn(x),
        T = p === l ? v.isActive : null;
      T === !1 && (m = y);
      let S = x === u[p] && x !== c[p] && w;
      if (
        (S && i && t.manuallyAnimateOnMount && (S = !1),
        (v.protectedKeys = { ...d }),
        (!v.isActive && T === null) || (!x && !v.prevProp) || Ln(x) || typeof x == "boolean")
      )
        continue;
      if (p === "exit" && v.isActive && T !== !0) {
        v.prevResolvedValues && (d = { ...d, ...v.prevResolvedValues });
        continue;
      }
      const b = Jo(v.prevProp, x);
      let P = b || (p === l && v.isActive && !S && w) || (y > m && w),
        R = !1;
      const k = Array.isArray(x) ? x : [x];
      let X = k.reduce(s(p), {});
      T === !1 && (X = {});
      const { prevResolvedValues: pe = {} } = v,
        Ci = { ...pe, ...X },
        ye = (C) => {
          ((P = !0), f.has(C) && ((R = !0), f.delete(C)), (v.needsAnimating[C] = !0));
          const I = t.getValue(C);
          I && (I.liveStyle = !1);
        };
      for (const C in Ci) {
        const I = X[C],
          z = pe[C];
        if (d.hasOwnProperty(C)) continue;
        let Y = !1;
        (Xt(I) && Xt(z) ? (Y = !mi(I, z)) : (Y = I !== z),
          Y
            ? I != null
              ? ye(C)
              : f.add(C)
            : I !== void 0 && f.has(C)
              ? ye(C)
              : (v.protectedKeys[C] = !0));
      }
      ((v.prevProp = x),
        (v.prevResolvedValues = X),
        v.isActive && (d = { ...d, ...X }),
        i && t.blockInitialAnimation && (P = !1));
      const ge = S && b;
      P &&
        (!ge || R) &&
        h.push(
          ...k.map((C) => {
            const I = { type: p };
            if (typeof C == "string" && i && !ge && t.manuallyAnimateOnMount && t.parent) {
              const { parent: z } = t,
                Y = tt(z, C);
              if (z.enteringChildren && Y) {
                const { delayChildren: Li } = Y.transition || {};
                I.delay = qn(z.enteringChildren, t, Li);
              }
            }
            return { animation: C, options: I };
          }),
        );
    }
    if (f.size) {
      const y = {};
      if (typeof c.initial != "boolean") {
        const p = tt(t, Array.isArray(c.initial) ? c.initial[0] : c.initial);
        p && p.transition && (y.transition = p.transition);
      }
      (f.forEach((p) => {
        const v = t.getBaseTarget(p),
          x = t.getValue(p);
        (x && (x.liveStyle = !0), (y[p] = v ?? null));
      }),
        h.push({ animation: y }));
    }
    let g = !!h.length;
    return (
      i && (c.initial === !1 || c.initial === c.animate) && !t.manuallyAnimateOnMount && (g = !1),
      (i = !1),
      g ? e(h) : Promise.resolve()
    );
  }
  function a(l, c) {
    if (n[l].isActive === c) return Promise.resolve();
    (t.variantChildren?.forEach((h) => h.animationState?.setActive(l, c)), (n[l].isActive = c));
    const u = o(l);
    for (const h in n) n[h].protectedKeys = {};
    return u;
  }
  return {
    animateChanges: o,
    setActive: a,
    setAnimateFunction: r,
    getState: () => n,
    reset: () => {
      n = Fe();
    },
  };
}
function Jo(t, e) {
  return typeof e == "string" ? e !== t : Array.isArray(e) ? !mi(e, t) : !1;
}
function _(t = !1) {
  return { isActive: t, protectedKeys: {}, needsAnimating: {}, prevResolvedValues: {} };
}
function Fe() {
  return {
    animate: _(!0),
    whileInView: _(),
    whileHover: _(),
    whileTap: _(),
    whileDrag: _(),
    whileFocus: _(),
    exit: _(),
  };
}
function Ue(t, e) {
  ((t.min = e.min), (t.max = e.max));
}
function B(t, e) {
  (Ue(t.x, e.x), Ue(t.y, e.y));
}
function Ne(t, e) {
  ((t.translate = e.translate),
    (t.scale = e.scale),
    (t.originPoint = e.originPoint),
    (t.origin = e.origin));
}
const pi = 1e-4,
  Qo = 1 - pi,
  tr = 1 + pi,
  yi = 0.01,
  er = 0 - yi,
  nr = 0 + yi;
function M(t) {
  return t.max - t.min;
}
function ir(t, e, n) {
  return Math.abs(t - e) <= n;
}
function We(t, e, n, i = 0.5) {
  ((t.origin = i),
    (t.originPoint = A(e.min, e.max, t.origin)),
    (t.scale = M(n) / M(e)),
    (t.translate = A(n.min, n.max, t.origin) - t.originPoint),
    ((t.scale >= Qo && t.scale <= tr) || isNaN(t.scale)) && (t.scale = 1),
    ((t.translate >= er && t.translate <= nr) || isNaN(t.translate)) && (t.translate = 0));
}
function ot(t, e, n, i) {
  (We(t.x, e.x, n.x, i ? i.originX : void 0), We(t.y, e.y, n.y, i ? i.originY : void 0));
}
function Ge(t, e, n) {
  ((t.min = n.min + e.min), (t.max = t.min + M(e)));
}
function sr(t, e, n) {
  (Ge(t.x, e.x, n.x), Ge(t.y, e.y, n.y));
}
function Ke(t, e, n) {
  ((t.min = e.min - n.min), (t.max = t.min + M(e)));
}
function Dt(t, e, n) {
  (Ke(t.x, e.x, n.x), Ke(t.y, e.y, n.y));
}
function He(t, e, n, i, s) {
  return ((t -= e), (t = St(t, 1 / n, i)), s !== void 0 && (t = St(t, 1 / s, i)), t);
}
function or(t, e = 0, n = 1, i = 0.5, s, r = t, o = t) {
  if (
    (xt.test(e) && ((e = parseFloat(e)), (e = A(o.min, o.max, e / 100) - o.min)),
    typeof e != "number")
  )
    return;
  let a = A(r.min, r.max, i);
  (t === r && (a -= e), (t.min = He(t.min, e, n, a, s)), (t.max = He(t.max, e, n, a, s)));
}
function ze(t, e, [n, i, s], r, o) {
  or(t, e[n], e[i], e[s], e.scale, r, o);
}
const rr = ["x", "scaleX", "originX"],
  ar = ["y", "scaleY", "originY"];
function _e(t, e, n, i) {
  (ze(t.x, e, rr, n ? n.x : void 0, i ? i.x : void 0),
    ze(t.y, e, ar, n ? n.y : void 0, i ? i.y : void 0));
}
function $e(t) {
  return t.translate === 0 && t.scale === 1;
}
function gi(t) {
  return $e(t.x) && $e(t.y);
}
function Xe(t, e) {
  return t.min === e.min && t.max === e.max;
}
function lr(t, e) {
  return Xe(t.x, e.x) && Xe(t.y, e.y);
}
function Ye(t, e) {
  return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max);
}
function vi(t, e) {
  return Ye(t.x, e.x) && Ye(t.y, e.y);
}
function qe(t) {
  return M(t.x) / M(t.y);
}
function Ze(t, e) {
  return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint;
}
function F(t) {
  return [t("x"), t("y")];
}
function cr(t, e, n) {
  let i = "";
  const s = t.x.translate / e.x,
    r = t.y.translate / e.y,
    o = n?.z || 0;
  if (
    ((s || r || o) && (i = `translate3d(${s}px, ${r}px, ${o}px) `),
    (e.x !== 1 || e.y !== 1) && (i += `scale(${1 / e.x}, ${1 / e.y}) `),
    n)
  ) {
    const { transformPerspective: c, rotate: u, rotateX: h, rotateY: f, skewX: d, skewY: m } = n;
    (c && (i = `perspective(${c}px) ${i}`),
      u && (i += `rotate(${u}deg) `),
      h && (i += `rotateX(${h}deg) `),
      f && (i += `rotateY(${f}deg) `),
      d && (i += `skewX(${d}deg) `),
      m && (i += `skewY(${m}deg) `));
  }
  const a = t.x.scale * e.x,
    l = t.y.scale * e.y;
  return ((a !== 1 || l !== 1) && (i += `scale(${a}, ${l})`), i || "none");
}
const xi = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"],
  ur = xi.length,
  Je = (t) => (typeof t == "string" ? parseFloat(t) : t),
  Qe = (t) => typeof t == "number" || es.test(t);
function hr(t, e, n, i, s, r) {
  s
    ? ((t.opacity = A(0, n.opacity ?? 1, fr(i))), (t.opacityExit = A(e.opacity ?? 1, 0, dr(i))))
    : r && (t.opacity = A(e.opacity ?? 1, n.opacity ?? 1, i));
  for (let o = 0; o < ur; o++) {
    const a = `border${xi[o]}Radius`;
    let l = tn(e, a),
      c = tn(n, a);
    if (l === void 0 && c === void 0) continue;
    (l || (l = 0),
      c || (c = 0),
      l === 0 || c === 0 || Qe(l) === Qe(c)
        ? ((t[a] = Math.max(A(Je(l), Je(c), i), 0)), (xt.test(c) || xt.test(l)) && (t[a] += "%"))
        : (t[a] = c));
  }
  (e.rotate || n.rotate) && (t.rotate = A(e.rotate || 0, n.rotate || 0, i));
}
function tn(t, e) {
  return t[e] !== void 0 ? t[e] : t.borderRadius;
}
const fr = Ti(0, 0.5, Gn),
  dr = Ti(0.5, 0.95, N);
function Ti(t, e, n) {
  return (i) => (i < t ? 0 : i > e ? 1 : n(at(t, e, i)));
}
function mr(t, e, n) {
  const i = oe(t) ? t : se(t);
  return (i.start(fe("", i, e, n)), i.animation);
}
function lt(t, e, n, i = { passive: !0 }) {
  return (t.addEventListener(e, n, i), () => t.removeEventListener(e, n));
}
const pr = (t, e) => t.depth - e.depth;
class yr {
  constructor() {
    ((this.children = []), (this.isDirty = !1));
  }
  add(e) {
    (Rn(this.children, e), (this.isDirty = !0));
  }
  remove(e) {
    (Kt(this.children, e), (this.isDirty = !0));
  }
  forEach(e) {
    (this.isDirty && this.children.sort(pr), (this.isDirty = !1), this.children.forEach(e));
  }
}
function gr(t, e) {
  const n = U.now(),
    i = ({ timestamp: s }) => {
      const r = s - n;
      r >= e && (et(i), t(r - e));
    };
  return (V.setup(i, !0), () => et(i));
}
class vr {
  constructor() {
    this.members = [];
  }
  add(e) {
    Rn(this.members, e);
    for (let n = this.members.length - 1; n >= 0; n--) {
      const i = this.members[n];
      if (i === e || i === this.lead || i === this.prevLead) continue;
      const s = i.instance;
      s && s.isConnected === !1 && i.isPresent !== !1 && !i.snapshot && Kt(this.members, i);
    }
    e.scheduleRender();
  }
  remove(e) {
    if ((Kt(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead)) {
      const n = this.members[this.members.length - 1];
      n && this.promote(n);
    }
  }
  relegate(e) {
    const n = this.members.findIndex((s) => e === s);
    if (n === 0) return !1;
    let i;
    for (let s = n; s >= 0; s--) {
      const r = this.members[s],
        o = r.instance;
      if (r.isPresent !== !1 && (!o || o.isConnected !== !1)) {
        i = r;
        break;
      }
    }
    return i ? (this.promote(i), !0) : !1;
  }
  promote(e, n) {
    const i = this.lead;
    if (e !== i && ((this.prevLead = i), (this.lead = e), e.show(), i)) {
      (i.instance && i.scheduleRender(), e.scheduleRender());
      const s = i.options.layoutDependency,
        r = e.options.layoutDependency;
      if (!(s !== void 0 && r !== void 0 && s === r)) {
        const l = i.instance;
        (l && l.isConnected === !1 && !i.snapshot) ||
          ((e.resumeFrom = i),
          n && (e.resumeFrom.preserveOpacity = !0),
          i.snapshot &&
            ((e.snapshot = i.snapshot),
            (e.snapshot.latestValues = i.animationValues || i.latestValues)),
          e.root && e.root.isUpdating && (e.isLayoutDirty = !0));
      }
      const { crossfade: a } = e.options;
      a === !1 && i.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((e) => {
      const { options: n, resumingFrom: i } = e;
      (n.onExitComplete && n.onExitComplete(),
        i && i.options.onExitComplete && i.options.onExitComplete());
    });
  }
  scheduleRender() {
    this.members.forEach((e) => {
      e.instance && e.scheduleRender(!1);
    });
  }
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
const vt = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 },
  kt = ["", "X", "Y", "Z"],
  xr = 1e3;
let Tr = 0;
function It(t, e, n, i) {
  const { latestValues: s } = e;
  s[t] && ((n[t] = s[t]), e.setStaticValue(t, 0), i && (i[t] = 0));
}
function Pi(t) {
  if (((t.hasCheckedOptimisedAppear = !0), t.root === t)) return;
  const { visualElement: e } = t.options;
  if (!e) return;
  const n = ti(e);
  if (window.MotionHasOptimisedAnimation(n, "transform")) {
    const { layout: s, layoutId: r } = t.options;
    window.MotionCancelOptimisedAnimation(n, "transform", V, !(s || r));
  }
  const { parent: i } = t;
  i && !i.hasCheckedOptimisedAppear && Pi(i);
}
function wi({
  attachResizeListener: t,
  defaultParent: e,
  measureScroll: n,
  checkIsScrollRoot: i,
  resetTransform: s,
}) {
  return class {
    constructor(o = {}, a = e?.()) {
      ((this.id = Tr++),
        (this.animationId = 0),
        (this.animationCommitId = 0),
        (this.children = new Set()),
        (this.options = {}),
        (this.isTreeAnimating = !1),
        (this.isAnimationBlocked = !1),
        (this.isLayoutDirty = !1),
        (this.isProjectionDirty = !1),
        (this.isSharedProjectionDirty = !1),
        (this.isTransformDirty = !1),
        (this.updateManuallyBlocked = !1),
        (this.updateBlockedByResize = !1),
        (this.isUpdating = !1),
        (this.isSVG = !1),
        (this.needsReset = !1),
        (this.shouldResetTransform = !1),
        (this.hasCheckedOptimisedAppear = !1),
        (this.treeScale = { x: 1, y: 1 }),
        (this.eventHandlers = new Map()),
        (this.hasTreeAnimated = !1),
        (this.layoutVersion = 0),
        (this.updateScheduled = !1),
        (this.scheduleUpdate = () => this.update()),
        (this.projectionUpdateScheduled = !1),
        (this.checkUpdateFailed = () => {
          this.isUpdating && ((this.isUpdating = !1), this.clearAllSnapshots());
        }),
        (this.updateProjection = () => {
          ((this.projectionUpdateScheduled = !1),
            this.nodes.forEach(Sr),
            this.nodes.forEach(Er),
            this.nodes.forEach(br),
            this.nodes.forEach(Dr));
        }),
        (this.resolvedRelativeTargetAt = 0),
        (this.linkedParentVersion = 0),
        (this.hasProjected = !1),
        (this.isVisible = !0),
        (this.animationProgress = 0),
        (this.sharedNodes = new Map()),
        (this.latestValues = o),
        (this.root = a ? a.root || a : this),
        (this.path = a ? [...a.path, a] : []),
        (this.parent = a),
        (this.depth = a ? a.depth + 1 : 0));
      for (let l = 0; l < this.path.length; l++) this.path[l].shouldResetTransform = !0;
      this.root === this && (this.nodes = new yr());
    }
    addEventListener(o, a) {
      return (
        this.eventHandlers.has(o) || this.eventHandlers.set(o, new ns()),
        this.eventHandlers.get(o).add(a)
      );
    }
    notifyListeners(o, ...a) {
      const l = this.eventHandlers.get(o);
      l && l.notify(...a);
    }
    hasListeners(o) {
      return this.eventHandlers.has(o);
    }
    mount(o) {
      if (this.instance) return;
      ((this.isSVG = me(o) && !Fo(o)), (this.instance = o));
      const { layoutId: a, layout: l, visualElement: c } = this.options;
      if (
        (c && !c.current && c.mount(o),
        this.root.nodes.add(this),
        this.parent && this.parent.children.add(this),
        this.root.hasTreeAnimated && (l || a) && (this.isLayoutDirty = !0),
        t)
      ) {
        let u,
          h = 0;
        const f = () => (this.root.updateBlockedByResize = !1);
        (V.read(() => {
          h = window.innerWidth;
        }),
          t(o, () => {
            const d = window.innerWidth;
            d !== h &&
              ((h = d),
              (this.root.updateBlockedByResize = !0),
              u && u(),
              (u = gr(f, 250)),
              vt.hasAnimatedSinceResize &&
                ((vt.hasAnimatedSinceResize = !1), this.nodes.forEach(sn)));
          }));
      }
      (a && this.root.registerSharedNode(a, this),
        this.options.animate !== !1 &&
          c &&
          (a || l) &&
          this.addEventListener(
            "didUpdate",
            ({ delta: u, hasLayoutChanged: h, hasRelativeLayoutChanged: f, layout: d }) => {
              if (this.isTreeAnimationBlocked()) {
                ((this.target = void 0), (this.relativeTarget = void 0));
                return;
              }
              const m = this.options.transition || c.getDefaultTransition() || kr,
                { onLayoutAnimationStart: g, onLayoutAnimationComplete: y } = c.getProps(),
                p = !this.targetLayout || !vi(this.targetLayout, d),
                v = !h && f;
              if (
                this.options.layoutRoot ||
                this.resumeFrom ||
                v ||
                (h && (p || !this.currentAnimation))
              ) {
                this.resumeFrom &&
                  ((this.resumingFrom = this.resumeFrom),
                  (this.resumingFrom.resumingFrom = void 0));
                const x = { ...he(m, "layout"), onPlay: g, onComplete: y };
                ((c.shouldReduceMotion || this.options.layoutRoot) &&
                  ((x.delay = 0), (x.type = !1)),
                  this.startAnimation(x),
                  this.setAnimationOrigin(u, v));
              } else
                (h || sn(this),
                  this.isLead() && this.options.onExitComplete && this.options.onExitComplete());
              this.targetLayout = d;
            },
          ));
    }
    unmount() {
      (this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this));
      const o = this.getStack();
      (o && o.remove(this),
        this.parent && this.parent.children.delete(this),
        (this.instance = void 0),
        this.eventHandlers.clear(),
        et(this.updateProjection));
    }
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || (this.parent && this.parent.isTreeAnimationBlocked()) || !1;
    }
    startUpdate() {
      this.isUpdateBlocked() ||
        ((this.isUpdating = !0), this.nodes && this.nodes.forEach(Cr), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: o } = this.options;
      return o && o.getProps().transformTemplate;
    }
    willUpdate(o = !0) {
      if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked())) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (
        (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Pi(this),
        !this.root.isUpdating && this.root.startUpdate(),
        this.isLayoutDirty)
      )
        return;
      this.isLayoutDirty = !0;
      for (let u = 0; u < this.path.length; u++) {
        const h = this.path[u];
        ((h.shouldResetTransform = !0),
          h.updateScroll("snapshot"),
          h.options.layoutRoot && h.willUpdate(!1));
      }
      const { layoutId: a, layout: l } = this.options;
      if (a === void 0 && !l) return;
      const c = this.getTransformTemplate();
      ((this.prevTransformTemplateValue = c ? c(this.latestValues, "") : void 0),
        this.updateSnapshot(),
        o && this.notifyListeners("willUpdate"));
    }
    update() {
      if (((this.updateScheduled = !1), this.isUpdateBlocked())) {
        (this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(en));
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(nn);
        return;
      }
      ((this.animationCommitId = this.animationId),
        this.isUpdating
          ? ((this.isUpdating = !1),
            this.nodes.forEach(Vr),
            this.nodes.forEach(Pr),
            this.nodes.forEach(wr))
          : this.nodes.forEach(nn),
        this.clearAllSnapshots());
      const a = U.now();
      ((L.delta = K(0, 1e3 / 60, a - L.timestamp)),
        (L.timestamp = a),
        (L.isProcessing = !0),
        At.update.process(L),
        At.preRender.process(L),
        At.render.process(L),
        (L.isProcessing = !1));
    }
    didUpdate() {
      this.updateScheduled || ((this.updateScheduled = !0), kn.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      (this.nodes.forEach(Ar), this.sharedNodes.forEach(Lr));
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled ||
        ((this.projectionUpdateScheduled = !0), V.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      V.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    updateSnapshot() {
      this.snapshot ||
        !this.instance ||
        ((this.snapshot = this.measure()),
        this.snapshot &&
          !M(this.snapshot.measuredBox.x) &&
          !M(this.snapshot.measuredBox.y) &&
          (this.snapshot = void 0));
    }
    updateLayout() {
      if (
        !this.instance ||
        (this.updateScroll(),
        !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)
      )
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let l = 0; l < this.path.length; l++) this.path[l].updateScroll();
      const o = this.layout;
      ((this.layout = this.measure(!1)),
        this.layoutVersion++,
        (this.layoutCorrected = E()),
        (this.isLayoutDirty = !1),
        (this.projectionDelta = void 0),
        this.notifyListeners("measure", this.layout.layoutBox));
      const { visualElement: a } = this.options;
      a && a.notify("LayoutMeasure", this.layout.layoutBox, o ? o.layoutBox : void 0);
    }
    updateScroll(o = "measure") {
      let a = !!(this.options.layoutScroll && this.instance);
      if (
        (this.scroll &&
          this.scroll.animationId === this.root.animationId &&
          this.scroll.phase === o &&
          (a = !1),
        a && this.instance)
      ) {
        const l = i(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: o,
          isRoot: l,
          offset: n(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : l,
        };
      }
    }
    resetTransform() {
      if (!s) return;
      const o = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout,
        a = this.projectionDelta && !gi(this.projectionDelta),
        l = this.getTransformTemplate(),
        c = l ? l(this.latestValues, "") : void 0,
        u = c !== this.prevTransformTemplateValue;
      o &&
        this.instance &&
        (a || $(this.latestValues) || u) &&
        (s(this.instance, c), (this.shouldResetTransform = !1), this.scheduleRender());
    }
    measure(o = !0) {
      const a = this.measurePageBox();
      let l = this.removeElementScroll(a);
      return (
        o && (l = this.removeTransform(l)),
        Ir(l),
        {
          animationId: this.root.animationId,
          measuredBox: a,
          layoutBox: l,
          latestValues: {},
          source: this.id,
        }
      );
    }
    measurePageBox() {
      const { visualElement: o } = this.options;
      if (!o) return E();
      const a = o.measureViewportBox();
      if (!(this.scroll?.wasRoot || this.path.some(Br))) {
        const { scroll: c } = this.root;
        c && (J(a.x, c.offset.x), J(a.y, c.offset.y));
      }
      return a;
    }
    removeElementScroll(o) {
      const a = E();
      if ((B(a, o), this.scroll?.wasRoot)) return a;
      for (let l = 0; l < this.path.length; l++) {
        const c = this.path[l],
          { scroll: u, options: h } = c;
        c !== this.root &&
          u &&
          h.layoutScroll &&
          (u.wasRoot && B(a, o), J(a.x, u.offset.x), J(a.y, u.offset.y));
      }
      return a;
    }
    applyTransform(o, a = !1) {
      const l = E();
      B(l, o);
      for (let c = 0; c < this.path.length; c++) {
        const u = this.path[c];
        (!a &&
          u.options.layoutScroll &&
          u.scroll &&
          u !== u.root &&
          Q(l, { x: -u.scroll.offset.x, y: -u.scroll.offset.y }),
          $(u.latestValues) && Q(l, u.latestValues));
      }
      return ($(this.latestValues) && Q(l, this.latestValues), l);
    }
    removeTransform(o) {
      const a = E();
      B(a, o);
      for (let l = 0; l < this.path.length; l++) {
        const c = this.path[l];
        if (!c.instance || !$(c.latestValues)) continue;
        Zt(c.latestValues) && c.updateSnapshot();
        const u = E(),
          h = c.measurePageBox();
        (B(u, h), _e(a, c.latestValues, c.snapshot ? c.snapshot.layoutBox : void 0, u));
      }
      return ($(this.latestValues) && _e(a, this.latestValues), a);
    }
    setTargetDelta(o) {
      ((this.targetDelta = o), this.root.scheduleUpdateProjection(), (this.isProjectionDirty = !0));
    }
    setOptions(o) {
      this.options = {
        ...this.options,
        ...o,
        crossfade: o.crossfade !== void 0 ? o.crossfade : !0,
      };
    }
    clearMeasurements() {
      ((this.scroll = void 0),
        (this.layout = void 0),
        (this.snapshot = void 0),
        (this.prevTransformTemplateValue = void 0),
        (this.targetDelta = void 0),
        (this.target = void 0),
        (this.isLayoutDirty = !1));
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent &&
        this.relativeParent.resolvedRelativeTargetAt !== L.timestamp &&
        this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(o = !1) {
      const a = this.getLead();
      (this.isProjectionDirty || (this.isProjectionDirty = a.isProjectionDirty),
        this.isTransformDirty || (this.isTransformDirty = a.isTransformDirty),
        this.isSharedProjectionDirty || (this.isSharedProjectionDirty = a.isSharedProjectionDirty));
      const l = !!this.resumingFrom || this !== a;
      if (
        !(
          o ||
          (l && this.isSharedProjectionDirty) ||
          this.isProjectionDirty ||
          this.parent?.isProjectionDirty ||
          this.attemptToResolveRelativeTarget ||
          this.root.updateBlockedByResize
        )
      )
        return;
      const { layout: u, layoutId: h } = this.options;
      if (!this.layout || !(u || h)) return;
      this.resolvedRelativeTargetAt = L.timestamp;
      const f = this.getClosestProjectingParent();
      (f &&
        this.linkedParentVersion !== f.layoutVersion &&
        !f.options.layoutRoot &&
        this.removeRelativeTarget(),
        !this.targetDelta &&
          !this.relativeTarget &&
          (f && f.layout
            ? this.createRelativeTarget(f, this.layout.layoutBox, f.layout.layoutBox)
            : this.removeRelativeTarget()),
        !(!this.relativeTarget && !this.targetDelta) &&
          (this.target || ((this.target = E()), (this.targetWithTransforms = E())),
          this.relativeTarget &&
          this.relativeTargetOrigin &&
          this.relativeParent &&
          this.relativeParent.target
            ? (this.forceRelativeParentToResolveTarget(),
              sr(this.target, this.relativeTarget, this.relativeParent.target))
            : this.targetDelta
              ? (this.resumingFrom
                  ? (this.target = this.applyTransform(this.layout.layoutBox))
                  : B(this.target, this.layout.layoutBox),
                ci(this.target, this.targetDelta))
              : B(this.target, this.layout.layoutBox),
          this.attemptToResolveRelativeTarget &&
            ((this.attemptToResolveRelativeTarget = !1),
            f &&
            !!f.resumingFrom == !!this.resumingFrom &&
            !f.options.layoutScroll &&
            f.target &&
            this.animationProgress !== 1
              ? this.createRelativeTarget(f, this.target, f.target)
              : (this.relativeParent = this.relativeTarget = void 0))));
    }
    getClosestProjectingParent() {
      if (!(!this.parent || Zt(this.parent.latestValues) || li(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!(
        (this.relativeTarget || this.targetDelta || this.options.layoutRoot) &&
        this.layout
      );
    }
    createRelativeTarget(o, a, l) {
      ((this.relativeParent = o),
        (this.linkedParentVersion = o.layoutVersion),
        this.forceRelativeParentToResolveTarget(),
        (this.relativeTarget = E()),
        (this.relativeTargetOrigin = E()),
        Dt(this.relativeTargetOrigin, a, l),
        B(this.relativeTarget, this.relativeTargetOrigin));
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      const o = this.getLead(),
        a = !!this.resumingFrom || this !== o;
      let l = !0;
      if (
        ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (l = !1),
        a && (this.isSharedProjectionDirty || this.isTransformDirty) && (l = !1),
        this.resolvedRelativeTargetAt === L.timestamp && (l = !1),
        l)
      )
        return;
      const { layout: c, layoutId: u } = this.options;
      if (
        ((this.isTreeAnimating = !!(
          (this.parent && this.parent.isTreeAnimating) ||
          this.currentAnimation ||
          this.pendingAnimation
        )),
        this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0),
        !this.layout || !(c || u))
      )
        return;
      B(this.layoutCorrected, this.layout.layoutBox);
      const h = this.treeScale.x,
        f = this.treeScale.y;
      (Wo(this.layoutCorrected, this.treeScale, this.path, a),
        o.layout &&
          !o.target &&
          (this.treeScale.x !== 1 || this.treeScale.y !== 1) &&
          ((o.target = o.layout.layoutBox), (o.targetWithTransforms = E())));
      const { target: d } = o;
      if (!d) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      (!this.projectionDelta || !this.prevProjectionDelta
        ? this.createProjectionDeltas()
        : (Ne(this.prevProjectionDelta.x, this.projectionDelta.x),
          Ne(this.prevProjectionDelta.y, this.projectionDelta.y)),
        ot(this.projectionDelta, this.layoutCorrected, d, this.latestValues),
        (this.treeScale.x !== h ||
          this.treeScale.y !== f ||
          !Ze(this.projectionDelta.x, this.prevProjectionDelta.x) ||
          !Ze(this.projectionDelta.y, this.prevProjectionDelta.y)) &&
          ((this.hasProjected = !0),
          this.scheduleRender(),
          this.notifyListeners("projectionUpdate", d)));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(o = !0) {
      if ((this.options.visualElement?.scheduleRender(), o)) {
        const a = this.getStack();
        a && a.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      ((this.prevProjectionDelta = q()),
        (this.projectionDelta = q()),
        (this.projectionDeltaWithTransform = q()));
    }
    setAnimationOrigin(o, a = !1) {
      const l = this.snapshot,
        c = l ? l.latestValues : {},
        u = { ...this.latestValues },
        h = q();
      ((!this.relativeParent || !this.relativeParent.options.layoutRoot) &&
        (this.relativeTarget = this.relativeTargetOrigin = void 0),
        (this.attemptToResolveRelativeTarget = !a));
      const f = E(),
        d = l ? l.source : void 0,
        m = this.layout ? this.layout.source : void 0,
        g = d !== m,
        y = this.getStack(),
        p = !y || y.members.length <= 1,
        v = !!(g && !p && this.options.crossfade === !0 && !this.path.some(Rr));
      this.animationProgress = 0;
      let x;
      ((this.mixTargetDelta = (w) => {
        const T = w / 1e3;
        (on(h.x, o.x, T),
          on(h.y, o.y, T),
          this.setTargetDelta(h),
          this.relativeTarget &&
            this.relativeTargetOrigin &&
            this.layout &&
            this.relativeParent &&
            this.relativeParent.layout &&
            (Dt(f, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
            Mr(this.relativeTarget, this.relativeTargetOrigin, f, T),
            x && lr(this.relativeTarget, x) && (this.isProjectionDirty = !1),
            x || (x = E()),
            B(x, this.relativeTarget)),
          g && ((this.animationValues = u), hr(u, c, this.latestValues, T, v, p)),
          this.root.scheduleUpdateProjection(),
          this.scheduleRender(),
          (this.animationProgress = T));
      }),
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0));
    }
    startAnimation(o) {
      (this.notifyListeners("animationStart"),
        this.currentAnimation?.stop(),
        this.resumingFrom?.currentAnimation?.stop(),
        this.pendingAnimation && (et(this.pendingAnimation), (this.pendingAnimation = void 0)),
        (this.pendingAnimation = V.update(() => {
          ((vt.hasAnimatedSinceResize = !0),
            this.motionValue || (this.motionValue = se(0)),
            this.motionValue.jump(0, !1),
            (this.currentAnimation = mr(this.motionValue, [0, 1e3], {
              ...o,
              velocity: 0,
              isSync: !0,
              onUpdate: (a) => {
                (this.mixTargetDelta(a), o.onUpdate && o.onUpdate(a));
              },
              onStop: () => {},
              onComplete: () => {
                (o.onComplete && o.onComplete(), this.completeAnimation());
              },
            })),
            this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation),
            (this.pendingAnimation = void 0));
        })));
    }
    completeAnimation() {
      this.resumingFrom &&
        ((this.resumingFrom.currentAnimation = void 0),
        (this.resumingFrom.preserveOpacity = void 0));
      const o = this.getStack();
      (o && o.exitAnimationComplete(),
        (this.resumingFrom = this.currentAnimation = this.animationValues = void 0),
        this.notifyListeners("animationComplete"));
    }
    finishAnimation() {
      (this.currentAnimation &&
        (this.mixTargetDelta && this.mixTargetDelta(xr), this.currentAnimation.stop()),
        this.completeAnimation());
    }
    applyTransformsToTarget() {
      const o = this.getLead();
      let { targetWithTransforms: a, target: l, layout: c, latestValues: u } = o;
      if (!(!a || !l || !c)) {
        if (
          this !== o &&
          this.layout &&
          c &&
          Si(this.options.animationType, this.layout.layoutBox, c.layoutBox)
        ) {
          l = this.target || E();
          const h = M(this.layout.layoutBox.x);
          ((l.x.min = o.target.x.min), (l.x.max = l.x.min + h));
          const f = M(this.layout.layoutBox.y);
          ((l.y.min = o.target.y.min), (l.y.max = l.y.min + f));
        }
        (B(a, l), Q(a, u), ot(this.projectionDeltaWithTransform, this.layoutCorrected, a, u));
      }
    }
    registerSharedNode(o, a) {
      (this.sharedNodes.has(o) || this.sharedNodes.set(o, new vr()),
        this.sharedNodes.get(o).add(a));
      const c = a.options.initialPromotionConfig;
      a.promote({
        transition: c ? c.transition : void 0,
        preserveFollowOpacity:
          c && c.shouldPreserveFollowOpacity ? c.shouldPreserveFollowOpacity(a) : void 0,
      });
    }
    isLead() {
      const o = this.getStack();
      return o ? o.lead === this : !0;
    }
    getLead() {
      const { layoutId: o } = this.options;
      return o ? this.getStack()?.lead || this : this;
    }
    getPrevLead() {
      const { layoutId: o } = this.options;
      return o ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      const { layoutId: o } = this.options;
      if (o) return this.root.sharedNodes.get(o);
    }
    promote({ needsReset: o, transition: a, preserveFollowOpacity: l } = {}) {
      const c = this.getStack();
      (c && c.promote(this, l),
        o && ((this.projectionDelta = void 0), (this.needsReset = !0)),
        a && this.setOptions({ transition: a }));
    }
    relegate() {
      const o = this.getStack();
      return o ? o.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: o } = this.options;
      if (!o) return;
      let a = !1;
      const { latestValues: l } = o;
      if (
        ((l.z || l.rotate || l.rotateX || l.rotateY || l.rotateZ || l.skewX || l.skewY) && (a = !0),
        !a)
      )
        return;
      const c = {};
      l.z && It("z", o, c, this.animationValues);
      for (let u = 0; u < kt.length; u++)
        (It(`rotate${kt[u]}`, o, c, this.animationValues),
          It(`skew${kt[u]}`, o, c, this.animationValues));
      o.render();
      for (const u in c)
        (o.setStaticValue(u, c[u]), this.animationValues && (this.animationValues[u] = c[u]));
      o.scheduleRender();
    }
    applyProjectionStyles(o, a) {
      if (!this.instance || this.isSVG) return;
      if (!this.isVisible) {
        o.visibility = "hidden";
        return;
      }
      const l = this.getTransformTemplate();
      if (this.needsReset) {
        ((this.needsReset = !1),
          (o.visibility = ""),
          (o.opacity = ""),
          (o.pointerEvents = Vt(a?.pointerEvents) || ""),
          (o.transform = l ? l(this.latestValues, "") : "none"));
        return;
      }
      const c = this.getLead();
      if (!this.projectionDelta || !this.layout || !c.target) {
        (this.options.layoutId &&
          ((o.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1),
          (o.pointerEvents = Vt(a?.pointerEvents) || "")),
          this.hasProjected &&
            !$(this.latestValues) &&
            ((o.transform = l ? l({}, "") : "none"), (this.hasProjected = !1)));
        return;
      }
      o.visibility = "";
      const u = c.animationValues || c.latestValues;
      this.applyTransformsToTarget();
      let h = cr(this.projectionDeltaWithTransform, this.treeScale, u);
      (l && (h = l(u, h)), (o.transform = h));
      const { x: f, y: d } = this.projectionDelta;
      ((o.transformOrigin = `${f.origin * 100}% ${d.origin * 100}% 0`),
        c.animationValues
          ? (o.opacity =
              c === this
                ? (u.opacity ?? this.latestValues.opacity ?? 1)
                : this.preserveOpacity
                  ? this.latestValues.opacity
                  : u.opacityExit)
          : (o.opacity =
              c === this
                ? u.opacity !== void 0
                  ? u.opacity
                  : ""
                : u.opacityExit !== void 0
                  ? u.opacityExit
                  : 0));
      for (const m in we) {
        if (u[m] === void 0) continue;
        const { correct: g, applyTo: y, isCSSVariable: p } = we[m],
          v = h === "none" ? u[m] : g(u[m], c);
        if (y) {
          const x = y.length;
          for (let w = 0; w < x; w++) o[y[w]] = v;
        } else p ? (this.options.visualElement.renderState.vars[m] = v) : (o[m] = v);
      }
      this.options.layoutId && (o.pointerEvents = c === this ? Vt(a?.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    resetTree() {
      (this.root.nodes.forEach((o) => o.currentAnimation?.stop()),
        this.root.nodes.forEach(en),
        this.root.sharedNodes.clear());
    }
  };
}
function Pr(t) {
  t.updateLayout();
}
function wr(t) {
  const e = t.resumeFrom?.snapshot || t.snapshot;
  if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
    const { layoutBox: n, measuredBox: i } = t.layout,
      { animationType: s } = t.options,
      r = e.source !== t.layout.source;
    s === "size"
      ? F((u) => {
          const h = r ? e.measuredBox[u] : e.layoutBox[u],
            f = M(h);
          ((h.min = n[u].min), (h.max = h.min + f));
        })
      : Si(s, e.layoutBox, n) &&
        F((u) => {
          const h = r ? e.measuredBox[u] : e.layoutBox[u],
            f = M(n[u]);
          ((h.max = h.min + f),
            t.relativeTarget &&
              !t.currentAnimation &&
              ((t.isProjectionDirty = !0),
              (t.relativeTarget[u].max = t.relativeTarget[u].min + f)));
        });
    const o = q();
    ot(o, n, e.layoutBox);
    const a = q();
    r ? ot(a, t.applyTransform(i, !0), e.measuredBox) : ot(a, n, e.layoutBox);
    const l = !gi(o);
    let c = !1;
    if (!t.resumeFrom) {
      const u = t.getClosestProjectingParent();
      if (u && !u.resumeFrom) {
        const { snapshot: h, layout: f } = u;
        if (h && f) {
          const d = E();
          Dt(d, e.layoutBox, h.layoutBox);
          const m = E();
          (Dt(m, n, f.layoutBox),
            vi(d, m) || (c = !0),
            u.options.layoutRoot &&
              ((t.relativeTarget = m), (t.relativeTargetOrigin = d), (t.relativeParent = u)));
        }
      }
    }
    t.notifyListeners("didUpdate", {
      layout: n,
      snapshot: e,
      delta: a,
      layoutDelta: o,
      hasLayoutChanged: l,
      hasRelativeLayoutChanged: c,
    });
  } else if (t.isLead()) {
    const { onExitComplete: n } = t.options;
    n && n();
  }
  t.options.transition = void 0;
}
function Sr(t) {
  t.parent &&
    (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty),
    t.isSharedProjectionDirty ||
      (t.isSharedProjectionDirty = !!(
        t.isProjectionDirty ||
        t.parent.isProjectionDirty ||
        t.parent.isSharedProjectionDirty
      )),
    t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty));
}
function Dr(t) {
  t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1;
}
function Ar(t) {
  t.clearSnapshot();
}
function en(t) {
  t.clearMeasurements();
}
function nn(t) {
  t.isLayoutDirty = !1;
}
function Vr(t) {
  const { visualElement: e } = t.options;
  (e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"), t.resetTransform());
}
function sn(t) {
  (t.finishAnimation(),
    (t.targetDelta = t.relativeTarget = t.target = void 0),
    (t.isProjectionDirty = !0));
}
function Er(t) {
  t.resolveTargetDelta();
}
function br(t) {
  t.calcProjection();
}
function Cr(t) {
  t.resetSkewAndRotation();
}
function Lr(t) {
  t.removeLeadSnapshot();
}
function on(t, e, n) {
  ((t.translate = A(e.translate, 0, n)),
    (t.scale = A(e.scale, 1, n)),
    (t.origin = e.origin),
    (t.originPoint = e.originPoint));
}
function rn(t, e, n, i) {
  ((t.min = A(e.min, n.min, i)), (t.max = A(e.max, n.max, i)));
}
function Mr(t, e, n, i) {
  (rn(t.x, e.x, n.x, i), rn(t.y, e.y, n.y, i));
}
function Rr(t) {
  return t.animationValues && t.animationValues.opacityExit !== void 0;
}
const kr = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
  an = (t) =>
    typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t),
  ln = an("applewebkit/") && !an("chrome/") ? Math.round : N;
function cn(t) {
  ((t.min = ln(t.min)), (t.max = ln(t.max)));
}
function Ir(t) {
  (cn(t.x), cn(t.y));
}
function Si(t, e, n) {
  return t === "position" || (t === "preserve-aspect" && !ir(qe(e), qe(n), 0.2));
}
function Br(t) {
  return t !== t.root && t.scroll?.wasRoot;
}
const jr = wi({
    attachResizeListener: (t, e) => lt(t, "resize", e),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
      y: document.documentElement.scrollTop || document.body?.scrollTop || 0,
    }),
    checkIsScrollRoot: () => !0,
  }),
  Bt = { current: void 0 },
  Di = wi({
    measureScroll: (t) => ({ x: t.scrollLeft, y: t.scrollTop }),
    defaultParent: () => {
      if (!Bt.current) {
        const t = new jr({});
        (t.mount(window), t.setOptions({ layoutScroll: !0 }), (Bt.current = t));
      }
      return Bt.current;
    },
    resetTransform: (t, e) => {
      t.style.transform = e !== void 0 ? e : "none";
    },
    checkIsScrollRoot: (t) => window.getComputedStyle(t).position === "fixed",
  });
function Or(t = !0) {
  const e = O.useContext(is);
  if (e === null) return [!0, null];
  const { isPresent: n, onExitComplete: i, register: s } = e,
    r = O.useId();
  O.useEffect(() => {
    if (t) return s(r);
  }, [t]);
  const o = O.useCallback(() => t && i && i(r), [r, i, t]);
  return !n && i ? [!1, o] : [!0];
}
function Fr({ children: t, features: e, strict: n = !1 }) {
  const [, i] = O.useState(!jt(e)),
    s = O.useRef(void 0);
  if (!jt(e)) {
    const { renderer: r, ...o } = e;
    ((s.current = r), Se(o));
  }
  return (
    O.useEffect(() => {
      jt(e) &&
        e().then(({ renderer: r, ...o }) => {
          (Se(o), (s.current = r), i(!0));
        });
    }, []),
    ee.jsx(ss.Provider, { value: { renderer: s.current, strict: n }, children: t })
  );
}
function jt(t) {
  return typeof t == "function";
}
const Ur = (t, e) =>
  (e.isSVG ?? os(t)) ? new _o(e) : new Ho(e, { allowProjection: t !== O.Fragment });
class Nr extends H {
  constructor(e) {
    (super(e), e.animationState || (e.animationState = Zo(e)));
  }
  updateAnimationControlsSubscription() {
    const { animate: e } = this.node.getProps();
    Ln(e) && (this.unmountControls = e.subscribe(this.node));
  }
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: e } = this.node.getProps(),
      { animate: n } = this.node.prevProps || {};
    e !== n && this.updateAnimationControlsSubscription();
  }
  unmount() {
    (this.node.animationState.reset(), this.unmountControls?.());
  }
}
let Wr = 0;
class Gr extends H {
  constructor() {
    (super(...arguments), (this.id = Wr++));
  }
  update() {
    if (!this.node.presenceContext) return;
    const { isPresent: e, onExitComplete: n } = this.node.presenceContext,
      { isPresent: i } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || e === i) return;
    const s = this.node.animationState.setActive("exit", !e);
    n &&
      !e &&
      s.then(() => {
        n(this.id);
      });
  }
  mount() {
    const { register: e, onExitComplete: n } = this.node.presenceContext || {};
    (n && n(this.id), e && (this.unmount = e(this.id)));
  }
  unmount() {}
}
const Kr = { animation: { Feature: Nr }, exit: { Feature: Gr } };
function ht(t) {
  return { point: { x: t.pageX, y: t.pageY } };
}
const Hr = (t) => (e) => de(e) && t(e, ht(e));
function rt(t, e, n, i) {
  return lt(t, e, Hr(n), i);
}
const Ai = ({ current: t }) => (t ? t.ownerDocument.defaultView : null),
  un = (t, e) => Math.abs(t - e);
function zr(t, e) {
  const n = un(t.x, e.x),
    i = un(t.y, e.y);
  return Math.sqrt(n ** 2 + i ** 2);
}
const hn = new Set(["auto", "scroll"]);
class Vi {
  constructor(
    e,
    n,
    {
      transformPagePoint: i,
      contextWindow: s = window,
      dragSnapToOrigin: r = !1,
      distanceThreshold: o = 3,
      element: a,
    } = {},
  ) {
    if (
      ((this.startEvent = null),
      (this.lastMoveEvent = null),
      (this.lastMoveEventInfo = null),
      (this.handlers = {}),
      (this.contextWindow = window),
      (this.scrollPositions = new Map()),
      (this.removeScrollListeners = null),
      (this.onElementScroll = (d) => {
        this.handleScroll(d.target);
      }),
      (this.onWindowScroll = () => {
        this.handleScroll(window);
      }),
      (this.updatePoint = () => {
        if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
        const d = Ft(this.lastMoveEventInfo, this.history),
          m = this.startEvent !== null,
          g = zr(d.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
        if (!m && !g) return;
        const { point: y } = d,
          { timestamp: p } = L;
        this.history.push({ ...y, timestamp: p });
        const { onStart: v, onMove: x } = this.handlers;
        (m || (v && v(this.lastMoveEvent, d), (this.startEvent = this.lastMoveEvent)),
          x && x(this.lastMoveEvent, d));
      }),
      (this.handlePointerMove = (d, m) => {
        ((this.lastMoveEvent = d),
          (this.lastMoveEventInfo = Ot(m, this.transformPagePoint)),
          V.update(this.updatePoint, !0));
      }),
      (this.handlePointerUp = (d, m) => {
        this.end();
        const { onEnd: g, onSessionEnd: y, resumeAnimation: p } = this.handlers;
        if (
          ((this.dragSnapToOrigin || !this.startEvent) && p && p(),
          !(this.lastMoveEvent && this.lastMoveEventInfo))
        )
          return;
        const v = Ft(
          d.type === "pointercancel" ? this.lastMoveEventInfo : Ot(m, this.transformPagePoint),
          this.history,
        );
        (this.startEvent && g && g(d, v), y && y(d, v));
      }),
      !de(e))
    )
      return;
    ((this.dragSnapToOrigin = r),
      (this.handlers = n),
      (this.transformPagePoint = i),
      (this.distanceThreshold = o),
      (this.contextWindow = s || window));
    const l = ht(e),
      c = Ot(l, this.transformPagePoint),
      { point: u } = c,
      { timestamp: h } = L;
    this.history = [{ ...u, timestamp: h }];
    const { onSessionStart: f } = n;
    (f && f(e, Ft(c, this.history)),
      (this.removeListeners = ct(
        rt(this.contextWindow, "pointermove", this.handlePointerMove),
        rt(this.contextWindow, "pointerup", this.handlePointerUp),
        rt(this.contextWindow, "pointercancel", this.handlePointerUp),
      )),
      a && this.startScrollTracking(a));
  }
  startScrollTracking(e) {
    let n = e.parentElement;
    for (; n; ) {
      const i = getComputedStyle(n);
      ((hn.has(i.overflowX) || hn.has(i.overflowY)) &&
        this.scrollPositions.set(n, { x: n.scrollLeft, y: n.scrollTop }),
        (n = n.parentElement));
    }
    (this.scrollPositions.set(window, { x: window.scrollX, y: window.scrollY }),
      window.addEventListener("scroll", this.onElementScroll, { capture: !0 }),
      window.addEventListener("scroll", this.onWindowScroll),
      (this.removeScrollListeners = () => {
        (window.removeEventListener("scroll", this.onElementScroll, { capture: !0 }),
          window.removeEventListener("scroll", this.onWindowScroll));
      }));
  }
  handleScroll(e) {
    const n = this.scrollPositions.get(e);
    if (!n) return;
    const i = e === window,
      s = i ? { x: window.scrollX, y: window.scrollY } : { x: e.scrollLeft, y: e.scrollTop },
      r = { x: s.x - n.x, y: s.y - n.y };
    (r.x === 0 && r.y === 0) ||
      (i
        ? this.lastMoveEventInfo &&
          ((this.lastMoveEventInfo.point.x += r.x), (this.lastMoveEventInfo.point.y += r.y))
        : this.history.length > 0 && ((this.history[0].x -= r.x), (this.history[0].y -= r.y)),
      this.scrollPositions.set(e, s),
      V.update(this.updatePoint, !0));
  }
  updateHandlers(e) {
    this.handlers = e;
  }
  end() {
    (this.removeListeners && this.removeListeners(),
      this.removeScrollListeners && this.removeScrollListeners(),
      this.scrollPositions.clear(),
      et(this.updatePoint));
  }
}
function Ot(t, e) {
  return e ? { point: e(t.point) } : t;
}
function fn(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function Ft({ point: t }, e) {
  return { point: t, delta: fn(t, Ei(e)), offset: fn(t, _r(e)), velocity: $r(e, 0.1) };
}
function _r(t) {
  return t[0];
}
function Ei(t) {
  return t[t.length - 1];
}
function $r(t, e) {
  if (t.length < 2) return { x: 0, y: 0 };
  let n = t.length - 1,
    i = null;
  const s = Ei(t);
  for (; n >= 0 && ((i = t[n]), !(s.timestamp - i.timestamp > G(e))); ) n--;
  if (!i) return { x: 0, y: 0 };
  i === t[0] && t.length > 2 && s.timestamp - i.timestamp > G(e) * 2 && (i = t[1]);
  const r = W(s.timestamp - i.timestamp);
  if (r === 0) return { x: 0, y: 0 };
  const o = { x: (s.x - i.x) / r, y: (s.y - i.y) / r };
  return (o.x === 1 / 0 && (o.x = 0), o.y === 1 / 0 && (o.y = 0), o);
}
function Xr(t, { min: e, max: n }, i) {
  return (
    e !== void 0 && t < e
      ? (t = i ? A(e, t, i.min) : Math.max(t, e))
      : n !== void 0 && t > n && (t = i ? A(n, t, i.max) : Math.min(t, n)),
    t
  );
}
function dn(t, e, n) {
  return {
    min: e !== void 0 ? t.min + e : void 0,
    max: n !== void 0 ? t.max + n - (t.max - t.min) : void 0,
  };
}
function Yr(t, { top: e, left: n, bottom: i, right: s }) {
  return { x: dn(t.x, n, s), y: dn(t.y, e, i) };
}
function mn(t, e) {
  let n = e.min - t.min,
    i = e.max - t.max;
  return (e.max - e.min < t.max - t.min && ([n, i] = [i, n]), { min: n, max: i });
}
function qr(t, e) {
  return { x: mn(t.x, e.x), y: mn(t.y, e.y) };
}
function Zr(t, e) {
  let n = 0.5;
  const i = M(t),
    s = M(e);
  return (
    s > i ? (n = at(e.min, e.max - i, t.min)) : i > s && (n = at(t.min, t.max - s, e.min)),
    K(0, 1, n)
  );
}
function Jr(t, e) {
  const n = {};
  return (
    e.min !== void 0 && (n.min = e.min - t.min), e.max !== void 0 && (n.max = e.max - t.min), n
  );
}
const Qt = 0.35;
function Qr(t = Qt) {
  return (
    t === !1 ? (t = 0) : t === !0 && (t = Qt),
    { x: pn(t, "left", "right"), y: pn(t, "top", "bottom") }
  );
}
function pn(t, e, n) {
  return { min: yn(t, e), max: yn(t, n) };
}
function yn(t, e) {
  return typeof t == "number" ? t : t[e] || 0;
}
const ta = new WeakMap();
class ea {
  constructor(e) {
    ((this.openDragLock = null),
      (this.isDragging = !1),
      (this.currentDirection = null),
      (this.originPoint = { x: 0, y: 0 }),
      (this.constraints = !1),
      (this.hasMutatedConstraints = !1),
      (this.elastic = E()),
      (this.latestPointerEvent = null),
      (this.latestPanInfo = null),
      (this.visualElement = e));
  }
  start(e, { snapToCursor: n = !1, distanceThreshold: i } = {}) {
    const { presenceContext: s } = this.visualElement;
    if (s && s.isPresent === !1) return;
    const r = (h) => {
        (n && this.snapToCursor(ht(h).point), this.stopAnimation());
      },
      o = (h, f) => {
        const { drag: d, dragPropagation: m, onDragStart: g } = this.getProps();
        if (
          d &&
          !m &&
          (this.openDragLock && this.openDragLock(),
          (this.openDragLock = Po(d)),
          !this.openDragLock)
        )
          return;
        ((this.latestPointerEvent = h),
          (this.latestPanInfo = f),
          (this.isDragging = !0),
          (this.currentDirection = null),
          this.resolveConstraints(),
          this.visualElement.projection &&
            ((this.visualElement.projection.isAnimationBlocked = !0),
            (this.visualElement.projection.target = void 0)),
          F((p) => {
            let v = this.getAxisMotionValue(p).get() || 0;
            if (xt.test(v)) {
              const { projection: x } = this.visualElement;
              if (x && x.layout) {
                const w = x.layout.layoutBox[p];
                w && (v = M(w) * (parseFloat(v) / 100));
              }
            }
            this.originPoint[p] = v;
          }),
          g && V.update(() => g(h, f), !1, !0),
          Yt(this.visualElement, "transform"));
        const { animationState: y } = this.visualElement;
        y && y.setActive("whileDrag", !0);
      },
      a = (h, f) => {
        ((this.latestPointerEvent = h), (this.latestPanInfo = f));
        const {
          dragPropagation: d,
          dragDirectionLock: m,
          onDirectionLock: g,
          onDrag: y,
        } = this.getProps();
        if (!d && !this.openDragLock) return;
        const { offset: p } = f;
        if (m && this.currentDirection === null) {
          ((this.currentDirection = ia(p)),
            this.currentDirection !== null && g && g(this.currentDirection));
          return;
        }
        (this.updateAxis("x", f.point, p),
          this.updateAxis("y", f.point, p),
          this.visualElement.render(),
          y && V.update(() => y(h, f), !1, !0));
      },
      l = (h, f) => {
        ((this.latestPointerEvent = h),
          (this.latestPanInfo = f),
          this.stop(h, f),
          (this.latestPointerEvent = null),
          (this.latestPanInfo = null));
      },
      c = () => {
        const { dragSnapToOrigin: h } = this.getProps();
        (h || this.constraints) && this.startAnimation({ x: 0, y: 0 });
      },
      { dragSnapToOrigin: u } = this.getProps();
    this.panSession = new Vi(
      e,
      { onSessionStart: r, onStart: o, onMove: a, onSessionEnd: l, resumeAnimation: c },
      {
        transformPagePoint: this.visualElement.getTransformPagePoint(),
        dragSnapToOrigin: u,
        distanceThreshold: i,
        contextWindow: Ai(this.visualElement),
        element: this.visualElement.current,
      },
    );
  }
  stop(e, n) {
    const i = e || this.latestPointerEvent,
      s = n || this.latestPanInfo,
      r = this.isDragging;
    if ((this.cancel(), !r || !s || !i)) return;
    const { velocity: o } = s;
    this.startAnimation(o);
    const { onDragEnd: a } = this.getProps();
    a && V.postRender(() => a(i, s));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: e, animationState: n } = this.visualElement;
    (e && (e.isAnimationBlocked = !1), this.endPanSession());
    const { dragPropagation: i } = this.getProps();
    (!i && this.openDragLock && (this.openDragLock(), (this.openDragLock = null)),
      n && n.setActive("whileDrag", !1));
  }
  endPanSession() {
    (this.panSession && this.panSession.end(), (this.panSession = void 0));
  }
  updateAxis(e, n, i) {
    const { drag: s } = this.getProps();
    if (!i || !dt(e, s, this.currentDirection)) return;
    const r = this.getAxisMotionValue(e);
    let o = this.originPoint[e] + i[e];
    (this.constraints && this.constraints[e] && (o = Xr(o, this.constraints[e], this.elastic[e])),
      r.set(o));
  }
  resolveConstraints() {
    const { dragConstraints: e, dragElastic: n } = this.getProps(),
      i =
        this.visualElement.projection && !this.visualElement.projection.layout
          ? this.visualElement.projection.measure(!1)
          : this.visualElement.projection?.layout,
      s = this.constraints;
    (e && it(e)
      ? this.constraints || (this.constraints = this.resolveRefConstraints())
      : e && i
        ? (this.constraints = Yr(i.layoutBox, e))
        : (this.constraints = !1),
      (this.elastic = Qr(n)),
      s !== this.constraints &&
        !it(e) &&
        i &&
        this.constraints &&
        !this.hasMutatedConstraints &&
        F((r) => {
          this.constraints !== !1 &&
            this.getAxisMotionValue(r) &&
            (this.constraints[r] = Jr(i.layoutBox[r], this.constraints[r]));
        }));
  }
  resolveRefConstraints() {
    const { dragConstraints: e, onMeasureDragConstraints: n } = this.getProps();
    if (!e || !it(e)) return !1;
    const i = e.current,
      { projection: s } = this.visualElement;
    if (!s || !s.layout) return !1;
    const r = Go(i, s.root, this.visualElement.getTransformPagePoint());
    let o = qr(s.layout.layoutBox, r);
    if (n) {
      const a = n(Uo(o));
      ((this.hasMutatedConstraints = !!a), a && (o = ai(a)));
    }
    return o;
  }
  startAnimation(e) {
    const {
        drag: n,
        dragMomentum: i,
        dragElastic: s,
        dragTransition: r,
        dragSnapToOrigin: o,
        onDragTransitionEnd: a,
      } = this.getProps(),
      l = this.constraints || {},
      c = F((u) => {
        if (!dt(u, n, this.currentDirection)) return;
        let h = (l && l[u]) || {};
        o && (h = { min: 0, max: 0 });
        const f = s ? 200 : 1e6,
          d = s ? 40 : 1e7,
          m = {
            type: "inertia",
            velocity: i ? e[u] : 0,
            bounceStiffness: f,
            bounceDamping: d,
            timeConstant: 750,
            restDelta: 1,
            restSpeed: 10,
            ...r,
            ...h,
          };
        return this.startAxisValueAnimation(u, m);
      });
    return Promise.all(c).then(a);
  }
  startAxisValueAnimation(e, n) {
    const i = this.getAxisMotionValue(e);
    return (Yt(this.visualElement, e), i.start(fe(e, i, 0, n, this.visualElement, !1)));
  }
  stopAnimation() {
    F((e) => this.getAxisMotionValue(e).stop());
  }
  getAxisMotionValue(e) {
    const n = `_drag${e.toUpperCase()}`,
      i = this.visualElement.getProps(),
      s = i[n];
    return s || this.visualElement.getValue(e, (i.initial ? i.initial[e] : void 0) || 0);
  }
  snapToCursor(e) {
    F((n) => {
      const { drag: i } = this.getProps();
      if (!dt(n, i, this.currentDirection)) return;
      const { projection: s } = this.visualElement,
        r = this.getAxisMotionValue(n);
      if (s && s.layout) {
        const { min: o, max: a } = s.layout.layoutBox[n],
          l = r.get() || 0;
        r.set(e[n] - A(o, a, 0.5) + l);
      }
    });
  }
  scalePositionWithinConstraints() {
    if (!this.visualElement.current) return;
    const { drag: e, dragConstraints: n } = this.getProps(),
      { projection: i } = this.visualElement;
    if (!it(n) || !i || !this.constraints) return;
    this.stopAnimation();
    const s = { x: 0, y: 0 };
    F((o) => {
      const a = this.getAxisMotionValue(o);
      if (a && this.constraints !== !1) {
        const l = a.get();
        s[o] = Zr({ min: l, max: l }, this.constraints[o]);
      }
    });
    const { transformTemplate: r } = this.visualElement.getProps();
    ((this.visualElement.current.style.transform = r ? r({}, "") : "none"),
      i.root && i.root.updateScroll(),
      i.updateLayout(),
      (this.constraints = !1),
      this.resolveConstraints(),
      F((o) => {
        if (!dt(o, e, null)) return;
        const a = this.getAxisMotionValue(o),
          { min: l, max: c } = this.constraints[o];
        a.set(A(l, c, s[o]));
      }),
      this.visualElement.render());
  }
  addListeners() {
    if (!this.visualElement.current) return;
    ta.set(this.visualElement, this);
    const e = this.visualElement.current,
      n = rt(e, "pointerdown", (c) => {
        const { drag: u, dragListener: h = !0 } = this.getProps(),
          f = c.target,
          d = f !== e && Eo(f);
        u && h && !d && this.start(c);
      });
    let i;
    const s = () => {
        const { dragConstraints: c } = this.getProps();
        it(c) &&
          c.current &&
          ((this.constraints = this.resolveRefConstraints()),
          i || (i = na(e, c.current, () => this.scalePositionWithinConstraints())));
      },
      { projection: r } = this.visualElement,
      o = r.addEventListener("measure", s);
    (r && !r.layout && (r.root && r.root.updateScroll(), r.updateLayout()), V.read(s));
    const a = lt(window, "resize", () => this.scalePositionWithinConstraints()),
      l = r.addEventListener("didUpdate", ({ delta: c, hasLayoutChanged: u }) => {
        this.isDragging &&
          u &&
          (F((h) => {
            const f = this.getAxisMotionValue(h);
            f && ((this.originPoint[h] += c[h].translate), f.set(f.get() + c[h].translate));
          }),
          this.visualElement.render());
      });
    return () => {
      (a(), n(), o(), l && l(), i && i());
    };
  }
  getProps() {
    const e = this.visualElement.getProps(),
      {
        drag: n = !1,
        dragDirectionLock: i = !1,
        dragPropagation: s = !1,
        dragConstraints: r = !1,
        dragElastic: o = Qt,
        dragMomentum: a = !0,
      } = e;
    return {
      ...e,
      drag: n,
      dragDirectionLock: i,
      dragPropagation: s,
      dragConstraints: r,
      dragElastic: o,
      dragMomentum: a,
    };
  }
}
function gn(t) {
  let e = !0;
  return () => {
    if (e) {
      e = !1;
      return;
    }
    t();
  };
}
function na(t, e, n) {
  const i = Re(t, gn(n)),
    s = Re(e, gn(n));
  return () => {
    (i(), s());
  };
}
function dt(t, e, n) {
  return (e === !0 || e === t) && (n === null || n === t);
}
function ia(t, e = 10) {
  let n = null;
  return (Math.abs(t.y) > e ? (n = "y") : Math.abs(t.x) > e && (n = "x"), n);
}
class sa extends H {
  constructor(e) {
    (super(e),
      (this.removeGroupControls = N),
      (this.removeListeners = N),
      (this.controls = new ea(e)));
  }
  mount() {
    const { dragControls: e } = this.node.getProps();
    (e && (this.removeGroupControls = e.subscribe(this.controls)),
      (this.removeListeners = this.controls.addListeners() || N));
  }
  update() {
    const { dragControls: e } = this.node.getProps(),
      { dragControls: n } = this.node.prevProps || {};
    e !== n &&
      (this.removeGroupControls(), e && (this.removeGroupControls = e.subscribe(this.controls)));
  }
  unmount() {
    (this.removeGroupControls(),
      this.removeListeners(),
      this.controls.isDragging || this.controls.endPanSession());
  }
}
const Ut = (t) => (e, n) => {
  t && V.update(() => t(e, n), !1, !0);
};
class oa extends H {
  constructor() {
    (super(...arguments), (this.removePointerDownListener = N));
  }
  onPointerDown(e) {
    this.session = new Vi(e, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: Ai(this.node),
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: e, onPanStart: n, onPan: i, onPanEnd: s } = this.node.getProps();
    return {
      onSessionStart: Ut(e),
      onStart: Ut(n),
      onMove: Ut(i),
      onEnd: (r, o) => {
        (delete this.session, s && V.postRender(() => s(r, o)));
      },
    };
  }
  mount() {
    this.removePointerDownListener = rt(this.node.current, "pointerdown", (e) =>
      this.onPointerDown(e),
    );
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    (this.removePointerDownListener(), this.session && this.session.end());
  }
}
let Nt = !1;
class ra extends O.Component {
  componentDidMount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: i, layoutId: s } = this.props,
      { projection: r } = e;
    (r &&
      (n.group && n.group.add(r),
      i && i.register && s && i.register(r),
      Nt && r.root.didUpdate(),
      r.addEventListener("animationComplete", () => {
        this.safeToRemove();
      }),
      r.setOptions({
        ...r.options,
        layoutDependency: this.props.layoutDependency,
        onExitComplete: () => this.safeToRemove(),
      })),
      (vt.hasEverUpdated = !0));
  }
  getSnapshotBeforeUpdate(e) {
    const { layoutDependency: n, visualElement: i, drag: s, isPresent: r } = this.props,
      { projection: o } = i;
    return (
      o &&
        ((o.isPresent = r),
        e.layoutDependency !== n && o.setOptions({ ...o.options, layoutDependency: n }),
        (Nt = !0),
        s || e.layoutDependency !== n || n === void 0 || e.isPresent !== r
          ? o.willUpdate()
          : this.safeToRemove(),
        e.isPresent !== r &&
          (r
            ? o.promote()
            : o.relegate() ||
              V.postRender(() => {
                const a = o.getStack();
                (!a || !a.members.length) && this.safeToRemove();
              }))),
      null
    );
  }
  componentDidUpdate() {
    const { projection: e } = this.props.visualElement;
    e &&
      (e.root.didUpdate(),
      kn.postRender(() => {
        !e.currentAnimation && e.isLead() && this.safeToRemove();
      }));
  }
  componentWillUnmount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: i } = this.props,
      { projection: s } = e;
    ((Nt = !0),
      s &&
        (s.scheduleCheckAfterUnmount(),
        n && n.group && n.group.remove(s),
        i && i.deregister && i.deregister(s)));
  }
  safeToRemove() {
    const { safeToRemove: e } = this.props;
    e && e();
  }
  render() {
    return null;
  }
}
function bi(t) {
  const [e, n] = Or(),
    i = O.useContext(rs);
  return ee.jsx(ra, {
    ...t,
    layoutGroup: i,
    switchLayoutGroup: O.useContext(as),
    isPresent: e,
    safeToRemove: n,
  });
}
const aa = { pan: { Feature: oa }, drag: { Feature: sa, ProjectionNode: Di, MeasureLayout: bi } };
function vn(t, e, n) {
  const { props: i } = t;
  t.animationState && i.whileHover && t.animationState.setActive("whileHover", n === "Start");
  const s = "onHover" + n,
    r = i[s];
  r && V.postRender(() => r(e, ht(e)));
}
class la extends H {
  mount() {
    const { current: e } = this.node;
    e &&
      (this.unmount = So(e, (n, i) => (vn(this.node, i, "Start"), (s) => vn(this.node, s, "End"))));
  }
  unmount() {}
}
class ca extends H {
  constructor() {
    (super(...arguments), (this.isActive = !1));
  }
  onFocus() {
    let e = !1;
    try {
      e = this.node.current.matches(":focus-visible");
    } catch {
      e = !0;
    }
    !e ||
      !this.node.animationState ||
      (this.node.animationState.setActive("whileFocus", !0), (this.isActive = !0));
  }
  onBlur() {
    !this.isActive ||
      !this.node.animationState ||
      (this.node.animationState.setActive("whileFocus", !1), (this.isActive = !1));
  }
  mount() {
    this.unmount = ct(
      lt(this.node.current, "focus", () => this.onFocus()),
      lt(this.node.current, "blur", () => this.onBlur()),
    );
  }
  unmount() {}
}
function xn(t, e, n) {
  const { props: i } = t;
  if (t.current instanceof HTMLButtonElement && t.current.disabled) return;
  t.animationState && i.whileTap && t.animationState.setActive("whileTap", n === "Start");
  const s = "onTap" + (n === "End" ? "" : n),
    r = i[s];
  r && V.postRender(() => r(e, ht(e)));
}
class ua extends H {
  mount() {
    const { current: e } = this.node;
    if (!e) return;
    const { globalTapTarget: n, propagate: i } = this.node.props;
    this.unmount = Co(
      e,
      (s, r) => (
        xn(this.node, r, "Start"), (o, { success: a }) => xn(this.node, o, a ? "End" : "Cancel")
      ),
      { useGlobalTarget: n, stopPropagation: i?.tap === !1 },
    );
  }
  unmount() {}
}
const te = new WeakMap(),
  Wt = new WeakMap(),
  ha = (t) => {
    const e = te.get(t.target);
    e && e(t);
  },
  fa = (t) => {
    t.forEach(ha);
  };
function da({ root: t, ...e }) {
  const n = t || document;
  Wt.has(n) || Wt.set(n, {});
  const i = Wt.get(n),
    s = JSON.stringify(e);
  return (i[s] || (i[s] = new IntersectionObserver(fa, { root: t, ...e })), i[s]);
}
function ma(t, e, n) {
  const i = da(e);
  return (
    te.set(t, n),
    i.observe(t),
    () => {
      (te.delete(t), i.unobserve(t));
    }
  );
}
const pa = { some: 0, all: 1 };
class ya extends H {
  constructor() {
    (super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1));
  }
  startObserver() {
    this.unmount();
    const { viewport: e = {} } = this.node.getProps(),
      { root: n, margin: i, amount: s = "some", once: r } = e,
      o = {
        root: n ? n.current : void 0,
        rootMargin: i,
        threshold: typeof s == "number" ? s : pa[s],
      },
      a = (l) => {
        const { isIntersecting: c } = l;
        if (this.isInView === c || ((this.isInView = c), r && !c && this.hasEnteredView)) return;
        (c && (this.hasEnteredView = !0),
          this.node.animationState && this.node.animationState.setActive("whileInView", c));
        const { onViewportEnter: u, onViewportLeave: h } = this.node.getProps(),
          f = c ? u : h;
        f && f(l);
      };
    return ma(this.node.current, o, a);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u") return;
    const { props: e, prevProps: n } = this.node;
    ["amount", "margin", "root"].some(ga(e, n)) && this.startObserver();
  }
  unmount() {}
}
function ga({ viewport: t = {} }, { viewport: e = {} } = {}) {
  return (n) => t[n] !== e[n];
}
const va = {
    inView: { Feature: ya },
    tap: { Feature: ua },
    focus: { Feature: ca },
    hover: { Feature: la },
  },
  xa = { layout: { ProjectionNode: Di, MeasureLayout: bi } },
  Ta = { renderer: Ur, ...Kr, ...va },
  Pa = { ...Ta, ...aa, ...xa };
function Ea({ children: t }) {
  return ee.jsx(Fr, { features: Pa, strict: !0, children: t });
}
export { Ea as M, To as i, Or as u };
