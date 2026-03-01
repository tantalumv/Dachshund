class R {
  withFields(X) {
    let Y = Object.keys(this).map((J) => (J in X ? X[J] : this[J]));
    return new this.constructor(...Y);
  }
}
class WJ {
  static fromArray(X, Y) {
    let J = Y || new T();
    for (let Q = X.length - 1; Q >= 0; --Q) J = new fY(X[Q], J);
    return J;
  }
  [Symbol.iterator]() {
    return new C6(this);
  }
  toArray() {
    return [...this];
  }
  atLeastLength(X) {
    let Y = this;
    while (X-- > 0 && Y) Y = Y.tail;
    return Y !== void 0;
  }
  hasLength(X) {
    let Y = this;
    while (X-- > 0 && Y) Y = Y.tail;
    return X === -1 && Y instanceof T;
  }
  countLength() {
    let X = this,
      Y = 0;
    while (X) ((X = X.tail), Y++);
    return Y - 1;
  }
}
function M(X, Y) {
  return new fY(X, Y);
}
function F(X, Y) {
  return WJ.fromArray(X, Y);
}
class C6 {
  #X;
  constructor(X) {
    this.#X = X;
  }
  next() {
    if (this.#X instanceof T) return { done: !0 };
    else {
      let { head: X, tail: Y } = this.#X;
      return ((this.#X = Y), { value: X, done: !1 });
    }
  }
}
class T extends WJ {}
var w6 = () => new T(),
  rJ = (X) => X instanceof T;
class fY extends WJ {
  constructor(X, Y) {
    super();
    ((this.head = X), (this.tail = Y));
  }
}
var zY = (X, Y) => new fY(X, Y),
  KY = (X) => X instanceof fY,
  gY = (X) => X.head,
  $X = (X) => X.tail;
class KJ {
  bitSize;
  byteSize;
  bitOffset;
  rawBuffer;
  constructor(X, Y, J) {
    if (!(X instanceof Uint8Array))
      throw globalThis.Error("BitArray can only be constructed from a Uint8Array");
    if (
      ((this.bitSize = Y ?? X.length * 8),
      (this.byteSize = Math.trunc((this.bitSize + 7) / 8)),
      (this.bitOffset = J ?? 0),
      this.bitSize < 0)
    )
      throw globalThis.Error(`BitArray bit size is invalid: ${this.bitSize}`);
    if (this.bitOffset < 0 || this.bitOffset > 7)
      throw globalThis.Error(`BitArray bit offset is invalid: ${this.bitOffset}`);
    if (X.length !== Math.trunc((this.bitOffset + this.bitSize + 7) / 8))
      throw globalThis.Error("BitArray buffer length is invalid");
    this.rawBuffer = X;
  }
  byteAt(X) {
    if (X < 0 || X >= this.byteSize) return;
    return bY(this.rawBuffer, this.bitOffset, X);
  }
  equals(X) {
    if (this.bitSize !== X.bitSize) return !1;
    let Y = Math.trunc(this.bitSize / 8);
    if (this.bitOffset === 0 && X.bitOffset === 0) {
      for (let Q = 0; Q < Y; Q++) if (this.rawBuffer[Q] !== X.rawBuffer[Q]) return !1;
      let J = this.bitSize % 8;
      if (J) {
        let Q = 8 - J;
        if (this.rawBuffer[Y] >> Q !== X.rawBuffer[Y] >> Q) return !1;
      }
    } else {
      for (let Q = 0; Q < Y; Q++) {
        let W = bY(this.rawBuffer, this.bitOffset, Q),
          K = bY(X.rawBuffer, X.bitOffset, Q);
        if (W !== K) return !1;
      }
      let J = this.bitSize % 8;
      if (J) {
        let Q = bY(this.rawBuffer, this.bitOffset, Y),
          W = bY(X.rawBuffer, X.bitOffset, Y),
          K = 8 - J;
        if (Q >> K !== W >> K) return !1;
      }
    }
    return !0;
  }
  get buffer() {
    if (
      (P6("buffer", "Use BitArray.byteAt() or BitArray.rawBuffer instead"),
      this.bitOffset !== 0 || this.bitSize % 8 !== 0)
    )
      throw new globalThis.Error("BitArray.buffer does not support unaligned bit arrays");
    return this.rawBuffer;
  }
  get length() {
    if (
      (P6("length", "Use BitArray.bitSize or BitArray.byteSize instead"),
      this.bitOffset !== 0 || this.bitSize % 8 !== 0)
    )
      throw new globalThis.Error("BitArray.length does not support unaligned bit arrays");
    return this.rawBuffer.length;
  }
}
function bY(X, Y, J) {
  if (Y === 0) return X[J] ?? 0;
  else {
    let Q = (X[J] << Y) & 255,
      W = X[J + 1] >> (8 - Y);
    return Q | W;
  }
}
class iJ {
  constructor(X) {
    this.value = X;
  }
}
var S6 = {};
function P6(X, Y) {
  if (S6[X]) return;
  (console.warn(`Deprecated BitArray.${X} property used in JavaScript FFI code. ${Y}.`),
    (S6[X] = !0));
}
class GJ extends R {
  static isResult(X) {
    return X instanceof GJ;
  }
}
class n extends GJ {
  constructor(X) {
    super();
    this[0] = X;
  }
  isOk() {
    return !0;
  }
}
var nX = (X) => new n(X),
  FX = (X) => X instanceof n,
  HX = (X) => X[0];
class JX extends GJ {
  constructor(X) {
    super();
    this[0] = X;
  }
  isOk() {
    return !1;
  }
}
var lX = (X) => new JX(X);
function BX(X, Y) {
  let J = [X, Y];
  while (J.length) {
    let Q = J.pop(),
      W = J.pop();
    if (Q === W) continue;
    if (!L6(Q) || !L6(W)) return !1;
    if (!k0(Q, W) || P0(Q, W) || L0(Q, W) || C0(Q, W) || w0(Q, W) || E0(Q, W) || x0(Q, W))
      return !1;
    let V = Object.getPrototypeOf(Q);
    if (V !== null && typeof V.equals === "function")
      try {
        if (Q.equals(W)) continue;
        else return !1;
      } catch {}
    let [G, Z] = S0(Q),
      H = G(Q),
      q = G(W);
    if (H.length !== q.length) return !1;
    for (let U of H) J.push(Z(Q, U), Z(W, U));
  }
  return !0;
}
function S0(X) {
  if (X instanceof Map) return [(Y) => Y.keys(), (Y, J) => Y.get(J)];
  else {
    let Y = X instanceof globalThis.Error ? ["message"] : [];
    return [(J) => [...Y, ...Object.keys(J)], (J, Q) => J[Q]];
  }
}
function P0(X, Y) {
  return X instanceof Date && (X > Y || X < Y);
}
function L0(X, Y) {
  return (
    !(X instanceof KJ) &&
    X.buffer instanceof ArrayBuffer &&
    X.BYTES_PER_ELEMENT &&
    !(X.byteLength === Y.byteLength && X.every((J, Q) => J === Y[Q]))
  );
}
function C0(X, Y) {
  return Array.isArray(X) && X.length !== Y.length;
}
function w0(X, Y) {
  return X instanceof Map && X.size !== Y.size;
}
function E0(X, Y) {
  return X instanceof Set && (X.size != Y.size || [...X].some((J) => !Y.has(J)));
}
function x0(X, Y) {
  return X instanceof RegExp && (X.source !== Y.source || X.flags !== Y.flags);
}
function L6(X) {
  return typeof X === "object" && X !== null;
}
function k0(X, Y) {
  if (typeof X !== "object" && typeof Y !== "object" && (!X || !Y)) return !1;
  if ([Promise, WeakSet, WeakMap, Function].some((Q) => X instanceof Q)) return !1;
  return X.constructor === Y.constructor;
}
function nJ(X, Y, J, Q, W, K, V) {
  let G = new globalThis.Error(K);
  ((G.gleam_error = X), (G.file = Y), (G.module = J), (G.line = Q), (G.function = W), (G.fn = W));
  for (let Z in V) G[Z] = V[Z];
  return G;
}
var E6 = new WeakMap(),
  lJ = new DataView(new ArrayBuffer(8)),
  aJ = 0;
function tJ(X) {
  let Y = E6.get(X);
  if (Y !== void 0) return Y;
  let J = aJ++;
  if (aJ === 2147483647) aJ = 0;
  return (E6.set(X, J), J);
}
function x6(X, Y) {
  return (X ^ (Y + 2654435769 + (X << 6) + (X >> 2))) | 0;
}
function eJ(X) {
  let Y = 0,
    J = X.length;
  for (let Q = 0; Q < J; Q++) Y = (Math.imul(31, Y) + X.charCodeAt(Q)) | 0;
  return Y;
}
function y6(X) {
  lJ.setFloat64(0, X);
  let Y = lJ.getInt32(0),
    J = lJ.getInt32(4);
  return Math.imul(73244475, (Y >> 16) ^ Y) ^ J;
}
function y0(X) {
  return eJ(X.toString());
}
function b0(X) {
  let Y = Object.getPrototypeOf(X);
  if (Y !== null && typeof Y.hashCode === "function")
    try {
      let Q = X.hashCode(X);
      if (typeof Q === "number") return Q;
    } catch {}
  if (X instanceof Promise || X instanceof WeakSet || X instanceof WeakMap) return tJ(X);
  if (X instanceof Date) return y6(X.getTime());
  let J = 0;
  if (X instanceof ArrayBuffer) X = new Uint8Array(X);
  if (Array.isArray(X) || X instanceof Uint8Array)
    for (let Q = 0; Q < X.length; Q++) J = (Math.imul(31, J) + aX(X[Q])) | 0;
  else if (X instanceof Set)
    X.forEach((Q) => {
      J = (J + aX(Q)) | 0;
    });
  else if (X instanceof Map)
    X.forEach((Q, W) => {
      J = (J + x6(aX(Q), aX(W))) | 0;
    });
  else {
    let Q = Object.keys(X);
    for (let W = 0; W < Q.length; W++) {
      let K = Q[W],
        V = X[K];
      J = (J + x6(aX(V), eJ(K))) | 0;
    }
  }
  return J;
}
function aX(X) {
  if (X === null) return 1108378658;
  if (X === void 0) return 1108378659;
  if (X === !0) return 1108378657;
  if (X === !1) return 1108378656;
  switch (typeof X) {
    case "number":
      return y6(X);
    case "string":
      return eJ(X);
    case "bigint":
      return y0(X);
    case "object":
      return b0(X);
    case "symbol":
      return tJ(X);
    case "function":
      return tJ(X);
    default:
      return 0;
  }
}
class RY {
  constructor(X, Y) {
    ((this.size = X), (this.root = Y));
  }
}
var HJ = 5,
  f0 = (1 << HJ) - 1,
  ZJ = Symbol(),
  _Y = Symbol(),
  b6 = _0(0),
  f6 = new RY(0, b6),
  g0 = lX(void 0);
function UJ(X, Y, J, Q) {
  return { datamap: Y, nodemap: J, data: Q, [_Y]: X };
}
function _0(X) {
  return UJ(X, 0, 0, []);
}
function h0(X, Y) {
  if (X[_Y] === Y) return X;
  let J = X.data.slice(0);
  return UJ(Y, X.datamap, X.nodemap, J);
}
function oJ(X, Y, J, Q) {
  if (X.data[J] === Q) return X;
  return ((X = h0(X, Y)), (X.data[J] = Q), X);
}
function k6(X, Y, J, Q, W, K) {
  let V = X.data,
    G = V.length,
    Z = Array(G + 2),
    H = 0,
    q = 0;
  while (H < Q) Z[q++] = V[H++];
  ((Z[q++] = W), (Z[q++] = K));
  while (H < G) Z[q++] = V[H++];
  return UJ(Y, X.datamap | J, X.nodemap, Z);
}
function IY() {
  return f6;
}
function oX(X, Y) {
  let J = v0(X.root, Y, aX(Y));
  return J !== ZJ ? nX(J) : g0;
}
function v0(X, Y, J) {
  for (let W = 0; W < 32; W += HJ) {
    let K = X.data,
      V = h6(J, W);
    if (X.nodemap & V) X = K[K.length - 1 - hY(X.nodemap, V)];
    else if (X.datamap & V) {
      let G = Math.imul(hY(X.datamap, V), 2);
      return BX(Y, K[G]) ? K[G + 1] : ZJ;
    } else return ZJ;
  }
  let Q = X.data;
  for (let W = 0; W < Q.length; W += 2) if (BX(Y, Q[W])) return Q[W + 1];
  return ZJ;
}
function g6(X) {
  return { generation: _6(X), root: X.root, size: X.size, dict: X };
}
function _6(X) {
  let Y = X.root;
  if (Y[_Y] < Number.MAX_SAFE_INTEGER) return Y[_Y] + 1;
  let J = [Y];
  while (J.length) {
    let Q = J.pop();
    Q[_Y] = 0;
    let W = data.length - XQ(Q.nodemap);
    for (let K = W; K < Q.data.length; ++K) J.push(Q.data[K]);
  }
  return 1;
}
var VJ = g6(f6);
function OY(X, Y, J) {
  ((VJ.generation = _6(X)), (VJ.size = X.size));
  let Q = aX(Y),
    W = FJ(VJ, X.root, Y, J, Q, 0);
  if (W === X.root) return X;
  return new RY(VJ.size, W);
}
function FJ(X, Y, J, Q, W, K) {
  let V = Y.data,
    G = X.generation;
  if (K > 32) {
    for (let A = 0; A < V.length; A += 2) if (BX(J, V[A])) return oJ(Y, G, A + 1, Q);
    return ((X.size += 1), k6(Y, G, 0, V.length, J, Q));
  }
  let Z = h6(W, K);
  if (Y.nodemap & Z) {
    let A = V.length - 1 - hY(Y.nodemap, Z),
      D = V[A];
    return ((D = FJ(X, D, J, Q, W, K + HJ)), oJ(Y, G, A, D));
  }
  let H = Math.imul(hY(Y.datamap, Z), 2);
  if ((Y.datamap & Z) === 0) return ((X.size += 1), k6(Y, G, Z, H, J, Q));
  if (BX(J, V[H])) return oJ(Y, G, H + 1, Q);
  let q = K + HJ,
    U = b6;
  U = FJ(X, U, J, Q, W, q);
  let I = V[H],
    j = V[H + 1],
    z = aX(I);
  ((U = FJ(X, U, I, j, z, q)), (X.size -= 1));
  let S = V.length,
    N = S - 1 - hY(Y.nodemap, Z),
    P = Array(S - 1),
    L = 0,
    B = 0;
  while (L < H) P[B++] = V[L++];
  L += 2;
  while (L <= N) P[B++] = V[L++];
  P[B++] = U;
  while (L < S) P[B++] = V[L++];
  return UJ(G, Y.datamap ^ Z, Y.nodemap | Z, P);
}
function GY(X, Y, J) {
  let Q = [X.root];
  while (Q.length) {
    let W = Q.pop(),
      K = W.data,
      V = K.length - XQ(W.nodemap);
    for (let G = 0; G < V; G += 2) Y = J(Y, K[G], K[G + 1]);
    for (let G = V; G < K.length; ++G) Q.push(K[G]);
  }
  return Y;
}
function XQ(X) {
  return (
    (X -= (X >>> 1) & 1431655765),
    (X = (X & 858993459) + ((X >>> 2) & 858993459)),
    Math.imul((X + (X >>> 4)) & 252645135, 16843009) >>> 24
  );
}
function hY(X, Y) {
  return XQ(X & (Y - 1));
}
function h6(X, Y) {
  return 1 << ((X >>> Y) & f0);
}
class zX extends R {
  constructor(X) {
    super();
    this[0] = X;
  }
}
var MJ = (X) => X instanceof zX,
  qJ = (X) => X[0];
class e extends R {}
function vY(X) {
  return GY(X, F([]), (Y, J, Q) => {
    return M(J, Y);
  });
}
class QX extends R {}
var m6 = () => new QX();
class WX extends R {}
var $6 = () => new WX();
class VY extends R {}
var u6 = () => new VY();
class KX extends R {}
class DY extends R {}
function mY(X, Y) {
  while (!0) {
    let J = X,
      Q = Y;
    if (J instanceof T) return Q;
    else {
      let W = J.head;
      ((X = J.tail), (Y = M(W, Q)));
    }
  }
}
function YX(X) {
  return mY(X, F([]));
}
function s0(X, Y, J) {
  while (!0) {
    let Q = X,
      W = Y,
      K = J;
    if (Q instanceof T) return YX(K);
    else {
      let V = Q.head;
      ((X = Q.tail), (Y = W), (J = M(W(V), K)));
    }
  }
}
function $Y(X, Y) {
  return s0(X, Y, F([]));
}
function r0(X, Y) {
  while (!0) {
    let J = X,
      Q = Y;
    if (J instanceof T) return Q;
    else {
      let W = J.head;
      ((X = J.tail), (Y = M(W, Q)));
    }
  }
}
function YQ(X, Y) {
  return r0(YX(X), Y);
}
function NJ(X, Y) {
  return M(Y, X);
}
function RX(X, Y, J) {
  while (!0) {
    let Q = X,
      W = Y,
      K = J;
    if (Q instanceof T) return W;
    else {
      let V = Q.head;
      ((X = Q.tail), (Y = K(W, V)), (J = K));
    }
  }
}
function i0(X, Y, J, Q, W, K) {
  while (!0) {
    let V = X,
      G = Y,
      Z = J,
      H = Q,
      q = W,
      U = K,
      I = M(q, Z);
    if (V instanceof T)
      if (H instanceof KX) return M(YX(I), U);
      else return M(I, U);
    else {
      let { head: j, tail: z } = V,
        S = G(q, j);
      if (H instanceof KX)
        if (S instanceof QX) ((X = z), (Y = G), (J = I), (Q = H), (W = j), (K = U));
        else if (S instanceof WX) ((X = z), (Y = G), (J = I), (Q = H), (W = j), (K = U));
        else {
          let N;
          if (H instanceof KX) N = M(YX(I), U);
          else N = M(I, U);
          let P = N;
          if (z instanceof T) return M(F([j]), P);
          else {
            let { head: L, tail: B } = z,
              A,
              D = G(j, L);
            if (D instanceof QX) A = new KX();
            else if (D instanceof WX) A = new KX();
            else A = new DY();
            let k = A;
            ((X = B), (Y = G), (J = F([j])), (Q = k), (W = L), (K = P));
          }
        }
      else if (S instanceof QX) {
        let N;
        if (H instanceof KX) N = M(YX(I), U);
        else N = M(I, U);
        let P = N;
        if (z instanceof T) return M(F([j]), P);
        else {
          let { head: L, tail: B } = z,
            A,
            D = G(j, L);
          if (D instanceof QX) A = new KX();
          else if (D instanceof WX) A = new KX();
          else A = new DY();
          let k = A;
          ((X = B), (Y = G), (J = F([j])), (Q = k), (W = L), (K = P));
        }
      } else if (S instanceof WX) {
        let N;
        if (H instanceof KX) N = M(YX(I), U);
        else N = M(I, U);
        let P = N;
        if (z instanceof T) return M(F([j]), P);
        else {
          let { head: L, tail: B } = z,
            A,
            D = G(j, L);
          if (D instanceof QX) A = new KX();
          else if (D instanceof WX) A = new KX();
          else A = new DY();
          let k = A;
          ((X = B), (Y = G), (J = F([j])), (Q = k), (W = L), (K = P));
        }
      } else ((X = z), (Y = G), (J = I), (Q = H), (W = j), (K = U));
    }
  }
}
function n0(X, Y, J, Q) {
  while (!0) {
    let W = X,
      K = Y,
      V = J,
      G = Q;
    if (W instanceof T) return mY(K, G);
    else if (K instanceof T) return mY(W, G);
    else {
      let { head: Z, tail: H } = W,
        q = K.head,
        U = K.tail,
        I = V(Z, q);
      if (I instanceof QX) ((X = H), (Y = K), (J = V), (Q = M(Z, G)));
      else if (I instanceof WX) ((X = W), (Y = U), (J = V), (Q = M(q, G)));
      else ((X = W), (Y = U), (J = V), (Q = M(q, G)));
    }
  }
}
function l0(X, Y, J) {
  while (!0) {
    let Q = X,
      W = Y,
      K = J;
    if (Q instanceof T) return YX(K);
    else {
      let V = Q.tail;
      if (V instanceof T) {
        let G = Q.head;
        return YX(M(YX(G), K));
      } else {
        let G = Q.head,
          Z = V.head,
          H = V.tail,
          q = n0(G, Z, W, F([]));
        ((X = H), (Y = W), (J = M(q, K)));
      }
    }
  }
}
function a0(X, Y, J, Q) {
  while (!0) {
    let W = X,
      K = Y,
      V = J,
      G = Q;
    if (W instanceof T) return mY(K, G);
    else if (K instanceof T) return mY(W, G);
    else {
      let { head: Z, tail: H } = W,
        q = K.head,
        U = K.tail,
        I = V(Z, q);
      if (I instanceof QX) ((X = W), (Y = U), (J = V), (Q = M(q, G)));
      else if (I instanceof WX) ((X = H), (Y = K), (J = V), (Q = M(Z, G)));
      else ((X = H), (Y = K), (J = V), (Q = M(Z, G)));
    }
  }
}
function o0(X, Y, J) {
  while (!0) {
    let Q = X,
      W = Y,
      K = J;
    if (Q instanceof T) return YX(K);
    else {
      let V = Q.tail;
      if (V instanceof T) {
        let G = Q.head;
        return YX(M(YX(G), K));
      } else {
        let G = Q.head,
          Z = V.head,
          H = V.tail,
          q = a0(G, Z, W, F([]));
        ((X = H), (Y = W), (J = M(q, K)));
      }
    }
  }
}
function t0(X, Y, J) {
  while (!0) {
    let Q = X,
      W = Y,
      K = J;
    if (Q instanceof T) return Q;
    else if (W instanceof KX)
      if (Q.tail instanceof T) return Q.head;
      else ((X = l0(Q, K, F([]))), (Y = new DY()), (J = K));
    else if (Q.tail instanceof T) {
      let G = Q.head;
      return YX(G);
    } else ((X = o0(Q, K, F([]))), (Y = new KX()), (J = K));
  }
}
function r6(X, Y) {
  if (X instanceof T) return X;
  else {
    let J = X.tail;
    if (J instanceof T) return X;
    else {
      let Q = X.head,
        W = J.head,
        K = J.tail,
        V,
        G = Y(Q, W);
      if (G instanceof QX) V = new KX();
      else if (G instanceof WX) V = new KX();
      else V = new DY();
      let Z = V,
        H = i0(K, Y, F([Q]), Z, W, F([]));
      return t0(H, new KX(), Y);
    }
  }
}
function i6(X, Y) {
  while (!0) {
    let J = X,
      Q = Y;
    if (J instanceof T) return;
    else {
      let { head: W, tail: K } = J;
      (Q(W), (X = K), (Y = Q));
    }
  }
}
function QW(X, Y) {
  while (!0) {
    let J = X,
      Q = Y;
    if (J instanceof T) return Q;
    else {
      let W = J.head;
      ((X = J.tail), (Y = Q + W));
    }
  }
}
function l6(X) {
  return QW(X, "");
}
function a6(X, Y) {
  if (Y === "") return JQ(X);
  else {
    let Q = t(X),
      W = QQ(Q, Y);
    return $Y(W, t);
  }
}
class KQ extends R {
  constructor(X) {
    super();
    this.function = X;
  }
}
function TY(X, Y) {
  let J = Y.function(X),
    Q,
    W;
  if (((Q = J[0]), (W = J[1]), W instanceof T)) return new n(Q);
  else return new JX(W);
}
function GQ(X) {
  return new KQ((Y) => {
    return [X, F([])];
  });
}
function zJ(X, Y) {
  return new KQ((J) => {
    let Q = X.function(J),
      W,
      K;
    return ((W = Q[0]), (K = Q[1]), [Y(W), K]);
  });
}
function t(X) {
  return X;
}
function BY(X) {
  return X.toString();
}
function JQ(X) {
  let Y = ZW(X);
  if (Y) return VQ(Array.from(Y).map((J) => J.segment));
  else return VQ(X.match(/./gsu));
}
var e6 = void 0;
function ZW(X) {
  if (globalThis.Intl && Intl.Segmenter)
    return ((e6 ||= new Intl.Segmenter()), e6.segment(X)[Symbol.iterator]());
}
function QQ(X, Y) {
  return VQ(X.split(Y));
}
function WQ(X, Y) {
  return X.startsWith(Y);
}
var X8 = [
    " ",
    "\t",
    `
`,
    "\v",
    "\f",
    "\r",
    "",
    "\u2028",
    "\u2029",
  ].join(""),
  rG = new RegExp(`^[${X8}]*`),
  iG = new RegExp(`[${X8}]*$`);
function s6(X) {
  let Y = X.toString().replace("+", "");
  if (Y.indexOf(".") >= 0) return Y;
  else {
    let J = Y.indexOf("e");
    if (J >= 0) return Y.slice(0, J) + ".0" + Y.slice(J);
    else return Y + ".0";
  }
}
class FW {
  #X = new Set();
  inspect(X) {
    let Y = typeof X;
    if (X === !0) return "True";
    if (X === !1) return "False";
    if (X === null) return "//js(null)";
    if (X === void 0) return "Nil";
    if (Y === "string") return this.#Q(X);
    if (Y === "bigint" || Number.isInteger(X)) return X.toString();
    if (Y === "number") return s6(X);
    if (X instanceof iJ) return this.#K(X);
    if (X instanceof KJ) return this.#Z(X);
    if (X instanceof RegExp) return `//js(${X})`;
    if (X instanceof Date) return `//js(Date("${X.toISOString()}"))`;
    if (X instanceof globalThis.Error) return `//js(${X.toString()})`;
    if (X instanceof Function) {
      let Q = [];
      for (let W of Array(X.length).keys()) Q.push(String.fromCharCode(W + 97));
      return `//fn(${Q.join(", ")}) { ... }`;
    }
    if (this.#X.size === this.#X.add(X).size) return "//js(circular reference)";
    let J;
    if (Array.isArray(X)) J = `#(${X.map((Q) => this.inspect(Q)).join(", ")})`;
    else if (HW(X)) J = this.#Y(X);
    else if (X instanceof R) J = this.#J(X);
    else if (X instanceof RY) J = this.#W(X);
    else if (X instanceof Set) return `//js(Set(${[...X].map((Q) => this.inspect(Q)).join(", ")}))`;
    else J = this.#V(X);
    return (this.#X.delete(X), J);
  }
  #V(X) {
    let Y = Object.getPrototypeOf(X)?.constructor?.name || "Object",
      J = [];
    for (let K of Object.keys(X)) J.push(`${this.inspect(K)}: ${this.inspect(X[K])}`);
    let Q = J.length ? " " + J.join(", ") + " " : "";
    return `//js(${Y === "Object" ? "" : Y + " "}{${Q}})`;
  }
  #W(X) {
    let Y = "dict.from_list([",
      J = !0;
    return (
      (Y = GY(X, Y, (Q, W, K) => {
        if (!J) Q = Q + ", ";
        return ((J = !1), Q + "#(" + this.inspect(W) + ", " + this.inspect(K) + ")");
      })),
      Y + "])"
    );
  }
  #J(X) {
    let Y = Object.keys(X)
      .map((J) => {
        let Q = this.inspect(X[J]);
        return isNaN(parseInt(J)) ? `${J}: ${Q}` : Q;
      })
      .join(", ");
    return Y ? `${X.constructor.name}(${Y})` : X.constructor.name;
  }
  #Y(X) {
    if (rJ(X)) return "[]";
    let Y = 'charlist.from_string("',
      J = "[",
      Q = X;
    while (KY(Q)) {
      let W = Q.head;
      if (((Q = Q.tail), J !== "[")) J += ", ";
      if (((J += this.inspect(W)), Y))
        if (Number.isInteger(W) && W >= 32 && W <= 126) Y += String.fromCharCode(W);
        else Y = null;
    }
    if (Y) return Y + '")';
    else return J + "]";
  }
  #Q(X) {
    let Y = '"';
    for (let J = 0; J < X.length; J++) {
      let Q = X[J];
      switch (Q) {
        case `
`:
          Y += "\\n";
          break;
        case "\r":
          Y += "\\r";
          break;
        case "\t":
          Y += "\\t";
          break;
        case "\f":
          Y += "\\f";
          break;
        case "\\":
          Y += "\\\\";
          break;
        case '"':
          Y += '\\"';
          break;
        default:
          if (Q < " " || (Q > "~" && Q < " "))
            Y += "\\u{" + Q.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0") + "}";
          else Y += Q;
      }
    }
    return ((Y += '"'), Y);
  }
  #K(X) {
    return `//utfcodepoint(${String.fromCodePoint(X.value)})`;
  }
  #Z(X) {
    if (X.bitSize === 0) return "<<>>";
    let Y = "<<";
    for (let J = 0; J < X.byteSize - 1; J++) ((Y += X.byteAt(J).toString()), (Y += ", "));
    if (X.byteSize * 8 === X.bitSize) Y += X.byteAt(X.byteSize - 1).toString();
    else {
      let J = X.bitSize % 8;
      ((Y += X.byteAt(X.byteSize - 1) >> (8 - J)), (Y += `:size(${J})`));
    }
    return ((Y += ">>"), Y);
  }
}
function VQ(X) {
  let Y = w6(),
    J = X.length;
  while (J--) Y = zY(X[J], Y);
  return Y;
}
function HW(X) {
  return rJ(X) || KY(X);
}
function J8(X, Y, J) {
  if (X) return Y;
  else return J();
}
function UX(X) {
  return X;
}
function W8(X) {
  return X.replaceAll(/[><&"']/g, (Y) => {
    switch (Y) {
      case ">":
        return "&gt;";
      case "<":
        return "&lt;";
      case "'":
        return "&#39;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      default:
        return Y;
    }
  });
}
function K8(X) {
  return W8(X);
}
function OJ(X) {
  return K8(X);
}
var C = F([]),
  AY = new JX(void 0);
var TW = u6(),
  AW = m6(),
  SW = $6();
function jJ(X, Y) {
  if (X.name === Y.name) return SW;
  else if (X.name < Y.name) return AW;
  else return TW;
}
class wX extends R {
  constructor(X, Y, J) {
    super();
    ((this.kind = X), (this.name = Y), (this.value = J));
  }
}
class cY extends R {
  constructor(X, Y, J) {
    super();
    ((this.kind = X), (this.name = Y), (this.value = J));
  }
}
class GX extends R {
  constructor(X, Y, J, Q, W, K, V, G) {
    super();
    ((this.kind = X),
      (this.name = Y),
      (this.handler = J),
      (this.include = Q),
      (this.prevent_default = W),
      (this.stop_propagation = K),
      (this.debounce = V),
      (this.throttle = G));
  }
}
class pY extends R {
  constructor(X, Y, J) {
    super();
    ((this.prevent_default = X), (this.stop_propagation = Y), (this.message = J));
  }
}
class M8 extends R {
  constructor(X) {
    super();
    this.kind = X;
  }
}
var MQ = 0,
  q8 = 1,
  qQ = 2,
  NQ = 0,
  zQ = new M8(NQ);
var RQ = 2;
function wW(X, Y) {
  while (!0) {
    let J = X,
      Q = Y;
    if (J instanceof T) return Q;
    else {
      let W = J.head;
      if (W instanceof wX) {
        let K = W.name;
        if (K === "") ((X = J.tail), (Y = Q));
        else if (K === "class") {
          let V = W.value;
          if (V === "") ((X = J.tail), (Y = Q));
          else {
            let G = J.tail;
            if (G instanceof T) {
              let Z = W;
              ((X = G), (Y = M(Z, Q)));
            } else {
              let Z = G.head;
              if (Z instanceof wX)
                if (Z.name === "class") {
                  let q = W.kind,
                    U = V,
                    I = G.tail,
                    j = Z.value,
                    z = U + " " + j,
                    S = new wX(q, "class", z);
                  ((X = M(S, I)), (Y = Q));
                } else {
                  let q = W;
                  ((X = G), (Y = M(q, Q)));
                }
              else {
                let H = W;
                ((X = G), (Y = M(H, Q)));
              }
            }
          }
        } else if (K === "style") {
          let V = W.value;
          if (V === "") ((X = J.tail), (Y = Q));
          else {
            let G = J.tail;
            if (G instanceof T) {
              let Z = W;
              ((X = G), (Y = M(Z, Q)));
            } else {
              let Z = G.head;
              if (Z instanceof wX)
                if (Z.name === "style") {
                  let q = W.kind,
                    U = V,
                    I = G.tail,
                    j = Z.value,
                    z = U + ";" + j,
                    S = new wX(q, "style", z);
                  ((X = M(S, I)), (Y = Q));
                } else {
                  let q = W;
                  ((X = G), (Y = M(q, Q)));
                }
              else {
                let H = W;
                ((X = G), (Y = M(H, Q)));
              }
            }
          }
        } else {
          let V = W;
          ((X = J.tail), (Y = M(V, Q)));
        }
      } else {
        let K = W;
        ((X = J.tail), (Y = M(K, Q)));
      }
    }
  }
}
function N8(X) {
  if (X instanceof T) return X;
  else if (X.tail instanceof T) return X;
  else {
    let Q = r6(X, (W, K) => {
      return jJ(K, W);
    });
    return wW(Q, C);
  }
}
function z8(X, Y) {
  return new wX(MQ, X, Y);
}
function R8(X, Y, J, Q, W, K, V) {
  return new GX(qQ, X, Y, J, Q, W, K, V);
}
function _X(X, Y) {
  return z8(X, Y);
}
function w(X) {
  return _X("class", X);
}
function BJ(X) {
  return _X("alt", X);
}
function DJ(X) {
  return _X("src", X);
}
class IQ extends R {
  constructor(X, Y, J) {
    super();
    ((this.synchronous = X), (this.before_paint = Y), (this.after_paint = J));
  }
}
class I8 extends R {
  constructor(X, Y, J, Q, W) {
    super();
    ((this.dispatch = X), (this.emit = Y), (this.select = J), (this.root = Q), (this.provide = W));
  }
}
var O8 = new IQ(F([]), F([]), F([]));
function j8(X, Y, J, Q, W, K) {
  let V = new I8(Y, J, Q, W, K);
  return i6(X.synchronous, (G) => {
    return G(V);
  });
}
function EX() {
  return O8;
}
function B8(X) {
  return RX(X, O8, (Y, J) => {
    return new IQ(
      RX(J.synchronous, Y.synchronous, NJ),
      RX(J.before_paint, Y.before_paint, NJ),
      RX(J.after_paint, Y.after_paint, NJ),
    );
  });
}
function o() {
  return null;
}
function MY(X, Y) {
  return X?.get(Y);
}
function PY(X, Y, J) {
  return X?.get(Y) ?? J();
}
function hX(X, Y) {
  return X && X.has(Y);
}
function TX(X, Y, J) {
  return ((X ??= new Map()), X.set(Y, J), X);
}
function TJ(X, Y) {
  return (X?.delete(Y), X);
}
function D8(X, Y) {
  if (typeof X === "number" && typeof Y === "number") return X === Y || (X !== X && Y !== Y);
  return X === Y;
}
function T8(X, Y) {
  while (!0) {
    let J = X,
      Q = Y;
    if (J instanceof T)
      if (Q instanceof T) return !0;
      else return !1;
    else if (Q instanceof T) return !1;
    else {
      let { head: W, tail: K } = J,
        V = Q.head,
        G = Q.tail,
        Z = D8(W, V);
      if (Z) ((X = K), (Y = G));
      else return Z;
    }
  }
}
class vX extends R {
  constructor(X, Y, J, Q) {
    super();
    ((this.kind = X), (this.key = Y), (this.children = J), (this.keyed_children = Q));
  }
}
class xX extends R {
  constructor(X, Y, J, Q, W, K, V, G, Z) {
    super();
    ((this.kind = X),
      (this.key = Y),
      (this.namespace = J),
      (this.tag = Q),
      (this.attributes = W),
      (this.children = K),
      (this.keyed_children = V),
      (this.self_closing = G),
      (this.void = Z));
  }
}
class mX extends R {
  constructor(X, Y, J) {
    super();
    ((this.kind = X), (this.key = Y), (this.content = J));
  }
}
class dX extends R {
  constructor(X, Y, J, Q, W, K) {
    super();
    ((this.kind = X),
      (this.key = Y),
      (this.namespace = J),
      (this.tag = Q),
      (this.attributes = W),
      (this.inner_html = K));
  }
}
class AX extends R {
  constructor(X, Y, J, Q) {
    super();
    ((this.kind = X), (this.key = Y), (this.mapper = J), (this.child = Q));
  }
}
class LY extends R {
  constructor(X, Y, J, Q) {
    super();
    ((this.kind = X), (this.key = Y), (this.dependencies = J), (this.view = Q));
  }
}
var CY = 0,
  qY = 1,
  wY = 2,
  A8 = 3,
  tX = 4,
  jQ = 5;
function sY(X, Y) {
  if (Y === "")
    if (X === "area") return !0;
    else if (X === "base") return !0;
    else if (X === "br") return !0;
    else if (X === "col") return !0;
    else if (X === "embed") return !0;
    else if (X === "hr") return !0;
    else if (X === "img") return !0;
    else if (X === "input") return !0;
    else if (X === "link") return !0;
    else if (X === "meta") return !0;
    else if (X === "param") return !0;
    else if (X === "source") return !0;
    else if (X === "track") return !0;
    else if (X === "wbr") return !0;
    else return !1;
  else return !1;
}
function AJ(X, Y) {
  if (Y instanceof vX) return new vX(Y.kind, X, Y.children, Y.keyed_children);
  else if (Y instanceof xX)
    return new xX(
      Y.kind,
      X,
      Y.namespace,
      Y.tag,
      Y.attributes,
      Y.children,
      Y.keyed_children,
      Y.self_closing,
      Y.void,
    );
  else if (Y instanceof mX) return new mX(Y.kind, X, Y.content);
  else if (Y instanceof dX)
    return new dX(Y.kind, X, Y.namespace, Y.tag, Y.attributes, Y.inner_html);
  else if (Y instanceof AX) {
    let J = Y.child;
    return new AX(Y.kind, X, Y.mapper, AJ(X, J));
  } else {
    let J = Y.view;
    return new LY(Y.kind, X, Y.dependencies, () => {
      return AJ(X, J());
    });
  }
}
function BQ(X, Y, J) {
  return new vX(CY, X, Y, J);
}
function rY(X, Y, J, Q, W, K, V, G) {
  return new xX(qY, X, Y, J, N8(Q), W, K, V, G);
}
function DQ(X, Y) {
  return new mX(wY, X, Y);
}
function S8(X, Y) {
  if (X instanceof AX) {
    let J = X.mapper;
    return new AX(
      tX,
      X.key,
      (Q) => {
        return UX(Y)(J(Q));
      },
      UX(X.child),
    );
  } else return new AX(tX, X.key, UX(Y), UX(X));
}
function P8(X, Y, J) {
  return new LY(jQ, X, Y, J);
}
function MX(X, Y, J) {
  return rY("", "", X, Y, J, o(), !1, sY(X, ""));
}
function O(X) {
  return DQ("", X);
}
function L8() {
  return DQ("", "");
}
function C8(X, Y) {
  return P8("", X, Y);
}
function w8(X) {
  return UX(X);
}
function E8(X, Y) {
  return S8(X, Y);
}
function x8(X, Y) {
  return MX("footer", X, Y);
}
function TQ(X, Y) {
  return MX("h2", X, Y);
}
function SJ(X, Y) {
  return MX("h3", X, Y);
}
function k8(X, Y) {
  return MX("main", X, Y);
}
function PJ(X, Y) {
  return MX("section", X, Y);
}
function a(X, Y) {
  return MX("div", X, Y);
}
function LJ(X, Y) {
  return MX("p", X, Y);
}
function y8(X, Y) {
  return MX("pre", X, Y);
}
function kX(X, Y) {
  return MX("span", X, Y);
}
function CJ(X) {
  return MX("img", X, C);
}
function AQ(X, Y) {
  return MX("button", X, Y);
}
class nY extends R {
  constructor(X, Y, J, Q) {
    super();
    ((this.index = X), (this.removed = Y), (this.changes = J), (this.children = Q));
  }
}
class f8 extends R {
  constructor(X, Y) {
    super();
    ((this.kind = X), (this.content = Y));
  }
}
class g8 extends R {
  constructor(X, Y) {
    super();
    ((this.kind = X), (this.inner_html = Y));
  }
}
class _8 extends R {
  constructor(X, Y, J) {
    super();
    ((this.kind = X), (this.added = Y), (this.removed = J));
  }
}
class h8 extends R {
  constructor(X, Y, J) {
    super();
    ((this.kind = X), (this.key = Y), (this.before = J));
  }
}
class v8 extends R {
  constructor(X, Y, J) {
    super();
    ((this.kind = X), (this.index = Y), (this.with = J));
  }
}
class m8 extends R {
  constructor(X, Y) {
    super();
    ((this.kind = X), (this.index = Y));
  }
}
class $8 extends R {
  constructor(X, Y, J) {
    super();
    ((this.kind = X), (this.children = Y), (this.before = J));
  }
}
var SQ = 0,
  PQ = 1,
  LQ = 2,
  CQ = 3,
  wQ = 4,
  EQ = 5,
  xQ = 6;
function kQ(X, Y, J, Q) {
  return new nY(X, Y, J, Q);
}
function u8(X) {
  return new f8(SQ, X);
}
function c8(X) {
  return new g8(PQ, X);
}
function yQ(X, Y) {
  return new _8(LQ, X, Y);
}
function p8(X, Y) {
  return new h8(CQ, X, Y);
}
function d8(X) {
  return new m8(wQ, X);
}
function sX(X, Y) {
  return new v8(EQ, X, Y);
}
function bQ(X, Y) {
  return new $8(xQ, X, Y);
}
class r8 extends R {
  constructor(X, Y, J, Q, W, K, V, G, Z) {
    super();
    ((this.kind = X),
      (this.open_shadow_root = Y),
      (this.will_adopt_styles = J),
      (this.observed_attributes = Q),
      (this.observed_properties = W),
      (this.requested_contexts = K),
      (this.provided_contexts = V),
      (this.vdom = G),
      (this.memos = Z));
  }
}
class i8 extends R {
  constructor(X, Y, J) {
    super();
    ((this.kind = X), (this.patch = Y), (this.memos = J));
  }
}
class n8 extends R {
  constructor(X, Y, J) {
    super();
    ((this.kind = X), (this.name = Y), (this.data = J));
  }
}
class l8 extends R {
  constructor(X, Y, J) {
    super();
    ((this.kind = X), (this.key = Y), (this.value = J));
  }
}
class a8 extends R {
  constructor(X, Y) {
    super();
    ((this.kind = X), (this.messages = Y));
  }
}
var o8 = (X) => X instanceof a8;
class t8 extends R {
  constructor(X, Y, J) {
    super();
    ((this.kind = X), (this.name = Y), (this.value = J));
  }
}
var e8 = (X) => X instanceof t8;
class X9 extends R {
  constructor(X, Y, J) {
    super();
    ((this.kind = X), (this.name = Y), (this.value = J));
  }
}
var Y9 = (X) => X instanceof X9;
class J9 extends R {
  constructor(X, Y, J, Q) {
    super();
    ((this.kind = X), (this.path = Y), (this.name = J), (this.event = Q));
  }
}
var Q9 = (X) => X instanceof J9;
class W9 extends R {
  constructor(X, Y, J) {
    super();
    ((this.kind = X), (this.key = Y), (this.value = J));
  }
}
var K9 = (X) => X instanceof W9;
var mW = 0,
  $W = 1,
  uW = 2,
  cW = 3;
function G9(X, Y, J, Q, W, K, V, G) {
  return new r8(mW, X, Y, J, Q, W, K, V, G);
}
function fQ(X, Y) {
  return new i8($W, X, Y);
}
function V9(X, Y) {
  return new n8(uW, X, Y);
}
function Z9(X, Y) {
  return new l8(cW, X, Y);
}
class gQ extends R {}
class _Q extends R {
  constructor(X, Y) {
    super();
    ((this.key = X), (this.parent = Y));
  }
}
class hQ extends R {
  constructor(X, Y) {
    super();
    ((this.index = X), (this.parent = Y));
  }
}
class U9 extends R {
  constructor(X) {
    super();
    this.parent = X;
  }
}
var EJ = new gQ(),
  wJ = "\t",
  xJ = "\r",
  vQ = `
`;
function pW(X, Y) {
  while (!0) {
    let J = X,
      Q = Y;
    if (Q instanceof T) return !1;
    else {
      let { head: W, tail: K } = Q,
        V = WQ(J, W);
      if (V) return V;
      else ((X = J), (Y = K));
    }
  }
}
function qX(X, Y, J) {
  if (J === "") return new hQ(Y, X);
  else return new _Q(J, X);
}
function kJ(X) {
  return new U9(X);
}
function H9(X) {
  if (X instanceof T) return "";
  else {
    let Y = X.tail;
    return l6(Y);
  }
}
function M9(X) {
  return a6(X, xJ);
}
function mQ(X, Y, J) {
  while (!0) {
    let Q = X,
      W = Y,
      K = J;
    if (W instanceof gQ) return H9(K);
    else if (W instanceof _Q) {
      let { key: V, parent: G } = W;
      ((X = Q), (Y = G), (J = M(wJ, M(V, K))));
    } else if (W instanceof hQ) {
      let { index: V, parent: G } = W,
        Z = M(wJ, M(BY(V), K));
      ((X = Q), (Y = G), (J = Z));
    } else if (!Q) return H9(K);
    else {
      let V = W.parent;
      if (K instanceof T) ((X = Q), (Y = V), (J = K));
      else {
        let G = K.tail;
        ((X = Q), (Y = V), (J = M(xJ, G)));
      }
    }
  }
}
function lY(X) {
  return mQ(!1, X, C);
}
function dW(X) {
  return mQ(!0, X, C);
}
function q9(X, Y) {
  if (Y instanceof T) return !1;
  else return pW(dW(X), Y);
}
function $Q(X, Y) {
  return mQ(!1, X, M(vQ, M(Y, C)));
}
class rX extends R {
  constructor(X, Y, J, Q, W) {
    super();
    ((this.events = X),
      (this.vdoms = Y),
      (this.old_vdoms = J),
      (this.dispatched_paths = Q),
      (this.next_dispatched_paths = W));
  }
}
class XY extends R {
  constructor(X, Y) {
    super();
    ((this.handlers = X), (this.children = Y));
  }
}
class bJ extends R {
  constructor(X, Y) {
    super();
    ((this.mapper = X), (this.events = Y));
  }
}
class I9 extends R {
  constructor(X, Y, J) {
    super();
    ((this.handlers = X), (this.children = Y), (this.vdoms = J));
  }
}
class pQ extends R {
  constructor(X, Y) {
    super();
    ((this.path = X), (this.handler = Y));
  }
}
class uQ extends R {
  constructor(X) {
    super();
    this.path = X;
  }
}
function sW(X, Y) {
  return (J) => {
    return X(Y(J));
  };
}
function O9() {
  return new XY(o(), o());
}
function dQ() {
  return new rX(O9(), o(), o(), C, C);
}
function j9(X) {
  return new rX(X.events, o(), X.vdoms, X.next_dispatched_paths, C);
}
function B9(X) {
  return X.events;
}
function D9(X, Y) {
  return new rX(Y, X.vdoms, X.old_vdoms, X.dispatched_paths, X.next_dispatched_paths);
}
function EY(X) {
  return X.vdoms;
}
function T9(X, Y, J) {
  return PY(X.old_vdoms, Y, J);
}
function A9(X, Y, J) {
  let Q = PY(X.old_vdoms, Y, J),
    W = TX(X.vdoms, J, Q);
  return new rX(X.events, W, X.old_vdoms, X.dispatched_paths, X.next_dispatched_paths);
}
function S9(X, Y, J) {
  let Q = TX(X.vdoms, Y, J);
  return new rX(X.events, Q, X.old_vdoms, X.dispatched_paths, X.next_dispatched_paths);
}
function P9(X, Y, J) {
  return PY(X.children, Y, () => {
    return new bJ(J, O9());
  }).events;
}
function L9(X, Y, J, Q) {
  let W = new bJ(J, Q),
    K = TX(X.children, Y, W);
  return new XY(X.handlers, K);
}
function C9(X, Y, J, Q) {
  return TX(X, $Q(Y, J), Q);
}
function xY(X, Y, J, Q) {
  let W = C9(X.handlers, Y, J, Q);
  return new XY(W, X.children);
}
function w9(X, Y, J) {
  return TJ(X, $Q(Y, J));
}
function fJ(X, Y, J) {
  let Q = w9(X.handlers, Y, J);
  return new XY(Q, X.children);
}
function z9(X, Y, J) {
  return RX(J, X, (Q, W) => {
    if (W instanceof GX) {
      let { name: K, handler: V } = W;
      return C9(Q, Y, K, V);
    } else return Q;
  });
}
function yJ(X, Y, J, Q, W, K) {
  while (!0) {
    let V = X,
      G = Y,
      Z = J,
      H = Q,
      q = W,
      U = K,
      I = q + 1;
    if (U instanceof T) return new I9(V, G, Z);
    else {
      let j = U.head;
      if (j instanceof vX) {
        let z = U.tail,
          S = j.key,
          N = j.children,
          P = qX(H, q, S),
          L = yJ(V, G, Z, P, 0, N),
          B,
          A,
          D;
        ((B = L.handlers),
          (A = L.children),
          (D = L.vdoms),
          (X = B),
          (Y = A),
          (J = D),
          (Q = H),
          (W = I),
          (K = z));
      } else if (j instanceof xX) {
        let z = U.tail,
          S = j.key,
          N = j.attributes,
          P = j.children,
          L = qX(H, q, S),
          B = z9(V, L, N),
          A = yJ(B, G, Z, L, 0, P),
          D,
          k,
          m;
        ((D = A.handlers),
          (k = A.children),
          (m = A.vdoms),
          (X = D),
          (Y = k),
          (J = m),
          (Q = H),
          (W = I),
          (K = z));
      } else if (j instanceof mX) {
        let z = U.tail;
        ((X = V), (Y = G), (J = Z), (Q = H), (W = I), (K = z));
      } else if (j instanceof dX) {
        let z = U.tail,
          S = j.key,
          N = j.attributes,
          P = qX(H, q, S);
        ((X = z9(V, P, N)), (Y = G), (J = Z), (Q = H), (W = I), (K = z));
      } else if (j instanceof AX) {
        let z = U.tail,
          S = j.key,
          N = j.mapper,
          P = j.child,
          L = qX(H, q, S),
          B = yJ(o(), o(), Z, kJ(L), 0, M(P, C)),
          A = B.vdoms,
          D = new XY(B.handlers, B.children),
          k = new bJ(N, D),
          m = TX(G, lY(L), k);
        ((X = V), (Y = m), (J = A), (Q = H), (W = I), (K = z));
      } else {
        let z = U.tail,
          S = j.view,
          N = S(),
          P = TX(Z, S, N),
          L = q,
          B = M(N, z);
        ((X = V), (Y = G), (J = P), (Q = H), (W = L), (K = B));
      }
    }
  }
}
function sQ(X, Y, J, Q, W) {
  let K = X.vdoms,
    V,
    G;
  ((V = Y.handlers), (G = Y.children));
  let Z = yJ(V, G, K, J, Q, W),
    H,
    q,
    U;
  return (
    (H = Z.handlers),
    (q = Z.children),
    (U = Z.vdoms),
    [new rX(X.events, U, X.old_vdoms, X.dispatched_paths, X.next_dispatched_paths), new XY(H, q)]
  );
}
function gJ(X, Y, J, Q, W) {
  let K = M(W, C);
  return sQ(X, Y, J, Q, K);
}
function E9(X) {
  let Y = dQ(),
    J = gJ(Y, Y.events, EJ, 0, X),
    Q,
    W;
  return (
    (Q = J[0]),
    (W = J[1]),
    new rX(W, Q.vdoms, Q.old_vdoms, Q.dispatched_paths, Q.next_dispatched_paths)
  );
}
function R9(X, Y, J) {
  return RX(J, X, (Q, W) => {
    if (W instanceof GX) {
      let K = W.name;
      return w9(Q, Y, K);
    } else return Q;
  });
}
function cQ(X, Y, J, Q, W, K) {
  while (!0) {
    let V = X,
      G = Y,
      Z = J,
      H = Q,
      q = W,
      U = K,
      I = q + 1;
    if (U instanceof T) return new XY(V, G);
    else {
      let j = U.head;
      if (j instanceof vX) {
        let z = U.tail,
          S = j.key,
          N = j.children,
          P = qX(H, q, S),
          L = cQ(V, G, Z, P, 0, N),
          B,
          A;
        ((B = L.handlers), (A = L.children), (X = B), (Y = A), (J = Z), (Q = H), (W = I), (K = z));
      } else if (j instanceof xX) {
        let z = U.tail,
          S = j.key,
          N = j.attributes,
          P = j.children,
          L = qX(H, q, S),
          B = R9(V, L, N),
          A = cQ(B, G, Z, L, 0, P),
          D,
          k;
        ((D = A.handlers), (k = A.children), (X = D), (Y = k), (J = Z), (Q = H), (W = I), (K = z));
      } else if (j instanceof mX) {
        let z = U.tail;
        ((X = V), (Y = G), (J = Z), (Q = H), (W = I), (K = z));
      } else if (j instanceof dX) {
        let z = U.tail,
          S = j.key,
          N = j.attributes,
          P = qX(H, q, S);
        ((X = R9(V, P, N)), (Y = G), (J = Z), (Q = H), (W = I), (K = z));
      } else if (j instanceof AX) {
        let z = U.tail,
          S = j.key,
          N = qX(H, q, S),
          P = TJ(G, lY(N));
        ((X = V), (Y = P), (J = Z), (Q = H), (W = I), (K = z));
      } else {
        let z = U.tail,
          S = j.view;
        if (hX(Z, S)) {
          let P = MY(Z, S),
            L = M(P, z);
          ((X = V), (Y = G), (J = Z), (Q = H), (W = q), (K = L));
        } else ((X = V), (Y = G), (J = Z), (Q = H), (W = I), (K = z));
      }
    }
  }
}
function _J(X, Y, J, Q, W) {
  return cQ(Y.handlers, Y.children, X.old_vdoms, J, Q, M(W, C));
}
function iX(X, Y, J, Q, W, K) {
  let V = _J(X, Y, J, Q, W);
  return gJ(X, V, J, Q, K);
}
function rQ(X, Y) {
  let J = M(Y.path, X.next_dispatched_paths),
    Q = new rX(X.events, X.vdoms, X.old_vdoms, X.dispatched_paths, J);
  if (Y instanceof pQ) {
    let W = Y.handler;
    return [Q, new n(W)];
  } else return [Q, AY];
}
function hJ(X, Y) {
  return q9(Y, X.dispatched_paths);
}
function rW(X, Y, J) {
  while (!0) {
    let Q = X,
      W = Y,
      K = J;
    if (W instanceof T) return AY;
    else {
      let V = W.tail;
      if (V instanceof T) {
        let G = W.head;
        if (hX(Q.handlers, G)) {
          let H = MY(Q.handlers, G);
          return new n(
            zJ(H, (q) => {
              return new pY(q.prevent_default, q.stop_propagation, UX(K)(q.message));
            }),
          );
        } else return AY;
      } else {
        let G = W.head,
          Z = V;
        if (hX(Q.children, G)) {
          let q = MY(Q.children, G),
            U = sW(K, q.mapper);
          ((X = q.events), (Y = Z), (J = U));
        } else return AY;
      }
    }
  }
}
function iQ(X, Y, J, Q) {
  let W = M9(Y + vQ + J),
    K = rW(X.events, W, UX);
  if (K instanceof n) {
    let V = K[0],
      G = TY(Q, V);
    if (G instanceof n) {
      let Z = G[0];
      return new pQ(Y, Z);
    } else return new uQ(Y);
  } else return new uQ(Y);
}
function x9(X, Y, J, Q) {
  let W = iQ(X, Y, J, Q);
  return ((K) => {
    return rQ(X, K);
  })(W);
}
class k9 extends R {
  constructor(X) {
    super();
    this.message = X;
  }
}
var y9 = (X) => X instanceof k9;
class b9 extends R {
  constructor(X) {
    super();
    this.callback = X;
  }
}
var f9 = (X) => X instanceof b9;
class g9 extends R {
  constructor(X) {
    super();
    this.callback = X;
  }
}
var _9 = (X) => X instanceof g9;
class mJ extends R {
  constructor(X) {
    super();
    this.message = X;
  }
}
var h9 = (X) => new mJ(X),
  aY = (X) => X instanceof mJ;
class nQ extends R {
  constructor(X, Y) {
    super();
    ((this.name = X), (this.data = Y));
  }
}
var v9 = (X, Y) => new nQ(X, Y),
  oY = (X) => X instanceof nQ;
class lQ extends R {
  constructor(X, Y) {
    super();
    ((this.key = X), (this.value = Y));
  }
}
var m9 = (X, Y) => new lQ(X, Y),
  $9 = (X) => X instanceof lQ;
class aQ extends R {}
var tY = (X) => X instanceof aQ;
class oQ extends R {
  constructor(X, Y, J, Q, W) {
    super();
    ((this.name = X), (this.init = Y), (this.update = J), (this.view = Q), (this.config = W));
  }
}
class tQ extends R {
  constructor(X, Y, J, Q, W, K, V, G, Z, H, q, U, I) {
    super();
    ((this.open_shadow_root = X),
      (this.adopt_styles = Y),
      (this.delegates_focus = J),
      (this.attributes = Q),
      (this.properties = W),
      (this.contexts = K),
      (this.is_form_associated = V),
      (this.on_form_autofill = G),
      (this.on_form_reset = Z),
      (this.on_form_restore = H),
      (this.on_connect = q),
      (this.on_adopt = U),
      (this.on_disconnect = I));
  }
}
var c9 = new tQ(!0, !0, !1, C, C, C, !1, new e(), new e(), new e(), new e(), new e(), new e());
var yX = (X, Y) => {
    if (X === Y) return !0;
    if (X == null || Y == null) return !1;
    let J = typeof X;
    if (J !== typeof Y) return !1;
    if (J !== "object") return !1;
    if (X.constructor !== Y.constructor) return !1;
    if (Array.isArray(X)) return iW(X, Y);
    return nW(X, Y);
  },
  iW = (X, Y) => {
    let J = X.length;
    if (J !== Y.length) return !1;
    while (J--) if (!yX(X[J], Y[J])) return !1;
    return !0;
  },
  nW = (X, Y) => {
    let J = Object.keys(X),
      Q = J.length;
    if (Object.keys(Y).length !== Q) return !1;
    while (Q--) {
      let W = J[Q];
      if (!Object.hasOwn(Y, W)) return !1;
      if (!yX(X[W], Y[W])) return !1;
    }
    return !0;
  };
class s9 extends R {
  constructor(X, Y) {
    super();
    ((this.patch = X), (this.cache = Y));
  }
}
class eQ extends R {
  constructor(X, Y, J) {
    super();
    ((this.patch = X), (this.cache = Y), (this.events = J));
  }
}
class r9 extends R {
  constructor(X, Y, J) {
    super();
    ((this.added = X), (this.removed = Y), (this.events = J));
  }
}
function lW(X, Y, J, Q) {
  if (J === "input" && Y === "") return hJ(X, Q);
  else if (J === "select" && Y === "") return hJ(X, Q);
  else if (J === "textarea" && Y === "") return hJ(X, Q);
  else return !1;
}
function d9(X, Y, J, Q, W, K, V) {
  while (!0) {
    let G = X,
      Z = Y,
      H = J,
      q = Q,
      U = W,
      I = K,
      j = V;
    if (q instanceof T)
      if (U instanceof T) return new r9(I, j, H);
      else {
        let z = U.head;
        if (z instanceof GX) {
          let S = z,
            N = U.tail,
            P = z.name,
            L = z.handler,
            B = xY(H, Z, P, L),
            A = M(S, I);
          ((X = G), (Y = Z), (J = B), (Q = q), (W = N), (K = A), (V = j));
        } else {
          let S = z,
            N = U.tail,
            P = M(S, I);
          ((X = G), (Y = Z), (J = H), (Q = q), (W = N), (K = P), (V = j));
        }
      }
    else if (U instanceof T) {
      let z = q.head;
      if (z instanceof GX) {
        let S = z,
          N = q.tail,
          P = z.name,
          L = fJ(H, Z, P),
          B = M(S, j);
        ((X = G), (Y = Z), (J = L), (Q = N), (W = U), (K = I), (V = B));
      } else {
        let S = z,
          N = q.tail,
          P = M(S, j);
        ((X = G), (Y = Z), (J = H), (Q = N), (W = U), (K = I), (V = P));
      }
    } else {
      let { head: z, tail: S } = q,
        N = U.head,
        P = U.tail,
        L = jJ(z, N);
      if (L instanceof QX)
        if (z instanceof GX) {
          let B = z.name;
          ((X = G), (Y = Z), (J = fJ(H, Z, B)), (Q = S), (W = U), (K = I), (V = M(z, j)));
        } else ((X = G), (Y = Z), (J = H), (Q = S), (W = U), (K = I), (V = M(z, j)));
      else if (L instanceof WX)
        if (z instanceof wX)
          if (N instanceof wX) {
            let B,
              A = N.name;
            if (A === "value") B = G || z.value !== N.value;
            else if (A === "checked") B = G || z.value !== N.value;
            else if (A === "selected") B = G || z.value !== N.value;
            else B = z.value !== N.value;
            let D = B,
              k;
            if (D) k = M(N, I);
            else k = I;
            let m = k;
            ((X = G), (Y = Z), (J = H), (Q = S), (W = P), (K = m), (V = j));
          } else if (N instanceof GX) {
            let { name: B, handler: A } = N;
            ((X = G),
              (Y = Z),
              (J = xY(H, Z, B, A)),
              (Q = S),
              (W = P),
              (K = M(N, I)),
              (V = M(z, j)));
          } else ((X = G), (Y = Z), (J = H), (Q = S), (W = P), (K = M(N, I)), (V = M(z, j)));
        else if (z instanceof cY)
          if (N instanceof cY) {
            let B,
              A = N.name;
            if (A === "scrollLeft") B = !0;
            else if (A === "scrollRight") B = !0;
            else if (A === "value") B = G || !yX(z.value, N.value);
            else if (A === "checked") B = G || !yX(z.value, N.value);
            else if (A === "selected") B = G || !yX(z.value, N.value);
            else B = !yX(z.value, N.value);
            let D = B,
              k;
            if (D) k = M(N, I);
            else k = I;
            let m = k;
            ((X = G), (Y = Z), (J = H), (Q = S), (W = P), (K = m), (V = j));
          } else if (N instanceof GX) {
            let { name: B, handler: A } = N;
            ((X = G),
              (Y = Z),
              (J = xY(H, Z, B, A)),
              (Q = S),
              (W = P),
              (K = M(N, I)),
              (V = M(z, j)));
          } else ((X = G), (Y = Z), (J = H), (Q = S), (W = P), (K = M(N, I)), (V = M(z, j)));
        else if (N instanceof GX) {
          let { name: B, handler: A } = N,
            D =
              z.prevent_default.kind !== N.prevent_default.kind ||
              z.stop_propagation.kind !== N.stop_propagation.kind ||
              z.debounce !== N.debounce ||
              z.throttle !== N.throttle,
            k;
          if (D) k = M(N, I);
          else k = I;
          let m = k;
          ((X = G), (Y = Z), (J = xY(H, Z, B, A)), (Q = S), (W = P), (K = m), (V = j));
        } else {
          let B = z.name;
          ((X = G), (Y = Z), (J = fJ(H, Z, B)), (Q = S), (W = P), (K = M(N, I)), (V = M(z, j)));
        }
      else if (N instanceof GX) {
        let { name: B, handler: A } = N;
        ((X = G), (Y = Z), (J = xY(H, Z, B, A)), (Q = q), (W = P), (K = M(N, I)), (V = j));
      } else ((X = G), (Y = Z), (J = H), (Q = q), (W = P), (K = M(N, I)), (V = j));
    }
  }
}
function $J(X, Y, J, Q, W, K, V, G, Z, H, q, U, I, j) {
  while (!0) {
    let z = X,
      S = Y,
      N = J,
      P = Q,
      L = W,
      B = K,
      A = V,
      D = G,
      k = Z,
      m = H,
      $ = q,
      h = U,
      i = I,
      l = j;
    if (z instanceof T)
      if (N instanceof T) {
        let VX = new nY(k, A, m, $);
        return new eQ(VX, i, l);
      } else {
        let VX = sQ(i, l, h, D, N),
          ZX,
          r;
        ((ZX = VX[0]), (r = VX[1]));
        let s = bQ(N, D - B),
          f = M(s, m),
          v = new nY(k, A, f, $);
        return new eQ(v, ZX, r);
      }
    else if (N instanceof T) {
      let { head: VX, tail: ZX } = z,
        r;
      if (VX.key === "" || !hX(L, VX.key)) r = A + 1;
      else r = A;
      let f = r,
        v = _J(i, l, h, D, VX);
      ((X = ZX),
        (Y = S),
        (J = N),
        (Q = P),
        (W = L),
        (K = B),
        (V = f),
        (G = D),
        (Z = k),
        (H = m),
        (q = $),
        (U = h),
        (I = i),
        (j = v));
    } else {
      let VX = z.head,
        ZX = N.head;
      if (VX.key !== ZX.key) {
        let r = z.tail,
          s = N.tail,
          f = hX(S, ZX.key);
        if (hX(P, VX.key))
          if (f)
            if (hX(L, VX.key))
              ((X = r),
                (Y = S),
                (J = N),
                (Q = P),
                (W = L),
                (K = B - 1),
                (V = A),
                (G = D),
                (Z = k),
                (H = m),
                (q = $),
                (U = h),
                (I = i),
                (j = l));
            else {
              let _ = MY(S, ZX.key),
                g = D - B,
                x = M(p8(ZX.key, g), m),
                b = TX(L, ZX.key, void 0);
              ((X = M(_, z)),
                (Y = S),
                (J = N),
                (Q = P),
                (W = b),
                (K = B + 1),
                (V = A),
                (G = D),
                (Z = k),
                (H = x),
                (q = $),
                (U = h),
                (I = i),
                (j = l));
            }
          else {
            let E = D - B,
              _ = gJ(i, l, h, D, ZX),
              g,
              x;
            ((g = _[0]), (x = _[1]));
            let b = bQ(F([ZX]), E),
              y = M(b, m);
            ((X = z),
              (Y = S),
              (J = s),
              (Q = P),
              (W = L),
              (K = B + 1),
              (V = A),
              (G = D + 1),
              (Z = k),
              (H = y),
              (q = $),
              (U = h),
              (I = g),
              (j = x));
          }
        else if (f) {
          let E = D - B,
            _ = M(d8(E), m),
            g = _J(i, l, h, D, VX);
          ((X = r),
            (Y = S),
            (J = N),
            (Q = P),
            (W = L),
            (K = B - 1),
            (V = A),
            (G = D),
            (Z = k),
            (H = _),
            (q = $),
            (U = h),
            (I = i),
            (j = g));
        } else {
          let E = sX(D - B, ZX),
            _ = iX(i, l, h, D, VX, ZX),
            g,
            x;
          ((g = _[0]),
            (x = _[1]),
            (X = r),
            (Y = S),
            (J = s),
            (Q = P),
            (W = L),
            (K = B),
            (V = A),
            (G = D + 1),
            (Z = k),
            (H = M(E, m)),
            (q = $),
            (U = h),
            (I = g),
            (j = x));
        }
      } else {
        let r = z.head;
        if (r instanceof vX) {
          let s = N.head;
          if (s instanceof vX) {
            let f = r,
              v = z.tail,
              E = s,
              _ = N.tail,
              g = $J(
                f.children,
                f.keyed_children,
                E.children,
                E.keyed_children,
                o(),
                0,
                0,
                0,
                D,
                C,
                C,
                qX(h, D, E.key),
                i,
                l,
              ),
              x,
              b,
              y;
            ((x = g.patch), (b = g.cache), (y = g.events));
            let XX;
            if (x.changes instanceof T)
              if (x.children instanceof T)
                if (x.removed === 0) XX = $;
                else XX = M(x, $);
              else XX = M(x, $);
            else XX = M(x, $);
            let gX = XX;
            ((X = v),
              (Y = S),
              (J = _),
              (Q = P),
              (W = L),
              (K = B),
              (V = A),
              (G = D + 1),
              (Z = k),
              (H = m),
              (q = gX),
              (U = h),
              (I = b),
              (j = y));
          } else {
            let f = r,
              v = z.tail,
              E = s,
              _ = N.tail,
              g = sX(D - B, E),
              x = iX(i, l, h, D, f, E),
              b,
              y;
            ((b = x[0]),
              (y = x[1]),
              (X = v),
              (Y = S),
              (J = _),
              (Q = P),
              (W = L),
              (K = B),
              (V = A),
              (G = D + 1),
              (Z = k),
              (H = M(g, m)),
              (q = $),
              (U = h),
              (I = b),
              (j = y));
          }
        } else if (r instanceof xX) {
          let s = N.head;
          if (s instanceof xX) {
            let f = r,
              v = s;
            if (f.namespace === v.namespace && f.tag === v.tag) {
              let E = z.tail,
                _ = N.tail,
                g = qX(h, D, v.key),
                x = lW(i, v.namespace, v.tag, g),
                b = d9(x, g, l, f.attributes, v.attributes, C, C),
                y,
                XX,
                NX;
              ((y = b.added), (XX = b.removed), (NX = b.events));
              let gX;
              if (y instanceof T && XX instanceof T) gX = C;
              else gX = F([yQ(y, XX)]);
              let OX = gX,
                NY = $J(
                  f.children,
                  f.keyed_children,
                  v.children,
                  v.keyed_children,
                  o(),
                  0,
                  0,
                  0,
                  D,
                  OX,
                  C,
                  g,
                  i,
                  NX,
                ),
                jX,
                WY,
                kY;
              ((jX = NY.patch), (WY = NY.cache), (kY = NY.events));
              let yY;
              if (jX.changes instanceof T)
                if (jX.children instanceof T)
                  if (jX.removed === 0) yY = $;
                  else yY = M(jX, $);
                else yY = M(jX, $);
              else yY = M(jX, $);
              let A0 = yY;
              ((X = E),
                (Y = S),
                (J = _),
                (Q = P),
                (W = L),
                (K = B),
                (V = A),
                (G = D + 1),
                (Z = k),
                (H = m),
                (q = A0),
                (U = h),
                (I = WY),
                (j = kY));
            } else {
              let E = r,
                _ = z.tail,
                g = s,
                x = N.tail,
                b = sX(D - B, g),
                y = iX(i, l, h, D, E, g),
                XX,
                NX;
              ((XX = y[0]),
                (NX = y[1]),
                (X = _),
                (Y = S),
                (J = x),
                (Q = P),
                (W = L),
                (K = B),
                (V = A),
                (G = D + 1),
                (Z = k),
                (H = M(b, m)),
                (q = $),
                (U = h),
                (I = XX),
                (j = NX));
            }
          } else {
            let f = r,
              v = z.tail,
              E = s,
              _ = N.tail,
              g = sX(D - B, E),
              x = iX(i, l, h, D, f, E),
              b,
              y;
            ((b = x[0]),
              (y = x[1]),
              (X = v),
              (Y = S),
              (J = _),
              (Q = P),
              (W = L),
              (K = B),
              (V = A),
              (G = D + 1),
              (Z = k),
              (H = M(g, m)),
              (q = $),
              (U = h),
              (I = b),
              (j = y));
          }
        } else if (r instanceof mX) {
          let s = N.head;
          if (s instanceof mX) {
            let f = r,
              v = s;
            if (f.content === v.content) {
              let E = z.tail,
                _ = N.tail;
              ((X = E),
                (Y = S),
                (J = _),
                (Q = P),
                (W = L),
                (K = B),
                (V = A),
                (G = D + 1),
                (Z = k),
                (H = m),
                (q = $),
                (U = h),
                (I = i),
                (j = l));
            } else {
              let E = z.tail,
                _ = s,
                g = N.tail,
                x = kQ(D, 0, F([u8(_.content)]), C);
              ((X = E),
                (Y = S),
                (J = g),
                (Q = P),
                (W = L),
                (K = B),
                (V = A),
                (G = D + 1),
                (Z = k),
                (H = m),
                (q = M(x, $)),
                (U = h),
                (I = i),
                (j = l));
            }
          } else {
            let f = r,
              v = z.tail,
              E = s,
              _ = N.tail,
              g = sX(D - B, E),
              x = iX(i, l, h, D, f, E),
              b,
              y;
            ((b = x[0]),
              (y = x[1]),
              (X = v),
              (Y = S),
              (J = _),
              (Q = P),
              (W = L),
              (K = B),
              (V = A),
              (G = D + 1),
              (Z = k),
              (H = M(g, m)),
              (q = $),
              (U = h),
              (I = b),
              (j = y));
          }
        } else if (r instanceof dX) {
          let s = N.head;
          if (s instanceof dX) {
            let f = r,
              v = z.tail,
              E = s,
              _ = N.tail,
              g = qX(h, D, E.key),
              x = d9(!1, g, l, f.attributes, E.attributes, C, C),
              b,
              y,
              XX;
            ((b = x.added), (y = x.removed), (XX = x.events));
            let NX;
            if (b instanceof T && y instanceof T) NX = C;
            else NX = F([yQ(b, y)]);
            let gX = NX,
              OX;
            if (f.inner_html === E.inner_html) OX = gX;
            else OX = M(c8(E.inner_html), gX);
            let jX = OX,
              WY;
            if (jX instanceof T) WY = $;
            else WY = M(kQ(D, 0, jX, F([])), $);
            let kY = WY;
            ((X = v),
              (Y = S),
              (J = _),
              (Q = P),
              (W = L),
              (K = B),
              (V = A),
              (G = D + 1),
              (Z = k),
              (H = m),
              (q = kY),
              (U = h),
              (I = i),
              (j = XX));
          } else {
            let f = r,
              v = z.tail,
              E = s,
              _ = N.tail,
              g = sX(D - B, E),
              x = iX(i, l, h, D, f, E),
              b,
              y;
            ((b = x[0]),
              (y = x[1]),
              (X = v),
              (Y = S),
              (J = _),
              (Q = P),
              (W = L),
              (K = B),
              (V = A),
              (G = D + 1),
              (Z = k),
              (H = M(g, m)),
              (q = $),
              (U = h),
              (I = b),
              (j = y));
          }
        } else if (r instanceof AX) {
          let s = N.head;
          if (s instanceof AX) {
            let f = r,
              v = z.tail,
              E = s,
              _ = N.tail,
              g = qX(h, D, E.key),
              x = lY(g),
              b = $J(
                M(f.child, C),
                o(),
                M(E.child, C),
                o(),
                o(),
                0,
                0,
                0,
                D,
                C,
                C,
                kJ(g),
                i,
                P9(l, x, f.mapper),
              ),
              y,
              XX,
              NX;
            ((y = b.patch), (XX = b.cache), (NX = b.events));
            let gX = L9(l, x, E.mapper, NX),
              OX;
            if (y.changes instanceof T)
              if (y.children instanceof T)
                if (y.removed === 0) OX = $;
                else OX = M(y, $);
              else OX = M(y, $);
            else OX = M(y, $);
            let jX = OX;
            ((X = v),
              (Y = S),
              (J = _),
              (Q = P),
              (W = L),
              (K = B),
              (V = A),
              (G = D + 1),
              (Z = k),
              (H = m),
              (q = jX),
              (U = h),
              (I = XX),
              (j = gX));
          } else {
            let f = r,
              v = z.tail,
              E = s,
              _ = N.tail,
              g = sX(D - B, E),
              x = iX(i, l, h, D, f, E),
              b,
              y;
            ((b = x[0]),
              (y = x[1]),
              (X = v),
              (Y = S),
              (J = _),
              (Q = P),
              (W = L),
              (K = B),
              (V = A),
              (G = D + 1),
              (Z = k),
              (H = M(g, m)),
              (q = $),
              (U = h),
              (I = b),
              (j = y));
          }
        } else {
          let s = N.head;
          if (s instanceof LY) {
            let f = r,
              v = z.tail,
              E = s,
              _ = N.tail;
            if (T8(f.dependencies, E.dependencies)) {
              let x = A9(i, f.view, E.view);
              ((X = v),
                (Y = S),
                (J = _),
                (Q = P),
                (W = L),
                (K = B),
                (V = A),
                (G = D + 1),
                (Z = k),
                (H = m),
                (q = $),
                (U = h),
                (I = x),
                (j = l));
            } else {
              let x = T9(i, f.view, f.view),
                b = E.view(),
                y = S9(i, E.view, b);
              ((X = M(x, v)),
                (Y = S),
                (J = M(b, _)),
                (Q = P),
                (W = L),
                (K = B),
                (V = A),
                (G = D),
                (Z = k),
                (H = m),
                (q = $),
                (U = h),
                (I = y),
                (j = l));
            }
          } else {
            let f = r,
              v = z.tail,
              E = s,
              _ = N.tail,
              g = sX(D - B, E),
              x = iX(i, l, h, D, f, E),
              b,
              y;
            ((b = x[0]),
              (y = x[1]),
              (X = v),
              (Y = S),
              (J = _),
              (Q = P),
              (W = L),
              (K = B),
              (V = A),
              (G = D + 1),
              (Z = k),
              (H = M(g, m)),
              (q = $),
              (U = h),
              (I = b),
              (j = y));
          }
        }
      }
    }
  }
}
function eY(X, Y, J) {
  let Q = j9(X),
    W = $J(M(Y, C), o(), M(J, C), o(), o(), 0, 0, 0, 0, C, C, EJ, Q, B9(Q)),
    K,
    V,
    G;
  return ((K = W.patch), (V = W.cache), (G = W.events), new s9(K, D9(V, G)));
}
var i9 = (X) => X.reduceRight((Y, J) => zY(J, Y), C),
  bX = (X, Y) => {
    if (Array.isArray(X)) for (let J = 0; J < X.length; J++) Y(X[J]);
    else if (X) for (X; $X(X); X = $X(X)) Y(gY(X));
  },
  X6 = (X, Y) => {
    if (!$X(X)) return Y;
    else if (!$X(Y)) return X;
    else return YQ(X, Y);
  };
var uJ = "http://www.w3.org/1999/xhtml",
  n9 = 1,
  l9 = 3,
  Y6 = 8;
var a9 = !!globalThis.HTMLElement?.prototype?.moveBefore;
var { setTimeout: oW, clearTimeout: J6 } = globalThis,
  tW = (X, Y) => globalThis.document.createElementNS(X, Y),
  o9 = (X) => globalThis.document.createTextNode(X),
  t9 = (X) => globalThis.document.createComment(X),
  eW = () => globalThis.document.createDocumentFragment(),
  YY = (X, Y, J) => X.insertBefore(Y, J),
  e9 = a9 ? (X, Y, J) => X.moveBefore(Y, J) : YY,
  X0 = (X, Y) => X.removeChild(Y),
  X7 = (X, Y) => X.getAttribute(Y),
  Y0 = (X, Y, J) => X.setAttribute(Y, J),
  Y7 = (X, Y) => X.removeAttribute(Y),
  J7 = (X, Y, J, Q) => X.addEventListener(Y, J, Q),
  J0 = (X, Y, J) => X.removeEventListener(Y, J),
  Q7 = (X, Y) => (X.innerHTML = Y),
  W7 = (X, Y) => (X.data = Y),
  SX = Symbol("lustre");
class K0 {
  constructor(X, Y, J, Q) {
    ((this.kind = X),
      (this.key = Q),
      (this.parent = Y),
      (this.children = []),
      (this.node = J),
      (this.endNode = null),
      (this.handlers = new Map()),
      (this.throttles = new Map()),
      (this.debouncers = new Map()));
  }
  get isVirtual() {
    return this.kind === CY || this.kind === tX;
  }
  get parentNode() {
    return this.isVirtual ? this.node.parentNode : this.node;
  }
}
var fX = (X, Y, J, Q, W) => {
    let K = new K0(X, Y, J, W);
    return ((J[SX] = K), Y?.children.splice(Q, 0, K), K);
  },
  K7 = (X) => {
    let Y = "";
    for (let J = X[SX]; J.parent; J = J.parent) {
      let Q = J.parent && J.parent.kind === tX ? xJ : wJ;
      if (J.key) Y = `${Q}${J.key}${Y}`;
      else {
        let W = J.parent.children.indexOf(J);
        Y = `${Q}${W}${Y}`;
      }
    }
    return Y.slice(1);
  };
class W6 {
  #X = null;
  #V;
  #W;
  #J = !1;
  constructor(X, Y, J, { debug: Q = !1 } = {}) {
    ((this.#X = X), (this.#V = Y), (this.#W = J), (this.#J = Q));
  }
  mount(X) {
    (fX(qY, null, this.#X, 0, null), this.#z(this.#X, null, this.#X[SX], 0, X));
  }
  push(X, Y = null) {
    ((this.#Y = Y), this.#Q.push({ node: this.#X[SX], patch: X }), this.#K());
  }
  #Y;
  #Q = [];
  #K() {
    let X = this.#Q;
    while (X.length) {
      let { node: Y, patch: J } = X.pop(),
        { children: Q } = Y,
        { changes: W, removed: K, children: V } = J;
      if ((bX(W, (G) => this.#Z(Y, G)), K)) this.#q(Y, Q.length - K, K);
      bX(V, (G) => {
        let Z = Q[G.index | 0];
        this.#Q.push({ node: Z, patch: G });
      });
    }
  }
  #Z(X, Y) {
    switch (Y.kind) {
      case SQ:
        this.#P(X, Y);
        break;
      case PQ:
        this.#B(X, Y);
        break;
      case LQ:
        this.#S(X, Y);
        break;
      case CQ:
        this.#U(X, Y);
        break;
      case wQ:
        this.#R(X, Y);
        break;
      case EQ:
        this.#G(X, Y);
        break;
      case xQ:
        this.#H(X, Y);
        break;
    }
  }
  #H(X, { children: Y, before: J }) {
    let Q = eW(),
      W = this.#F(X, J);
    (this.#O(Q, null, X, J | 0, Y), YY(X.parentNode, Q, W));
  }
  #G(X, { index: Y, with: J }) {
    this.#q(X, Y | 0, 1);
    let Q = this.#F(X, Y);
    this.#z(X.parentNode, Q, X, Y | 0, J);
  }
  #F(X, Y) {
    Y = Y | 0;
    let { children: J } = X,
      Q = J.length;
    if (Y < Q) return J[Y].node;
    if (X.endNode) return X.endNode;
    if (!X.isVirtual) return null;
    while (X.isVirtual && X.children.length) {
      if (X.endNode) return X.endNode.nextSibling;
      X = X.children[X.children.length - 1];
    }
    return X.node.nextSibling;
  }
  #U(X, { key: Y, before: J }) {
    J = J | 0;
    let { children: Q, parentNode: W } = X,
      K = Q[J].node,
      V = Q[J];
    for (let G = J + 1; G < Q.length; ++G) {
      let Z = Q[G];
      if (((Q[G] = V), (V = Z), Z.key === Y)) {
        Q[J] = Z;
        break;
      }
    }
    this.#N(W, V, K);
  }
  #M(X, Y, J) {
    for (let Q = 0; Q < Y.length; ++Q) this.#N(X, Y[Q], J);
  }
  #N(X, Y, J) {
    if ((e9(X, Y.node, J), Y.isVirtual)) this.#M(X, Y.children, J);
    if (Y.endNode) e9(X, Y.endNode, J);
  }
  #R(X, { index: Y }) {
    this.#q(X, Y, 1);
  }
  #q(X, Y, J) {
    let { children: Q, parentNode: W } = X,
      K = Q.splice(Y, J);
    for (let V = 0; V < K.length; ++V) {
      let G = K[V],
        { node: Z, endNode: H, isVirtual: q, children: U } = G;
      if ((X0(W, Z), H)) X0(W, H);
      if ((this.#j(G), q)) K.push(...U);
    }
  }
  #j(X) {
    let { debouncers: Y, children: J } = X;
    for (let { timeout: Q } of Y.values()) if (Q) J6(Q);
    (Y.clear(), bX(J, (Q) => this.#j(Q)));
  }
  #S({ node: X, handlers: Y, throttles: J, debouncers: Q }, { added: W, removed: K }) {
    (bX(K, ({ name: V }) => {
      if (Y.delete(V)) (J0(X, V, Q6), this.#I(J, V, 0), this.#I(Q, V, 0));
      else (Y7(X, V), W0[V]?.removed?.(X, V));
    }),
      bX(W, (V) => this.#A(X, V)));
  }
  #P({ node: X }, { content: Y }) {
    W7(X, Y ?? "");
  }
  #B({ node: X }, { inner_html: Y }) {
    Q7(X, Y ?? "");
  }
  #O(X, Y, J, Q, W) {
    bX(W, (K) => this.#z(X, Y, J, Q++, K));
  }
  #z(X, Y, J, Q, W) {
    switch (W.kind) {
      case qY: {
        let K = this.#D(J, Q, W);
        (this.#O(K, null, K[SX], 0, W.children), YY(X, K, Y));
        break;
      }
      case wY: {
        let K = this.#L(J, Q, W);
        YY(X, K, Y);
        break;
      }
      case CY: {
        let V = this.#T("lustre:fragment", J, Q, W);
        if ((YY(X, V, Y), this.#O(X, Y, V[SX], 0, W.children), this.#J))
          ((V[SX].endNode = t9(" /lustre:fragment ")), YY(X, V[SX].endNode, Y));
        break;
      }
      case A8: {
        let K = this.#D(J, Q, W);
        (this.#B({ node: K }, W), YY(X, K, Y));
        break;
      }
      case tX: {
        let K = this.#T("lustre:map", J, Q, W);
        (YY(X, K, Y), this.#z(X, Y, K[SX], 0, W.child));
        break;
      }
      case jQ: {
        let K = this.#Y?.get(W.view) ?? W.view();
        this.#z(X, Y, J, Q, K);
        break;
      }
    }
  }
  #D(X, Y, { kind: J, key: Q, tag: W, namespace: K, attributes: V }) {
    let G = tW(K || uJ, W);
    if ((fX(J, X, G, Y, Q), this.#J && Q)) Y0(G, "data-lustre-key", Q);
    return (bX(V, (Z) => this.#A(G, Z)), G);
  }
  #L(X, Y, { kind: J, key: Q, content: W }) {
    let K = o9(W ?? "");
    return (fX(J, X, K, Y, Q), K);
  }
  #T(X, Y, J, { kind: Q, key: W }) {
    let K = this.#J ? t9(G7(X, W)) : o9("");
    return (fX(Q, Y, K, J, W), K);
  }
  #A(X, Y) {
    let { debouncers: J, handlers: Q, throttles: W } = X[SX],
      { kind: K, name: V, value: G, prevent_default: Z, debounce: H, throttle: q } = Y;
    switch (K) {
      case MQ: {
        let U = G ?? "";
        if (V === "virtual:defaultValue") {
          X.defaultValue = U;
          return;
        } else if (V === "virtual:defaultChecked") {
          X.defaultChecked = !0;
          return;
        } else if (V === "virtual:defaultSelected") {
          X.defaultSelected = !0;
          return;
        }
        if (U !== X7(X, V)) Y0(X, V, U);
        W0[V]?.added?.(X, U);
        break;
      }
      case q8:
        X[V] = G;
        break;
      case qQ: {
        if (Q.has(V)) J0(X, V, Q6);
        let U = Z.kind === NQ;
        (J7(X, V, Q6, { passive: U }),
          this.#I(W, V, q),
          this.#I(J, V, H),
          Q.set(V, (I) => this.#C(Y, I)));
        break;
      }
    }
  }
  #I(X, Y, J) {
    let Q = X.get(Y);
    if (J > 0)
      if (Q) Q.delay = J;
      else X.set(Y, { delay: J });
    else if (Q) {
      let { timeout: W } = Q;
      if (W) J6(W);
      X.delete(Y);
    }
  }
  #C(X, Y) {
    let { currentTarget: J, type: Q } = Y,
      { debouncers: W, throttles: K } = J[SX],
      V = K7(J),
      { prevent_default: G, stop_propagation: Z, include: H } = X;
    if (G.kind === RQ) Y.preventDefault();
    if (Z.kind === RQ) Y.stopPropagation();
    if (Q === "submit")
      ((Y.detail ??= {}), (Y.detail.formData = [...new FormData(Y.target, Y.submitter).entries()]));
    let q = this.#V(Y, V, Q, H),
      U = K.get(Q);
    if (U) {
      let j = Date.now(),
        z = U.last || 0;
      if (j > z + U.delay) ((U.last = j), (U.lastEvent = Y), this.#W(Y, q));
    }
    let I = W.get(Q);
    if (I)
      (J6(I.timeout),
        (I.timeout = oW(() => {
          if (Y === K.get(Q)?.lastEvent) return;
          this.#W(Y, q);
        }, I.delay)));
    if (!U && !I) this.#W(Y, q);
  }
}
var G7 = (X, Y) => {
    if (Y) return ` ${X} key="${OJ(Y)}" `;
    else return ` ${X} `;
  },
  Q6 = (X) => {
    let { currentTarget: Y, type: J } = X;
    Y[SX].handlers.get(J)(X);
  },
  Q0 = (X) => {
    return {
      added(Y) {
        Y[X] = !0;
      },
      removed(Y) {
        Y[X] = !1;
      },
    };
  },
  V7 = (X) => {
    return {
      added(Y, J) {
        Y[X] = J;
      },
    };
  },
  W0 = {
    checked: Q0("checked"),
    selected: Q0("selected"),
    value: V7("value"),
    autofocus: {
      added(X) {
        queueMicrotask(() => {
          X.focus?.();
        });
      },
    },
    autoplay: {
      added(X) {
        try {
          X.play?.();
        } catch (Y) {
          console.error(Y);
        }
      },
    },
  };
function Z7(X, Y, J) {
  while (!0) {
    let Q = X,
      W = Y,
      K = J;
    if (Q instanceof T) return [W, YX(K)];
    else {
      let V = Q.tail,
        G = Q.head[0],
        Z = Q.head[1],
        H = AJ(G, Z),
        q;
      if (G === "") q = W;
      else q = TX(W, G, H);
      let U = q,
        I = M(H, K);
      ((X = V), (Y = U), (J = I));
    }
  }
}
function K6(X) {
  return Z7(X, o(), C);
}
function G0(X, Y, J) {
  let Q = K6(J),
    W,
    K;
  return ((W = Q[0]), (K = Q[1]), rY("", "", X, Y, K, W, !1, sY(X, "")));
}
function V0(X, Y, J, Q) {
  let W = K6(Q),
    K,
    V;
  return ((K = W[0]), (V = W[1]), rY("", X, Y, J, V, K, !1, sY(Y, X)));
}
function Z0(X) {
  let Y = K6(X),
    J,
    Q;
  return ((J = Y[0]), (Q = Y[1]), BQ("", Q, J));
}
var F0 = (X) => {
    let Y = fX(qY, null, X, 0, null);
    for (let Q = X.firstChild; Q; Q = Q.nextSibling) {
      let W = cJ(Y, X, Q, 0);
      if (W) return W.vnode;
    }
    let J = globalThis.document.createTextNode("");
    return (fX(wY, Y, J, 0, null), X.insertBefore(J, X.firstChild), L8());
  },
  cJ = (X, Y, J, Q) => {
    if (J.nodeType === Y6) {
      let W = J.data.trim();
      if (W.startsWith("lustre:fragment")) return U7(X, Y, J, Q);
      if (W.startsWith("lustre:map")) return M7(X, Y, J, Q);
      if (W.startsWith("lustre:memo")) return q7(X, Y, J, Q);
      return null;
    }
    if (J.nodeType === n9) return F7(X, J, Q);
    if (J.nodeType === l9) return H7(X, J, Q);
    return null;
  },
  F7 = (X, Y, J) => {
    let Q = Y.getAttribute("data-lustre-key") ?? "";
    if (Q) Y.removeAttribute("data-lustre-key");
    let W = fX(qY, X, Y, J, Q),
      K = Y.localName,
      V = Y.namespaceURI,
      G = !V || V === uJ;
    if (G && z7.includes(K)) R7(K, Y);
    let Z = N7(Y),
      H = [];
    for (let U = Y.firstChild; U; ) {
      let I = cJ(W, Y, U, H.length);
      if (I) (H.push([I.key, I.vnode]), (U = I.next));
      else U = U.nextSibling;
    }
    let q = G ? G0(K, Z, XJ(H)) : V0(V, K, Z, XJ(H));
    return YJ(Q, q, Y.nextSibling);
  },
  H7 = (X, Y, J) => {
    return (fX(wY, X, Y, J, null), YJ("", O(Y.data), Y.nextSibling));
  },
  U7 = (X, Y, J, Q) => {
    let W = G6(J.data),
      K = fX(CY, X, J, Q, W),
      V = [];
    J = J.nextSibling;
    while (J && (J.nodeType !== Y6 || J.data.trim() !== "/lustre:fragment")) {
      let Z = cJ(K, Y, J, V.length);
      if (Z) (V.push([Z.key, Z.vnode]), (J = Z.next));
      else J = J.nextSibling;
    }
    K.endNode = J;
    let G = Z0(XJ(V));
    return YJ(W, G, J?.nextSibling);
  },
  M7 = (X, Y, J, Q) => {
    let W = G6(J.data),
      K = fX(tX, X, J, Q, W),
      V = H0(K, Y, J, 0);
    if (!V) return null;
    let G = E8(V.vnode, (Z) => Z);
    return YJ(W, G, V.next);
  },
  q7 = (X, Y, J, Q) => {
    let W = G6(J.data),
      K = H0(X, Y, J, Q);
    if (!K) return null;
    Y.removeChild(J);
    let V = C8(XJ([w8({})]), () => K.vnode);
    return YJ(W, V, K.next);
  },
  H0 = (X, Y, J, Q) => {
    while (!0) {
      if (((J = J.nextSibling), !J)) return null;
      let W = cJ(X, Y, J, Q);
      if (W) return W;
    }
  },
  YJ = (X, Y, J) => {
    return { key: X, vnode: Y, next: J };
  },
  N7 = (X) => {
    let Y = [];
    for (let J = 0; J < X.attributes.length; J++) {
      let Q = X.attributes[J];
      if (Q.name !== "xmlns") Y.push(_X(Q.localName, Q.value));
    }
    return XJ(Y);
  },
  z7 = ["input", "select", "textarea"],
  R7 = (X, Y) => {
    let { value: J, checked: Q } = Y;
    if (X === "input" && Y.type === "checkbox" && !Q) return;
    if (X === "input" && Y.type === "radio" && !Q) return;
    if (Y.type !== "checkbox" && Y.type !== "radio" && !J) return;
    queueMicrotask(() => {
      if (
        ((Y.value = J),
        (Y.checked = Q),
        Y.dispatchEvent(new Event("input", { bubbles: !0 })),
        Y.dispatchEvent(new Event("change", { bubbles: !0 })),
        globalThis.document.activeElement !== Y)
      )
        Y.dispatchEvent(new Event("blur", { bubbles: !0 }));
    });
  },
  G6 = (X) => {
    let Y = X.match(/key="([^"]*)"/);
    if (!Y) return "";
    return I7(Y[1]);
  },
  I7 = (X) => {
    return X.replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'");
  },
  XJ = (X) => X.reduceRight((Y, J) => zY(J, Y), C);
var JJ = () => !!globalThis.document;
class pJ {
  constructor(X, [Y, J], Q, W, K) {
    ((this.root = X),
      (this.#X = Y),
      (this.#V = Q),
      (this.#W = W),
      this.root.addEventListener("context-request", (Z) => {
        if (!(Z.context && Z.callback)) return;
        if (!this.#K.has(Z.context)) return;
        Z.stopImmediatePropagation();
        let H = this.#K.get(Z.context);
        if (Z.subscribe) {
          let q = () => {
            H.subscribers = H.subscribers.filter((U) => U !== Z.callback);
          };
          (H.subscribers.push([Z.callback, q]), Z.callback(H.value, q));
        } else Z.callback(H.value);
      }));
    let V = (Z, H, q) => iQ(this.#Y, H, q, Z),
      G = (Z, H) => {
        let [q, U] = rQ(this.#Y, H);
        if (((this.#Y = q), FX(U))) {
          let I = HX(U);
          if (I.stop_propagation) Z.stopPropagation();
          if (I.prevent_default) Z.preventDefault();
          this.dispatch(I.message, !1);
        }
      };
    ((this.#Q = new W6(this.root, V, G, K)),
      (this.#J = F0(this.root)),
      (this.#Y = dQ()),
      this.#R(J),
      this.#q());
  }
  root = null;
  dispatch(X, Y = !1) {
    if (this.#Z) this.#H.push(X);
    else {
      let [J, Q] = this.#W(this.#X, X);
      ((this.#X = J), this.#N(Q, Y));
    }
  }
  emit(X, Y) {
    (this.root.host ?? this.root).dispatchEvent(
      new CustomEvent(X, { detail: Y, bubbles: !0, composed: !0 }),
    );
  }
  provide(X, Y) {
    if (!this.#K.has(X)) this.#K.set(X, { value: Y, subscribers: [] });
    else {
      let J = this.#K.get(X);
      if (yX(J.value, Y)) return;
      J.value = Y;
      for (let Q = J.subscribers.length - 1; Q >= 0; Q--) {
        let [W, K] = J.subscribers[Q];
        if (!W) {
          J.subscribers.splice(Q, 1);
          continue;
        }
        W(Y, K);
      }
    }
  }
  #X;
  #V;
  #W;
  #J;
  #Y;
  #Q;
  #K = new Map();
  #Z = !1;
  #H = [];
  #G = C;
  #F = C;
  #U = null;
  #M = {
    dispatch: (X) => this.dispatch(X),
    emit: (X, Y) => this.emit(X, Y),
    select: () => {},
    root: () => this.root,
    provide: (X, Y) => this.provide(X, Y),
  };
  #N(X, Y = !1) {
    if ((this.#R(X), !this.#U))
      if (Y) ((this.#U = "sync"), queueMicrotask(() => this.#q()));
      else this.#U = window.requestAnimationFrame(() => this.#q());
  }
  #R(X) {
    this.#Z = !0;
    while (!0) {
      if (
        (bX(X.synchronous, (J) => J(this.#M)),
        (this.#G = X6(this.#G, X.before_paint)),
        (this.#F = X6(this.#F, X.after_paint)),
        !this.#H.length)
      )
        break;
      let Y = this.#H.shift();
      [this.#X, X] = this.#W(this.#X, Y);
    }
    this.#Z = !1;
  }
  #q() {
    this.#U = null;
    let X = this.#V(this.#X),
      { patch: Y, cache: J } = eY(this.#Y, this.#J, X);
    if (((this.#Y = J), (this.#J = X), this.#Q.push(Y, EY(J)), KY(this.#G))) {
      let Q = U0(this.#G);
      ((this.#G = C),
        queueMicrotask(() => {
          this.#N(Q, !0);
        }));
    }
    if (KY(this.#F)) {
      let Q = U0(this.#F);
      ((this.#F = C), window.requestAnimationFrame(() => this.#N(Q, !0)));
    }
  }
}
function U0(X) {
  return { synchronous: X, after_paint: C, before_paint: C };
}
class M0 {
  #X;
  constructor(X, [Y, J], Q, W) {
    this.#X = new pJ(X, [Y, J], W, Q);
  }
  send(X) {
    if (aY(X)) this.dispatch(X.message, !1);
    else if (oY(X)) this.emit(X.name, X.data);
    else if (tY(X));
  }
  dispatch(X) {
    this.#X.dispatch(X);
  }
  emit(X, Y) {
    this.#X.emit(X, Y);
  }
}
var q0 = ({ init: X, update: Y, view: J }, Q, W) => {
  if (!JJ()) return lX(V6());
  let K = Q instanceof HTMLElement ? Q : globalThis.document.querySelector(Q);
  if (!K) return lX(N0(Q));
  return nX(new M0(K, X(W), Y, J));
};
class O7 {
  #X;
  #V;
  #W;
  #J;
  #Y;
  #Q;
  #K = IY();
  #Z = new Set();
  constructor(X, Y, J, Q, W, K) {
    let [V, G] = Y(K);
    ((this.#X = V),
      (this.#V = J),
      (this.#W = Q),
      (this.#J = W),
      (this.#Y = this.#W(this.#X)),
      (this.#Q = E9(this.#Y)),
      this.#M(G));
  }
  send(X) {
    if (y9(X)) {
      let { message: Y } = X,
        J = this.#H(Y),
        Q = eY(this.#Q, this.#Y, J);
      ((this.#Y = J), (this.#Q = Q.cache), this.broadcast(fQ(Q.patch, EY(Q.cache))));
    } else if (f9(X)) {
      let { callback: Y } = X;
      if (
        (this.#Z.add(Y),
        Y(
          G9(
            this.#J.open_shadow_root,
            this.#J.adopt_styles,
            vY(this.#J.attributes),
            vY(this.#J.properties),
            vY(this.#J.contexts),
            this.#K,
            this.#Y,
            EY(this.#Q),
          ),
        ),
        MJ(config.on_connect))
      )
        this.#G(qJ(config.on_connect));
    } else if (_9(X)) {
      let { callback: Y } = X;
      if ((this.#Z.delete(Y), MJ(config.on_disconnect))) this.#G(qJ(config.on_disconnect));
    } else if (aY(X)) {
      let { message: Y } = X,
        [J, Q] = this.#V(this.#X, Y),
        W = this.#W(J),
        K = eY(this.#Q, this.#Y, W);
      (this.#M(Q),
        (this.#X = J),
        (this.#Y = W),
        (this.#Q = K.cache),
        this.broadcast(fQ(K.patch, EY(K.cache))));
    } else if (oY(X)) {
      let { name: Y, data: J } = X;
      this.broadcast(V9(Y, J));
    } else if ($9(X)) {
      let { key: Y, value: J } = X,
        Q = oX(this.#K, Y);
      if (FX(Q) && yX(HX(Q), J)) return;
      ((this.#K = OY(this.#K, Y, J)), this.broadcast(Z9(Y, J)));
    } else if (tY(X))
      ((this.#X = null),
        (this.#V = null),
        (this.#W = null),
        (this.#J = null),
        (this.#Y = null),
        (this.#Q = null),
        (this.#K = null),
        this.#Z.clear());
  }
  broadcast(X) {
    for (let Y of this.#Z) Y(X);
  }
  #H(X) {
    if (o8(X)) {
      let { messages: Y } = X,
        J = this.#X,
        Q = EX();
      for (let W = Y; $X(W); W = $X(W)) {
        let K = this.#H(gY(W));
        if (FX(K)) {
          ((J = HX(K)[0]), (Q = B8(i9([Q, HX(K)[1]]))));
          break;
        }
      }
      return (this.#M(Q), (this.#X = J), this.#W(J));
    } else if (e8(X)) {
      let { name: Y, value: J } = X,
        Q = this.#F(Y, J);
      if (!FX(Q)) return this.#Y;
      return this.#G(HX(Q));
    } else if (Y9(X)) {
      let { name: Y, value: J } = X,
        Q = this.#U(Y, J);
      if (!FX(Q)) return this.#Y;
      return this.#G(HX(Q));
    } else if (Q9(X)) {
      let { path: Y, name: J, event: Q } = X,
        [W, K] = x9(this.#Q, Y, J, Q);
      if (((this.#Q = W), !FX(K))) return this.#Y;
      let { message: V } = HX(K);
      return this.#G(V);
    } else if (K9(X)) {
      let { key: Y, value: J } = X,
        Q = oX(this.#J.contexts, Y);
      if (!FX(Q)) return this.#Y;
      if (((Q = TY(J, HX(Q))), !FX(Q))) return this.#Y;
      return this.#G(HX(Q));
    }
  }
  #G(X) {
    let [Y, J] = this.#V(this.#X, X);
    return (this.#M(J), (this.#X = Y), this.#W(this.#X));
  }
  #F(X, Y) {
    let J = oX(this.#J.attributes, X);
    if (!FX(J)) return J;
    return HX(J)(Y);
  }
  #U(X, Y) {
    let J = oX(this.#J.properties, X);
    if (!FX(J)) return J;
    return HX(J)(Y);
  }
  #M(X) {
    let Y = (V) => this.send(h9(V)),
      J = (V, G) => this.send(v9(V, G)),
      Q = () => {
        return;
      },
      W = () => {
        return;
      },
      K = (V, G) => this.send(m9(V, G));
    globalThis.queueMicrotask(() => {
      j8(X, Y, J, Q, W, K);
    });
  }
}
class z0 extends R {
  constructor(X) {
    super();
    this.selector = X;
  }
}
var N0 = (X) => new z0(X);
class F6 extends R {}
var V6 = () => new F6();
function R0(X, Y, J) {
  return new oQ(new e(), X, Y, J, c9);
}
function I0(X, Y, J) {
  return J8(!JJ(), new JX(new F6()), () => {
    return q0(X, Y, J);
  });
}
function D7(X, Y) {
  return R8(
    X,
    zJ(Y, (J) => {
      return new pY(!1, !1, J);
    }),
    C,
    zQ,
    zQ,
    0,
    0,
  );
}
function dJ(X) {
  return D7("click", GQ(X));
}
function H6(X) {
  if (typeof document < "u") document.documentElement.className = X;
}
function U6(X) {
  if (typeof localStorage > "u") return "";
  return localStorage.getItem(X) || "";
}
function M6(X, Y) {
  if (typeof localStorage > "u") return;
  localStorage.setItem(X, Y);
}
function O0(X) {
  if (typeof localStorage > "u") return !1;
  return localStorage.getItem(X) !== null;
}
var A7 = "src/dachshund_app.gleam";
class u extends R {}
class p extends R {}
class d extends R {}
class c extends R {}
class sJ extends R {}
class QY extends R {}
class B6 extends R {}
class JY extends R {
  constructor(X, Y, J, Q, W) {
    super();
    ((this.locale = X),
      (this.dark_mode = Y),
      (this.select_is_open = J),
      (this.detected_locale = Q),
      (this.detection_source = W));
  }
}
class B0 extends R {
  constructor(X) {
    super();
    this[0] = X;
  }
}
class D6 extends R {}
class T6 extends R {}
class A6 extends R {
  constructor(X) {
    super();
    this[0] = X;
  }
}
class D0 extends R {}
function S7() {
  let X = U6("dachshund_locale"),
    Y = U6("dachshund_dark_mode");
  return [X, Y];
}
function P7() {
  return O0("dachshund_locale");
}
function L7(X) {
  if (X === "en") return new u();
  else if (X === "de") return new p();
  else if (X === "zh") return new d();
  else if (X === "ar") return new c();
  else if (X === "he") return new sJ();
  else return new u();
}
function C7(X) {
  if (X === "dark") return new B6();
  else return new QY();
}
function w7(X) {
  H6("");
  let Y = S7(),
    J,
    Q;
  ((J = Y[0]), (Q = Y[1]));
  let W = L7(J),
    K = C7(Q),
    V = P7(),
    G;
  if (V) G = "localStorage";
  else G = "Browser Language";
  return [new JY(W, K, !1, W, G), EX()];
}
function E7(X) {
  if (X instanceof u) return "en";
  else if (X instanceof p) return "de";
  else if (X instanceof d) return "zh";
  else if (X instanceof c) return "ar";
  else return "he";
}
function j0(X) {
  let Y = E7(X);
  return M6("dachshund_locale", Y);
}
function x7(X) {
  if (X instanceof QY) return "light";
  else return "dark";
}
function k7(X) {
  let Y = x7(X);
  return M6("dachshund_dark_mode", Y);
}
function y7(X, Y) {
  if (Y instanceof B0) {
    let J = Y[0];
    return (j0(J), [new JY(J, X.dark_mode, !1, X.detected_locale, X.detection_source), EX()]);
  } else if (Y instanceof D6) {
    let J;
    if (X.dark_mode instanceof QY) J = new B6();
    else J = new QY();
    let W = J,
      K;
    if (W instanceof QY) K = "";
    else K = "dark";
    return (
      H6(K),
      k7(W),
      [new JY(X.locale, W, X.select_is_open, X.detected_locale, X.detection_source), EX()]
    );
  } else if (Y instanceof T6)
    return [
      new JY(X.locale, X.dark_mode, !X.select_is_open, X.detected_locale, X.detection_source),
      EX(),
    ];
  else if (Y instanceof A6) {
    let J = Y[0];
    return (j0(J), [new JY(J, X.dark_mode, !1, X.detected_locale, X.detection_source), EX()]);
  } else if (Y instanceof D0)
    return [new JY(X.locale, X.dark_mode, !1, X.detected_locale, X.detection_source), EX()];
  else {
    let J = Y[0],
      Q = Y[1];
    return [new JY(X.locale, X.dark_mode, X.select_is_open, J, Q), EX()];
  }
}
function b7(X) {
  if (X instanceof c) return "rtl";
  else if (X instanceof sJ) return "rtl";
  else return "ltr";
}
function f7(X) {
  if (X instanceof u) return "en";
  else if (X instanceof p) return "de";
  else if (X instanceof d) return "zh";
  else if (X instanceof c) return "ar";
  else return "he";
}
function g7(X) {
  return AQ(
    F([w("dark-mode-toggle"), dJ(new D6()), _X("aria-label", "Toggle dark mode")]),
    F([
      CJ(
        F([
          DJ(
            (() => {
              if (X.dark_mode instanceof QY) return "/moon-svgrepo-com.svg";
              else return "/sun-svgrepo-com.svg";
            })(),
          ),
          BJ(
            (() => {
              if (X.dark_mode instanceof QY) return "Moon icon";
              else return "Sun icon";
            })(),
          ),
          w("dark-mode-icon"),
        ]),
      ),
    ]),
  );
}
function _7(X) {
  let Y;
  if (X instanceof u) Y = "Dachshund";
  else if (X instanceof p) Y = "Dackel";
  else if (X instanceof d) Y = "腊肠犬";
  else if (X instanceof c) Y = "داكشوند";
  else Y = "דאכשונד";
  let J = Y;
  if (X instanceof u) return O("Welcome to " + J);
  else if (X instanceof p) return O("Willkommen bei " + J);
  else if (X instanceof d) return O("欢迎使用 " + J);
  else if (X instanceof c) return O("مرحبًا بك في " + J);
  else return O("ברוכים הבאים ל" + J);
}
function QJ(X, Y, J) {
  let Q = BX(X, J.locale),
    W =
      "custom-select-option" +
      (() => {
        if (Q) return " selected";
        else return "";
      })();
  return a(F([w(W), dJ(new A6(X))]), F([O(Y)]));
}
function h7(X) {
  let Y,
    J = X.locale;
  if (J instanceof u) Y = "English";
  else if (J instanceof p) Y = "Deutsch";
  else if (J instanceof d) Y = "中文";
  else if (J instanceof c) Y = "العربية";
  else Y = "עברית";
  let Q = Y;
  return a(
    F([w("custom-select-container")]),
    F([
      AQ(F([w("custom-select-trigger"), dJ(new T6())]), F([O(Q)])),
      (() => {
        if (X.select_is_open)
          return a(
            F([w("custom-select-dropdown")]),
            F([
              QJ(new u(), "English", X),
              QJ(new p(), "Deutsch", X),
              QJ(new d(), "中文", X),
              QJ(new c(), "العربية", X),
              QJ(new sJ(), "עברית", X),
            ]),
          );
        else return O("");
      })(),
    ]),
  );
}
function v7(X) {
  return PJ(
    F([w("mb-16")]),
    F([
      a(
        F([w("hero-layout")]),
        F([
          CJ(F([DJ("/dachshund-mascot.svg"), BJ("Dachshund mascot"), w("mascot")])),
          a(
            F([w("speech-bubble-wrapper")]),
            F([
              a(
                F([w("chat-bubble-container")]),
                F([
                  CJ(F([DJ("/chatbubble.svg"), BJ("Chat bubble"), w("chat-bubble-img")])),
                  kX(F([w("chat-bubble-text")]), F([_7(X.locale)])),
                ]),
              ),
            ]),
          ),
        ]),
      ),
    ]),
  );
}
function m7(X) {
  let Y;
  if (X instanceof u) Y = "A GLEAM I18N LIBRARY INSPIRED BY PARAGLIDE - TRANSLATIONS AS CODE";
  else if (X instanceof p)
    Y = "EINE GLEAM I18N-BIBLIOTHEK INSPIRIERT VON PARAGLIDE - ÜBERSETZUNGEN ALS CODE";
  else if (X instanceof d) Y = "受 PARAGLIDE 啟發的 GLEAM I18N 庫 - 翻譯即代碼";
  else if (X instanceof c) Y = "مكتبة GLEAM I18N مستوحاة من PARAGLIDE - الترجمات ككود";
  else Y = "ספריית GLEAM I18N בהשראת PARAGLIDE - תרגומים כקוד";
  let J = Y;
  return a(
    F([w("marquee-container")]),
    F([
      a(
        F([w("marquee-track")]),
        F([
          kX(F([w("marquee-text")]), F([O(J)])),
          kX(F([w("marquee-text")]), F([O(J)])),
          kX(F([w("marquee-text")]), F([O(J)])),
          kX(F([w("marquee-text")]), F([O(J)])),
        ]),
      ),
    ]),
  );
}
function q6(X, Y) {
  if (Y === 1)
    if (X instanceof u) return O("Zero Dependencies");
    else if (X instanceof p) return O("Keine Abhängigkeiten");
    else if (X instanceof d) return O("零依赖");
    else if (X instanceof c) return O("بدون تبعيات");
    else return O("אפס תלויות");
  else if (Y === 2)
    if (X instanceof u) return O("Strategy Detection");
    else if (X instanceof p) return O("Strategie-Erkennung");
    else if (X instanceof d) return O("策略检测");
    else if (X instanceof c) return O("اكتشاف الاستراتيجية");
    else return O("זיהוי אסטרטגיה");
  else if (X instanceof u) return O("Type Safety");
  else if (X instanceof p) return O("Typsicherheit");
  else if (X instanceof d) return O("类型安全");
  else if (X instanceof c) return O("أمان النوع");
  else return O("בטיחות סוגים");
}
function N6(X, Y) {
  if (Y === 1)
    if (X instanceof u) return O("Nothing. Pure Gleam all the way down.");
    else if (X instanceof p) return O("Nichts. Rein Gleam durch und durch.");
    else if (X instanceof d) return O("什么都没有。甚至没有牵引绳。纯 Gleam 一路到底。");
    else if (X instanceof c) return O("لا شيء. Gleam نقي حتى النهاية.");
    else return O("כלום. Gleam טהור עד הסוף.");
  else if (Y === 2)
    if (X instanceof u) return O("Cookie, localStorage, URL, browser - all in Gleam.");
    else if (X instanceof p) return O("Cookie, localStorage, URL, Browser - alles in Gleam.");
    else if (X instanceof d)
      return O("Cookie、localStorage、URL、浏览器语言 - 全部在 Gleam 中实现。");
    else if (X instanceof c) return O("Cookie وlocalStorage وURL والمتصفح - كلها في Gleam.");
    else return O("Cookie, localStorage, URL, דפדפן - הכל ב-Gleam.");
  else if (X instanceof u) return O("The compiler catches bugs before your users.");
  else if (X instanceof p) return O("Der Compiler findet Fehler, bevor es Nutzer tun.");
  else if (X instanceof d) return O("编译器会在用户之前发现错误。");
  else if (X instanceof c) return O("المترجم يكتشف الأخطاء قبل المستخدمين.");
  else return O("המהדר תופס באגים לפני המשתמשים שלך.");
}
function z6(X, Y, J) {
  return a(
    F([w("feature-card")]),
    F([
      kX(F([w("text-2xl mb-4 block")]), F([O(X)])),
      SJ(F([w("font-semibold text-foreground mb-2")]), F([Y])),
      LJ(F([w("text-muted-foreground")]), F([J])),
    ]),
  );
}
function $7(X) {
  return PJ(
    F([w("mb-16")]),
    F([
      TQ(
        F([w("text-2xl font-bold text-foreground mb-8 decorative-heading")]),
        F([
          (() => {
            if (X instanceof u) return O("Features");
            else if (X instanceof p) return O("Funktionen");
            else if (X instanceof d) return O("功能特点");
            else if (X instanceof c) return O("الميزات");
            else return O("תכונות");
          })(),
        ]),
      ),
      a(
        F([w("grid grid-cols-1 md:grid-cols-3 gap-6")]),
        F([
          z6("\uD83D\uDE80", q6(X, 1), N6(X, 1)),
          z6("\uD83C\uDFAF", q6(X, 2), N6(X, 2)),
          z6("\uD83D\uDD12", q6(X, 3), N6(X, 3)),
        ]),
      ),
    ]),
  );
}
function R6(X, Y) {
  if (Y === 1)
    if (X instanceof u) return O("Write Translations");
    else if (X instanceof p) return O("Übersetzungen schreiben");
    else if (X instanceof d) return O("编写翻译");
    else if (X instanceof c) return O("اكتب الترجمات");
    else return O("כתיבת תרגומים");
  else if (Y === 2)
    if (X instanceof u) return O("Detect Locale");
    else if (X instanceof p) return O("Locale erkennen");
    else if (X instanceof d) return O("检测语言环境");
    else if (X instanceof c) return O("اكتشاف اللغة");
    else return O("זיהוי שפה");
  else if (X instanceof u) return O("Import & Use");
  else if (X instanceof p) return O("Importieren & Nutzen");
  else if (X instanceof d) return O("导入和使用");
  else if (X instanceof c) return O("استيراد واستخدام");
  else return O("ייבוא ושימוש");
}
function I6(X, Y) {
  if (Y === 1)
    if (X instanceof u) return O("Write Gleam constants and functions for your messages");
    else if (X instanceof p) return O("Schreibe Gleam-Konstanten und Funktionen für Nachrichten");
    else if (X instanceof d) return O("使用 Gleam 常量和函数编写您的消息");
    else if (X instanceof c) return O("اكتب ثوابت ودوال Gleam لرسائلك");
    else return O("כתיבת קבועים ופונקציות של Gleam להודעות שלך");
  else if (Y === 2)
    if (X instanceof u) return O("Use strategies to detect user's preferred language");
    else if (X instanceof p) return O("Verwende Strategien, um die bevorzugte Sprache zu erkennen");
    else if (X instanceof d) return O("使用策略检测用户首选语言");
    else if (X instanceof c) return O("استخدم الاستراتيجيات لاكتشاف لغة المستخدم المفضلة");
    else return O("שימוש באסטרטגיות לזיהוי השפה המועדפת של המשתמש");
  else if (X instanceof u) return O("Import correct module. Use like any value.");
  else if (X instanceof p) return O("Importiere das richtige Modul. Nutze es wie jeden Wert.");
  else if (X instanceof d) return O("根据语言环境导入正确的模块。像使用任何值一样使用它。");
  else if (X instanceof c) return O("استيراد الوحدة الصحيحة. استخدمها مثل أي قيمة.");
  else return O("ייבוא המודול הנכון. שימוש כמו בכל ערך.");
}
function O6(X, Y, J) {
  return a(
    F([w("flex gap-4")]),
    F([
      a(
        F([
          w(
            "flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold",
          ),
        ]),
        F([O(X)]),
      ),
      a(
        F([w("flex-1")]),
        F([
          SJ(F([w("font-semibold text-foreground mb-1")]), F([Y])),
          LJ(F([w("text-muted-foreground mb-2")]), F([J])),
        ]),
      ),
    ]),
  );
}
function j6(X, Y) {
  let J;
  if (Y === 1)
    if (X instanceof u)
      J = `// translations/en.gleam
pub const welcome = "Welcome"
pub const goodbye = "Goodbye"

// translations/de.gleam
pub const welcome = "Willkommen"
pub const goodbye = "Auf Wiedersehen"`;
    else if (X instanceof p)
      J = `// translations/en.gleam
pub const welcome = "Welcome"
pub const goodbye = "Goodbye"

// translations/de.gleam
pub const welcome = "Willkommen"
pub const goodbye = "Auf Wiedersehen"`;
    else if (X instanceof d)
      J = `// translations/en.gleam
pub const welcome = "Welcome"
pub const goodbye = "Goodbye"

// translations/de.gleam
pub const welcome = "Willkommen"
pub const goodbye = "Auf Wiedersehen"`;
    else if (X instanceof c)
      J = `// translations/ar.gleam
pub const welcome = "مرحبًا"
pub const goodbye = "مع السلامة"

// translations/en.gleam
pub const welcome = "Welcome"
pub const goodbye = "Goodbye"`;
    else
      J = `// translations/he.gleam
pub const welcome = "ברוכים הבאים"
pub const goodbye = "להתראות"

// translations/en.gleam
pub const welcome = "Welcome"
pub const goodbye = "Goodbye"`;
  else if (Y === 2)
    if (X instanceof u)
      J = `const my_strategy = [
  strategy.local_storage("locale"),
  strategy.preferred_language(),
  strategy.base_locale(En),
]

let result = strategy.evaluate(my_strategy, En)`;
    else if (X instanceof p)
      J = `const my_strategy = [
  strategy.local_storage("locale"),
  strategy.preferred_language(),
  strategy.base_locale(En),
]

let result = strategy.evaluate(my_strategy, En)`;
    else if (X instanceof d)
      J = `const my_strategy = [
  strategy.local_storage("locale"),
  strategy.preferred_language(),
  strategy.base_locale(En),
]

let result = strategy.evaluate(my_strategy, En)`;
    else if (X instanceof c)
      J = `const my_strategy = [
  strategy.local_storage("locale"),
  strategy.preferred_language(),
  strategy.base_locale(Ar),
]

let result = strategy.evaluate(my_strategy, Ar)`;
    else
      J = `const my_strategy = [
  strategy.local_storage("locale"),
  strategy.preferred_language(),
  strategy.base_locale(He),
]

let result = strategy.evaluate(my_strategy, He)`;
  else if (X instanceof u)
    J = `let t = case result.locale {
  En -> en
  De -> de
  Ar -> ar
  He -> he
}

// Use translations
t.welcome  // "Welcome" or "مرحبًا"`;
  else if (X instanceof p)
    J = `let t = case result.locale {
  En -> en
  De -> de
  Ar -> ar
  He -> he
}

// Use translations
t.welcome  // "Welcome" or "Willkommen"`;
  else if (X instanceof d)
    J = `let t = case result.locale {
  En -> en
  De -> de
  Ar -> ar
  He -> he
}

// Use translations
t.welcome  // "Welcome" or "欢迎"`;
  else if (X instanceof c)
    J = `let t = case result.locale {
  En -> en
  De -> de
  Ar -> ar
  He -> he
}

// Use translations
t.welcome  // "مرحبًا" or "Welcome"`;
  else
    J = `let t = case result.locale {
  En -> en
  De -> de
  Ar -> ar
  He -> he
}

// Use translations
t.welcome  // "ברוכים הבאים" or "Welcome"`;
  let Q = J;
  return a(F([w("code-example-wrapper")]), F([y8(F([w("code-block")]), F([O(Q)]))]));
}
function u7(X) {
  return PJ(
    F([w("mb-16")]),
    F([
      TQ(
        F([w("text-2xl font-bold text-foreground mb-8 decorative-heading")]),
        F([
          (() => {
            if (X instanceof u) return O("How It Works");
            else if (X instanceof p) return O("So funktioniert es");
            else if (X instanceof d) return O("工作原理");
            else if (X instanceof c) return O("كيف يعمل");
            else return O("איך זה עובד");
          })(),
        ]),
      ),
      a(
        F([w("flex flex-col gap-8")]),
        F([
          O6("1", R6(X, 1), I6(X, 1)),
          j6(X, 1),
          O6("2", R6(X, 2), I6(X, 2)),
          j6(X, 2),
          O6("3", R6(X, 3), I6(X, 3)),
          j6(X, 3),
        ]),
      ),
    ]),
  );
}
function c7(X) {
  return k8(F([w("main-content")]), F([v7(X), m7(X.locale), $7(X.locale), u7(X.locale)]));
}
function p7(X) {
  return x8(
    F([w("footer")]),
    F([
      a(
        F([w("text-center")]),
        F([
          (() => {
            let Y = X.locale;
            if (Y instanceof u) return O("Built with Gleam and Lustre");
            else if (Y instanceof p) return O("Erstellt mit Gleam und Lustre");
            else if (Y instanceof d) return O("使用 Gleam 和 Lustre 构建");
            else if (Y instanceof c) return O("بني باستخدام Gleam و Lustre");
            else return O("נבנה עם Gleam ו-Lustre");
          })(),
        ]),
      ),
    ]),
  );
}
function d7(X) {
  let Y,
    J = X.detection_source;
  if (J === "localStorage") Y = J;
  else if (J === "cookie") Y = "Cookie";
  else if (J === "url") Y = "URL";
  else if (J === "preferredLanguage") Y = "Browser Language";
  else if (J === "baseLocale") Y = "Default";
  else if (J === "documentLang") Y = "Document Lang";
  else Y = X.detection_source;
  let Q = Y,
    W,
    K = X.detected_locale;
  if (K instanceof u) W = "English";
  else if (K instanceof p) W = "Deutsch";
  else if (K instanceof d) W = "中文";
  else if (K instanceof c) W = "العربية";
  else W = "עברית";
  let V = W;
  return a(
    F([w("live-detector")]),
    F([
      SJ(
        F([w("live-detector-title decorative-heading")]),
        F([
          O(
            (() => {
              let G = X.locale;
              if (G instanceof u) return "Live Locale Detector";
              else if (G instanceof p) return "Live Locale-Erkennung";
              else if (G instanceof d) return "实时语言检测";
              else if (G instanceof c) return "اكتشاف اللغة المباشر";
              else return "זיהוי שפה חי";
            })(),
          ),
        ]),
      ),
      a(
        F([w("live-detector-content")]),
        F([
          a(
            F([w("detector-row")]),
            F([
              kX(
                F([w("detector-label")]),
                F([
                  O(
                    (() => {
                      let G = X.locale;
                      if (G instanceof u) return "Detected Locale:";
                      else if (G instanceof p) return "Erkannte Locale:";
                      else if (G instanceof d) return "检测到的语言:";
                      else if (G instanceof c) return "اللغة المكتشفة:";
                      else return "שפה זוהתה:";
                    })(),
                  ),
                ]),
              ),
              kX(F([w("detector-value")]), F([O(V)])),
            ]),
          ),
          a(
            F([w("detector-row")]),
            F([
              kX(
                F([w("detector-label")]),
                F([
                  O(
                    (() => {
                      let G = X.locale;
                      if (G instanceof u) return "Source:";
                      else if (G instanceof p) return "Quelle:";
                      else if (G instanceof d) return "来源:";
                      else if (G instanceof c) return "المصدر:";
                      else return "מקור:";
                    })(),
                  ),
                ]),
              ),
              kX(F([w("detector-value")]), F([O(Q)])),
            ]),
          ),
          LJ(
            F([w("detector-hint")]),
            F([
              O(
                (() => {
                  let G = X.locale;
                  if (G instanceof u)
                    return "Change language or clear localStorage to see different detection results.";
                  else if (G instanceof p)
                    return "Sprache ändern oder localStorage löschen, um andere Erkennungsergebnisse zu sehen.";
                  else if (G instanceof d)
                    return "更改语言或清除 localStorage 以查看不同的检测结果。";
                  else if (G instanceof c)
                    return "غيّر اللغة أو امسح localStorage لرؤية نتائج اكتشاف مختلفة.";
                  else return "שנה שפה או נקה localStorage כדי לראות תוצאות זיהוי שונות.";
                })(),
              ),
            ]),
          ),
        ]),
      ),
    ]),
  );
}
function s7(X) {
  let Y = b7(X.locale),
    J = f7(X.locale);
  return a(
    F([_X("dir", Y), _X("lang", J)]),
    F([
      a(F([w("sticky-header")]), F([h7(X), g7(X)])),
      a(F([w("page-wrapper")]), F([c7(X), d7(X)])),
      p7(X),
    ]),
  );
}
function T0() {
  let X = R0(w7, y7, s7),
    Y = I0(X, "#app", void 0);
  if (!(Y instanceof n))
    throw nJ(
      "let_assert",
      A7,
      "dachshund_app",
      10,
      "main",
      "Pattern match failed, no pattern matched the value.",
      { value: Y, start: 263, end: 312, pattern_start: 274, pattern_end: 279 },
    );
  return;
}
T0();
