// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/@rive-app/canvas-advanced/canvas_advanced.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Rive = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  return function (moduleArg = {}) {
    var h = moduleArg,
      ba,
      ca;
    h.ready = new Promise((b, a) => {
      ba = b;
      ca = a;
    });
    function da() {
      function b(m) {
        const l = d;
        c = a = 0;
        d = new Map();
        l.forEach(p => {
          try {
            p(m);
          } catch (k) {
            console.error(k);
          }
        });
        this.fb();
        e && e.Db();
      }
      let a = 0,
        c = 0,
        d = new Map(),
        e = null,
        f = null;
      this.requestAnimationFrame = function (m) {
        a || (a = requestAnimationFrame(b.bind(this)));
        const l = ++c;
        d.set(l, m);
        return l;
      };
      this.cancelAnimationFrame = function (m) {
        d.delete(m);
        a && 0 == d.size && (cancelAnimationFrame(a), a = 0);
      };
      this.Bb = function (m) {
        f && (document.body.remove(f), f = null);
        m || (f = document.createElement("div"), f.style.backgroundColor = "black", f.style.position = "fixed", f.style.right = 0, f.style.top = 0, f.style.color = "white", f.style.padding = "4px", f.innerHTML = "RIVE FPS", m = function (l) {
          f.innerHTML = "RIVE FPS " + l.toFixed(1);
        }, document.body.appendChild(f));
        e = new function () {
          let l = 0,
            p = 0;
          this.Db = function () {
            var k = performance.now();
            p ? (++l, k -= p, 1E3 < k && (m(1E3 * l / k), l = p = 0)) : (p = k, l = 0);
          };
        }();
      };
      this.yb = function () {
        f && (document.body.remove(f), f = null);
        e = null;
      };
      this.fb = function () {};
    }
    function ea(b) {
      console.assert(!0);
      const a = new Map();
      let c = -Infinity;
      this.push = function (d) {
        d = d + ((1 << b) - 1) >> b;
        a.has(d) && clearTimeout(a.get(d));
        a.set(d, setTimeout(function () {
          a.delete(d);
          0 == a.length ? c = -Infinity : d == c && (c = Math.max(...a.keys()), console.assert(c < d));
        }, 1E3));
        c = Math.max(d, c);
        return c << b;
      };
    }
    const ha = "createConicGradient createImageData createLinearGradient createPattern createRadialGradient getContextAttributes getImageData getLineDash getTransform isContextLost isPointInPath isPointInStroke measureText".split(" "),
      ka = new function () {
        function b() {
          if (!a) {
            var t = document.createElement("canvas"),
              g = {
                alpha: 1,
                depth: 0,
                stencil: 0,
                antialias: 0,
                premultipliedAlpha: 1,
                preserveDrawingBuffer: 0,
                preferLowPowerToHighPerformance: 0,
                failIfMajorPerformanceCaveat: 0,
                enableExtensionsByDefault: 1,
                explicitSwapControl: 1,
                renderViaOffscreenBackBuffer: 1
              };
            let n = t.getContext("webgl2", g);
            if (n) c = 2;else if (n = t.getContext("webgl", g)) c = 1;else return console.log("No WebGL support. Image mesh will not be drawn."), !1;
            d = Math.min(n.getParameter(n.MAX_RENDERBUFFER_SIZE), n.getParameter(n.MAX_TEXTURE_SIZE));
            function w(H, x, A) {
              x = n.createShader(x);
              n.shaderSource(x, A);
              n.compileShader(x);
              A = n.getShaderInfoLog(x);
              if (0 < A.length) throw A;
              n.attachShader(H, x);
            }
            t = n.createProgram();
            w(t, n.VERTEX_SHADER, "attribute vec2 vertex;\n                attribute vec2 uv;\n                uniform vec4 mat;\n                uniform vec2 translate;\n                varying vec2 st;\n                void main() {\n                    st = uv;\n                    gl_Position = vec4(mat2(mat) * vertex + translate, 0, 1);\n                }");
            w(t, n.FRAGMENT_SHADER, "precision highp float;\n                uniform sampler2D image;\n                varying vec2 st;\n                void main() {\n                    gl_FragColor = texture2D(image, st);\n                }");
            n.bindAttribLocation(t, 0, "vertex");
            n.bindAttribLocation(t, 1, "uv");
            n.linkProgram(t);
            g = n.getProgramInfoLog(t);
            if (0 < g.trim().length) throw g;
            e = n.getUniformLocation(t, "mat");
            f = n.getUniformLocation(t, "translate");
            n.useProgram(t);
            n.bindBuffer(n.ARRAY_BUFFER, n.createBuffer());
            n.enableVertexAttribArray(0);
            n.enableVertexAttribArray(1);
            n.bindBuffer(n.ELEMENT_ARRAY_BUFFER, n.createBuffer());
            n.uniform1i(n.getUniformLocation(t, "image"), 0);
            n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
            a = n;
          }
          return !0;
        }
        let a = null,
          c = 0,
          d = 0,
          e = null,
          f = null,
          m = 0,
          l = 0;
        this.Mb = function () {
          b();
          return d;
        };
        this.vb = function (t) {
          if (!b()) return null;
          const g = a.createTexture();
          a.bindTexture(a.TEXTURE_2D, g);
          a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, a.RGBA, a.UNSIGNED_BYTE, t);
          a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE);
          a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE);
          a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR);
          2 == c ? (a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR_MIPMAP_LINEAR), a.generateMipmap(a.TEXTURE_2D)) : a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR);
          return g;
        };
        const p = new ea(8),
          k = new ea(8),
          r = new ea(10),
          u = new ea(10);
        this.Ab = function (t, g, n, w, H) {
          if (b()) {
            var x = p.push(t),
              A = k.push(g);
            if (a.canvas.width != x || a.canvas.height != A) a.canvas.width = x, a.canvas.height = A;
            a.viewport(0, A - g, t, g);
            a.disable(a.SCISSOR_TEST);
            a.clearColor(0, 0, 0, 0);
            a.clear(a.COLOR_BUFFER_BIT);
            a.enable(a.SCISSOR_TEST);
            n.sort((B, fa) => fa.jb - B.jb);
            x = r.push(w);
            m != x && (a.bufferData(a.ARRAY_BUFFER, 8 * x, a.DYNAMIC_DRAW), m = x);
            x = 0;
            for (var J of n) a.bufferSubData(a.ARRAY_BUFFER, x, J.Ra), x += 4 * J.Ra.length;
            console.assert(x == 4 * w);
            for (var Q of n) a.bufferSubData(a.ARRAY_BUFFER, x, Q.mb), x += 4 * Q.mb.length;
            console.assert(x == 8 * w);
            x = u.push(H);
            l != x && (a.bufferData(a.ELEMENT_ARRAY_BUFFER, 2 * x, a.DYNAMIC_DRAW), l = x);
            J = 0;
            for (var aa of n) a.bufferSubData(a.ELEMENT_ARRAY_BUFFER, J, aa.indices), J += 2 * aa.indices.length;
            console.assert(J == 2 * H);
            aa = 0;
            Q = !0;
            x = J = 0;
            for (const B of n) {
              B.image.Ma != aa && (a.bindTexture(a.TEXTURE_2D, B.image.rb || null), aa = B.image.Ma);
              B.Pb ? (a.scissor(B.Va, A - B.Wa - B.cb, B.$b, B.cb), Q = !0) : Q && (a.scissor(0, A - g, t, g), Q = !1);
              n = 2 / t;
              const fa = -2 / g;
              a.uniform4f(e, B.xa[0] * n * B.Ga, B.xa[1] * fa * B.Ha, B.xa[2] * n * B.Ga, B.xa[3] * fa * B.Ha);
              a.uniform2f(f, B.xa[4] * n * B.Ga + n * (B.Va - B.Nb * B.Ga) - 1, B.xa[5] * fa * B.Ha + fa * (B.Wa - B.Ob * B.Ha) + 1);
              a.vertexAttribPointer(0, 2, a.FLOAT, !1, 0, x);
              a.vertexAttribPointer(1, 2, a.FLOAT, !1, 0, x + 4 * w);
              a.drawElements(a.TRIANGLES, B.indices.length, a.UNSIGNED_SHORT, J);
              x += 4 * B.Ra.length;
              J += 2 * B.indices.length;
            }
            console.assert(x == 4 * w);
            console.assert(J == 2 * H);
          }
        };
        this.canvas = function () {
          return b() && a.canvas;
        };
      }(),
      la = h.onRuntimeInitialized;
    h.onRuntimeInitialized = function () {
      function b(q) {
        switch (q) {
          case k.srcOver:
            return "source-over";
          case k.screen:
            return "screen";
          case k.overlay:
            return "overlay";
          case k.darken:
            return "darken";
          case k.lighten:
            return "lighten";
          case k.colorDodge:
            return "color-dodge";
          case k.colorBurn:
            return "color-burn";
          case k.hardLight:
            return "hard-light";
          case k.softLight:
            return "soft-light";
          case k.difference:
            return "difference";
          case k.exclusion:
            return "exclusion";
          case k.multiply:
            return "multiply";
          case k.hue:
            return "hue";
          case k.saturation:
            return "saturation";
          case k.color:
            return "color";
          case k.luminosity:
            return "luminosity";
        }
      }
      function a(q) {
        return "rgba(" + ((16711680 & q) >>> 16) + "," + ((65280 & q) >>> 8) + "," + ((255 & q) >>> 0) + "," + ((4278190080 & q) >>> 24) / 255 + ")";
      }
      function c() {
        0 < J.length && (ka.Ab(A.drawWidth(), A.drawHeight(), J, Q, aa), J = [], aa = Q = 0, A.reset(512, 512));
        for (const q of x) {
          for (const v of q.ja) v();
          q.ja = [];
        }
        x.clear();
      }
      la && la();
      var d = h.RenderPaintStyle;
      const e = h.RenderPath,
        f = h.RenderPaint,
        m = h.Renderer,
        l = h.StrokeCap,
        p = h.StrokeJoin,
        k = h.BlendMode,
        r = d.fill,
        u = d.stroke,
        t = h.FillRule.evenOdd;
      let g = 1;
      var n = h.RenderImage.extend("CanvasRenderImage", {
          __construct: function ({
            Aa: q,
            Fa: v
          } = {}) {
            this.__parent.__construct.call(this);
            this.Ma = g;
            g = g + 1 & 2147483647 || 1;
            this.Aa = q;
            this.Fa = v;
          },
          decode: function (q) {
            var v = this;
            v.Fa && v.Fa(v);
            var C = new Image();
            C.src = URL.createObjectURL(new Blob([q], {
              type: "image/png"
            }));
            C.onload = function () {
              v.ob = C;
              v.rb = ka.vb(C);
              v.size(C.width, C.height);
              v.Aa && v.Aa(v);
            };
          }
        }),
        w = e.extend("CanvasRenderPath", {
          __construct: function () {
            this.__parent.__construct.call(this);
            this.pa = new Path2D();
          },
          rewind: function () {
            this.pa = new Path2D();
          },
          addPath: function (q, v, C, D, z, E, F) {
            var G = this.pa,
              T = G.addPath;
            q = q.pa;
            const K = new DOMMatrix();
            K.a = v;
            K.b = C;
            K.c = D;
            K.d = z;
            K.e = E;
            K.f = F;
            T.call(G, q, K);
          },
          fillRule: function (q) {
            this.Ta = q;
          },
          moveTo: function (q, v) {
            this.pa.moveTo(q, v);
          },
          lineTo: function (q, v) {
            this.pa.lineTo(q, v);
          },
          cubicTo: function (q, v, C, D, z, E) {
            this.pa.bezierCurveTo(q, v, C, D, z, E);
          },
          close: function () {
            this.pa.closePath();
          }
        }),
        H = f.extend("CanvasRenderPaint", {
          color: function (q) {
            this.Ua = a(q);
          },
          thickness: function (q) {
            this.sb = q;
          },
          join: function (q) {
            switch (q) {
              case p.miter:
                this.La = "miter";
                break;
              case p.round:
                this.La = "round";
                break;
              case p.bevel:
                this.La = "bevel";
            }
          },
          cap: function (q) {
            switch (q) {
              case l.butt:
                this.Ka = "butt";
                break;
              case l.round:
                this.Ka = "round";
                break;
              case l.square:
                this.Ka = "square";
            }
          },
          style: function (q) {
            this.qb = q;
          },
          blendMode: function (q) {
            this.nb = b(q);
          },
          clearGradient: function () {
            this.za = null;
          },
          linearGradient: function (q, v, C, D) {
            this.za = {
              kb: q,
              lb: v,
              Za: C,
              $a: D,
              Pa: []
            };
          },
          radialGradient: function (q, v, C, D) {
            this.za = {
              kb: q,
              lb: v,
              Za: C,
              $a: D,
              Pa: [],
              Kb: !0
            };
          },
          addStop: function (q, v) {
            this.za.Pa.push({
              color: q,
              stop: v
            });
          },
          completeGradient: function () {},
          draw: function (q, v, C) {
            let D = this.qb;
            var z = this.Ua,
              E = this.za;
            q.globalCompositeOperation = this.nb;
            if (null != E) {
              z = E.kb;
              var F = E.lb;
              const T = E.Za;
              var G = E.$a;
              const K = E.Pa;
              E.Kb ? (E = T - z, G -= F, z = q.createRadialGradient(z, F, 0, z, F, Math.sqrt(E * E + G * G))) : z = q.createLinearGradient(z, F, T, G);
              for (let W = 0, N = K.length; W < N; W++) F = K[W], z.addColorStop(F.stop, a(F.color));
              this.Ua = z;
              this.za = null;
            }
            switch (D) {
              case u:
                q.strokeStyle = z;
                q.lineWidth = this.sb;
                q.lineCap = this.Ka;
                q.lineJoin = this.La;
                q.stroke(v);
                break;
              case r:
                q.fillStyle = z, q.fill(v, C);
            }
          }
        });
      const x = new Set();
      let A = null,
        J = [],
        Q = 0,
        aa = 0;
      var B = h.CanvasRenderer = m.extend("Renderer", {
        __construct: function (q) {
          this.__parent.__construct.call(this);
          this.oa = [1, 0, 0, 1, 0, 0];
          this.ha = q.getContext("2d");
          this.Sa = q;
          this.ja = [];
        },
        save: function () {
          this.oa.push(...this.oa.slice(this.oa.length - 6));
          this.ja.push(this.ha.save.bind(this.ha));
        },
        restore: function () {
          const q = this.oa.length - 6;
          if (6 > q) throw "restore() called without matching save().";
          this.oa.splice(q);
          this.ja.push(this.ha.restore.bind(this.ha));
        },
        transform: function (q, v, C, D, z, E) {
          const F = this.oa,
            G = F.length - 6;
          F.splice(G, 6, F[G] * q + F[G + 2] * v, F[G + 1] * q + F[G + 3] * v, F[G] * C + F[G + 2] * D, F[G + 1] * C + F[G + 3] * D, F[G] * z + F[G + 2] * E + F[G + 4], F[G + 1] * z + F[G + 3] * E + F[G + 5]);
          this.ja.push(this.ha.transform.bind(this.ha, q, v, C, D, z, E));
        },
        rotate: function (q) {
          const v = Math.sin(q);
          q = Math.cos(q);
          this.transform(q, v, -v, q, 0, 0);
        },
        _drawPath: function (q, v) {
          this.ja.push(v.draw.bind(v, this.ha, q.pa, q.Ta === t ? "evenodd" : "nonzero"));
        },
        _drawRiveImage: function (q, v, C) {
          var D = q.ob;
          if (D) {
            var z = this.ha,
              E = b(v);
            this.ja.push(function () {
              z.globalCompositeOperation = E;
              z.globalAlpha = C;
              z.drawImage(D, 0, 0);
              z.globalAlpha = 1;
            });
          }
        },
        _getMatrix: function (q) {
          const v = this.oa,
            C = v.length - 6;
          for (let D = 0; 6 > D; ++D) q[D] = v[C + D];
        },
        _drawImageMesh: function (q, v, C, D, z, E, F, G, T, K) {
          var W = this.ha.canvas.width,
            N = this.ha.canvas.height;
          const sb = T - F,
            tb = K - G;
          F = Math.max(F, 0);
          G = Math.max(G, 0);
          T = Math.min(T, W);
          K = Math.min(K, N);
          const ua = T - F,
            va = K - G;
          console.assert(ua <= Math.min(sb, W));
          console.assert(va <= Math.min(tb, N));
          if (!(0 >= ua || 0 >= va)) {
            T = ua < sb || va < tb;
            W = K = 1;
            var ia = Math.ceil(ua * K),
              ja = Math.ceil(va * W);
            N = ka.Mb();
            ia > N && (K *= N / ia, ia = N);
            ja > N && (W *= N / ja, ja = N);
            A || (A = new h.DynamicRectanizer(N), A.reset(512, 512));
            N = A.addRect(ia, ja);
            0 > N && (c(), x.add(this), N = A.addRect(ia, ja), console.assert(0 <= N));
            var ub = N & 65535,
              vb = N >> 16;
            J.push({
              xa: this.oa.slice(this.oa.length - 6),
              image: q,
              Va: ub,
              Wa: vb,
              Nb: F,
              Ob: G,
              $b: ia,
              cb: ja,
              Ga: K,
              Ha: W,
              Ra: new Float32Array(D),
              mb: new Float32Array(z),
              indices: new Uint16Array(E),
              Pb: T,
              jb: q.Ma << 1 | (T ? 1 : 0)
            });
            Q += D.length;
            aa += E.length;
            var oa = this.ha,
              kc = b(v);
            this.ja.push(function () {
              oa.save();
              oa.resetTransform();
              oa.globalCompositeOperation = kc;
              oa.globalAlpha = C;
              oa.drawImage(ka.canvas(), ub, vb, ia, ja, F, G, ua, va);
              oa.restore();
            });
          }
        },
        _clipPath: function (q) {
          this.ja.push(this.ha.clip.bind(this.ha, q.pa, q.Ta === t ? "evenodd" : "nonzero"));
        },
        clear: function () {
          x.add(this);
          this.ja.push(this.ha.clearRect.bind(this.ha, 0, 0, this.Sa.width, this.Sa.height));
        },
        flush: function () {},
        translate: function (q, v) {
          this.transform(1, 0, 0, 1, q, v);
        }
      });
      h.makeRenderer = function (q) {
        const v = new B(q),
          C = v.ha;
        return new Proxy(v, {
          get(D, z) {
            if ("function" === typeof D[z]) return function (...E) {
              return D[z].apply(D, E);
            };
            if ("function" === typeof C[z]) {
              if (-1 < ha.indexOf(z)) throw Error("RiveException: Method call to '" + z + "()' is not allowed, as the renderer cannot immediately pass through the return                 values of any canvas 2d context methods.");
              return function (...E) {
                v.ja.push(C[z].bind(C, ...E));
              };
            }
            return D[z];
          },
          set(D, z, E) {
            if (z in C) return C[z] = E, !0;
          }
        });
      };
      h.decodeImage = function (q, v) {
        new n({
          Aa: v
        }).decode(q);
      };
      h.renderFactory = {
        makeRenderPaint: function () {
          return new H();
        },
        makeRenderPath: function () {
          return new w();
        },
        makeRenderImage: function () {
          let q = Za;
          return new n({
            Fa: () => {
              q.total++;
            },
            Aa: () => {
              q.loaded++;
              if (q.loaded === q.total) {
                const v = q.ready;
                v && (v(), q.ready = null);
              }
            }
          });
        }
      };
      let fa = h.load,
        Za = null;
      h.load = function (q, v, C = !0) {
        const D = new h.FallbackFileAssetLoader();
        void 0 !== v && D.addLoader(v);
        C && (v = new h.CDNFileAssetLoader(), D.addLoader(v));
        return new Promise(function (z) {
          let E = null;
          Za = {
            total: 0,
            loaded: 0,
            ready: function () {
              z(E);
            }
          };
          E = fa(q, D);
          0 == Za.total && z(E);
        });
      };
      d = new da();
      h.requestAnimationFrame = d.requestAnimationFrame.bind(d);
      h.cancelAnimationFrame = d.cancelAnimationFrame.bind(d);
      h.enableFPSCounter = d.Bb.bind(d);
      h.disableFPSCounter = d.yb;
      d.fb = c;
      h.cleanup = function () {
        A && A.delete();
      };
    };
    const ma = h.onRuntimeInitialized;
    h.onRuntimeInitialized = function () {
      ma && ma();
      let b = h.decodeFont;
      h.decodeFont = function (c, d) {
        c = b(c);
        d(c);
      };
      const a = h.FileAssetLoader;
      h.ptrToAsset = c => {
        let d = h.ptrToFileAsset(c);
        return d.isImage ? h.ptrToImageAsset(c) : d.isFont ? h.ptrToFontAsset(c) : d;
      };
      h.CustomFileAssetLoader = a.extend("CustomFileAssetLoader", {
        __construct: function ({
          loadContents: c
        }) {
          this.__parent.__construct.call(this);
          this.pb = c;
        },
        loadContents: function (c, d) {
          c = h.ptrToAsset(c);
          return this.pb(c, d);
        }
      });
      h.CDNFileAssetLoader = a.extend("CDNFileAssetLoader", {
        __construct: function () {
          this.__parent.__construct.call(this);
        },
        loadContents: function (c) {
          let d = h.ptrToAsset(c);
          c = d.cdnUuid;
          if ("" === c) return !1;
          (function (e, f) {
            var m = new XMLHttpRequest();
            m.responseType = "arraybuffer";
            m.onreadystatechange = function () {
              4 == m.readyState && 200 == m.status && f(m);
            };
            m.open("GET", e, !0);
            m.send(null);
          })(d.cdnBaseUrl + "/" + c, e => {
            d.decode(new Uint8Array(e.response));
          });
          return !0;
        }
      });
      h.FallbackFileAssetLoader = a.extend("FallbackFileAssetLoader", {
        __construct: function () {
          this.__parent.__construct.call(this);
          this.eb = [];
        },
        addLoader: function (c) {
          this.eb.push(c);
        },
        loadContents: function (c, d) {
          for (let e of this.eb) if (e.loadContents(c, d)) return !0;
          return !1;
        }
      });
    };
    var na = Object.assign({}, h),
      pa = "./this.program",
      qa = "object" == typeof window,
      ra = "function" == typeof importScripts,
      y = "",
      sa,
      ta;
    if (qa || ra) ra ? y = self.location.href : "undefined" != typeof document && document.currentScript && (y = document.currentScript.src), _scriptDir && (y = _scriptDir), 0 !== y.indexOf("blob:") ? y = y.substr(0, y.replace(/[?#].*/, "").lastIndexOf("/") + 1) : y = "", ra && (ta = b => {
      var a = new XMLHttpRequest();
      a.open("GET", b, !1);
      a.responseType = "arraybuffer";
      a.send(null);
      return new Uint8Array(a.response);
    }), sa = (b, a, c) => {
      var d = new XMLHttpRequest();
      d.open("GET", b, !0);
      d.responseType = "arraybuffer";
      d.onload = () => {
        200 == d.status || 0 == d.status && d.response ? a(d.response) : c();
      };
      d.onerror = c;
      d.send(null);
    };
    var wa = h.print || console.log.bind(console),
      xa = h.printErr || console.error.bind(console);
    Object.assign(h, na);
    na = null;
    h.thisProgram && (pa = h.thisProgram);
    var ya;
    h.wasmBinary && (ya = h.wasmBinary);
    var noExitRuntime = h.noExitRuntime || !0;
    "object" != typeof WebAssembly && za("no native wasm support detected");
    var Aa,
      I,
      Ba = !1,
      Ca,
      L,
      Da,
      Ea,
      M,
      O,
      Fa,
      Ga;
    function Ha() {
      var b = Aa.buffer;
      h.HEAP8 = Ca = new Int8Array(b);
      h.HEAP16 = Da = new Int16Array(b);
      h.HEAP32 = M = new Int32Array(b);
      h.HEAPU8 = L = new Uint8Array(b);
      h.HEAPU16 = Ea = new Uint16Array(b);
      h.HEAPU32 = O = new Uint32Array(b);
      h.HEAPF32 = Fa = new Float32Array(b);
      h.HEAPF64 = Ga = new Float64Array(b);
    }
    var Ia,
      Ja = [],
      Ka = [],
      La = [];
    function Ma() {
      var b = h.preRun.shift();
      Ja.unshift(b);
    }
    var Na = 0,
      Oa = null,
      Pa = null;
    function za(b) {
      if (h.onAbort) h.onAbort(b);
      b = "Aborted(" + b + ")";
      xa(b);
      Ba = !0;
      b = new WebAssembly.RuntimeError(b + ". Build with -sASSERTIONS for more info.");
      ca(b);
      throw b;
    }
    function Qa(b) {
      return b.startsWith("data:application/octet-stream;base64,");
    }
    var Ra;
    Ra = "canvas_advanced.wasm";
    if (!Qa(Ra)) {
      var Sa = Ra;
      Ra = h.locateFile ? h.locateFile(Sa, y) : y + Sa;
    }
    function Ta(b) {
      if (b == Ra && ya) return new Uint8Array(ya);
      if (ta) return ta(b);
      throw "both async and sync fetching of the wasm failed";
    }
    function Ua(b) {
      if (!ya && (qa || ra)) {
        if ("function" == typeof fetch && !b.startsWith("file://")) return fetch(b, {
          credentials: "same-origin"
        }).then(a => {
          if (!a.ok) throw "failed to load wasm binary file at '" + b + "'";
          return a.arrayBuffer();
        }).catch(() => Ta(b));
        if (sa) return new Promise((a, c) => {
          sa(b, d => a(new Uint8Array(d)), c);
        });
      }
      return Promise.resolve().then(() => Ta(b));
    }
    function Va(b, a, c) {
      return Ua(b).then(d => WebAssembly.instantiate(d, a)).then(d => d).then(c, d => {
        xa("failed to asynchronously prepare wasm: " + d);
        za(d);
      });
    }
    function Wa(b, a) {
      var c = Ra;
      return ya || "function" != typeof WebAssembly.instantiateStreaming || Qa(c) || c.startsWith("file://") || "function" != typeof fetch ? Va(c, b, a) : fetch(c, {
        credentials: "same-origin"
      }).then(d => WebAssembly.instantiateStreaming(d, b).then(a, function (e) {
        xa("wasm streaming compile failed: " + e);
        xa("falling back to ArrayBuffer instantiation");
        return Va(c, b, a);
      }));
    }
    var Xa = b => {
      for (; 0 < b.length;) b.shift()(h);
    };
    function Ya(b) {
      if (void 0 === b) return "_unknown";
      b = b.replace(/[^a-zA-Z0-9_]/g, "$");
      var a = b.charCodeAt(0);
      return 48 <= a && 57 >= a ? `_${b}` : b;
    }
    function $a(b, a) {
      b = Ya(b);
      return {
        [b]: function () {
          return a.apply(this, arguments);
        }
      }[b];
    }
    function ab() {
      this.qa = [void 0];
      this.bb = [];
    }
    var P = new ab(),
      bb = void 0;
    function R(b) {
      throw new bb(b);
    }
    var S = b => {
        b || R("Cannot use deleted val. handle = " + b);
        return P.get(b).value;
      },
      U = b => {
        switch (b) {
          case void 0:
            return 1;
          case null:
            return 2;
          case !0:
            return 3;
          case !1:
            return 4;
          default:
            return P.tb({
              ib: 1,
              value: b
            });
        }
      };
    function cb(b) {
      var a = Error,
        c = $a(b, function (d) {
          this.name = b;
          this.message = d;
          d = Error(d).stack;
          void 0 !== d && (this.stack = this.toString() + "\n" + d.replace(/^Error(:[^\n]*)?\n/, ""));
        });
      c.prototype = Object.create(a.prototype);
      c.prototype.constructor = c;
      c.prototype.toString = function () {
        return void 0 === this.message ? this.name : `${this.name}: ${this.message}`;
      };
      return c;
    }
    var db = void 0,
      eb = void 0;
    function V(b) {
      for (var a = ""; L[b];) a += eb[L[b++]];
      return a;
    }
    var fb = [];
    function gb() {
      for (; fb.length;) {
        var b = fb.pop();
        b.ba.wa = !1;
        b["delete"]();
      }
    }
    var hb = void 0,
      ib = {};
    function jb(b, a) {
      for (void 0 === a && R("ptr should not be undefined"); b.fa;) a = b.Ba(a), b = b.fa;
      return a;
    }
    var kb = {};
    function lb(b) {
      b = mb(b);
      var a = V(b);
      nb(b);
      return a;
    }
    function ob(b, a) {
      var c = kb[b];
      void 0 === c && R(a + " has unknown type " + lb(b));
      return c;
    }
    function pb() {}
    var qb = !1;
    function rb(b) {
      --b.count.value;
      0 === b.count.value && (b.ia ? b.la.ra(b.ia) : b.ea.ca.ra(b.da));
    }
    function wb(b, a, c) {
      if (a === c) return b;
      if (void 0 === c.fa) return null;
      b = wb(b, a, c.fa);
      return null === b ? null : c.zb(b);
    }
    var xb = {};
    function yb(b, a) {
      a = jb(b, a);
      return ib[a];
    }
    var zb = void 0;
    function Ab(b) {
      throw new zb(b);
    }
    function Bb(b, a) {
      a.ea && a.da || Ab("makeClassHandle requires ptr and ptrType");
      !!a.la !== !!a.ia && Ab("Both smartPtrType and smartPtr must be specified");
      a.count = {
        value: 1
      };
      return Cb(Object.create(b, {
        ba: {
          value: a
        }
      }));
    }
    function Cb(b) {
      if ("undefined" === typeof FinalizationRegistry) return Cb = a => a, b;
      qb = new FinalizationRegistry(a => {
        rb(a.ba);
      });
      Cb = a => {
        var c = a.ba;
        c.ia && qb.register(a, {
          ba: c
        }, a);
        return a;
      };
      pb = a => {
        qb.unregister(a);
      };
      return Cb(b);
    }
    var Db = {};
    function Eb(b) {
      for (; b.length;) {
        var a = b.pop();
        b.pop()(a);
      }
    }
    function Fb(b) {
      return this.fromWireType(M[b >> 2]);
    }
    var Gb = {},
      Hb = {};
    function X(b, a, c) {
      function d(l) {
        l = c(l);
        l.length !== b.length && Ab("Mismatched type converter count");
        for (var p = 0; p < b.length; ++p) Y(b[p], l[p]);
      }
      b.forEach(function (l) {
        Hb[l] = a;
      });
      var e = Array(a.length),
        f = [],
        m = 0;
      a.forEach((l, p) => {
        kb.hasOwnProperty(l) ? e[p] = kb[l] : (f.push(l), Gb.hasOwnProperty(l) || (Gb[l] = []), Gb[l].push(() => {
          e[p] = kb[l];
          ++m;
          m === f.length && d(e);
        }));
      });
      0 === f.length && d(e);
    }
    function Ib(b) {
      switch (b) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError(`Unknown type size: ${b}`);
      }
    }
    function Jb(b, a, c = {}) {
      var d = a.name;
      b || R(`type "${d}" must have a positive integer typeid pointer`);
      if (kb.hasOwnProperty(b)) {
        if (c.Jb) return;
        R(`Cannot register type '${d}' twice`);
      }
      kb[b] = a;
      delete Hb[b];
      Gb.hasOwnProperty(b) && (a = Gb[b], delete Gb[b], a.forEach(e => e()));
    }
    function Y(b, a, c = {}) {
      if (!("argPackAdvance" in a)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
      Jb(b, a, c);
    }
    function Kb(b) {
      R(b.ba.ea.ca.name + " instance already deleted");
    }
    function Lb() {}
    function Mb(b, a, c) {
      if (void 0 === b[a].ga) {
        var d = b[a];
        b[a] = function () {
          b[a].ga.hasOwnProperty(arguments.length) || R(`Function '${c}' called with an invalid number of arguments (${arguments.length}) - expects one of (${b[a].ga})!`);
          return b[a].ga[arguments.length].apply(this, arguments);
        };
        b[a].ga = [];
        b[a].ga[d.va] = d;
      }
    }
    function Nb(b, a, c) {
      h.hasOwnProperty(b) ? ((void 0 === c || void 0 !== h[b].ga && void 0 !== h[b].ga[c]) && R(`Cannot register public name '${b}' twice`), Mb(h, b, b), h.hasOwnProperty(c) && R(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`), h[b].ga[c] = a) : (h[b] = a, void 0 !== c && (h[b].ac = c));
    }
    function Ob(b, a, c, d, e, f, m, l) {
      this.name = b;
      this.constructor = a;
      this.ma = c;
      this.ra = d;
      this.fa = e;
      this.Eb = f;
      this.Ba = m;
      this.zb = l;
      this.gb = [];
    }
    function Pb(b, a, c) {
      for (; a !== c;) a.Ba || R(`Expected null or instance of ${c.name}, got an instance of ${a.name}`), b = a.Ba(b), a = a.fa;
      return b;
    }
    function Qb(b, a) {
      if (null === a) return this.Na && R(`null is not a valid ${this.name}`), 0;
      a.ba || R(`Cannot pass "${Rb(a)}" as a ${this.name}`);
      a.ba.da || R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return Pb(a.ba.da, a.ba.ea.ca, this.ca);
    }
    function Sb(b, a) {
      if (null === a) {
        this.Na && R(`null is not a valid ${this.name}`);
        if (this.Ea) {
          var c = this.Oa();
          null !== b && b.push(this.ra, c);
          return c;
        }
        return 0;
      }
      a.ba || R(`Cannot pass "${Rb(a)}" as a ${this.name}`);
      a.ba.da || R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      !this.Da && a.ba.ea.Da && R(`Cannot convert argument of type ${a.ba.la ? a.ba.la.name : a.ba.ea.name} to parameter type ${this.name}`);
      c = Pb(a.ba.da, a.ba.ea.ca, this.ca);
      if (this.Ea) switch (void 0 === a.ba.ia && R("Passing raw pointer to smart pointer is illegal"), this.Vb) {
        case 0:
          a.ba.la === this ? c = a.ba.ia : R(`Cannot convert argument of type ${a.ba.la ? a.ba.la.name : a.ba.ea.name} to parameter type ${this.name}`);
          break;
        case 1:
          c = a.ba.ia;
          break;
        case 2:
          if (a.ba.la === this) c = a.ba.ia;else {
            var d = a.clone();
            c = this.Rb(c, U(function () {
              d["delete"]();
            }));
            null !== b && b.push(this.ra, c);
          }
          break;
        default:
          R("Unsupporting sharing policy");
      }
      return c;
    }
    function Tb(b, a) {
      if (null === a) return this.Na && R(`null is not a valid ${this.name}`), 0;
      a.ba || R(`Cannot pass "${Rb(a)}" as a ${this.name}`);
      a.ba.da || R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      a.ba.ea.Da && R(`Cannot convert argument of type ${a.ba.ea.name} to parameter type ${this.name}`);
      return Pb(a.ba.da, a.ba.ea.ca, this.ca);
    }
    function Ub(b, a, c, d) {
      this.name = b;
      this.ca = a;
      this.Na = c;
      this.Da = d;
      this.Ea = !1;
      this.ra = this.Rb = this.Oa = this.hb = this.Vb = this.Qb = void 0;
      void 0 !== a.fa ? this.toWireType = Sb : (this.toWireType = d ? Qb : Tb, this.ka = null);
    }
    function Vb(b, a, c) {
      h.hasOwnProperty(b) || Ab("Replacing nonexistant public symbol");
      void 0 !== h[b].ga && void 0 !== c ? h[b].ga[c] = a : (h[b] = a, h[b].va = c);
    }
    var Wb = (b, a) => {
      var c = [];
      return function () {
        c.length = 0;
        Object.assign(c, arguments);
        if (b.includes("j")) {
          var d = h["dynCall_" + b];
          d = c && c.length ? d.apply(null, [a].concat(c)) : d.call(null, a);
        } else d = Ia.get(a).apply(null, c);
        return d;
      };
    };
    function Z(b, a) {
      b = V(b);
      var c = b.includes("j") ? Wb(b, a) : Ia.get(a);
      "function" != typeof c && R(`unknown function pointer with signature ${b}: ${a}`);
      return c;
    }
    var Xb = void 0;
    function Yb(b, a) {
      function c(f) {
        e[f] || kb[f] || (Hb[f] ? Hb[f].forEach(c) : (d.push(f), e[f] = !0));
      }
      var d = [],
        e = {};
      a.forEach(c);
      throw new Xb(`${b}: ` + d.map(lb).join([", "]));
    }
    function Zb(b, a, c, d, e) {
      var f = a.length;
      2 > f && R("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var m = null !== a[1] && null !== c,
        l = !1;
      for (c = 1; c < a.length; ++c) if (null !== a[c] && void 0 === a[c].ka) {
        l = !0;
        break;
      }
      var p = "void" !== a[0].name,
        k = f - 2,
        r = Array(k),
        u = [],
        t = [];
      return function () {
        arguments.length !== k && R(`function ${b} called with ${arguments.length} arguments, expected ${k} args!`);
        t.length = 0;
        u.length = m ? 2 : 1;
        u[0] = e;
        if (m) {
          var g = a[1].toWireType(t, this);
          u[1] = g;
        }
        for (var n = 0; n < k; ++n) r[n] = a[n + 2].toWireType(t, arguments[n]), u.push(r[n]);
        n = d.apply(null, u);
        if (l) Eb(t);else for (var w = m ? 1 : 2; w < a.length; w++) {
          var H = 1 === w ? g : r[w - 2];
          null !== a[w].ka && a[w].ka(H);
        }
        g = p ? a[0].fromWireType(n) : void 0;
        return g;
      };
    }
    function $b(b, a) {
      for (var c = [], d = 0; d < b; d++) c.push(O[a + 4 * d >> 2]);
      return c;
    }
    function ac(b, a, c) {
      b instanceof Object || R(`${c} with invalid "this": ${b}`);
      b instanceof a.ca.constructor || R(`${c} incompatible with "this" of type ${b.constructor.name}`);
      b.ba.da || R(`cannot call emscripten binding method ${c} on deleted object`);
      return Pb(b.ba.da, b.ba.ea.ca, a.ca);
    }
    function bc(b) {
      b >= P.Xa && 0 === --P.get(b).ib && P.wb(b);
    }
    function cc(b, a, c) {
      switch (a) {
        case 0:
          return function (d) {
            return this.fromWireType((c ? Ca : L)[d]);
          };
        case 1:
          return function (d) {
            return this.fromWireType((c ? Da : Ea)[d >> 1]);
          };
        case 2:
          return function (d) {
            return this.fromWireType((c ? M : O)[d >> 2]);
          };
        default:
          throw new TypeError("Unknown integer type: " + b);
      }
    }
    function Rb(b) {
      if (null === b) return "null";
      var a = typeof b;
      return "object" === a || "array" === a || "function" === a ? b.toString() : "" + b;
    }
    function dc(b, a) {
      switch (a) {
        case 2:
          return function (c) {
            return this.fromWireType(Fa[c >> 2]);
          };
        case 3:
          return function (c) {
            return this.fromWireType(Ga[c >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + b);
      }
    }
    function ec(b, a, c) {
      switch (a) {
        case 0:
          return c ? function (d) {
            return Ca[d];
          } : function (d) {
            return L[d];
          };
        case 1:
          return c ? function (d) {
            return Da[d >> 1];
          } : function (d) {
            return Ea[d >> 1];
          };
        case 2:
          return c ? function (d) {
            return M[d >> 2];
          } : function (d) {
            return O[d >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + b);
      }
    }
    var fc = (b, a, c, d) => {
        if (0 < d) {
          d = c + d - 1;
          for (var e = 0; e < b.length; ++e) {
            var f = b.charCodeAt(e);
            if (55296 <= f && 57343 >= f) {
              var m = b.charCodeAt(++e);
              f = 65536 + ((f & 1023) << 10) | m & 1023;
            }
            if (127 >= f) {
              if (c >= d) break;
              a[c++] = f;
            } else {
              if (2047 >= f) {
                if (c + 1 >= d) break;
                a[c++] = 192 | f >> 6;
              } else {
                if (65535 >= f) {
                  if (c + 2 >= d) break;
                  a[c++] = 224 | f >> 12;
                } else {
                  if (c + 3 >= d) break;
                  a[c++] = 240 | f >> 18;
                  a[c++] = 128 | f >> 12 & 63;
                }
                a[c++] = 128 | f >> 6 & 63;
              }
              a[c++] = 128 | f & 63;
            }
          }
          a[c] = 0;
        }
      },
      gc = b => {
        for (var a = 0, c = 0; c < b.length; ++c) {
          var d = b.charCodeAt(c);
          127 >= d ? a++ : 2047 >= d ? a += 2 : 55296 <= d && 57343 >= d ? (a += 4, ++c) : a += 3;
        }
        return a;
      },
      hc = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0,
      ic = (b, a, c) => {
        var d = a + c;
        for (c = a; b[c] && !(c >= d);) ++c;
        if (16 < c - a && b.buffer && hc) return hc.decode(b.subarray(a, c));
        for (d = ""; a < c;) {
          var e = b[a++];
          if (e & 128) {
            var f = b[a++] & 63;
            if (192 == (e & 224)) d += String.fromCharCode((e & 31) << 6 | f);else {
              var m = b[a++] & 63;
              e = 224 == (e & 240) ? (e & 15) << 12 | f << 6 | m : (e & 7) << 18 | f << 12 | m << 6 | b[a++] & 63;
              65536 > e ? d += String.fromCharCode(e) : (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023));
            }
          } else d += String.fromCharCode(e);
        }
        return d;
      },
      jc = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0,
      lc = (b, a) => {
        var c = b >> 1;
        for (var d = c + a / 2; !(c >= d) && Ea[c];) ++c;
        c <<= 1;
        if (32 < c - b && jc) return jc.decode(L.subarray(b, c));
        c = "";
        for (d = 0; !(d >= a / 2); ++d) {
          var e = Da[b + 2 * d >> 1];
          if (0 == e) break;
          c += String.fromCharCode(e);
        }
        return c;
      },
      mc = (b, a, c) => {
        void 0 === c && (c = 2147483647);
        if (2 > c) return 0;
        c -= 2;
        var d = a;
        c = c < 2 * b.length ? c / 2 : b.length;
        for (var e = 0; e < c; ++e) Da[a >> 1] = b.charCodeAt(e), a += 2;
        Da[a >> 1] = 0;
        return a - d;
      },
      nc = b => 2 * b.length,
      oc = (b, a) => {
        for (var c = 0, d = ""; !(c >= a / 4);) {
          var e = M[b + 4 * c >> 2];
          if (0 == e) break;
          ++c;
          65536 <= e ? (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023)) : d += String.fromCharCode(e);
        }
        return d;
      },
      pc = (b, a, c) => {
        void 0 === c && (c = 2147483647);
        if (4 > c) return 0;
        var d = a;
        c = d + c - 4;
        for (var e = 0; e < b.length; ++e) {
          var f = b.charCodeAt(e);
          if (55296 <= f && 57343 >= f) {
            var m = b.charCodeAt(++e);
            f = 65536 + ((f & 1023) << 10) | m & 1023;
          }
          M[a >> 2] = f;
          a += 4;
          if (a + 4 > c) break;
        }
        M[a >> 2] = 0;
        return a - d;
      },
      qc = b => {
        for (var a = 0, c = 0; c < b.length; ++c) {
          var d = b.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          a += 4;
        }
        return a;
      },
      rc = {};
    function sc(b) {
      var a = rc[b];
      return void 0 === a ? V(b) : a;
    }
    var tc = [];
    function uc(b) {
      var a = tc.length;
      tc.push(b);
      return a;
    }
    function vc(b, a) {
      for (var c = Array(b), d = 0; d < b; ++d) c[d] = ob(O[a + 4 * d >> 2], "parameter " + d);
      return c;
    }
    var wc = [],
      xc = {},
      zc = () => {
        if (!yc) {
          var b = {
              USER: "web_user",
              LOGNAME: "web_user",
              PATH: "/",
              PWD: "/",
              HOME: "/home/web_user",
              LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
              _: pa || "./this.program"
            },
            a;
          for (a in xc) void 0 === xc[a] ? delete b[a] : b[a] = xc[a];
          var c = [];
          for (a in b) c.push(`${a}=${b[a]}`);
          yc = c;
        }
        return yc;
      },
      yc,
      Ac = [null, [], []],
      Bc = b => 0 === b % 4 && (0 !== b % 100 || 0 === b % 400),
      Cc = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      Dc = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function Ec(b) {
      var a = Array(gc(b) + 1);
      fc(b, a, 0, a.length);
      return a;
    }
    var Fc = (b, a, c, d) => {
      function e(g, n, w) {
        for (g = "number" == typeof g ? g.toString() : g || ""; g.length < n;) g = w[0] + g;
        return g;
      }
      function f(g, n) {
        return e(g, n, "0");
      }
      function m(g, n) {
        function w(x) {
          return 0 > x ? -1 : 0 < x ? 1 : 0;
        }
        var H;
        0 === (H = w(g.getFullYear() - n.getFullYear())) && 0 === (H = w(g.getMonth() - n.getMonth())) && (H = w(g.getDate() - n.getDate()));
        return H;
      }
      function l(g) {
        switch (g.getDay()) {
          case 0:
            return new Date(g.getFullYear() - 1, 11, 29);
          case 1:
            return g;
          case 2:
            return new Date(g.getFullYear(), 0, 3);
          case 3:
            return new Date(g.getFullYear(), 0, 2);
          case 4:
            return new Date(g.getFullYear(), 0, 1);
          case 5:
            return new Date(g.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(g.getFullYear() - 1, 11, 30);
        }
      }
      function p(g) {
        var n = g.ta;
        for (g = new Date(new Date(g.ua + 1900, 0, 1).getTime()); 0 < n;) {
          var w = g.getMonth(),
            H = (Bc(g.getFullYear()) ? Cc : Dc)[w];
          if (n > H - g.getDate()) n -= H - g.getDate() + 1, g.setDate(1), 11 > w ? g.setMonth(w + 1) : (g.setMonth(0), g.setFullYear(g.getFullYear() + 1));else {
            g.setDate(g.getDate() + n);
            break;
          }
        }
        w = new Date(g.getFullYear() + 1, 0, 4);
        n = l(new Date(g.getFullYear(), 0, 4));
        w = l(w);
        return 0 >= m(n, g) ? 0 >= m(w, g) ? g.getFullYear() + 1 : g.getFullYear() : g.getFullYear() - 1;
      }
      var k = M[d + 40 >> 2];
      d = {
        Yb: M[d >> 2],
        Xb: M[d + 4 >> 2],
        Ia: M[d + 8 >> 2],
        Qa: M[d + 12 >> 2],
        Ja: M[d + 16 >> 2],
        ua: M[d + 20 >> 2],
        na: M[d + 24 >> 2],
        ta: M[d + 28 >> 2],
        bc: M[d + 32 >> 2],
        Wb: M[d + 36 >> 2],
        Zb: k ? k ? ic(L, k) : "" : ""
      };
      c = c ? ic(L, c) : "";
      k = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y"
      };
      for (var r in k) c = c.replace(new RegExp(r, "g"), k[r]);
      var u = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
        t = "January February March April May June July August September October November December".split(" ");
      k = {
        "%a": g => u[g.na].substring(0, 3),
        "%A": g => u[g.na],
        "%b": g => t[g.Ja].substring(0, 3),
        "%B": g => t[g.Ja],
        "%C": g => f((g.ua + 1900) / 100 | 0, 2),
        "%d": g => f(g.Qa, 2),
        "%e": g => e(g.Qa, 2, " "),
        "%g": g => p(g).toString().substring(2),
        "%G": g => p(g),
        "%H": g => f(g.Ia, 2),
        "%I": g => {
          g = g.Ia;
          0 == g ? g = 12 : 12 < g && (g -= 12);
          return f(g, 2);
        },
        "%j": g => {
          for (var n = 0, w = 0; w <= g.Ja - 1; n += (Bc(g.ua + 1900) ? Cc : Dc)[w++]);
          return f(g.Qa + n, 3);
        },
        "%m": g => f(g.Ja + 1, 2),
        "%M": g => f(g.Xb, 2),
        "%n": () => "\n",
        "%p": g => 0 <= g.Ia && 12 > g.Ia ? "AM" : "PM",
        "%S": g => f(g.Yb, 2),
        "%t": () => "\t",
        "%u": g => g.na || 7,
        "%U": g => f(Math.floor((g.ta + 7 - g.na) / 7), 2),
        "%V": g => {
          var n = Math.floor((g.ta + 7 - (g.na + 6) % 7) / 7);
          2 >= (g.na + 371 - g.ta - 2) % 7 && n++;
          if (n) 53 == n && (w = (g.na + 371 - g.ta) % 7, 4 == w || 3 == w && Bc(g.ua) || (n = 1));else {
            n = 52;
            var w = (g.na + 7 - g.ta - 1) % 7;
            (4 == w || 5 == w && Bc(g.ua % 400 - 1)) && n++;
          }
          return f(n, 2);
        },
        "%w": g => g.na,
        "%W": g => f(Math.floor((g.ta + 7 - (g.na + 6) % 7) / 7), 2),
        "%y": g => (g.ua + 1900).toString().substring(2),
        "%Y": g => g.ua + 1900,
        "%z": g => {
          g = g.Wb;
          var n = 0 <= g;
          g = Math.abs(g) / 60;
          return (n ? "+" : "-") + String("0000" + (g / 60 * 100 + g % 60)).slice(-4);
        },
        "%Z": g => g.Zb,
        "%%": () => "%"
      };
      c = c.replace(/%%/g, "\x00\x00");
      for (r in k) c.includes(r) && (c = c.replace(new RegExp(r, "g"), k[r](d)));
      c = c.replace(/\0\0/g, "%");
      r = Ec(c);
      if (r.length > a) return 0;
      Ca.set(r, b);
      return r.length - 1;
    };
    Object.assign(ab.prototype, {
      get(b) {
        return this.qa[b];
      },
      has(b) {
        return void 0 !== this.qa[b];
      },
      tb(b) {
        var a = this.bb.pop() || this.qa.length;
        this.qa[a] = b;
        return a;
      },
      wb(b) {
        this.qa[b] = void 0;
        this.bb.push(b);
      }
    });
    bb = h.BindingError = class extends Error {
      constructor(b) {
        super(b);
        this.name = "BindingError";
      }
    };
    P.qa.push({
      value: void 0
    }, {
      value: null
    }, {
      value: !0
    }, {
      value: !1
    });
    P.Xa = P.qa.length;
    h.count_emval_handles = function () {
      for (var b = 0, a = P.Xa; a < P.qa.length; ++a) void 0 !== P.qa[a] && ++b;
      return b;
    };
    db = h.PureVirtualError = cb("PureVirtualError");
    for (var Gc = Array(256), Hc = 0; 256 > Hc; ++Hc) Gc[Hc] = String.fromCharCode(Hc);
    eb = Gc;
    h.getInheritedInstanceCount = function () {
      return Object.keys(ib).length;
    };
    h.getLiveInheritedInstances = function () {
      var b = [],
        a;
      for (a in ib) ib.hasOwnProperty(a) && b.push(ib[a]);
      return b;
    };
    h.flushPendingDeletes = gb;
    h.setDelayFunction = function (b) {
      hb = b;
      fb.length && hb && hb(gb);
    };
    zb = h.InternalError = class extends Error {
      constructor(b) {
        super(b);
        this.name = "InternalError";
      }
    };
    Lb.prototype.isAliasOf = function (b) {
      if (!(this instanceof Lb && b instanceof Lb)) return !1;
      var a = this.ba.ea.ca,
        c = this.ba.da,
        d = b.ba.ea.ca;
      for (b = b.ba.da; a.fa;) c = a.Ba(c), a = a.fa;
      for (; d.fa;) b = d.Ba(b), d = d.fa;
      return a === d && c === b;
    };
    Lb.prototype.clone = function () {
      this.ba.da || Kb(this);
      if (this.ba.ya) return this.ba.count.value += 1, this;
      var b = Cb,
        a = Object,
        c = a.create,
        d = Object.getPrototypeOf(this),
        e = this.ba;
      b = b(c.call(a, d, {
        ba: {
          value: {
            count: e.count,
            wa: e.wa,
            ya: e.ya,
            da: e.da,
            ea: e.ea,
            ia: e.ia,
            la: e.la
          }
        }
      }));
      b.ba.count.value += 1;
      b.ba.wa = !1;
      return b;
    };
    Lb.prototype["delete"] = function () {
      this.ba.da || Kb(this);
      this.ba.wa && !this.ba.ya && R("Object already scheduled for deletion");
      pb(this);
      rb(this.ba);
      this.ba.ya || (this.ba.ia = void 0, this.ba.da = void 0);
    };
    Lb.prototype.isDeleted = function () {
      return !this.ba.da;
    };
    Lb.prototype.deleteLater = function () {
      this.ba.da || Kb(this);
      this.ba.wa && !this.ba.ya && R("Object already scheduled for deletion");
      fb.push(this);
      1 === fb.length && hb && hb(gb);
      this.ba.wa = !0;
      return this;
    };
    Ub.prototype.Fb = function (b) {
      this.hb && (b = this.hb(b));
      return b;
    };
    Ub.prototype.Ya = function (b) {
      this.ra && this.ra(b);
    };
    Ub.prototype.argPackAdvance = 8;
    Ub.prototype.readValueFromPointer = Fb;
    Ub.prototype.deleteObject = function (b) {
      if (null !== b) b["delete"]();
    };
    Ub.prototype.fromWireType = function (b) {
      function a() {
        return this.Ea ? Bb(this.ca.ma, {
          ea: this.Qb,
          da: c,
          la: this,
          ia: b
        }) : Bb(this.ca.ma, {
          ea: this,
          da: b
        });
      }
      var c = this.Fb(b);
      if (!c) return this.Ya(b), null;
      var d = yb(this.ca, c);
      if (void 0 !== d) {
        if (0 === d.ba.count.value) return d.ba.da = c, d.ba.ia = b, d.clone();
        d = d.clone();
        this.Ya(b);
        return d;
      }
      d = this.ca.Eb(c);
      d = xb[d];
      if (!d) return a.call(this);
      d = this.Da ? d.ub : d.pointerType;
      var e = wb(c, this.ca, d.ca);
      return null === e ? a.call(this) : this.Ea ? Bb(d.ca.ma, {
        ea: d,
        da: e,
        la: this,
        ia: b
      }) : Bb(d.ca.ma, {
        ea: d,
        da: e
      });
    };
    Xb = h.UnboundTypeError = cb("UnboundTypeError");
    var Jc = {
      N: function (b, a, c) {
        b = V(b);
        a = ob(a, "wrapper");
        c = S(c);
        var d = [].slice,
          e = a.ca,
          f = e.ma,
          m = e.fa.ma,
          l = e.fa.constructor;
        b = $a(b, function () {
          e.fa.gb.forEach(function (k) {
            if (this[k] === m[k]) throw new db(`Pure virtual function ${k} must be implemented in JavaScript`);
          }.bind(this));
          Object.defineProperty(this, "__parent", {
            value: f
          });
          this.__construct.apply(this, d.call(arguments));
        });
        f.__construct = function () {
          this === f && R("Pass correct 'this' to __construct");
          var k = l.implement.apply(void 0, [this].concat(d.call(arguments)));
          pb(k);
          var r = k.ba;
          k.notifyOnDestruction();
          r.ya = !0;
          Object.defineProperties(this, {
            ba: {
              value: r
            }
          });
          Cb(this);
          k = r.da;
          k = jb(e, k);
          ib.hasOwnProperty(k) ? R(`Tried to register registered instance: ${k}`) : ib[k] = this;
        };
        f.__destruct = function () {
          this === f && R("Pass correct 'this' to __destruct");
          pb(this);
          var k = this.ba.da;
          k = jb(e, k);
          ib.hasOwnProperty(k) ? delete ib[k] : R(`Tried to unregister unregistered instance: ${k}`);
        };
        b.prototype = Object.create(f);
        for (var p in c) b.prototype[p] = c[p];
        return U(b);
      },
      O: function (b) {
        var a = Db[b];
        delete Db[b];
        var c = a.Oa,
          d = a.ra,
          e = a.ab,
          f = e.map(m => m.Ib).concat(e.map(m => m.Tb));
        X([b], f, m => {
          var l = {};
          e.forEach((p, k) => {
            var r = m[k],
              u = p.Gb,
              t = p.Hb,
              g = m[k + e.length],
              n = p.Sb,
              w = p.Ub;
            l[p.Cb] = {
              read: H => r.fromWireType(u(t, H)),
              write: (H, x) => {
                var A = [];
                n(w, H, g.toWireType(A, x));
                Eb(A);
              }
            };
          });
          return [{
            name: a.name,
            fromWireType: function (p) {
              var k = {},
                r;
              for (r in l) k[r] = l[r].read(p);
              d(p);
              return k;
            },
            toWireType: function (p, k) {
              for (var r in l) if (!(r in k)) throw new TypeError(`Missing field: "${r}"`);
              var u = c();
              for (r in l) l[r].write(u, k[r]);
              null !== p && p.push(d, u);
              return u;
            },
            argPackAdvance: 8,
            readValueFromPointer: Fb,
            ka: d
          }];
        });
      },
      C: function () {},
      K: function (b, a, c, d, e) {
        var f = Ib(c);
        a = V(a);
        Y(b, {
          name: a,
          fromWireType: function (m) {
            return !!m;
          },
          toWireType: function (m, l) {
            return l ? d : e;
          },
          argPackAdvance: 8,
          readValueFromPointer: function (m) {
            if (1 === c) var l = Ca;else if (2 === c) l = Da;else if (4 === c) l = M;else throw new TypeError("Unknown boolean type size: " + a);
            return this.fromWireType(l[m >> f]);
          },
          ka: null
        });
      },
      f: function (b, a, c, d, e, f, m, l, p, k, r, u, t) {
        r = V(r);
        f = Z(e, f);
        l && (l = Z(m, l));
        k && (k = Z(p, k));
        t = Z(u, t);
        var g = Ya(r);
        Nb(g, function () {
          Yb(`Cannot construct ${r} due to unbound types`, [d]);
        });
        X([b, a, c], d ? [d] : [], function (n) {
          n = n[0];
          if (d) {
            var w = n.ca;
            var H = w.ma;
          } else H = Lb.prototype;
          n = $a(g, function () {
            if (Object.getPrototypeOf(this) !== x) throw new bb("Use 'new' to construct " + r);
            if (void 0 === A.sa) throw new bb(r + " has no accessible constructor");
            var Q = A.sa[arguments.length];
            if (void 0 === Q) throw new bb(`Tried to invoke ctor of ${r} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(A.sa).toString()}) parameters instead!`);
            return Q.apply(this, arguments);
          });
          var x = Object.create(H, {
            constructor: {
              value: n
            }
          });
          n.prototype = x;
          var A = new Ob(r, n, x, t, w, f, l, k);
          A.fa && (void 0 === A.fa.Ca && (A.fa.Ca = []), A.fa.Ca.push(A));
          w = new Ub(r, A, !0, !1);
          H = new Ub(r + "*", A, !1, !1);
          var J = new Ub(r + " const*", A, !1, !0);
          xb[b] = {
            pointerType: H,
            ub: J
          };
          Vb(g, n);
          return [w, H, J];
        });
      },
      j: function (b, a, c, d, e, f, m) {
        var l = $b(c, d);
        a = V(a);
        f = Z(e, f);
        X([], [b], function (p) {
          function k() {
            Yb(`Cannot call ${r} due to unbound types`, l);
          }
          p = p[0];
          var r = `${p.name}.${a}`;
          a.startsWith("@@") && (a = Symbol[a.substring(2)]);
          var u = p.ca.constructor;
          void 0 === u[a] ? (k.va = c - 1, u[a] = k) : (Mb(u, a, r), u[a].ga[c - 1] = k);
          X([], l, function (t) {
            t = Zb(r, [t[0], null].concat(t.slice(1)), null, f, m);
            void 0 === u[a].ga ? (t.va = c - 1, u[a] = t) : u[a].ga[c - 1] = t;
            if (p.ca.Ca) for (const g of p.ca.Ca) g.constructor.hasOwnProperty(a) || (g.constructor[a] = t);
            return [];
          });
          return [];
        });
      },
      x: function (b, a, c, d, e, f, m, l) {
        a = V(a);
        f = Z(e, f);
        X([], [b], function (p) {
          p = p[0];
          var k = `${p.name}.${a}`,
            r = {
              get() {
                Yb(`Cannot access ${k} due to unbound types`, [c]);
              },
              enumerable: !0,
              configurable: !0
            };
          r.set = l ? () => {
            Yb(`Cannot access ${k} due to unbound types`, [c]);
          } : () => {
            R(`${k} is a read-only property`);
          };
          Object.defineProperty(p.ca.constructor, a, r);
          X([], [c], function (u) {
            u = u[0];
            var t = {
              get() {
                return u.fromWireType(f(d));
              },
              enumerable: !0
            };
            l && (l = Z(m, l), t.set = g => {
              var n = [];
              l(d, u.toWireType(n, g));
              Eb(n);
            });
            Object.defineProperty(p.ca.constructor, a, t);
            return [];
          });
          return [];
        });
      },
      s: function (b, a, c, d, e, f) {
        var m = $b(a, c);
        e = Z(d, e);
        X([], [b], function (l) {
          l = l[0];
          var p = `constructor ${l.name}`;
          void 0 === l.ca.sa && (l.ca.sa = []);
          if (void 0 !== l.ca.sa[a - 1]) throw new bb(`Cannot register multiple constructors with identical number of parameters (${a - 1}) for class '${l.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
          l.ca.sa[a - 1] = () => {
            Yb(`Cannot construct ${l.name} due to unbound types`, m);
          };
          X([], m, function (k) {
            k.splice(1, 0, null);
            l.ca.sa[a - 1] = Zb(p, k, null, e, f);
            return [];
          });
          return [];
        });
      },
      a: function (b, a, c, d, e, f, m, l) {
        var p = $b(c, d);
        a = V(a);
        f = Z(e, f);
        X([], [b], function (k) {
          function r() {
            Yb(`Cannot call ${u} due to unbound types`, p);
          }
          k = k[0];
          var u = `${k.name}.${a}`;
          a.startsWith("@@") && (a = Symbol[a.substring(2)]);
          l && k.ca.gb.push(a);
          var t = k.ca.ma,
            g = t[a];
          void 0 === g || void 0 === g.ga && g.className !== k.name && g.va === c - 2 ? (r.va = c - 2, r.className = k.name, t[a] = r) : (Mb(t, a, u), t[a].ga[c - 2] = r);
          X([], p, function (n) {
            n = Zb(u, n, k, f, m);
            void 0 === t[a].ga ? (n.va = c - 2, t[a] = n) : t[a].ga[c - 2] = n;
            return [];
          });
          return [];
        });
      },
      e: function (b, a, c, d, e, f, m, l, p, k) {
        a = V(a);
        e = Z(d, e);
        X([], [b], function (r) {
          r = r[0];
          var u = `${r.name}.${a}`,
            t = {
              get() {
                Yb(`Cannot access ${u} due to unbound types`, [c, m]);
              },
              enumerable: !0,
              configurable: !0
            };
          t.set = p ? () => {
            Yb(`Cannot access ${u} due to unbound types`, [c, m]);
          } : () => {
            R(u + " is a read-only property");
          };
          Object.defineProperty(r.ca.ma, a, t);
          X([], p ? [c, m] : [c], function (g) {
            var n = g[0],
              w = {
                get() {
                  var x = ac(this, r, u + " getter");
                  return n.fromWireType(e(f, x));
                },
                enumerable: !0
              };
            if (p) {
              p = Z(l, p);
              var H = g[1];
              w.set = function (x) {
                var A = ac(this, r, u + " setter"),
                  J = [];
                p(k, A, H.toWireType(J, x));
                Eb(J);
              };
            }
            Object.defineProperty(r.ca.ma, a, w);
            return [];
          });
          return [];
        });
      },
      J: function (b, a) {
        a = V(a);
        Y(b, {
          name: a,
          fromWireType: function (c) {
            var d = S(c);
            bc(c);
            return d;
          },
          toWireType: function (c, d) {
            return U(d);
          },
          argPackAdvance: 8,
          readValueFromPointer: Fb,
          ka: null
        });
      },
      p: function (b, a, c, d) {
        function e() {}
        c = Ib(c);
        a = V(a);
        e.values = {};
        Y(b, {
          name: a,
          constructor: e,
          fromWireType: function (f) {
            return this.constructor.values[f];
          },
          toWireType: function (f, m) {
            return m.value;
          },
          argPackAdvance: 8,
          readValueFromPointer: cc(a, c, d),
          ka: null
        });
        Nb(a, e);
      },
      d: function (b, a, c) {
        var d = ob(b, "enum");
        a = V(a);
        b = d.constructor;
        d = Object.create(d.constructor.prototype, {
          value: {
            value: c
          },
          constructor: {
            value: $a(`${d.name}_${a}`, function () {})
          }
        });
        b.values[c] = d;
        b[a] = d;
      },
      y: function (b, a, c) {
        c = Ib(c);
        a = V(a);
        Y(b, {
          name: a,
          fromWireType: function (d) {
            return d;
          },
          toWireType: function (d, e) {
            return e;
          },
          argPackAdvance: 8,
          readValueFromPointer: dc(a, c),
          ka: null
        });
      },
      m: function (b, a, c, d, e, f) {
        var m = $b(a, c);
        b = V(b);
        e = Z(d, e);
        Nb(b, function () {
          Yb(`Cannot call ${b} due to unbound types`, m);
        }, a - 1);
        X([], m, function (l) {
          Vb(b, Zb(b, [l[0], null].concat(l.slice(1)), null, e, f), a - 1);
          return [];
        });
      },
      l: function (b, a, c, d, e) {
        a = V(a);
        -1 === e && (e = 4294967295);
        e = Ib(c);
        var f = l => l;
        if (0 === d) {
          var m = 32 - 8 * c;
          f = l => l << m >>> m;
        }
        c = a.includes("unsigned") ? function (l, p) {
          return p >>> 0;
        } : function (l, p) {
          return p;
        };
        Y(b, {
          name: a,
          fromWireType: f,
          toWireType: c,
          argPackAdvance: 8,
          readValueFromPointer: ec(a, e, 0 !== d),
          ka: null
        });
      },
      g: function (b, a, c) {
        function d(f) {
          f >>= 2;
          var m = O;
          return new e(m.buffer, m[f + 1], m[f]);
        }
        var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][a];
        c = V(c);
        Y(b, {
          name: c,
          fromWireType: d,
          argPackAdvance: 8,
          readValueFromPointer: d
        }, {
          Jb: !0
        });
      },
      z: function (b, a) {
        a = V(a);
        var c = "std::string" === a;
        Y(b, {
          name: a,
          fromWireType: function (d) {
            var e = O[d >> 2],
              f = d + 4;
            if (c) for (var m = f, l = 0; l <= e; ++l) {
              var p = f + l;
              if (l == e || 0 == L[p]) {
                m = m ? ic(L, m, p - m) : "";
                if (void 0 === k) var k = m;else k += String.fromCharCode(0), k += m;
                m = p + 1;
              }
            } else {
              k = Array(e);
              for (l = 0; l < e; ++l) k[l] = String.fromCharCode(L[f + l]);
              k = k.join("");
            }
            nb(d);
            return k;
          },
          toWireType: function (d, e) {
            e instanceof ArrayBuffer && (e = new Uint8Array(e));
            var f = "string" == typeof e;
            f || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array || R("Cannot pass non-string to std::string");
            var m = c && f ? gc(e) : e.length;
            var l = Ic(4 + m + 1),
              p = l + 4;
            O[l >> 2] = m;
            if (c && f) fc(e, L, p, m + 1);else if (f) for (f = 0; f < m; ++f) {
              var k = e.charCodeAt(f);
              255 < k && (nb(p), R("String has UTF-16 code units that do not fit in 8 bits"));
              L[p + f] = k;
            } else for (f = 0; f < m; ++f) L[p + f] = e[f];
            null !== d && d.push(nb, l);
            return l;
          },
          argPackAdvance: 8,
          readValueFromPointer: Fb,
          ka: function (d) {
            nb(d);
          }
        });
      },
      u: function (b, a, c) {
        c = V(c);
        if (2 === a) {
          var d = lc;
          var e = mc;
          var f = nc;
          var m = () => Ea;
          var l = 1;
        } else 4 === a && (d = oc, e = pc, f = qc, m = () => O, l = 2);
        Y(b, {
          name: c,
          fromWireType: function (p) {
            for (var k = O[p >> 2], r = m(), u, t = p + 4, g = 0; g <= k; ++g) {
              var n = p + 4 + g * a;
              if (g == k || 0 == r[n >> l]) t = d(t, n - t), void 0 === u ? u = t : (u += String.fromCharCode(0), u += t), t = n + a;
            }
            nb(p);
            return u;
          },
          toWireType: function (p, k) {
            "string" != typeof k && R(`Cannot pass non-string to C++ string type ${c}`);
            var r = f(k),
              u = Ic(4 + r + a);
            O[u >> 2] = r >> l;
            e(k, u + 4, r + a);
            null !== p && p.push(nb, u);
            return u;
          },
          argPackAdvance: 8,
          readValueFromPointer: Fb,
          ka: function (p) {
            nb(p);
          }
        });
      },
      Q: function (b, a, c, d, e, f) {
        Db[b] = {
          name: V(a),
          Oa: Z(c, d),
          ra: Z(e, f),
          ab: []
        };
      },
      P: function (b, a, c, d, e, f, m, l, p, k) {
        Db[b].ab.push({
          Cb: V(a),
          Ib: c,
          Gb: Z(d, e),
          Hb: f,
          Tb: m,
          Sb: Z(l, p),
          Ub: k
        });
      },
      L: function (b, a) {
        a = V(a);
        Y(b, {
          Lb: !0,
          name: a,
          argPackAdvance: 0,
          fromWireType: function () {},
          toWireType: function () {}
        });
      },
      v: function (b, a, c) {
        b = S(b);
        a = ob(a, "emval::as");
        var d = [],
          e = U(d);
        O[c >> 2] = e;
        return a.toWireType(d, b);
      },
      w: function (b, a, c, d, e) {
        b = tc[b];
        a = S(a);
        c = sc(c);
        var f = [];
        O[d >> 2] = U(f);
        return b(a, c, f, e);
      },
      i: function (b, a, c, d) {
        b = tc[b];
        a = S(a);
        c = sc(c);
        b(a, c, null, d);
      },
      c: bc,
      h: function (b, a) {
        var c = vc(b, a),
          d = c[0];
        a = d.name + "_$" + c.slice(1).map(function (m) {
          return m.name;
        }).join("_") + "$";
        var e = wc[a];
        if (void 0 !== e) return e;
        var f = Array(b - 1);
        e = uc((m, l, p, k) => {
          for (var r = 0, u = 0; u < b - 1; ++u) f[u] = c[u + 1].readValueFromPointer(k + r), r += c[u + 1].argPackAdvance;
          m = m[l].apply(m, f);
          for (u = 0; u < b - 1; ++u) c[u + 1].xb && c[u + 1].xb(f[u]);
          if (!d.Lb) return d.toWireType(p, m);
        });
        return wc[a] = e;
      },
      t: function (b) {
        b = sc(b);
        return U(h[b]);
      },
      M: function (b, a) {
        b = S(b);
        a = S(a);
        return U(b[a]);
      },
      n: function (b) {
        4 < b && (P.get(b).ib += 1);
      },
      o: function (b) {
        return U(sc(b));
      },
      A: function () {
        return U({});
      },
      q: function (b) {
        var a = S(b);
        Eb(a);
        bc(b);
      },
      k: function (b, a, c) {
        b = S(b);
        a = S(a);
        c = S(c);
        b[a] = c;
      },
      r: function (b, a) {
        b = ob(b, "_emval_take_value");
        b = b.readValueFromPointer(a);
        return U(b);
      },
      b: () => {
        za("");
      },
      E: b => {
        var a = L.length;
        b >>>= 0;
        if (2147483648 < b) return !1;
        for (var c = 1; 4 >= c; c *= 2) {
          var d = a * (1 + .2 / c);
          d = Math.min(d, b + 100663296);
          var e = Math;
          d = Math.max(b, d);
          a: {
            e = e.min.call(e, 2147483648, d + (65536 - d % 65536) % 65536) - Aa.buffer.byteLength + 65535 >>> 16;
            try {
              Aa.grow(e);
              Ha();
              var f = 1;
              break a;
            } catch (m) {}
            f = void 0;
          }
          if (f) return !0;
        }
        return !1;
      },
      F: (b, a) => {
        var c = 0;
        zc().forEach(function (d, e) {
          var f = a + c;
          e = O[b + 4 * e >> 2] = f;
          for (f = 0; f < d.length; ++f) Ca[e++ >> 0] = d.charCodeAt(f);
          Ca[e >> 0] = 0;
          c += d.length + 1;
        });
        return 0;
      },
      G: (b, a) => {
        var c = zc();
        O[b >> 2] = c.length;
        var d = 0;
        c.forEach(function (e) {
          d += e.length + 1;
        });
        O[a >> 2] = d;
        return 0;
      },
      H: () => 52,
      B: function () {
        return 70;
      },
      I: (b, a, c, d) => {
        for (var e = 0, f = 0; f < c; f++) {
          var m = O[a >> 2],
            l = O[a + 4 >> 2];
          a += 8;
          for (var p = 0; p < l; p++) {
            var k = L[m + p],
              r = Ac[b];
            0 === k || 10 === k ? ((1 === b ? wa : xa)(ic(r, 0)), r.length = 0) : r.push(k);
          }
          e += l;
        }
        O[d >> 2] = e;
        return 0;
      },
      D: (b, a, c, d) => Fc(b, a, c, d)
    };
    (function () {
      function b(c) {
        I = c = c.exports;
        Aa = I.R;
        Ha();
        Ia = I.X;
        Ka.unshift(I.S);
        Na--;
        h.monitorRunDependencies && h.monitorRunDependencies(Na);
        if (0 == Na && (null !== Oa && (clearInterval(Oa), Oa = null), Pa)) {
          var d = Pa;
          Pa = null;
          d();
        }
        return c;
      }
      var a = {
        a: Jc
      };
      Na++;
      h.monitorRunDependencies && h.monitorRunDependencies(Na);
      if (h.instantiateWasm) try {
        return h.instantiateWasm(a, b);
      } catch (c) {
        xa("Module.instantiateWasm callback failed with error: " + c), ca(c);
      }
      Wa(a, function (c) {
        b(c.instance);
      }).catch(ca);
      return {};
    })();
    var nb = b => (nb = I.T)(b),
      Ic = b => (Ic = I.U)(b),
      mb = b => (mb = I.V)(b);
    h.__embind_initialize_bindings = () => (h.__embind_initialize_bindings = I.W)();
    h.dynCall_jiji = (b, a, c, d, e) => (h.dynCall_jiji = I.Y)(b, a, c, d, e);
    h.dynCall_viijii = (b, a, c, d, e, f, m) => (h.dynCall_viijii = I.Z)(b, a, c, d, e, f, m);
    h.dynCall_iiiiij = (b, a, c, d, e, f, m) => (h.dynCall_iiiiij = I._)(b, a, c, d, e, f, m);
    h.dynCall_iiiiijj = (b, a, c, d, e, f, m, l, p) => (h.dynCall_iiiiijj = I.$)(b, a, c, d, e, f, m, l, p);
    h.dynCall_iiiiiijj = (b, a, c, d, e, f, m, l, p, k) => (h.dynCall_iiiiiijj = I.aa)(b, a, c, d, e, f, m, l, p, k);
    var Kc;
    Pa = function Lc() {
      Kc || Mc();
      Kc || (Pa = Lc);
    };
    function Mc() {
      function b() {
        if (!Kc && (Kc = !0, h.calledRun = !0, !Ba)) {
          Xa(Ka);
          ba(h);
          if (h.onRuntimeInitialized) h.onRuntimeInitialized();
          if (h.postRun) for ("function" == typeof h.postRun && (h.postRun = [h.postRun]); h.postRun.length;) {
            var a = h.postRun.shift();
            La.unshift(a);
          }
          Xa(La);
        }
      }
      if (!(0 < Na)) {
        if (h.preRun) for ("function" == typeof h.preRun && (h.preRun = [h.preRun]); h.preRun.length;) Ma();
        Xa(Ja);
        0 < Na || (h.setStatus ? (h.setStatus("Running..."), setTimeout(function () {
          setTimeout(function () {
            h.setStatus("");
          }, 1);
          b();
        }, 1)) : b());
      }
    }
    if (h.preInit) for ("function" == typeof h.preInit && (h.preInit = [h.preInit]); 0 < h.preInit.length;) h.preInit.pop()();
    Mc();
    return moduleArg.ready;
  };
})();
var _default = exports.default = Rive;
},{}],"main.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function sent() {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
var canvas_advanced_1 = __importDefault(require("@rive-app/canvas-advanced"));
var correctSVG = document.getElementById('correct');
var incorrectSVG = document.getElementById('incorrect');
function main() {
  return __awaiter(this, void 0, void 0, function () {
    function generateDanceFloor() {
      for (var i = 0; i < ROWS; ++i) {
        danceFloorGrid[i] = [];
        crawlGrid[i] = [];
        for (var j = 0; j < COLS; ++j) {
          danceFloorGrid[i][j] = 0;
          crawlGrid[i][j] = 0;
          // const floorInstance = floorFile.artboardByName("artboard");
          var floorInstance = floorFile.defaultArtboard();
          var floorMachine = new rive.StateMachineInstance(floor.stateMachineByName("State Machine"), floorInstance);
          var state = void 0;
          for (var k = 0; k < floorMachine.inputCount(); k++) {
            var input = floorMachine.input(k);
            switch (input.name) {
              case "State":
                state = input;
                break;
              default:
                break;
            }
          }
          var blockInstance = {
            x: danceFloorPos.x + j * floorDim,
            y: danceFloorPos.y + i * floorDim,
            row: i,
            col: j,
            artboard: floorInstance,
            machine: floorMachine,
            state: state
          };
          floorMachine.advance(0);
          blockInstance.artboard.advance(0);
          floors.add(blockInstance);
        }
      }
    }
    function shuffleArr(array) {
      var _a;
      for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        _a = [array[rand], array[i]], array[i] = _a[0], array[rand] = _a[1];
      }
    }
    function lerp(a, b, t) {
      return a + (b - a) * t;
    }
    function generateRNG(n) {
      return Math.floor(Math.random() * n);
    }
    function clearGrid(grid, v) {
      for (var i = 0; i < grid.length; ++i) {
        for (var j = 0; j < grid[i].length; ++j) {
          grid[i][j] = v;
        }
      }
    }
    function crawl() {
      var x = generateRNG(COLS);
      var y = generateRNG(ROWS);
      if (isCorrect) {
        currLevel++;
        if (currLevel == nextLevel) {
          difficulty = Math.min(difficulty + 1, maxDifficulty);
          currLevel = 0;
        }
      }
      while (crawlStack.length) {
        var c = crawlStack.pop();
        crawlGrid[c[1]][c[0]] = 0;
      }
      // console.log(crawlStack, crawlGrid);
      // clearGrid(crawlGrid, 0);
      crawlGrid[y][x] = 1;
      crawlStack.push([x, y]);
      var idx = 0;
      for (var i = 1; i < difficulty; ++i) {
        var flag = true;
        while (flag && idx >= 0) {
          shuffleArr(DIRECTIONS);
          for (var j = 0; j < DIRECTIONS.length; ++j) {
            var d = DIRECTIONS[j];
            var r = y + d[1];
            var c = x + d[0];
            // console.log(r, c);
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
              if (crawlGrid[r][c] == 0) {
                crawlGrid[r][c] = 1;
                crawlStack.push([c, r]);
                idx = crawlStack.length - 1;
                x = c;
                y = r;
                flag = false;
                break;
              }
            }
          }
          if (flag) {
            if (--idx >= 0) {
              x = crawlStack[idx];
              y = crawlStack[idx];
            }
          }
        }
      }
      // console.log(crawlStack);
      crawlT = crawlStack.length + 15;
      crawlT2 = 0;
      crawlT3 = 10;
      crawlCount = 0;
      crawlT4 = 0;
      isCorrect = false;
    }
    function animateCrawl(delta) {
      if (crawlT > 0) {
        var idx = Math.min(Math.floor(crawlT2), crawlStack.length - 1);
        var x = crawlStack[idx][0];
        var y = crawlStack[idx][1];
        danceFloorGrid[y][x] = 1;
        crawlT -= 10 * delta;
        crawlT2 += 10 * delta;
        if (crawlT < 0) {
          crawlT = 0;
          clearGrid(danceFloorGrid, 0);
        }
      } else if (crawlT3 > 0) {
        crawlT3 -= 10 * delta;
        if (crawlT3 < 0) {
          crawlT3 = 0;
          clearGrid(danceFloorGrid, 1);
        }
      } else if (crawlT4 > 0) {
        crawlT4 -= 5 * delta;
        if (crawlT4 < 0) {
          crawlT4 = 0;
          if (correctSVG) {
            correctSVG.classList.remove("show");
            correctSVG.classList.remove("hide");
            correctSVG.classList.add("hide");
          }
          if (incorrectSVG) {
            incorrectSVG.classList.remove("show");
            incorrectSVG.classList.remove("hide");
            incorrectSVG.classList.add("hide");
          }
          clearGrid(danceFloorGrid, 0);
          crawl();
        }
      }
    }
    function renderLoop(time) {
      if (!lastTime) {
        lastTime = time;
      }
      var elapsedTimeMs = time - lastTime;
      var elapsedTimeSec = elapsedTimeMs / 1000;
      lastTime = time;
      renderer.clear();
      renderer.save();
      if (timerT > 0) {
        timerT -= elapsedTimeSec;
        if (timerT < 0) {
          timerT = 0;
          setTimeout(function () {
            timerT = gameDuration;
            timerMachineUrgent.asBool().value = false;
          }, 1000);
        }
        var currT = Math.floor(timerT);
        if (!timerMachineUrgent.asBool().value && currT < 11) {
          timerMachineUrgent.asBool().value = true;
        }
        var percent = timerT / gameDuration * 100;
        timerMachineProgress.asNumber().value = percent;
        // console.log(timerMachineProgress.asNumber().value)
        var textRun = artboardTimer.textRun("TimeLeft");
        textRun.text = currT.toString();
      }
      timerMachine.advance(elapsedTimeSec);
      animateCrawl(elapsedTimeSec);
      for (var _i = 0, _a = Array.from(floors); _i < _a.length; _i++) {
        var blockInstance = _a[_i];
        var artboard = blockInstance.artboard,
          machine = blockInstance.machine,
          x = blockInstance.x,
          y = blockInstance.y,
          state = blockInstance.state,
          row = blockInstance.row,
          col = blockInstance.col;
        renderer.save();
        renderer.translate(x, y);
        renderer.align(rive.Fit.contain, rive.Alignment.center, {
          minX: 0,
          minY: 0,
          maxX: floorDim,
          maxY: floorDim
        }, artboard.bounds);
        // tapTrigger.fire();
        state.asNumber().value = danceFloorGrid[row][col];
        machine.advance(elapsedTimeSec);
        artboard.advance(elapsedTimeSec);
        artboard.draw(renderer);
        renderer.restore();
      }
      // timer
      renderer.save();
      renderer.translate(timerInfo.x, timerInfo.y);
      renderer.align(rive.Fit.contain, rive.Alignment.center, {
        minX: 0,
        minY: 0,
        maxX: timerInfo.w,
        maxY: timerInfo.h
      }, artboardTimer.bounds);
      artboardTimer.advance(elapsedTimeSec);
      artboardTimer.draw(renderer);
      renderer.restore();
      rive.requestAnimationFrame(renderLoop);
    }
    var rive, canvas, scaleX, scaleY, ROWS, COLS, renderer, floorDim, totalDanceFloorWidth, totalDanceFloorHeight, danceFloorPos, floorBytes, floorFile, artboardFloor, timerBytes, timerFile, artboardTimer, timerInfo, timerMachine, gameDuration, timerT, timerMachineProgress, timerMachineUrgent, i, l, input, lastTime, floor, floors, danceFloorGrid, crawlGrid, crawlStack, DIRECTIONS, difficulty, maxDifficulty, currLevel, nextLevel, crawlT, crawlT2, crawlT3, crawlT4, crawlCount, isCorrect, mDown;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, canvas_advanced_1.default)({
            // Loads Wasm bundle
            locateFile: function locateFile(_) {
              return "https://unpkg.com/@rive-app/canvas-advanced@2.7.6/rive.wasm";
            }
          })];
        case 1:
          rive = _a.sent();
          canvas = document.getElementById("rive-canvas");
          canvas.height = document.documentElement.clientHeight;
          canvas.width = document.documentElement.clientWidth;
          scaleX = canvas.width / 1792;
          scaleY = canvas.height / 922;
          ROWS = 4;
          COLS = 9;
          renderer = rive.makeRenderer(canvas);
          floorDim = 180 * scaleY;
          totalDanceFloorWidth = floorDim * COLS;
          totalDanceFloorHeight = floorDim * ROWS;
          danceFloorPos = {
            x: (canvas.width - totalDanceFloorWidth) / 2,
            y: (canvas.height - totalDanceFloorHeight) / 2 + 50 * scaleY
          };
          // await fetch(new Request("2023-10-23-tile_test-001.riv"))
          return [4 /*yield*/, fetch(new Request("DanceFloor.riv"))
          // await fetch(new Request("Button.riv"))
          ];

        case 2:
          return [4 /*yield*/,
          // await fetch(new Request("2023-10-23-tile_test-001.riv"))
          _a.sent()
          // await fetch(new Request("Button.riv"))
          .arrayBuffer()];
        case 3:
          floorBytes = _a.sent();
          return [4 /*yield*/, rive.load(new Uint8Array(floorBytes))];
        case 4:
          floorFile = _a.sent();
          artboardFloor = floorFile.defaultArtboard();
          return [4 /*yield*/, fetch(new Request("Timer.riv"))];
        case 5:
          return [4 /*yield*/, _a.sent().arrayBuffer()];
        case 6:
          timerBytes = _a.sent();
          return [4 /*yield*/, rive.load(new Uint8Array(timerBytes))];
        case 7:
          timerFile = _a.sent();
          artboardTimer = timerFile.defaultArtboard();
          timerInfo = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
          };
          timerInfo.w = 250 * scaleX;
          timerInfo.h = 100 * scaleX;
          timerInfo.x = canvas.width / 2 - timerInfo.w / 2;
          timerInfo.y = 10 * scaleY;
          timerMachine = new rive.StateMachineInstance(artboardTimer.stateMachineByName("State Machine"), artboardTimer);
          gameDuration = 60;
          timerT = gameDuration;
          for (i = 0, l = timerMachine.inputCount(); i < l; i++) {
            input = timerMachine.input(i);
            // console.log(input.name, input.type)
            // console.log(input, input.name, input.type, input.asNumber().value)
            if (input.name == "Timer") {
              timerMachineProgress = input;
            } else if (input.name == "Urgent") {
              timerMachineUrgent = input;
            }
          }
          lastTime = 0;
          floor = floorFile.defaultArtboard();
          floors = new Set();
          danceFloorGrid = [];
          crawlGrid = [];
          crawlStack = [];
          DIRECTIONS = [[0, -1], [1, 0], [0, 1], [-1, 0] // LEFT
          ];

          difficulty = 4;
          maxDifficulty = 12;
          currLevel = 0;
          nextLevel = 3;
          crawlT = 0;
          crawlT2 = 0;
          crawlT3 = 0;
          crawlT4 = 0;
          crawlCount = 0;
          isCorrect = false;
          generateDanceFloor();
          crawl();
          window.addEventListener('resize', function (e) {
            location.href = '';
          });
          mDown = false;
          canvas.addEventListener('mousedown', function (e) {
            var mx = e.offsetX;
            var my = e.offsetY;
            if (!mDown) {
              mDown = true;
              var row = Math.floor((my - danceFloorPos.y) / floorDim);
              var col = Math.floor((mx - danceFloorPos.x) / floorDim);
              if (crawlT3 == 0 && crawlT4 == 0) {
                if (row > -1 && col > -1 && row < ROWS && col < COLS) {
                  if (crawlGrid[row][col]) {
                    if (danceFloorGrid[row][col] < 2) {
                      danceFloorGrid[row][col] = 2;
                      crawlCount++;
                      if (crawlCount == difficulty) {
                        crawlT4 = 5;
                        isCorrect = true;
                        if (correctSVG) {
                          correctSVG.classList.remove("show");
                          correctSVG.classList.remove("hide");
                          correctSVG.classList.add("show");
                        }
                      }
                    }
                  } else {
                    crawlT4 = 5;
                    isCorrect = false;
                    if (incorrectSVG) {
                      incorrectSVG.classList.remove("show");
                      incorrectSVG.classList.remove("hide");
                      incorrectSVG.classList.add("show");
                    }
                  }
                }
              }
            }
          });
          canvas.addEventListener('mouseup', function (e) {
            if (mDown) {
              mDown = false;
            }
          });
          rive.requestAnimationFrame(renderLoop);
          return [2 /*return*/];
      }
    });
  });
}
// export default main;
main();
},{"@rive-app/canvas-advanced":"node_modules/@rive-app/canvas-advanced/canvas_advanced.mjs"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55224" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.ts"], null)
//# sourceMappingURL=/main.c39d6dcf.js.map