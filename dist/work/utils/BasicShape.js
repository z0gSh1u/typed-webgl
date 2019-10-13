// Generate some basic shapes like circle, oval and straight line.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Generate a straight line segment. (2d)
     */
    function generateStraightLineSegment(startPoint, endPoint, howManyPoints) {
        if (howManyPoints === void 0) { howManyPoints = 100; }
        // y = kx + b
        var k = (endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0]), b = endPoint[1] - k * endPoint[0];
        var fn = function (x) { return k * x + b; };
        var step = Math.abs(startPoint[0] - endPoint[0]) / howManyPoints;
        // if (step < 0.001 || step === NaN) {
        //   throw `[generateStraightLineSegment] Too many points for this line segment. step=${step}`
        // }
        var cx = startPoint[0], res = [];
        for (var i = 0; i < howManyPoints; i++) {
            res.push([cx, fn(cx)]);
            cx += step;
        }
        return res;
    }
    exports.generateStraightLineSegment = generateStraightLineSegment;
    /**
     * Generate a circle. (2d)
     * Please use `TRIANGLE_FAN` method to draw this.
     */
    function generateCircle(center, radius, howManyPoints) {
        if (howManyPoints === void 0) { howManyPoints = 360; }
        // 参数方程
        var theta = 0.0; // in DEG
        var step = 360 / howManyPoints;
        var res = [];
        for (var i = 0; i < howManyPoints; i++) {
            res.push([radius * Math.cos(radians(theta)) + center[0], radius * Math.sin(radians(theta)) + center[1]]);
            theta += step;
        }
        return res;
    }
    exports.generateCircle = generateCircle;
    /**
     * Generate a oval for (x/a)^2 + (y/b)^2 = 1. (2d)
     * Please use `TRIANGLE_FAN` method to draw this.
     */
    function generateOval(center, a, b, howManyPoints) {
        if (howManyPoints === void 0) { howManyPoints = 360; }
        // 参数方程
        var theta = 0.0; // in DEG
        var step = 360 / howManyPoints;
        var res = [];
        for (var i = 0; i < howManyPoints; i++) {
            res.push([a * Math.cos(radians(theta)) + center[0], b * Math.sin(radians(theta)) + center[1]]);
            theta += step;
        }
        return res;
    }
    exports.generateOval = generateOval;
});
// rect
