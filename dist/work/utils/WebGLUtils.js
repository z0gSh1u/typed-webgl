//  WebGL Utilities.
//  Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
//  for book `Interactive Computer Graphics` (7th Edition).
define(["require", "exports", "../../3rd-party/MV", "../../3rd-party/initShaders"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Initialize viewport and set canvas to pure white.
     */
    function initializeCanvas(gl, canvasDOM) {
        gl.viewport(0, 0, canvasDOM.width, canvasDOM.height);
        gl.clearColor(1.0, 1.0, 1.0, 1.0); // pure white
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
    function initializeBuffer(gl, bufferType) {
        if (bufferType === void 0) { bufferType = gl.ARRAY_BUFFER; }
        var buf = gl.createBuffer();
        gl.bindBuffer(bufferType, buf);
    }
    exports.initializeBuffer = initializeBuffer;
});
