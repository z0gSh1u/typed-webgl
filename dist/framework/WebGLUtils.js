// WebGL Utilities.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define(["require", "exports", "../3rd-party/MV", "../3rd-party/initShaders"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Initialize viewport and set canvas to pure white.
     */
    function initializeCanvas(gl, canvasDOM, bgcRGBA) {
        if (bgcRGBA === void 0) { bgcRGBA = [1.0, 1.0, 1.0, 1.0]; }
        gl.viewport(0, 0, canvasDOM.width, canvasDOM.height);
        gl.clearColor.apply(gl, bgcRGBA); // pure white
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    exports.initializeCanvas = initializeCanvas;
    /**
     * Initialize two shaders and returns the WebGLProgram.
     */
    function initializeShaders(gl, vShaderPath, fShaderPath) {
        var program = initShaders(gl, vShaderPath, fShaderPath);
        gl.useProgram(program);
        return program;
    }
    exports.initializeShaders = initializeShaders;
    /**
     * Normalize 8-bit color (RGB / RGBA) to [0, 1]. If A is missing, use 1.0.
     */
    function normalize8bitColor(color8bit) {
        return __spreadArrays(color8bit.map(function (x) { return x / 255; }), [1.0]).slice(0, 4);
    }
    exports.normalize8bitColor = normalize8bitColor;
    /**
     * Get the distance between two points (2d).
     */
    function getDistance2d(pointA, pointB) {
        var dX2 = Math.pow(pointA[0] - pointB[0], 2);
        var dY2 = Math.pow(pointA[1] - pointB[1], 2);
        return Math.sqrt(dX2 + dY2);
    }
    exports.getDistance2d = getDistance2d;
    /**
     * Convert RAD to DEG.
     */
    function radToDeg(angle) {
        return angle * 57.32;
    }
    exports.radToDeg = radToDeg;
    /**
     * Generate scaling matrix.
     */
    function scaleMat(x, y, z) {
        return mat4(x, 0.0, 0.0, 0.0, 0.0, y, 0.0, 0.0, 0.0, 0.0, z, 0.0, 0.0, 0.0, 0.0, 1.0);
    }
    exports.scaleMat = scaleMat;
    /**
     * Load image async.
     */
    function loadImageAsync(urls) {
        return new Promise(function (resolve, reject) {
            var newImages = [], loadedImagesCount = 0, arr = (typeof urls != "object") ? [urls] : urls;
            function cb() {
                loadedImagesCount++;
                if (loadedImagesCount == arr.length) {
                    resolve(newImages);
                }
            }
            for (var i = 0; i < arr.length; i++) {
                newImages[i] = new Image();
                newImages[i].src = arr[i];
                newImages[i].onload = function () { cb(); };
                newImages[i].onerror = function () { reject(); };
            }
        });
    }
    exports.loadImageAsync = loadImageAsync;
    /**
     * Rotate by any axis. `angle` in DEG.
     */
    function rotateByAxis(v1, v2, angle) {
        var uvw = normalize(subtract(v2, v1), false);
        var u = uvw[0], v = uvw[1], w = uvw[2];
        var c = Math.cos(radians(angle)), s = Math.sin(radians(angle));
        var A = v1[0], B = v1[1], C = v1[2];
        var pow2 = function (x) { return x * x; };
        var a11 = pow2(u) + c * (pow2(v) + pow2(w)), a12 = u * v * (1 - c) - w * s, a13 = u * w * (1 - c) + v * s, a14 = (A * (pow2(v) + pow2(w)) - u * (B * v + C * w)) * (1 - c) + (B * w - C * v) * s;
        var a21 = u * v * (1 - c) + w * s, a22 = pow2(v) + c * (pow2(u) + pow2(w)), a23 = w * v * (1 - c) - u * s, a24 = (B * (pow2(u) + pow2(w)) - v * (A * u + C * w)) * (1 - c) + (C * u - A * w) * s;
        var a31 = a13 = u * w * (1 - c) - v * s, a32 = w * v * (1 - c) + u * s, a33 = pow2(w) + c * (pow2(u) + pow2(v)), a34 = (C * (pow2(u) + pow2(v)) - w * (A * u + B * v)) * (1 - c) + (A * v - B * u) * s;
        return mat4(a11, a12, a13, a14, a21, a22, a23, a24, a31, a32, a33, a34, 0, 0, 0, 1.0);
    }
    exports.rotateByAxis = rotateByAxis;
    /**
       * Get the point after rotating theta (DEG) to center.
       */
    function getRotatedPoint(canvasDOM, point, center, theta) {
        var row = canvasDOM.height, col = canvasDOM.width;
        var x1 = point[0], y1 = row - point[1], x2 = center[0], y2 = row - center[1];
        var rt = radians(theta);
        var x = (x1 - x2) * Math.cos(rt) - (y1 - y2) * Math.sin(rt) + x2;
        var y = (x1 - x2) * Math.sin(rt) + (y1 - y2) * Math.cos(rt) + y2;
        x = x;
        y = row - y;
        return [x, y];
    }
    exports.getRotatedPoint = getRotatedPoint;
    /**
     * Get the point after moving deltaX and deltaY
     */
    function getMovedPoint(point, delta) {
        // !!! same as getTurnedPoint
        if (point.length == 2) {
            var x = point[0] + delta[0];
            var y = point[1] + delta[1];
            return [x, y];
        }
        return point;
    }
    exports.getMovedPoint = getMovedPoint;
    /**
     * Mirror a point.
     */
    function getTurnedPoint(point, axis) {
        // !!! note that there might be something not point Vec2 in data (like Oval)
        if (point.length == 2) {
            var x = 2 * axis - point[0];
            var y = point[1];
            return [x, y];
        }
        return point;
    }
    exports.getTurnedPoint = getTurnedPoint;
    /**
     * Sync wait.
     */
    function waitSync(msPeriod) {
        return new Promise(function (resolve, reject) {
            window.setTimeout(function () { resolve(); }, msPeriod);
        });
    }
    exports.waitSync = waitSync;
    /**
     * My setTimeout with Promise.
     */
    function mySetTimeout(dowhat, howlong) {
        return new Promise(function (resolve, reject) {
            window.setTimeout(function () { dowhat(); resolve(); }, howlong);
        });
    }
    exports.mySetTimeout = mySetTimeout;
});
