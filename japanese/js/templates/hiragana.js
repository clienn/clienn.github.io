// hiragana_templates_aiueo.js (plain JS, no modules)
// Teaching-skeleton templates + AOIs for あ・い・う・え・お
// Plain JS globals attached to window: HIRAGANA_TEMPLATES, DEFAULT_WEIGHTS,
// DEFAULT_THRESHOLDS, HIRAGANA_LIST_AIUEO

(function () {
  // ---- tiny helpers (kept local so this file works standalone) ----
  function _lerp(a, b, t) {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }
  function _len(pts) {
    let L = 0;
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x,
        dy = pts[i].y - pts[i - 1].y;
      L += Math.hypot(dx, dy);
    }
    return L;
  }
  function _resample(pts, n = 48) {
    if (!pts.length) return [];
    const L = _len(pts);
    if (L === 0) return Array.from({ length: n }, () => ({ ...pts[0] }));
    const step = L / (n - 1);
    let D = 0,
      out = [{ ...pts[0] }];
    for (let i = 1; i < pts.length; i++) {
      let a = pts[i - 1],
        b = pts[i];
      let d = Math.hypot(b.x - a.x, b.y - a.y);
      while (d > 0 && D + d >= step) {
        const t = (step - D) / d;
        const q = _lerp(a, b, t);
        out.push(q);
        a = q;
        d = Math.hypot(b.x - a.x, b.y - a.y);
        D = 0;
      }
      D += d;
    }
    while (out.length < n) out.push({ ...pts[pts.length - 1] });
    return out;
  }
  function _line(a, b, N = 32) {
    const pts = [];
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      pts.push(_lerp(a, b, t));
    }
    return pts;
  }

  // ---- defaults (match your canvas tester’s current tuning) ----
  var DEFAULT_WEIGHTS = {
    startEnd: 0.35,
    direction: 0.35,
    shape: 0.2,
    placement: 0.1,
  };
  var DEFAULT_THRESHOLDS = { perStrokeMin: 0.65, overallMean: 0.75 };

  // ---- templates ----
  var T_A = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        startAOI: { cx: 0.28, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.32, cy: 0.42, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.28, y: 0.18 },
            { x: 0.3, y: 0.26 },
            { x: 0.32, y: 0.42 },
          ],
          32,
        ),
        rules: { minLen: 0.18 },
      },
      {
        startAOI: { cx: 0.4, cy: 0.38, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.48, cy: 0.48, rx: 0.1, ry: 0.1 },
        dir: { ux: 1, uy: 1, minDot: 0.7 },
        poly: _resample(
          [
            { x: 0.4, y: 0.38 },
            { x: 0.48, y: 0.48 },
          ],
          24,
        ),
      },
      {
        startAOI: { cx: 0.38, cy: 0.36, rx: 0.12, ry: 0.12 },
        endAOI: { cx: 0.5, cy: 0.62, rx: 0.12, ry: 0.12 },
        dir: { ux: 1, uy: 0, minDot: 0.7 },
        poly: _resample(
          [
            { x: 0.38, y: 0.36 },
            { x: 0.56, y: 0.36 },
            { x: 0.66, y: 0.48 },
            { x: 0.58, y: 0.64 },
            { x: 0.42, y: 0.66 },
            { x: 0.36, y: 0.52 },
            { x: 0.52, y: 0.52 },
          ],
          56,
        ),
        rules: {
          loop: {
            areaMin: 0.06,
            areaMax: 0.2,
            cxMin: 0.36,
            cxMax: 0.66,
            cyMin: 0.36,
            cyMax: 0.7,
          },
        },
      },
    ],
  };

  var T_I = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        startAOI: { cx: 0.36, cy: 0.16, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.32, cy: 0.42, rx: 0.1, ry: 0.1 },
        dir: { ux: -0.1, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.36, y: 0.16 },
            { x: 0.34, y: 0.28 },
            { x: 0.32, y: 0.42 },
          ],
          32,
        ),
      },
      {
        startAOI: { cx: 0.58, cy: 0.12, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.56, cy: 0.82, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _resample(
          [
            { x: 0.58, y: 0.12 },
            { x: 0.58, y: 0.42 },
            { x: 0.56, y: 0.82 },
          ],
          40,
        ),
      },
    ],
  };

  var T_U = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        startAOI: { cx: 0.56, cy: 0.22, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.64, cy: 0.22, rx: 0.1, ry: 0.1 },
        dir: { ux: 1, uy: 0, minDot: 0.8 },
        poly: _line({ x: 0.56, y: 0.22 }, { x: 0.66, y: 0.22 }, 16),
      },
      {
        startAOI: { cx: 0.44, cy: 0.22, rx: 0.12, ry: 0.12 },
        endAOI: { cx: 0.66, cy: 0.8, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.44, y: 0.22 },
            { x: 0.4, y: 0.42 },
            { x: 0.46, y: 0.58 },
            { x: 0.6, y: 0.66 },
            { x: 0.66, y: 0.8 },
          ],
          48,
        ),
        rules: { finalHeadingAxis: { x: 1, y: 0.2 }, maxAxisAngleDeg: 50 },
      },
    ],
  };

  var T_E = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        startAOI: { cx: 0.2, cy: 0.32, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.76, cy: 0.32, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.2, y: 0.32 }, { x: 0.76, y: 0.32 }),
        rules: { bandY: 0.32, tolY: 0.06 },
      },
      {
        startAOI: { cx: 0.52, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.58, cy: 0.86, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.52, y: 0.18 },
            { x: 0.52, y: 0.5 },
            { x: 0.56, y: 0.66 },
            { x: 0.64, y: 0.76 },
            { x: 0.58, y: 0.86 },
          ],
          56,
        ),
      },
    ],
  };

  var T_O = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        startAOI: { cx: 0.6, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.6, cy: 0.3, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.85 },
        poly: _line({ x: 0.6, y: 0.18 }, { x: 0.6, y: 0.3 }),
      },
      {
        startAOI: { cx: 0.4, cy: 0.34, rx: 0.12, ry: 0.08 },
        endAOI: { cx: 0.78, cy: 0.34, rx: 0.12, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.4, y: 0.34 }, { x: 0.78, y: 0.34 }),
        rules: { bandY: 0.34, tolY: 0.06 },
      },
      {
        startAOI: { cx: 0.46, cy: 0.34, rx: 0.12, ry: 0.12 },
        endAOI: { cx: 0.62, cy: 0.86, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.75 },
        poly: _resample(
          [
            { x: 0.46, y: 0.34 },
            { x: 0.36, y: 0.46 },
            { x: 0.4, y: 0.64 },
            { x: 0.58, y: 0.72 },
            { x: 0.62, y: 0.62 },
            { x: 0.52, y: 0.54 },
            { x: 0.46, y: 0.66 },
            { x: 0.58, y: 0.84 },
          ],
          56,
        ),
        rules: {
          loop: {
            areaMin: 0.05,
            areaMax: 0.18,
            cxMin: 0.36,
            cxMax: 0.62,
            cyMin: 0.42,
            cyMax: 0.72,
          },
        },
      },
    ],
  };

  // Append these into your plain-JS templates file (inside the same IIFE)
  // They rely on DEFAULT_WEIGHTS, DEFAULT_THRESHOLDS and helpers _resample/_line.

  var T_KA = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) left vertical
        startAOI: { cx: 0.3, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.3, cy: 0.78, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.3, y: 0.18 }, { x: 0.3, y: 0.78 }),
      },
      {
        // 2) small diagonal tick
        startAOI: { cx: 0.44, cy: 0.36, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.64, cy: 0.5, rx: 0.1, ry: 0.1 },
        dir: { ux: 1, uy: 0.3, minDot: 0.75 },
        poly: _resample(
          [
            { x: 0.44, y: 0.36 },
            { x: 0.64, y: 0.5 },
          ],
          24,
        ),
      },
      {
        // 3) right vertical
        startAOI: { cx: 0.54, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.58, cy: 0.86, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.54, y: 0.18 },
            { x: 0.54, y: 0.5 },
            { x: 0.6, y: 0.72 },
            { x: 0.58, y: 0.86 },
          ],
          48,
        ),
      },
    ],
  };

  var T_KI = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) top bar
        startAOI: { cx: 0.32, cy: 0.28, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.72, cy: 0.28, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.32, y: 0.28 }, { x: 0.72, y: 0.28 }),
        rules: { bandY: 0.28, tolY: 0.06 },
        tag: "bar1",
      },
      {
        // 2) mid bar
        startAOI: { cx: 0.32, cy: 0.46, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.72, cy: 0.46, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.32, y: 0.46 }, { x: 0.72, y: 0.46 }),
        rules: { bandY: 0.46, tolY: 0.06 },
        tag: "bar2",
      },
      {
        // 3) vertical
        startAOI: { cx: 0.56, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.56, cy: 0.8, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.85 },
        poly: _line({ x: 0.56, y: 0.18 }, { x: 0.56, y: 0.8 }),
      },
      {
        // 4) loop/tail
        startAOI: { cx: 0.58, cy: 0.54, rx: 0.12, ry: 0.12 },
        endAOI: { cx: 0.62, cy: 0.86, rx: 0.12, ry: 0.12 },
        dir: { ux: 1, uy: 0.2, minDot: 0.7 },
        poly: _resample(
          [
            { x: 0.58, y: 0.54 },
            { x: 0.7, y: 0.6 },
            { x: 0.66, y: 0.72 },
            { x: 0.56, y: 0.78 },
            { x: 0.62, y: 0.86 },
          ],
          56,
        ),
        rules: {
          loop: {
            areaMin: 0.03,
            areaMax: 0.12,
            cxMin: 0.52,
            cxMax: 0.76,
            cyMin: 0.58,
            cyMax: 0.86,
          },
        },
      },
    ],
  };

  var T_KU = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // Start high on the right; end lower-right
        startAOI: { cx: 0.64, cy: 0.24, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.66, cy: 0.78, rx: 0.11, ry: 0.11 },

        // Early heading must be down-left; tail should end down-right
        dir: { ux: -1, uy: 1, minDot: 0.85 },

        // Curvy sweep: NE -> SW bend -> SE tail
        poly: _resample(
          [
            { x: 0.64, y: 0.24 },
            { x: 0.58, y: 0.3 },
            { x: 0.5, y: 0.42 },
            { x: 0.46, y: 0.52 }, // deepest into SW
            { x: 0.52, y: 0.62 },
            { x: 0.6, y: 0.71 },
            { x: 0.66, y: 0.78 },
          ],
          56,
        ),

        rules: {
          minLen: 0.38,
          finalHeadingAxis: { x: 1, y: 1 }, // tail points down-right
          maxAxisAngleDeg: 35,
        },
      },
    ],
  };

  var T_KE = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) left vertical
        startAOI: { cx: 0.3, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.3, cy: 0.78, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.3, y: 0.18 }, { x: 0.3, y: 0.78 }),
      },
      {
        // 2) short horizontal bar
        startAOI: { cx: 0.48, cy: 0.36, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.68, cy: 0.36, rx: 0.1, ry: 0.1 },
        dir: { ux: 1, uy: 0, minDot: 0.85 },
        poly: _line({ x: 0.48, y: 0.36 }, { x: 0.68, y: 0.36 }),
      },
      {
        // 3) right vertical
        startAOI: { cx: 0.56, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.6, cy: 0.86, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.56, y: 0.18 },
            { x: 0.56, y: 0.52 },
            { x: 0.6, y: 0.86 },
          ],
          48,
        ),
      },
    ],
  };

  var T_KO = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) top/mid bar
        startAOI: { cx: 0.26, cy: 0.32, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.76, cy: 0.32, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.26, y: 0.32 }, { x: 0.76, y: 0.32 }),
        rules: { bandY: 0.32, tolY: 0.06 },
      },
      {
        // 2) bottom bar
        startAOI: { cx: 0.28, cy: 0.58, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.74, cy: 0.58, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.28, y: 0.58 }, { x: 0.74, y: 0.58 }),
        rules: { bandY: 0.58, tolY: 0.06 },
      },
    ],
  };

  // --- SA (さ) ---
  var T_SA = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short top bar
        startAOI: { cx: 0.34, cy: 0.28, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.6, cy: 0.28, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.34, y: 0.28 }, { x: 0.6, y: 0.28 }),
        rules: { bandY: 0.28, tolY: 0.06 },
      },
      {
        // 2) main vertical curve
        startAOI: { cx: 0.48, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.52, cy: 0.82, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.48, y: 0.18 },
            { x: 0.48, y: 0.48 },
            { x: 0.52, y: 0.7 },
            { x: 0.52, y: 0.82 },
          ],
          56,
        ),
      },
      {
        // 3) small diagonal tick to the right
        startAOI: { cx: 0.56, cy: 0.42, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.74, cy: 0.56, rx: 0.1, ry: 0.1 },
        dir: { ux: 1, uy: 0.2, minDot: 0.75 },
        poly: _resample(
          [
            { x: 0.56, y: 0.42 },
            { x: 0.74, y: 0.56 },
          ],
          24,
        ),
        rules: { minLen: 0.18 },
      },
    ],
  };

  // --- SHI (し) ---
  var T_SHI = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) one flowing curve downward with slight rightward tail
        startAOI: { cx: 0.44, cy: 0.2, rx: 0.12, ry: 0.12 },
        endAOI: { cx: 0.68, cy: 0.8, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.85 }, // early motion downward
        poly: _resample(
          [
            { x: 0.44, y: 0.2 },
            { x: 0.44, y: 0.4 },
            { x: 0.5, y: 0.58 },
            { x: 0.6, y: 0.7 },
            { x: 0.68, y: 0.8 },
          ],
          56,
        ),
        rules: {
          finalHeadingAxis: { x: 1, y: 0.2 },
          maxAxisAngleDeg: 45,
          minLen: 0.36,
        },
      },
    ],
  };

  // --- SU (す) ---
  var T_SU = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short vertical tick
        startAOI: { cx: 0.6, cy: 0.2, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.6, cy: 0.32, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.6, y: 0.2 }, { x: 0.6, y: 0.32 }),
      },
      {
        // 2) main curve with loop and tail
        startAOI: { cx: 0.44, cy: 0.34, rx: 0.12, ry: 0.12 },
        endAOI: { cx: 0.66, cy: 0.82, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.8 }, // generally downward at first
        poly: _resample(
          [
            { x: 0.44, y: 0.34 },
            { x: 0.38, y: 0.48 },
            { x: 0.44, y: 0.6 },
            { x: 0.54, y: 0.62 },
            { x: 0.5, y: 0.54 },
            { x: 0.44, y: 0.62 }, // small loop region
            { x: 0.56, y: 0.72 },
            { x: 0.66, y: 0.82 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.02,
            areaMax: 0.08,
            cxMin: 0.42,
            cxMax: 0.56,
            cyMin: 0.48,
            cyMax: 0.66,
          },
          finalHeadingAxis: { x: 1, y: 0.2 },
          maxAxisAngleDeg: 50,
          minLen: 0.4,
        },
      },
    ],
  };

  // --- SE (せ) ---
  var T_SE = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) left vertical
        startAOI: { cx: 0.3, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.3, cy: 0.8, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.3, y: 0.18 }, { x: 0.3, y: 0.8 }),
      },
      {
        // 2) top/mid bar
        startAOI: { cx: 0.38, cy: 0.3, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.74, cy: 0.3, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.38, y: 0.3 }, { x: 0.74, y: 0.3 }),
        rules: { bandY: 0.3, tolY: 0.06 },
        tag: "midbar",
      },
      {
        // 3) right vertical, should cross the bar
        startAOI: { cx: 0.56, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.6, cy: 0.86, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.56, y: 0.18 },
            { x: 0.56, y: 0.52 },
            { x: 0.6, y: 0.86 },
          ],
          56,
        ),
        rules: { mustIntersectMidbar: true },
      },
    ],
  };

  // --- SO (そ) ---
  var T_SO = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) one stroke with a small loop then descending tail
        startAOI: { cx: 0.46, cy: 0.24, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.66, cy: 0.8, rx: 0.12, ry: 0.12 },
        dir: { ux: 1, uy: 1, minDot: 0.8 }, // early bias down-right
        poly: _resample(
          [
            { x: 0.46, y: 0.24 },
            { x: 0.52, y: 0.3 },
            { x: 0.54, y: 0.4 },
            { x: 0.52, y: 0.48 },
            { x: 0.48, y: 0.44 },
            { x: 0.52, y: 0.48 }, // tiny loop area
            { x: 0.58, y: 0.6 },
            { x: 0.66, y: 0.8 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.015,
            areaMax: 0.06,
            cxMin: 0.46,
            cxMax: 0.56,
            cyMin: 0.4,
            cyMax: 0.5,
          },
          finalHeadingAxis: { x: 1, y: 0.6 },
          maxAxisAngleDeg: 45,
          minLen: 0.36,
        },
      },
    ],
  };

  // --- TA (た) ---
  var T_TA = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) left vertical
        startAOI: { cx: 0.3, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.3, cy: 0.78, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.3, y: 0.18 }, { x: 0.3, y: 0.78 }),
      },
      {
        // 2) short mid bar (rightward)
        startAOI: { cx: 0.38, cy: 0.36, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.64, cy: 0.36, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.38, y: 0.36 }, { x: 0.64, y: 0.36 }),
        rules: { bandY: 0.36, tolY: 0.06 },
      },
      {
        // 3) main curve with small loop/tail at lower-right
        startAOI: { cx: 0.46, cy: 0.36, rx: 0.12, ry: 0.12 },
        endAOI: { cx: 0.66, cy: 0.84, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.8 }, // initially downward
        poly: _resample(
          [
            { x: 0.46, y: 0.36 },
            { x: 0.4, y: 0.52 },
            { x: 0.46, y: 0.62 },
            { x: 0.58, y: 0.66 },
            { x: 0.54, y: 0.58 },
            { x: 0.48, y: 0.64 },
            { x: 0.6, y: 0.8 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.02,
            areaMax: 0.08,
            cxMin: 0.46,
            cxMax: 0.58,
            cyMin: 0.54,
            cyMax: 0.68,
          },
          finalHeadingAxis: { x: 1, y: 0.3 },
          maxAxisAngleDeg: 50,
          minLen: 0.38,
        },
      },
    ],
  };

  // --- CHI (ち) ---
  var T_CHI = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short vertical tick
        startAOI: { cx: 0.58, cy: 0.2, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.58, cy: 0.32, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.58, y: 0.2 }, { x: 0.58, y: 0.32 }),
      },
      {
        // 2) main curve with loop and rightward tail
        startAOI: { cx: 0.44, cy: 0.34, rx: 0.12, ry: 0.12 },
        endAOI: { cx: 0.68, cy: 0.78, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.8 },
        poly: _resample(
          [
            { x: 0.44, y: 0.34 },
            { x: 0.38, y: 0.48 },
            { x: 0.44, y: 0.6 },
            { x: 0.54, y: 0.62 },
            { x: 0.5, y: 0.54 },
            { x: 0.44, y: 0.62 }, // loop
            { x: 0.56, y: 0.7 },
            { x: 0.68, y: 0.78 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.02,
            areaMax: 0.08,
            cxMin: 0.44,
            cxMax: 0.54,
            cyMin: 0.5,
            cyMax: 0.64,
          },
          finalHeadingAxis: { x: 1, y: 0.2 },
          maxAxisAngleDeg: 45,
          minLen: 0.4,
        },
      },
    ],
  };

  // --- TSU (つ) ---
  var T_TSU = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) one sweeping curve (comma-like), no loop
        startAOI: { cx: 0.42, cy: 0.22, rx: 0.12, ry: 0.12 },
        endAOI: { cx: 0.66, cy: 0.82, rx: 0.12, ry: 0.12 },
        dir: { ux: 1, uy: 0.4, minDot: 0.85 }, // early drift right/down
        poly: _resample(
          [
            { x: 0.42, y: 0.22 },
            { x: 0.54, y: 0.26 },
            { x: 0.6, y: 0.4 },
            { x: 0.6, y: 0.58 },
            { x: 0.62, y: 0.7 },
            { x: 0.66, y: 0.82 },
          ],
          56,
        ),
        rules: {
          finalHeadingAxis: { x: 1, y: 0.6 },
          maxAxisAngleDeg: 45,
          minLen: 0.34,
        },
      },
    ],
  };

  // --- TE (て) ---
  var T_TE = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) single stroke: short bar then curve down-left
        startAOI: { cx: 0.34, cy: 0.28, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.44, cy: 0.8, rx: 0.12, ry: 0.12 },
        dir: { ux: 1, uy: 0, minDot: 0.85 }, // early is rightward across the bar
        poly: _resample(
          [
            { x: 0.34, y: 0.28 },
            { x: 0.62, y: 0.28 }, // bar portion
            { x: 0.56, y: 0.32 },
            { x: 0.5, y: 0.46 },
            { x: 0.44, y: 0.8 }, // curve down-left
          ],
          56,
        ),
        rules: {
          bandY: 0.28,
          tolY: 0.08,
          finalHeadingAxis: { x: -1, y: 1 },
          maxAxisAngleDeg: 40,
          minLen: 0.36,
        },
      },
    ],
  };

  // --- TO (と) ---
  var T_TO = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short vertical tick
        startAOI: { cx: 0.58, cy: 0.2, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.58, cy: 0.32, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.58, y: 0.2 }, { x: 0.58, y: 0.32 }),
      },
      {
        // 2) curved stroke with hook
        startAOI: { cx: 0.46, cy: 0.32, rx: 0.12, ry: 0.12 },
        endAOI: { cx: 0.7, cy: 0.76, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.8 },
        poly: _resample(
          [
            { x: 0.46, y: 0.32 },
            { x: 0.4, y: 0.46 },
            { x: 0.48, y: 0.56 },
            { x: 0.62, y: 0.6 },
            { x: 0.58, y: 0.56 },
            { x: 0.52, y: 0.62 }, // small hook suggestion
            { x: 0.7, y: 0.76 },
          ],
          64,
        ),
        rules: {
          finalHeadingAxis: { x: 1, y: 0.4 },
          maxAxisAngleDeg: 45,
          minLen: 0.36,
        },
      },
    ],
  };

  // --- NA (な) ---
  var T_NA = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) left vertical (short)
        startAOI: { cx: 0.3, cy: 0.22, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.3, cy: 0.56, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.3, y: 0.22 }, { x: 0.3, y: 0.56 }),
      },
      {
        // 2) main: small rightward bar then down with loop and short tail
        startAOI: { cx: 0.4, cy: 0.3, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.62, cy: 0.82, rx: 0.12, ry: 0.12 },
        dir: { ux: 1, uy: 0.2, minDot: 0.8 }, // early small rightward motion
        poly: _resample(
          [
            { x: 0.4, y: 0.3 },
            { x: 0.58, y: 0.3 }, // small bar
            { x: 0.52, y: 0.36 },
            { x: 0.44, y: 0.52 },
            { x: 0.48, y: 0.62 }, // curve down
            { x: 0.56, y: 0.62 },
            { x: 0.52, y: 0.56 },
            { x: 0.48, y: 0.62 }, // loop region (tight)
            { x: 0.58, y: 0.74 },
            { x: 0.62, y: 0.82 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.02,
            areaMax: 0.08,
            cxMin: 0.46,
            cxMax: 0.58,
            cyMin: 0.52,
            cyMax: 0.66,
          },
          finalHeadingAxis: { x: 1, y: 0.4 },
          maxAxisAngleDeg: 45,
          minLen: 0.4,
        },
      },
    ],
  };

  // --- NI (に) ---
  var T_NI = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) left vertical
        startAOI: { cx: 0.3, cy: 0.2, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.3, cy: 0.78, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.3, y: 0.2 }, { x: 0.3, y: 0.78 }),
      },
      {
        // 2) long rightward bar with slight downward tail
        startAOI: { cx: 0.38, cy: 0.4, rx: 0.11, ry: 0.09 },
        endAOI: { cx: 0.76, cy: 0.58, rx: 0.12, ry: 0.12 },
        dir: { ux: 1, uy: 0.1, minDot: 0.9 }, // mainly rightward
        poly: _resample(
          [
            { x: 0.38, y: 0.4 },
            { x: 0.62, y: 0.4 },
            { x: 0.74, y: 0.42 },
            { x: 0.76, y: 0.5 },
            { x: 0.76, y: 0.58 },
          ],
          56,
        ),
        rules: {
          bandY: 0.4,
          tolY: 0.1,
          finalHeadingAxis: { x: 0.8, y: 0.4 },
          maxAxisAngleDeg: 45,
          minLen: 0.36,
        },
      },
    ],
  };

  // --- NU (ぬ) ---
  var T_NU = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short vertical tick (left)
        startAOI: { cx: 0.34, cy: 0.22, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.34, cy: 0.36, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.34, y: 0.22 }, { x: 0.34, y: 0.36 }),
      },
      {
        // 2) main curve with loop and rightward tail (NE -> SW bend -> SE)
        startAOI: { cx: 0.6, cy: 0.28, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.66, cy: 0.82, rx: 0.12, ry: 0.12 },
        dir: { ux: -1, uy: 1, minDot: 0.85 }, // early down-left
        poly: _resample(
          [
            { x: 0.6, y: 0.28 },
            { x: 0.54, y: 0.34 },
            { x: 0.48, y: 0.46 },
            { x: 0.44, y: 0.56 },
            { x: 0.5, y: 0.62 },
            { x: 0.56, y: 0.6 }, // loop area
            { x: 0.5, y: 0.62 },
            { x: 0.58, y: 0.72 },
            { x: 0.66, y: 0.82 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.02,
            areaMax: 0.08,
            cxMin: 0.46,
            cxMax: 0.56,
            cyMin: 0.54,
            cyMax: 0.64,
          },
          finalHeadingAxis: { x: 1, y: 0.3 },
          maxAxisAngleDeg: 40,
          minLen: 0.4,
        },
      },
    ],
  };

  // --- NE (ね) ---
  var T_NE = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) left vertical
        startAOI: { cx: 0.3, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.3, cy: 0.78, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.3, y: 0.18 }, { x: 0.3, y: 0.78 }),
      },
      {
        // 2) main curve with loop (crossing near center) and short tail
        startAOI: { cx: 0.56, cy: 0.28, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.6, cy: 0.74, rx: 0.11, ry: 0.11 },
        dir: { ux: -1, uy: 1, minDot: 0.85 }, // early down-left
        poly: _resample(
          [
            { x: 0.56, y: 0.28 },
            { x: 0.5, y: 0.34 },
            { x: 0.44, y: 0.48 }, // towards left bar
            { x: 0.42, y: 0.56 },
            { x: 0.48, y: 0.6 },
            { x: 0.54, y: 0.58 }, // loop near the bar
            { x: 0.48, y: 0.6 },
            { x: 0.56, y: 0.68 },
            { x: 0.6, y: 0.74 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.02,
            areaMax: 0.08,
            cxMin: 0.44,
            cxMax: 0.52,
            cyMin: 0.52,
            cyMax: 0.62,
          },
          finalHeadingAxis: { x: 1, y: 0.3 },
          maxAxisAngleDeg: 45,
          minLen: 0.38,
        },
      },
    ],
  };

  // --- NO (の) ---
  var T_NO = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) single counterclockwise loop with descending finish
        startAOI: { cx: 0.5, cy: 0.28, rx: 0.12, ry: 0.12 },
        endAOI: { cx: 0.58, cy: 0.72, rx: 0.12, ry: 0.12 },
        dir: { ux: 1, uy: 0.3, minDot: 0.8 }, // early drift right/down
        poly: _resample(
          [
            { x: 0.46, y: 0.3 },
            { x: 0.58, y: 0.3 },
            { x: 0.66, y: 0.4 }, // top-right
            { x: 0.64, y: 0.54 },
            { x: 0.54, y: 0.62 },
            { x: 0.46, y: 0.52 }, // left side of loop
            { x: 0.5, y: 0.44 },
            { x: 0.58, y: 0.46 },
            { x: 0.58, y: 0.72 }, // close and descend
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.03,
            areaMax: 0.12,
            cxMin: 0.48,
            cxMax: 0.62,
            cyMin: 0.4,
            cyMax: 0.58,
          },
          finalHeadingAxis: { x: 1, y: 0.6 },
          maxAxisAngleDeg: 45,
          minLen: 0.36,
        },
      },
    ],
  };

  // --- HA (は) ---
  var T_HA = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) left vertical
        startAOI: { cx: 0.3, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.3, cy: 0.78, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.3, y: 0.18 }, { x: 0.3, y: 0.78 }),
      },
      {
        // 2) mid bar
        startAOI: { cx: 0.38, cy: 0.4, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.66, cy: 0.4, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.38, y: 0.4 }, { x: 0.66, y: 0.4 }),
        rules: { bandY: 0.4, tolY: 0.06 },
        tag: "midbar",
      },
      {
        // 3) right curve with small loop/tail
        startAOI: { cx: 0.54, cy: 0.34, rx: 0.12, ry: 0.12 },
        endAOI: { cx: 0.66, cy: 0.84, rx: 0.12, ry: 0.12 },
        // early motion tends down-left before turning down-right
        dir: { ux: -1, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.56, y: 0.34 },
            { x: 0.5, y: 0.42 },
            { x: 0.46, y: 0.54 },
            { x: 0.52, y: 0.6 },
            { x: 0.58, y: 0.58 }, // loop vicinity
            { x: 0.52, y: 0.6 },
            { x: 0.6, y: 0.72 },
            { x: 0.66, y: 0.84 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.02,
            areaMax: 0.08,
            cxMin: 0.5,
            cxMax: 0.58,
            cyMin: 0.54,
            cyMax: 0.64,
          },
          finalHeadingAxis: { x: 1, y: 0.4 },
          maxAxisAngleDeg: 45,
          minLen: 0.36,
          // encourage crossing near the bar without requiring a strict intersect
        },
      },
    ],
  };

  // --- HI (ひ) ---
  var T_HI = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) single flowing curve NE→SW→SE (no separate bar)
        startAOI: { cx: 0.64, cy: 0.24, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.66, cy: 0.8, rx: 0.12, ry: 0.12 },
        dir: { ux: -1, uy: 1, minDot: 0.85 }, // early down-left
        poly: _resample(
          [
            { x: 0.64, y: 0.24 },
            { x: 0.58, y: 0.32 },
            { x: 0.5, y: 0.46 },
            { x: 0.46, y: 0.56 },
            { x: 0.52, y: 0.64 },
            { x: 0.6, y: 0.7 },
            { x: 0.66, y: 0.8 },
          ],
          56,
        ),
        rules: {
          finalHeadingAxis: { x: 1, y: 0.4 },
          maxAxisAngleDeg: 40,
          minLen: 0.34,
        },
      },
    ],
  };

  // --- FU (ふ) ---
  var T_FU = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) small left dot
        startAOI: { cx: 0.44, cy: 0.3, rx: 0.08, ry: 0.08 },
        endAOI: { cx: 0.46, cy: 0.36, rx: 0.08, ry: 0.08 },
        dir: { ux: 0.2, uy: 1, minDot: 0.75 },
        poly: _resample(
          [
            { x: 0.44, y: 0.3 },
            { x: 0.46, y: 0.36 },
          ],
          18,
        ),
        rules: { minLen: 0.08 },
      },
      {
        // 2) small right dot
        startAOI: { cx: 0.58, cy: 0.28, rx: 0.08, ry: 0.08 },
        endAOI: { cx: 0.6, cy: 0.34, rx: 0.08, ry: 0.08 },
        dir: { ux: 0.2, uy: 1, minDot: 0.75 },
        poly: _resample(
          [
            { x: 0.58, y: 0.28 },
            { x: 0.6, y: 0.34 },
          ],
          18,
        ),
        rules: { minLen: 0.08 },
      },
      {
        // 3) long sweeping curve with loop and descending tail
        startAOI: { cx: 0.52, cy: 0.36, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.68, cy: 0.84, rx: 0.12, ry: 0.12 },
        dir: { ux: -1, uy: 1, minDot: 0.85 }, // starts down-left then turns
        poly: _resample(
          [
            { x: 0.52, y: 0.36 },
            { x: 0.46, y: 0.44 },
            { x: 0.42, y: 0.56 },
            { x: 0.48, y: 0.62 },
            { x: 0.54, y: 0.6 },
            { x: 0.48, y: 0.62 }, // small loop
            { x: 0.58, y: 0.72 },
            { x: 0.68, y: 0.84 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.015,
            areaMax: 0.06,
            cxMin: 0.46,
            cxMax: 0.54,
            cyMin: 0.56,
            cyMax: 0.64,
          },
          finalHeadingAxis: { x: 1, y: 0.5 },
          maxAxisAngleDeg: 45,
          minLen: 0.4,
        },
      },
    ],
  };

  // --- HE (へ) ---
  // REPLACE T_HE with this: start NE, then descend to SE
  var T_HE = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // Start lower-left, rise up-right to a peak, then descend down-right
        startAOI: { cx: 0.3, cy: 0.44, rx: 0.11, ry: 0.11 }, // lower-left start
        endAOI: { cx: 0.76, cy: 0.62, rx: 0.11, ry: 0.11 }, // lower-right end

        // Early heading: NE (up-right). y is downwards, so uy must be negative.
        dir: { ux: 1, uy: -1, minDot: 0.85 },

        // Polyline: lift to a peak, then sweep down-right
        poly: _resample(
          [
            { x: 0.3, y: 0.44 }, // start
            { x: 0.46, y: 0.3 }, // rise (NE)
            { x: 0.58, y: 0.38 }, // pass the peak, begin turning
            { x: 0.76, y: 0.62 }, // descend (SE)
          ],
          48,
        ),

        // Final heading must be SE (down-right)
        rules: {
          finalHeadingAxis: { x: 1, y: 1 },
          maxAxisAngleDeg: 40,
          minLen: 0.3,
        },
      },
    ],
  };

  // --- HO (ほ) ---
  var T_HO = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) left vertical
        startAOI: { cx: 0.3, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.3, cy: 0.8, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.3, y: 0.18 }, { x: 0.3, y: 0.8 }),
      },
      {
        // 2) top bar
        startAOI: { cx: 0.38, cy: 0.28, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.72, cy: 0.28, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.38, y: 0.28 }, { x: 0.72, y: 0.28 }),
        rules: { bandY: 0.28, tolY: 0.06 },
      },
      {
        // 3) mid bar
        startAOI: { cx: 0.38, cy: 0.46, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.72, cy: 0.46, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.38, y: 0.46 }, { x: 0.72, y: 0.46 }),
        rules: { bandY: 0.46, tolY: 0.06 },
        tag: "midbar",
      },
      {
        // 4) right component: vertical + loop/tail in one flow
        startAOI: { cx: 0.56, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.66, cy: 0.86, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.85 }, // begins downward
        poly: _resample(
          [
            { x: 0.56, y: 0.18 },
            { x: 0.56, y: 0.44 },
            { x: 0.6, y: 0.58 },
            { x: 0.62, y: 0.6 },
            { x: 0.58, y: 0.56 },
            { x: 0.54, y: 0.62 }, // small loop near bars
            { x: 0.66, y: 0.86 },
          ],
          64,
        ),
        rules: {
          mustIntersectMidbar: true,
          loop: {
            areaMin: 0.015,
            areaMax: 0.06,
            cxMin: 0.54,
            cxMax: 0.62,
            cyMin: 0.54,
            cyMax: 0.64,
          },
          finalHeadingAxis: { x: 1, y: 0.5 },
          maxAxisAngleDeg: 45,
          minLen: 0.4,
        },
      },
    ],
  };

  // --- MA (ま) --- (structure similar to ほ: left vertical, top bar, mid bar, right loop)
  var T_MA = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) left vertical
        startAOI: { cx: 0.3, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.3, cy: 0.8, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.3, y: 0.18 }, { x: 0.3, y: 0.8 }),
      },
      {
        // 2) top bar
        startAOI: { cx: 0.38, cy: 0.28, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.72, cy: 0.28, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.38, y: 0.28 }, { x: 0.72, y: 0.28 }),
        rules: { bandY: 0.28, tolY: 0.06 },
      },
      {
        // 3) mid bar
        startAOI: { cx: 0.38, cy: 0.46, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.72, cy: 0.46, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.38, y: 0.46 }, { x: 0.72, y: 0.46 }),
        rules: { bandY: 0.46, tolY: 0.06 },
        tag: "midbar",
      },
      {
        // 4) right component: vertical + loop/tail (should cross mid bar)
        startAOI: { cx: 0.56, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.66, cy: 0.86, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.56, y: 0.18 },
            { x: 0.56, y: 0.44 },
            { x: 0.6, y: 0.58 },
            { x: 0.62, y: 0.6 },
            { x: 0.58, y: 0.56 },
            { x: 0.54, y: 0.62 }, // small loop near bars
            { x: 0.66, y: 0.86 },
          ],
          64,
        ),
        rules: {
          mustIntersectMidbar: true,
          loop: {
            areaMin: 0.015,
            areaMax: 0.06,
            cxMin: 0.54,
            cxMax: 0.62,
            cyMin: 0.54,
            cyMax: 0.64,
          },
          finalHeadingAxis: { x: 1, y: 0.5 },
          maxAxisAngleDeg: 45,
          minLen: 0.4,
        },
      },
    ],
  };

  // --- MI (み) --- (two flowing strokes; second has a small loop and tail)
  var T_MI = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short opening curve (down-left bias)
        startAOI: { cx: 0.62, cy: 0.26, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.52, cy: 0.4, rx: 0.1, ry: 0.1 },
        dir: { ux: -1, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.62, y: 0.26 },
            { x: 0.56, y: 0.32 },
            { x: 0.52, y: 0.4 },
          ],
          28,
        ),
        rules: { minLen: 0.14 },
      },
      {
        // 2) main descending curve with small loop then tail
        startAOI: { cx: 0.52, cy: 0.4, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.68, cy: 0.84, rx: 0.12, ry: 0.12 },
        dir: { ux: -1, uy: 1, minDot: 0.85 }, // early down-left, then turns down-right
        poly: _resample(
          [
            { x: 0.52, y: 0.4 },
            { x: 0.46, y: 0.5 },
            { x: 0.48, y: 0.6 },
            { x: 0.54, y: 0.6 },
            { x: 0.5, y: 0.56 },
            { x: 0.48, y: 0.6 }, // loop area
            { x: 0.58, y: 0.72 },
            { x: 0.68, y: 0.84 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.015,
            areaMax: 0.06,
            cxMin: 0.48,
            cxMax: 0.54,
            cyMin: 0.54,
            cyMax: 0.62,
          },
          finalHeadingAxis: { x: 1, y: 0.5 },
          maxAxisAngleDeg: 45,
          minLen: 0.38,
        },
      },
    ],
  };

  // --- MU (む) --- (two strokes: short tick, then big loop+tail)
  var T_MU = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short vertical tick (left)
        startAOI: { cx: 0.36, cy: 0.22, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.36, cy: 0.34, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.36, y: 0.22 }, { x: 0.36, y: 0.34 }),
      },
      {
        // 2) main looped stroke with descending rightward tail
        startAOI: { cx: 0.56, cy: 0.3, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.68, cy: 0.84, rx: 0.12, ry: 0.12 },
        dir: { ux: -1, uy: 1, minDot: 0.85 }, // early down-left, then turn
        poly: _resample(
          [
            { x: 0.56, y: 0.3 },
            { x: 0.5, y: 0.38 },
            { x: 0.44, y: 0.52 },
            { x: 0.46, y: 0.62 },
            { x: 0.54, y: 0.6 },
            { x: 0.48, y: 0.62 }, // loop region
            { x: 0.58, y: 0.72 },
            { x: 0.68, y: 0.84 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.02,
            areaMax: 0.08,
            cxMin: 0.46,
            cxMax: 0.54,
            cyMin: 0.56,
            cyMax: 0.64,
          },
          finalHeadingAxis: { x: 1, y: 0.5 },
          maxAxisAngleDeg: 45,
          minLen: 0.4,
        },
      },
    ],
  };

  // --- ME (め) --- (two strokes: short diagonal, then long looped curve)
  var T_ME = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short diagonal tick (down-right)
        startAOI: { cx: 0.44, cy: 0.3, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.56, cy: 0.38, rx: 0.1, ry: 0.1 },
        dir: { ux: 1, uy: 0.4, minDot: 0.8 },
        poly: _resample(
          [
            { x: 0.44, y: 0.3 },
            { x: 0.56, y: 0.38 },
          ],
          24,
        ),
        rules: { minLen: 0.14 },
      },
      {
        // 2) main curve with loop and descending tail
        startAOI: { cx: 0.52, cy: 0.38, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.68, cy: 0.84, rx: 0.12, ry: 0.12 },
        dir: { ux: -1, uy: 1, minDot: 0.85 }, // early down-left, then down-right
        poly: _resample(
          [
            { x: 0.52, y: 0.38 },
            { x: 0.46, y: 0.5 },
            { x: 0.5, y: 0.6 },
            { x: 0.56, y: 0.6 },
            { x: 0.52, y: 0.56 },
            { x: 0.5, y: 0.6 }, // loop
            { x: 0.6, y: 0.72 },
            { x: 0.68, y: 0.84 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.015,
            areaMax: 0.06,
            cxMin: 0.5,
            cxMax: 0.56,
            cyMin: 0.54,
            cyMax: 0.62,
          },
          finalHeadingAxis: { x: 1, y: 0.5 },
          maxAxisAngleDeg: 45,
          minLen: 0.38,
        },
      },
    ],
  };

  // --- MO (も) --- (three strokes: top bar, mid bar, right curve crossing bars)
  var T_MO = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) top bar
        startAOI: { cx: 0.38, cy: 0.28, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.72, cy: 0.28, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.38, y: 0.28 }, { x: 0.72, y: 0.28 }),
        rules: { bandY: 0.28, tolY: 0.06 },
      },
      {
        // 2) mid bar
        startAOI: { cx: 0.38, cy: 0.46, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.72, cy: 0.46, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.38, y: 0.46 }, { x: 0.72, y: 0.46 }),
        rules: { bandY: 0.46, tolY: 0.06 },
        tag: "midbar",
      },
      {
        // 3) right curved component (should cross the mid bar)
        startAOI: { cx: 0.56, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.68, cy: 0.86, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.56, y: 0.18 },
            { x: 0.56, y: 0.44 },
            { x: 0.6, y: 0.58 },
            { x: 0.62, y: 0.6 },
            { x: 0.58, y: 0.56 },
            { x: 0.54, y: 0.62 }, // small loop/hook
            { x: 0.68, y: 0.86 },
          ],
          64,
        ),
        rules: {
          mustIntersectMidbar: true,
          loop: {
            areaMin: 0.012,
            areaMax: 0.06,
            cxMin: 0.54,
            cxMax: 0.62,
            cyMin: 0.54,
            cyMax: 0.64,
          },
          finalHeadingAxis: { x: 1, y: 0.5 },
          maxAxisAngleDeg: 45,
          minLen: 0.38,
        },
      },
    ],
  };

  // --- YA (や) ---
  var T_YA = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short left vertical
        startAOI: { cx: 0.3, cy: 0.22, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.3, cy: 0.56, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.3, y: 0.22 }, { x: 0.3, y: 0.56 }),
      },
      {
        // 2) main curve: NE→SW bend → SE tail (small loop permitted)
        startAOI: { cx: 0.6, cy: 0.28, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.68, cy: 0.84, rx: 0.12, ry: 0.12 },
        dir: { ux: -1, uy: 1, minDot: 0.85 }, // early down-left, then turns down-right
        poly: _resample(
          [
            { x: 0.6, y: 0.28 },
            { x: 0.54, y: 0.36 },
            { x: 0.48, y: 0.5 },
            { x: 0.5, y: 0.6 },
            { x: 0.56, y: 0.6 },
            { x: 0.5, y: 0.6 }, // small loop region
            { x: 0.6, y: 0.72 },
            { x: 0.68, y: 0.84 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.015,
            areaMax: 0.06,
            cxMin: 0.5,
            cxMax: 0.56,
            cyMin: 0.56,
            cyMax: 0.64,
          },
          finalHeadingAxis: { x: 1, y: 0.45 },
          maxAxisAngleDeg: 45,
          minLen: 0.38,
        },
      },
    ],
  };

  // --- YU (ゆ) ---
  var T_YU = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short vertical tick (left)
        startAOI: { cx: 0.36, cy: 0.22, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.36, cy: 0.34, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.36, y: 0.22 }, { x: 0.36, y: 0.34 }),
      },
      {
        // 2) big looped curve with descending tail
        startAOI: { cx: 0.56, cy: 0.3, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.7, cy: 0.84, rx: 0.12, ry: 0.12 },
        dir: { ux: -1, uy: 1, minDot: 0.85 }, // early down-left, then down-right
        poly: _resample(
          [
            { x: 0.56, y: 0.3 },
            { x: 0.5, y: 0.38 },
            { x: 0.44, y: 0.52 },
            { x: 0.48, y: 0.62 },
            { x: 0.56, y: 0.62 },
            { x: 0.5, y: 0.62 }, // loop
            { x: 0.6, y: 0.74 },
            { x: 0.7, y: 0.84 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.02,
            areaMax: 0.09,
            cxMin: 0.48,
            cxMax: 0.56,
            cyMin: 0.56,
            cyMax: 0.66,
          },
          finalHeadingAxis: { x: 1, y: 0.5 },
          maxAxisAngleDeg: 45,
          minLen: 0.4,
        },
      },
    ],
  };

  // --- YO (よ) ---
  var T_YO = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) top curve (rightward then down) — no loop
        startAOI: { cx: 0.4, cy: 0.28, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.62, cy: 0.46, rx: 0.11, ry: 0.11 },
        dir: { ux: 1, uy: 0.2, minDot: 0.85 }, // early rightward
        poly: _resample(
          [
            { x: 0.4, y: 0.28 },
            { x: 0.56, y: 0.28 },
            { x: 0.62, y: 0.34 },
            { x: 0.62, y: 0.46 },
          ],
          40,
        ),
        rules: { bandY: 0.28, tolY: 0.1, minLen: 0.24 },
      },
      {
        // 2) right vertical down with slight tail
        startAOI: { cx: 0.62, cy: 0.22, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.64, cy: 0.82, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.88 },
        poly: _resample(
          [
            { x: 0.62, y: 0.22 },
            { x: 0.62, y: 0.54 },
            { x: 0.64, y: 0.82 },
          ],
          48,
        ),
        rules: {
          finalHeadingAxis: { x: 0.6, y: 1 },
          maxAxisAngleDeg: 40,
          minLen: 0.34,
        },
      },
    ],
  };

  // --- RA (ら) --- (two strokes: short opener, then main curve with a tiny loop + tail)
  var T_RA = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short opening tick (down-left bias)
        startAOI: { cx: 0.6, cy: 0.26, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.52, cy: 0.38, rx: 0.1, ry: 0.1 },
        dir: { ux: -1, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.6, y: 0.26 },
            { x: 0.56, y: 0.32 },
            { x: 0.52, y: 0.38 },
          ],
          24,
        ),
        rules: { minLen: 0.12 },
      },
      {
        // 2) main descending curve; small loop then SE tail
        startAOI: { cx: 0.52, cy: 0.38, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.68, cy: 0.84, rx: 0.12, ry: 0.12 },
        dir: { ux: -1, uy: 1, minDot: 0.85 }, // early down-left then down-right
        poly: _resample(
          [
            { x: 0.52, y: 0.38 },
            { x: 0.46, y: 0.5 },
            { x: 0.48, y: 0.6 },
            { x: 0.54, y: 0.6 },
            { x: 0.5, y: 0.56 },
            { x: 0.48, y: 0.6 }, // small loop area
            { x: 0.58, y: 0.72 },
            { x: 0.68, y: 0.84 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.012,
            areaMax: 0.06,
            cxMin: 0.48,
            cxMax: 0.54,
            cyMin: 0.54,
            cyMax: 0.62,
          },
          finalHeadingAxis: { x: 1, y: 0.45 },
          maxAxisAngleDeg: 45,
          minLen: 0.36,
        },
      },
    ],
  };

  // --- RI (り) --- (two strokes: short left tick, then long curve without loop)
  var T_RI = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short vertical-ish tick
        startAOI: { cx: 0.44, cy: 0.24, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.44, cy: 0.36, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.44, y: 0.24 }, { x: 0.44, y: 0.36 }),
      },
      {
        // 2) long descending curve (no loop) with rightward tail
        startAOI: { cx: 0.56, cy: 0.3, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.68, cy: 0.84, rx: 0.12, ry: 0.12 },
        dir: { ux: -1, uy: 1, minDot: 0.85 }, // early down-left → turns down-right
        poly: _resample(
          [
            { x: 0.56, y: 0.3 },
            { x: 0.5, y: 0.4 },
            { x: 0.48, y: 0.54 },
            { x: 0.56, y: 0.64 },
            { x: 0.62, y: 0.74 },
            { x: 0.68, y: 0.84 },
          ],
          56,
        ),
        rules: {
          finalHeadingAxis: { x: 1, y: 0.5 },
          maxAxisAngleDeg: 40,
          minLen: 0.36,
        },
      },
    ],
  };

  // --- RU (る) --- (two strokes: short tick, then looped curve with tail)
  var T_RU = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short diagonal tick (down-right)
        startAOI: { cx: 0.44, cy: 0.28, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.56, cy: 0.36, rx: 0.1, ry: 0.1 },
        dir: { ux: 1, uy: 0.4, minDot: 0.82 },
        poly: _resample(
          [
            { x: 0.44, y: 0.28 },
            { x: 0.56, y: 0.36 },
          ],
          24,
        ),
        rules: { minLen: 0.12 },
      },
      {
        // 2) main curve with loop and descending rightward tail
        startAOI: { cx: 0.52, cy: 0.36, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.7, cy: 0.84, rx: 0.12, ry: 0.12 },
        dir: { ux: -1, uy: 1, minDot: 0.85 }, // NE→SW bend → SE tail
        poly: _resample(
          [
            { x: 0.52, y: 0.36 },
            { x: 0.46, y: 0.46 },
            { x: 0.48, y: 0.58 },
            { x: 0.54, y: 0.6 },
            { x: 0.5, y: 0.56 },
            { x: 0.48, y: 0.6 }, // loop region
            { x: 0.6, y: 0.72 },
            { x: 0.7, y: 0.84 },
          ],
          64,
        ),
        rules: {
          loop: {
            areaMin: 0.015,
            areaMax: 0.06,
            cxMin: 0.5,
            cxMax: 0.56,
            cyMin: 0.54,
            cyMax: 0.62,
          },
          finalHeadingAxis: { x: 1, y: 0.5 },
          maxAxisAngleDeg: 45,
          minLen: 0.38,
        },
      },
    ],
  };

  // --- RE (れ) --- (two strokes: left vertical, then sweeping curve crossing it; no loop)
  var T_RE = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) left vertical (use as crossing reference)
        startAOI: { cx: 0.3, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.3, cy: 0.78, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.3, y: 0.18 }, { x: 0.3, y: 0.78 }),
        tag: "midbar", // reuse crossing logic
      },
      {
        // 2) right curve that crosses the vertical around mid-height; no loop
        startAOI: { cx: 0.58, cy: 0.3, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.68, cy: 0.82, rx: 0.12, ry: 0.12 },
        dir: { ux: -1, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.58, y: 0.3 },
            { x: 0.5, y: 0.4 },
            { x: 0.44, y: 0.52 }, // approach/cross near the bar
            { x: 0.52, y: 0.62 },
            { x: 0.6, y: 0.72 },
            { x: 0.68, y: 0.82 },
          ],
          60,
        ),
        rules: {
          mustIntersectMidbar: true, // ensure it crosses the vertical
          finalHeadingAxis: { x: 1, y: 0.5 },
          maxAxisAngleDeg: 45,
          minLen: 0.36,
        },
      },
    ],
  };

  // --- RO (ろ) --- (two strokes: top bar, then curved stroke with hook; no loop)
  var T_RO = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short top bar
        startAOI: { cx: 0.4, cy: 0.28, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.7, cy: 0.28, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.4, y: 0.28 }, { x: 0.7, y: 0.28 }),
        rules: { bandY: 0.28, tolY: 0.06 },
      },
      {
        // 2) main curve: rightward, then down, slight left hook near bottom (no closed loop)
        startAOI: { cx: 0.6, cy: 0.3, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.64, cy: 0.82, rx: 0.12, ry: 0.12 },
        dir: { ux: 1, uy: 0.2, minDot: 0.85 }, // early rightward
        poly: _resample(
          [
            { x: 0.6, y: 0.3 },
            { x: 0.66, y: 0.34 },
            { x: 0.66, y: 0.52 },
            { x: 0.64, y: 0.64 },
            { x: 0.6, y: 0.68 },
            { x: 0.64, y: 0.82 }, // tiny hook feel
          ],
          56,
        ),
        rules: {
          finalHeadingAxis: { x: 0.6, y: 1 },
          maxAxisAngleDeg: 42,
          minLen: 0.34,
        },
      },
    ],
  };

  // --- WA (わ) ---
  var T_WA = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) left vertical
        startAOI: { cx: 0.3, cy: 0.18, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.3, cy: 0.78, rx: 0.1, ry: 0.1 },
        dir: { ux: 0, uy: 1, minDot: 0.9 },
        poly: _line({ x: 0.3, y: 0.18 }, { x: 0.3, y: 0.78 }),
        tag: "midbar", // use as crossing reference
      },
      {
        // 2) big crossing curve with loop and descending tail
        startAOI: { cx: 0.56, cy: 0.3, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.68, cy: 0.84, rx: 0.12, ry: 0.12 },
        // early approach trends down-left toward the vertical, then turns down-right
        dir: { ux: -1, uy: 1, minDot: 0.85 },
        poly: _resample(
          [
            { x: 0.56, y: 0.3 },
            { x: 0.5, y: 0.4 },
            { x: 0.44, y: 0.52 }, // approach/cross near the vertical
            { x: 0.52, y: 0.62 },
            { x: 0.58, y: 0.6 },
            { x: 0.52, y: 0.62 }, // small loop region on right
            { x: 0.6, y: 0.74 },
            { x: 0.68, y: 0.84 },
          ],
          64,
        ),
        rules: {
          mustIntersectMidbar: true,
          loop: {
            areaMin: 0.018,
            areaMax: 0.07,
            cxMin: 0.5,
            cxMax: 0.58,
            cyMin: 0.54,
            cyMax: 0.64,
          },
          finalHeadingAxis: { x: 1, y: 0.5 },
          maxAxisAngleDeg: 45,
          minLen: 0.4,
        },
      },
    ],
  };

  // --- WO / O-particle (を) ---
  var T_WO = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) short slant down-left at upper-left
        startAOI: { cx: 0.42, cy: 0.26, rx: 0.1, ry: 0.1 },
        endAOI: { cx: 0.52, cy: 0.34, rx: 0.1, ry: 0.1 },
        dir: { ux: -1, uy: 1, minDot: 0.82 },
        poly: _resample(
          [
            { x: 0.52, y: 0.26 },
            { x: 0.44, y: 0.34 },
          ],
          24,
        ),
        rules: { minLen: 0.12 },
      },
      {
        // 2) short mid bar to the right
        startAOI: { cx: 0.52, cy: 0.36, rx: 0.1, ry: 0.08 },
        endAOI: { cx: 0.7, cy: 0.36, rx: 0.1, ry: 0.08 },
        dir: { ux: 1, uy: 0, minDot: 0.9 },
        poly: _line({ x: 0.52, y: 0.36 }, { x: 0.7, y: 0.36 }),
        rules: { bandY: 0.36, tolY: 0.06 },
      },
      {
        // 3) sweeping curve (comma-like) — no closed loop
        startAOI: { cx: 0.56, cy: 0.4, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.68, cy: 0.84, rx: 0.12, ry: 0.12 },
        dir: { ux: 0, uy: 1, minDot: 0.82 }, // begins downward, then bends SE
        poly: _resample(
          [
            { x: 0.56, y: 0.4 },
            { x: 0.52, y: 0.52 },
            { x: 0.56, y: 0.62 },
            { x: 0.62, y: 0.7 },
            { x: 0.68, y: 0.84 },
          ],
          56,
        ),
        rules: {
          finalHeadingAxis: { x: 1, y: 0.55 },
          maxAxisAngleDeg: 45,
          minLen: 0.34,
        },
      },
    ],
  };

  // --- N (ん) ---
  var T_N = {
    weights: DEFAULT_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    strokes: [
      {
        // 1) single stroke: down-left, then flick/curve to the right (no loop)
        startAOI: { cx: 0.6, cy: 0.24, rx: 0.11, ry: 0.11 },
        endAOI: { cx: 0.66, cy: 0.74, rx: 0.12, ry: 0.12 },
        dir: { ux: -1, uy: 1, minDot: 0.85 }, // early motion down-left
        poly: _resample(
          [
            { x: 0.6, y: 0.24 },
            { x: 0.52, y: 0.36 },
            { x: 0.46, y: 0.52 }, // descend leftward
            { x: 0.52, y: 0.58 },
            { x: 0.6, y: 0.62 },
            { x: 0.66, y: 0.74 }, // flick/curve out to the right
          ],
          56,
        ),
        // tail should angle to the right (slightly up-right feel)
        rules: {
          finalHeadingAxis: { x: 1, y: 0.2 },
          maxAxisAngleDeg: 45,
          minLen: 0.32,
        },
      },
    ],
  };

  var HIRAGANA_TEMPLATES = {
    あ: T_A,
    い: T_I,
    う: T_U,
    え: T_E,
    お: T_O,
    か: T_KA,
    き: T_KI,
    く: T_KU,
    け: T_KE,
    こ: T_KO,
    さ: T_SA,
    し: T_SHI,
    す: T_SU,
    せ: T_SE,
    そ: T_SO,
    た: T_TA,
    ち: T_CHI,
    つ: T_TSU,
    て: T_TE,
    と: T_TO,
    な: T_NA,
    に: T_NI,
    ぬ: T_NU,
    ね: T_NE,
    の: T_NO,
    は: T_HA,
    ひ: T_HI,
    ふ: T_FU,
    へ: T_HE,
    ほ: T_HO,
    ま: T_MA,
    み: T_MI,
    む: T_MU,
    め: T_ME,
    も: T_MO,
    や: T_YA,
    ゆ: T_YU,
    よ: T_YO,
    ら: T_RA,
    り: T_RI,
    る: T_RU,
    れ: T_RE,
    ろ: T_RO,
    わ: T_WA,
    を: T_WO,
    ん: T_N,
  };

  var HIRAGANA_LIST_AIUEO = ["あ", "い", "う", "え", "お"];

  // expose globals
  window.DEFAULT_WEIGHTS = DEFAULT_WEIGHTS;
  window.DEFAULT_THRESHOLDS = DEFAULT_THRESHOLDS;
  window.HIRAGANA_TEMPLATES = HIRAGANA_TEMPLATES;
  window.HIRAGANA_LIST_AIUEO = HIRAGANA_LIST_AIUEO;
})();
