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
define(["require", "exports", "../../3rd-party/MV", "../../3rd-party/initShaders"], function (require, exports) {
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
});
