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
    var m = moduleArg,
      aa,
      ba;
    m.ready = new Promise((b, a) => {
      aa = b;
      ba = a;
    });
    function ca() {
      function b(h) {
        const g = d;
        c = a = 0;
        d = new Map();
        g.forEach(l => {
          try {
            l(h);
          } catch (k) {
            console.error(k);
          }
        });
        this.Qa();
        e && e.nb();
      }
      let a = 0,
        c = 0,
        d = new Map(),
        e = null,
        f = null;
      this.requestAnimationFrame = function (h) {
        a || (a = requestAnimationFrame(b.bind(this)));
        const g = ++c;
        d.set(g, h);
        return g;
      };
      this.cancelAnimationFrame = function (h) {
        d.delete(h);
        a && 0 == d.size && (cancelAnimationFrame(a), a = 0);
      };
      this.lb = function (h) {
        f && (document.body.remove(f), f = null);
        h || (f = document.createElement("div"), f.style.backgroundColor = "black", f.style.position = "fixed", f.style.right = 0, f.style.top = 0, f.style.color = "white", f.style.padding = "4px", f.innerHTML = "RIVE FPS", h = function (g) {
          f.innerHTML = "RIVE FPS " + g.toFixed(1);
        }, document.body.appendChild(f));
        e = new function () {
          let g = 0,
            l = 0;
          this.nb = function () {
            var k = performance.now();
            l ? (++g, k -= l, 1E3 < k && (h(1E3 * g / k), g = l = 0)) : (l = k, g = 0);
          };
        }();
      };
      this.ib = function () {
        f && (document.body.remove(f), f = null);
        e = null;
      };
      this.Qa = function () {};
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
    const fa = "createConicGradient createImageData createLinearGradient createPattern createRadialGradient getContextAttributes getImageData getLineDash getTransform isContextLost isPointInPath isPointInStroke measureText".split(" "),
      ha = new function () {
        function b() {
          if (!a) {
            var t = document.createElement("canvas"),
              v = {
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
            let q = t.getContext("webgl2", v);
            if (q) c = 2;else if (q = t.getContext("webgl", v)) c = 1;else return console.log("No WebGL support. Image mesh will not be drawn."), !1;
            d = Math.min(q.getParameter(q.MAX_RENDERBUFFER_SIZE), q.getParameter(q.MAX_TEXTURE_SIZE));
            function G(I, w, z) {
              w = q.createShader(w);
              q.shaderSource(w, z);
              q.compileShader(w);
              z = q.getShaderInfoLog(w);
              if (0 < z.length) throw z;
              q.attachShader(I, w);
            }
            t = q.createProgram();
            G(t, q.VERTEX_SHADER, "attribute vec2 vertex;\n                attribute vec2 uv;\n                uniform vec4 mat;\n                uniform vec2 translate;\n                varying vec2 st;\n                void main() {\n                    st = uv;\n                    gl_Position = vec4(mat2(mat) * vertex + translate, 0, 1);\n                }");
            G(t, q.FRAGMENT_SHADER, "precision highp float;\n                uniform sampler2D image;\n                varying vec2 st;\n                void main() {\n                    gl_FragColor = texture2D(image, st);\n                }");
            q.bindAttribLocation(t, 0, "vertex");
            q.bindAttribLocation(t, 1, "uv");
            q.linkProgram(t);
            v = q.getProgramInfoLog(t);
            if (0 < v.trim().length) throw v;
            e = q.getUniformLocation(t, "mat");
            f = q.getUniformLocation(t, "translate");
            q.useProgram(t);
            q.bindBuffer(q.ARRAY_BUFFER, q.createBuffer());
            q.enableVertexAttribArray(0);
            q.enableVertexAttribArray(1);
            q.bindBuffer(q.ELEMENT_ARRAY_BUFFER, q.createBuffer());
            q.uniform1i(q.getUniformLocation(t, "image"), 0);
            q.pixelStorei(q.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
            a = q;
          }
          return !0;
        }
        let a = null,
          c = 0,
          d = 0,
          e = null,
          f = null,
          h = 0,
          g = 0;
        this.wb = function () {
          b();
          return d;
        };
        this.gb = function (t) {
          if (!b()) return null;
          const v = a.createTexture();
          a.bindTexture(a.TEXTURE_2D, v);
          a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, a.RGBA, a.UNSIGNED_BYTE, t);
          a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE);
          a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE);
          a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR);
          2 == c ? (a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR_MIPMAP_LINEAR), a.generateMipmap(a.TEXTURE_2D)) : a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR);
          return v;
        };
        const l = new ea(8),
          k = new ea(8),
          p = new ea(10),
          r = new ea(10);
        this.kb = function (t, v, q, G, I) {
          if (b()) {
            var w = l.push(t),
              z = k.push(v);
            if (a.canvas.width != w || a.canvas.height != z) a.canvas.width = w, a.canvas.height = z;
            a.viewport(0, z - v, t, v);
            a.disable(a.SCISSOR_TEST);
            a.clearColor(0, 0, 0, 0);
            a.clear(a.COLOR_BUFFER_BIT);
            a.enable(a.SCISSOR_TEST);
            q.sort((B, da) => da.Ua - B.Ua);
            w = p.push(G);
            h != w && (a.bufferData(a.ARRAY_BUFFER, 8 * w, a.DYNAMIC_DRAW), h = w);
            w = 0;
            for (var J of q) a.bufferSubData(a.ARRAY_BUFFER, w, J.Da), w += 4 * J.Da.length;
            console.assert(w == 4 * G);
            for (var P of q) a.bufferSubData(a.ARRAY_BUFFER, w, P.Xa), w += 4 * P.Xa.length;
            console.assert(w == 8 * G);
            w = r.push(I);
            g != w && (a.bufferData(a.ELEMENT_ARRAY_BUFFER, 2 * w, a.DYNAMIC_DRAW), g = w);
            J = 0;
            for (var W of q) a.bufferSubData(a.ELEMENT_ARRAY_BUFFER, J, W.indices), J += 2 * W.indices.length;
            console.assert(J == 2 * I);
            W = 0;
            P = !0;
            w = J = 0;
            for (const B of q) {
              B.image.za != W && (a.bindTexture(a.TEXTURE_2D, B.image.cb || null), W = B.image.za);
              B.zb ? (a.scissor(B.Ia, z - B.Ja - B.Pa, B.Gb, B.Pa), P = !0) : P && (a.scissor(0, z - v, t, v), P = !1);
              q = 2 / t;
              const da = -2 / v;
              a.uniform4f(e, B.oa[0] * q * B.va, B.oa[1] * da * B.wa, B.oa[2] * q * B.va, B.oa[3] * da * B.wa);
              a.uniform2f(f, B.oa[4] * q * B.va + q * (B.Ia - B.xb * B.va) - 1, B.oa[5] * da * B.wa + da * (B.Ja - B.yb * B.wa) + 1);
              a.vertexAttribPointer(0, 2, a.FLOAT, !1, 0, w);
              a.vertexAttribPointer(1, 2, a.FLOAT, !1, 0, w + 4 * G);
              a.drawElements(a.TRIANGLES, B.indices.length, a.UNSIGNED_SHORT, J);
              w += 4 * B.Da.length;
              J += 2 * B.indices.length;
            }
            console.assert(w == 4 * G);
            console.assert(J == 2 * I);
          }
        };
        this.canvas = function () {
          return b() && a.canvas;
        };
      }();
    m.onRuntimeInitialized = function () {
      function b(n) {
        switch (n) {
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
      function a(n) {
        return "rgba(" + ((16711680 & n) >>> 16) + "," + ((65280 & n) >>> 8) + "," + ((255 & n) >>> 0) + "," + ((4278190080 & n) >>> 24) / 255 + ")";
      }
      function c() {
        0 < J.length && (ha.kb(z.drawWidth(), z.drawHeight(), J, P, W), J = [], W = P = 0, z.reset(512, 512));
        for (const n of w) {
          for (const u of n.da) u();
          n.da = [];
        }
        w.clear();
      }
      var d = m.RenderPaintStyle;
      const e = m.RenderPath,
        f = m.RenderPaint,
        h = m.Renderer,
        g = m.StrokeCap,
        l = m.StrokeJoin,
        k = m.BlendMode,
        p = d.fill,
        r = d.stroke,
        t = m.FillRule.evenOdd;
      let v = 1;
      var q = m.RenderImage.extend("CanvasRenderImage", {
          __construct: function () {
            this.__parent.__construct.call(this);
            this.za = v;
            v = v + 1 & 2147483647 || 1;
          },
          decode: function (n) {
            let u = Xa;
            u.total++;
            var C = this,
              A = new Image();
            A.src = URL.createObjectURL(new Blob([n], {
              type: "image/png"
            }));
            A.onload = function () {
              C.ab = A;
              C.cb = ha.gb(A);
              C.size(A.width, A.height);
              u.loaded++;
              if (u.loaded === u.total) {
                const y = u.ready;
                y && (y(), u.ready = null);
              }
            };
          }
        }),
        G = e.extend("CanvasRenderPath", {
          __construct: function () {
            this.__parent.__construct.call(this);
            this.ia = new Path2D();
          },
          rewind: function () {
            this.ia = new Path2D();
          },
          addPath: function (n, u, C, A, y, F, D) {
            var E = this.ia,
              R = E.addPath;
            n = n.ia;
            const K = new DOMMatrix();
            K.a = u;
            K.b = C;
            K.c = A;
            K.d = y;
            K.e = F;
            K.f = D;
            R.call(E, n, K);
          },
          fillRule: function (n) {
            this.Ga = n;
          },
          moveTo: function (n, u) {
            this.ia.moveTo(n, u);
          },
          lineTo: function (n, u) {
            this.ia.lineTo(n, u);
          },
          cubicTo: function (n, u, C, A, y, F) {
            this.ia.bezierCurveTo(n, u, C, A, y, F);
          },
          close: function () {
            this.ia.closePath();
          }
        }),
        I = f.extend("CanvasRenderPaint", {
          color: function (n) {
            this.Ha = a(n);
          },
          thickness: function (n) {
            this.eb = n;
          },
          join: function (n) {
            switch (n) {
              case l.miter:
                this.ya = "miter";
                break;
              case l.round:
                this.ya = "round";
                break;
              case l.bevel:
                this.ya = "bevel";
            }
          },
          cap: function (n) {
            switch (n) {
              case g.butt:
                this.xa = "butt";
                break;
              case g.round:
                this.xa = "round";
                break;
              case g.square:
                this.xa = "square";
            }
          },
          style: function (n) {
            this.bb = n;
          },
          blendMode: function (n) {
            this.$a = b(n);
          },
          clearGradient: function () {
            this.qa = null;
          },
          linearGradient: function (n, u, C, A) {
            this.qa = {
              Va: n,
              Wa: u,
              La: C,
              Ma: A,
              Ca: []
            };
          },
          radialGradient: function (n, u, C, A) {
            this.qa = {
              Va: n,
              Wa: u,
              La: C,
              Ma: A,
              Ca: [],
              ub: !0
            };
          },
          addStop: function (n, u) {
            this.qa.Ca.push({
              color: n,
              stop: u
            });
          },
          completeGradient: function () {},
          draw: function (n, u, C) {
            let A = this.bb;
            var y = this.Ha,
              F = this.qa;
            n.globalCompositeOperation = this.$a;
            if (null != F) {
              y = F.Va;
              var D = F.Wa;
              const R = F.La;
              var E = F.Ma;
              const K = F.Ca;
              F.ub ? (F = R - y, E -= D, y = n.createRadialGradient(y, D, 0, y, D, Math.sqrt(F * F + E * E))) : y = n.createLinearGradient(y, D, R, E);
              for (let T = 0, M = K.length; T < M; T++) D = K[T], y.addColorStop(D.stop, a(D.color));
              this.Ha = y;
              this.qa = null;
            }
            switch (A) {
              case r:
                n.strokeStyle = y;
                n.lineWidth = this.eb;
                n.lineCap = this.xa;
                n.lineJoin = this.ya;
                n.stroke(u);
                break;
              case p:
                n.fillStyle = y, n.fill(u, C);
            }
          }
        });
      const w = new Set();
      let z = null,
        J = [],
        P = 0,
        W = 0;
      var B = m.CanvasRenderer = h.extend("Renderer", {
        __construct: function (n) {
          this.__parent.__construct.call(this);
          this.ha = [1, 0, 0, 1, 0, 0];
          this.ba = n.getContext("2d");
          this.Fa = n;
          this.da = [];
        },
        save: function () {
          this.ha.push(...this.ha.slice(this.ha.length - 6));
          this.da.push(this.ba.save.bind(this.ba));
        },
        restore: function () {
          const n = this.ha.length - 6;
          if (6 > n) throw "restore() called without matching save().";
          this.ha.splice(n);
          this.da.push(this.ba.restore.bind(this.ba));
        },
        transform: function (n, u, C, A, y, F) {
          const D = this.ha,
            E = D.length - 6;
          D.splice(E, 6, D[E] * n + D[E + 2] * u, D[E + 1] * n + D[E + 3] * u, D[E] * C + D[E + 2] * A, D[E + 1] * C + D[E + 3] * A, D[E] * y + D[E + 2] * F + D[E + 4], D[E + 1] * y + D[E + 3] * F + D[E + 5]);
          this.da.push(this.ba.transform.bind(this.ba, n, u, C, A, y, F));
        },
        rotate: function (n) {
          const u = Math.sin(n);
          n = Math.cos(n);
          this.transform(n, u, -u, n, 0, 0);
        },
        _drawPath: function (n, u) {
          this.da.push(u.draw.bind(u, this.ba, n.ia, n.Ga === t ? "evenodd" : "nonzero"));
        },
        _drawRiveImage: function (n, u, C) {
          var A = n.ab;
          if (A) {
            var y = this.ba,
              F = b(u);
            this.da.push(function () {
              y.globalCompositeOperation = F;
              y.globalAlpha = C;
              y.drawImage(A, 0, 0);
              y.globalAlpha = 1;
            });
          }
        },
        _getMatrix: function (n) {
          const u = this.ha,
            C = u.length - 6;
          for (let A = 0; 6 > A; ++A) n[A] = u[C + A];
        },
        _drawImageMesh: function (n, u, C, A, y, F, D, E, R, K) {
          var T = this.ba.canvas.width,
            M = this.ba.canvas.height;
          const pb = R - D,
            qb = K - E;
          D = Math.max(D, 0);
          E = Math.max(E, 0);
          R = Math.min(R, T);
          K = Math.min(K, M);
          const ua = R - D,
            va = K - E;
          console.assert(ua <= Math.min(pb, T));
          console.assert(va <= Math.min(qb, M));
          if (!(0 >= ua || 0 >= va)) {
            R = ua < pb || va < qb;
            T = K = 1;
            var ia = Math.ceil(ua * K),
              ja = Math.ceil(va * T);
            M = ha.wb();
            ia > M && (K *= M / ia, ia = M);
            ja > M && (T *= M / ja, ja = M);
            z || (z = new m.DynamicRectanizer(M), z.reset(512, 512));
            M = z.addRect(ia, ja);
            0 > M && (c(), w.add(this), M = z.addRect(ia, ja), console.assert(0 <= M));
            var rb = M & 65535,
              sb = M >> 16;
            J.push({
              oa: this.ha.slice(this.ha.length - 6),
              image: n,
              Ia: rb,
              Ja: sb,
              xb: D,
              yb: E,
              Gb: ia,
              Pa: ja,
              va: K,
              wa: T,
              Da: new Float32Array(A),
              Xa: new Float32Array(y),
              indices: new Uint16Array(F),
              zb: R,
              Ua: n.za << 1 | (R ? 1 : 0)
            });
            P += A.length;
            W += F.length;
            var na = this.ba,
              dc = b(u);
            this.da.push(function () {
              na.save();
              na.resetTransform();
              na.globalCompositeOperation = dc;
              na.globalAlpha = C;
              na.drawImage(ha.canvas(), rb, sb, ia, ja, D, E, ua, va);
              na.restore();
            });
          }
        },
        _clipPath: function (n) {
          this.da.push(this.ba.clip.bind(this.ba, n.ia, n.Ga === t ? "evenodd" : "nonzero"));
        },
        clear: function () {
          w.add(this);
          this.da.push(this.ba.clearRect.bind(this.ba, 0, 0, this.Fa.width, this.Fa.height));
        },
        flush: function () {},
        translate: function (n, u) {
          this.transform(1, 0, 0, 1, n, u);
        }
      });
      m.makeRenderer = function (n) {
        const u = new B(n),
          C = u.ba;
        return new Proxy(u, {
          get(A, y) {
            if ("function" === typeof A[y]) return function (...F) {
              return A[y].apply(A, F);
            };
            if ("function" === typeof C[y]) {
              if (-1 < fa.indexOf(y)) throw Error("RiveException: Method call to '" + y + "()' is not allowed, as the renderer cannot immediately pass through the return                 values of any canvas 2d context methods.");
              return function (...F) {
                u.da.push(C[y].bind(C, ...F));
              };
            }
            return A[y];
          },
          set(A, y, F) {
            if (y in C) return C[y] = F, !0;
          }
        });
      };
      m.renderFactory = {
        makeRenderPaint: function () {
          return new I();
        },
        makeRenderPath: function () {
          return new G();
        },
        makeRenderImage: function () {
          return new q();
        }
      };
      let da = m.load,
        Xa = null;
      m.load = function (n) {
        return new Promise(function (u) {
          let C = null;
          Xa = {
            total: 0,
            loaded: 0,
            ready: function () {
              u(C);
            }
          };
          C = da(n);
          0 == Xa.total && u(C);
        });
      };
      d = new ca();
      m.requestAnimationFrame = d.requestAnimationFrame.bind(d);
      m.cancelAnimationFrame = d.cancelAnimationFrame.bind(d);
      m.enableFPSCounter = d.lb.bind(d);
      m.disableFPSCounter = d.ib;
      d.Qa = c;
      m.cleanup = function () {
        z && z.delete();
      };
    };
    var ka = Object.assign({}, m),
      la = "./this.program",
      ma = "object" == typeof window,
      oa = "function" == typeof importScripts,
      x = "",
      pa,
      qa;
    if (ma || oa) oa ? x = self.location.href : "undefined" != typeof document && document.currentScript && (x = document.currentScript.src), _scriptDir && (x = _scriptDir), 0 !== x.indexOf("blob:") ? x = x.substr(0, x.replace(/[?#].*/, "").lastIndexOf("/") + 1) : x = "", oa && (qa = b => {
      var a = new XMLHttpRequest();
      a.open("GET", b, !1);
      a.responseType = "arraybuffer";
      a.send(null);
      return new Uint8Array(a.response);
    }), pa = (b, a, c) => {
      var d = new XMLHttpRequest();
      d.open("GET", b, !0);
      d.responseType = "arraybuffer";
      d.onload = () => {
        200 == d.status || 0 == d.status && d.response ? a(d.response) : c();
      };
      d.onerror = c;
      d.send(null);
    };
    var ra = m.print || console.log.bind(console),
      sa = m.printErr || console.error.bind(console);
    Object.assign(m, ka);
    ka = null;
    m.thisProgram && (la = m.thisProgram);
    var ta;
    m.wasmBinary && (ta = m.wasmBinary);
    var noExitRuntime = m.noExitRuntime || !0;
    "object" != typeof WebAssembly && wa("no native wasm support detected");
    var xa,
      H,
      ya = !1,
      za,
      L,
      Aa,
      Ba,
      Ca,
      N,
      Da,
      Ea;
    function Fa() {
      var b = xa.buffer;
      m.HEAP8 = za = new Int8Array(b);
      m.HEAP16 = Aa = new Int16Array(b);
      m.HEAP32 = Ca = new Int32Array(b);
      m.HEAPU8 = L = new Uint8Array(b);
      m.HEAPU16 = Ba = new Uint16Array(b);
      m.HEAPU32 = N = new Uint32Array(b);
      m.HEAPF32 = Da = new Float32Array(b);
      m.HEAPF64 = Ea = new Float64Array(b);
    }
    var Ga,
      Ha = [],
      Ia = [],
      Ja = [];
    function Ka() {
      var b = m.preRun.shift();
      Ha.unshift(b);
    }
    var La = 0,
      Ma = null,
      Na = null;
    function wa(b) {
      if (m.onAbort) m.onAbort(b);
      b = "Aborted(" + b + ")";
      sa(b);
      ya = !0;
      b = new WebAssembly.RuntimeError(b + ". Build with -sASSERTIONS for more info.");
      ba(b);
      throw b;
    }
    function Oa(b) {
      return b.startsWith("data:application/octet-stream;base64,");
    }
    var Pa;
    Pa = "canvas_advanced.wasm";
    if (!Oa(Pa)) {
      var Qa = Pa;
      Pa = m.locateFile ? m.locateFile(Qa, x) : x + Qa;
    }
    function Ra(b) {
      if (b == Pa && ta) return new Uint8Array(ta);
      if (qa) return qa(b);
      throw "both async and sync fetching of the wasm failed";
    }
    function Sa(b) {
      if (!ta && (ma || oa)) {
        if ("function" == typeof fetch && !b.startsWith("file://")) return fetch(b, {
          credentials: "same-origin"
        }).then(a => {
          if (!a.ok) throw "failed to load wasm binary file at '" + b + "'";
          return a.arrayBuffer();
        }).catch(() => Ra(b));
        if (pa) return new Promise((a, c) => {
          pa(b, d => a(new Uint8Array(d)), c);
        });
      }
      return Promise.resolve().then(() => Ra(b));
    }
    function Ta(b, a, c) {
      return Sa(b).then(d => WebAssembly.instantiate(d, a)).then(d => d).then(c, d => {
        sa("failed to asynchronously prepare wasm: " + d);
        wa(d);
      });
    }
    function Ua(b, a) {
      var c = Pa;
      return ta || "function" != typeof WebAssembly.instantiateStreaming || Oa(c) || c.startsWith("file://") || "function" != typeof fetch ? Ta(c, b, a) : fetch(c, {
        credentials: "same-origin"
      }).then(d => WebAssembly.instantiateStreaming(d, b).then(a, function (e) {
        sa("wasm streaming compile failed: " + e);
        sa("falling back to ArrayBuffer instantiation");
        return Ta(c, b, a);
      }));
    }
    var Va = b => {
      for (; 0 < b.length;) b.shift()(m);
    };
    function Wa(b) {
      if (void 0 === b) return "_unknown";
      b = b.replace(/[^a-zA-Z0-9_]/g, "$");
      var a = b.charCodeAt(0);
      return 48 <= a && 57 >= a ? `_${b}` : b;
    }
    function Ya(b, a) {
      b = Wa(b);
      return {
        [b]: function () {
          return a.apply(this, arguments);
        }
      }[b];
    }
    function Za() {
      this.ja = [void 0];
      this.Oa = [];
    }
    var O = new Za(),
      $a = void 0;
    function Q(b) {
      throw new $a(b);
    }
    var ab = b => {
        b || Q("Cannot use deleted val. handle = " + b);
        return O.get(b).value;
      },
      S = b => {
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
            return O.Ya({
              Ta: 1,
              value: b
            });
        }
      };
    function bb(b) {
      var a = Error,
        c = Ya(b, function (d) {
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
    var cb = void 0,
      db = void 0;
    function U(b) {
      for (var a = ""; L[b];) a += db[L[b++]];
      return a;
    }
    var eb = [];
    function fb() {
      for (; eb.length;) {
        var b = eb.pop();
        b.W.na = !1;
        b["delete"]();
      }
    }
    var gb = void 0,
      V = {};
    function hb(b, a) {
      for (void 0 === a && Q("ptr should not be undefined"); b.$;) a = b.ra(a), b = b.$;
      return a;
    }
    var ib = {};
    function jb(b) {
      b = kb(b);
      var a = U(b);
      lb(b);
      return a;
    }
    function mb(b, a) {
      var c = ib[b];
      void 0 === c && Q(a + " has unknown type " + jb(b));
      return c;
    }
    function nb() {}
    var ob = !1;
    function tb(b) {
      --b.count.value;
      0 === b.count.value && (b.ca ? b.fa.ka(b.ca) : b.Z.X.ka(b.Y));
    }
    function ub(b, a, c) {
      if (a === c) return b;
      if (void 0 === c.$) return null;
      b = ub(b, a, c.$);
      return null === b ? null : c.jb(b);
    }
    var vb = {};
    function wb(b, a) {
      a = hb(b, a);
      return V[a];
    }
    var xb = void 0;
    function yb(b) {
      throw new xb(b);
    }
    function zb(b, a) {
      a.Z && a.Y || yb("makeClassHandle requires ptr and ptrType");
      !!a.fa !== !!a.ca && yb("Both smartPtrType and smartPtr must be specified");
      a.count = {
        value: 1
      };
      return Ab(Object.create(b, {
        W: {
          value: a
        }
      }));
    }
    function Ab(b) {
      if ("undefined" === typeof FinalizationRegistry) return Ab = a => a, b;
      ob = new FinalizationRegistry(a => {
        tb(a.W);
      });
      Ab = a => {
        var c = a.W;
        c.ca && ob.register(a, {
          W: c
        }, a);
        return a;
      };
      nb = a => {
        ob.unregister(a);
      };
      return Ab(b);
    }
    var Bb = {};
    function Cb(b) {
      for (; b.length;) {
        var a = b.pop();
        b.pop()(a);
      }
    }
    function Db(b) {
      return this.fromWireType(Ca[b >> 2]);
    }
    var Eb = {},
      Fb = {};
    function X(b, a, c) {
      function d(g) {
        g = c(g);
        g.length !== b.length && yb("Mismatched type converter count");
        for (var l = 0; l < b.length; ++l) Y(b[l], g[l]);
      }
      b.forEach(function (g) {
        Fb[g] = a;
      });
      var e = Array(a.length),
        f = [],
        h = 0;
      a.forEach((g, l) => {
        ib.hasOwnProperty(g) ? e[l] = ib[g] : (f.push(g), Eb.hasOwnProperty(g) || (Eb[g] = []), Eb[g].push(() => {
          e[l] = ib[g];
          ++h;
          h === f.length && d(e);
        }));
      });
      0 === f.length && d(e);
    }
    function Gb(b) {
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
    function Hb(b, a, c = {}) {
      var d = a.name;
      b || Q(`type "${d}" must have a positive integer typeid pointer`);
      if (ib.hasOwnProperty(b)) {
        if (c.tb) return;
        Q(`Cannot register type '${d}' twice`);
      }
      ib[b] = a;
      delete Fb[b];
      Eb.hasOwnProperty(b) && (a = Eb[b], delete Eb[b], a.forEach(e => e()));
    }
    function Y(b, a, c = {}) {
      if (!("argPackAdvance" in a)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
      Hb(b, a, c);
    }
    function Ib(b) {
      Q(b.W.Z.X.name + " instance already deleted");
    }
    function Jb() {}
    function Kb(b, a, c) {
      if (void 0 === b[a].aa) {
        var d = b[a];
        b[a] = function () {
          b[a].aa.hasOwnProperty(arguments.length) || Q(`Function '${c}' called with an invalid number of arguments (${arguments.length}) - expects one of (${b[a].aa})!`);
          return b[a].aa[arguments.length].apply(this, arguments);
        };
        b[a].aa = [];
        b[a].aa[d.ma] = d;
      }
    }
    function Lb(b, a, c) {
      m.hasOwnProperty(b) ? ((void 0 === c || void 0 !== m[b].aa && void 0 !== m[b].aa[c]) && Q(`Cannot register public name '${b}' twice`), Kb(m, b, b), m.hasOwnProperty(c) && Q(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`), m[b].aa[c] = a) : (m[b] = a, void 0 !== c && (m[b].Hb = c));
    }
    function Mb(b, a, c, d, e, f, h, g) {
      this.name = b;
      this.constructor = a;
      this.ga = c;
      this.ka = d;
      this.$ = e;
      this.ob = f;
      this.ra = h;
      this.jb = g;
      this.Ra = [];
    }
    function Nb(b, a, c) {
      for (; a !== c;) a.ra || Q(`Expected null or instance of ${c.name}, got an instance of ${a.name}`), b = a.ra(b), a = a.$;
      return b;
    }
    function Ob(b, a) {
      if (null === a) return this.Aa && Q(`null is not a valid ${this.name}`), 0;
      a.W || Q(`Cannot pass "${Pb(a)}" as a ${this.name}`);
      a.W.Y || Q(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return Nb(a.W.Y, a.W.Z.X, this.X);
    }
    function Qb(b, a) {
      if (null === a) {
        this.Aa && Q(`null is not a valid ${this.name}`);
        if (this.ua) {
          var c = this.Ba();
          null !== b && b.push(this.ka, c);
          return c;
        }
        return 0;
      }
      a.W || Q(`Cannot pass "${Pb(a)}" as a ${this.name}`);
      a.W.Y || Q(`Cannot pass deleted object as a pointer of type ${this.name}`);
      !this.ta && a.W.Z.ta && Q(`Cannot convert argument of type ${a.W.fa ? a.W.fa.name : a.W.Z.name} to parameter type ${this.name}`);
      c = Nb(a.W.Y, a.W.Z.X, this.X);
      if (this.ua) switch (void 0 === a.W.ca && Q("Passing raw pointer to smart pointer is illegal"), this.Fb) {
        case 0:
          a.W.fa === this ? c = a.W.ca : Q(`Cannot convert argument of type ${a.W.fa ? a.W.fa.name : a.W.Z.name} to parameter type ${this.name}`);
          break;
        case 1:
          c = a.W.ca;
          break;
        case 2:
          if (a.W.fa === this) c = a.W.ca;else {
            var d = a.clone();
            c = this.Bb(c, S(function () {
              d["delete"]();
            }));
            null !== b && b.push(this.ka, c);
          }
          break;
        default:
          Q("Unsupporting sharing policy");
      }
      return c;
    }
    function Rb(b, a) {
      if (null === a) return this.Aa && Q(`null is not a valid ${this.name}`), 0;
      a.W || Q(`Cannot pass "${Pb(a)}" as a ${this.name}`);
      a.W.Y || Q(`Cannot pass deleted object as a pointer of type ${this.name}`);
      a.W.Z.ta && Q(`Cannot convert argument of type ${a.W.Z.name} to parameter type ${this.name}`);
      return Nb(a.W.Y, a.W.Z.X, this.X);
    }
    function Sb(b, a, c, d) {
      this.name = b;
      this.X = a;
      this.Aa = c;
      this.ta = d;
      this.ua = !1;
      this.ka = this.Bb = this.Ba = this.Sa = this.Fb = this.Ab = void 0;
      void 0 !== a.$ ? this.toWireType = Qb : (this.toWireType = d ? Ob : Rb, this.ea = null);
    }
    function Tb(b, a, c) {
      m.hasOwnProperty(b) || yb("Replacing nonexistant public symbol");
      void 0 !== m[b].aa && void 0 !== c ? m[b].aa[c] = a : (m[b] = a, m[b].ma = c);
    }
    var Ub = (b, a) => {
      var c = [];
      return function () {
        c.length = 0;
        Object.assign(c, arguments);
        if (b.includes("j")) {
          var d = m["dynCall_" + b];
          d = c && c.length ? d.apply(null, [a].concat(c)) : d.call(null, a);
        } else d = Ga.get(a).apply(null, c);
        return d;
      };
    };
    function Z(b, a) {
      b = U(b);
      var c = b.includes("j") ? Ub(b, a) : Ga.get(a);
      "function" != typeof c && Q(`unknown function pointer with signature ${b}: ${a}`);
      return c;
    }
    var Vb = void 0;
    function Wb(b, a) {
      function c(f) {
        e[f] || ib[f] || (Fb[f] ? Fb[f].forEach(c) : (d.push(f), e[f] = !0));
      }
      var d = [],
        e = {};
      a.forEach(c);
      throw new Vb(`${b}: ` + d.map(jb).join([", "]));
    }
    function Xb(b, a, c, d, e) {
      var f = a.length;
      2 > f && Q("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var h = null !== a[1] && null !== c,
        g = !1;
      for (c = 1; c < a.length; ++c) if (null !== a[c] && void 0 === a[c].ea) {
        g = !0;
        break;
      }
      var l = "void" !== a[0].name,
        k = f - 2,
        p = Array(k),
        r = [],
        t = [];
      return function () {
        arguments.length !== k && Q(`function ${b} called with ${arguments.length} arguments, expected ${k} args!`);
        t.length = 0;
        r.length = h ? 2 : 1;
        r[0] = e;
        if (h) {
          var v = a[1].toWireType(t, this);
          r[1] = v;
        }
        for (var q = 0; q < k; ++q) p[q] = a[q + 2].toWireType(t, arguments[q]), r.push(p[q]);
        q = d.apply(null, r);
        if (g) Cb(t);else for (var G = h ? 1 : 2; G < a.length; G++) {
          var I = 1 === G ? v : p[G - 2];
          null !== a[G].ea && a[G].ea(I);
        }
        v = l ? a[0].fromWireType(q) : void 0;
        return v;
      };
    }
    function Yb(b, a) {
      for (var c = [], d = 0; d < b; d++) c.push(N[a + 4 * d >> 2]);
      return c;
    }
    function Zb(b, a, c) {
      b instanceof Object || Q(`${c} with invalid "this": ${b}`);
      b instanceof a.X.constructor || Q(`${c} incompatible with "this" of type ${b.constructor.name}`);
      b.W.Y || Q(`cannot call emscripten binding method ${c} on deleted object`);
      return Nb(b.W.Y, b.W.Z.X, a.X);
    }
    function $b(b) {
      b >= O.Ea && 0 === --O.get(b).Ta && O.Za(b);
    }
    function ac(b, a, c) {
      switch (a) {
        case 0:
          return function (d) {
            return this.fromWireType((c ? za : L)[d]);
          };
        case 1:
          return function (d) {
            return this.fromWireType((c ? Aa : Ba)[d >> 1]);
          };
        case 2:
          return function (d) {
            return this.fromWireType((c ? Ca : N)[d >> 2]);
          };
        default:
          throw new TypeError("Unknown integer type: " + b);
      }
    }
    function Pb(b) {
      if (null === b) return "null";
      var a = typeof b;
      return "object" === a || "array" === a || "function" === a ? b.toString() : "" + b;
    }
    function bc(b, a) {
      switch (a) {
        case 2:
          return function (c) {
            return this.fromWireType(Da[c >> 2]);
          };
        case 3:
          return function (c) {
            return this.fromWireType(Ea[c >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + b);
      }
    }
    function cc(b, a, c) {
      switch (a) {
        case 0:
          return c ? function (d) {
            return za[d];
          } : function (d) {
            return L[d];
          };
        case 1:
          return c ? function (d) {
            return Aa[d >> 1];
          } : function (d) {
            return Ba[d >> 1];
          };
        case 2:
          return c ? function (d) {
            return Ca[d >> 2];
          } : function (d) {
            return N[d >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + b);
      }
    }
    var ec = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0,
      fc = (b, a, c) => {
        var d = a + c;
        for (c = a; b[c] && !(c >= d);) ++c;
        if (16 < c - a && b.buffer && ec) return ec.decode(b.subarray(a, c));
        for (d = ""; a < c;) {
          var e = b[a++];
          if (e & 128) {
            var f = b[a++] & 63;
            if (192 == (e & 224)) d += String.fromCharCode((e & 31) << 6 | f);else {
              var h = b[a++] & 63;
              e = 224 == (e & 240) ? (e & 15) << 12 | f << 6 | h : (e & 7) << 18 | f << 12 | h << 6 | b[a++] & 63;
              65536 > e ? d += String.fromCharCode(e) : (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023));
            }
          } else d += String.fromCharCode(e);
        }
        return d;
      },
      gc = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0,
      hc = (b, a) => {
        var c = b >> 1;
        for (var d = c + a / 2; !(c >= d) && Ba[c];) ++c;
        c <<= 1;
        if (32 < c - b && gc) return gc.decode(L.subarray(b, c));
        c = "";
        for (d = 0; !(d >= a / 2); ++d) {
          var e = Aa[b + 2 * d >> 1];
          if (0 == e) break;
          c += String.fromCharCode(e);
        }
        return c;
      },
      ic = (b, a, c) => {
        void 0 === c && (c = 2147483647);
        if (2 > c) return 0;
        c -= 2;
        var d = a;
        c = c < 2 * b.length ? c / 2 : b.length;
        for (var e = 0; e < c; ++e) Aa[a >> 1] = b.charCodeAt(e), a += 2;
        Aa[a >> 1] = 0;
        return a - d;
      },
      jc = b => 2 * b.length,
      kc = (b, a) => {
        for (var c = 0, d = ""; !(c >= a / 4);) {
          var e = Ca[b + 4 * c >> 2];
          if (0 == e) break;
          ++c;
          65536 <= e ? (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023)) : d += String.fromCharCode(e);
        }
        return d;
      },
      lc = (b, a, c) => {
        void 0 === c && (c = 2147483647);
        if (4 > c) return 0;
        var d = a;
        c = d + c - 4;
        for (var e = 0; e < b.length; ++e) {
          var f = b.charCodeAt(e);
          if (55296 <= f && 57343 >= f) {
            var h = b.charCodeAt(++e);
            f = 65536 + ((f & 1023) << 10) | h & 1023;
          }
          Ca[a >> 2] = f;
          a += 4;
          if (a + 4 > c) break;
        }
        Ca[a >> 2] = 0;
        return a - d;
      },
      mc = b => {
        for (var a = 0, c = 0; c < b.length; ++c) {
          var d = b.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          a += 4;
        }
        return a;
      },
      nc = {};
    function oc(b) {
      var a = nc[b];
      return void 0 === a ? U(b) : a;
    }
    var pc = [];
    function qc(b) {
      var a = pc.length;
      pc.push(b);
      return a;
    }
    function rc(b, a) {
      for (var c = Array(b), d = 0; d < b; ++d) c[d] = mb(N[a + 4 * d >> 2], "parameter " + d);
      return c;
    }
    var sc = [],
      tc = {},
      vc = () => {
        if (!uc) {
          var b = {
              USER: "web_user",
              LOGNAME: "web_user",
              PATH: "/",
              PWD: "/",
              HOME: "/home/web_user",
              LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
              _: la || "./this.program"
            },
            a;
          for (a in tc) void 0 === tc[a] ? delete b[a] : b[a] = tc[a];
          var c = [];
          for (a in b) c.push(`${a}=${b[a]}`);
          uc = c;
        }
        return uc;
      },
      uc,
      wc = [null, [], []];
    Object.assign(Za.prototype, {
      get(b) {
        return this.ja[b];
      },
      has(b) {
        return void 0 !== this.ja[b];
      },
      Ya(b) {
        var a = this.Oa.pop() || this.ja.length;
        this.ja[a] = b;
        return a;
      },
      Za(b) {
        this.ja[b] = void 0;
        this.Oa.push(b);
      }
    });
    $a = m.BindingError = class extends Error {
      constructor(b) {
        super(b);
        this.name = "BindingError";
      }
    };
    O.ja.push({
      value: void 0
    }, {
      value: null
    }, {
      value: !0
    }, {
      value: !1
    });
    O.Ea = O.ja.length;
    m.count_emval_handles = function () {
      for (var b = 0, a = O.Ea; a < O.ja.length; ++a) void 0 !== O.ja[a] && ++b;
      return b;
    };
    cb = m.PureVirtualError = bb("PureVirtualError");
    for (var xc = Array(256), yc = 0; 256 > yc; ++yc) xc[yc] = String.fromCharCode(yc);
    db = xc;
    m.getInheritedInstanceCount = function () {
      return Object.keys(V).length;
    };
    m.getLiveInheritedInstances = function () {
      var b = [],
        a;
      for (a in V) V.hasOwnProperty(a) && b.push(V[a]);
      return b;
    };
    m.flushPendingDeletes = fb;
    m.setDelayFunction = function (b) {
      gb = b;
      eb.length && gb && gb(fb);
    };
    xb = m.InternalError = class extends Error {
      constructor(b) {
        super(b);
        this.name = "InternalError";
      }
    };
    Jb.prototype.isAliasOf = function (b) {
      if (!(this instanceof Jb && b instanceof Jb)) return !1;
      var a = this.W.Z.X,
        c = this.W.Y,
        d = b.W.Z.X;
      for (b = b.W.Y; a.$;) c = a.ra(c), a = a.$;
      for (; d.$;) b = d.ra(b), d = d.$;
      return a === d && c === b;
    };
    Jb.prototype.clone = function () {
      this.W.Y || Ib(this);
      if (this.W.pa) return this.W.count.value += 1, this;
      var b = Ab,
        a = Object,
        c = a.create,
        d = Object.getPrototypeOf(this),
        e = this.W;
      b = b(c.call(a, d, {
        W: {
          value: {
            count: e.count,
            na: e.na,
            pa: e.pa,
            Y: e.Y,
            Z: e.Z,
            ca: e.ca,
            fa: e.fa
          }
        }
      }));
      b.W.count.value += 1;
      b.W.na = !1;
      return b;
    };
    Jb.prototype["delete"] = function () {
      this.W.Y || Ib(this);
      this.W.na && !this.W.pa && Q("Object already scheduled for deletion");
      nb(this);
      tb(this.W);
      this.W.pa || (this.W.ca = void 0, this.W.Y = void 0);
    };
    Jb.prototype.isDeleted = function () {
      return !this.W.Y;
    };
    Jb.prototype.deleteLater = function () {
      this.W.Y || Ib(this);
      this.W.na && !this.W.pa && Q("Object already scheduled for deletion");
      eb.push(this);
      1 === eb.length && gb && gb(fb);
      this.W.na = !0;
      return this;
    };
    Sb.prototype.pb = function (b) {
      this.Sa && (b = this.Sa(b));
      return b;
    };
    Sb.prototype.Ka = function (b) {
      this.ka && this.ka(b);
    };
    Sb.prototype.argPackAdvance = 8;
    Sb.prototype.readValueFromPointer = Db;
    Sb.prototype.deleteObject = function (b) {
      if (null !== b) b["delete"]();
    };
    Sb.prototype.fromWireType = function (b) {
      function a() {
        return this.ua ? zb(this.X.ga, {
          Z: this.Ab,
          Y: c,
          fa: this,
          ca: b
        }) : zb(this.X.ga, {
          Z: this,
          Y: b
        });
      }
      var c = this.pb(b);
      if (!c) return this.Ka(b), null;
      var d = wb(this.X, c);
      if (void 0 !== d) {
        if (0 === d.W.count.value) return d.W.Y = c, d.W.ca = b, d.clone();
        d = d.clone();
        this.Ka(b);
        return d;
      }
      d = this.X.ob(c);
      d = vb[d];
      if (!d) return a.call(this);
      d = this.ta ? d.fb : d.pointerType;
      var e = ub(c, this.X, d.X);
      return null === e ? a.call(this) : this.ua ? zb(d.X.ga, {
        Z: d,
        Y: e,
        fa: this,
        ca: b
      }) : zb(d.X.ga, {
        Z: d,
        Y: e
      });
    };
    Vb = m.UnboundTypeError = bb("UnboundTypeError");
    var Ac = {
      I: function (b, a, c) {
        b = U(b);
        a = mb(a, "wrapper");
        c = ab(c);
        var d = [].slice,
          e = a.X,
          f = e.ga,
          h = e.$.ga,
          g = e.$.constructor;
        b = Ya(b, function () {
          e.$.Ra.forEach(function (k) {
            if (this[k] === h[k]) throw new cb(`Pure virtual function ${k} must be implemented in JavaScript`);
          }.bind(this));
          Object.defineProperty(this, "__parent", {
            value: f
          });
          this.__construct.apply(this, d.call(arguments));
        });
        f.__construct = function () {
          this === f && Q("Pass correct 'this' to __construct");
          var k = g.implement.apply(void 0, [this].concat(d.call(arguments)));
          nb(k);
          var p = k.W;
          k.notifyOnDestruction();
          p.pa = !0;
          Object.defineProperties(this, {
            W: {
              value: p
            }
          });
          Ab(this);
          k = p.Y;
          k = hb(e, k);
          V.hasOwnProperty(k) ? Q(`Tried to register registered instance: ${k}`) : V[k] = this;
        };
        f.__destruct = function () {
          this === f && Q("Pass correct 'this' to __destruct");
          nb(this);
          var k = this.W.Y;
          k = hb(e, k);
          V.hasOwnProperty(k) ? delete V[k] : Q(`Tried to unregister unregistered instance: ${k}`);
        };
        b.prototype = Object.create(f);
        for (var l in c) b.prototype[l] = c[l];
        return S(b);
      },
      L: function (b) {
        var a = Bb[b];
        delete Bb[b];
        var c = a.Ba,
          d = a.ka,
          e = a.Na,
          f = e.map(h => h.sb).concat(e.map(h => h.Db));
        X([b], f, h => {
          var g = {};
          e.forEach((l, k) => {
            var p = h[k],
              r = l.qb,
              t = l.rb,
              v = h[k + e.length],
              q = l.Cb,
              G = l.Eb;
            g[l.mb] = {
              read: I => p.fromWireType(r(t, I)),
              write: (I, w) => {
                var z = [];
                q(G, I, v.toWireType(z, w));
                Cb(z);
              }
            };
          });
          return [{
            name: a.name,
            fromWireType: function (l) {
              var k = {},
                p;
              for (p in g) k[p] = g[p].read(l);
              d(l);
              return k;
            },
            toWireType: function (l, k) {
              for (var p in g) if (!(p in k)) throw new TypeError(`Missing field: "${p}"`);
              var r = c();
              for (p in g) g[p].write(r, k[p]);
              null !== l && l.push(d, r);
              return r;
            },
            argPackAdvance: 8,
            readValueFromPointer: Db,
            ea: d
          }];
        });
      },
      z: function () {},
      G: function (b, a, c, d, e) {
        var f = Gb(c);
        a = U(a);
        Y(b, {
          name: a,
          fromWireType: function (h) {
            return !!h;
          },
          toWireType: function (h, g) {
            return g ? d : e;
          },
          argPackAdvance: 8,
          readValueFromPointer: function (h) {
            if (1 === c) var g = za;else if (2 === c) g = Aa;else if (4 === c) g = Ca;else throw new TypeError("Unknown boolean type size: " + a);
            return this.fromWireType(g[h >> f]);
          },
          ea: null
        });
      },
      e: function (b, a, c, d, e, f, h, g, l, k, p, r, t) {
        p = U(p);
        f = Z(e, f);
        g && (g = Z(h, g));
        k && (k = Z(l, k));
        t = Z(r, t);
        var v = Wa(p);
        Lb(v, function () {
          Wb(`Cannot construct ${p} due to unbound types`, [d]);
        });
        X([b, a, c], d ? [d] : [], function (q) {
          q = q[0];
          if (d) {
            var G = q.X;
            var I = G.ga;
          } else I = Jb.prototype;
          q = Ya(v, function () {
            if (Object.getPrototypeOf(this) !== w) throw new $a("Use 'new' to construct " + p);
            if (void 0 === z.la) throw new $a(p + " has no accessible constructor");
            var P = z.la[arguments.length];
            if (void 0 === P) throw new $a(`Tried to invoke ctor of ${p} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(z.la).toString()}) parameters instead!`);
            return P.apply(this, arguments);
          });
          var w = Object.create(I, {
            constructor: {
              value: q
            }
          });
          q.prototype = w;
          var z = new Mb(p, q, w, t, G, f, g, k);
          z.$ && (void 0 === z.$.sa && (z.$.sa = []), z.$.sa.push(z));
          G = new Sb(p, z, !0, !1);
          I = new Sb(p + "*", z, !1, !1);
          var J = new Sb(p + " const*", z, !1, !0);
          vb[b] = {
            pointerType: I,
            fb: J
          };
          Tb(v, q);
          return [G, I, J];
        });
      },
      k: function (b, a, c, d, e, f, h) {
        var g = Yb(c, d);
        a = U(a);
        f = Z(e, f);
        X([], [b], function (l) {
          function k() {
            Wb(`Cannot call ${p} due to unbound types`, g);
          }
          l = l[0];
          var p = `${l.name}.${a}`;
          a.startsWith("@@") && (a = Symbol[a.substring(2)]);
          var r = l.X.constructor;
          void 0 === r[a] ? (k.ma = c - 1, r[a] = k) : (Kb(r, a, p), r[a].aa[c - 1] = k);
          X([], g, function (t) {
            t = Xb(p, [t[0], null].concat(t.slice(1)), null, f, h);
            void 0 === r[a].aa ? (t.ma = c - 1, r[a] = t) : r[a].aa[c - 1] = t;
            if (l.X.sa) for (const v of l.X.sa) v.constructor.hasOwnProperty(a) || (v.constructor[a] = t);
            return [];
          });
          return [];
        });
      },
      s: function (b, a, c, d, e, f, h, g) {
        a = U(a);
        f = Z(e, f);
        X([], [b], function (l) {
          l = l[0];
          var k = `${l.name}.${a}`,
            p = {
              get() {
                Wb(`Cannot access ${k} due to unbound types`, [c]);
              },
              enumerable: !0,
              configurable: !0
            };
          p.set = g ? () => {
            Wb(`Cannot access ${k} due to unbound types`, [c]);
          } : () => {
            Q(`${k} is a read-only property`);
          };
          Object.defineProperty(l.X.constructor, a, p);
          X([], [c], function (r) {
            r = r[0];
            var t = {
              get() {
                return r.fromWireType(f(d));
              },
              enumerable: !0
            };
            g && (g = Z(h, g), t.set = v => {
              var q = [];
              g(d, r.toWireType(q, v));
              Cb(q);
            });
            Object.defineProperty(l.X.constructor, a, t);
            return [];
          });
          return [];
        });
      },
      o: function (b, a, c, d, e, f) {
        var h = Yb(a, c);
        e = Z(d, e);
        X([], [b], function (g) {
          g = g[0];
          var l = `constructor ${g.name}`;
          void 0 === g.X.la && (g.X.la = []);
          if (void 0 !== g.X.la[a - 1]) throw new $a(`Cannot register multiple constructors with identical number of parameters (${a - 1}) for class '${g.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
          g.X.la[a - 1] = () => {
            Wb(`Cannot construct ${g.name} due to unbound types`, h);
          };
          X([], h, function (k) {
            k.splice(1, 0, null);
            g.X.la[a - 1] = Xb(l, k, null, e, f);
            return [];
          });
          return [];
        });
      },
      a: function (b, a, c, d, e, f, h, g) {
        var l = Yb(c, d);
        a = U(a);
        f = Z(e, f);
        X([], [b], function (k) {
          function p() {
            Wb(`Cannot call ${r} due to unbound types`, l);
          }
          k = k[0];
          var r = `${k.name}.${a}`;
          a.startsWith("@@") && (a = Symbol[a.substring(2)]);
          g && k.X.Ra.push(a);
          var t = k.X.ga,
            v = t[a];
          void 0 === v || void 0 === v.aa && v.className !== k.name && v.ma === c - 2 ? (p.ma = c - 2, p.className = k.name, t[a] = p) : (Kb(t, a, r), t[a].aa[c - 2] = p);
          X([], l, function (q) {
            q = Xb(r, q, k, f, h);
            void 0 === t[a].aa ? (q.ma = c - 2, t[a] = q) : t[a].aa[c - 2] = q;
            return [];
          });
          return [];
        });
      },
      d: function (b, a, c, d, e, f, h, g, l, k) {
        a = U(a);
        e = Z(d, e);
        X([], [b], function (p) {
          p = p[0];
          var r = `${p.name}.${a}`,
            t = {
              get() {
                Wb(`Cannot access ${r} due to unbound types`, [c, h]);
              },
              enumerable: !0,
              configurable: !0
            };
          t.set = l ? () => {
            Wb(`Cannot access ${r} due to unbound types`, [c, h]);
          } : () => {
            Q(r + " is a read-only property");
          };
          Object.defineProperty(p.X.ga, a, t);
          X([], l ? [c, h] : [c], function (v) {
            var q = v[0],
              G = {
                get() {
                  var w = Zb(this, p, r + " getter");
                  return q.fromWireType(e(f, w));
                },
                enumerable: !0
              };
            if (l) {
              l = Z(g, l);
              var I = v[1];
              G.set = function (w) {
                var z = Zb(this, p, r + " setter"),
                  J = [];
                l(k, z, I.toWireType(J, w));
                Cb(J);
              };
            }
            Object.defineProperty(p.X.ga, a, G);
            return [];
          });
          return [];
        });
      },
      F: function (b, a) {
        a = U(a);
        Y(b, {
          name: a,
          fromWireType: function (c) {
            var d = ab(c);
            $b(c);
            return d;
          },
          toWireType: function (c, d) {
            return S(d);
          },
          argPackAdvance: 8,
          readValueFromPointer: Db,
          ea: null
        });
      },
      l: function (b, a, c, d) {
        function e() {}
        c = Gb(c);
        a = U(a);
        e.values = {};
        Y(b, {
          name: a,
          constructor: e,
          fromWireType: function (f) {
            return this.constructor.values[f];
          },
          toWireType: function (f, h) {
            return h.value;
          },
          argPackAdvance: 8,
          readValueFromPointer: ac(a, c, d),
          ea: null
        });
        Lb(a, e);
      },
      c: function (b, a, c) {
        var d = mb(b, "enum");
        a = U(a);
        b = d.constructor;
        d = Object.create(d.constructor.prototype, {
          value: {
            value: c
          },
          constructor: {
            value: Ya(`${d.name}_${a}`, function () {})
          }
        });
        b.values[c] = d;
        b[a] = d;
      },
      u: function (b, a, c) {
        c = Gb(c);
        a = U(a);
        Y(b, {
          name: a,
          fromWireType: function (d) {
            return d;
          },
          toWireType: function (d, e) {
            return e;
          },
          argPackAdvance: 8,
          readValueFromPointer: bc(a, c),
          ea: null
        });
      },
      q: function (b, a, c, d, e, f) {
        var h = Yb(a, c);
        b = U(b);
        e = Z(d, e);
        Lb(b, function () {
          Wb(`Cannot call ${b} due to unbound types`, h);
        }, a - 1);
        X([], h, function (g) {
          Tb(b, Xb(b, [g[0], null].concat(g.slice(1)), null, e, f), a - 1);
          return [];
        });
      },
      j: function (b, a, c, d, e) {
        a = U(a);
        -1 === e && (e = 4294967295);
        e = Gb(c);
        var f = g => g;
        if (0 === d) {
          var h = 32 - 8 * c;
          f = g => g << h >>> h;
        }
        c = a.includes("unsigned") ? function (g, l) {
          return l >>> 0;
        } : function (g, l) {
          return l;
        };
        Y(b, {
          name: a,
          fromWireType: f,
          toWireType: c,
          argPackAdvance: 8,
          readValueFromPointer: cc(a, e, 0 !== d),
          ea: null
        });
      },
      g: function (b, a, c) {
        function d(f) {
          f >>= 2;
          var h = N;
          return new e(h.buffer, h[f + 1], h[f]);
        }
        var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][a];
        c = U(c);
        Y(b, {
          name: c,
          fromWireType: d,
          argPackAdvance: 8,
          readValueFromPointer: d
        }, {
          tb: !0
        });
      },
      v: function (b, a) {
        a = U(a);
        var c = "std::string" === a;
        Y(b, {
          name: a,
          fromWireType: function (d) {
            var e = N[d >> 2],
              f = d + 4;
            if (c) for (var h = f, g = 0; g <= e; ++g) {
              var l = f + g;
              if (g == e || 0 == L[l]) {
                h = h ? fc(L, h, l - h) : "";
                if (void 0 === k) var k = h;else k += String.fromCharCode(0), k += h;
                h = l + 1;
              }
            } else {
              k = Array(e);
              for (g = 0; g < e; ++g) k[g] = String.fromCharCode(L[f + g]);
              k = k.join("");
            }
            lb(d);
            return k;
          },
          toWireType: function (d, e) {
            e instanceof ArrayBuffer && (e = new Uint8Array(e));
            var f,
              h = "string" == typeof e;
            h || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array || Q("Cannot pass non-string to std::string");
            var g;
            if (c && h) for (f = g = 0; f < e.length; ++f) {
              var l = e.charCodeAt(f);
              127 >= l ? g++ : 2047 >= l ? g += 2 : 55296 <= l && 57343 >= l ? (g += 4, ++f) : g += 3;
            } else g = e.length;
            f = g;
            g = zc(4 + f + 1);
            l = g + 4;
            N[g >> 2] = f;
            if (c && h) {
              if (h = l, l = f + 1, f = L, 0 < l) {
                l = h + l - 1;
                for (var k = 0; k < e.length; ++k) {
                  var p = e.charCodeAt(k);
                  if (55296 <= p && 57343 >= p) {
                    var r = e.charCodeAt(++k);
                    p = 65536 + ((p & 1023) << 10) | r & 1023;
                  }
                  if (127 >= p) {
                    if (h >= l) break;
                    f[h++] = p;
                  } else {
                    if (2047 >= p) {
                      if (h + 1 >= l) break;
                      f[h++] = 192 | p >> 6;
                    } else {
                      if (65535 >= p) {
                        if (h + 2 >= l) break;
                        f[h++] = 224 | p >> 12;
                      } else {
                        if (h + 3 >= l) break;
                        f[h++] = 240 | p >> 18;
                        f[h++] = 128 | p >> 12 & 63;
                      }
                      f[h++] = 128 | p >> 6 & 63;
                    }
                    f[h++] = 128 | p & 63;
                  }
                }
                f[h] = 0;
              }
            } else if (h) for (h = 0; h < f; ++h) k = e.charCodeAt(h), 255 < k && (lb(l), Q("String has UTF-16 code units that do not fit in 8 bits")), L[l + h] = k;else for (h = 0; h < f; ++h) L[l + h] = e[h];
            null !== d && d.push(lb, g);
            return g;
          },
          argPackAdvance: 8,
          readValueFromPointer: Db,
          ea: function (d) {
            lb(d);
          }
        });
      },
      t: function (b, a, c) {
        c = U(c);
        if (2 === a) {
          var d = hc;
          var e = ic;
          var f = jc;
          var h = () => Ba;
          var g = 1;
        } else 4 === a && (d = kc, e = lc, f = mc, h = () => N, g = 2);
        Y(b, {
          name: c,
          fromWireType: function (l) {
            for (var k = N[l >> 2], p = h(), r, t = l + 4, v = 0; v <= k; ++v) {
              var q = l + 4 + v * a;
              if (v == k || 0 == p[q >> g]) t = d(t, q - t), void 0 === r ? r = t : (r += String.fromCharCode(0), r += t), t = q + a;
            }
            lb(l);
            return r;
          },
          toWireType: function (l, k) {
            "string" != typeof k && Q(`Cannot pass non-string to C++ string type ${c}`);
            var p = f(k),
              r = zc(4 + p + a);
            N[r >> 2] = p >> g;
            e(k, r + 4, p + a);
            null !== l && l.push(lb, r);
            return r;
          },
          argPackAdvance: 8,
          readValueFromPointer: Db,
          ea: function (l) {
            lb(l);
          }
        });
      },
      N: function (b, a, c, d, e, f) {
        Bb[b] = {
          name: U(a),
          Ba: Z(c, d),
          ka: Z(e, f),
          Na: []
        };
      },
      M: function (b, a, c, d, e, f, h, g, l, k) {
        Bb[b].Na.push({
          mb: U(a),
          sb: c,
          qb: Z(d, e),
          rb: f,
          Db: h,
          Cb: Z(g, l),
          Eb: k
        });
      },
      H: function (b, a) {
        a = U(a);
        Y(b, {
          vb: !0,
          name: a,
          argPackAdvance: 0,
          fromWireType: function () {},
          toWireType: function () {}
        });
      },
      r: function (b, a, c) {
        b = ab(b);
        a = mb(a, "emval::as");
        var d = [],
          e = S(d);
        N[c >> 2] = e;
        return a.toWireType(d, b);
      },
      w: function (b, a, c, d, e) {
        b = pc[b];
        a = ab(a);
        c = oc(c);
        var f = [];
        N[d >> 2] = S(f);
        return b(a, c, f, e);
      },
      i: function (b, a, c, d) {
        b = pc[b];
        a = ab(a);
        c = oc(c);
        b(a, c, null, d);
      },
      f: $b,
      h: function (b, a) {
        var c = rc(b, a),
          d = c[0];
        a = d.name + "_$" + c.slice(1).map(function (h) {
          return h.name;
        }).join("_") + "$";
        var e = sc[a];
        if (void 0 !== e) return e;
        var f = Array(b - 1);
        e = qc((h, g, l, k) => {
          for (var p = 0, r = 0; r < b - 1; ++r) f[r] = c[r + 1].readValueFromPointer(k + p), p += c[r + 1].argPackAdvance;
          h = h[g].apply(h, f);
          for (r = 0; r < b - 1; ++r) c[r + 1].hb && c[r + 1].hb(f[r]);
          if (!d.vb) return d.toWireType(l, h);
        });
        return sc[a] = e;
      },
      p: function (b) {
        b = oc(b);
        return S(m[b]);
      },
      K: function (b, a) {
        b = ab(b);
        a = ab(a);
        return S(b[a]);
      },
      m: function (b) {
        4 < b && (O.get(b).Ta += 1);
      },
      J: function (b) {
        return S(oc(b));
      },
      n: function (b) {
        var a = ab(b);
        Cb(a);
        $b(b);
      },
      x: function (b, a) {
        b = mb(b, "_emval_take_value");
        b = b.readValueFromPointer(a);
        return S(b);
      },
      b: () => {
        wa("");
      },
      A: b => {
        var a = L.length;
        b >>>= 0;
        if (2147483648 < b) return !1;
        for (var c = 1; 4 >= c; c *= 2) {
          var d = a * (1 + .2 / c);
          d = Math.min(d, b + 100663296);
          var e = Math;
          d = Math.max(b, d);
          a: {
            e = e.min.call(e, 2147483648, d + (65536 - d % 65536) % 65536) - xa.buffer.byteLength + 65535 >>> 16;
            try {
              xa.grow(e);
              Fa();
              var f = 1;
              break a;
            } catch (h) {}
            f = void 0;
          }
          if (f) return !0;
        }
        return !1;
      },
      B: (b, a) => {
        var c = 0;
        vc().forEach(function (d, e) {
          var f = a + c;
          e = N[b + 4 * e >> 2] = f;
          for (f = 0; f < d.length; ++f) za[e++ >> 0] = d.charCodeAt(f);
          za[e >> 0] = 0;
          c += d.length + 1;
        });
        return 0;
      },
      C: (b, a) => {
        var c = vc();
        N[b >> 2] = c.length;
        var d = 0;
        c.forEach(function (e) {
          d += e.length + 1;
        });
        N[a >> 2] = d;
        return 0;
      },
      D: () => 52,
      y: function () {
        return 70;
      },
      E: (b, a, c, d) => {
        for (var e = 0, f = 0; f < c; f++) {
          var h = N[a >> 2],
            g = N[a + 4 >> 2];
          a += 8;
          for (var l = 0; l < g; l++) {
            var k = L[h + l],
              p = wc[b];
            0 === k || 10 === k ? ((1 === b ? ra : sa)(fc(p, 0)), p.length = 0) : p.push(k);
          }
          e += g;
        }
        N[d >> 2] = e;
        return 0;
      }
    };
    (function () {
      function b(c) {
        H = c = c.exports;
        xa = H.O;
        Fa();
        Ga = H.U;
        Ia.unshift(H.P);
        La--;
        m.monitorRunDependencies && m.monitorRunDependencies(La);
        if (0 == La && (null !== Ma && (clearInterval(Ma), Ma = null), Na)) {
          var d = Na;
          Na = null;
          d();
        }
        return c;
      }
      var a = {
        a: Ac
      };
      La++;
      m.monitorRunDependencies && m.monitorRunDependencies(La);
      if (m.instantiateWasm) try {
        return m.instantiateWasm(a, b);
      } catch (c) {
        sa("Module.instantiateWasm callback failed with error: " + c), ba(c);
      }
      Ua(a, function (c) {
        b(c.instance);
      }).catch(ba);
      return {};
    })();
    var lb = b => (lb = H.Q)(b),
      zc = b => (zc = H.R)(b),
      kb = b => (kb = H.S)(b);
    m.__embind_initialize_bindings = () => (m.__embind_initialize_bindings = H.T)();
    m.dynCall_jiji = (b, a, c, d, e) => (m.dynCall_jiji = H.V)(b, a, c, d, e);
    var Bc;
    Na = function Cc() {
      Bc || Dc();
      Bc || (Na = Cc);
    };
    function Dc() {
      function b() {
        if (!Bc && (Bc = !0, m.calledRun = !0, !ya)) {
          Va(Ia);
          aa(m);
          if (m.onRuntimeInitialized) m.onRuntimeInitialized();
          if (m.postRun) for ("function" == typeof m.postRun && (m.postRun = [m.postRun]); m.postRun.length;) {
            var a = m.postRun.shift();
            Ja.unshift(a);
          }
          Va(Ja);
        }
      }
      if (!(0 < La)) {
        if (m.preRun) for ("function" == typeof m.preRun && (m.preRun = [m.preRun]); m.preRun.length;) Ka();
        Va(Ha);
        0 < La || (m.setStatus ? (m.setStatus("Running..."), setTimeout(function () {
          setTimeout(function () {
            m.setStatus("");
          }, 1);
          b();
        }, 1)) : b());
      }
    }
    if (m.preInit) for ("function" == typeof m.preInit && (m.preInit = [m.preInit]); 0 < m.preInit.length;) m.preInit.pop()();
    Dc();
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
function main() {
  return __awaiter(this, void 0, void 0, function () {
    function spawnTiles() {
      for (var i = 0; i < 2; ++i) {
        for (var j = 0; j < 5; ++j) {
          var tileInstance = file.artboardByName("artboard");
          var tileMachine = new rive.StateMachineInstance(tile.stateMachineByName("State Machine"), tileInstance);
          var tapTrigger = void 0;
          for (var i_1 = 0, l = tileMachine.inputCount(); i_1 < l; i_1++) {
            var input = tileMachine.input(i_1);
            // console.log(input.name)
            switch (input.name) {
              case "Tap":
                tapTrigger = input.asTrigger();
                break;
              default:
                break;
            }
          }
          var x = i ? canvas.width - (dim + padX) : padX;
          var anim = new rive.LinearAnimationInstance(tileInstance.animationByName("Tap / Correct"), tileInstance);
          var anim2 = new rive.LinearAnimationInstance(tileInstance.animationByName("Tap / Incorrect"), tileInstance);
          var blockInstance = {
            x: x,
            y: j * dim + padY * (j + 1),
            artboard: tileInstance,
            machine: tileMachine,
            anim: anim,
            anim2: anim2,
            tapTrigger: tapTrigger
          };
          tileMachine.advance(0);
          blockInstance.artboard.advance(0);
          tiles.add(blockInstance);
        }
      }
    }
    function isTileClicked(mx, my) {
      for (var i = 0; i < 2; ++i) {
        for (var j = 0; j < 5; ++j) {
          var x = i ? canvas.width - (dim + padX) : padX;
          var y = j * dim + padY * (j + 1);
          if (mx >= x && mx <= x + dim && my >= y && my <= y + dim) {
            return i * 5 + j;
          }
        }
      }
      return -1;
    }
    function shuffleArr(array) {
      var _a;
      for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        _a = [array[rand], array[i]], array[i] = _a[0], array[rand] = _a[1];
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
      if (artboardG && artboardBG) {
        var idx = 0;
        if (bgAnimPlane) {
          bgAnimPlane.advance(elapsedTimeSec);
          bgAnimPlane.apply(1);
        }
        // for (let i = 0, l = bgMachine.inputCount(); i < l; i++) {
        //   const input = bgMachine.input(i);
        //   // console.log(input, input.name, input.type, input.asNumber().value)
        //   input.asNumber().value += elapsedTimeSec;
        // }
        // 
        if (progressT > 0) {
          progressT -= 1 * elapsedTimeSec;
          var val = 1 * progressT;
          bgMachineProgress.asNumber().value += val;
          balloonX += balloonDirection * val;
          if (Math.abs(balloonX) >= 100) {
            balloonX = 100 * balloonDirection;
          }
          bgMachineBalloonX.asNumber().value = balloonX;
          if (progressT <= 0) {
            progressT = 0;
          }
        }
        // bgMachineBalloonX.asNumber().value += 1000 * elapsedTimeSec;
        bgMachine.advance(elapsedTimeSec);
        renderer.save();
        var x = padX + dim;
        var y = 0;
        renderer.translate(x, y);
        renderer.align(rive.Fit.fitWidth, rive.Alignment.center, {
          minX: 0,
          minY: 0,
          maxX: bgWidth,
          maxY: canvas.height
        }, artboardBG.bounds);
        artboardBG.advance(elapsedTimeSec);
        // artboardBG.apply(elapsedTimeSec);
        // artboardBG.apply(elapsedTimeSec);
        artboardBG.draw(renderer);
        renderer.restore();
        for (var _i = 0, _a = Array.from(tiles); _i < _a.length; _i++) {
          var blockInstance = _a[_i];
          var artboard = blockInstance.artboard,
            machine = blockInstance.machine,
            anim = blockInstance.anim,
            anim2 = blockInstance.anim2,
            tapTrigger = blockInstance.tapTrigger,
            x_1 = blockInstance.x,
            y_1 = blockInstance.y;
          renderer.save();
          if (tileAnim[idx].t > 0) {
            if (tileAnim[idx].type == 1) {
              anim.advance(elapsedTimeSec);
              anim.apply(1);
            } else if (tileAnim[idx].type == 2) {
              anim2.advance(elapsedTimeSec);
              anim2.apply(1);
            }
            tileAnim[idx].t -= 1 * elapsedTimeSec;
            if (tileAnim[idx].t <= 0) {
              tileAnim[idx].t = 0;
              tileAnim[idx].type = 0;
              anim.time = 0;
              anim2.time = 0;
            } else if (tileAnim[idx].t <= 1) {
              if (tileAnim[idx].type == 1) {
                tileNums[idx] = tileNumsT[idx];
              }
            }
          }
          var textRun = artboard.textRun("Count");
          textRun.text = tileNums[idx].toString();
          // console.log(textRun.text)
          renderer.translate(x_1, y_1);
          renderer.align(rive.Fit.contain, rive.Alignment.center, {
            minX: 0,
            minY: 0,
            maxX: dim,
            maxY: dim
          }, artboard.bounds);
          tapTrigger.fire();
          artboard.advance(elapsedTimeSec);
          artboard.draw(renderer);
          renderer.restore();
          idx++;
        }
      }
      renderer.restore();
      rive.requestAnimationFrame(renderLoop);
    }
    var rive, canvas, scaleX, scaleY, padX, padY, dim, bgWidth, renderer, bytes, file, artboardG, bytes2, file2, artboardBG, bgAnim, bgAnimPlane, bgMachine, progressDuration, i, progressT, bgMachineProgress, bgMachineTileSide, bgMachineBalloonX, bgMachineTap, balloonDirection, balloonX, i, l, input, tileNums, tileNumsT, currTile, currNum, topNum, isCorrect, tileAnim, i, lastTime, tile, tiles, mDown;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, canvas_advanced_1.default)({
            // Loads Wasm bundle
            locateFile: function locateFile(_) {
              return "https://unpkg.com/@rive-app/canvas-advanced@2.2.0/rive.wasm";
            }
          })];
        case 1:
          rive = _a.sent();
          canvas = document.getElementById("rive-canvas");
          canvas.height = document.documentElement.clientHeight;
          canvas.width = document.documentElement.clientWidth;
          scaleX = canvas.width / 1792;
          scaleY = canvas.height / 922;
          padX = 10 * scaleX;
          padY = 10 * scaleY;
          dim = (canvas.height - padY * 6) / 5;
          bgWidth = canvas.width - (padX + dim) * 2;
          renderer = rive.makeRenderer(canvas);
          return [4 /*yield*/, fetch(new Request("2023-10-23-tile_test-001.riv"))
          // await fetch(new Request("Button.riv"))
          ];

        case 2:
          return [4 /*yield*/, _a.sent()
          // await fetch(new Request("Button.riv"))
          .arrayBuffer()];
        case 3:
          bytes = _a.sent();
          return [4 /*yield*/, rive.load(new Uint8Array(bytes))];
        case 4:
          file = _a.sent();
          artboardG = file.defaultArtboard();
          return [4 /*yield*/, fetch(new Request("Background.riv"))
          // await fetch(new Request("2023-10-26-Background-Test-001.riv"))
          // await fetch(new Request("2023-10-25-Background-Test-001.riv"))
          // await fetch(new Request("2023-10-23-Background-Test-001.riv"))
          ];

        case 5:
          return [4 /*yield*/, _a.sent()
          // await fetch(new Request("2023-10-26-Background-Test-001.riv"))
          // await fetch(new Request("2023-10-25-Background-Test-001.riv"))
          // await fetch(new Request("2023-10-23-Background-Test-001.riv"))
          .arrayBuffer()];
        case 6:
          bytes2 = _a.sent();
          return [4 /*yield*/, rive.load(new Uint8Array(bytes2))];
        case 7:
          file2 = _a.sent();
          artboardBG = file2.defaultArtboard();
          bgAnim = new rive.LinearAnimationInstance(
          // artboardBG.animationByIndex(0),
          artboardBG.animationByName("Tap"), artboardBG);
          bgAnimPlane = new rive.LinearAnimationInstance(
          // artboardBG.animationByIndex(0),
          artboardBG.animationByName("Plane Flying"), artboardBG);
          bgMachine = new rive.StateMachineInstance(artboardBG.stateMachineByName("State Machine"), artboardBG);
          progressDuration = 2;
          // console.log(artboardBG);
          for (i = 0; i < artboardBG.animationCount(); ++i) {
            console.log(artboardBG.animationByIndex(i).name);
          }
          progressT = 0;
          balloonDirection = 1;
          balloonX = 0;
          for (i = 0, l = bgMachine.inputCount(); i < l; i++) {
            input = bgMachine.input(i);
            console.log(input.name, input.type);
            // console.log(input, input.name, input.type, input.asNumber().value)
            if (input.name == "Progress") {
              bgMachineProgress = input;
            } else if (input.name == "TileSide") {
              bgMachineTileSide = input;
            } else if (input.name == "BalloonX") {
              bgMachineBalloonX = input;
            } else if (input.name == "Tap") {
              bgMachineTap = input;
              // console.log(bgMachineTap)
            }
          }

          tileNums = [];
          tileNumsT = [];
          currTile = -1;
          currNum = 1;
          topNum = 10;
          isCorrect = false;
          tileAnim = [];
          for (i = 0; i < 10; ++i) {
            tileNums[i] = i + 1;
            tileNumsT[i] = tileNums[i];
            tileAnim[i] = {
              type: 0,
              t: 0
            };
          }
          shuffleArr(tileNums);
          lastTime = 0;
          tile = file.artboardByName("artboard");
          tiles = new Set();
          // console.log(tile);
          spawnTiles();
          // spawnTiles();
          window.addEventListener('resize', function (e) {
            location.href = '';
          });
          mDown = false;
          canvas.addEventListener('mousedown', function (e) {
            var mx = e.offsetX;
            var my = e.offsetY;
            if (!mDown) {
              mDown = true;
              currTile = isTileClicked(mx, my);
              if (currTile > -1) {
                if (tileAnim[currTile].t == 0) {
                  if (currNum == tileNums[currTile]) {
                    isCorrect = true;
                    currNum++;
                    // bgMachineTileSide.asNumber().value += 100;
                    bgMachineTap.asTrigger().fire();
                    // tileNums[currTile] = ++topNum;
                    tileNumsT[currTile] = ++topNum;
                    tileAnim[currTile].type = 1;
                    tileAnim[currTile].t = 2;
                    progressT = progressDuration;
                    if (currTile < 5) {
                      bgMachineTileSide.asNumber().value = 0;
                      balloonDirection = 1;
                    } else {
                      bgMachineTileSide.asNumber().value = 1;
                      balloonDirection = -1;
                    }
                  } else {
                    isCorrect = false;
                    tileAnim[currTile].type = 2;
                    tileAnim[currTile].t = 2;
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63719" + '/');
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