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
    var WebGLHelper2d = /** @class */ (function () {
        function WebGLHelper2d(_canvasDOM, _gl, _program) {
            this.canvasDOM = _canvasDOM;
            this.gl = _gl;
            this.program = _program;
        }
        /**
         * Create a buffer.
         */
        WebGLHelper2d.prototype.createBuffer = function () {
            var buf = this.gl.createBuffer();
            return buf;
        };
        /**
         * Use a buffer as current buffer for `bufferType`.
         */
        WebGLHelper2d.prototype.useBuffer = function (buffer, bufferType) {
            if (bufferType === void 0) { bufferType = this.gl.ARRAY_BUFFER; }
            this.gl.bindBuffer(bufferType, buffer);
        };
        /**
         * Send data to buffer.
         */
        WebGLHelper2d.prototype.sendDataToBuffer = function (data, bufferType, drawMode) {
            if (bufferType === void 0) { bufferType = this.gl.ARRAY_BUFFER; }
            if (drawMode === void 0) { drawMode = this.gl.STATIC_DRAW; }
            this.gl.bufferData(bufferType, data, drawMode);
        };
        /**
         * Get attribute location in shader.
         */
        WebGLHelper2d.prototype.getAttributeLocation = function (variableName) {
            return this.gl.getAttribLocation(this.program, variableName);
        };
        /**
         * Fill attribute in shader using data in current buffer and enable it.
         */
        WebGLHelper2d.prototype._flowDataToAttribute = function (variableName, attributePerVertex, dataType, normalize, stride, offset) {
            if (normalize === void 0) { normalize = false; }
            if (stride === void 0) { stride = 0; }
            if (offset === void 0) { offset = 0; }
            this.gl.vertexAttribPointer(this.getAttributeLocation(variableName), attributePerVertex, dataType, normalize, stride, offset);
            this.gl.enableVertexAttribArray(this.getAttributeLocation(variableName));
        };
        /**
         * Draw from array.
         */
        WebGLHelper2d.prototype.drawArrays = function (method, arg1, arg2) {
            this.gl.drawArrays(method, arg1, arg2);
        };
        /**
         * Set line witdh (thickness). Might not work in Windows.
         */
        WebGLHelper2d.prototype.setLineWidth = function (lw) {
            this.gl.lineWidth(lw);
        };
        /**
         * Convert a coordinate from canvas system (left-top to be O) to WebGL system (center to be O). (2d)
         */
        WebGLHelper2d.prototype._convertCoordToWebGLSystem = function (canvasSystemCoord) {
            var rect = this.canvasDOM.getBoundingClientRect(); // care margin and padding
            var cvsX = canvasSystemCoord[0], cvsY = canvasSystemCoord[1];
            var cvsW = this.canvasDOM.width, cvsH = this.canvasDOM.height;
            var x = ((cvsX - rect.left) - cvsW / 2) / cvsW * 2;
            var y = (cvsH / 2 - (cvsY - rect.top)) / cvsH * 2;
            return [x, y];
        };
        /**
         * Convert all coordinates in a Array<Vec2> to WebGL system.
         */
        WebGLHelper2d.prototype.convertCoordsToWebGLSystem = function (canvasSystemCoords) {
            var _this = this;
            return canvasSystemCoords.map(function (ele) { return _this._convertCoordToWebGLSystem(ele); });
        };
        /**
         * Change mode to color setting, flowing color data to vertex shader from colorBuffer.
         * Usually you don't need to call this if you use `drawImmediately` method.
         */
        WebGLHelper2d.prototype.colorSettingMode = function (colorBuffer, colorAttribute) {
            this.useBuffer(colorBuffer);
            this._flowDataToAttribute(colorAttribute, 4, this.gl.FLOAT);
        };
        /**
         * Change mode to vertex setting, flowing vertex data to vertex shader from vertexBuffer.
         * Usually you don't need to call this if you use `drawImmediately` method.
         */
        WebGLHelper2d.prototype.vertexSettingMode = function (vertexBuffer, vertexAttribute, attributePerVertex, dataType, normalize, stride, offset) {
            if (dataType === void 0) { dataType = this.gl.FLOAT; }
            if (normalize === void 0) { normalize = false; }
            if (stride === void 0) { stride = 0; }
            if (offset === void 0) { offset = 0; }
            this.useBuffer(vertexBuffer);
            this._flowDataToAttribute(vertexAttribute, attributePerVertex, dataType, normalize, stride, offset);
        };
        /**
         * Send and draw using vertices immediately with no need to `bufferData` manually.
         * `arg1` and `arg2` depend on your `method`, see WebGLRenderingContext.drawArrays().
         * Color might be used for lining or filling according to `method`. `data` will be converted to WebGL coord system
         * and flatten then automatically. `color8bit` goes in RGB(A). If A is missing, default 1.0.
         */
        WebGLHelper2d.prototype.drawImmediately = function (data, method, arg1, arg2, color, vertexBuffer, vertexAttribute, attributePerVertex, colorBuffer, colorAttribute, dataType, bufferType, drawMode) {
            if (dataType === void 0) { dataType = this.gl.FLOAT; }
            if (bufferType === void 0) { bufferType = this.gl.ARRAY_BUFFER; }
            if (drawMode === void 0) { drawMode = this.gl.STATIC_DRAW; }
            // send color
            var normalizedColor = normalize8bitColor(color);
            var colorToSend = [];
            for (var i = 0; i < data.length; i++) {
                colorToSend.push(normalizedColor);
            }
            this.colorSettingMode(colorBuffer, colorAttribute);
            this.sendDataToBuffer(flatten(colorToSend));
            // send vertex
            this.vertexSettingMode(vertexBuffer, vertexAttribute, attributePerVertex, dataType);
            this.sendDataToBuffer(this.convertCoordSystemAndFlatten(data), bufferType, drawMode);
            this.drawArrays(method, arg1, arg2);
        };
        /**
         * Convert to WebGL system and flatten.
         */
        WebGLHelper2d.prototype.convertCoordSystemAndFlatten = function (data) {
            return flatten(this.convertCoordsToWebGLSystem(data));
        };
        /**
         * Clear canvas.
         */
        WebGLHelper2d.prototype.clearCanvas = function () {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        };
        return WebGLHelper2d;
    }());
    exports.WebGLHelper2d = WebGLHelper2d;
});
