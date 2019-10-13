// straight line
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
        if (step < 0.001 || step === NaN) {
            throw "[generateStraightLineSegment] Too many points for this line segment. step=" + step;
        }
        var cx = startPoint[0], res = [];
        for (var i = 0; i < howManyPoints; i++) {
            res.push([cx, fn(cx)]);
            cx += step;
        }
        return res;
    }
    exports.generateStraightLineSegment = generateStraightLineSegment;
});
// circle
// oval
