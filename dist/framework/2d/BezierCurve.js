// Generate Bezier Curve (L3) using two end point and two control point.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Generate Lv3 2d Bezier Curve. Return points on the curve.
     */
    function generateBezierCurve2dL3(start, control1, control2, end, step) {
        if (step === void 0) { step = 0.01; }
        // P(t) = (1-t)^3P1 + 3t(1-t)^2P2 + 3t^2(1-t)P3 + t^3P4
        // t in [0,1]
        // P1->P2, P3->P4 cut the curve
        var t = 0.0, result = [];
        while (t <= 1) {
            var ts = 1 - t;
            var x = ts * ts * ts * start[0] + 3 * t * ts * ts * control1[0] + 3 * t * t * ts * control2[0] + t * t * t * end[0];
            var y = ts * ts * ts * start[1] + 3 * t * ts * ts * control1[1] + 3 * t * t * ts * control2[1] + t * t * t * end[1];
            result.push([x, y]);
            t += step;
        }
        return result;
    }
    exports.generateBezierCurve2dL3 = generateBezierCurve2dL3;
});
