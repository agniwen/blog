import { w as Lt, r as A, j as S, i as It } from "./main-Cq61YlVT.js";
import { a as Tt } from "./button-DCFLH-17.js";
import { c as x } from "./utils-8lG47UID.js";
import { S as Dt } from "./separator-DbLTj1dh.js";
const N = new WeakMap(),
  et = new WeakMap(),
  at = { current: [] };
let ot = !1,
  q = 0;
const G = new Set(),
  H = new Map();
function Vt(e) {
  const r = Array.from(e).sort((s, t) =>
    s instanceof k && s.options.deps.includes(t)
      ? 1
      : t instanceof k && t.options.deps.includes(s)
        ? -1
        : 0,
  );
  for (const s of r) {
    if (at.current.includes(s)) continue;
    (at.current.push(s), s.recompute());
    const t = et.get(s);
    if (t)
      for (const i of t) {
        const a = N.get(i);
        a && Vt(a);
      }
  }
}
function kt(e) {
  const r = { prevVal: e.prevState, currentVal: e.state };
  for (const s of e.listeners) s(r);
}
function Ot(e) {
  const r = { prevVal: e.prevState, currentVal: e.state };
  for (const s of e.listeners) s(r);
}
function Ft(e) {
  if ((q > 0 && !H.has(e) && H.set(e, e.prevState), G.add(e), !(q > 0) && !ot))
    try {
      for (ot = !0; G.size > 0; ) {
        const r = Array.from(G);
        G.clear();
        for (const s of r) {
          const t = H.get(s) ?? s.prevState;
          ((s.prevState = t), kt(s));
        }
        for (const s of r) {
          const t = N.get(s);
          t && (at.current.push(s), Vt(t));
        }
        for (const s of r) {
          const t = N.get(s);
          if (t) for (const i of t) Ot(i);
        }
      }
    } finally {
      ((ot = !1), (at.current = []), H.clear());
    }
}
function T(e) {
  q++;
  try {
    e();
  } finally {
    if ((q--, q === 0)) {
      const r = G.values().next().value;
      r && Ft(r);
    }
  }
}
function _t(e) {
  return typeof e == "function";
}
class ut {
  constructor(r, s) {
    ((this.listeners = new Set()),
      (this.subscribe = (t) => {
        var i, a;
        this.listeners.add(t);
        const n =
          (a = (i = this.options) == null ? void 0 : i.onSubscribe) == null
            ? void 0
            : a.call(i, t, this);
        return () => {
          (this.listeners.delete(t), n?.());
        };
      }),
      (this.prevState = r),
      (this.state = r),
      (this.options = s));
  }
  setState(r) {
    var s, t, i;
    ((this.prevState = this.state),
      (s = this.options) != null && s.updateFn
        ? (this.state = this.options.updateFn(this.prevState)(r))
        : _t(r)
          ? (this.state = r(this.prevState))
          : (this.state = r),
      (i = (t = this.options) == null ? void 0 : t.onUpdate) == null || i.call(t),
      Ft(this));
  }
}
class k {
  constructor(r) {
    ((this.listeners = new Set()),
      (this._subscriptions = []),
      (this.lastSeenDepValues = []),
      (this.getDepVals = () => {
        const s = this.options.deps.length,
          t = new Array(s),
          i = new Array(s);
        for (let a = 0; a < s; a++) {
          const n = this.options.deps[a];
          ((t[a] = n.prevState), (i[a] = n.state));
        }
        return (
          (this.lastSeenDepValues = i),
          { prevDepVals: t, currDepVals: i, prevVal: this.prevState ?? void 0 }
        );
      }),
      (this.recompute = () => {
        var s, t;
        this.prevState = this.state;
        const i = this.getDepVals();
        ((this.state = this.options.fn(i)), (t = (s = this.options).onUpdate) == null || t.call(s));
      }),
      (this.checkIfRecalculationNeededDeeply = () => {
        for (const a of this.options.deps) a instanceof k && a.checkIfRecalculationNeededDeeply();
        let s = !1;
        const t = this.lastSeenDepValues,
          { currDepVals: i } = this.getDepVals();
        for (let a = 0; a < i.length; a++)
          if (i[a] !== t[a]) {
            s = !0;
            break;
          }
        s && this.recompute();
      }),
      (this.mount = () => (
        this.registerOnGraph(),
        this.checkIfRecalculationNeededDeeply(),
        () => {
          this.unregisterFromGraph();
          for (const s of this._subscriptions) s();
        }
      )),
      (this.subscribe = (s) => {
        var t, i;
        this.listeners.add(s);
        const a = (i = (t = this.options).onSubscribe) == null ? void 0 : i.call(t, s, this);
        return () => {
          (this.listeners.delete(s), a?.());
        };
      }),
      (this.options = r),
      (this.state = r.fn({
        prevDepVals: void 0,
        prevVal: void 0,
        currDepVals: this.getDepVals().currDepVals,
      })));
  }
  registerOnGraph(r = this.options.deps) {
    for (const s of r)
      if (s instanceof k) (s.registerOnGraph(), this.registerOnGraph(s.options.deps));
      else if (s instanceof ut) {
        let t = N.get(s);
        (t || ((t = new Set()), N.set(s, t)), t.add(this));
        let i = et.get(this);
        (i || ((i = new Set()), et.set(this, i)), i.add(s));
      }
  }
  unregisterFromGraph(r = this.options.deps) {
    for (const s of r)
      if (s instanceof k) this.unregisterFromGraph(s.options.deps);
      else if (s instanceof ut) {
        const t = N.get(s);
        t && t.delete(this);
        const i = et.get(this);
        i && i.delete(s);
      }
  }
}
var Ct = class {
  constructor(e, r) {
    ((this.fn = e),
      (this.options = r),
      (this.lastExecutionTime = 0),
      (this.isPending = !1),
      (this.maybeExecute = (...s) => {
        const t = Date.now() - this.lastExecutionTime;
        if (this.options.leading && t >= this.options.wait) this.execute(...s);
        else if (((this.lastArgs = s), !this.timeoutId && this.options.trailing)) {
          const i = this.options.wait - t;
          ((this.isPending = !0),
            (this.timeoutId = setTimeout(() => {
              this.lastArgs !== void 0 && this.execute(...this.lastArgs);
            }, i)));
        }
      }),
      (this.execute = (...s) => {
        (this.fn(...s),
          this.options.onExecute?.(s, this),
          (this.lastExecutionTime = Date.now()),
          this.clearTimeout(),
          (this.lastArgs = void 0),
          (this.isPending = !1));
      }),
      (this.flush = () => {
        this.isPending && this.lastArgs && this.execute(...this.lastArgs);
      }),
      (this.cancel = () => {
        (this.clearTimeout(), (this.lastArgs = void 0), (this.isPending = !1));
      }),
      (this.clearTimeout = () => {
        this.timeoutId && (clearTimeout(this.timeoutId), (this.timeoutId = void 0));
      }),
      this.options.leading === void 0 &&
        this.options.trailing === void 0 &&
        ((this.options.leading = !0), (this.options.trailing = !0)));
  }
};
function xt(e, r) {
  return new Ct(e, r).maybeExecute;
}
class Pt {
  #a = !0;
  #e;
  #t;
  #c;
  #s;
  #o;
  #i;
  #l;
  #h = 0;
  #m = 5;
  #n = !1;
  #u = !1;
  #r = null;
  #f = () => {
    (this.debugLog("Connected to event bus"),
      (this.#o = !0),
      (this.#n = !1),
      this.debugLog("Emitting queued events", this.#s),
      this.#s.forEach((r) => this.emitEventToBus(r)),
      (this.#s = []),
      this.stopConnectLoop(),
      this.#t().removeEventListener("tanstack-connect-success", this.#f));
  };
  #d = () => {
    if (this.#h < this.#m) {
      (this.#h++, this.dispatchCustomEvent("tanstack-connect", {}));
      return;
    }
    (this.#t().removeEventListener("tanstack-connect", this.#d),
      (this.#u = !0),
      this.debugLog("Max retries reached, giving up on connection"),
      this.stopConnectLoop());
  };
  #v = () => {
    this.#n ||
      ((this.#n = !0), this.#t().addEventListener("tanstack-connect-success", this.#f), this.#d());
  };
  constructor({ pluginId: r, debug: s = !1, enabled: t = !0, reconnectEveryMs: i = 300 }) {
    ((this.#e = r),
      (this.#a = t),
      (this.#t = this.getGlobalTarget),
      (this.#c = s),
      this.debugLog(" Initializing event subscription for plugin", this.#e),
      (this.#s = []),
      (this.#o = !1),
      (this.#u = !1),
      (this.#i = null),
      (this.#l = i));
  }
  startConnectLoop() {
    this.#i !== null ||
      this.#o ||
      (this.debugLog(`Starting connect loop (every ${this.#l}ms)`),
      (this.#i = setInterval(this.#d, this.#l)));
  }
  stopConnectLoop() {
    ((this.#n = !1),
      this.#i !== null &&
        (clearInterval(this.#i),
        (this.#i = null),
        (this.#s = []),
        this.debugLog("Stopped connect loop")));
  }
  debugLog(...r) {
    this.#c && console.log(`🌴 [tanstack-devtools:${this.#e}-plugin]`, ...r);
  }
  getGlobalTarget() {
    if (typeof globalThis < "u" && globalThis.__TANSTACK_EVENT_TARGET__)
      return (this.debugLog("Using global event target"), globalThis.__TANSTACK_EVENT_TARGET__);
    if (typeof window < "u" && typeof window.addEventListener < "u")
      return (this.debugLog("Using window as event target"), window);
    const r = typeof EventTarget < "u" ? new EventTarget() : void 0;
    return typeof r > "u" || typeof r.addEventListener > "u"
      ? (this.debugLog("No event mechanism available, running in non-web environment"),
        { addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => !1 })
      : (this.debugLog("Using new EventTarget as fallback"), r);
  }
  getPluginId() {
    return this.#e;
  }
  dispatchCustomEventShim(r, s) {
    try {
      const t = new Event(r, { detail: s });
      this.#t().dispatchEvent(t);
    } catch {
      this.debugLog("Failed to dispatch shim event");
    }
  }
  dispatchCustomEvent(r, s) {
    try {
      this.#t().dispatchEvent(new CustomEvent(r, { detail: s }));
    } catch {
      this.dispatchCustomEventShim(r, s);
    }
  }
  emitEventToBus(r) {
    (this.debugLog("Emitting event to client bus", r),
      this.dispatchCustomEvent("tanstack-dispatch-event", r));
  }
  createEventPayload(r, s) {
    return { type: `${this.#e}:${r}`, payload: s, pluginId: this.#e };
  }
  emit(r, s) {
    if (!this.#a) {
      this.debugLog("Event bus client is disabled, not emitting event", r, s);
      return;
    }
    if (
      (this.#r &&
        (this.debugLog("Emitting event to internal event target", r, s),
        this.#r.dispatchEvent(
          new CustomEvent(`${this.#e}:${r}`, { detail: this.createEventPayload(r, s) }),
        )),
      this.#u)
    ) {
      this.debugLog("Previously failed to connect, not emitting to bus");
      return;
    }
    if (!this.#o) {
      (this.debugLog("Bus not available, will be pushed as soon as connected"),
        this.#s.push(this.createEventPayload(r, s)),
        typeof CustomEvent < "u" && !this.#n && (this.#v(), this.startConnectLoop()));
      return;
    }
    return this.emitEventToBus(this.createEventPayload(r, s));
  }
  on(r, s, t) {
    const i = t?.withEventTarget ?? !1,
      a = `${this.#e}:${r}`;
    if (
      (i &&
        (this.#r || (this.#r = new EventTarget()),
        this.#r.addEventListener(a, (u) => {
          s(u.detail);
        })),
      !this.#a)
    )
      return (this.debugLog("Event bus client is disabled, not registering event", a), () => {});
    const n = (u) => {
      (this.debugLog("Received event from bus", u.detail), s(u.detail));
    };
    return (
      this.#t().addEventListener(a, n),
      this.debugLog("Registered event to bus", a),
      () => {
        (i && this.#r?.removeEventListener(a, n), this.#t().removeEventListener(a, n));
      }
    );
  }
  onAll(r) {
    if (!this.#a)
      return (this.debugLog("Event bus client is disabled, not registering event"), () => {});
    const s = (t) => {
      const i = t.detail;
      r(i);
    };
    return (
      this.#t().addEventListener("tanstack-devtools-global", s),
      () => this.#t().removeEventListener("tanstack-devtools-global", s)
    );
  }
  onAllPluginEvents(r) {
    if (!this.#a)
      return (this.debugLog("Event bus client is disabled, not registering event"), () => {});
    const s = (t) => {
      const i = t.detail;
      (this.#e && i.pluginId !== this.#e) || r(i);
    };
    return (
      this.#t().addEventListener("tanstack-devtools-global", s),
      () => this.#t().removeEventListener("tanstack-devtools-global", s)
    );
  }
}
class Bt extends Pt {
  constructor() {
    super({ pluginId: "form-devtools", reconnectEveryMs: 1e3 });
  }
}
const L = new Bt();
function nt(e, r) {
  return typeof e == "function" ? e(r) : e;
}
function X(e, r) {
  return ft(r).reduce((t, i) => {
    if (t === null) return null;
    if (typeof t < "u") return t[i];
  }, e);
}
function J(e, r, s) {
  const t = ft(r);
  function i(a) {
    if (!t.length) return nt(s, a);
    const n = t.shift();
    if (typeof n == "string" || (typeof n == "number" && !Array.isArray(a)))
      return typeof a == "object" ? (a === null && (a = {}), { ...a, [n]: i(a[n]) }) : { [n]: i() };
    if (Array.isArray(a) && typeof n == "number") {
      const u = a.slice(0, n);
      return [...(u.length ? u : new Array(n)), i(a[n]), ...a.slice(n + 1)];
    }
    return [...new Array(n), i()];
  }
  return i(e);
}
function $t(e, r) {
  const s = ft(r);
  function t(i) {
    if (!i) return;
    if (s.length === 1) {
      const n = s[0];
      if (Array.isArray(i) && typeof n == "number") return i.filter((l, o) => o !== n);
      const { [n]: u, ...d } = i;
      return d;
    }
    const a = s.shift();
    if (
      (typeof a == "string" || (typeof a == "number" && !Array.isArray(i))) &&
      typeof i == "object"
    )
      return { ...i, [a]: t(i[a]) };
    if (typeof a == "number" && Array.isArray(i)) {
      if (a >= i.length) return i;
      const n = i.slice(0, a);
      return [...(n.length ? n : new Array(a)), t(i[a]), ...i.slice(a + 1)];
    }
    throw new Error("It seems we have created an infinite loop in deleteBy. ");
  }
  return t(e);
}
const Rt = /^(\d+)$/gm,
  Nt = /\.(\d+)(?=\.)/gm,
  Ut = /^(\d+)\./gm,
  Wt = /\.(\d+$)/gm,
  Kt = /\.{2,}/gm,
  dt = "__int__",
  Q = `${dt}$1`;
function ft(e) {
  if (Array.isArray(e)) return [...e];
  if (typeof e != "string") throw new Error("Path must be a string.");
  return e
    .replace(/(^\[)|]/gm, "")
    .replace(/\[/g, ".")
    .replace(Rt, Q)
    .replace(Nt, `.${Q}.`)
    .replace(Ut, `${Q}.`)
    .replace(Wt, `.${Q}`)
    .replace(Kt, ".")
    .split(".")
    .map((r) => {
      if (r.startsWith(dt)) {
        const s = r.substring(dt.length),
          t = parseInt(s, 10);
        return String(t) === s ? t : s;
      }
      return r;
    });
}
function zt(e) {
  return !(Array.isArray(e) && e.length === 0);
}
function ct(e, r) {
  const s = (t) => t.validators.filter(Boolean).map((i) => ({ cause: i.cause, validate: i.fn }));
  return r.validationLogic({
    form: r.form,
    validators: r.validators,
    event: { type: e, async: !1 },
    runValidation: s,
  });
}
function ht(e, r) {
  const { asyncDebounceMs: s } = r,
    {
      onBlurAsyncDebounceMs: t,
      onChangeAsyncDebounceMs: i,
      onDynamicAsyncDebounceMs: a,
    } = r.validators || {},
    n = s ?? 0,
    u = (d) =>
      d.validators.filter(Boolean).map((l) => {
        const o = l?.cause || e;
        let h = n;
        switch (o) {
          case "change":
            h = i ?? n;
            break;
          case "blur":
            h = t ?? n;
            break;
          case "dynamic":
            h = a ?? n;
            break;
          case "submit":
            h = 0;
            break;
        }
        return (e === "submit" && (h = 0), { cause: o, validate: l.fn, debounceMs: h });
      });
  return r.validationLogic({
    form: r.form,
    validators: r.validators,
    event: { type: e, async: !0 },
    runValidation: u,
  });
}
const st = (e) => !!e && typeof e == "object" && "fields" in e;
function _(e, r) {
  if (Object.is(e, r)) return !0;
  if (typeof e != "object" || e === null || typeof r != "object" || r === null) return !1;
  if (e instanceof Date && r instanceof Date) return e.getTime() === r.getTime();
  if (e instanceof Map && r instanceof Map) {
    if (e.size !== r.size) return !1;
    for (const [i, a] of e) if (!r.has(i) || !Object.is(a, r.get(i))) return !1;
    return !0;
  }
  if (e instanceof Set && r instanceof Set) {
    if (e.size !== r.size) return !1;
    for (const i of e) if (!r.has(i)) return !1;
    return !0;
  }
  const s = Object.keys(e),
    t = Object.keys(r);
  if (s.length !== t.length) return !1;
  for (const i of s) if (!t.includes(i) || !_(e[i], r[i])) return !1;
  return !0;
}
const vt = ({
    newFormValidatorError: e,
    isPreviousErrorFromFormValidator: r,
    previousErrorValue: s,
  }) =>
    e
      ? { newErrorValue: e, newSource: "form" }
      : r
        ? { newErrorValue: void 0, newSource: void 0 }
        : s
          ? { newErrorValue: s, newSource: "field" }
          : { newErrorValue: void 0, newSource: void 0 },
  gt = ({ formLevelError: e, fieldLevelError: r }) =>
    r
      ? { newErrorValue: r, newSource: "field" }
      : e
        ? { newErrorValue: e, newSource: "form" }
        : { newErrorValue: void 0, newSource: void 0 };
function w(e, r) {
  return e == null ? r : { ...e, ...r };
}
let C = 256;
const it = [];
let Y;
for (; C--; ) it[C] = (C + 256).toString(16).substring(1);
function Et() {
  let e = 0,
    r,
    s = "";
  if (!Y || C + 16 > 256) {
    for (Y = new Array(256), e = 256; e--; ) Y[e] = (256 * Math.random()) | 0;
    ((e = 0), (C = 0));
  }
  for (; e < 16; e++)
    ((r = Y[C + e]),
      e === 6 ? (s += it[(r & 15) | 64]) : e === 8 ? (s += it[(r & 63) | 128]) : (s += it[r]),
      e & 1 && e > 1 && e < 11 && (s += "-"));
  return (C++, s);
}
const Gt = xt((e) => L.emit("form-state", { id: e.formId, state: e.store.state }), { wait: 300 });
function j(e) {
  if (e === null || typeof e != "object") return e;
  if (e instanceof Date) return new Date(e.getTime());
  if (Array.isArray(e)) {
    const s = [];
    for (let t = 0; t < e.length; t++) s[t] = j(e[t]);
    return s;
  }
  if (e instanceof Map) {
    const s = new Map();
    return (
      e.forEach((t, i) => {
        s.set(i, j(t));
      }),
      s
    );
  }
  if (e instanceof Set) {
    const s = new Set();
    return (
      e.forEach((t) => {
        s.add(j(t));
      }),
      s
    );
  }
  const r = {};
  for (const s in e) Object.prototype.hasOwnProperty.call(e, s) && (r[s] = j(e[s]));
  return r;
}
const B = (e) => {
  if (!e.validators) return e.runValidation({ validators: [], form: e.form });
  const r = e.event.async,
    s = r ? void 0 : { fn: e.validators.onMount, cause: "mount" },
    t = { fn: r ? e.validators.onChangeAsync : e.validators.onChange, cause: "change" },
    i = { fn: r ? e.validators.onBlurAsync : e.validators.onBlur, cause: "blur" },
    a = { fn: r ? e.validators.onSubmitAsync : e.validators.onSubmit, cause: "submit" },
    n = r ? void 0 : { fn: () => {}, cause: "server" };
  switch (e.event.type) {
    case "mount":
      return e.runValidation({ validators: [s], form: e.form });
    case "submit":
      return e.runValidation({ validators: [t, i, a, n], form: e.form });
    case "server":
      return e.runValidation({ validators: [], form: e.form });
    case "blur":
      return e.runValidation({ validators: [i, n], form: e.form });
    case "change":
      return e.runValidation({ validators: [t, n], form: e.form });
    default:
      throw new Error(`Unknown validation event type: ${e.event.type}`);
  }
};
function jt(e, r) {
  const s = new Map();
  for (const t of e) {
    const i = t.path ?? [];
    let a = r,
      n = "";
    for (let u = 0; u < i.length; u++) {
      const d = i[u];
      if (d === void 0) continue;
      const l = typeof d == "object" ? d.key : d,
        o = Number(l);
      (Array.isArray(a) && !Number.isNaN(o)
        ? (n += `[${o}]`)
        : (n += (u > 0 ? "." : "") + String(l)),
        typeof a == "object" && a !== null ? (a = a[l]) : (a = void 0));
    }
    s.set(n, (s.get(n) ?? []).concat(t));
  }
  return Object.fromEntries(s);
}
const pt = (e, r) => {
    const s = jt(e, r);
    return { form: s, fields: s };
  },
  U = {
    validate({ value: e, validationSource: r }, s) {
      const t = s["~standard"].validate(e);
      if (t instanceof Promise) throw new Error("async function passed to sync validator");
      if (t.issues) return r === "field" ? t.issues : pt(t.issues, e);
    },
    async validateAsync({ value: e, validationSource: r }, s) {
      const t = await s["~standard"].validate(e);
      if (t.issues) return r === "field" ? t.issues : pt(t.issues, e);
    },
  },
  wt = (e) => !!e && "~standard" in e,
  $ = {
    isValidating: !1,
    isTouched: !1,
    isBlurred: !1,
    isDirty: !1,
    isPristine: !0,
    isValid: !0,
    isDefaultValue: !0,
    errors: [],
    errorMap: {},
    errorSourceMap: {},
  };
function Z(e) {
  function r(o, h, f) {
    const c = n(o, h, "move", f),
      m = Math.min(h, f),
      g = Math.max(h, f);
    for (let v = m; v <= g; v++) c.push(a(o, v));
    const p = Object.keys(e.fieldInfo).reduce(
      (v, M) => (M.startsWith(a(o, h)) && v.set(M, e.getFieldMeta(M)), v),
      new Map(),
    );
    (d(c, h < f ? "up" : "down"),
      Object.keys(e.fieldInfo)
        .filter((v) => v.startsWith(a(o, f)))
        .forEach((v) => {
          const M = v.replace(a(o, f), a(o, h)),
            y = p.get(M);
          y && e.setFieldMeta(v, y);
        }));
  }
  function s(o, h) {
    const f = n(o, h, "remove");
    d(f, "up");
  }
  function t(o, h, f) {
    n(o, h, "swap", f).forEach((m) => {
      if (!m.toString().startsWith(a(o, h))) return;
      const g = m.toString().replace(a(o, h), a(o, f)),
        [p, v] = [e.getFieldMeta(m), e.getFieldMeta(g)];
      (p && e.setFieldMeta(g, p), v && e.setFieldMeta(m, v));
    });
  }
  function i(o, h) {
    const f = n(o, h, "insert");
    (d(f, "down"),
      f.forEach((c) => {
        c.toString().startsWith(a(o, h)) && e.setFieldMeta(c, l());
      }));
  }
  function a(o, h) {
    return `${o}[${h}]`;
  }
  function n(o, h, f, c) {
    const m = [a(o, h)];
    switch (f) {
      case "swap":
        m.push(a(o, c));
        break;
      case "move": {
        const [g, p] = [Math.min(h, c), Math.max(h, c)];
        for (let v = g; v <= p; v++) m.push(a(o, v));
        break;
      }
      default: {
        const g = e.getFieldValue(o),
          p = Array.isArray(g) ? g.length : 0;
        for (let v = h + 1; v < p; v++) m.push(a(o, v));
        break;
      }
    }
    return Object.keys(e.fieldInfo).filter((g) => m.some((p) => g.startsWith(p)));
  }
  function u(o, h) {
    return o.replace(/\[(\d+)\]/, (f, c) => {
      const m = parseInt(c, 10);
      return `[${h === "up" ? m + 1 : Math.max(0, m - 1)}]`;
    });
  }
  function d(o, h) {
    (h === "up" ? o : [...o].reverse()).forEach((c) => {
      const m = u(c.toString(), h),
        g = e.getFieldMeta(m);
      g ? e.setFieldMeta(c, g) : e.setFieldMeta(c, l());
    });
  }
  const l = () => $;
  return { handleArrayMove: r, handleArrayRemove: s, handleArraySwap: t, handleArrayInsert: i };
}
function lt(e) {
  return {
    values: e.values ?? {},
    errorMap: e.errorMap ?? {},
    fieldMetaBase: e.fieldMetaBase ?? {},
    isSubmitted: e.isSubmitted ?? !1,
    isSubmitting: e.isSubmitting ?? !1,
    isValidating: e.isValidating ?? !1,
    submissionAttempts: e.submissionAttempts ?? 0,
    isSubmitSuccessful: e.isSubmitSuccessful ?? !1,
    validationMetaMap: e.validationMetaMap ?? {
      onChange: void 0,
      onBlur: void 0,
      onSubmit: void 0,
      onMount: void 0,
      onServer: void 0,
      onDynamic: void 0,
    },
  };
}
class Mt {
  constructor(r) {
    ((this.options = {}),
      (this.fieldInfo = {}),
      (this.mount = () => {
        const t = this.fieldMetaDerived.mount(),
          i = this.store.mount(),
          a = this.store.subscribe(() => {
            Gt(this);
          }),
          n = L.on("request-form-state", (h) => {
            h.payload.id === this._formId &&
              L.emit("form-api", {
                id: this._formId,
                state: this.store.state,
                options: this.options,
              });
          }),
          u = L.on("request-form-reset", (h) => {
            h.payload.id === this._formId && this.reset();
          }),
          d = L.on("request-form-force-submit", (h) => {
            h.payload.id === this._formId &&
              ((this._devtoolsSubmissionOverride = !0),
              this.handleSubmit(),
              (this._devtoolsSubmissionOverride = !1));
          }),
          l = () => {
            (d(), u(), n(), a(), t(), i(), L.emit("form-unmounted", { id: this._formId }));
          };
        this.options.listeners?.onMount?.({ formApi: this });
        const { onMount: o } = this.options.validators || {};
        return (
          L.emit("form-api", { id: this._formId, state: this.store.state, options: this.options }),
          o && this.validateSync("mount"),
          l
        );
      }),
      (this.update = (t) => {
        if (!t) return;
        const i = this.options;
        this.options = t;
        const a = t.defaultValues && !_(t.defaultValues, i.defaultValues) && !this.state.isTouched,
          n = !_(t.defaultState, i.defaultState) && !this.state.isTouched;
        (!a && !n) ||
          (T(() => {
            this.baseStore.setState(() =>
              lt(
                Object.assign(
                  {},
                  this.state,
                  n ? t.defaultState : {},
                  a ? { values: t.defaultValues } : {},
                ),
              ),
            );
          }),
          L.emit("form-api", { id: this._formId, state: this.store.state, options: this.options }));
      }),
      (this.reset = (t, i) => {
        const { fieldMeta: a } = this.state,
          n = this.resetFieldMeta(a);
        (t && !i?.keepDefaultValues && (this.options = { ...this.options, defaultValues: t }),
          this.baseStore.setState(() =>
            lt({
              ...this.options.defaultState,
              values: t ?? this.options.defaultValues ?? this.options.defaultState?.values,
              fieldMetaBase: n,
            }),
          ));
      }),
      (this.validateAllFields = async (t) => {
        const i = [];
        return (
          T(() => {
            Object.values(this.fieldInfo).forEach((n) => {
              if (!n.instance) return;
              const u = n.instance;
              (i.push(Promise.resolve().then(() => u.validate(t, { skipFormValidation: !0 }))),
                n.instance.state.meta.isTouched ||
                  n.instance.setMeta((d) => ({ ...d, isTouched: !0 })));
            });
          }),
          (await Promise.all(i)).flat()
        );
      }),
      (this.validateArrayFieldsStartingFrom = async (t, i, a) => {
        const n = this.getFieldValue(t),
          u = Array.isArray(n) ? Math.max(n.length - 1, 0) : null,
          d = [`${t}[${i}]`];
        for (let f = i + 1; f <= (u ?? 0); f++) d.push(`${t}[${f}]`);
        const l = Object.keys(this.fieldInfo).filter((f) => d.some((c) => f.startsWith(c))),
          o = [];
        return (
          T(() => {
            l.forEach((f) => {
              o.push(Promise.resolve().then(() => this.validateField(f, a)));
            });
          }),
          (await Promise.all(o)).flat()
        );
      }),
      (this.validateField = (t, i) => {
        const a = this.fieldInfo[t]?.instance;
        if (!a) {
          const { hasErrored: n } = this.validateSync(i);
          return n && !this.options.asyncAlways
            ? (this.getFieldMeta(t)?.errors ?? [])
            : this.validateAsync(i).then(() => this.getFieldMeta(t)?.errors ?? []);
        }
        return (
          a.state.meta.isTouched || a.setMeta((n) => ({ ...n, isTouched: !0 })), a.validate(i)
        );
      }),
      (this.validateSync = (t) => {
        const i = ct(t, {
          ...this.options,
          form: this,
          validationLogic: this.options.validationLogic || B,
        });
        let a = !1;
        const n = {};
        return (
          T(() => {
            for (const l of i) {
              if (!l.validate) continue;
              const o = this.runValidator({
                  validate: l.validate,
                  value: { value: this.state.values, formApi: this, validationSource: "form" },
                  type: "validate",
                }),
                { formError: h, fieldErrors: f } = rt(o),
                c = z(l.cause),
                m = new Set([...Object.keys(this.state.fieldMeta), ...Object.keys(f || {})]);
              for (const g of m) {
                if (this.baseStore.state.fieldMetaBase[g] === void 0 && !f?.[g]) continue;
                const p = this.getFieldMeta(g) ?? $,
                  { errorMap: v, errorSourceMap: M } = p,
                  y = f?.[g],
                  { newErrorValue: V, newSource: F } = vt({
                    newFormValidatorError: y,
                    isPreviousErrorFromFormValidator: M?.[c] === "form",
                    previousErrorValue: v?.[c],
                  });
                (F === "form" && (n[g] = { ...n[g], [c]: y }),
                  v?.[c] !== V &&
                    this.setFieldMeta(g, (I = $) => ({
                      ...I,
                      errorMap: { ...I.errorMap, [c]: V },
                      errorSourceMap: { ...I.errorSourceMap, [c]: F },
                    })));
              }
              (this.state.errorMap?.[c] !== h &&
                this.baseStore.setState((g) => ({ ...g, errorMap: { ...g.errorMap, [c]: h } })),
                (h || f) && (a = !0));
            }
            const u = z("submit");
            this.state.errorMap?.[u] &&
              t !== "submit" &&
              !a &&
              this.baseStore.setState((l) => ({ ...l, errorMap: { ...l.errorMap, [u]: void 0 } }));
            const d = z("server");
            this.state.errorMap?.[d] &&
              t !== "server" &&
              !a &&
              this.baseStore.setState((l) => ({ ...l, errorMap: { ...l.errorMap, [d]: void 0 } }));
          }),
          { hasErrored: a, fieldsErrorMap: n }
        );
      }),
      (this.validateAsync = async (t) => {
        const i = ht(t, {
          ...this.options,
          form: this,
          validationLogic: this.options.validationLogic || B,
        });
        this.state.isFormValidating ||
          this.baseStore.setState((l) => ({ ...l, isFormValidating: !0 }));
        const a = [];
        let n;
        for (const l of i) {
          if (!l.validate) continue;
          const o = z(l.cause);
          this.state.validationMetaMap[o]?.lastAbortController.abort();
          const f = new AbortController();
          ((this.state.validationMetaMap[o] = { lastAbortController: f }),
            a.push(
              new Promise(async (c) => {
                let m;
                try {
                  m = await new Promise((M, y) => {
                    setTimeout(async () => {
                      if (f.signal.aborted) return M(void 0);
                      try {
                        M(
                          await this.runValidator({
                            validate: l.validate,
                            value: {
                              value: this.state.values,
                              formApi: this,
                              validationSource: "form",
                              signal: f.signal,
                            },
                            type: "validateAsync",
                          }),
                        );
                      } catch (V) {
                        y(V);
                      }
                    }, l.debounceMs);
                  });
                } catch (M) {
                  m = M;
                }
                const { formError: g, fieldErrors: p } = rt(m);
                p && (n = n ? { ...n, ...p } : p);
                const v = z(l.cause);
                for (const M of Object.keys(this.state.fieldMeta)) {
                  if (this.baseStore.state.fieldMetaBase[M] === void 0) continue;
                  const y = this.getFieldMeta(M);
                  if (!y) continue;
                  const { errorMap: V, errorSourceMap: F } = y,
                    I = n?.[M],
                    { newErrorValue: D, newSource: W } = vt({
                      newFormValidatorError: I,
                      isPreviousErrorFromFormValidator: F?.[v] === "form",
                      previousErrorValue: V?.[v],
                    });
                  V?.[v] !== D &&
                    this.setFieldMeta(M, (E) => ({
                      ...E,
                      errorMap: { ...E.errorMap, [v]: D },
                      errorSourceMap: { ...E.errorSourceMap, [v]: W },
                    }));
                }
                (this.baseStore.setState((M) => ({ ...M, errorMap: { ...M.errorMap, [v]: g } })),
                  c(n ? { fieldErrors: n, errorMapKey: v } : void 0));
              }),
            ));
        }
        let u = [];
        const d = {};
        if (a.length) {
          u = await Promise.all(a);
          for (const l of u)
            if (l?.fieldErrors) {
              const { errorMapKey: o } = l;
              for (const [h, f] of Object.entries(l.fieldErrors)) {
                const m = { ...d[h], [o]: f };
                d[h] = m;
              }
            }
        }
        return (this.baseStore.setState((l) => ({ ...l, isFormValidating: !1 })), d);
      }),
      (this.validate = (t) => {
        const { hasErrored: i, fieldsErrorMap: a } = this.validateSync(t);
        return i && !this.options.asyncAlways ? a : this.validateAsync(t);
      }),
      (this._handleSubmit = async (t) => {
        (this.baseStore.setState((n) => ({
          ...n,
          isSubmitted: !1,
          submissionAttempts: n.submissionAttempts + 1,
          isSubmitSuccessful: !1,
        })),
          T(() => {
            Object.values(this.fieldInfo).forEach((n) => {
              n.instance &&
                (n.instance.state.meta.isTouched ||
                  n.instance.setMeta((u) => ({ ...u, isTouched: !0 })));
            });
          }));
        const i = t ?? this.options.onSubmitMeta;
        if (!this.state.canSubmit && !this._devtoolsSubmissionOverride) {
          this.options.onSubmitInvalid?.({ value: this.state.values, formApi: this, meta: i });
          return;
        }
        this.baseStore.setState((n) => ({ ...n, isSubmitting: !0 }));
        const a = () => {
          this.baseStore.setState((n) => ({ ...n, isSubmitting: !1 }));
        };
        if ((await this.validateAllFields("submit"), !this.state.isFieldsValid)) {
          (a(),
            this.options.onSubmitInvalid?.({ value: this.state.values, formApi: this, meta: i }),
            L.emit("form-submission", {
              id: this._formId,
              submissionAttempt: this.state.submissionAttempts,
              successful: !1,
              stage: "validateAllFields",
              errors: Object.values(this.state.fieldMeta)
                .map((n) => n.errors)
                .flat(),
            }));
          return;
        }
        if ((await this.validate("submit"), !this.state.isValid)) {
          (a(),
            this.options.onSubmitInvalid?.({ value: this.state.values, formApi: this, meta: i }),
            L.emit("form-submission", {
              id: this._formId,
              submissionAttempt: this.state.submissionAttempts,
              successful: !1,
              stage: "validate",
              errors: this.state.errors,
            }));
          return;
        }
        (T(() => {
          Object.values(this.fieldInfo).forEach((n) => {
            n.instance?.options.listeners?.onSubmit?.({
              value: n.instance.state.value,
              fieldApi: n.instance,
            });
          });
        }),
          this.options.listeners?.onSubmit?.({ formApi: this, meta: i }));
        try {
          (await this.options.onSubmit?.({ value: this.state.values, formApi: this, meta: i }),
            T(() => {
              (this.baseStore.setState((n) => ({ ...n, isSubmitted: !0, isSubmitSuccessful: !0 })),
                L.emit("form-submission", {
                  id: this._formId,
                  submissionAttempt: this.state.submissionAttempts,
                  successful: !0,
                }),
                a());
            }));
        } catch (n) {
          throw (
            this.baseStore.setState((u) => ({ ...u, isSubmitSuccessful: !1 })),
            L.emit("form-submission", {
              id: this._formId,
              submissionAttempt: this.state.submissionAttempts,
              successful: !1,
              stage: "inflight",
              onError: n,
            }),
            a(),
            n
          );
        }
      }),
      (this.getFieldValue = (t) => X(this.state.values, t)),
      (this.getFieldMeta = (t) => this.state.fieldMeta[t]),
      (this.getFieldInfo = (t) =>
        (this.fieldInfo[t] ||= {
          instance: null,
          validationMetaMap: {
            onChange: void 0,
            onBlur: void 0,
            onSubmit: void 0,
            onMount: void 0,
            onServer: void 0,
            onDynamic: void 0,
          },
        })),
      (this.setFieldMeta = (t, i) => {
        this.baseStore.setState((a) => ({
          ...a,
          fieldMetaBase: { ...a.fieldMetaBase, [t]: nt(i, a.fieldMetaBase[t]) },
        }));
      }),
      (this.resetFieldMeta = (t) =>
        Object.keys(t).reduce((i, a) => {
          const n = a;
          return ((i[n] = $), i);
        }, {})),
      (this.setFieldValue = (t, i, a) => {
        const n = a?.dontUpdateMeta ?? !1,
          u = a?.dontRunListeners ?? !1,
          d = a?.dontValidate ?? !1;
        (T(() => {
          (n ||
            this.setFieldMeta(t, (l) => ({
              ...l,
              isTouched: !0,
              isDirty: !0,
              errorMap: { ...l?.errorMap, onMount: void 0 },
            })),
            this.baseStore.setState((l) => ({ ...l, values: J(l.values, t, i) })));
        }),
          u || this.getFieldInfo(t).instance?.triggerOnChangeListener(),
          d || this.validateField(t, "change"));
      }),
      (this.deleteField = (t) => {
        const a = [
          ...Object.keys(this.fieldInfo).filter((n) => {
            const u = t.toString();
            return n !== u && n.startsWith(u);
          }),
          t,
        ];
        this.baseStore.setState((n) => {
          const u = { ...n };
          return (
            a.forEach((d) => {
              ((u.values = $t(u.values, d)), delete this.fieldInfo[d], delete u.fieldMetaBase[d]);
            }),
            u
          );
        });
      }),
      (this.pushFieldValue = (t, i, a) => {
        this.setFieldValue(t, (n) => [...(Array.isArray(n) ? n : []), i], a);
      }),
      (this.insertFieldValue = async (t, i, a, n) => {
        this.setFieldValue(
          t,
          (d) => [...d.slice(0, i), a, ...d.slice(i)],
          w(n, { dontValidate: !0 }),
        );
        const u = n?.dontValidate ?? !1;
        (u || (await this.validateField(t, "change")),
          Z(this).handleArrayInsert(t, i),
          u || (await this.validateArrayFieldsStartingFrom(t, i, "change")));
      }),
      (this.replaceFieldValue = async (t, i, a, n) => {
        (this.setFieldValue(
          t,
          (d) => d.map((l, o) => (o === i ? a : l)),
          w(n, { dontValidate: !0 }),
        ),
          (n?.dontValidate ?? !1) ||
            (await this.validateField(t, "change"),
            await this.validateArrayFieldsStartingFrom(t, i, "change")));
      }),
      (this.removeFieldValue = async (t, i, a) => {
        const n = this.getFieldValue(t),
          u = Array.isArray(n) ? Math.max(n.length - 1, 0) : null;
        if (
          (this.setFieldValue(t, (l) => l.filter((o, h) => h !== i), w(a, { dontValidate: !0 })),
          Z(this).handleArrayRemove(t, i),
          u !== null)
        ) {
          const l = `${t}[${u}]`;
          this.deleteField(l);
        }
        (a?.dontValidate ?? !1) ||
          (await this.validateField(t, "change"),
          await this.validateArrayFieldsStartingFrom(t, i, "change"));
      }),
      (this.swapFieldValues = (t, i, a, n) => {
        (this.setFieldValue(
          t,
          (d) => {
            const l = d[i],
              o = d[a];
            return J(J(d, `${i}`, o), `${a}`, l);
          },
          w(n, { dontValidate: !0 }),
        ),
          Z(this).handleArraySwap(t, i, a),
          (n?.dontValidate ?? !1) ||
            (this.validateField(t, "change"),
            this.validateField(`${t}[${i}]`, "change"),
            this.validateField(`${t}[${a}]`, "change")));
      }),
      (this.moveFieldValues = (t, i, a, n) => {
        (this.setFieldValue(
          t,
          (d) => {
            const l = [...d];
            return (l.splice(a, 0, l.splice(i, 1)[0]), l);
          },
          w(n, { dontValidate: !0 }),
        ),
          Z(this).handleArrayMove(t, i, a),
          (n?.dontValidate ?? !1) ||
            (this.validateField(t, "change"),
            this.validateField(`${t}[${i}]`, "change"),
            this.validateField(`${t}[${a}]`, "change")));
      }),
      (this.clearFieldValues = (t, i) => {
        const a = this.getFieldValue(t),
          n = Array.isArray(a) ? Math.max(a.length - 1, 0) : null;
        if ((this.setFieldValue(t, [], w(i, { dontValidate: !0 })), n !== null))
          for (let d = 0; d <= n; d++) {
            const l = `${t}[${d}]`;
            this.deleteField(l);
          }
        (i?.dontValidate ?? !1) || this.validateField(t, "change");
      }),
      (this.resetField = (t) => {
        this.baseStore.setState((i) => ({
          ...i,
          fieldMetaBase: { ...i.fieldMetaBase, [t]: $ },
          values: this.options.defaultValues
            ? J(i.values, t, X(this.options.defaultValues, t))
            : i.values,
        }));
      }),
      (this.setErrorMap = (t) => {
        T(() => {
          Object.entries(t).forEach(([i, a]) => {
            const n = i;
            if (st(a)) {
              const { formError: u, fieldErrors: d } = rt(a);
              for (const l of Object.keys(this.fieldInfo))
                this.getFieldMeta(l) &&
                  this.setFieldMeta(l, (h) => ({
                    ...h,
                    errorMap: { ...h.errorMap, [n]: d?.[l] },
                    errorSourceMap: { ...h.errorSourceMap, [n]: "form" },
                  }));
              this.baseStore.setState((l) => ({ ...l, errorMap: { ...l.errorMap, [n]: u } }));
            } else this.baseStore.setState((u) => ({ ...u, errorMap: { ...u.errorMap, [n]: a } }));
          });
        });
      }),
      (this.getAllErrors = () => ({
        form: { errors: this.state.errors, errorMap: this.state.errorMap },
        fields: Object.entries(this.state.fieldMeta).reduce(
          (t, [i, a]) => (
            Object.keys(a).length &&
              a.errors.length &&
              (t[i] = { errors: a.errors, errorMap: a.errorMap }),
            t
          ),
          {},
        ),
      })),
      (this.parseValuesWithSchema = (t) =>
        U.validate({ value: this.state.values, validationSource: "form" }, t)),
      (this.parseValuesWithSchemaAsync = (t) =>
        U.validateAsync({ value: this.state.values, validationSource: "form" }, t)),
      (this.timeoutIds = { validations: {}, listeners: {}, formListeners: {} }),
      (this._formId = r?.formId ?? Et()),
      (this._devtoolsSubmissionOverride = !1));
    let s = lt({ ...r?.defaultState, values: r?.defaultValues ?? r?.defaultState?.values });
    if (r?.transform) {
      s = r.transform({ state: s }).state;
      for (const t of Object.keys(s.errorMap)) {
        const i = s.errorMap[t];
        if (!(i === void 0 || !st(i)))
          for (const a of Object.keys(i.fields)) {
            const n = i.fields[a];
            if (n === void 0) continue;
            const u = s.fieldMetaBase[a];
            s.fieldMetaBase[a] = {
              isTouched: !1,
              isValidating: !1,
              isBlurred: !1,
              isDirty: !1,
              ...u,
              errorSourceMap: { ...u?.errorSourceMap, onChange: "form" },
              errorMap: { ...u?.errorMap, [t]: n },
            };
          }
      }
    }
    ((this.baseStore = new ut(s)),
      (this.fieldMetaDerived = new k({
        deps: [this.baseStore],
        fn: ({ prevDepVals: t, currDepVals: i, prevVal: a }) => {
          const n = a,
            u = t?.[0],
            d = i[0];
          let l = 0;
          const o = {};
          for (const h of Object.keys(d.fieldMetaBase)) {
            const f = d.fieldMetaBase[h],
              c = u?.fieldMetaBase[h],
              m = n?.[h],
              g = X(d.values, h);
            let p = m?.errors;
            if (!c || f.errorMap !== c.errorMap) {
              p = Object.values(f.errorMap ?? {}).filter((F) => F !== void 0);
              const V = this.getFieldInfo(h)?.instance;
              (!V || !V.options.disableErrorFlat) && (p = p.flat(1));
            }
            const v = !zt(p),
              M = !f.isDirty,
              y =
                _(g, X(this.options.defaultValues, h)) ||
                _(g, this.getFieldInfo(h)?.instance?.options.defaultValue);
            if (
              m &&
              m.isPristine === M &&
              m.isValid === v &&
              m.isDefaultValue === y &&
              m.errors === p &&
              f === c
            ) {
              ((o[h] = m), l++);
              continue;
            }
            o[h] = { ...f, errors: p ?? [], isPristine: M, isValid: v, isDefaultValue: y };
          }
          return Object.keys(d.fieldMetaBase).length &&
            n &&
            l === Object.keys(d.fieldMetaBase).length
            ? n
            : o;
        },
      })),
      (this.store = new k({
        deps: [this.baseStore, this.fieldMetaDerived],
        fn: ({ prevDepVals: t, currDepVals: i, prevVal: a }) => {
          const n = a,
            u = t?.[0],
            d = i[0],
            l = i[1],
            o = Object.values(l).filter(Boolean),
            h = o.some((b) => b.isValidating),
            f = o.every((b) => b.isValid),
            c = o.some((b) => b.isTouched),
            m = o.some((b) => b.isBlurred),
            g = o.every((b) => b.isDefaultValue),
            p = c && d.errorMap?.onMount,
            v = o.some((b) => b.isDirty),
            M = !v,
            y = !!(d.errorMap?.onMount || o.some((b) => b?.errorMap?.onMount)),
            V = !!h;
          let F = n?.errors ?? [];
          (!u || d.errorMap !== u.errorMap) &&
            (F = Object.values(d.errorMap).reduce(
              (b, K) => (K === void 0 ? b : K && st(K) ? (b.push(K.form), b) : (b.push(K), b)),
              [],
            ));
          const I = F.length === 0,
            D = f && I,
            W = this.options.canSubmitWhenInvalid ?? !1,
            E = (d.submissionAttempts === 0 && !c && !y) || (!V && !d.isSubmitting && D) || W;
          let P = d.errorMap;
          return (
            p &&
              ((F = F.filter((b) => b !== d.errorMap.onMount)),
              (P = Object.assign(P, { onMount: void 0 }))),
            n &&
            u &&
            n.errorMap === P &&
            n.fieldMeta === this.fieldMetaDerived.state &&
            n.errors === F &&
            n.isFieldsValidating === h &&
            n.isFieldsValid === f &&
            n.isFormValid === I &&
            n.isValid === D &&
            n.canSubmit === E &&
            n.isTouched === c &&
            n.isBlurred === m &&
            n.isPristine === M &&
            n.isDefaultValue === g &&
            n.isDirty === v &&
            _(u, d)
              ? n
              : {
                  ...d,
                  errorMap: P,
                  fieldMeta: this.fieldMetaDerived.state,
                  errors: F,
                  isFieldsValidating: h,
                  isFieldsValid: f,
                  isFormValid: I,
                  isValid: D,
                  canSubmit: E,
                  isTouched: c,
                  isBlurred: m,
                  isPristine: M,
                  isDefaultValue: g,
                  isDirty: v,
                }
          );
        },
      })),
      (this.handleSubmit = this.handleSubmit.bind(this)),
      this.update(r || {}));
  }
  get state() {
    return this.store.state;
  }
  get formId() {
    return this._formId;
  }
  runValidator(r) {
    return wt(r.validate) ? U[r.type](r.value, r.validate) : r.validate(r.value);
  }
  handleSubmit(r) {
    return this._handleSubmit(r);
  }
}
function rt(e) {
  if (e) {
    if (st(e)) {
      const r = rt(e.form).formError,
        s = e.fields;
      return { formError: r, fieldErrors: s };
    }
    return { formError: e };
  }
  return { formError: void 0 };
}
function z(e) {
  switch (e) {
    case "submit":
      return "onSubmit";
    case "blur":
      return "onBlur";
    case "mount":
      return "onMount";
    case "server":
      return "onServer";
    case "dynamic":
      return "onDynamic";
    default:
      return "onChange";
  }
}
class bt {
  constructor(r) {
    ((this.options = {}),
      (this.mount = () => {
        const s = this.store.mount();
        this.options.defaultValue !== void 0 &&
          !this.getMeta().isTouched &&
          this.form.setFieldValue(this.name, this.options.defaultValue, { dontUpdateMeta: !0 });
        const t = this.getInfo();
        ((t.instance = this), this.update(this.options));
        const { onMount: i } = this.options.validators || {};
        if (i) {
          const a = this.runValidator({
            validate: i,
            value: { value: this.state.value, fieldApi: this, validationSource: "field" },
            type: "validate",
          });
          a &&
            this.setMeta((n) => ({
              ...n,
              errorMap: { ...n?.errorMap, onMount: a },
              errorSourceMap: { ...n?.errorSourceMap, onMount: "field" },
            }));
        }
        return (this.options.listeners?.onMount?.({ value: this.state.value, fieldApi: this }), s);
      }),
      (this.update = (s) => {
        if (
          ((this.options = s),
          (this.name = s.name),
          !this.state.meta.isTouched && this.options.defaultValue !== void 0)
        ) {
          const t = this.form.getFieldValue(this.name);
          _(t, s.defaultValue) ||
            this.form.setFieldValue(this.name, s.defaultValue, {
              dontUpdateMeta: !0,
              dontValidate: !0,
              dontRunListeners: !0,
            });
        }
        this.form.getFieldMeta(this.name) || this.form.setFieldMeta(this.name, this.state.meta);
      }),
      (this.getValue = () => this.form.getFieldValue(this.name)),
      (this.setValue = (s, t) => {
        (this.form.setFieldValue(this.name, s, w(t, { dontRunListeners: !0, dontValidate: !0 })),
          t?.dontRunListeners || this.triggerOnChangeListener(),
          t?.dontValidate || this.validate("change"));
      }),
      (this.getMeta = () => this.store.state.meta),
      (this.setMeta = (s) => this.form.setFieldMeta(this.name, s)),
      (this.getInfo = () => this.form.getFieldInfo(this.name)),
      (this.pushValue = (s, t) => {
        (this.form.pushFieldValue(this.name, s, w(t, { dontRunListeners: !0 })),
          t?.dontRunListeners || this.triggerOnChangeListener());
      }),
      (this.insertValue = (s, t, i) => {
        (this.form.insertFieldValue(this.name, s, t, w(i, { dontRunListeners: !0 })),
          i?.dontRunListeners || this.triggerOnChangeListener());
      }),
      (this.replaceValue = (s, t, i) => {
        (this.form.replaceFieldValue(this.name, s, t, w(i, { dontRunListeners: !0 })),
          i?.dontRunListeners || this.triggerOnChangeListener());
      }),
      (this.removeValue = (s, t) => {
        (this.form.removeFieldValue(this.name, s, w(t, { dontRunListeners: !0 })),
          t?.dontRunListeners || this.triggerOnChangeListener());
      }),
      (this.swapValues = (s, t, i) => {
        (this.form.swapFieldValues(this.name, s, t, w(i, { dontRunListeners: !0 })),
          i?.dontRunListeners || this.triggerOnChangeListener());
      }),
      (this.moveValue = (s, t, i) => {
        (this.form.moveFieldValues(this.name, s, t, w(i, { dontRunListeners: !0 })),
          i?.dontRunListeners || this.triggerOnChangeListener());
      }),
      (this.clearValues = (s) => {
        (this.form.clearFieldValues(this.name, w(s, { dontRunListeners: !0 })),
          s?.dontRunListeners || this.triggerOnChangeListener());
      }),
      (this.getLinkedFields = (s) => {
        const t = Object.values(this.form.fieldInfo),
          i = [];
        for (const a of t) {
          if (!a.instance) continue;
          const { onChangeListenTo: n, onBlurListenTo: u } = a.instance.options.validators || {};
          (s === "change" && n?.includes(this.name) && i.push(a.instance),
            s === "blur" && u?.includes(this.name) && i.push(a.instance));
        }
        return i;
      }),
      (this.validateSync = (s, t) => {
        const i = ct(s, {
            ...this.options,
            form: this.form,
            validationLogic: this.form.options.validationLogic || B,
          }),
          n = this.getLinkedFields(s).reduce((l, o) => {
            const h = ct(s, {
              ...o.options,
              form: o.form,
              validationLogic: o.form.options.validationLogic || B,
            });
            return (
              h.forEach((f) => {
                f.field = o;
              }),
              l.concat(h)
            );
          }, []);
        let u = !1;
        T(() => {
          const l = (o, h) => {
            const f = tt(h.cause),
              c = h.validate
                ? yt(
                    o.runValidator({
                      validate: h.validate,
                      value: { value: o.store.state.value, validationSource: "field", fieldApi: o },
                      type: "validate",
                    }),
                  )
                : void 0,
              m = t[f],
              { newErrorValue: g, newSource: p } = gt({ formLevelError: m, fieldLevelError: c });
            (o.state.meta.errorMap?.[f] !== g &&
              o.setMeta((v) => ({
                ...v,
                errorMap: { ...v.errorMap, [f]: g },
                errorSourceMap: { ...v.errorSourceMap, [f]: p },
              })),
              g && (u = !0));
          };
          for (const o of i) l(this, o);
          for (const o of n) o.validate && l(o.field, o);
        });
        const d = tt("submit");
        return (
          this.state.meta.errorMap?.[d] &&
            s !== "submit" &&
            !u &&
            this.setMeta((l) => ({
              ...l,
              errorMap: { ...l.errorMap, [d]: void 0 },
              errorSourceMap: { ...l.errorSourceMap, [d]: void 0 },
            })),
          { hasErrored: u }
        );
      }),
      (this.validateAsync = async (s, t) => {
        const i = ht(s, {
            ...this.options,
            form: this.form,
            validationLogic: this.form.options.validationLogic || B,
          }),
          a = await t,
          n = this.getLinkedFields(s),
          u = n.reduce((c, m) => {
            const g = ht(s, {
              ...m.options,
              form: m.form,
              validationLogic: m.form.options.validationLogic || B,
            });
            return (
              g.forEach((p) => {
                p.field = m;
              }),
              c.concat(g)
            );
          }, []),
          d = [],
          l = [],
          o = i.some((c) => c.validate) || u.some((c) => c.validate);
        if (o) {
          this.state.meta.isValidating || this.setMeta((c) => ({ ...c, isValidating: !0 }));
          for (const c of n) c.setMeta((m) => ({ ...m, isValidating: !0 }));
        }
        const h = (c, m, g) => {
          const p = tt(m.cause);
          c.getInfo().validationMetaMap[p]?.lastAbortController.abort();
          const M = new AbortController();
          ((this.getInfo().validationMetaMap[p] = { lastAbortController: M }),
            g.push(
              new Promise(async (y) => {
                let V;
                try {
                  V = await new Promise((E, P) => {
                    (this.timeoutIds.validations[m.cause] &&
                      clearTimeout(this.timeoutIds.validations[m.cause]),
                      (this.timeoutIds.validations[m.cause] = setTimeout(async () => {
                        if (M.signal.aborted) return E(void 0);
                        try {
                          E(
                            await this.runValidator({
                              validate: m.validate,
                              value: {
                                value: c.store.state.value,
                                fieldApi: c,
                                signal: M.signal,
                                validationSource: "field",
                              },
                              type: "validateAsync",
                            }),
                          );
                        } catch (mt) {
                          P(mt);
                        }
                      }, m.debounceMs)));
                  });
                } catch (E) {
                  V = E;
                }
                if (M.signal.aborted) return y(void 0);
                const F = yt(V),
                  I = a[this.name]?.[p],
                  { newErrorValue: D, newSource: W } = gt({
                    formLevelError: I,
                    fieldLevelError: F,
                  });
                (c.setMeta((E) => ({
                  ...E,
                  errorMap: { ...E?.errorMap, [p]: D },
                  errorSourceMap: { ...E.errorSourceMap, [p]: W },
                })),
                  y(D));
              }),
            ));
        };
        for (const c of i) c.validate && h(this, c, d);
        for (const c of u) c.validate && h(c.field, c, l);
        let f = [];
        if (((d.length || l.length) && ((f = await Promise.all(d)), await Promise.all(l)), o)) {
          this.setMeta((c) => ({ ...c, isValidating: !1 }));
          for (const c of n) c.setMeta((m) => ({ ...m, isValidating: !1 }));
        }
        return f.filter(Boolean);
      }),
      (this.validate = (s, t) => {
        if (!this.state.meta.isTouched) return [];
        const { fieldsErrorMap: i } = t?.skipFormValidation
            ? { fieldsErrorMap: {} }
            : this.form.validateSync(s),
          { hasErrored: a } = this.validateSync(s, i[this.name] ?? {});
        if (a && !this.options.asyncAlways)
          return (
            this.getInfo().validationMetaMap[tt(s)]?.lastAbortController.abort(),
            this.state.meta.errors
          );
        const n = t?.skipFormValidation ? Promise.resolve({}) : this.form.validateAsync(s);
        return this.validateAsync(s, n);
      }),
      (this.handleChange = (s) => {
        this.setValue(s);
      }),
      (this.handleBlur = () => {
        (this.state.meta.isTouched || this.setMeta((t) => ({ ...t, isTouched: !0 })),
          this.state.meta.isBlurred || this.setMeta((t) => ({ ...t, isBlurred: !0 })),
          this.validate("blur"),
          this.triggerOnBlurListener());
      }),
      (this.setErrorMap = (s) => {
        this.setMeta((t) => ({ ...t, errorMap: { ...t.errorMap, ...s } }));
      }),
      (this.parseValueWithSchema = (s) =>
        U.validate({ value: this.state.value, validationSource: "field" }, s)),
      (this.parseValueWithSchemaAsync = (s) =>
        U.validateAsync({ value: this.state.value, validationSource: "field" }, s)),
      (this.triggerOnChangeListener = () => {
        const s = this.form.options.listeners?.onChangeDebounceMs;
        s && s > 0
          ? (this.timeoutIds.formListeners.change &&
              clearTimeout(this.timeoutIds.formListeners.change),
            (this.timeoutIds.formListeners.change = setTimeout(() => {
              this.form.options.listeners?.onChange?.({ formApi: this.form, fieldApi: this });
            }, s)))
          : this.form.options.listeners?.onChange?.({ formApi: this.form, fieldApi: this });
        const t = this.options.listeners?.onChangeDebounceMs;
        t && t > 0
          ? (this.timeoutIds.listeners.change && clearTimeout(this.timeoutIds.listeners.change),
            (this.timeoutIds.listeners.change = setTimeout(() => {
              this.options.listeners?.onChange?.({ value: this.state.value, fieldApi: this });
            }, t)))
          : this.options.listeners?.onChange?.({ value: this.state.value, fieldApi: this });
      }),
      (this.form = r.form),
      (this.name = r.name),
      (this.options = r),
      (this.timeoutIds = { validations: {}, listeners: {}, formListeners: {} }),
      (this.store = new k({
        deps: [this.form.store],
        fn: ({ prevVal: s }) => {
          const t = s,
            i = this.form.getFieldMeta(this.name) ?? { ...$, ...r.defaultMeta };
          let a = this.form.getFieldValue(this.name);
          return (
            !i.isTouched &&
              a === void 0 &&
              this.options.defaultValue !== void 0 &&
              !_(a, this.options.defaultValue) &&
              (a = this.options.defaultValue),
            t && t.value === a && t.meta === i ? t : { value: a, meta: i }
          );
        },
      })));
  }
  get state() {
    return this.store.state;
  }
  runValidator(r) {
    return wt(r.validate) ? U[r.type](r.value, r.validate) : r.validate(r.value);
  }
  triggerOnBlurListener() {
    const r = this.form.options.listeners?.onBlurDebounceMs;
    r && r > 0
      ? (this.timeoutIds.formListeners.blur && clearTimeout(this.timeoutIds.formListeners.blur),
        (this.timeoutIds.formListeners.blur = setTimeout(() => {
          this.form.options.listeners?.onBlur?.({ formApi: this.form, fieldApi: this });
        }, r)))
      : this.form.options.listeners?.onBlur?.({ formApi: this.form, fieldApi: this });
    const s = this.options.listeners?.onBlurDebounceMs;
    s && s > 0
      ? (this.timeoutIds.listeners.blur && clearTimeout(this.timeoutIds.listeners.blur),
        (this.timeoutIds.listeners.blur = setTimeout(() => {
          this.options.listeners?.onBlur?.({ value: this.state.value, fieldApi: this });
        }, s)))
      : this.options.listeners?.onBlur?.({ value: this.state.value, fieldApi: this });
  }
}
function yt(e) {
  if (e) return e;
}
function tt(e) {
  switch (e) {
    case "submit":
      return "onSubmit";
    case "blur":
      return "onBlur";
    case "mount":
      return "onMount";
    case "server":
      return "onServer";
    case "dynamic":
      return "onDynamic";
    default:
      return "onChange";
  }
}
function qt(e, r) {
  if (!r) return;
  const s = Object.assign({}, e, { state: j(e.state) });
  (r(s),
    s.fieldInfo !== e.fieldInfo && (e.fieldInfo = s.fieldInfo),
    s.options !== e.options && (e.options = s.options));
  const i = Object.keys({
    values: null,
    validationMetaMap: null,
    fieldMetaBase: null,
    isSubmitting: null,
    isSubmitted: null,
    isValidating: null,
    submissionAttempts: null,
    isSubmitSuccessful: null,
    _force_re_eval: null,
  }).reduce((a, n) => (e.state[n] !== s.state[n] && (a[n] = s.state[n]), a), {});
  return (
    T(() => {
      (Object.keys(i).length && e.baseStore.setState((a) => ({ ...a, ...i })),
        s.state.errorMap !== e.state.errorMap && e.setErrorMap(s.state.errorMap));
    }),
    s
  );
}
function O(e, r = (t) => t, s = {}) {
  const t = s.equal ?? Ht;
  return Lt.useSyncExternalStoreWithSelector(
    e.subscribe,
    () => e.state,
    () => e.state,
    r,
    t,
  );
}
function Ht(e, r) {
  if (Object.is(e, r)) return !0;
  if (typeof e != "object" || e === null || typeof r != "object" || r === null) return !1;
  if (e instanceof Map && r instanceof Map) {
    if (e.size !== r.size) return !1;
    for (const [t, i] of e) if (!r.has(t) || !Object.is(i, r.get(t))) return !1;
    return !0;
  }
  if (e instanceof Set && r instanceof Set) {
    if (e.size !== r.size) return !1;
    for (const t of e) if (!r.has(t)) return !1;
    return !0;
  }
  if (e instanceof Date && r instanceof Date) return e.getTime() === r.getTime();
  const s = St(e);
  if (s.length !== St(r).length) return !1;
  for (let t = 0; t < s.length; t++)
    if (!Object.prototype.hasOwnProperty.call(r, s[t]) || !Object.is(e[s[t]], r[s[t]])) return !1;
  return !0;
}
function St(e) {
  return Object.keys(e).concat(Object.getOwnPropertySymbols(e));
}
const R = typeof window < "u" ? A.useLayoutEffect : A.useEffect;
function Xt(e) {
  const [r, s] = A.useState(() => ({ form: e.form, name: e.name })),
    [t, i] = A.useState(() => new bt({ ...e }));
  (r.form !== e.form || r.name !== e.name) &&
    (i(new bt({ ...e })), s({ form: e.form, name: e.name }));
  const a = O(
      t.store,
      e.mode === "array" ? (c) => Object.keys(c.value ?? []).length : (c) => c.value,
    ),
    n = O(t.store, (c) => c.meta.isTouched),
    u = O(t.store, (c) => c.meta.isBlurred),
    d = O(t.store, (c) => c.meta.isDirty),
    l = O(t.store, (c) => c.meta.errorMap),
    o = O(t.store, (c) => c.meta.errorSourceMap),
    h = O(t.store, (c) => c.meta.isValidating),
    f = A.useMemo(() => {
      const m = {
        ...t,
        get state() {
          return {
            value: e.mode === "array" ? t.state.value : a,
            get meta() {
              return {
                ...t.state.meta,
                isTouched: n,
                isBlurred: u,
                isDirty: d,
                errorMap: l,
                errorSourceMap: o,
                isValidating: h,
              };
            },
          };
        },
      };
      return ((m.Field = At), m);
    }, [t, e.mode, a, n, u, d, l, o, h]);
  return (
    R(t.mount, [t]),
    R(() => {
      t.update(e);
    }),
    f
  );
}
const At = ({ children: e, ...r }) => {
  const s = Xt(r),
    t = A.useMemo(() => nt(e, s), [e, s]);
  return S.jsx(S.Fragment, { children: t });
};
function Jt() {
  return A.useState(() => Et())[0];
}
const Qt = It,
  Yt = A.version.split(".")[0] === "17" ? Jt : Qt.useId;
function Zt({ form: e, selector: r, children: s }) {
  const t = O(e.store, r);
  return S.jsx(S.Fragment, { children: nt(s, t) });
}
function ne(e) {
  const r = Yt(),
    [s, t] = A.useState(e?.formId),
    [i, a] = A.useState(() => new Mt({ ...e, formId: e?.formId ?? r }));
  if (s !== e?.formId) {
    const d = e?.formId ?? r;
    (a(new Mt({ ...e, formId: d })), t(d));
  }
  const n = A.useMemo(() => {
    const d = {
      ...i,
      handleSubmit: (...l) => i._handleSubmit(...l),
      get formId() {
        return i._formId;
      },
      get state() {
        return i.store.state;
      },
    };
    return (
      (d.Field = function (o) {
        return S.jsx(At, { ...o, form: i });
      }),
      (d.Subscribe = function (o) {
        return S.jsx(Zt, { form: i, selector: o.selector, children: o.children });
      }),
      d
    );
  }, [i]);
  (R(i.mount, []),
    R(() => {
      i.update(e);
    }));
  const u = A.useRef(!1);
  return (
    R(() => {
      u.current && e?.transform && qt(i, e.transform);
    }, [i, e?.transform]),
    R(() => {
      u.current = !0;
    }),
    n
  );
}
function te({ className: e, ...r }) {
  return S.jsx("label", {
    "data-slot": "label",
    className: x(
      "gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
      e,
    ),
    ...r,
  });
}
function oe({ className: e, ...r }) {
  return S.jsx("fieldset", {
    "data-slot": "field-set",
    className: x(
      "gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 flex flex-col",
      e,
    ),
    ...r,
  });
}
function le({ className: e, ...r }) {
  return S.jsx("div", {
    "data-slot": "field-group",
    className: x(
      "gap-7 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4 group/field-group @container/field-group flex w-full flex-col",
      e,
    ),
    ...r,
  });
}
const ee = Tt("data-[invalid=true]:text-destructive gap-3 group/field flex w-full", {
  variants: {
    orientation: {
      vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
      horizontal:
        "flex-row items-center [&>[data-slot=field-label]]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      responsive:
        "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto @md/field-group:[&>[data-slot=field-label]]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
    },
  },
  defaultVariants: { orientation: "vertical" },
});
function ue({ className: e, orientation: r = "vertical", ...s }) {
  return S.jsx("div", {
    role: "group",
    "data-slot": "field",
    "data-orientation": r,
    className: x(ee({ orientation: r }), e),
    ...s,
  });
}
function de({ className: e, ...r }) {
  return S.jsx(te, {
    "data-slot": "field-label",
    className: x(
      "has-data-checked:bg-primary/5 has-data-checked:border-primary/50 dark:has-data-checked:bg-primary/10 gap-2 group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-xl has-[>[data-slot=field]]:border *:data-[slot=field]:p-4 group/field-label peer/field-label flex w-fit leading-snug",
      "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
      e,
    ),
    ...r,
  });
}
function ce({ children: e, className: r, ...s }) {
  return S.jsxs("div", {
    "data-slot": "field-separator",
    "data-content": !!e,
    className: x("-my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2 relative", r),
    ...s,
    children: [
      S.jsx(Dt, { className: "absolute inset-0 top-1/2" }),
      e &&
        S.jsx("span", {
          className: "text-muted-foreground px-2 bg-background relative mx-auto block w-fit",
          "data-slot": "field-separator-content",
          children: e,
        }),
    ],
  });
}
function he({ className: e, children: r, errors: s, ...t }) {
  const i = A.useMemo(() => {
    if (r) return r;
    if (!s?.length) return null;
    const a = [...new Map(s.map((n) => [n?.message, n])).values()];
    return a?.length === 1
      ? a[0]?.message
      : S.jsx("ul", {
          className: "ml-4 flex list-disc flex-col gap-1",
          children: a.map((n, u) => n?.message && S.jsx("li", { children: n.message }, u)),
        });
  }, [r, s]);
  return i
    ? S.jsx("div", {
        role: "alert",
        "data-slot": "field-error",
        className: x("text-destructive text-sm font-normal", e),
        ...t,
        children: i,
      })
    : null;
}
export { le as F, ue as a, de as b, ce as c, oe as d, he as e, ne as u };
