// WebGL Helper (3d).
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define(["require", "exports", "../WebGLUtils"], function (require, exports, WebGLUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WebGLHelper3d = /** @class */ (function () {
        function WebGLHelper3d(_canvasDOM, _gl, _program) {
            this.canvasDOM = _canvasDOM;
            this.gl = _gl;
            this.program = _program;
            this.rect = this.canvasDOM.getBoundingClientRect();
            this.cvsW = this.canvasDOM.width;
            this.cvsH = this.canvasDOM.height;
        }
        /**
         * Create a buffer.
         */
        WebGLHelper3d.prototype.createBuffer = function () {
            var buf = this.gl.createBuffer();
            return buf;
        };
        /**
         * Use a buffer as current buffer for `bufferType`.
         */
        WebGLHelper3d.prototype.useBuffer = function (buffer, bufferType) {
            if (bufferType === void 0) { bufferType = this.gl.ARRAY_BUFFER; }
            this.gl.bindBuffer(bufferType, buffer);
        };
        /**
         * Send data to buffer.
         */
        WebGLHelper3d.prototype.sendDataToBuffer = function (data, bufferType, drawMode) {
            if (bufferType === void 0) { bufferType = this.gl.ARRAY_BUFFER; }
            if (drawMode === void 0) { drawMode = this.gl.STATIC_DRAW; }
            this.gl.bufferData(bufferType, data, drawMode);
        };
        /**
         * Get `attribute` location in shader.
         */
        WebGLHelper3d.prototype.getAttributeLocation = function (variableName) {
            return this.gl.getAttribLocation(this.program, variableName);
        };
        /**
         * Get `uniform` location in shader.
         */
        WebGLHelper3d.prototype.getUniformLocation = function (variableName) {
            return this.gl.getUniformLocation(this.program, variableName);
        };
        /**
         * Draw from array.
         */
        WebGLHelper3d.prototype.drawArrays = function (method, arg1, arg2) {
            this.gl.drawArrays(method, arg1, arg2);
        };
        /**
         * Clear canvas.
         */
        WebGLHelper3d.prototype.clearCanvas = function () {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        };
        /**
         * Fill attribute in shader using data in current buffer and enable it.
         */
        WebGLHelper3d.prototype.startFlowingDataToAttribute = function (variableName, attributePerVertex, dataType, normalize, stride, offset) {
            if (normalize === void 0) { normalize = false; }
            if (stride === void 0) { stride = 0; }
            if (offset === void 0) { offset = 0; }
            this.gl.vertexAttribPointer(this.getAttributeLocation(variableName), attributePerVertex, dataType, normalize, stride, offset);
            this.gl.enableVertexAttribArray(this.getAttributeLocation(variableName));
        };
        /**
         * Transform current mode to `vertexSetting`.
         */
        WebGLHelper3d.prototype.vertexSettingMode = function (vertexBuffer, vertexAttribute, attributePerVertex, dataType, normalize, stride, offset) {
            if (dataType === void 0) { dataType = this.gl.FLOAT; }
            if (normalize === void 0) { normalize = false; }
            if (stride === void 0) { stride = 0; }
            if (offset === void 0) { offset = 0; }
            this.useBuffer(vertexBuffer);
            this.startFlowingDataToAttribute(vertexAttribute, attributePerVertex, dataType, normalize, stride, offset);
        };
        /**
         * Transform current mode to `colorSetting`.
         */
        WebGLHelper3d.prototype.colorSettingMode = function (colorBuffer, colorAttribute) {
            this.useBuffer(colorBuffer);
            this.startFlowingDataToAttribute(colorAttribute, 4, this.gl.FLOAT);
        };
        /**
         * Set uniform color variable in fragment shader. No need to transform to `colorSetting` mode.
         */
        WebGLHelper3d.prototype.setUniformColor = function (variableName, color8bit) {
            var _a;
            (_a = this.gl).uniform4f.apply(_a, __spreadArrays([this.getUniformLocation(variableName)], WebGLUtils_1.normalize8bitColor(color8bit)));
        };
        return WebGLHelper3d;
    }());
    exports.WebGLHelper3d = WebGLHelper3d;
});
