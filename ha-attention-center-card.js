/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const se = globalThis, Ne = se.ShadowRoot && (se.ShadyCSS === void 0 || se.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, De = Symbol(), qe = /* @__PURE__ */ new WeakMap();
let $t = class {
  constructor(e, i, r) {
    if (this._$cssResult$ = !0, r !== De) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (Ne && e === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (e = qe.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && qe.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ft = (t) => new $t(typeof t == "string" ? t : t + "", void 0, De), At = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((r, s, n) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[n + 1], t[0]);
  return new $t(i, t, De);
}, Jt = (t, e) => {
  if (Ne) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const r = document.createElement("style"), s = se.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = i.cssText, t.appendChild(r);
  }
}, Ke = Ne ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const r of e.cssRules) i += r.cssText;
  return Ft(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: qt, defineProperty: Kt, getOwnPropertyDescriptor: Gt, getOwnPropertyNames: Wt, getOwnPropertySymbols: Yt, getPrototypeOf: Zt } = Object, C = globalThis, Ge = C.trustedTypes, Qt = Ge ? Ge.emptyScript : "", ve = C.reactiveElementPolyfillSupport, Y = (t, e) => t, oe = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Qt : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, Oe = (t, e) => !qt(t, e), We = { attribute: !0, type: String, converter: oe, reflect: !1, useDefault: !1, hasChanged: Oe };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), C.litPropertyMetadata ?? (C.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let L = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = We) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(e, r, i);
      s !== void 0 && Kt(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, i, r) {
    const { get: s, set: n } = Gt(this.prototype, e) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: s, set(o) {
      const a = s == null ? void 0 : s.call(this);
      n == null || n.call(this, o), this.requestUpdate(e, a, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? We;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Y("elementProperties"))) return;
    const e = Zt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Y("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Y("properties"))) {
      const i = this.properties, r = [...Wt(i), ...Yt(i)];
      for (const s of r) this.createProperty(s, i[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [r, s] of i) this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, r] of this.elementProperties) {
      const s = this._$Eu(i, r);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const s of r) i.unshift(Ke(s));
    } else e !== void 0 && i.push(Ke(e));
    return i;
  }
  static _$Eu(e, i) {
    const r = i.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((i) => i(this));
  }
  addController(e) {
    var i;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((i = e.hostConnected) == null || i.call(e));
  }
  removeController(e) {
    var i;
    (i = this._$EO) == null || i.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const r of i.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Jt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((i) => {
      var r;
      return (r = i.hostConnected) == null ? void 0 : r.call(i);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var r;
      return (r = i.hostDisconnected) == null ? void 0 : r.call(i);
    });
  }
  attributeChangedCallback(e, i, r) {
    this._$AK(e, r);
  }
  _$ET(e, i) {
    var n;
    const r = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, r);
    if (s !== void 0 && r.reflect === !0) {
      const o = (((n = r.converter) == null ? void 0 : n.toAttribute) !== void 0 ? r.converter : oe).toAttribute(i, r.type);
      this._$Em = e, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(e, i) {
    var n, o;
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const a = r.getPropertyOptions(s), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((n = a.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? a.converter : oe;
      this._$Em = s;
      const c = l.fromAttribute(i, a.type);
      this[s] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, i, r, s = !1, n) {
    var o;
    if (e !== void 0) {
      const a = this.constructor;
      if (s === !1 && (n = this[e]), r ?? (r = a.getPropertyOptions(e)), !((r.hasChanged ?? Oe)(n, i) || r.useDefault && r.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(e)) && !this.hasAttribute(a._$Eu(e, r)))) return;
      this.C(e, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: r, reflect: s, wrapped: n }, o) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, o ?? i ?? this[e]), n !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (i = void 0), this._$AL.set(e, i)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, o] of s) {
        const { wrapped: a } = o, l = this[n];
        a !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, o, l);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (r = this._$EO) == null || r.forEach((s) => {
        var n;
        return (n = s.hostUpdate) == null ? void 0 : n.call(s);
      }), this.update(i)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var i;
    (i = this._$EO) == null || i.forEach((r) => {
      var s;
      return (s = r.hostUpdated) == null ? void 0 : s.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
L.elementStyles = [], L.shadowRootOptions = { mode: "open" }, L[Y("elementProperties")] = /* @__PURE__ */ new Map(), L[Y("finalized")] = /* @__PURE__ */ new Map(), ve == null || ve({ ReactiveElement: L }), (C.reactiveElementVersions ?? (C.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis, Ye = (t) => t, ae = Z.trustedTypes, Ze = ae ? ae.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Et = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, St = "?" + x, Xt = `<${St}>`, O = document, Q = () => O.createComment(""), X = (t) => t === null || typeof t != "object" && typeof t != "function", Pe = Array.isArray, ei = (t) => Pe(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", me = `[ 	
\f\r]`, q = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Qe = /-->/g, Xe = />/g, R = RegExp(`>|${me}(?:([^\\s"'>=/]+)(${me}*=${me}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), et = /'/g, tt = /"/g, xt = /^(?:script|style|textarea|title)$/i, ti = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), _ = ti(1), P = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), it = /* @__PURE__ */ new WeakMap(), I = O.createTreeWalker(O, 129);
function Ct(t, e) {
  if (!Pe(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ze !== void 0 ? Ze.createHTML(e) : e;
}
const ii = (t, e) => {
  const i = t.length - 1, r = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = q;
  for (let a = 0; a < i; a++) {
    const l = t[a];
    let c, d, u = -1, p = 0;
    for (; p < l.length && (o.lastIndex = p, d = o.exec(l), d !== null); ) p = o.lastIndex, o === q ? d[1] === "!--" ? o = Qe : d[1] !== void 0 ? o = Xe : d[2] !== void 0 ? (xt.test(d[2]) && (s = RegExp("</" + d[2], "g")), o = R) : d[3] !== void 0 && (o = R) : o === R ? d[0] === ">" ? (o = s ?? q, u = -1) : d[1] === void 0 ? u = -2 : (u = o.lastIndex - d[2].length, c = d[1], o = d[3] === void 0 ? R : d[3] === '"' ? tt : et) : o === tt || o === et ? o = R : o === Qe || o === Xe ? o = q : (o = R, s = void 0);
    const f = o === R && t[a + 1].startsWith("/>") ? " " : "";
    n += o === q ? l + Xt : u >= 0 ? (r.push(c), l.slice(0, u) + Et + l.slice(u) + x + f) : l + x + (u === -2 ? a : f);
  }
  return [Ct(t, n + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class ee {
  constructor({ strings: e, _$litType$: i }, r) {
    let s;
    this.parts = [];
    let n = 0, o = 0;
    const a = e.length - 1, l = this.parts, [c, d] = ii(e, i);
    if (this.el = ee.createElement(c, r), I.currentNode = this.el.content, i === 2 || i === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (s = I.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const u of s.getAttributeNames()) if (u.endsWith(Et)) {
          const p = d[o++], f = s.getAttribute(u).split(x), m = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: n, name: m[2], strings: f, ctor: m[1] === "." ? si : m[1] === "?" ? ni : m[1] === "@" ? oi : ue }), s.removeAttribute(u);
        } else u.startsWith(x) && (l.push({ type: 6, index: n }), s.removeAttribute(u));
        if (xt.test(s.tagName)) {
          const u = s.textContent.split(x), p = u.length - 1;
          if (p > 0) {
            s.textContent = ae ? ae.emptyScript : "";
            for (let f = 0; f < p; f++) s.append(u[f], Q()), I.nextNode(), l.push({ type: 2, index: ++n });
            s.append(u[p], Q());
          }
        }
      } else if (s.nodeType === 8) if (s.data === St) l.push({ type: 2, index: n });
      else {
        let u = -1;
        for (; (u = s.data.indexOf(x, u + 1)) !== -1; ) l.push({ type: 7, index: n }), u += x.length - 1;
      }
      n++;
    }
  }
  static createElement(e, i) {
    const r = O.createElement("template");
    return r.innerHTML = e, r;
  }
}
function V(t, e, i = t, r) {
  var o, a;
  if (e === P) return e;
  let s = r !== void 0 ? (o = i._$Co) == null ? void 0 : o[r] : i._$Cl;
  const n = X(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== n && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), n === void 0 ? s = void 0 : (s = new n(t), s._$AT(t, i, r)), r !== void 0 ? (i._$Co ?? (i._$Co = []))[r] = s : i._$Cl = s), s !== void 0 && (e = V(t, s._$AS(t, e.values), s, r)), e;
}
class ri {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: r } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? O).importNode(i, !0);
    I.currentNode = s;
    let n = I.nextNode(), o = 0, a = 0, l = r[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let c;
        l.type === 2 ? c = new F(n, n.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (c = new ai(n, this, e)), this._$AV.push(c), l = r[++a];
      }
      o !== (l == null ? void 0 : l.index) && (n = I.nextNode(), o++);
    }
    return I.currentNode = O, s;
  }
  p(e) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, i), i += r.strings.length - 2) : r._$AI(e[i])), i++;
  }
}
class F {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, i, r, s) {
    this.type = 2, this._$AH = v, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = r, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = V(this, e, i), X(e) ? e === v || e == null || e === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : e !== this._$AH && e !== P && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ei(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== v && X(this._$AH) ? this._$AA.nextSibling.data = e : this.T(O.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: i, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = ee.createElement(Ct(r.h, r.h[0]), this.options)), r);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === s) this._$AH.p(i);
    else {
      const o = new ri(s, this), a = o.u(this.options);
      o.p(i), this.T(a), this._$AH = o;
    }
  }
  _$AC(e) {
    let i = it.get(e.strings);
    return i === void 0 && it.set(e.strings, i = new ee(e)), i;
  }
  k(e) {
    Pe(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, s = 0;
    for (const n of e) s === i.length ? i.push(r = new F(this.O(Q()), this.O(Q()), this, this.options)) : r = i[s], r._$AI(n), s++;
    s < i.length && (this._$AR(r && r._$AB.nextSibling, s), i.length = s);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, i); e !== this._$AB; ) {
      const s = Ye(e).nextSibling;
      Ye(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var i;
    this._$AM === void 0 && (this._$Cv = e, (i = this._$AP) == null || i.call(this, e));
  }
}
class ue {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, r, s, n) {
    this.type = 1, this._$AH = v, this._$AN = void 0, this.element = e, this.name = i, this._$AM = s, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = v;
  }
  _$AI(e, i = this, r, s) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) e = V(this, e, i, 0), o = !X(e) || e !== this._$AH && e !== P, o && (this._$AH = e);
    else {
      const a = e;
      let l, c;
      for (e = n[0], l = 0; l < n.length - 1; l++) c = V(this, a[r + l], i, l), c === P && (c = this._$AH[l]), o || (o = !X(c) || c !== this._$AH[l]), c === v ? e = v : e !== v && (e += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    o && !s && this.j(e);
  }
  j(e) {
    e === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class si extends ue {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === v ? void 0 : e;
  }
}
class ni extends ue {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== v);
  }
}
class oi extends ue {
  constructor(e, i, r, s, n) {
    super(e, i, r, s, n), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = V(this, e, i, 0) ?? v) === P) return;
    const r = this._$AH, s = e === v && r !== v || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, n = e !== v && (r === v || s);
    s && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ai {
  constructor(e, i, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    V(this, e);
  }
}
const li = { I: F }, ge = Z.litHtmlPolyfillSupport;
ge == null || ge(ee, F), (Z.litHtmlVersions ?? (Z.litHtmlVersions = [])).push("3.3.3");
const ci = (t, e, i) => {
  const r = (i == null ? void 0 : i.renderBefore) ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const n = (i == null ? void 0 : i.renderBefore) ?? null;
    r._$litPart$ = s = new F(e.insertBefore(Q(), n), n, void 0, i ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis;
let B = class extends L {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const e = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = e.firstChild), e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ci(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return P;
  }
};
var wt;
B._$litElement$ = !0, B.finalized = !0, (wt = N.litElementHydrateSupport) == null || wt.call(N, { LitElement: B });
const be = N.litElementPolyfillSupport;
be == null || be({ LitElement: B });
(N.litElementVersions ?? (N.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Mt = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ui = { attribute: !0, type: String, converter: oe, reflect: !1, hasChanged: Oe }, di = (t = ui, e, i) => {
  const { kind: r, metadata: s } = i;
  let n = globalThis.litPropertyMetadata.get(s);
  if (n === void 0 && globalThis.litPropertyMetadata.set(s, n = /* @__PURE__ */ new Map()), r === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(i.name, t), r === "accessor") {
    const { name: o } = i;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(o, l, t, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, t, a), a;
    } };
  }
  if (r === "setter") {
    const { name: o } = i;
    return function(a) {
      const l = this[o];
      e.call(this, a), this.requestUpdate(o, l, t, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function Ue(t) {
  return (e, i) => typeof i == "object" ? di(t, e, i) : ((r, s, n) => {
    const o = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, r), o ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function A(t) {
  return Ue({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const hi = { CHILD: 2 }, pi = (t) => (...e) => ({ _$litDirective$: t, values: e });
let fi = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, i, r) {
    this._$Ct = e, this._$AM = i, this._$Ci = r;
  }
  _$AS(e, i) {
    return this.update(e, i);
  }
  update(e, i) {
    return this.render(...i);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: _i } = li, rt = (t) => t, st = () => document.createComment(""), K = (t, e, i) => {
  var n;
  const r = t._$AA.parentNode, s = e === void 0 ? t._$AB : e._$AA;
  if (i === void 0) {
    const o = r.insertBefore(st(), s), a = r.insertBefore(st(), s);
    i = new _i(o, a, t, t.options);
  } else {
    const o = i._$AB.nextSibling, a = i._$AM, l = a !== t;
    if (l) {
      let c;
      (n = i._$AQ) == null || n.call(i, t), i._$AM = t, i._$AP !== void 0 && (c = t._$AU) !== a._$AU && i._$AP(c);
    }
    if (o !== s || l) {
      let c = i._$AA;
      for (; c !== o; ) {
        const d = rt(c).nextSibling;
        rt(r).insertBefore(c, s), c = d;
      }
    }
  }
  return i;
}, k = (t, e, i = t) => (t._$AI(e, i), t), vi = {}, mi = (t, e = vi) => t._$AH = e, gi = (t) => t._$AH, ye = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt = (t, e, i) => {
  const r = /* @__PURE__ */ new Map();
  for (let s = e; s <= i; s++) r.set(t[s], s);
  return r;
}, we = pi(class extends fi {
  constructor(t) {
    if (super(t), t.type !== hi.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, i) {
    let r;
    i === void 0 ? i = e : e !== void 0 && (r = e);
    const s = [], n = [];
    let o = 0;
    for (const a of t) s[o] = r ? r(a, o) : o, n[o] = i(a, o), o++;
    return { values: n, keys: s };
  }
  render(t, e, i) {
    return this.dt(t, e, i).values;
  }
  update(t, [e, i, r]) {
    const s = gi(t), { values: n, keys: o } = this.dt(e, i, r);
    if (!Array.isArray(s)) return this.ut = o, n;
    const a = this.ut ?? (this.ut = []), l = [];
    let c, d, u = 0, p = s.length - 1, f = 0, m = n.length - 1;
    for (; u <= p && f <= m; ) if (s[u] === null) u++;
    else if (s[p] === null) p--;
    else if (a[u] === o[f]) l[f] = k(s[u], n[f]), u++, f++;
    else if (a[p] === o[m]) l[m] = k(s[p], n[m]), p--, m--;
    else if (a[u] === o[m]) l[m] = k(s[u], n[m]), K(t, l[m + 1], s[u]), u++, m--;
    else if (a[p] === o[f]) l[f] = k(s[p], n[f]), K(t, s[u], s[p]), p--, f++;
    else if (c === void 0 && (c = nt(o, f, m), d = nt(a, u, p)), c.has(a[u])) if (c.has(a[p])) {
      const E = d.get(o[f]), _e = E !== void 0 ? s[E] : null;
      if (_e === null) {
        const Je = K(t, s[u]);
        k(Je, n[f]), l[f] = Je;
      } else l[f] = k(_e, n[f]), K(t, s[u], _e), s[E] = null;
      f++;
    } else ye(s[p]), p--;
    else ye(s[u]), u++;
    for (; f <= m; ) {
      const E = K(t, l[m + 1]);
      k(E, n[f]), l[f++] = E;
    }
    for (; u <= p; ) {
      const E = s[u++];
      E !== null && ye(E);
    }
    return this.ut = o, mi(t, l), P;
  }
});
async function bi(t, e, i, r) {
  if (!(i.confirmation && !await r.confirm(`Run ${i.name ?? Tt(i)}?`))) {
    if (i.action === "more-info") {
      r.showMoreInfo(e);
      return;
    }
    if (i.navigation_path) {
      r.navigate(i.navigation_path);
      return;
    }
    if (i.url_path) {
      r.openUrl(i.url_path);
      return;
    }
    if (i.service) {
      if (!t.callService)
        throw new Error("Home Assistant service calling is not available.");
      const [s, n] = i.service.split(".", 2);
      await t.callService(s, n, i.data, i.target);
    }
  }
}
function Tt(t) {
  return t.name ? t.name : t.action === "more-info" ? "More info" : t.navigation_path ? "Navigate" : t.url_path ? "Open link" : "Run service";
}
function yi(t) {
  window.history.pushState(null, "", t), window.dispatchEvent(
    new CustomEvent("location-changed", {
      detail: { replace: !1 }
    })
  );
}
const Rt = "Attention Center", kt = 30, It = 15, Nt = 24, Dt = /* @__PURE__ */ new Set(["critical", "warning", "info"]), wi = /* @__PURE__ */ new Set(["unavailable", "battery", "stale", "rule"]), $i = /* @__PURE__ */ new Set(["full", "compact", "summary"]), Ai = /* @__PURE__ */ new Set(["message", "hide"]), Ei = /* @__PURE__ */ new Set(["none", "severity", "area", "source", "device"]), h = {
  title: Rt,
  detect_unavailable: !0,
  detect_batteries: !0,
  detect_stale: !1,
  stale_hours: Nt,
  battery_warning: kt,
  battery_critical: It,
  battery_thresholds: {},
  availability: {
    detect_unavailable: !0,
    detect_unknown: !0,
    unavailable_severity: "warning",
    unknown_severity: "warning",
    unavailable_for_minutes: 0,
    unknown_for_minutes: 0,
    startup_grace_minutes: 0
  },
  display_mode: "full",
  empty_state: "message",
  reverse_age_sort: !1,
  group_by: "none",
  show_severities: ["critical", "warning", "info"],
  show_sources: ["unavailable", "battery", "stale", "rule"],
  collapsed_groups: [],
  include: {
    labels: []
  },
  exclude: {
    domains: [],
    entities: [],
    devices: [],
    areas: [],
    patterns: [],
    labels: []
  },
  stale_rules: [],
  rules: []
};
function Si(t) {
  return typeof t == "string" && Dt.has(t);
}
function de(t) {
  if (!w(t))
    throw new Error("Attention Center Card configuration must be an object.");
  const e = t, i = j(
    e.detect_unavailable,
    "detect_unavailable",
    h.detect_unavailable
  ), r = Pt(e.title, "title") ?? Rt, s = ot(
    e.battery_warning,
    "battery_warning",
    kt
  ), n = ot(
    e.battery_critical,
    "battery_critical",
    It
  );
  if (n >= s)
    throw new Error("battery_critical must be lower than battery_warning.");
  const o = Ae(
    e.display_mode,
    "display_mode",
    $i,
    h.display_mode
  ), a = Ae(
    e.empty_state,
    "empty_state",
    Ai,
    h.empty_state
  );
  return {
    ...e,
    title: r,
    detect_unavailable: i,
    detect_batteries: j(
      e.detect_batteries,
      "detect_batteries",
      h.detect_batteries
    ),
    detect_stale: j(
      e.detect_stale,
      "detect_stale",
      h.detect_stale
    ),
    stale_hours: ze(e.stale_hours, "stale_hours", Nt),
    battery_warning: s,
    battery_critical: n,
    battery_thresholds: Ni(
      e.battery_thresholds,
      s,
      n
    ),
    battery_warning_entity: b(
      e.battery_warning_entity,
      "battery_warning_entity"
    ),
    battery_critical_entity: b(
      e.battery_critical_entity,
      "battery_critical_entity"
    ),
    availability: Ti(e.availability, i),
    display_mode: o,
    empty_state: a,
    reverse_age_sort: j(
      e.reverse_age_sort,
      "reverse_age_sort",
      h.reverse_age_sort
    ),
    group_by: Ae(e.group_by, "group_by", Ei, h.group_by),
    show_severities: at(
      e.show_severities,
      "show_severities",
      Dt,
      h.show_severities
    ),
    show_sources: at(
      e.show_sources,
      "show_sources",
      wi,
      h.show_sources
    ),
    max_issues: Di(e.max_issues, "max_issues"),
    collapsed_groups: S(e.collapsed_groups, "collapsed_groups"),
    include: Ci(e.include),
    exclude: Mi(e.exclude),
    stale_rules: Ii(e.stale_rules),
    rules: Ri(e.rules)
  };
}
function xi(t) {
  return JSON.stringify(t);
}
function Ci(t) {
  if (t !== void 0 && !w(t))
    throw new Error("include must be an object.");
  return {
    labels: S(t == null ? void 0 : t.labels, "include.labels")
  };
}
function Mi(t) {
  if (t !== void 0 && !w(t))
    throw new Error("exclude must be an object.");
  return {
    domains: S(t == null ? void 0 : t.domains, "exclude.domains"),
    entities: S(t == null ? void 0 : t.entities, "exclude.entities"),
    devices: S(t == null ? void 0 : t.devices, "exclude.devices"),
    areas: S(t == null ? void 0 : t.areas, "exclude.areas"),
    patterns: S(t == null ? void 0 : t.patterns, "exclude.patterns"),
    labels: S(t == null ? void 0 : t.labels, "exclude.labels")
  };
}
function Ti(t, e) {
  if (t !== void 0 && !w(t))
    throw new Error("availability must be an object.");
  return {
    detect_unavailable: j(
      t == null ? void 0 : t.detect_unavailable,
      "availability.detect_unavailable",
      e
    ),
    detect_unknown: j(
      t == null ? void 0 : t.detect_unknown,
      "availability.detect_unknown",
      e
    ),
    unavailable_severity: le(
      t == null ? void 0 : t.unavailable_severity,
      "availability.unavailable_severity",
      "warning"
    ),
    unknown_severity: le(
      t == null ? void 0 : t.unknown_severity,
      "availability.unknown_severity",
      "warning"
    ),
    unavailable_for_minutes: $e(
      t == null ? void 0 : t.unavailable_for_minutes,
      "availability.unavailable_for_minutes",
      0
    ),
    unknown_for_minutes: $e(
      t == null ? void 0 : t.unknown_for_minutes,
      "availability.unknown_for_minutes",
      0
    ),
    startup_grace_minutes: $e(
      t == null ? void 0 : t.startup_grace_minutes,
      "availability.startup_grace_minutes",
      0
    )
  };
}
function Ri(t) {
  if (t === void 0)
    return [];
  if (!Array.isArray(t))
    throw new Error("rules must be a list.");
  return t.map((e, i) => {
    if (!w(e))
      throw new Error(`rules[${i}] must be an object.`);
    const r = b(e.entity_id, `rules[${i}].entity_id`), s = b(e.label, `rules[${i}].label`);
    if (r === void 0 == (s === void 0))
      throw new Error(`rules[${i}] must define exactly one of entity_id or label.`);
    const n = le(e.severity, `rules[${i}].severity`, "warning");
    if (e.attribute !== void 0 && typeof e.attribute != "string")
      throw new Error(`rules[${i}].attribute must be a string.`);
    if (e.title !== void 0 && typeof e.title != "string")
      throw new Error(`rules[${i}].title must be a string.`);
    if (e.above !== void 0 && !y(e.above))
      throw new Error(`rules[${i}].above must be a number.`);
    if (e.below !== void 0 && !y(e.below))
      throw new Error(`rules[${i}].below must be a number.`);
    const o = b(
      e.above_entity,
      `rules[${i}].above_entity`
    ), a = b(
      e.below_entity,
      `rules[${i}].below_entity`
    );
    if (e.above !== void 0 && o !== void 0)
      throw new Error(`rules[${i}] cannot define both above and above_entity.`);
    if (e.below !== void 0 && a !== void 0)
      throw new Error(`rules[${i}] cannot define both below and below_entity.`);
    if (e.clear_below !== void 0 && !y(e.clear_below))
      throw new Error(`rules[${i}].clear_below must be a number.`);
    if (e.clear_above !== void 0 && !y(e.clear_above))
      throw new Error(`rules[${i}].clear_above must be a number.`);
    if (e.clear_below !== void 0 && e.above === void 0 && o === void 0)
      throw new Error(`rules[${i}].clear_below requires above or above_entity.`);
    if (e.clear_above !== void 0 && e.below === void 0 && a === void 0)
      throw new Error(`rules[${i}].clear_above requires below or below_entity.`);
    if (e.above !== void 0 && e.clear_below !== void 0 && e.clear_below >= e.above)
      throw new Error(`rules[${i}].clear_below must be lower than above.`);
    if (e.below !== void 0 && e.clear_above !== void 0 && e.clear_above <= e.below)
      throw new Error(`rules[${i}].clear_above must be higher than below.`);
    if (e.for_minutes !== void 0 && (!y(e.for_minutes) || e.for_minutes < 0))
      throw new Error(`rules[${i}].for_minutes must be zero or greater.`);
    if (!(e.state !== void 0 || e.not_state !== void 0 || e.above !== void 0 || o !== void 0 || e.below !== void 0 || a !== void 0))
      throw new Error(
        `rules[${i}] must define state, not_state, above, above_entity, below, or below_entity.`
      );
    return {
      ...e,
      entity_id: r,
      label: s,
      above_entity: o,
      below_entity: a,
      severity: n,
      actions: ki(e.actions, i)
    };
  });
}
function ki(t, e) {
  if (t === void 0)
    return [];
  if (!Array.isArray(t))
    throw new Error(`rules[${e}].actions must be a list.`);
  return t.map((i, r) => {
    const s = `rules[${e}].actions[${r}]`;
    if (!w(i))
      throw new Error(`${s} must be an object.`);
    if (i.action !== void 0 && i.action !== "more-info")
      throw new Error(`${s}.action must be more-info.`);
    const n = b(
      i.navigation_path,
      `${s}.navigation_path`
    ), o = b(i.url_path, `${s}.url_path`), a = b(i.service, `${s}.service`);
    if ([
      i.action === "more-info",
      n !== void 0,
      o !== void 0,
      a !== void 0
    ].filter(Boolean).length !== 1)
      throw new Error(
        `${s} must define exactly one of action: more-info, navigation_path, url_path, or service.`
      );
    if (n !== void 0 && !n.startsWith("/"))
      throw new Error(`${s}.navigation_path must start with /.`);
    if (o !== void 0 && /^[a-z][a-z0-9+.-]*:/i.test(o) && !/^https?:/i.test(o))
      throw new Error(`${s}.url_path must use http, https, or a relative URL.`);
    if (a !== void 0 && !/^[a-z0-9_]+\.[a-z0-9_]+$/i.test(a))
      throw new Error(`${s}.service must use domain.service format.`);
    if (i.target !== void 0 && !w(i.target))
      throw new Error(`${s}.target must be an object.`);
    if (i.data !== void 0 && !w(i.data))
      throw new Error(`${s}.data must be an object.`);
    if (i.confirmation !== void 0 && typeof i.confirmation != "boolean")
      throw new Error(`${s}.confirmation must be a boolean.`);
    return {
      ...i,
      name: b(i.name, `${s}.name`),
      icon: b(i.icon, `${s}.icon`),
      navigation_path: n,
      url_path: o,
      service: a
    };
  });
}
function Ii(t) {
  if (t === void 0)
    return [];
  if (!Array.isArray(t))
    throw new Error("stale_rules must be a list.");
  return t.map((e, i) => {
    if (!w(e))
      throw new Error(`stale_rules[${i}] must be an object.`);
    return {
      ...e,
      entity_id: Ot(e.entity_id, `stale_rules[${i}].entity_id`),
      hours: ze(e.hours, `stale_rules[${i}].hours`),
      severity: le(e.severity, `stale_rules[${i}].severity`, "warning"),
      title: Pt(e.title, `stale_rules[${i}].title`)
    };
  });
}
function Ni(t, e, i) {
  if (t === void 0)
    return {};
  if (!w(t))
    throw new Error("battery_thresholds must be an object.");
  const r = {};
  for (const [s, n] of Object.entries(t)) {
    if (typeof n == "number") {
      if (!y(n) || n <= 0)
        throw new Error(`battery_thresholds.${s} must be a positive number.`);
      lt(n, i, `battery_thresholds.${s}`), r[s] = n;
      continue;
    }
    if (!w(n))
      throw new Error(`battery_thresholds.${s} must be a number or object.`);
    const o = n.warning, a = n.critical;
    if (o !== void 0 && (!y(o) || o <= 0))
      throw new Error(`battery_thresholds.${s}.warning must be a positive number.`);
    if (a !== void 0 && (!y(a) || a <= 0))
      throw new Error(`battery_thresholds.${s}.critical must be a positive number.`);
    if (o !== void 0 && a !== void 0 && a >= o)
      throw new Error(
        `battery_thresholds.${s}.critical must be lower than warning when both are set.`
      );
    lt(
      o ?? e,
      a ?? i,
      `battery_thresholds.${s}`
    ), r[s] = { warning: o, critical: a };
  }
  return r;
}
function S(t, e) {
  if (t === void 0)
    return [];
  if (!Array.isArray(t) || t.some((i) => typeof i != "string"))
    throw new Error(`${e} must be a list of strings.`);
  return t.map((i) => i.trim()).filter(Boolean);
}
function Ot(t, e) {
  if (typeof t != "string" || t.trim().length === 0)
    throw new Error(`${e} must be a non-empty string.`);
  return t.trim();
}
function Pt(t, e) {
  if (t !== void 0) {
    if (typeof t != "string")
      throw new Error(`${e} must be a string.`);
    return t.trim();
  }
}
function b(t, e) {
  if (t !== void 0)
    return Ot(t, e);
}
function ot(t, e, i) {
  return t === void 0 ? i : ze(t, e);
}
function j(t, e, i) {
  if (t === void 0)
    return i;
  if (typeof t != "boolean")
    throw new Error(`${e} must be a boolean.`);
  return t;
}
function ze(t, e, i) {
  if (t === void 0 && i !== void 0)
    return i;
  if (!y(t) || t <= 0)
    throw new Error(`${e} must be a positive number.`);
  return t;
}
function $e(t, e, i) {
  if (t === void 0)
    return i;
  if (!y(t) || t < 0)
    throw new Error(`${e} must be zero or greater.`);
  return t;
}
function Di(t, e) {
  if (t !== void 0) {
    if (!y(t) || !Number.isInteger(t) || t <= 0)
      throw new Error(`${e} must be a positive integer.`);
    return t;
  }
}
function le(t, e, i) {
  if (t === void 0)
    return i;
  if (!Si(t))
    throw new Error(`${e} must be one of critical, warning, or info.`);
  return t;
}
function Ae(t, e, i, r) {
  if (t === void 0)
    return r;
  if (typeof t != "string" || !i.has(t))
    throw new Error(`${e} is not supported.`);
  return t;
}
function at(t, e, i, r) {
  if (t === void 0)
    return [...r];
  if (!Array.isArray(t) || t.some((s) => typeof s != "string" || !i.has(s)))
    throw new Error(`${e} contains an unsupported value.`);
  return [...new Set(t)];
}
function w(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
function y(t) {
  return typeof t == "number" && Number.isFinite(t);
}
function lt(t, e, i) {
  if (e >= t)
    throw new Error(`${i}.critical must resolve lower than warning.`);
}
const Oi = {
  alarm_control_panel: "mdi:shield-alert",
  binary_sensor: "mdi:checkbox-marked-circle-outline",
  climate: "mdi:thermostat",
  cover: "mdi:window-shutter-alert",
  device_tracker: "mdi:map-marker-alert",
  fan: "mdi:fan-alert",
  light: "mdi:lightbulb-alert",
  lock: "mdi:lock-alert",
  sensor: "mdi:alert-circle-outline",
  switch: "mdi:toggle-switch-variant-off"
};
function Ut(t) {
  var e;
  return ((e = t.split(".", 1)[0]) == null ? void 0 : e.toLowerCase()) ?? "";
}
function he(t) {
  if (typeof t == "number" && Number.isFinite(t))
    return t;
  if (typeof t != "string")
    return;
  const e = t.trim();
  if (e.length === 0 || e === "unknown" || e === "unavailable")
    return;
  const i = Number(e);
  return Number.isFinite(i) ? i : void 0;
}
function U(t) {
  if (!t)
    return;
  const e = Date.parse(t);
  return Number.isFinite(e) ? e : void 0;
}
function Pi(t, e) {
  var s;
  const i = t.states[e], r = (s = t.entities) == null ? void 0 : s[e];
  return D(i == null ? void 0 : i.attributes.friendly_name) ?? D(r == null ? void 0 : r.name) ?? D(r == null ? void 0 : r.original_name) ?? e;
}
function Ui(t, e, i, r) {
  var a;
  const s = t.states[e], n = (a = t.entities) == null ? void 0 : a[e], o = D(s == null ? void 0 : s.attributes.icon) ?? D(n == null ? void 0 : n.icon);
  return o || (r === "battery" ? i === "critical" ? "mdi:battery-alert" : "mdi:battery-low" : i === "critical" ? "mdi:alert-octagon" : i === "warning" ? "mdi:alert" : Oi[Ut(e)] ?? "mdi:information-outline");
}
function zi(t, e) {
  const i = zt(t, e);
  for (const r of i) {
    const s = Ht(t, r);
    if (s != null && s.name)
      return s.name;
  }
  return i[0];
}
function zt(t, e) {
  var l;
  const i = /* @__PURE__ */ new Set(), r = (l = t.entities) == null ? void 0 : l[e];
  ie(i, r == null ? void 0 : r.area_id);
  const s = te(t, e), n = s ? Le(t, s) : void 0;
  ie(i, n == null ? void 0 : n.area_id);
  const o = t.states[e], a = o == null ? void 0 : o.attributes.area;
  typeof a == "string" && ie(i, a);
  for (const c of [...i]) {
    const d = Ht(t, c);
    ie(i, d == null ? void 0 : d.name);
  }
  return [...i];
}
function te(t, e) {
  var s, n;
  const i = (s = t.entities) == null ? void 0 : s[e];
  if (i != null && i.device_id)
    return i.device_id;
  const r = (n = t.states[e]) == null ? void 0 : n.attributes.device_id;
  return typeof r == "string" ? r : void 0;
}
function He(t, e) {
  var n, o;
  const i = new Set(((o = (n = t.entities) == null ? void 0 : n[e]) == null ? void 0 : o.labels) ?? []), r = te(t, e), s = r ? Le(t, r) : void 0;
  for (const a of (s == null ? void 0 : s.labels) ?? [])
    i.add(a);
  return [...i];
}
function Hi(t, e) {
  const i = te(t, e);
  if (!i)
    return;
  const r = Le(t, i);
  return D(r == null ? void 0 : r.name_by_user) ?? D(r == null ? void 0 : r.name) ?? i;
}
function pe(t) {
  const e = t.hass.states[t.entityId], i = te(t.hass, t.entityId), r = t.activeSinceMs ?? U(e == null ? void 0 : e.last_changed) ?? U(e == null ? void 0 : e.last_updated) ?? Date.now();
  return {
    id: t.id,
    entity_id: t.entityId,
    severity: t.severity,
    title: t.title ?? Pi(t.hass, t.entityId),
    message: t.message,
    state: (e == null ? void 0 : e.state) ?? "missing",
    activeSinceMs: r,
    area: zi(t.hass, t.entityId),
    deviceId: i,
    deviceName: Hi(t.hass, t.entityId),
    icon: Ui(t.hass, t.entityId, t.severity, t.source),
    source: t.source,
    actions: t.actions
  };
}
function Ht(t, e) {
  var r;
  const i = (r = t.areas) == null ? void 0 : r[e];
  return i || Object.values(t.areas ?? {}).find(
    (s) => s.area_id === e || s.id === e || s.name === e
  );
}
function Le(t, e) {
  var r;
  const i = (r = t.devices) == null ? void 0 : r[e];
  return i || Object.values(t.devices ?? {}).find(
    (s) => s.id === e || s.name === e || s.name_by_user === e
  );
}
function D(t) {
  return typeof t == "string" && t.trim().length > 0 ? t.trim() : void 0;
}
function ie(t, e) {
  e && e.trim().length > 0 && t.add(e);
}
function Re(t) {
  const e = t.trim(), i = e.includes("*") || e.includes("?");
  return {
    pattern: e,
    wildcard: i,
    regex: i ? Bi(e) : void 0
  };
}
function Lt(t, e) {
  var i;
  return e.wildcard ? ((i = e.regex) == null ? void 0 : i.test(t)) ?? !1 : t === e.pattern;
}
function jt(t, e) {
  return e.wildcard ? Object.keys(t.states).filter((i) => Lt(i, e)) : t.states[e.pattern] ? [e.pattern] : [];
}
function Li(t) {
  return {
    domains: new Set(t.domains.map((e) => e.toLowerCase())),
    entities: new Set(t.entities),
    devices: new Set(t.devices),
    areas: new Set(t.areas),
    areaNames: new Set(t.areas.map((e) => e.toLowerCase())),
    labels: new Set(t.labels),
    patterns: t.patterns.map(Re)
  };
}
function fe(t, e, i) {
  if (i.entities.has(t) || i.domains.has(Ut(t)) || i.patterns.some((n) => Lt(t, n)) || He(e, t).some((n) => i.labels.has(n)))
    return !0;
  const r = te(e, t);
  return r && i.devices.has(r) ? !0 : zt(e, t).some(
    (n) => i.areas.has(n) || i.areaNames.has(n.toLowerCase())
  );
}
function Bt(t, e, i) {
  if (i.length === 0)
    return !0;
  const r = new Set(i);
  return He(e, t).some((s) => r.has(s));
}
function ji(t, e) {
  return Object.keys(t.states).filter(
    (i) => He(t, i).includes(e)
  );
}
function Bi(t) {
  let e = "^";
  for (const i of t)
    i === "*" ? e += ".*" : i === "?" ? e += "." : e += Vi(i);
  return e += "$", new RegExp(e, "i");
}
function Vi(t) {
  return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const ct = [
  /(^|[._-])battery($|[._-])/i,
  /(^|[._-])battery_level($|[._-])/i,
  /(^|[._-])battery_percent(age)?($|[._-])/i,
  /(^|[._-])battery_percentage($|[._-])/i,
  /(^|[._-])low_battery($|[._-])/i
];
function Fi(t) {
  const { config: e, exclusions: i } = t.plan;
  if (!e.detect_batteries)
    return [];
  const r = Ki(t);
  if (!r)
    return [];
  const s = [];
  for (const [n, o] of Object.entries(t.hass.states)) {
    if (n === e.battery_warning_entity || n === e.battery_critical_entity || !Ji(n, o) || !Bt(n, t.hass, e.include.labels) || fe(n, t.hass, i))
      continue;
    const a = he(o.state);
    if (a === void 0)
      continue;
    const l = qi(t, n, r);
    if (l.critical >= l.warning) {
      je(
        t,
        `battery-threshold-order:${n}`,
        `Battery thresholds for ${n} are invalid: critical must be lower than warning.`
      );
      continue;
    }
    const c = Gi(a, l);
    if (!c)
      continue;
    const d = c === "critical" ? l.critical : l.warning;
    s.push(
      pe({
        hass: t.hass,
        entityId: n,
        severity: c,
        message: `Battery is ${Wi(a)}% (${c} below ${d}%)`,
        activeSinceMs: U(o.last_changed),
        source: "battery",
        id: `battery:${n}`
      })
    );
  }
  return s;
}
function Ji(t, e) {
  const i = e.attributes.device_class, r = e.attributes.unit_of_measurement;
  return i === "battery" || typeof r == "string" && r.trim() === "%" && ct.some((s) => s.test(t)) ? !0 : ct.some((s) => s.test(t));
}
function qi(t, e, i) {
  const r = t.plan.config.battery_thresholds[e];
  return r === void 0 ? {
    warning: i.warning,
    critical: i.critical
  } : typeof r == "number" ? {
    warning: r,
    critical: i.critical
  } : {
    warning: r.warning ?? i.warning,
    critical: r.critical ?? i.critical
  };
}
function Ki(t) {
  const { config: e } = t.plan, i = ut(
    t,
    e.battery_warning_entity,
    e.battery_warning,
    "battery_warning_entity"
  ), r = ut(
    t,
    e.battery_critical_entity,
    e.battery_critical,
    "battery_critical_entity"
  );
  if (!(i === void 0 || r === void 0)) {
    if (r >= i) {
      je(
        t,
        "battery-threshold-order",
        "Resolved battery_critical must be lower than battery_warning."
      );
      return;
    }
    return { warning: i, critical: r };
  }
}
function ut(t, e, i, r) {
  var n;
  if (!e)
    return i;
  const s = he((n = t.hass.states[e]) == null ? void 0 : n.state);
  if (s === void 0 || s <= 0) {
    je(
      t,
      `invalid-threshold:${r}`,
      `${r} (${e}) must have an available finite positive numeric state.`
    );
    return;
  }
  return s;
}
function je(t, e, i) {
  t.diagnostics.set(e, { code: e, message: i });
}
function Gi(t, e) {
  if (t < e.critical)
    return "critical";
  if (t < e.warning)
    return "warning";
}
function Wi(t) {
  return Number.isInteger(t) ? String(t) : t.toFixed(1);
}
const Yi = 3600 * 1e3;
function Zi(t) {
  const e = [], i = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const s of t.plan.staleRules) {
    const n = jt(t.hass, s.matcher);
    for (const o of n)
      r.add(o), dt(t, o, s.rule, e, i);
  }
  if (t.plan.config.detect_stale)
    for (const s of Object.keys(t.hass.states))
      r.has(s) || dt(
        t,
        s,
        {
          hours: t.plan.config.stale_hours,
          severity: "warning"
        },
        e,
        i
      );
  return e;
}
function dt(t, e, i, r, s) {
  if (s.has(e) || fe(e, t.hass, t.plan.exclusions))
    return;
  const n = t.hass.states[e];
  if (!n)
    return;
  const o = U(n.last_updated) ?? U(n.last_changed);
  if (o === void 0)
    return;
  const a = i.hours * Yi, l = o + a;
  t.now.getTime() < l || (s.add(e), r.push(
    pe({
      hass: t.hass,
      entityId: e,
      severity: i.severity ?? "warning",
      title: i.title,
      message: `No update for ${Qi(i.hours)}`,
      activeSinceMs: l,
      source: "stale",
      id: `stale:${e}`
    })
  ));
}
function Qi(t) {
  return Number.isInteger(t) ? `${t}h` : `${t.toFixed(1)}h`;
}
const ht = 60 * 1e3;
function Xi(t) {
  const { availability: e, include: i } = t.plan.config, r = t.connectedAtMs ?? t.now.getTime();
  if (e.startup_grace_minutes > 0 && t.now.getTime() < r + e.startup_grace_minutes * ht)
    return [];
  const s = [];
  for (const [n, o] of Object.entries(t.hass.states)) {
    const a = o.state === "unknown", l = o.state === "unavailable";
    if (!a && !l || a && !e.detect_unknown || l && !e.detect_unavailable || !Bt(n, t.hass, i.labels) || fe(n, t.hass, t.plan.exclusions))
      continue;
    const c = a ? e.unknown_for_minutes : e.unavailable_for_minutes, u = (U(o.last_changed) ?? t.now.getTime()) + c * ht;
    if (t.now.getTime() < u)
      continue;
    const p = a ? "unknown" : "unavailable";
    s.push(
      pe({
        hass: t.hass,
        entityId: n,
        severity: a ? e.unknown_severity : e.unavailable_severity,
        message: `State is ${p}`,
        activeSinceMs: u,
        source: "unavailable",
        id: `unavailable:${n}`
      })
    );
  }
  return s;
}
const er = 60 * 1e3;
function tr(t) {
  const e = [], i = /* @__PURE__ */ new Set();
  for (const r of t.plan.userRules) {
    const s = /* @__PURE__ */ new Set();
    if (r.matcher)
      for (const n of jt(t.hass, r.matcher))
        s.add(n);
    if (r.label)
      for (const n of ji(t.hass, r.label))
        s.add(n);
    for (const n of s) {
      const o = ar(r.index, n);
      if (i.add(o), fe(n, t.hass, t.plan.exclusions)) {
        G(t, o);
        continue;
      }
      const a = t.hass.states[n];
      if (!a) {
        G(t, o);
        continue;
      }
      const l = ir(r.rule, a, n, t, o);
      l.matched && e.push(
        pe({
          hass: t.hass,
          entityId: n,
          severity: r.rule.severity ?? "warning",
          title: r.rule.title,
          message: l.message,
          activeSinceMs: l.activeSinceMs,
          source: "rule",
          id: `rule:${r.index}:${n}`,
          actions: r.rule.actions
        })
      );
    }
  }
  for (const r of t.ruleDurationMemory.firstMatchedAtMs.keys())
    i.has(r) || G(t, r);
  for (const r of t.ruleDurationMemory.activeHysteresisKeys)
    i.has(r) || G(t, r);
  return e;
}
function ir(t, e, i, r, s) {
  const n = rr(t, e, i, r, s);
  if (!n.matched)
    return G(r, s), { matched: !1 };
  const o = r.now.getTime(), a = r.ruleDurationMemory.firstMatchedAtMs.get(s) ?? nr(t, e, o);
  r.ruleDurationMemory.firstMatchedAtMs.set(s, a);
  const l = (t.for_minutes ?? 0) * er, c = a + l;
  return l > 0 && o < c ? { matched: !1 } : (or(t) && r.ruleDurationMemory.activeHysteresisKeys.add(s), {
    matched: !0,
    message: n.message,
    activeSinceMs: c
  });
}
function rr(t, e, i, r, s) {
  const n = sr(t, e), o = [];
  if (t.state !== void 0) {
    if (!ft(n, t.state))
      return { matched: !1 };
    o.push(`${z(t)} is ${String(t.state)}`);
  }
  if (t.not_state !== void 0) {
    if (ft(n, t.not_state))
      return { matched: !1 };
    o.push(`${z(t)} is not ${String(t.not_state)}`);
  }
  const a = pt(t.above, t.above_entity, "above", i, r), l = pt(t.below, t.below_entity, "below", i, r);
  if (a.invalid || l.invalid)
    return { matched: !1 };
  const c = a.value !== void 0 || l.value !== void 0, d = c ? he(n) : void 0;
  if (c && d === void 0)
    return { matched: !1 };
  const u = r.ruleDurationMemory.activeHysteresisKeys.has(s);
  if (a.value !== void 0 && d !== void 0) {
    if (t.clear_below !== void 0 && t.clear_below >= a.value)
      return ke(
        r,
        `invalid-clear-below:${s}`,
        `Rule for ${i} requires clear_below to be lower than its resolved above threshold.`
      ), { matched: !1 };
    if (!(u && t.clear_below !== void 0 ? d >= t.clear_below : d > a.value))
      return { matched: !1 };
    o.push(
      u && t.clear_below !== void 0 ? `${z(t)} ${re(d)} has not cleared below ${t.clear_below}` : `${z(t)} ${re(d)} is above ${a.value}`
    );
  }
  if (l.value !== void 0 && d !== void 0) {
    if (t.clear_above !== void 0 && t.clear_above <= l.value)
      return ke(
        r,
        `invalid-clear-above:${s}`,
        `Rule for ${i} requires clear_above to be higher than its resolved below threshold.`
      ), { matched: !1 };
    if (!(u && t.clear_above !== void 0 ? d <= t.clear_above : d < l.value))
      return { matched: !1 };
    o.push(
      u && t.clear_above !== void 0 ? `${z(t)} ${re(d)} has not cleared above ${t.clear_above}` : `${z(t)} ${re(d)} is below ${l.value}`
    );
  }
  return {
    matched: !0,
    message: o.length > 0 ? o.join("; ") : "Rule matched"
  };
}
function pt(t, e, i, r, s) {
  var o;
  if (!e)
    return { value: t, invalid: !1 };
  const n = he((o = s.hass.states[e]) == null ? void 0 : o.state);
  return n === void 0 ? (ke(
    s,
    `invalid-rule-threshold:${i}:${r}:${e}`,
    `${i}_entity (${e}) for ${r} must have an available finite numeric state.`
  ), { invalid: !0 }) : { value: n, invalid: !1 };
}
function sr(t, e) {
  return t.attribute ? e.attributes[t.attribute] : e.state;
}
function nr(t, e, i) {
  return t.attribute === void 0 && t.above === void 0 && t.above_entity === void 0 && t.below === void 0 && t.below_entity === void 0 && (t.state !== void 0 || t.not_state !== void 0) ? U(e.last_changed) ?? i : i;
}
function or(t) {
  return t.clear_below !== void 0 || t.clear_above !== void 0;
}
function G(t, e) {
  t.ruleDurationMemory.firstMatchedAtMs.delete(e), t.ruleDurationMemory.activeHysteresisKeys.delete(e);
}
function ke(t, e, i) {
  t.diagnostics.set(e, { code: e, message: i });
}
function ft(t, e) {
  return String(t) === String(e);
}
function z(t) {
  return t.attribute ? `Attribute ${t.attribute}` : "State";
}
function re(t) {
  return Number.isInteger(t) ? String(t) : t.toFixed(1);
}
function ar(t, e) {
  return `rule:${t}:${e}`;
}
const lr = {
  critical: 0,
  warning: 1,
  info: 2
};
function ce(t) {
  return lr[t];
}
function Be(t, e = !1) {
  return [...t].sort((i, r) => {
    const s = ce(i.severity) - ce(r.severity);
    if (s !== 0)
      return s;
    const n = i.activeSinceMs - r.activeSinceMs;
    return n !== 0 ? e ? -n : n : i.id.localeCompare(r.id);
  });
}
function _t(t) {
  return {
    critical: t.filter((e) => e.severity === "critical").length,
    warning: t.filter((e) => e.severity === "warning").length,
    info: t.filter((e) => e.severity === "info").length
  };
}
function Ve(t) {
  return {
    config: t,
    exclusions: Li(t.exclude),
    userRules: t.rules.map((e, i) => ({
      rule: e,
      matcher: e.entity_id ? Re(e.entity_id) : void 0,
      label: e.label,
      index: i
    })),
    staleRules: t.stale_rules.map((e, i) => ({
      rule: e,
      matcher: Re(e.entity_id),
      index: i
    }))
  };
}
function Ie() {
  return {
    firstMatchedAtMs: /* @__PURE__ */ new Map(),
    activeHysteresisKeys: /* @__PURE__ */ new Set()
  };
}
function cr(t, e, i = /* @__PURE__ */ new Date(), r = {}) {
  return Fe(t, e, i, r).issues;
}
function Fe(t, e, i = /* @__PURE__ */ new Date(), r = {}) {
  const s = {
    hass: t,
    plan: e,
    now: i,
    connectedAtMs: r.connectedAtMs,
    ruleDurationMemory: r.ruleDurationMemory ?? Ie(),
    diagnostics: /* @__PURE__ */ new Map()
  }, n = [
    ...Xi(s),
    ...Fi(s),
    ...Zi(s),
    ...tr(s)
  ];
  return {
    issues: Be(ur(n), e.config.reverse_age_sort),
    diagnostics: [...s.diagnostics.values()]
  };
}
function Mr(t, e, i = /* @__PURE__ */ new Date(), r = {}) {
  const s = de(e);
  return cr(t, Ve(s), i, r);
}
function Tr(t, e, i = /* @__PURE__ */ new Date(), r = {}) {
  const s = de(e);
  return Fe(t, Ve(s), i, r);
}
function ur(t) {
  const e = /* @__PURE__ */ new Map();
  for (const i of t)
    e.set(i.id, i);
  return [...e.values()];
}
const ne = 60 * 1e3, W = 60 * ne, Ee = 24 * W;
function dr(t, e = Date.now()) {
  const i = Math.max(0, e - t);
  if (i < ne)
    return "<1m";
  if (i < W)
    return `${Math.floor(i / ne)}m`;
  if (i < Ee) {
    const n = Math.floor(i / W), o = Math.floor(i % W / ne);
    return o > 0 ? `${n}h ${o}m` : `${n}h`;
  }
  const r = Math.floor(i / Ee), s = Math.floor(i % Ee / W);
  return s > 0 ? `${r}d ${s}h` : `${r}d`;
}
const vt = ["unavailable", "battery", "stale", "rule"];
function mt(t, e) {
  const i = new Set(e.show_severities), r = new Set(e.show_sources), s = Be(
    t.filter((c) => i.has(c.severity) && r.has(c.source)),
    e.reverse_age_sort
  ), n = hr(s, e.group_by, e.reverse_age_sort);
  let o = e.max_issues ?? Number.POSITIVE_INFINITY;
  const a = [], l = [];
  for (const c of n) {
    const d = c.issues.slice(0, o);
    o -= d.length, d.length !== 0 && (a.push({ ...c, issues: d }), l.push(...d));
  }
  return {
    matchingIssues: s,
    visibleIssues: l,
    groups: a,
    hiddenCount: s.length - l.length
  };
}
function hr(t, e, i) {
  if (e === "none")
    return [{ key: "none", label: "", total: t.length, issues: t }];
  const r = /* @__PURE__ */ new Map();
  for (const s of t) {
    const n = pr(s, e), o = r.get(n.key) ?? { label: n.label, issues: [] };
    o.issues.push(s), r.set(n.key, o);
  }
  return [...r.entries()].map(([s, n]) => ({
    key: s,
    label: n.label,
    total: n.issues.length,
    issues: Be(n.issues, i)
  })).sort((s, n) => fr(s, n, e));
}
function pr(t, e) {
  switch (e) {
    case "severity":
      return { key: t.severity, label: gt(t.severity) };
    case "area":
      return { key: t.area ?? "no-area", label: t.area ?? "No area" };
    case "source":
      return { key: t.source, label: gt(t.source) };
    case "device":
      return { key: t.deviceId ?? "no-device", label: t.deviceName ?? "No device" };
    default:
      return { key: "none", label: "" };
  }
}
function fr(t, e, i) {
  return i === "severity" ? ce(t.key) - ce(e.key) : i === "source" ? vt.indexOf(t.key) - vt.indexOf(e.key) : t.label.localeCompare(e.label, void 0, { sensitivity: "base" });
}
function gt(t) {
  return t[0].toUpperCase() + t.slice(1);
}
const _r = At`
  :host {
    display: block;
  }

  ha-card {
    overflow: hidden;
  }

  .header {
    display: grid;
    gap: 6px;
    padding: 16px 16px 12px;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }

  .title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-width: 0;
  }

  h2 {
    margin: 0;
    min-width: 0;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--primary-text-color);
    overflow-wrap: anywhere;
  }

  .total {
    flex: 0 0 auto;
    min-width: 34px;
    padding: 3px 9px;
    border-radius: 999px;
    color: var(--text-primary-color, #fff);
    background: var(--primary-color);
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
    text-align: center;
  }

  .counts {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .count-chip,
  .severity-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 24px;
    padding: 2px 8px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: 999px;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 700;
    line-height: 1.4;
    text-transform: uppercase;
  }

  .count-chip ha-icon,
  .severity-chip ha-icon {
    --mdc-icon-size: 16px;
    width: 16px;
    height: 16px;
  }

  .count-chip[data-severity="critical"],
  .severity-chip[data-severity="critical"] {
    color: var(--error-color, #db4437);
    border-color: color-mix(in srgb, var(--error-color, #db4437), transparent 55%);
  }

  .count-chip[data-severity="warning"],
  .severity-chip[data-severity="warning"] {
    color: var(--warning-color, #f4a000);
    border-color: color-mix(in srgb, var(--warning-color, #f4a000), transparent 45%);
  }

  .count-chip[data-severity="info"],
  .severity-chip[data-severity="info"] {
    color: var(--info-color, var(--primary-color));
    border-color: color-mix(in srgb, var(--info-color, var(--primary-color)), transparent 45%);
  }

  .summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    background: var(--divider-color, rgba(0, 0, 0, 0.12));
  }

  .summary-cell {
    display: grid;
    gap: 2px;
    min-width: 0;
    padding: 13px 12px;
    background: var(--ha-card-background, var(--card-background-color, #fff));
  }

  .summary-value {
    color: var(--primary-text-color);
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
  }

  .summary-label {
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 700;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .empty {
    padding: 18px 16px;
    color: var(--secondary-text-color);
  }

  .diagnostics {
    display: grid;
    gap: 4px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    color: var(--warning-color, #b26a00);
    background: color-mix(in srgb, var(--warning-color, #f4a000), transparent 92%);
    font-size: 12px;
    line-height: 1.4;
  }

  .hidden-count {
    padding: 10px 16px;
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 600;
  }

  .groups {
    display: grid;
  }

  .issue-group {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }

  .issue-group:first-child {
    border-top: 0;
  }

  .issue-group summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 42px;
    padding: 8px 16px;
    color: var(--primary-text-color);
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.025));
    cursor: pointer;
    box-sizing: border-box;
  }

  .group-heading {
    min-width: 0;
    font-size: 13px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }

  .group-count {
    flex: 0 0 auto;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 700;
  }

  .list {
    display: grid;
  }

  .issue {
    display: grid;
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }

  .issue:first-child {
    border-top: 0;
  }

  .issue-main {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 12px;
    width: 100%;
    min-height: 58px;
    padding: 12px 16px;
    border: 0;
    color: var(--primary-text-color);
    background: transparent;
    text-align: left;
    cursor: pointer;
    box-sizing: border-box;
  }

  .issue-main:focus-visible,
  .issue-action:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }

  .issue-main:hover,
  .issue-action:hover {
    background: var(--state-hover-color, rgba(0, 0, 0, 0.04));
  }

  .issue-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 0 16px 10px 52px;
  }

  .issue-action {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 30px;
    padding: 4px 8px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.18));
    border-radius: 6px;
    color: var(--primary-text-color);
    background: transparent;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }

  .issue-action ha-icon {
    --mdc-icon-size: 17px;
    width: 17px;
    height: 17px;
  }

  .entity-icon {
    align-self: start;
    margin-top: 2px;
    color: var(--secondary-text-color);
  }

  .entity-icon ha-icon {
    --mdc-icon-size: 24px;
  }

  .main {
    display: grid;
    gap: 4px;
    min-width: 0;
  }

  .issue-title {
    min-width: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .message,
  .meta {
    min-width: 0;
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 8px;
  }

  .compact .issue-main {
    min-height: 46px;
    grid-template-columns: auto minmax(0, 1fr) auto;
    padding-block: 9px;
  }

  .compact .message {
    display: none;
  }

  @media (max-width: 420px) {
    .issue {
      display: grid;
    }

    .issue-main {
      grid-template-columns: auto minmax(0, 1fr);
    }

    .severity-chip {
      grid-column: 2;
      justify-self: start;
    }

    .issue-actions {
      padding-left: 16px;
    }

    .summary {
      grid-template-columns: 1fr;
    }
  }
`, vr = At`
  :host {
    display: block;
  }

  .editor {
    display: grid;
    gap: 16px;
  }

  .section {
    display: grid;
    gap: 10px;
  }

  h3 {
    margin: 0;
    color: var(--primary-text-color);
    font-size: 15px;
    font-weight: 600;
  }

  .row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .toggles {
    display: grid;
    gap: 8px;
  }

  fieldset {
    display: grid;
    gap: 7px;
    min-width: 0;
    margin: 0;
    padding: 10px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.18));
    border-radius: 6px;
  }

  legend {
    padding: 0 4px;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--primary-text-color);
    font-size: 13px;
    font-weight: 400;
    text-transform: none;
  }

  .filter-option input {
    width: auto;
  }

  label {
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  textarea,
  select,
  input {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.18));
    border-radius: 6px;
    padding: 9px 10px;
    color: var(--primary-text-color);
    background: var(--secondary-background-color, transparent);
    font: inherit;
  }

  textarea {
    min-height: 86px;
    resize: vertical;
    font-family: var(--code-font-family, monospace);
    font-size: 13px;
  }

  .switch-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .error {
    color: var(--error-color, #db4437);
    font-size: 12px;
    line-height: 1.35;
  }

  @media (max-width: 520px) {
    .row {
      grid-template-columns: 1fr;
    }
  }
`;
var mr = Object.defineProperty, gr = Object.getOwnPropertyDescriptor, J = (t, e, i, r) => {
  for (var s = r > 1 ? void 0 : r ? gr(e, i) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (s = (r ? o(e, i, s) : o(s)) || s);
  return r && s && mr(e, i, s), s;
};
const Vt = "attention-center-card", br = "attention-center-card-editor";
let M = class extends B {
  constructor() {
    super(...arguments), this._diagnostics = [], this._presentation = {
      matchingIssues: [],
      visibleIssues: [],
      groups: [],
      hiddenCount: 0
    }, this._configKey = "", this._lastConfigKey = "", this._ruleDurationMemory = Ie(), this._nowMs = Date.now();
  }
  setConfig(t) {
    const e = de(t);
    this._config = e, this._plan = Ve(e), this._configKey = xi(e), this._lastConfigKey = "", this._lastStatesRef = void 0, this._lastEntitiesRef = void 0, this._lastDevicesRef = void 0, this._lastAreasRef = void 0, this._ruleDurationMemory = Ie(), this._presentation = mt([], e), this._diagnostics = [], this._actionError = void 0, this._recalculateIssues();
  }
  static getStubConfig() {
    return {
      title: h.title,
      detect_unavailable: !0,
      detect_batteries: !0,
      battery_warning: h.battery_warning,
      battery_critical: h.battery_critical,
      display_mode: "full",
      empty_state: "message"
    };
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ar), document.createElement(br);
  }
  getCardSize() {
    return !this._config || this._config.empty_state === "hide" && this._presentation.matchingIssues.length === 0 ? 1 : this._config.display_mode === "summary" ? 2 : Math.min(8, Math.max(2, this._presentation.visibleIssues.length + 1));
  }
  connectedCallback() {
    super.connectedCallback(), this._connectedAtMs ?? (this._connectedAtMs = Date.now()), this._startMinuteTimer(), this._recalculateIssues(!0);
  }
  disconnectedCallback() {
    this._stopMinuteTimer(), super.disconnectedCallback();
  }
  willUpdate(t) {
    t.has("hass") && this._recalculateIssues();
  }
  render() {
    if (!this._config)
      return _``;
    if (this._presentation.matchingIssues.length === 0 && this._config.empty_state === "hide")
      return v;
    const t = _t(this._presentation.matchingIssues), e = this._presentation.matchingIssues.length;
    return _`
      <ha-card>
        <div class="header">
          <div class="title-row">
            <h2>${this._config.title}</h2>
            <span class="total" aria-label="${e} active issues">${e}</span>
          </div>
          <div class="counts" aria-label="Issue counts by severity">
            ${this._renderCountChip("critical", t.critical)}
            ${this._renderCountChip("warning", t.warning)}
            ${this._renderCountChip("info", t.info)}
          </div>
        </div>
        ${this._renderDiagnostics()} ${this._renderBody()}
      </ha-card>
    `;
  }
  _renderBody() {
    if (!this._config)
      return _``;
    const t = _t(this._presentation.matchingIssues);
    return this._config.display_mode === "summary" ? _`
        <div class="summary" role="list" aria-label="Issue summary">
          ${this._renderSummaryCell("critical", t.critical)}
          ${this._renderSummaryCell("warning", t.warning)}
          ${this._renderSummaryCell("info", t.info)}
        </div>
        ${this._presentation.matchingIssues.length === 0 ? this._renderEmptyState() : v}
        ${this._renderHiddenCount()}
      ` : this._presentation.matchingIssues.length === 0 ? this._renderEmptyState() : this._config.group_by !== "none" ? _`
        <div class="groups">
          ${we(
      this._presentation.groups,
      (e) => e.key,
      (e) => this._renderGroup(e)
    )}
        </div>
        ${this._renderHiddenCount()}
      ` : _`
      <div class="list ${this._config.display_mode === "compact" ? "compact" : ""}" role="list">
        ${we(
      this._presentation.visibleIssues,
      (e) => e.id,
      (e) => this._renderIssue(e)
    )}
      </div>
      ${this._renderHiddenCount()}
    `;
  }
  _renderGroup(t) {
    if (!this._config)
      return _``;
    const e = this._config.collapsed_groups.includes(t.key) || this._config.collapsed_groups.includes(t.label);
    return _`
      <details class="issue-group" .open=${!e}>
        <summary>
          <span class="group-heading" role="heading" aria-level="3">${t.label}</span>
          <span class="group-count" aria-label="${t.total} active issues">${t.total}</span>
        </summary>
        <div class="list ${this._config.display_mode === "compact" ? "compact" : ""}" role="list">
          ${we(
      t.issues,
      (i) => i.id,
      (i) => this._renderIssue(i)
    )}
        </div>
      </details>
    `;
  }
  _renderIssue(t) {
    const e = dr(t.activeSinceMs, this._nowMs);
    return _`
      <div class="issue" role="listitem">
        <button
          class="issue-main"
          type="button"
          aria-label="${t.title}, ${t.severity}, ${t.message}, active for ${e}"
          @click=${() => this._openMoreInfo(t.entity_id)}
        >
          <span class="entity-icon" aria-hidden="true"
            ><ha-icon .icon=${t.icon}></ha-icon
          ></span>
          <span class="main">
            <span class="issue-title">${t.title}</span>
            <span class="message">${t.message}</span>
            <span class="meta">
              <span>${e}</span>
              <span>${t.state}</span>
              ${t.area ? _`<span>${t.area}</span>` : v}
            </span>
          </span>
          ${this._renderSeverityChip(t.severity)}
        </button>
        ${t.actions && t.actions.length > 0 ? _`
                <div class="issue-actions" aria-label="Actions for ${t.title}">
                  ${t.actions.map((i) => this._renderAction(t, i))}
                </div>
              ` : v}
      </div>
    `;
  }
  _renderAction(t, e) {
    const i = Tt(e);
    return _`
      <button
        class="issue-action"
        type="button"
        title=${i}
        @click=${(r) => this._handleAction(r, t, e)}
      >
        ${e.icon ? _`<ha-icon .icon=${e.icon}></ha-icon>` : v}
        <span>${i}</span>
      </button>
    `;
  }
  _renderEmptyState() {
    return _`<div class="empty">Everything looks normal</div>`;
  }
  _renderHiddenCount() {
    return this._presentation.hiddenCount === 0 ? v : _`
      <div class="hidden-count" role="status">
        ${this._presentation.hiddenCount} more
        ${this._presentation.hiddenCount === 1 ? "issue" : "issues"}
      </div>
    `;
  }
  _renderDiagnostics() {
    const t = [
      ...this._diagnostics.map((e) => e.message),
      ...this._actionError ? [this._actionError] : []
    ];
    return t.length === 0 ? v : _`
      <div class="diagnostics" role="status" aria-live="polite">
        ${t.map((e) => _`<div>${e}</div>`)}
      </div>
    `;
  }
  _renderCountChip(t, e) {
    return _`
      <span class="count-chip" data-severity=${t}>
        <ha-icon .icon=${bt(t)}></ha-icon>
        <span>${Se(t)} ${e}</span>
      </span>
    `;
  }
  _renderSeverityChip(t) {
    return _`
      <span class="severity-chip" data-severity=${t}>
        <ha-icon .icon=${bt(t)}></ha-icon>
        <span>${Se(t)}</span>
      </span>
    `;
  }
  _renderSummaryCell(t, e) {
    return _`
      <div class="summary-cell" role="listitem">
        <span class="summary-value">${e}</span>
        <span class="summary-label">${Se(t)}</span>
      </div>
    `;
  }
  _recalculateIssues(t = !1) {
    if (!this.hass || !this._plan || !t && this.hass.states === this._lastStatesRef && this.hass.entities === this._lastEntitiesRef && this.hass.devices === this._lastDevicesRef && this.hass.areas === this._lastAreasRef && this._configKey === this._lastConfigKey)
      return;
    this._nowMs = Date.now();
    const e = Fe(this.hass, this._plan, new Date(this._nowMs), {
      ruleDurationMemory: this._ruleDurationMemory,
      connectedAtMs: this._connectedAtMs
    });
    this._diagnostics = e.diagnostics, this._presentation = mt(e.issues, this._plan.config), this._lastStatesRef = this.hass.states, this._lastEntitiesRef = this.hass.entities, this._lastDevicesRef = this.hass.devices, this._lastAreasRef = this.hass.areas, this._lastConfigKey = this._configKey;
  }
  _startMinuteTimer() {
    this._minuteTimer === void 0 && (this._minuteTimer = window.setInterval(() => {
      this._nowMs = Date.now(), this._recalculateIssues(!0);
    }, 6e4));
  }
  _stopMinuteTimer() {
    this._minuteTimer !== void 0 && (window.clearInterval(this._minuteTimer), this._minuteTimer = void 0);
  }
  _openMoreInfo(t) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: !0,
        composed: !0,
        detail: { entityId: t }
      })
    );
  }
  async _handleAction(t, e, i) {
    if (t.stopPropagation(), !!this.hass) {
      this._actionError = void 0;
      try {
        await bi(this.hass, e.entity_id, i, {
          confirm: (r) => window.confirm(r),
          navigate: yi,
          openUrl: (r) => window.open(r, "_blank", "noopener,noreferrer"),
          showMoreInfo: (r) => this._openMoreInfo(r)
        });
      } catch (r) {
        this._actionError = r instanceof Error ? r.message : "The action could not be run.";
      }
    }
  }
};
M.styles = _r;
J([
  Ue({ attribute: !1 })
], M.prototype, "hass", 2);
J([
  A()
], M.prototype, "_diagnostics", 2);
J([
  A()
], M.prototype, "_presentation", 2);
J([
  A()
], M.prototype, "_actionError", 2);
J([
  A()
], M.prototype, "_nowMs", 2);
M = J([
  Mt(Vt)
], M);
function bt(t) {
  return t === "critical" ? "mdi:alert-octagon" : t === "warning" ? "mdi:alert" : "mdi:information";
}
function Se(t) {
  return t[0].toUpperCase() + t.slice(1);
}
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: Vt,
  name: "Attention Center",
  description: "Automatically surfaces unavailable, low-battery, stale, and rule-matched entities.",
  preview: !0,
  documentationURL: "https://github.com/Farleykri/ha-attention-center-card"
});
var yr = Object.defineProperty, wr = Object.getOwnPropertyDescriptor, T = (t, e, i, r) => {
  for (var s = r > 1 ? void 0 : r ? wr(e, i) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (s = (r ? o(e, i, s) : o(s)) || s);
  return r && s && yr(e, i, s), s;
};
let $ = class extends B {
  constructor() {
    super(...arguments), this._config = h, this._rulesText = "[]", this._staleRulesText = "[]";
  }
  setConfig(t) {
    const e = t.detect_unavailable ?? h.detect_unavailable;
    this._config = {
      ...h,
      ...t,
      exclude: {
        ...h.exclude,
        ...t.exclude
      },
      include: {
        ...h.include,
        ...t.include
      },
      availability: {
        ...h.availability,
        detect_unavailable: e,
        detect_unknown: e,
        ...t.availability
      }
    }, this._rulesText = yt(this._config.rules ?? []), this._staleRulesText = yt(this._config.stale_rules ?? []), this._rulesError = void 0, this._staleRulesError = void 0, this._configError = void 0;
  }
  render() {
    const t = {
      ...h.exclude,
      ...this._config.exclude
    }, e = {
      ...h.include,
      ...this._config.include
    }, i = {
      ...h.availability,
      ...this._config.availability
    };
    return _`
      <div class="editor">
        ${this._renderJsonError(this._configError)}
        <div class="section">
          <label for="title">Card title</label>
          <input
            id="title"
            .value=${this._config.title ?? h.title}
            @input=${(r) => this._setConfigValue("title", g(r))}
          />
        </div>

        <div class="section toggles">
          ${this._renderCheckbox(
      "detect_batteries",
      "Battery detection",
      this._config.detect_batteries ?? h.detect_batteries
    )}
          ${this._renderCheckbox(
      "detect_stale",
      "Global stale detection",
      this._config.detect_stale ?? h.detect_stale
    )}
          ${this._renderCheckbox(
      "reverse_age_sort",
      "Newest first within severity",
      this._config.reverse_age_sort ?? h.reverse_age_sort
    )}
        </div>

        <div class="section">
          <h3>Availability</h3>
          <div class="toggles">
            ${this._renderAvailabilityCheckbox(
      "detect_unavailable",
      "Unavailable detection",
      i.detect_unavailable
    )}
            ${this._renderAvailabilityCheckbox(
      "detect_unknown",
      "Unknown detection",
      i.detect_unknown
    )}
          </div>
          <div class="row">
            ${this._renderSeveritySelect(
      "unavailable_severity",
      "Unavailable severity",
      i.unavailable_severity
    )}
            ${this._renderSeveritySelect(
      "unknown_severity",
      "Unknown severity",
      i.unknown_severity
    )}
          </div>
          <div class="row">
            ${this._renderAvailabilityNumber(
      "unavailable_for_minutes",
      "Unavailable duration (minutes)",
      i.unavailable_for_minutes
    )}
            ${this._renderAvailabilityNumber(
      "unknown_for_minutes",
      "Unknown duration (minutes)",
      i.unknown_for_minutes
    )}
          </div>
          ${this._renderAvailabilityNumber(
      "startup_grace_minutes",
      "Startup grace (minutes)",
      i.startup_grace_minutes
    )}
        </div>

        <div class="section row">
          <div>
            <label for="battery-warning">Battery warning threshold</label>
            <input
              id="battery-warning"
              type="number"
              min="1"
              max="100"
              .value=${String(this._config.battery_warning ?? h.battery_warning)}
              @change=${(r) => this._setConfigValue("battery_warning", Ce(r))}
            />
          </div>
          <div>
            <label for="battery-critical">Battery critical threshold</label>
            <input
              id="battery-critical"
              type="number"
              min="1"
              max="100"
              .value=${String(this._config.battery_critical ?? h.battery_critical)}
              @change=${(r) => this._setConfigValue("battery_critical", Ce(r))}
            />
          </div>
        </div>

        <div class="section row">
          ${this._renderEntitySelector(
      "battery_warning_entity",
      "Dynamic battery warning entity",
      this._config.battery_warning_entity
    )}
          ${this._renderEntitySelector(
      "battery_critical_entity",
      "Dynamic battery critical entity",
      this._config.battery_critical_entity
    )}
        </div>

        <div class="section row">
          <div>
            <label for="display-mode">Display mode</label>
            <select
              id="display-mode"
              .value=${this._config.display_mode ?? h.display_mode}
              @change=${(r) => this._setConfigValue("display_mode", g(r))}
            >
              <option value="full">Full issue list</option>
              <option value="compact">Compact issue list</option>
              <option value="summary">Summary only</option>
            </select>
          </div>
          <div>
            <label for="empty-state">Empty state</label>
            <select
              id="empty-state"
              .value=${this._config.empty_state ?? h.empty_state}
              @change=${(r) => this._setConfigValue("empty_state", g(r))}
            >
              <option value="message">Show normal message</option>
              <option value="hide">Hide card</option>
            </select>
          </div>
        </div>

        <div class="section row">
          <div>
            <label for="group-by">Group by</label>
            <select
              id="group-by"
              .value=${this._config.group_by ?? h.group_by}
              @change=${(r) => this._setConfigValue("group_by", g(r))}
            >
              <option value="none">No grouping</option>
              <option value="severity">Severity</option>
              <option value="area">Area</option>
              <option value="source">Source</option>
              <option value="device">Device</option>
            </select>
          </div>
          <div>
            <label for="max-issues">Maximum issues</label>
            <input
              id="max-issues"
              type="number"
              min="1"
              .value=${this._config.max_issues === void 0 ? "" : String(this._config.max_issues)}
              @change=${(r) => this._setConfigValue("max_issues", $r(r))}
            />
          </div>
        </div>

        <div class="section row">
          <fieldset>
            <legend>Show severities</legend>
            ${["critical", "warning", "info"].map(
      (r) => this._renderArrayCheckbox(
        "show_severities",
        r,
        (this._config.show_severities ?? h.show_severities).includes(r)
      )
    )}
          </fieldset>
          <fieldset>
            <legend>Show sources</legend>
            ${["unavailable", "battery", "stale", "rule"].map(
      (r) => this._renderArrayCheckbox(
        "show_sources",
        r,
        (this._config.show_sources ?? h.show_sources).includes(r)
      )
    )}
          </fieldset>
        </div>

        <div class="section">
          <label for="collapsed-groups">Initially collapsed groups</label>
          <textarea
            id="collapsed-groups"
            .value=${H(this._config.collapsed_groups)}
            @change=${(r) => this._setConfigValue("collapsed_groups", Me(g(r)))}
          ></textarea>
        </div>

        <div class="section">
          <label for="include-labels">Included labels</label>
          <textarea
            id="include-labels"
            .value=${H(e.labels)}
            @change=${(r) => this._setIncludeLines("labels", g(r))}
          ></textarea>
        </div>

        <div class="section">
          <label for="exclude-domains">Excluded domains</label>
          <textarea
            id="exclude-domains"
            .value=${H(t.domains)}
            @change=${(r) => this._setExcludeLines("domains", g(r))}
          ></textarea>
        </div>

        <div class="section">
          <label for="exclude-entities">Excluded entities</label>
          <textarea
            id="exclude-entities"
            .value=${H(t.entities)}
            @change=${(r) => this._setExcludeLines("entities", g(r))}
          ></textarea>
        </div>

        <div class="section">
          <label for="exclude-patterns">Excluded entity patterns</label>
          <textarea
            id="exclude-patterns"
            .value=${H(t.patterns)}
            @change=${(r) => this._setExcludeLines("patterns", g(r))}
          ></textarea>
        </div>

        <div class="section">
          <label for="exclude-labels">Excluded labels</label>
          <textarea
            id="exclude-labels"
            .value=${H(t.labels)}
            @change=${(r) => this._setExcludeLines("labels", g(r))}
          ></textarea>
        </div>

        <div class="section">
          <label for="stale-rules">Stale rules JSON</label>
          <textarea
            id="stale-rules"
            .value=${this._staleRulesText}
            @input=${(r) => {
      this._setJsonText("stale_rules", g(r));
    }}
            @change=${() => this._setJsonRules("stale_rules", this._staleRulesText)}
          ></textarea>
          ${this._renderJsonError(this._staleRulesError)}
        </div>

        <div class="section">
          <label for="rules">User rules JSON</label>
          <textarea
            id="rules"
            .value=${this._rulesText}
            @input=${(r) => {
      this._setJsonText("rules", g(r));
    }}
            @change=${() => this._setJsonRules("rules", this._rulesText)}
          ></textarea>
          ${this._renderJsonError(this._rulesError)}
        </div>
      </div>
    `;
  }
  _renderCheckbox(t, e, i) {
    return _`
      <label class="switch-row">
        <span>${e}</span>
        <input
          type="checkbox"
          .checked=${i}
          @change=${(r) => this._setConfigValue(t, xe(r))}
        />
      </label>
    `;
  }
  _renderAvailabilityCheckbox(t, e, i) {
    return _`
      <label class="switch-row">
        <span>${e}</span>
        <input
          type="checkbox"
          .checked=${i}
          @change=${(r) => this._setAvailabilityValue(t, xe(r))}
        />
      </label>
    `;
  }
  _renderSeveritySelect(t, e, i) {
    return _`
      <div>
        <label>${e}</label>
        <select
          .value=${i}
          @change=${(r) => this._setAvailabilityValue(t, g(r))}
        >
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
      </div>
    `;
  }
  _renderAvailabilityNumber(t, e, i) {
    return _`
      <div>
        <label>${e}</label>
        <input
          type="number"
          min="0"
          .value=${String(i)}
          @change=${(r) => this._setAvailabilityValue(t, Ce(r))}
        />
      </div>
    `;
  }
  _renderEntitySelector(t, e, i) {
    return _`
      <div>
        <label>${e}</label>
        <ha-selector
          .hass=${this.hass}
          .selector=${{ entity: {} }}
          .value=${i}
          @value-changed=${(r) => this._setConfigValue(t, r.detail.value || void 0)}
        ></ha-selector>
      </div>
    `;
  }
  _renderArrayCheckbox(t, e, i) {
    return _`
      <label class="filter-option">
        <input
          type="checkbox"
          .checked=${i}
          @change=${(r) => this._toggleArrayValue(t, e, xe(r))}
        />
        <span>${e}</span>
      </label>
    `;
  }
  _renderJsonError(t) {
    return t ? _`<div class="error" role="alert" aria-live="polite">${t}</div>` : "";
  }
  _setConfigValue(t, e) {
    this._emitConfig({
      ...this._config,
      [t]: e
    });
  }
  _setExcludeLines(t, e) {
    this._emitConfig({
      ...this._config,
      exclude: {
        ...h.exclude,
        ...this._config.exclude,
        [t]: Me(e)
      }
    });
  }
  _setIncludeLines(t, e) {
    this._emitConfig({
      ...this._config,
      include: {
        ...h.include,
        ...this._config.include,
        [t]: Me(e)
      }
    });
  }
  _setAvailabilityValue(t, e) {
    this._emitConfig({
      ...this._config,
      availability: {
        ...h.availability,
        ...this._config.availability,
        [t]: e
      }
    });
  }
  _toggleArrayValue(t, e, i) {
    const r = new Set(this._config[t] ?? h[t]);
    i ? r.add(e) : r.delete(e), this._setConfigValue(t, [...r]);
  }
  _setJsonText(t, e) {
    t === "rules" ? (this._rulesText = e, this._rulesError = Te(e).error) : (this._staleRulesText = e, this._staleRulesError = Te(e).error);
  }
  _setJsonRules(t, e) {
    const i = Te(e);
    t === "rules" ? this._rulesError = i.error : this._staleRulesError = i.error, !i.error && this._emitConfig({
      ...this._config,
      [t]: i.value
    });
  }
  _emitConfig(t) {
    try {
      de(t);
    } catch (e) {
      this._configError = e instanceof Error ? e.message : "Invalid configuration.";
      return;
    }
    this._configError = void 0, this._config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: { config: t }
      })
    );
  }
};
$.styles = vr;
T([
  Ue({ attribute: !1 })
], $.prototype, "hass", 2);
T([
  A()
], $.prototype, "_config", 2);
T([
  A()
], $.prototype, "_rulesText", 2);
T([
  A()
], $.prototype, "_staleRulesText", 2);
T([
  A()
], $.prototype, "_rulesError", 2);
T([
  A()
], $.prototype, "_staleRulesError", 2);
T([
  A()
], $.prototype, "_configError", 2);
$ = T([
  Mt("attention-center-card-editor")
], $);
function g(t) {
  const e = t.currentTarget;
  return e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : "";
}
function xe(t) {
  const e = t.currentTarget;
  return e instanceof HTMLInputElement ? e.checked : !1;
}
function Ce(t) {
  const e = Number(g(t));
  return Number.isFinite(e) ? e : 0;
}
function $r(t) {
  const e = g(t).trim();
  return e === "" ? void 0 : Number(e);
}
function H(t) {
  return (t ?? []).join(`
`);
}
function Me(t) {
  return t.split(/\r?\n/).map((e) => e.trim()).filter(Boolean);
}
function yt(t) {
  return JSON.stringify(t, null, 2);
}
function Te(t) {
  try {
    const e = JSON.parse(t.trim() || "[]");
    return Array.isArray(e) ? { value: e } : { error: "Value must be a JSON array." };
  } catch (e) {
    return {
      error: `Invalid JSON: ${e instanceof Error ? e.message : "Unable to parse value."}`
    };
  }
}
const Ar = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get AttentionCenterCardEditor() {
    return $;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  M as AttentionCenterCard,
  $ as AttentionCenterCardEditor,
  cr as evaluateAttentionIssues,
  Mr as evaluateAttentionIssuesForConfig,
  Fe as evaluateAttentionResult,
  Tr as evaluateAttentionResultForConfig,
  mt as prepareIssuePresentation
};
//# sourceMappingURL=ha-attention-center-card.js.map
