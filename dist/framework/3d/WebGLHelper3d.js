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
            this.globalTextureBuffer = null;
            this.globalVertexAttribute = null;
            this.globalVertexBuffer = null;
            this.globalTextureCoordAttribute = null;
            this.globalTextureSamplerAttribute = null;
            this.globalWorldMatrixUniform = null;
            this.globalModelMatrixUniform = null;
            this.globalExtraMatrixUniform = null;
            this.waitingQueue = [];
            this.renderingLock = false;
        }
        /**
         * Set some global settings so that you don't need to pass them every time you draw.
         */
        WebGLHelper3d.prototype.setGlobalSettings = function (_vBuf, _vAttr, _tBuf, _tCoordAttr, _tSamplerAttr, _worldMatUniform, _modelMatUniform, _extraMatUniform) {
            this.globalTextureBuffer = _tBuf;
            this.globalVertexAttribute = _vAttr;
            this.globalVertexBuffer = _vBuf;
            this.globalTextureCoordAttribute = _tCoordAttr;
            this.globalTextureSamplerAttribute = _tSamplerAttr;
            this.globalWorldMatrixUniform = _worldMatUniform;
            this.globalModelMatrixUniform = _modelMatUniform;
            this.globalExtraMatrixUniform = _extraMatUniform;
        };
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
        /**
         * Set uniform matrix (4d) in shader.
         */
        WebGLHelper3d.prototype.setUniformMatrix4d = function (variableName, data, transpose) {
            if (transpose === void 0) { transpose = false; }
            this.gl.uniformMatrix4fv(this.getUniformLocation(variableName), transpose, flatten(data));
        };
        /**
         * Transform current mode to textureSetting.
         */
        WebGLHelper3d.prototype.textureSettingMode = function (tBuf, tAttr) {
            this.vertexSettingMode(tBuf, tAttr, 2, this.gl.FLOAT);
        };
        /**
         * Draw a `DrawingObject3d` without texture. (Mesh only.)
         */
        WebGLHelper3d.prototype.drawImmediatelyMeshOnly = function (obj, method, color) {
            // 准备mesh绘制
            var meshVertices = [];
            obj.objProcessor.fs.forEach(function (face) {
                face.forEach(function (vOfFace) {
                    var subscript = vOfFace - 1;
                    meshVertices.push(obj.objProcessor.vs[subscript]); // xyzxyzxyz
                });
            });
            // 发送三角形顶点信息
            this.vertexSettingMode(this.globalVertexBuffer, this.globalVertexAttribute, 3);
            this.sendDataToBuffer(flatten(meshVertices));
            // 纯色纹理
            var texture = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, 
            // notice it is Uint8 here, no need to normalize
            new Uint8Array(__spreadArrays(color.map(function (x) { return Math.floor(x * 255); }))));
            this.drawArrays(method, 0, obj.objProcessor.getEffectiveVertexCount());
        };
        /**
         * Draw a `DrawingObject3d` immediately using the specified texture. `textureIndex` starts from 0.
         */
        WebGLHelper3d.prototype.drawImmediately = function (obj, textureIndex) {
            // 处理extraMatrix
            this.setUniformMatrix4d(this.globalExtraMatrixUniform, obj.extraMatrix);
            // 准备mesh绘制
            var meshVertices = [];
            obj.objProcessor.fs.forEach(function (face) {
                face.forEach(function (vOfFace) {
                    var subscript = vOfFace - 1;
                    meshVertices.push(obj.objProcessor.vs[subscript]); // xyzxyzxyz
                });
            });
            // 发送三角形顶点信息
            this.vertexSettingMode(this.globalVertexBuffer, this.globalVertexAttribute, 3);
            this.sendDataToBuffer(flatten(meshVertices));
            if (obj.objProcessor.fts.length != 0) {
                // 准备材质绘制
                this.textureSettingMode(this.globalTextureBuffer, this.globalTextureCoordAttribute);
                // 发送材质顶点信息
                var textureVertices_1 = [];
                obj.objProcessor.fts.forEach(function (face) {
                    face.forEach(function (vOfFace) {
                        var subscript = vOfFace - 1;
                        textureVertices_1.push(obj.objProcessor.vts[subscript]);
                    });
                });
                this.sendDataToBuffer(flatten(textureVertices_1));
                // 根据前端传来的材质要求，让着色器调取显存中对应的材质
                this.gl.uniform1i(this.getUniformLocation(this.globalTextureSamplerAttribute), textureIndex);
            }
            else {
                throw "[drawImmediately] Cannot find texture vertices info. Framework doesn't support this situation.";
            }
            // 综合绘制
            this.drawArrays(this.gl.TRIANGLES, 0, obj.objProcessor.getEffectiveVertexCount());
        };
        /**
         * Draw a `DrawingPackage3d` immediately using the specified texture.
         */
        WebGLHelper3d.prototype.drawPackageImmediatelyMeshOnly = function (pkg) {
            var _this = this;
            // 设置该物体的自身视图矩阵
            this.setUniformMatrix4d(this.globalModelMatrixUniform, pkg.modelMat);
            pkg.innerList.forEach(function (ele) {
                _this.drawImmediatelyMeshOnly(ele, pkg.methodMeshOnly, pkg.colorMeshOnly);
            });
        };
        /**
         * Draw a `DrawingPackage3d` immediately using the specified texture.
         */
        WebGLHelper3d.prototype.drawPackageImmediately = function (pkg) {
            var _this = this;
            // 设置该物体的自身视图矩阵
            this.setUniformMatrix4d(this.globalModelMatrixUniform, pkg.modelMat);
            pkg.innerList.forEach(function (ele) {
                _this.drawImmediately(ele, ele.textureIndex);
            });
        };
        /**
         * Push a `DrawingPackage3d` into `waitingQueue`.
         */
        WebGLHelper3d.prototype.drawPackageLater = function (toDraw) {
            this.waitingQueue.push(toDraw);
        };
        /**
         * Clear `waitingQueue`.
         */
        WebGLHelper3d.prototype.clearWaitingQueue = function () {
            this.waitingQueue = [];
        };
        /**
         * Re-render the canvas using `waitingQueue`. Need the `ctm`.
         */
        WebGLHelper3d.prototype.reRender = function (ctm) {
            var _this = this;
            if (this.renderingLock) {
                return;
            }
            this.renderingLock = true;
            this.setUniformMatrix4d(this.globalWorldMatrixUniform, ctm);
            // comment `clearCanvas` so that the image no longer flikers
            // this.clearCanvas()
            this.waitingQueue.forEach(function (ele) {
                if (!ele.meshOnly) {
                    _this.drawPackageImmediately(ele);
                }
                else {
                    _this.drawPackageImmediatelyMeshOnly(ele);
                }
            });
            this.clearWaitingQueue();
            this.renderingLock = false;
        };
        return WebGLHelper3d;
    }());
    exports.WebGLHelper3d = WebGLHelper3d;
});
