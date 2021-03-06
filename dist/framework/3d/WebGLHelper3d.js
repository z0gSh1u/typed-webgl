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
        Object.defineProperty(WebGLHelper3d.prototype, "glContext", {
            get: function () {
                return this.gl;
            },
            enumerable: true,
            configurable: true
        });
        WebGLHelper3d.prototype.getProgram = function (index) {
            return this.programList[index];
        };
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
            var pos = this.gl.getUniformLocation(this.program, variableName);
            if (pos == null) {
                alert('[getUniformLocation] Null uniform. Name = ' + variableName);
            }
            return pos;
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
                console.warn(images);
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
         * Send cubemap texture image to GPU.
         */
        WebGLHelper3d.prototype.sendCubeMapTextureToGPU = function (image, texture, position, wh, activeTexture) {
            if (wh === void 0) { wh = 512; }
            if (activeTexture === void 0) { activeTexture = this.gl.TEXTURE20; }
            var gl = this.gl;
            var pos = position.replace('x', 'X').replace('y', 'Y').replace('z', 'Z')
                .replace('+', 'POSITIVE_').replace('-', 'NEGATIVE_');
            var target = eval("gl.TEXTURE_CUBE_MAP_" + pos);
            gl.activeTexture(activeTexture);
            gl.texImage2D(target, 0, gl.RGBA, wh, wh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
            gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        };
        /**
         * Post process after send all cube maps to GPU.
         */
        WebGLHelper3d.prototype.postProcessCubeMapTexture = function () {
            var gl = this.gl;
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        };
        /**
         * Analyze f?s to v?s.
         */
        WebGLHelper3d.prototype.analyzeFtoV = function (obj, which) {
            var meshVertices = [];
            var f, v;
            switch (which) {
                case 'fs':
                    f = obj.objProcessor.fs;
                    if (f.length <= 0) {
                        throw '[WebGLHelper3d.analyzeFtoV] fs.length <= 0.';
                    }
                    v = obj.objProcessor.vs;
                    break;
                case 'fts':
                    f = obj.objProcessor.fts;
                    if (f.length <= 0) {
                        throw '[WebGLHelper3d.analyzeFtoV] fts.length <= 0.';
                    }
                    v = obj.objProcessor.vts;
                    break;
                case 'fns':
                    f = obj.objProcessor.fns;
                    if (f.length <= 0) {
                        throw '[WebGLHelper3d.analyzeFtoV] fns.length <= 0.';
                    }
                    v = obj.objProcessor.vns;
                    break;
            }
            // @ts-ignore
            f = f;
            v = v;
            f.forEach(function (face) {
                // @ts-ignore
                face.forEach(function (vOfFace) {
                    var subscript = vOfFace - 1;
                    meshVertices.push(v[subscript]); // xyzxyzxyz
                });
            });
            return which == 'fts' ? meshVertices : meshVertices;
        };
        return WebGLHelper3d;
    }());
    exports.WebGLHelper3d = WebGLHelper3d;
});
