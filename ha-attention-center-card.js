/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis, vt = Q.ShadowRoot && (Q.ShadyCSS === void 0 || Q.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, $t = Symbol(), xt = /* @__PURE__ */ new WeakMap();
let Xt = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== $t) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (vt && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = xt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && xt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ae = (e) => new Xt(typeof e == "string" ? e : e + "", void 0, $t), te = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new Xt(i, e, $t);
}, Ee = (e, t) => {
  if (vt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), r = Q.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, e.appendChild(s);
  }
}, Ct = vt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return Ae(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Se, defineProperty: xe, getOwnPropertyDescriptor: Ce, getOwnPropertyNames: Me, getOwnPropertySymbols: Te, getPrototypeOf: Re } = Object, w = globalThis, Mt = w.trustedTypes, Oe = Mt ? Mt.emptyScript : "", at = w.reactiveElementPolyfillSupport, B = (e, t) => e, tt = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Oe : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, bt = (e, t) => !Se(e, t), Tt = { attribute: !0, type: String, converter: tt, reflect: !1, useDefault: !1, hasChanged: bt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), w.litPropertyMetadata ?? (w.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let I = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Tt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, i);
      r !== void 0 && xe(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: r, set: n } = Ce(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: r, set(o) {
      const a = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(B("elementProperties"))) return;
    const t = Re(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(B("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(B("properties"))) {
      const i = this.properties, s = [...Me(i), ...Te(i)];
      for (const r of s) this.createProperty(r, i[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [s, r] of i) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const r = this._$Eu(i, s);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) i.unshift(Ct(r));
    } else t !== void 0 && i.push(Ct(t));
    return i;
  }
  static _$Eu(t, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((i) => i(this));
  }
  addController(t) {
    var i;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((i = t.hostConnected) == null || i.call(t));
  }
  removeController(t) {
    var i;
    (i = this._$EO) == null || i.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ee(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((i) => {
      var s;
      return (s = i.hostConnected) == null ? void 0 : s.call(i);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var s;
      return (s = i.hostDisconnected) == null ? void 0 : s.call(i);
    });
  }
  attributeChangedCallback(t, i, s) {
    this._$AK(t, s);
  }
  _$ET(t, i) {
    var n;
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : tt).toAttribute(i, s.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var n, o;
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const a = s.getPropertyOptions(r), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((n = a.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? a.converter : tt;
      this._$Em = r;
      const u = l.fromAttribute(i, a.type);
      this[r] = u ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, r = !1, n) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (n = this[t]), s ?? (s = a.getPropertyOptions(t)), !((s.hasChanged ?? bt)(n, i) || s.useDefault && s.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, s)))) return;
      this.C(t, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: s, reflect: r, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? i ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, o] of r) {
        const { wrapped: a } = o, l = this[n];
        a !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, o, l);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (s = this._$EO) == null || s.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(i)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var i;
    (i = this._$EO) == null || i.forEach((s) => {
      var r;
      return (r = s.hostUpdated) == null ? void 0 : r.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
I.elementStyles = [], I.shadowRootOptions = { mode: "open" }, I[B("elementProperties")] = /* @__PURE__ */ new Map(), I[B("finalized")] = /* @__PURE__ */ new Map(), at == null || at({ ReactiveElement: I }), (w.reactiveElementVersions ?? (w.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, Rt = (e) => e, et = V.trustedTypes, Ot = et ? et.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ee = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, ie = "?" + b, Pe = `<${ie}>`, M = document, J = () => M.createComment(""), K = (e) => e === null || typeof e != "object" && typeof e != "function", wt = Array.isArray, Ie = (e) => wt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", lt = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Pt = /-->/g, It = />/g, A = RegExp(`>|${lt}(?:([^\\s"'>=/]+)(${lt}*=${lt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Dt = /'/g, Nt = /"/g, re = /^(?:script|style|textarea|title)$/i, De = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), g = De(1), T = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Ut = /* @__PURE__ */ new WeakMap(), S = M.createTreeWalker(M, 129);
function se(e, t) {
  if (!wt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ot !== void 0 ? Ot.createHTML(t) : t;
}
const Ne = (e, t) => {
  const i = e.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = z;
  for (let a = 0; a < i; a++) {
    const l = e[a];
    let u, d, c = -1, p = 0;
    for (; p < l.length && (o.lastIndex = p, d = o.exec(l), d !== null); ) p = o.lastIndex, o === z ? d[1] === "!--" ? o = Pt : d[1] !== void 0 ? o = It : d[2] !== void 0 ? (re.test(d[2]) && (r = RegExp("</" + d[2], "g")), o = A) : d[3] !== void 0 && (o = A) : o === A ? d[0] === ">" ? (o = r ?? z, c = -1) : d[1] === void 0 ? c = -2 : (c = o.lastIndex - d[2].length, u = d[1], o = d[3] === void 0 ? A : d[3] === '"' ? Nt : Dt) : o === Nt || o === Dt ? o = A : o === Pt || o === It ? o = z : (o = A, r = void 0);
    const h = o === A && e[a + 1].startsWith("/>") ? " " : "";
    n += o === z ? l + Pe : c >= 0 ? (s.push(u), l.slice(0, c) + ee + l.slice(c) + b + h) : l + b + (c === -2 ? a : h);
  }
  return [se(e, n + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class q {
  constructor({ strings: t, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const a = t.length - 1, l = this.parts, [u, d] = Ne(t, i);
    if (this.el = q.createElement(u, s), S.currentNode = this.el.content, i === 2 || i === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = S.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(ee)) {
          const p = d[o++], h = r.getAttribute(c).split(b), m = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: n, name: m[2], strings: h, ctor: m[1] === "." ? ke : m[1] === "?" ? ze : m[1] === "@" ? He : it }), r.removeAttribute(c);
        } else c.startsWith(b) && (l.push({ type: 6, index: n }), r.removeAttribute(c));
        if (re.test(r.tagName)) {
          const c = r.textContent.split(b), p = c.length - 1;
          if (p > 0) {
            r.textContent = et ? et.emptyScript : "";
            for (let h = 0; h < p; h++) r.append(c[h], J()), S.nextNode(), l.push({ type: 2, index: ++n });
            r.append(c[p], J());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ie) l.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(b, c + 1)) !== -1; ) l.push({ type: 7, index: n }), c += b.length - 1;
      }
      n++;
    }
  }
  static createElement(t, i) {
    const s = M.createElement("template");
    return s.innerHTML = t, s;
  }
}
function N(e, t, i = e, s) {
  var o, a;
  if (t === T) return t;
  let r = s !== void 0 ? (o = i._$Co) == null ? void 0 : o[s] : i._$Cl;
  const n = K(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((a = r == null ? void 0 : r._$AO) == null || a.call(r, !1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, i, s)), s !== void 0 ? (i._$Co ?? (i._$Co = []))[s] = r : i._$Cl = r), r !== void 0 && (t = N(e, r._$AS(e, t.values), r, s)), t;
}
class Ue {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: s } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? M).importNode(i, !0);
    S.currentNode = r;
    let n = S.nextNode(), o = 0, a = 0, l = s[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let u;
        l.type === 2 ? u = new k(n, n.nextSibling, this, t) : l.type === 1 ? u = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (u = new je(n, this, t)), this._$AV.push(u), l = s[++a];
      }
      o !== (l == null ? void 0 : l.index) && (n = S.nextNode(), o++);
    }
    return S.currentNode = M, r;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class k {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, s, r) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = N(this, t, i), K(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== T && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ie(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== _ && K(this._$AH) ? this._$AA.nextSibling.data = t : this.T(M.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: i, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = q.createElement(se(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(i);
    else {
      const o = new Ue(r, this), a = o.u(this.options);
      o.p(i), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = Ut.get(t.strings);
    return i === void 0 && Ut.set(t.strings, i = new q(t)), i;
  }
  k(t) {
    wt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const n of t) r === i.length ? i.push(s = new k(this.O(J()), this.O(J()), this, this.options)) : s = i[r], s._$AI(n), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, i); t !== this._$AB; ) {
      const r = Rt(t).nextSibling;
      Rt(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class it {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, r, n) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = _;
  }
  _$AI(t, i = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = N(this, t, i, 0), o = !K(t) || t !== this._$AH && t !== T, o && (this._$AH = t);
    else {
      const a = t;
      let l, u;
      for (t = n[0], l = 0; l < n.length - 1; l++) u = N(this, a[s + l], i, l), u === T && (u = this._$AH[l]), o || (o = !K(u) || u !== this._$AH[l]), u === _ ? t = _ : t !== _ && (t += (u ?? "") + n[l + 1]), this._$AH[l] = u;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ke extends it {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === _ ? void 0 : t;
  }
}
class ze extends it {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class He extends it {
  constructor(t, i, s, r, n) {
    super(t, i, s, r, n), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = N(this, t, i, 0) ?? _) === T) return;
    const s = this._$AH, r = t === _ && s !== _ || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== _ && (s === _ || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class je {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    N(this, t);
  }
}
const Le = { I: k }, ct = V.litHtmlPolyfillSupport;
ct == null || ct(q, k), (V.litHtmlVersions ?? (V.litHtmlVersions = [])).push("3.3.3");
const Be = (e, t, i) => {
  const s = (i == null ? void 0 : i.renderBefore) ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = (i == null ? void 0 : i.renderBefore) ?? null;
    s._$litPart$ = r = new k(t.insertBefore(J(), n), n, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
let D = class extends I {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const t = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = t.firstChild), t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Be(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return T;
  }
};
var Qt;
D._$litElement$ = !0, D.finalized = !0, (Qt = x.litElementHydrateSupport) == null || Qt.call(x, { LitElement: D });
const ut = x.litElementPolyfillSupport;
ut == null || ut({ LitElement: D });
(x.litElementVersions ?? (x.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ne = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ve = { attribute: !0, type: String, converter: tt, reflect: !1, hasChanged: bt }, Fe = (e = Ve, t, i) => {
  const { kind: s, metadata: r } = i;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(i.name, e), s === "accessor") {
    const { name: o } = i;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, l, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, e, a), a;
    } };
  }
  if (s === "setter") {
    const { name: o } = i;
    return function(a) {
      const l = this[o];
      t.call(this, a), this.requestUpdate(o, l, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function At(e) {
  return (t, i) => typeof i == "object" ? Fe(e, t, i) : ((s, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function O(e) {
  return At({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Je = { CHILD: 2 }, Ke = (e) => (...t) => ({ _$litDirective$: e, values: t });
let qe = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, i, s) {
    this._$Ct = t, this._$AM = i, this._$Ci = s;
  }
  _$AS(t, i) {
    return this.update(t, i);
  }
  update(t, i) {
    return this.render(...i);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: We } = Le, kt = (e) => e, zt = () => document.createComment(""), H = (e, t, i) => {
  var n;
  const s = e._$AA.parentNode, r = t === void 0 ? e._$AB : t._$AA;
  if (i === void 0) {
    const o = s.insertBefore(zt(), r), a = s.insertBefore(zt(), r);
    i = new We(o, a, e, e.options);
  } else {
    const o = i._$AB.nextSibling, a = i._$AM, l = a !== e;
    if (l) {
      let u;
      (n = i._$AQ) == null || n.call(i, e), i._$AM = e, i._$AP !== void 0 && (u = e._$AU) !== a._$AU && i._$AP(u);
    }
    if (o !== r || l) {
      let u = i._$AA;
      for (; u !== o; ) {
        const d = kt(u).nextSibling;
        kt(s).insertBefore(u, r), u = d;
      }
    }
  }
  return i;
}, E = (e, t, i = e) => (e._$AI(t, i), e), Ye = {}, Ge = (e, t = Ye) => e._$AH = t, Ze = (e) => e._$AH, ht = (e) => {
  e._$AR(), e._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ht = (e, t, i) => {
  const s = /* @__PURE__ */ new Map();
  for (let r = t; r <= i; r++) s.set(e[r], r);
  return s;
}, Qe = Ke(class extends qe {
  constructor(e) {
    if (super(e), e.type !== Je.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e, t, i) {
    let s;
    i === void 0 ? i = t : t !== void 0 && (s = t);
    const r = [], n = [];
    let o = 0;
    for (const a of e) r[o] = s ? s(a, o) : o, n[o] = i(a, o), o++;
    return { values: n, keys: r };
  }
  render(e, t, i) {
    return this.dt(e, t, i).values;
  }
  update(e, [t, i, s]) {
    const r = Ze(e), { values: n, keys: o } = this.dt(t, i, s);
    if (!Array.isArray(r)) return this.ut = o, n;
    const a = this.ut ?? (this.ut = []), l = [];
    let u, d, c = 0, p = r.length - 1, h = 0, m = n.length - 1;
    for (; c <= p && h <= m; ) if (r[c] === null) c++;
    else if (r[p] === null) p--;
    else if (a[c] === o[h]) l[h] = E(r[c], n[h]), c++, h++;
    else if (a[p] === o[m]) l[m] = E(r[p], n[m]), p--, m--;
    else if (a[c] === o[m]) l[m] = E(r[c], n[m]), H(e, l[m + 1], r[c]), c++, m--;
    else if (a[p] === o[h]) l[h] = E(r[p], n[h]), H(e, r[c], r[p]), p--, h++;
    else if (u === void 0 && (u = Ht(o, h, m), d = Ht(a, c, p)), u.has(a[c])) if (u.has(a[p])) {
      const v = d.get(o[h]), ot = v !== void 0 ? r[v] : null;
      if (ot === null) {
        const St = H(e, r[c]);
        E(St, n[h]), l[h] = St;
      } else l[h] = E(ot, n[h]), H(e, r[c], ot), r[v] = null;
      h++;
    } else ht(r[p]), p--;
    else ht(r[c]), c++;
    for (; h <= m; ) {
      const v = H(e, l[m + 1]);
      E(v, n[h]), l[h++] = v;
    }
    for (; c <= p; ) {
      const v = r[c++];
      v !== null && ht(v);
    }
    return this.ut = o, Ge(e, l), T;
  }
}), oe = "Attention Center", ae = 30, le = 15, ce = 24, Xe = /* @__PURE__ */ new Set(["critical", "warning", "info"]), ti = /* @__PURE__ */ new Set(["full", "compact", "summary"]), ei = /* @__PURE__ */ new Set(["message", "hide"]), f = {
  title: oe,
  detect_unavailable: !0,
  detect_batteries: !0,
  detect_stale: !1,
  stale_hours: ce,
  battery_warning: ae,
  battery_critical: le,
  battery_thresholds: {},
  display_mode: "full",
  empty_state: "message",
  reverse_age_sort: !1,
  exclude: {
    domains: [],
    entities: [],
    devices: [],
    areas: [],
    patterns: []
  },
  stale_rules: [],
  rules: []
};
function ii(e) {
  return typeof e == "string" && Xe.has(e);
}
function ue(e) {
  if (!W(e))
    throw new Error("Attention Center Card configuration must be an object.");
  const t = e, i = de(t.title, "title") ?? oe, s = jt(
    t.battery_warning,
    "battery_warning",
    ae
  ), r = jt(
    t.battery_critical,
    "battery_critical",
    le
  );
  if (r >= s)
    throw new Error("battery_critical must be lower than battery_warning.");
  const n = Lt(
    t.display_mode,
    "display_mode",
    ti,
    f.display_mode
  ), o = Lt(
    t.empty_state,
    "empty_state",
    ei,
    f.empty_state
  );
  return {
    ...t,
    title: i,
    detect_unavailable: Y(
      t.detect_unavailable,
      "detect_unavailable",
      f.detect_unavailable
    ),
    detect_batteries: Y(
      t.detect_batteries,
      "detect_batteries",
      f.detect_batteries
    ),
    detect_stale: Y(
      t.detect_stale,
      "detect_stale",
      f.detect_stale
    ),
    stale_hours: Et(t.stale_hours, "stale_hours", ce),
    battery_warning: s,
    battery_critical: r,
    battery_thresholds: ai(
      t.battery_thresholds,
      s,
      r
    ),
    display_mode: n,
    empty_state: o,
    reverse_age_sort: Y(
      t.reverse_age_sort,
      "reverse_age_sort",
      f.reverse_age_sort
    ),
    exclude: si(t.exclude),
    stale_rules: oi(t.stale_rules),
    rules: ni(t.rules)
  };
}
function ri(e) {
  return JSON.stringify(e);
}
function si(e) {
  return {
    domains: j(e == null ? void 0 : e.domains, "exclude.domains"),
    entities: j(e == null ? void 0 : e.entities, "exclude.entities"),
    devices: j(e == null ? void 0 : e.devices, "exclude.devices"),
    areas: j(e == null ? void 0 : e.areas, "exclude.areas"),
    patterns: j(e == null ? void 0 : e.patterns, "exclude.patterns")
  };
}
function ni(e) {
  if (e === void 0)
    return [];
  if (!Array.isArray(e))
    throw new Error("rules must be a list.");
  return e.map((t, i) => {
    if (!W(t))
      throw new Error(`rules[${i}] must be an object.`);
    const s = he(t.entity_id, `rules[${i}].entity_id`), r = pe(t.severity, `rules[${i}].severity`, "warning");
    if (t.attribute !== void 0 && typeof t.attribute != "string")
      throw new Error(`rules[${i}].attribute must be a string.`);
    if (t.title !== void 0 && typeof t.title != "string")
      throw new Error(`rules[${i}].title must be a string.`);
    if (t.above !== void 0 && !C(t.above))
      throw new Error(`rules[${i}].above must be a number.`);
    if (t.below !== void 0 && !C(t.below))
      throw new Error(`rules[${i}].below must be a number.`);
    if (t.for_minutes !== void 0 && (!C(t.for_minutes) || t.for_minutes < 0))
      throw new Error(`rules[${i}].for_minutes must be zero or greater.`);
    if (!(t.state !== void 0 || t.not_state !== void 0 || t.above !== void 0 || t.below !== void 0))
      throw new Error(`rules[${i}] must define state, not_state, above, or below.`);
    return {
      ...t,
      entity_id: s,
      severity: r
    };
  });
}
function oi(e) {
  if (e === void 0)
    return [];
  if (!Array.isArray(e))
    throw new Error("stale_rules must be a list.");
  return e.map((t, i) => {
    if (!W(t))
      throw new Error(`stale_rules[${i}] must be an object.`);
    return {
      ...t,
      entity_id: he(t.entity_id, `stale_rules[${i}].entity_id`),
      hours: Et(t.hours, `stale_rules[${i}].hours`),
      severity: pe(t.severity, `stale_rules[${i}].severity`, "warning"),
      title: de(t.title, `stale_rules[${i}].title`)
    };
  });
}
function ai(e, t, i) {
  if (e === void 0)
    return {};
  if (!W(e))
    throw new Error("battery_thresholds must be an object.");
  const s = {};
  for (const [r, n] of Object.entries(e)) {
    if (typeof n == "number") {
      if (!C(n) || n <= 0)
        throw new Error(`battery_thresholds.${r} must be a positive number.`);
      Bt(n, i, `battery_thresholds.${r}`), s[r] = n;
      continue;
    }
    if (!W(n))
      throw new Error(`battery_thresholds.${r} must be a number or object.`);
    const o = n.warning, a = n.critical;
    if (o !== void 0 && (!C(o) || o <= 0))
      throw new Error(`battery_thresholds.${r}.warning must be a positive number.`);
    if (a !== void 0 && (!C(a) || a <= 0))
      throw new Error(`battery_thresholds.${r}.critical must be a positive number.`);
    if (o !== void 0 && a !== void 0 && a >= o)
      throw new Error(
        `battery_thresholds.${r}.critical must be lower than warning when both are set.`
      );
    Bt(
      o ?? t,
      a ?? i,
      `battery_thresholds.${r}`
    ), s[r] = { warning: o, critical: a };
  }
  return s;
}
function j(e, t) {
  if (e === void 0)
    return [];
  if (!Array.isArray(e) || e.some((i) => typeof i != "string"))
    throw new Error(`${t} must be a list of strings.`);
  return e.map((i) => i.trim()).filter(Boolean);
}
function he(e, t) {
  if (typeof e != "string" || e.trim().length === 0)
    throw new Error(`${t} must be a non-empty string.`);
  return e.trim();
}
function de(e, t) {
  if (e !== void 0) {
    if (typeof e != "string")
      throw new Error(`${t} must be a string.`);
    return e.trim();
  }
}
function jt(e, t, i) {
  return e === void 0 ? i : Et(e, t);
}
function Y(e, t, i) {
  if (e === void 0)
    return i;
  if (typeof e != "boolean")
    throw new Error(`${t} must be a boolean.`);
  return e;
}
function Et(e, t, i) {
  if (e === void 0 && i !== void 0)
    return i;
  if (!C(e) || e <= 0)
    throw new Error(`${t} must be a positive number.`);
  return e;
}
function pe(e, t, i) {
  if (e === void 0)
    return i;
  if (!ii(e))
    throw new Error(`${t} must be one of critical, warning, or info.`);
  return e;
}
function Lt(e, t, i, s) {
  if (e === void 0)
    return s;
  if (typeof e != "string" || !i.has(e))
    throw new Error(`${t} is not supported.`);
  return e;
}
function W(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function C(e) {
  return typeof e == "number" && Number.isFinite(e);
}
function Bt(e, t, i) {
  if (t >= e)
    throw new Error(`${i}.critical must resolve lower than warning.`);
}
const li = {
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
function fe(e) {
  var t;
  return ((t = e.split(".", 1)[0]) == null ? void 0 : t.toLowerCase()) ?? "";
}
function ci(e) {
  return e === "unavailable" || e === "unknown";
}
function mt(e) {
  if (typeof e == "number" && Number.isFinite(e))
    return e;
  if (typeof e != "string")
    return;
  const t = e.trim();
  if (t.length === 0 || t === "unknown" || t === "unavailable")
    return;
  const i = Number(t);
  return Number.isFinite(i) ? i : void 0;
}
function R(e) {
  if (!e)
    return;
  const t = Date.parse(e);
  return Number.isFinite(t) ? t : void 0;
}
function ui(e, t) {
  var r;
  const i = e.states[t], s = (r = e.entities) == null ? void 0 : r[t];
  return F(i == null ? void 0 : i.attributes.friendly_name) ?? F(s == null ? void 0 : s.name) ?? F(s == null ? void 0 : s.original_name) ?? t;
}
function hi(e, t, i, s) {
  var a;
  const r = e.states[t], n = (a = e.entities) == null ? void 0 : a[t], o = F(r == null ? void 0 : r.attributes.icon) ?? F(n == null ? void 0 : n.icon);
  return o || (s === "battery" ? i === "critical" ? "mdi:battery-alert" : "mdi:battery-low" : i === "critical" ? "mdi:alert-octagon" : i === "warning" ? "mdi:alert" : li[fe(t)] ?? "mdi:information-outline");
}
function di(e, t) {
  const i = _e(e, t);
  for (const s of i) {
    const r = ge(e, s);
    if (r != null && r.name)
      return r.name;
  }
  return i[0];
}
function _e(e, t) {
  var l;
  const i = /* @__PURE__ */ new Set(), s = (l = e.entities) == null ? void 0 : l[t];
  G(i, s == null ? void 0 : s.area_id);
  const r = me(e, t), n = r ? pi(e, r) : void 0;
  G(i, n == null ? void 0 : n.area_id);
  const o = e.states[t], a = o == null ? void 0 : o.attributes.area;
  typeof a == "string" && G(i, a);
  for (const u of [...i]) {
    const d = ge(e, u);
    G(i, d == null ? void 0 : d.name);
  }
  return [...i];
}
function me(e, t) {
  var r, n;
  const i = (r = e.entities) == null ? void 0 : r[t];
  if (i != null && i.device_id)
    return i.device_id;
  const s = (n = e.states[t]) == null ? void 0 : n.attributes.device_id;
  return typeof s == "string" ? s : void 0;
}
function rt(e) {
  const t = e.hass.states[e.entityId], i = e.activeSinceMs ?? R(t == null ? void 0 : t.last_changed) ?? R(t == null ? void 0 : t.last_updated) ?? Date.now();
  return {
    id: e.id,
    entity_id: e.entityId,
    severity: e.severity,
    title: e.title ?? ui(e.hass, e.entityId),
    message: e.message,
    state: (t == null ? void 0 : t.state) ?? "missing",
    activeSinceMs: i,
    area: di(e.hass, e.entityId),
    icon: hi(e.hass, e.entityId, e.severity, e.source),
    source: e.source
  };
}
function ge(e, t) {
  var s;
  const i = (s = e.areas) == null ? void 0 : s[t];
  return i || Object.values(e.areas ?? {}).find(
    (r) => r.area_id === t || r.id === t || r.name === t
  );
}
function pi(e, t) {
  var s;
  const i = (s = e.devices) == null ? void 0 : s[t];
  return i || Object.values(e.devices ?? {}).find(
    (r) => r.id === t || r.name === t || r.name_by_user === t
  );
}
function F(e) {
  return typeof e == "string" && e.trim().length > 0 ? e.trim() : void 0;
}
function G(e, t) {
  t && t.trim().length > 0 && e.add(t);
}
function gt(e) {
  const t = e.trim(), i = t.includes("*") || t.includes("?");
  return {
    pattern: t,
    wildcard: i,
    regex: i ? _i(t) : void 0
  };
}
function ye(e, t) {
  var i;
  return t.wildcard ? ((i = t.regex) == null ? void 0 : i.test(e)) ?? !1 : e === t.pattern;
}
function ve(e, t) {
  return t.wildcard ? Object.keys(e.states).filter((i) => ye(i, t)) : e.states[t.pattern] ? [t.pattern] : [];
}
function fi(e) {
  return {
    domains: new Set(e.domains.map((t) => t.toLowerCase())),
    entities: new Set(e.entities),
    devices: new Set(e.devices),
    areas: new Set(e.areas),
    areaNames: new Set(e.areas.map((t) => t.toLowerCase())),
    patterns: e.patterns.map(gt)
  };
}
function st(e, t, i) {
  if (i.entities.has(e) || i.domains.has(fe(e)) || i.patterns.some((n) => ye(e, n)))
    return !0;
  const s = me(t, e);
  return s && i.devices.has(s) ? !0 : _e(t, e).some(
    (n) => i.areas.has(n) || i.areaNames.has(n.toLowerCase())
  );
}
function _i(e) {
  let t = "^";
  for (const i of e)
    i === "*" ? t += ".*" : i === "?" ? t += "." : t += mi(i);
  return t += "$", new RegExp(t, "i");
}
function mi(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const Vt = [
  /(^|[._-])battery($|[._-])/i,
  /(^|[._-])battery_level($|[._-])/i,
  /(^|[._-])battery_percent(age)?($|[._-])/i,
  /(^|[._-])battery_percentage($|[._-])/i,
  /(^|[._-])low_battery($|[._-])/i
];
function gi(e) {
  const { config: t, exclusions: i } = e.plan;
  if (!t.detect_batteries)
    return [];
  const s = [];
  for (const [r, n] of Object.entries(e.hass.states)) {
    if (!yi(r, n) || st(r, e.hass, i))
      continue;
    const o = mt(n.state);
    if (o === void 0)
      continue;
    const a = vi(e, r), l = $i(o, a);
    if (!l)
      continue;
    const u = l === "critical" ? a.critical : a.warning;
    s.push(
      rt({
        hass: e.hass,
        entityId: r,
        severity: l,
        message: `Battery is ${bi(o)}% (${l} below ${u}%)`,
        activeSinceMs: R(n.last_changed),
        source: "battery",
        id: `battery:${r}`
      })
    );
  }
  return s;
}
function yi(e, t) {
  const i = t.attributes.device_class, s = t.attributes.unit_of_measurement;
  return i === "battery" || typeof s == "string" && s.trim() === "%" && Vt.some((r) => r.test(e)) ? !0 : Vt.some((r) => r.test(e));
}
function vi(e, t) {
  const i = e.plan.config.battery_thresholds[t];
  return i === void 0 ? {
    warning: e.plan.config.battery_warning,
    critical: e.plan.config.battery_critical
  } : typeof i == "number" ? {
    warning: i,
    critical: Math.min(e.plan.config.battery_critical, i)
  } : {
    warning: i.warning ?? e.plan.config.battery_warning,
    critical: i.critical ?? e.plan.config.battery_critical
  };
}
function $i(e, t) {
  if (e < t.critical)
    return "critical";
  if (e < t.warning)
    return "warning";
}
function bi(e) {
  return Number.isInteger(e) ? String(e) : e.toFixed(1);
}
const wi = 3600 * 1e3;
function Ai(e) {
  const t = [], i = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set();
  for (const r of e.plan.staleRules) {
    const n = ve(e.hass, r.matcher);
    for (const o of n)
      s.add(o), Ft(e, o, r.rule, t, i);
  }
  if (e.plan.config.detect_stale)
    for (const r of Object.keys(e.hass.states))
      s.has(r) || Ft(
        e,
        r,
        {
          hours: e.plan.config.stale_hours,
          severity: "warning"
        },
        t,
        i
      );
  return t;
}
function Ft(e, t, i, s, r) {
  if (r.has(t) || st(t, e.hass, e.plan.exclusions))
    return;
  const n = e.hass.states[t];
  if (!n)
    return;
  const o = R(n.last_updated) ?? R(n.last_changed);
  if (o === void 0)
    return;
  const a = i.hours * wi, l = o + a;
  e.now.getTime() < l || (r.add(t), s.push(
    rt({
      hass: e.hass,
      entityId: t,
      severity: i.severity ?? "warning",
      title: i.title,
      message: `No update for ${Ei(i.hours)}`,
      activeSinceMs: l,
      source: "stale",
      id: `stale:${t}`
    })
  ));
}
function Ei(e) {
  return Number.isInteger(e) ? `${e}h` : `${e.toFixed(1)}h`;
}
function Si(e) {
  const { config: t, exclusions: i } = e.plan;
  if (!t.detect_unavailable)
    return [];
  const s = [];
  for (const [r, n] of Object.entries(e.hass.states)) {
    if (!ci(n.state) || st(r, e.hass, i))
      continue;
    const o = n.state === "unknown" ? "unknown" : "unavailable";
    s.push(
      rt({
        hass: e.hass,
        entityId: r,
        severity: "warning",
        message: `State is ${o}`,
        activeSinceMs: R(n.last_changed),
        source: "unavailable",
        id: `unavailable:${r}`
      })
    );
  }
  return s;
}
const xi = 60 * 1e3;
function Ci(e) {
  const t = [], i = /* @__PURE__ */ new Set();
  for (const s of e.plan.userRules) {
    const r = ve(e.hass, s.matcher);
    for (const n of r) {
      const o = Pi(s.index, n);
      if (i.add(o), st(n, e.hass, e.plan.exclusions)) {
        e.ruleDurationMemory.firstMatchedAtMs.delete(o);
        continue;
      }
      const a = e.hass.states[n];
      if (!a) {
        e.ruleDurationMemory.firstMatchedAtMs.delete(o);
        continue;
      }
      const l = Mi(
        s.rule,
        a,
        e.now.getTime(),
        e.ruleDurationMemory,
        o
      );
      l.matched && t.push(
        rt({
          hass: e.hass,
          entityId: n,
          severity: s.rule.severity ?? "warning",
          title: s.rule.title,
          message: l.message,
          activeSinceMs: l.activeSinceMs,
          source: "rule",
          id: `rule:${s.index}:${n}`
        })
      );
    }
  }
  for (const s of e.ruleDurationMemory.firstMatchedAtMs.keys())
    i.has(s) || e.ruleDurationMemory.firstMatchedAtMs.delete(s);
  return t;
}
function Mi(e, t, i, s, r) {
  const n = Ti(e, t);
  if (!n.matched)
    return s.firstMatchedAtMs.delete(r), { matched: !1 };
  const o = s.firstMatchedAtMs.get(r) ?? Oi(e, t, i);
  s.firstMatchedAtMs.set(r, o);
  const a = (e.for_minutes ?? 0) * xi, l = o + a;
  return a > 0 && i < l ? { matched: !1 } : {
    matched: !0,
    message: n.message,
    activeSinceMs: l
  };
}
function Ti(e, t) {
  const i = Ri(e, t), s = [];
  if (e.state !== void 0) {
    if (!Jt(i, e.state))
      return { matched: !1 };
    s.push(`${Z(e)} is ${String(e.state)}`);
  }
  if (e.not_state !== void 0) {
    if (Jt(i, e.not_state))
      return { matched: !1 };
    s.push(`${Z(e)} is not ${String(e.not_state)}`);
  }
  if (e.above !== void 0) {
    const r = mt(i);
    if (r === void 0 || r <= e.above)
      return { matched: !1 };
    s.push(`${Z(e)} ${Kt(r)} is above ${e.above}`);
  }
  if (e.below !== void 0) {
    const r = mt(i);
    if (r === void 0 || r >= e.below)
      return { matched: !1 };
    s.push(`${Z(e)} ${Kt(r)} is below ${e.below}`);
  }
  return {
    matched: !0,
    message: s.length > 0 ? s.join("; ") : "Rule matched"
  };
}
function Ri(e, t) {
  return e.attribute ? t.attributes[e.attribute] : t.state;
}
function Oi(e, t, i) {
  return e.attribute === void 0 && e.above === void 0 && e.below === void 0 && (e.state !== void 0 || e.not_state !== void 0) ? R(t.last_changed) ?? i : i;
}
function Jt(e, t) {
  return String(e) === String(t);
}
function Z(e) {
  return e.attribute ? `Attribute ${e.attribute}` : "State";
}
function Kt(e) {
  return Number.isInteger(e) ? String(e) : e.toFixed(1);
}
function Pi(e, t) {
  return `rule:${e}:${t}`;
}
const Ii = {
  critical: 0,
  warning: 1,
  info: 2
};
function qt(e) {
  return Ii[e];
}
function Di(e, t = !1) {
  return [...e].sort((i, s) => {
    const r = qt(i.severity) - qt(s.severity);
    if (r !== 0)
      return r;
    const n = i.activeSinceMs - s.activeSinceMs;
    return n !== 0 ? t ? -n : n : i.id.localeCompare(s.id);
  });
}
function Wt(e) {
  return {
    critical: e.filter((t) => t.severity === "critical").length,
    warning: e.filter((t) => t.severity === "warning").length,
    info: e.filter((t) => t.severity === "info").length
  };
}
function $e(e) {
  return {
    config: e,
    exclusions: fi(e.exclude),
    userRules: e.rules.map((t, i) => ({
      rule: t,
      matcher: gt(t.entity_id),
      index: i
    })),
    staleRules: e.stale_rules.map((t, i) => ({
      rule: t,
      matcher: gt(t.entity_id),
      index: i
    }))
  };
}
function yt() {
  return {
    firstMatchedAtMs: /* @__PURE__ */ new Map()
  };
}
function be(e, t, i = /* @__PURE__ */ new Date(), s = {}) {
  const r = {
    hass: e,
    plan: t,
    now: i,
    ruleDurationMemory: s.ruleDurationMemory ?? yt()
  }, n = [
    ...Si(r),
    ...gi(r),
    ...Ai(r),
    ...Ci(r)
  ];
  return Di(Ni(n), t.config.reverse_age_sort);
}
function Zi(e, t, i = /* @__PURE__ */ new Date(), s = {}) {
  const r = ue(t);
  return be(e, $e(r), i, s);
}
function Ni(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.set(i.id, i);
  return [...t.values()];
}
const X = 60 * 1e3, L = 60 * X, dt = 24 * L;
function Ui(e, t = Date.now()) {
  const i = Math.max(0, t - e);
  if (i < X)
    return "<1m";
  if (i < L)
    return `${Math.floor(i / X)}m`;
  if (i < dt) {
    const n = Math.floor(i / L), o = Math.floor(i % L / X);
    return o > 0 ? `${n}h ${o}m` : `${n}h`;
  }
  const s = Math.floor(i / dt), r = Math.floor(i % dt / L);
  return r > 0 ? `${s}d ${r}h` : `${s}d`;
}
const ki = te`
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

  .list {
    display: grid;
  }

  .issue {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 12px;
    width: 100%;
    min-height: 58px;
    padding: 12px 16px;
    border: 0;
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    color: var(--primary-text-color);
    background: transparent;
    text-align: left;
    cursor: pointer;
    box-sizing: border-box;
  }

  .issue:first-child {
    border-top: 0;
  }

  .issue:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }

  .issue:hover {
    background: var(--state-hover-color, rgba(0, 0, 0, 0.04));
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

  .compact .issue {
    min-height: 46px;
    grid-template-columns: auto minmax(0, 1fr) auto;
    padding-block: 9px;
  }

  .compact .message {
    display: none;
  }

  @media (max-width: 420px) {
    .issue {
      grid-template-columns: auto minmax(0, 1fr);
    }

    .severity-chip {
      grid-column: 2;
      justify-self: start;
    }

    .summary {
      grid-template-columns: 1fr;
    }
  }
`, zi = te`
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

  .row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .toggles {
    display: grid;
    gap: 8px;
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
var Hi = Object.defineProperty, ji = Object.getOwnPropertyDescriptor, nt = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ji(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && Hi(t, i, r), r;
};
const we = "attention-center-card", Li = "attention-center-card-editor";
let U = class extends D {
  constructor() {
    super(...arguments), this._issues = [], this._configKey = "", this._lastConfigKey = "", this._ruleDurationMemory = yt(), this._nowMs = Date.now();
  }
  setConfig(e) {
    const t = ue(e);
    this._config = t, this._plan = $e(t), this._configKey = ri(t), this._lastConfigKey = "", this._lastStatesRef = void 0, this._lastEntitiesRef = void 0, this._lastDevicesRef = void 0, this._lastAreasRef = void 0, this._ruleDurationMemory = yt(), this._recalculateIssues();
  }
  static getStubConfig() {
    return {
      title: f.title,
      detect_unavailable: !0,
      detect_batteries: !0,
      battery_warning: f.battery_warning,
      battery_critical: f.battery_critical,
      display_mode: "full",
      empty_state: "message"
    };
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ki), document.createElement(Li);
  }
  getCardSize() {
    return !this._config || this._config.empty_state === "hide" && this._issues.length === 0 ? 1 : this._config.display_mode === "summary" ? 2 : Math.min(6, Math.max(2, this._issues.length + 1));
  }
  connectedCallback() {
    super.connectedCallback(), this._startMinuteTimer();
  }
  disconnectedCallback() {
    this._stopMinuteTimer(), super.disconnectedCallback();
  }
  willUpdate(e) {
    e.has("hass") && this._recalculateIssues();
  }
  render() {
    if (!this._config)
      return g``;
    if (this._issues.length === 0 && this._config.empty_state === "hide")
      return _;
    const e = Wt(this._issues), t = this._issues.length;
    return g`
      <ha-card>
        <div class="header">
          <div class="title-row">
            <h2>${this._config.title}</h2>
            <span class="total" aria-label="${t} active issues">${t}</span>
          </div>
          <div class="counts" aria-label="Issue counts by severity">
            ${this._renderCountChip("critical", e.critical)}
            ${this._renderCountChip("warning", e.warning)}
            ${this._renderCountChip("info", e.info)}
          </div>
        </div>
        ${this._renderBody()}
      </ha-card>
    `;
  }
  _renderBody() {
    if (!this._config)
      return g``;
    const e = Wt(this._issues);
    return this._config.display_mode === "summary" ? g`
        <div class="summary" role="list" aria-label="Issue summary">
          ${this._renderSummaryCell("critical", e.critical)}
          ${this._renderSummaryCell("warning", e.warning)}
          ${this._renderSummaryCell("info", e.info)}
        </div>
        ${this._issues.length === 0 ? this._renderEmptyState() : _}
      ` : this._issues.length === 0 ? this._renderEmptyState() : g`
      <div class="list ${this._config.display_mode === "compact" ? "compact" : ""}" role="list">
        ${Qe(
      this._issues,
      (t) => t.id,
      (t) => this._renderIssue(t)
    )}
      </div>
    `;
  }
  _renderIssue(e) {
    const t = Ui(e.activeSinceMs, this._nowMs);
    return g`
      <button
        class="issue"
        role="listitem"
        type="button"
        aria-label="${e.title}, ${e.severity}, ${e.message}, active for ${t}"
        @click=${() => this._openMoreInfo(e.entity_id)}
        @keydown=${(i) => this._handleIssueKeydown(i, e.entity_id)}
      >
        <span class="entity-icon" aria-hidden="true"><ha-icon .icon=${e.icon}></ha-icon></span>
        <span class="main">
          <span class="issue-title">${e.title}</span>
          <span class="message">${e.message}</span>
          <span class="meta">
            <span>${t}</span>
            <span>${e.state}</span>
            ${e.area ? g`<span>${e.area}</span>` : _}
          </span>
        </span>
        ${this._renderSeverityChip(e.severity)}
      </button>
    `;
  }
  _renderEmptyState() {
    return g`<div class="empty">Everything looks normal</div>`;
  }
  _renderCountChip(e, t) {
    return g`
      <span class="count-chip" data-severity=${e}>
        <ha-icon .icon=${Yt(e)}></ha-icon>
        <span>${pt(e)} ${t}</span>
      </span>
    `;
  }
  _renderSeverityChip(e) {
    return g`
      <span class="severity-chip" data-severity=${e}>
        <ha-icon .icon=${Yt(e)}></ha-icon>
        <span>${pt(e)}</span>
      </span>
    `;
  }
  _renderSummaryCell(e, t) {
    return g`
      <div class="summary-cell" role="listitem">
        <span class="summary-value">${t}</span>
        <span class="summary-label">${pt(e)}</span>
      </div>
    `;
  }
  _recalculateIssues(e = !1) {
    !this.hass || !this._plan || !e && this.hass.states === this._lastStatesRef && this.hass.entities === this._lastEntitiesRef && this.hass.devices === this._lastDevicesRef && this.hass.areas === this._lastAreasRef && this._configKey === this._lastConfigKey || (this._nowMs = Date.now(), this._issues = be(this.hass, this._plan, new Date(this._nowMs), {
      ruleDurationMemory: this._ruleDurationMemory
    }), this._lastStatesRef = this.hass.states, this._lastEntitiesRef = this.hass.entities, this._lastDevicesRef = this.hass.devices, this._lastAreasRef = this.hass.areas, this._lastConfigKey = this._configKey);
  }
  _startMinuteTimer() {
    this._minuteTimer === void 0 && (this._minuteTimer = window.setInterval(() => {
      this._nowMs = Date.now(), this._recalculateIssues(!0);
    }, 6e4));
  }
  _stopMinuteTimer() {
    this._minuteTimer !== void 0 && (window.clearInterval(this._minuteTimer), this._minuteTimer = void 0);
  }
  _openMoreInfo(e) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: !0,
        composed: !0,
        detail: { entityId: e }
      })
    );
  }
  _handleIssueKeydown(e, t) {
    e.key !== "Enter" && e.key !== " " || (e.preventDefault(), this._openMoreInfo(t));
  }
};
U.styles = ki;
nt([
  At({ attribute: !1 })
], U.prototype, "hass", 2);
nt([
  O()
], U.prototype, "_issues", 2);
nt([
  O()
], U.prototype, "_nowMs", 2);
U = nt([
  ne(we)
], U);
function Yt(e) {
  return e === "critical" ? "mdi:alert-octagon" : e === "warning" ? "mdi:alert" : "mdi:information";
}
function pt(e) {
  return e[0].toUpperCase() + e.slice(1);
}
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: we,
  name: "Attention Center",
  description: "Automatically surfaces unavailable, low-battery, stale, and rule-matched entities.",
  preview: !0,
  documentationURL: "https://github.com/Farleykri/ha-attention-center-card"
});
var Bi = Object.defineProperty, Vi = Object.getOwnPropertyDescriptor, P = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Vi(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && Bi(t, i, r), r;
};
let y = class extends D {
  constructor() {
    super(...arguments), this._config = f, this._rulesText = "[]", this._staleRulesText = "[]";
  }
  setConfig(e) {
    this._config = {
      ...f,
      ...e,
      exclude: {
        ...f.exclude,
        ...e.exclude
      }
    }, this._rulesText = Zt(this._config.rules ?? []), this._staleRulesText = Zt(this._config.stale_rules ?? []), this._rulesError = void 0, this._staleRulesError = void 0;
  }
  render() {
    const e = {
      ...f.exclude,
      ...this._config.exclude
    };
    return g`
      <div class="editor">
        <div class="section">
          <label for="title">Card title</label>
          <input
            id="title"
            .value=${this._config.title ?? f.title}
            @input=${(t) => this._setConfigValue("title", $(t))}
          />
        </div>

        <div class="section toggles">
          ${this._renderCheckbox(
      "detect_unavailable",
      "Unavailable detection",
      this._config.detect_unavailable ?? f.detect_unavailable
    )}
          ${this._renderCheckbox(
      "detect_batteries",
      "Battery detection",
      this._config.detect_batteries ?? f.detect_batteries
    )}
          ${this._renderCheckbox(
      "detect_stale",
      "Global stale detection",
      this._config.detect_stale ?? f.detect_stale
    )}
          ${this._renderCheckbox(
      "reverse_age_sort",
      "Newest first within severity",
      this._config.reverse_age_sort ?? f.reverse_age_sort
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
              .value=${String(this._config.battery_warning ?? f.battery_warning)}
              @change=${(t) => this._setConfigValue("battery_warning", Gt(t))}
            />
          </div>
          <div>
            <label for="battery-critical">Battery critical threshold</label>
            <input
              id="battery-critical"
              type="number"
              min="1"
              max="100"
              .value=${String(this._config.battery_critical ?? f.battery_critical)}
              @change=${(t) => this._setConfigValue("battery_critical", Gt(t))}
            />
          </div>
        </div>

        <div class="section row">
          <div>
            <label for="display-mode">Display mode</label>
            <select
              id="display-mode"
              .value=${this._config.display_mode ?? f.display_mode}
              @change=${(t) => this._setConfigValue("display_mode", $(t))}
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
              .value=${this._config.empty_state ?? f.empty_state}
              @change=${(t) => this._setConfigValue("empty_state", $(t))}
            >
              <option value="message">Show normal message</option>
              <option value="hide">Hide card</option>
            </select>
          </div>
        </div>

        <div class="section">
          <label for="exclude-domains">Excluded domains</label>
          <textarea
            id="exclude-domains"
            .value=${ft(e.domains)}
            @change=${(t) => this._setExcludeLines("domains", $(t))}
          ></textarea>
        </div>

        <div class="section">
          <label for="exclude-entities">Excluded entities</label>
          <textarea
            id="exclude-entities"
            .value=${ft(e.entities)}
            @change=${(t) => this._setExcludeLines("entities", $(t))}
          ></textarea>
        </div>

        <div class="section">
          <label for="exclude-patterns">Excluded entity patterns</label>
          <textarea
            id="exclude-patterns"
            .value=${ft(e.patterns)}
            @change=${(t) => this._setExcludeLines("patterns", $(t))}
          ></textarea>
        </div>

        <div class="section">
          <label for="stale-rules">Stale rules JSON</label>
          <textarea
            id="stale-rules"
            .value=${this._staleRulesText}
            @input=${(t) => {
      this._setJsonText("stale_rules", $(t));
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
            @input=${(t) => {
      this._setJsonText("rules", $(t));
    }}
            @change=${() => this._setJsonRules("rules", this._rulesText)}
          ></textarea>
          ${this._renderJsonError(this._rulesError)}
        </div>
      </div>
    `;
  }
  _renderCheckbox(e, t, i) {
    return g`
      <label class="switch-row">
        <span>${t}</span>
        <input
          type="checkbox"
          .checked=${i}
          @change=${(s) => this._setConfigValue(e, Fi(s))}
        />
      </label>
    `;
  }
  _renderJsonError(e) {
    return e ? g`<div class="error" role="alert" aria-live="polite">${e}</div>` : "";
  }
  _setConfigValue(e, t) {
    this._emitConfig({
      ...this._config,
      [e]: t
    });
  }
  _setExcludeLines(e, t) {
    this._emitConfig({
      ...this._config,
      exclude: {
        ...f.exclude,
        ...this._config.exclude,
        [e]: Ji(t)
      }
    });
  }
  _setJsonText(e, t) {
    e === "rules" ? (this._rulesText = t, this._rulesError = _t(t).error) : (this._staleRulesText = t, this._staleRulesError = _t(t).error);
  }
  _setJsonRules(e, t) {
    const i = _t(t);
    e === "rules" ? this._rulesError = i.error : this._staleRulesError = i.error, !i.error && this._emitConfig({
      ...this._config,
      [e]: i.value
    });
  }
  _emitConfig(e) {
    this._config = e, this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: { config: e }
      })
    );
  }
};
y.styles = zi;
P([
  At({ attribute: !1 })
], y.prototype, "hass", 2);
P([
  O()
], y.prototype, "_config", 2);
P([
  O()
], y.prototype, "_rulesText", 2);
P([
  O()
], y.prototype, "_staleRulesText", 2);
P([
  O()
], y.prototype, "_rulesError", 2);
P([
  O()
], y.prototype, "_staleRulesError", 2);
y = P([
  ne("attention-center-card-editor")
], y);
function $(e) {
  const t = e.currentTarget;
  return t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement ? t.value : "";
}
function Fi(e) {
  const t = e.currentTarget;
  return t instanceof HTMLInputElement ? t.checked : !1;
}
function Gt(e) {
  const t = Number($(e));
  return Number.isFinite(t) ? t : 0;
}
function ft(e) {
  return (e ?? []).join(`
`);
}
function Ji(e) {
  return e.split(/\r?\n/).map((t) => t.trim()).filter(Boolean);
}
function Zt(e) {
  return JSON.stringify(e, null, 2);
}
function _t(e) {
  try {
    const t = JSON.parse(e.trim() || "[]");
    return Array.isArray(t) ? { value: t } : { error: "Value must be a JSON array." };
  } catch (t) {
    return {
      error: `Invalid JSON: ${t instanceof Error ? t.message : "Unable to parse value."}`
    };
  }
}
const Ki = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get AttentionCenterCardEditor() {
    return y;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  U as AttentionCenterCard,
  y as AttentionCenterCardEditor,
  be as evaluateAttentionIssues,
  Zi as evaluateAttentionIssuesForConfig
};
//# sourceMappingURL=ha-attention-center-card.js.map
