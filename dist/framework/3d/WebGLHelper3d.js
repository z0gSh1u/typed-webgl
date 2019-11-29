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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WebGLHelper3d = /** @class */ (function () {
        function WebGLHelper3d(_canvasDOM, _gl, _programs) {
            this.programList = [];
            this.canvasDOM = _canvasDOM;
            this.gl = _gl;
            this.programList = _programs;
            this.program = _programs[0];
        }
        Object.defineProperty(WebGLHelper3d.prototype, "currentProgram", {
            get: function () {
                return this.program;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Switch to another program.
         */
        WebGLHelper3d.prototype.switchProgram = function (index) {
            this.program = this.programList[index];
            this.gl.useProgram(this.program);
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
            this.gl.enableVertexAttribArray(this.getAttributeLocation(variableName));
            this.gl.vertexAttribPointer(this.getAttributeLocation(variableName), attributePerVertex, dataType, normalize, stride, offset);
        };
        /**
         * Generate pure color texture and bind it to `gl.TEXTURE_2D`.
         */
        WebGLHelper3d.prototype.bindPureColorTexture = function (color) {
            var texture = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, 
            // notice it is Uint8 here, no need to normalize
            new Uint8Array(__spreadArrays(color.map(function (x) { return Math.floor(x * 255); }))));
        };
        /**
         * Very simple to use.
         */
        WebGLHelper3d.prototype.prepare = function (cfg) {
            var that = this;
            // deal with uniforms
            cfg.uniforms.forEach(function (ele) {
                var toEval = '';
                if (ele.method.charAt(0) == 'M') {
                    toEval = "that.gl.uniform" + ele.method + "(that.getUniformLocation('" + ele.varName + "'), false, [" + ele.data + "])";
                }
                else if (ele.method.charAt(ele.method.length - 1) == 'v') {
                    toEval = "that.gl.uniform" + ele.method + "(that.getUniformLocation('" + ele.varName + "'), [" + ele.data + "])";
                }
                else {
                    toEval = "that.gl.uniform" + ele.method + "(that.getUniformLocation('" + ele.varName + "'), " + ele.data + ")";
                }
                eval(toEval);
            });
            // deal with attributes
            cfg.attributes.forEach(function (ele) {
                that.useBuffer(ele.buffer);
                that.startFlowingDataToAttribute(ele.varName, ele.attrPer, ele.type);
                that.sendDataToBuffer(ele.data);
            });
        };
        /**
         * Send texture image to GPU. Subscript is using [posFrom, posTo).
         */
        WebGLHelper3d.prototype.sendTextureImageToGPU = function (images, posFrom, posTo) {
            // 检查空位
            if (posTo - posFrom != images.length) {
                console.log(images);
                throw '[WebGLHelper3d.sendTextureImageToGPU] Too many / no enough positions. Above is the images.';
            }
            var tex;
            var gl = this.gl;
            for (var i = posFrom; i < posTo; i++) {
                tex = gl.createTexture();
                eval("gl.activeTexture(gl.TEXTURE" + i + ");");
                gl.bindTexture(gl.TEXTURE_2D, tex);
                eval("gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[" + (i - posFrom) + "]);");
                gl.generateMipmap(gl.TEXTURE_2D);
            }
        };
        /**
         * Analyze f?s to v?s.
         */
        WebGLHelper3d.prototype.analyzeFtoV = function (obj, which) {
            // TODO: Can anybody make this pile of shit prettier?
            var meshVertices = [];
            switch (which) {
                case 'fs':
                    if (obj.objProcessor.fs.length <= 0) {
                        throw '[WebGLHelper3d.analyzeFtoV] fs.length <= 0.';
                    }
                    obj.objProcessor.fs.forEach(function (face) {
                        face.forEach(function (vOfFace) {
                            var subscript = vOfFace - 1;
                            meshVertices.push(obj.objProcessor.vs[subscript]); // xyzxyzxyz
                        });
                    });
                    return meshVertices;
                case 'fts':
                    if (obj.objProcessor.fts.length <= 0) {
                        throw '[WebGLHelper3d.analyzeFtoV] fts.length <= 0.';
                    }
                    obj.objProcessor.fts.forEach(function (face) {
                        face.forEach(function (vOfFace) {
                            var subscript = vOfFace - 1;
                            meshVertices.push(obj.objProcessor.vts[subscript]); // xyzxyzxyz
                        });
                    });
                    return meshVertices;
                case 'fns':
                    if (obj.objProcessor.fns.length <= 0) {
                        throw '[WebGLHelper3d.analyzeFtoV] fns.length <= 0.';
                    }
                    obj.objProcessor.fns.forEach(function (face) {
                        face.forEach(function (vOfFace) {
                            var subscript = vOfFace - 1;
                            meshVertices.push(obj.objProcessor.vns[subscript]); // xyzxyzxyz
                        });
                    });
                    return meshVertices;
            }
        };
        return WebGLHelper3d;
    }());
    exports.WebGLHelper3d = WebGLHelper3d;
});
