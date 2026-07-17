/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, _t = G.ShadowRoot && (G.ShadyCSS === void 0 || G.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, mt = Symbol(), At = /* @__PURE__ */ new WeakMap();
let Yt = class {
  constructor(t, i, r) {
    if (this._$cssResult$ = !0, r !== mt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (_t && t === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (t = At.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && At.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const $e = (e) => new Yt(typeof e == "string" ? e : e + "", void 0, mt), Gt = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((r, s, n) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[n + 1], e[0]);
  return new Yt(i, e, mt);
}, ve = (e, t) => {
  if (_t) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const r = document.createElement("style"), s = G.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = i.cssText, e.appendChild(r);
  }
}, Et = _t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const r of t.cssRules) i += r.cssText;
  return $e(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: be, defineProperty: we, getOwnPropertyDescriptor: Ae, getOwnPropertyNames: Ee, getOwnPropertySymbols: Se, getPrototypeOf: xe } = Object, b = globalThis, St = b.trustedTypes, Ce = St ? St.emptyScript : "", nt = b.reactiveElementPolyfillSupport, H = (e, t) => e, Q = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Ce : null;
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
} }, gt = (e, t) => !be(e, t), xt = { attribute: !0, type: String, converter: Q, reflect: !1, useDefault: !1, hasChanged: gt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), b.litPropertyMetadata ?? (b.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let O = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = xt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(t, r, i);
      s !== void 0 && we(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, i, r) {
    const { get: s, set: n } = Ae(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: s, set(o) {
      const a = s == null ? void 0 : s.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, a, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? xt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(H("elementProperties"))) return;
    const t = xe(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(H("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(H("properties"))) {
      const i = this.properties, r = [...Ee(i), ...Se(i)];
      for (const s of r) this.createProperty(s, i[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [r, s] of i) this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, r] of this.elementProperties) {
      const s = this._$Eu(i, r);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const s of r) i.unshift(Et(s));
    } else t !== void 0 && i.push(Et(t));
    return i;
  }
  static _$Eu(t, i) {
    const r = i.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const r of i.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ve(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((i) => {
      var r;
      return (r = i.hostConnected) == null ? void 0 : r.call(i);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var r;
      return (r = i.hostDisconnected) == null ? void 0 : r.call(i);
    });
  }
  attributeChangedCallback(t, i, r) {
    this._$AK(t, r);
  }
  _$ET(t, i) {
    var n;
    const r = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, r);
    if (s !== void 0 && r.reflect === !0) {
      const o = (((n = r.converter) == null ? void 0 : n.toAttribute) !== void 0 ? r.converter : Q).toAttribute(i, r.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var n, o;
    const r = this.constructor, s = r._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = r.getPropertyOptions(s), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((n = a.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? a.converter : Q;
      this._$Em = s;
      const u = l.fromAttribute(i, a.type);
      this[s] = u ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(t, i, r, s = !1, n) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (s === !1 && (n = this[t]), r ?? (r = a.getPropertyOptions(t)), !((r.hasChanged ?? gt)(n, i) || r.useDefault && r.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, r)))) return;
      this.C(t, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: r, reflect: s, wrapped: n }, o) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? i ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (i = void 0), this._$AL.set(t, i)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (r = this._$EO) == null || r.forEach((s) => {
        var n;
        return (n = s.hostUpdate) == null ? void 0 : n.call(s);
      }), this.update(i)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var i;
    (i = this._$EO) == null || i.forEach((r) => {
      var s;
      return (s = r.hostUpdated) == null ? void 0 : s.call(r);
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
O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, O[H("elementProperties")] = /* @__PURE__ */ new Map(), O[H("finalized")] = /* @__PURE__ */ new Map(), nt == null || nt({ ReactiveElement: O }), (b.reactiveElementVersions ?? (b.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, Ct = (e) => e, X = j.trustedTypes, Tt = X ? X.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Zt = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, Qt = "?" + v, Te = `<${Qt}>`, T = document, B = () => T.createComment(""), V = (e) => e === null || typeof e != "object" && typeof e != "function", yt = Array.isArray, Me = (e) => yt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", ot = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Mt = /-->/g, Rt = />/g, A = RegExp(`>|${ot}(?:([^\\s"'>=/]+)(${ot}*=${ot}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ot = /'/g, Pt = /"/g, Xt = /^(?:script|style|textarea|title)$/i, Re = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), g = Re(1), M = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), It = /* @__PURE__ */ new WeakMap(), S = T.createTreeWalker(T, 129);
function te(e, t) {
  if (!yt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Tt !== void 0 ? Tt.createHTML(t) : t;
}
const Oe = (e, t) => {
  const i = e.length - 1, r = [];
  let s, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = U;
  for (let a = 0; a < i; a++) {
    const l = e[a];
    let u, h, c = -1, p = 0;
    for (; p < l.length && (o.lastIndex = p, h = o.exec(l), h !== null); ) p = o.lastIndex, o === U ? h[1] === "!--" ? o = Mt : h[1] !== void 0 ? o = Rt : h[2] !== void 0 ? (Xt.test(h[2]) && (s = RegExp("</" + h[2], "g")), o = A) : h[3] !== void 0 && (o = A) : o === A ? h[0] === ">" ? (o = s ?? U, c = -1) : h[1] === void 0 ? c = -2 : (c = o.lastIndex - h[2].length, u = h[1], o = h[3] === void 0 ? A : h[3] === '"' ? Pt : Ot) : o === Pt || o === Ot ? o = A : o === Mt || o === Rt ? o = U : (o = A, s = void 0);
    const d = o === A && e[a + 1].startsWith("/>") ? " " : "";
    n += o === U ? l + Te : c >= 0 ? (r.push(u), l.slice(0, c) + Zt + l.slice(c) + v + d) : l + v + (c === -2 ? a : d);
  }
  return [te(e, n + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class F {
  constructor({ strings: t, _$litType$: i }, r) {
    let s;
    this.parts = [];
    let n = 0, o = 0;
    const a = t.length - 1, l = this.parts, [u, h] = Oe(t, i);
    if (this.el = F.createElement(u, r), S.currentNode = this.el.content, i === 2 || i === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = S.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(Zt)) {
          const p = h[o++], d = s.getAttribute(c).split(v), m = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: n, name: m[2], strings: d, ctor: m[1] === "." ? Ie : m[1] === "?" ? Ne : m[1] === "@" ? Ue : tt }), s.removeAttribute(c);
        } else c.startsWith(v) && (l.push({ type: 6, index: n }), s.removeAttribute(c));
        if (Xt.test(s.tagName)) {
          const c = s.textContent.split(v), p = c.length - 1;
          if (p > 0) {
            s.textContent = X ? X.emptyScript : "";
            for (let d = 0; d < p; d++) s.append(c[d], B()), S.nextNode(), l.push({ type: 2, index: ++n });
            s.append(c[p], B());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Qt) l.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(v, c + 1)) !== -1; ) l.push({ type: 7, index: n }), c += v.length - 1;
      }
      n++;
    }
  }
  static createElement(t, i) {
    const r = T.createElement("template");
    return r.innerHTML = t, r;
  }
}
function I(e, t, i = e, r) {
  var o, a;
  if (t === M) return t;
  let s = r !== void 0 ? (o = i._$Co) == null ? void 0 : o[r] : i._$Cl;
  const n = V(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== n && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), n === void 0 ? s = void 0 : (s = new n(e), s._$AT(e, i, r)), r !== void 0 ? (i._$Co ?? (i._$Co = []))[r] = s : i._$Cl = s), s !== void 0 && (t = I(e, s._$AS(e, t.values), s, r)), t;
}
class Pe {
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
    const { el: { content: i }, parts: r } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? T).importNode(i, !0);
    S.currentNode = s;
    let n = S.nextNode(), o = 0, a = 0, l = r[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let u;
        l.type === 2 ? u = new N(n, n.nextSibling, this, t) : l.type === 1 ? u = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (u = new ke(n, this, t)), this._$AV.push(u), l = r[++a];
      }
      o !== (l == null ? void 0 : l.index) && (n = S.nextNode(), o++);
    }
    return S.currentNode = T, s;
  }
  p(t) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, i), i += r.strings.length - 2) : r._$AI(t[i])), i++;
  }
}
class N {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, r, s) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = r, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = I(this, t, i), V(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== M && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Me(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== _ && V(this._$AH) ? this._$AA.nextSibling.data = t : this.T(T.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: i, _$litType$: r } = t, s = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = F.createElement(te(r.h, r.h[0]), this.options)), r);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === s) this._$AH.p(i);
    else {
      const o = new Pe(s, this), a = o.u(this.options);
      o.p(i), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = It.get(t.strings);
    return i === void 0 && It.set(t.strings, i = new F(t)), i;
  }
  k(t) {
    yt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, s = 0;
    for (const n of t) s === i.length ? i.push(r = new N(this.O(B()), this.O(B()), this, this.options)) : r = i[s], r._$AI(n), s++;
    s < i.length && (this._$AR(r && r._$AB.nextSibling, s), i.length = s);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, i); t !== this._$AB; ) {
      const s = Ct(t).nextSibling;
      Ct(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class tt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, r, s, n) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = t, this.name = i, this._$AM = s, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = _;
  }
  _$AI(t, i = this, r, s) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = I(this, t, i, 0), o = !V(t) || t !== this._$AH && t !== M, o && (this._$AH = t);
    else {
      const a = t;
      let l, u;
      for (t = n[0], l = 0; l < n.length - 1; l++) u = I(this, a[r + l], i, l), u === M && (u = this._$AH[l]), o || (o = !V(u) || u !== this._$AH[l]), u === _ ? t = _ : t !== _ && (t += (u ?? "") + n[l + 1]), this._$AH[l] = u;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ie extends tt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === _ ? void 0 : t;
  }
}
class Ne extends tt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class Ue extends tt {
  constructor(t, i, r, s, n) {
    super(t, i, r, s, n), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = I(this, t, i, 0) ?? _) === M) return;
    const r = this._$AH, s = t === _ && r !== _ || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== _ && (r === _ || s);
    s && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ke {
  constructor(t, i, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    I(this, t);
  }
}
const De = { I: N }, at = j.litHtmlPolyfillSupport;
at == null || at(F, N), (j.litHtmlVersions ?? (j.litHtmlVersions = [])).push("3.3.3");
const ze = (e, t, i) => {
  const r = (i == null ? void 0 : i.renderBefore) ?? t;
  let s = r._$litPart$;
  if (s === void 0) {
    const n = (i == null ? void 0 : i.renderBefore) ?? null;
    r._$litPart$ = s = new N(t.insertBefore(B(), n), n, void 0, i ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
let P = class extends O {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ze(i, this.renderRoot, this.renderOptions);
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
    return M;
  }
};
var Wt;
P._$litElement$ = !0, P.finalized = !0, (Wt = x.litElementHydrateSupport) == null || Wt.call(x, { LitElement: P });
const lt = x.litElementPolyfillSupport;
lt == null || lt({ LitElement: P });
(x.litElementVersions ?? (x.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ee = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = { attribute: !0, type: String, converter: Q, reflect: !1, hasChanged: gt }, je = (e = He, t, i) => {
  const { kind: r, metadata: s } = i;
  let n = globalThis.litPropertyMetadata.get(s);
  if (n === void 0 && globalThis.litPropertyMetadata.set(s, n = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(i.name, e), r === "accessor") {
    const { name: o } = i;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, l, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, e, a), a;
    } };
  }
  if (r === "setter") {
    const { name: o } = i;
    return function(a) {
      const l = this[o];
      t.call(this, a), this.requestUpdate(o, l, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function $t(e) {
  return (t, i) => typeof i == "object" ? je(e, t, i) : ((r, s, n) => {
    const o = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, r), o ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function et(e) {
  return $t({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Le = { CHILD: 2 }, Be = (e) => (...t) => ({ _$litDirective$: e, values: t });
let Ve = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, i, r) {
    this._$Ct = t, this._$AM = i, this._$Ci = r;
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
const { I: Fe } = De, Nt = (e) => e, Ut = () => document.createComment(""), k = (e, t, i) => {
  var n;
  const r = e._$AA.parentNode, s = t === void 0 ? e._$AB : t._$AA;
  if (i === void 0) {
    const o = r.insertBefore(Ut(), s), a = r.insertBefore(Ut(), s);
    i = new Fe(o, a, e, e.options);
  } else {
    const o = i._$AB.nextSibling, a = i._$AM, l = a !== e;
    if (l) {
      let u;
      (n = i._$AQ) == null || n.call(i, e), i._$AM = e, i._$AP !== void 0 && (u = e._$AU) !== a._$AU && i._$AP(u);
    }
    if (o !== s || l) {
      let u = i._$AA;
      for (; u !== o; ) {
        const h = Nt(u).nextSibling;
        Nt(r).insertBefore(u, s), u = h;
      }
    }
  }
  return i;
}, E = (e, t, i = e) => (e._$AI(t, i), e), Ke = {}, Je = (e, t = Ke) => e._$AH = t, qe = (e) => e._$AH, ct = (e) => {
  e._$AR(), e._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kt = (e, t, i) => {
  const r = /* @__PURE__ */ new Map();
  for (let s = t; s <= i; s++) r.set(e[s], s);
  return r;
}, We = Be(class extends Ve {
  constructor(e) {
    if (super(e), e.type !== Le.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e, t, i) {
    let r;
    i === void 0 ? i = t : t !== void 0 && (r = t);
    const s = [], n = [];
    let o = 0;
    for (const a of e) s[o] = r ? r(a, o) : o, n[o] = i(a, o), o++;
    return { values: n, keys: s };
  }
  render(e, t, i) {
    return this.dt(e, t, i).values;
  }
  update(e, [t, i, r]) {
    const s = qe(e), { values: n, keys: o } = this.dt(t, i, r);
    if (!Array.isArray(s)) return this.ut = o, n;
    const a = this.ut ?? (this.ut = []), l = [];
    let u, h, c = 0, p = s.length - 1, d = 0, m = n.length - 1;
    for (; c <= p && d <= m; ) if (s[c] === null) c++;
    else if (s[p] === null) p--;
    else if (a[c] === o[d]) l[d] = E(s[c], n[d]), c++, d++;
    else if (a[p] === o[m]) l[m] = E(s[p], n[m]), p--, m--;
    else if (a[c] === o[m]) l[m] = E(s[c], n[m]), k(e, l[m + 1], s[c]), c++, m--;
    else if (a[p] === o[d]) l[d] = E(s[p], n[d]), k(e, s[c], s[p]), p--, d++;
    else if (u === void 0 && (u = kt(o, d, m), h = kt(a, c, p)), u.has(a[c])) if (u.has(a[p])) {
      const y = h.get(o[d]), rt = y !== void 0 ? s[y] : null;
      if (rt === null) {
        const wt = k(e, s[c]);
        E(wt, n[d]), l[d] = wt;
      } else l[d] = E(rt, n[d]), k(e, s[c], rt), s[y] = null;
      d++;
    } else ct(s[p]), p--;
    else ct(s[c]), c++;
    for (; d <= m; ) {
      const y = k(e, l[m + 1]);
      E(y, n[d]), l[d++] = y;
    }
    for (; c <= p; ) {
      const y = s[c++];
      y !== null && ct(y);
    }
    return this.ut = o, Je(e, l), M;
  }
}), ie = "Attention Center", se = 30, re = 15, ne = 24, Ye = /* @__PURE__ */ new Set(["critical", "warning", "info"]), Ge = /* @__PURE__ */ new Set(["full", "compact", "summary"]), Ze = /* @__PURE__ */ new Set(["message", "hide"]), f = {
  title: ie,
  detect_unavailable: !0,
  detect_batteries: !0,
  detect_stale: !1,
  stale_hours: ne,
  battery_warning: se,
  battery_critical: re,
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
function Qe(e) {
  return typeof e == "string" && Ye.has(e);
}
function oe(e) {
  if (!K(e))
    throw new Error("Attention Center Card configuration must be an object.");
  const t = le(e.title, "title") ?? ie, i = Dt(
    e.battery_warning,
    "battery_warning",
    se
  ), r = Dt(
    e.battery_critical,
    "battery_critical",
    re
  );
  if (r >= i)
    throw new Error("battery_critical must be lower than battery_warning.");
  const s = zt(
    e.display_mode,
    "display_mode",
    Ge,
    f.display_mode
  ), n = zt(
    e.empty_state,
    "empty_state",
    Ze,
    f.empty_state
  );
  return {
    ...e,
    title: t,
    detect_unavailable: e.detect_unavailable ?? f.detect_unavailable,
    detect_batteries: e.detect_batteries ?? f.detect_batteries,
    detect_stale: e.detect_stale ?? f.detect_stale,
    stale_hours: vt(e.stale_hours, "stale_hours", ne),
    battery_warning: i,
    battery_critical: r,
    battery_thresholds: si(e.battery_thresholds),
    display_mode: s,
    empty_state: n,
    reverse_age_sort: e.reverse_age_sort ?? f.reverse_age_sort,
    exclude: ti(e.exclude),
    stale_rules: ii(e.stale_rules),
    rules: ei(e.rules)
  };
}
function Xe(e) {
  return JSON.stringify(e);
}
function ti(e) {
  return {
    domains: D(e == null ? void 0 : e.domains, "exclude.domains"),
    entities: D(e == null ? void 0 : e.entities, "exclude.entities"),
    devices: D(e == null ? void 0 : e.devices, "exclude.devices"),
    areas: D(e == null ? void 0 : e.areas, "exclude.areas"),
    patterns: D(e == null ? void 0 : e.patterns, "exclude.patterns")
  };
}
function ei(e) {
  if (e === void 0)
    return [];
  if (!Array.isArray(e))
    throw new Error("rules must be a list.");
  return e.map((t, i) => {
    if (!K(t))
      throw new Error(`rules[${i}] must be an object.`);
    const r = ae(t.entity_id, `rules[${i}].entity_id`), s = ce(t.severity, `rules[${i}].severity`, "warning");
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
      entity_id: r,
      severity: s
    };
  });
}
function ii(e) {
  if (e === void 0)
    return [];
  if (!Array.isArray(e))
    throw new Error("stale_rules must be a list.");
  return e.map((t, i) => {
    if (!K(t))
      throw new Error(`stale_rules[${i}] must be an object.`);
    return {
      ...t,
      entity_id: ae(t.entity_id, `stale_rules[${i}].entity_id`),
      hours: vt(t.hours, `stale_rules[${i}].hours`),
      severity: ce(t.severity, `stale_rules[${i}].severity`, "warning"),
      title: le(t.title, `stale_rules[${i}].title`)
    };
  });
}
function si(e) {
  if (e === void 0)
    return {};
  if (!K(e))
    throw new Error("battery_thresholds must be an object.");
  const t = {};
  for (const [i, r] of Object.entries(e)) {
    if (typeof r == "number") {
      if (!C(r) || r <= 0)
        throw new Error(`battery_thresholds.${i} must be a positive number.`);
      t[i] = r;
      continue;
    }
    if (!K(r))
      throw new Error(`battery_thresholds.${i} must be a number or object.`);
    const s = r.warning, n = r.critical;
    if (s !== void 0 && (!C(s) || s <= 0))
      throw new Error(`battery_thresholds.${i}.warning must be a positive number.`);
    if (n !== void 0 && (!C(n) || n <= 0))
      throw new Error(`battery_thresholds.${i}.critical must be a positive number.`);
    if (s !== void 0 && n !== void 0 && n >= s)
      throw new Error(
        `battery_thresholds.${i}.critical must be lower than warning when both are set.`
      );
    t[i] = { warning: s, critical: n };
  }
  return t;
}
function D(e, t) {
  if (e === void 0)
    return [];
  if (!Array.isArray(e) || e.some((i) => typeof i != "string"))
    throw new Error(`${t} must be a list of strings.`);
  return e.map((i) => i.trim()).filter(Boolean);
}
function ae(e, t) {
  if (typeof e != "string" || e.trim().length === 0)
    throw new Error(`${t} must be a non-empty string.`);
  return e.trim();
}
function le(e, t) {
  if (e !== void 0) {
    if (typeof e != "string")
      throw new Error(`${t} must be a string.`);
    return e.trim();
  }
}
function Dt(e, t, i) {
  return e === void 0 ? i : vt(e, t);
}
function vt(e, t, i) {
  if (e === void 0 && i !== void 0)
    return i;
  if (!C(e) || e <= 0)
    throw new Error(`${t} must be a positive number.`);
  return e;
}
function ce(e, t, i) {
  if (e === void 0)
    return i;
  if (!Qe(e))
    throw new Error(`${t} must be one of critical, warning, or info.`);
  return e;
}
function zt(e, t, i, r) {
  if (e === void 0)
    return r;
  if (typeof e != "string" || !i.has(e))
    throw new Error(`${t} is not supported.`);
  return e;
}
function K(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function C(e) {
  return typeof e == "number" && Number.isFinite(e);
}
const ri = {
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
function ue(e) {
  var t;
  return ((t = e.split(".", 1)[0]) == null ? void 0 : t.toLowerCase()) ?? "";
}
function ni(e) {
  return e === "unavailable" || e === "unknown";
}
function pt(e) {
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
function oi(e, t) {
  var s;
  const i = e.states[t], r = (s = e.entities) == null ? void 0 : s[t];
  return L(i == null ? void 0 : i.attributes.friendly_name) ?? L(r == null ? void 0 : r.name) ?? L(r == null ? void 0 : r.original_name) ?? t;
}
function ai(e, t, i, r) {
  var a;
  const s = e.states[t], n = (a = e.entities) == null ? void 0 : a[t], o = L(s == null ? void 0 : s.attributes.icon) ?? L(n == null ? void 0 : n.icon);
  return o || (r === "battery" ? i === "critical" ? "mdi:battery-alert" : "mdi:battery-low" : i === "critical" ? "mdi:alert-octagon" : i === "warning" ? "mdi:alert" : ri[ue(t)] ?? "mdi:information-outline");
}
function li(e, t) {
  const i = de(e, t);
  for (const r of i) {
    const s = pe(e, r);
    if (s != null && s.name)
      return s.name;
  }
  return i[0];
}
function de(e, t) {
  var l;
  const i = /* @__PURE__ */ new Set(), r = (l = e.entities) == null ? void 0 : l[t];
  W(i, r == null ? void 0 : r.area_id);
  const s = he(e, t), n = s ? ci(e, s) : void 0;
  W(i, n == null ? void 0 : n.area_id);
  const o = e.states[t], a = o == null ? void 0 : o.attributes.area;
  typeof a == "string" && W(i, a);
  for (const u of [...i]) {
    const h = pe(e, u);
    W(i, h == null ? void 0 : h.name);
  }
  return [...i];
}
function he(e, t) {
  var s, n;
  const i = (s = e.entities) == null ? void 0 : s[t];
  if (i != null && i.device_id)
    return i.device_id;
  const r = (n = e.states[t]) == null ? void 0 : n.attributes.device_id;
  return typeof r == "string" ? r : void 0;
}
function it(e) {
  const t = e.hass.states[e.entityId], i = e.activeSinceMs ?? R(t == null ? void 0 : t.last_changed) ?? R(t == null ? void 0 : t.last_updated) ?? Date.now();
  return {
    id: e.id,
    entity_id: e.entityId,
    severity: e.severity,
    title: e.title ?? oi(e.hass, e.entityId),
    message: e.message,
    state: (t == null ? void 0 : t.state) ?? "missing",
    activeSinceMs: i,
    area: li(e.hass, e.entityId),
    icon: ai(e.hass, e.entityId, e.severity, e.source),
    source: e.source
  };
}
function pe(e, t) {
  var r;
  const i = (r = e.areas) == null ? void 0 : r[t];
  return i || Object.values(e.areas ?? {}).find(
    (s) => s.area_id === t || s.id === t || s.name === t
  );
}
function ci(e, t) {
  var r;
  const i = (r = e.devices) == null ? void 0 : r[t];
  return i || Object.values(e.devices ?? {}).find(
    (s) => s.id === t || s.name === t || s.name_by_user === t
  );
}
function L(e) {
  return typeof e == "string" && e.trim().length > 0 ? e.trim() : void 0;
}
function W(e, t) {
  t && t.trim().length > 0 && e.add(t);
}
function ft(e) {
  const t = e.trim(), i = t.includes("*") || t.includes("?");
  return {
    pattern: t,
    wildcard: i,
    regex: i ? di(t) : void 0
  };
}
function fe(e, t) {
  var i;
  return t.wildcard ? ((i = t.regex) == null ? void 0 : i.test(e)) ?? !1 : e === t.pattern;
}
function _e(e, t) {
  return t.wildcard ? Object.keys(e.states).filter((i) => fe(i, t)) : e.states[t.pattern] ? [t.pattern] : [];
}
function ui(e) {
  return {
    domains: new Set(e.domains.map((t) => t.toLowerCase())),
    entities: new Set(e.entities),
    devices: new Set(e.devices),
    areas: new Set(e.areas),
    areaNames: new Set(e.areas.map((t) => t.toLowerCase())),
    patterns: e.patterns.map(ft)
  };
}
function st(e, t, i) {
  if (i.entities.has(e) || i.domains.has(ue(e)) || i.patterns.some((n) => fe(e, n)))
    return !0;
  const r = he(t, e);
  return r && i.devices.has(r) ? !0 : de(t, e).some(
    (n) => i.areas.has(n) || i.areaNames.has(n.toLowerCase())
  );
}
function di(e) {
  let t = "^";
  for (const i of e)
    i === "*" ? t += ".*" : i === "?" ? t += "." : t += hi(i);
  return t += "$", new RegExp(t, "i");
}
function hi(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const Ht = [
  /(^|[._-])battery($|[._-])/i,
  /(^|[._-])battery_level($|[._-])/i,
  /(^|[._-])battery_percent(age)?($|[._-])/i,
  /(^|[._-])battery_percentage($|[._-])/i,
  /(^|[._-])low_battery($|[._-])/i
];
function pi(e) {
  const { config: t, exclusions: i } = e.plan;
  if (!t.detect_batteries)
    return [];
  const r = [];
  for (const [s, n] of Object.entries(e.hass.states)) {
    if (!fi(s, n) || st(s, e.hass, i))
      continue;
    const o = pt(n.state);
    if (o === void 0)
      continue;
    const a = _i(e, s), l = mi(o, a);
    if (!l)
      continue;
    const u = l === "critical" ? a.critical : a.warning;
    r.push(
      it({
        hass: e.hass,
        entityId: s,
        severity: l,
        message: `Battery is ${gi(o)}% (${l} below ${u}%)`,
        activeSinceMs: R(n.last_changed),
        source: "battery",
        id: `battery:${s}`
      })
    );
  }
  return r;
}
function fi(e, t) {
  const i = t.attributes.device_class, r = t.attributes.unit_of_measurement;
  return i === "battery" || typeof r == "string" && r.trim() === "%" && Ht.some((s) => s.test(e)) ? !0 : Ht.some((s) => s.test(e));
}
function _i(e, t) {
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
function mi(e, t) {
  if (e < t.critical)
    return "critical";
  if (e < t.warning)
    return "warning";
}
function gi(e) {
  return Number.isInteger(e) ? String(e) : e.toFixed(1);
}
const yi = 3600 * 1e3;
function $i(e) {
  const t = [], i = /* @__PURE__ */ new Set();
  if (e.plan.config.detect_stale)
    for (const r of Object.keys(e.hass.states))
      jt(
        e,
        r,
        {
          hours: e.plan.config.stale_hours,
          severity: "warning"
        },
        t,
        i,
        "global"
      );
  for (const r of e.plan.staleRules) {
    const s = _e(e.hass, r.matcher);
    for (const n of s)
      jt(
        e,
        n,
        r.rule,
        t,
        i,
        `rule:${r.index}`
      );
  }
  return t;
}
function jt(e, t, i, r, s, n) {
  if (s.has(`${n}:${t}`) || st(t, e.hass, e.plan.exclusions))
    return;
  const o = e.hass.states[t];
  if (!o)
    return;
  const a = R(o.last_updated) ?? R(o.last_changed);
  if (a === void 0)
    return;
  const l = i.hours * yi, u = a + l;
  e.now.getTime() < u || (s.add(`${n}:${t}`), r.push(
    it({
      hass: e.hass,
      entityId: t,
      severity: i.severity ?? "warning",
      title: i.title,
      message: `No update for ${vi(i.hours)}`,
      activeSinceMs: u,
      source: "stale",
      id: `stale:${n}:${t}`
    })
  ));
}
function vi(e) {
  return Number.isInteger(e) ? `${e}h` : `${e.toFixed(1)}h`;
}
function bi(e) {
  const { config: t, exclusions: i } = e.plan;
  if (!t.detect_unavailable)
    return [];
  const r = [];
  for (const [s, n] of Object.entries(e.hass.states)) {
    if (!ni(n.state) || st(s, e.hass, i))
      continue;
    const o = n.state === "unknown" ? "unknown" : "unavailable";
    r.push(
      it({
        hass: e.hass,
        entityId: s,
        severity: "warning",
        message: `State is ${o}`,
        activeSinceMs: R(n.last_changed),
        source: "unavailable",
        id: `unavailable:${s}`
      })
    );
  }
  return r;
}
const wi = 60 * 1e3;
function Ai(e) {
  const t = [];
  for (const i of e.plan.userRules) {
    const r = _e(e.hass, i.matcher);
    for (const s of r) {
      if (st(s, e.hass, e.plan.exclusions))
        continue;
      const n = e.hass.states[s];
      if (!n)
        continue;
      const o = Ei(i.rule, n, e.now.getTime());
      o.matched && t.push(
        it({
          hass: e.hass,
          entityId: s,
          severity: i.rule.severity ?? "warning",
          title: i.rule.title,
          message: o.message,
          activeSinceMs: o.activeSinceMs,
          source: "rule",
          id: `rule:${i.index}:${s}`
        })
      );
    }
  }
  return t;
}
function Ei(e, t, i) {
  const r = Si(e, t), s = [];
  if (e.state !== void 0) {
    if (!Lt(r, e.state))
      return { matched: !1 };
    s.push(`${Y(e)} is ${String(e.state)}`);
  }
  if (e.not_state !== void 0) {
    if (Lt(r, e.not_state))
      return { matched: !1 };
    s.push(`${Y(e)} is not ${String(e.not_state)}`);
  }
  if (e.above !== void 0) {
    const a = pt(r);
    if (a === void 0 || a <= e.above)
      return { matched: !1 };
    s.push(`${Y(e)} ${Bt(a)} is above ${e.above}`);
  }
  if (e.below !== void 0) {
    const a = pt(r);
    if (a === void 0 || a >= e.below)
      return { matched: !1 };
    s.push(`${Y(e)} ${Bt(a)} is below ${e.below}`);
  }
  const n = R(e.attribute ? t.last_updated : t.last_changed) ?? i, o = (e.for_minutes ?? 0) * wi;
  return o > 0 && i - n < o ? { matched: !1 } : {
    matched: !0,
    message: s.length > 0 ? s.join("; ") : "Rule matched",
    activeSinceMs: n + o
  };
}
function Si(e, t) {
  return e.attribute ? t.attributes[e.attribute] : t.state;
}
function Lt(e, t) {
  return String(e) === String(t);
}
function Y(e) {
  return e.attribute ? `Attribute ${e.attribute}` : "State";
}
function Bt(e) {
  return Number.isInteger(e) ? String(e) : e.toFixed(1);
}
const xi = {
  critical: 0,
  warning: 1,
  info: 2
};
function Vt(e) {
  return xi[e];
}
function Ci(e, t = !1) {
  return [...e].sort((i, r) => {
    const s = Vt(i.severity) - Vt(r.severity);
    if (s !== 0)
      return s;
    const n = i.activeSinceMs - r.activeSinceMs;
    return n !== 0 ? t ? -n : n : i.id.localeCompare(r.id);
  });
}
function Ft(e) {
  return {
    critical: e.filter((t) => t.severity === "critical").length,
    warning: e.filter((t) => t.severity === "warning").length,
    info: e.filter((t) => t.severity === "info").length
  };
}
function me(e) {
  return {
    config: e,
    exclusions: ui(e.exclude),
    userRules: e.rules.map((t, i) => ({
      rule: t,
      matcher: ft(t.entity_id),
      index: i
    })),
    staleRules: e.stale_rules.map((t, i) => ({
      rule: t,
      matcher: ft(t.entity_id),
      index: i
    }))
  };
}
function ge(e, t, i = /* @__PURE__ */ new Date()) {
  const r = { hass: e, plan: t, now: i }, s = [
    ...bi(r),
    ...pi(r),
    ...$i(r),
    ...Ai(r)
  ];
  return Ci(Ti(s), t.config.reverse_age_sort);
}
function Ki(e, t, i = /* @__PURE__ */ new Date()) {
  const r = oe(t);
  return ge(e, me(r), i);
}
function Ti(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e)
    t.set(i.id, i);
  return [...t.values()];
}
const Z = 60 * 1e3, z = 60 * Z, ut = 24 * z;
function Mi(e, t = Date.now()) {
  const i = Math.max(0, t - e);
  if (i < Z)
    return "<1m";
  if (i < z)
    return `${Math.floor(i / Z)}m`;
  if (i < ut) {
    const n = Math.floor(i / z), o = Math.floor(i % z / Z);
    return o > 0 ? `${n}h ${o}m` : `${n}h`;
  }
  const r = Math.floor(i / ut), s = Math.floor(i % ut / z);
  return s > 0 ? `${r}d ${s}h` : `${r}d`;
}
const Ri = Gt`
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
`, Oi = Gt`
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

  @media (max-width: 520px) {
    .row {
      grid-template-columns: 1fr;
    }
  }
`;
var Pi = Object.defineProperty, Ii = Object.getOwnPropertyDescriptor, bt = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Ii(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Pi(t, i, s), s;
};
const ye = "attention-center-card", Ni = "attention-center-card-editor";
let J = class extends P {
  constructor() {
    super(...arguments), this._issues = [], this._configKey = "", this._lastConfigKey = "";
  }
  setConfig(e) {
    const t = oe(e);
    this._config = t, this._plan = me(t), this._configKey = Xe(t), this._lastConfigKey = "", this._lastStatesRef = void 0, this._recalculateIssues();
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
    return await Promise.resolve().then(() => ji), document.createElement(Ni);
  }
  getCardSize() {
    return !this._config || this._config.empty_state === "hide" ? 1 : this._config.display_mode === "summary" ? 2 : Math.min(6, Math.max(2, this._issues.length + 1));
  }
  willUpdate(e) {
    e.has("hass") && this._recalculateIssues();
  }
  render() {
    if (!this._config)
      return g``;
    if (this._issues.length === 0 && this._config.empty_state === "hide")
      return _;
    const e = Ft(this._issues), t = this._issues.length;
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
    const e = Ft(this._issues);
    return this._config.display_mode === "summary" ? g`
        <div class="summary" role="list" aria-label="Issue summary">
          ${this._renderSummaryCell("critical", e.critical)}
          ${this._renderSummaryCell("warning", e.warning)}
          ${this._renderSummaryCell("info", e.info)}
        </div>
        ${this._issues.length === 0 ? this._renderEmptyState() : _}
      ` : this._issues.length === 0 ? this._renderEmptyState() : g`
      <div class="list ${this._config.display_mode === "compact" ? "compact" : ""}" role="list">
        ${We(
      this._issues,
      (t) => t.id,
      (t) => this._renderIssue(t)
    )}
      </div>
    `;
  }
  _renderIssue(e) {
    const t = Mi(e.activeSinceMs);
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
        <ha-icon .icon=${Kt(e)}></ha-icon>
        <span>${dt(e)} ${t}</span>
      </span>
    `;
  }
  _renderSeverityChip(e) {
    return g`
      <span class="severity-chip" data-severity=${e}>
        <ha-icon .icon=${Kt(e)}></ha-icon>
        <span>${dt(e)}</span>
      </span>
    `;
  }
  _renderSummaryCell(e, t) {
    return g`
      <div class="summary-cell" role="listitem">
        <span class="summary-value">${t}</span>
        <span class="summary-label">${dt(e)}</span>
      </div>
    `;
  }
  _recalculateIssues() {
    !this.hass || !this._plan || this.hass.states === this._lastStatesRef && this._configKey === this._lastConfigKey || (this._issues = ge(this.hass, this._plan), this._lastStatesRef = this.hass.states, this._lastConfigKey = this._configKey);
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
J.styles = Ri;
bt([
  $t({ attribute: !1 })
], J.prototype, "hass", 2);
bt([
  et()
], J.prototype, "_issues", 2);
J = bt([
  ee(ye)
], J);
function Kt(e) {
  return e === "critical" ? "mdi:alert-octagon" : e === "warning" ? "mdi:alert" : "mdi:information";
}
function dt(e) {
  return e[0].toUpperCase() + e.slice(1);
}
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: ye,
  name: "Attention Center",
  description: "Automatically surfaces unavailable, low-battery, stale, and rule-matched entities.",
  preview: !0,
  documentationURL: "https://github.com/Farleykri/ha-attention-center-card"
});
var Ui = Object.defineProperty, ki = Object.getOwnPropertyDescriptor, q = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? ki(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Ui(t, i, s), s;
};
let w = class extends P {
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
    }, this._rulesText = qt(this._config.rules ?? []), this._staleRulesText = qt(this._config.stale_rules ?? []);
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
              @change=${(t) => this._setConfigValue("battery_warning", Jt(t))}
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
              @change=${(t) => this._setConfigValue("battery_critical", Jt(t))}
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
            .value=${ht(e.domains)}
            @change=${(t) => this._setExcludeLines("domains", $(t))}
          ></textarea>
        </div>

        <div class="section">
          <label for="exclude-entities">Excluded entities</label>
          <textarea
            id="exclude-entities"
            .value=${ht(e.entities)}
            @change=${(t) => this._setExcludeLines("entities", $(t))}
          ></textarea>
        </div>

        <div class="section">
          <label for="exclude-patterns">Excluded entity patterns</label>
          <textarea
            id="exclude-patterns"
            .value=${ht(e.patterns)}
            @change=${(t) => this._setExcludeLines("patterns", $(t))}
          ></textarea>
        </div>

        <div class="section">
          <label for="stale-rules">Stale rules JSON</label>
          <textarea
            id="stale-rules"
            .value=${this._staleRulesText}
            @input=${(t) => {
      this._staleRulesText = $(t);
    }}
            @change=${() => this._setJsonRules("stale_rules", this._staleRulesText)}
          ></textarea>
        </div>

        <div class="section">
          <label for="rules">User rules JSON</label>
          <textarea
            id="rules"
            .value=${this._rulesText}
            @input=${(t) => {
      this._rulesText = $(t);
    }}
            @change=${() => this._setJsonRules("rules", this._rulesText)}
          ></textarea>
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
          @change=${(r) => this._setConfigValue(e, Di(r))}
        />
      </label>
    `;
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
        [e]: zi(t)
      }
    });
  }
  _setJsonRules(e, t) {
    const i = Hi(t);
    i && this._emitConfig({
      ...this._config,
      [e]: i
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
w.styles = Oi;
q([
  $t({ attribute: !1 })
], w.prototype, "hass", 2);
q([
  et()
], w.prototype, "_config", 2);
q([
  et()
], w.prototype, "_rulesText", 2);
q([
  et()
], w.prototype, "_staleRulesText", 2);
w = q([
  ee("attention-center-card-editor")
], w);
function $(e) {
  const t = e.currentTarget;
  return t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement ? t.value : "";
}
function Di(e) {
  const t = e.currentTarget;
  return t instanceof HTMLInputElement ? t.checked : !1;
}
function Jt(e) {
  const t = Number($(e));
  return Number.isFinite(t) ? t : 0;
}
function ht(e) {
  return (e ?? []).join(`
`);
}
function zi(e) {
  return e.split(/\r?\n/).map((t) => t.trim()).filter(Boolean);
}
function qt(e) {
  return JSON.stringify(e, null, 2);
}
function Hi(e) {
  try {
    const t = JSON.parse(e.trim() || "[]");
    return Array.isArray(t) ? t : void 0;
  } catch {
    return;
  }
}
const ji = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get AttentionCenterCardEditor() {
    return w;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  J as AttentionCenterCard,
  w as AttentionCenterCardEditor,
  ge as evaluateAttentionIssues,
  Ki as evaluateAttentionIssuesForConfig
};
//# sourceMappingURL=attention-center-card.js.map
