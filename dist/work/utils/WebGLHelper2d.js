// WebGL Helper (2d).
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).
define(["require", "exports", "./WebGLUtils", "./WebGLDrawingPackage"], function (require, exports, WebGLUtils_1, WebGLDrawingPackage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WebGLHelper2d = /** @class */ (function () {
        function WebGLHelper2d(_canvasDOM, _gl, _program) {
            this.canvasDOM = _canvasDOM;
            this.gl = _gl;
            this.program = _program;
            this.globalVertexBuffer = null;
            this.globalColorBuffer = null;
            this.globalVertexAttribute = null;
            this.globalAttributesPerVertex = null;
            this.globalColorAttribute = null;
            this.waitingQueue = new WebGLDrawingPackage_1.WebGLDrawingPackage();
            this.INTERVAL_MIN = 30;
            this.lastRenderTick = 0;
        }
        /**
         * Set global settings. So that you don't need to pass these arguments every time you call `drawImmediately`.
         */
        WebGLHelper2d.prototype.setGlobalSettings = function (vertexBuffer, colorBuffer, vertexAttribute, attributePerVertex, colorAttribute) {
            this.globalVertexBuffer = vertexBuffer;
            this.globalColorBuffer = colorBuffer;
            this.globalVertexAttribute = vertexAttribute;
            this.globalAttributesPerVertex = attributePerVertex;
            this.globalColorAttribute = colorAttribute;
        };
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
            if (vertexBuffer === void 0) { vertexBuffer = this.globalVertexBuffer; }
            if (vertexAttribute === void 0) { vertexAttribute = this.globalVertexAttribute; }
            if (attributePerVertex === void 0) { attributePerVertex = this.globalAttributesPerVertex; }
            if (colorBuffer === void 0) { colorBuffer = this.globalColorBuffer; }
            if (colorAttribute === void 0) { colorAttribute = this.globalColorAttribute; }
            if (dataType === void 0) { dataType = this.gl.FLOAT; }
            if (bufferType === void 0) { bufferType = this.gl.ARRAY_BUFFER; }
            if (drawMode === void 0) { drawMode = this.gl.STATIC_DRAW; }
            var globalSet = vertexBuffer && vertexAttribute && attributePerVertex && colorBuffer && colorAttribute;
            if (!globalSet) {
                throw "[drawImmediately] Global setting not enough.";
            }
            // send color
            var normalizedColor = WebGLUtils_1.normalize8bitColor(color);
            var colorToSend = [];
            for (var i = 0; i < data.length; i++) {
                colorToSend.push(normalizedColor);
            }
            this.colorSettingMode(colorBuffer, colorAttribute);
            this.sendDataToBuffer(flatten(colorToSend));
            // let uColorLoc = this.gl.getUniformLocation(this.program, "uColor")
            // this.gl.uniform4fv(uColorLoc, normalizedColor)
            // send vertex
            this.vertexSettingMode(vertexBuffer, vertexAttribute, attributePerVertex, dataType);
            this.sendDataToBuffer(this.convertCoordSystemAndFlatten(data), bufferType, drawMode);
            this.drawArrays(method, arg1, arg2);
        };
        /**
         * Push a `WebGLDrawingObject` to `watingQueue`. If you want to use this, make sure
         * you have already set the global settings. Call `reRender` when you want to draw
         * these buffered objects.
         */
        WebGLHelper2d.prototype.drawLater = function (object) {
            this.waitingQueue.push(object);
        };
        /**
         * Unzip `WebGLDrawingPackage` and push all objects to `waitingQueue`.
         */
        WebGLHelper2d.prototype.drawPackageLater = function (pkg) {
            var _this = this;
            pkg.getInnerList().forEach(function (ele) {
                _this.drawLater(ele);
            });
        };
        /**
         * Clear canvas, then draw all objects in `waitingQueue`, then clear it.
         */
        WebGLHelper2d.prototype.reRender = function () {
            var _this = this;
            var curTick = new Date().getTime();
            if (curTick - this.lastRenderTick < this.INTERVAL_MIN) {
                return;
            }
            this.clearCanvas();
            this.waitingQueue.getInnerList().forEach(function (ele) {
                _this.drawImmediately(ele.getCookedData(), ele.getMethod(), ele.getArg1(), ele.getArg2(), ele.getColor());
            });
            this.clearWaitingQueue();
            this.lastRenderTick = curTick;
        };
        /**
         * Clear `waitingQueue` manually.
         */
        WebGLHelper2d.prototype.clearWaitingQueue = function () {
            this.waitingQueue = new WebGLDrawingPackage_1.WebGLDrawingPackage();
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
        /**
         * Mirror a point.
         */
        WebGLHelper2d.prototype.getTurnedPoint = function (point, axis) {
            // !!! note that there might be something not point Vec2 in data (like Oval)
            if (point.length == 2) {
                var x = 2 * axis - point[0];
                var y = point[1];
                return [x, y];
            }
            return point;
        };
        /**
         * Get the point after rotating theta (DEG) to center.
         */
        WebGLHelper2d.prototype.getRotatedPoint = function (point, center, theta) {
            var row = this.canvasDOM.height, col = this.canvasDOM.width;
            var x1 = point[0], y1 = row - point[1], x2 = center[0], y2 = row - center[1];
            var rt = radians(theta);
            var x = (x1 - x2) * Math.cos(rt) - (y1 - y2) * Math.sin(rt) + x2;
            var y = (x1 - x2) * Math.sin(rt) + (y1 - y2) * Math.cos(rt) + y2;
            x = x;
            y = row - y;
            return [x, y];
        };
        /**
         * Get the point after moving deltaX and deltaY
         */
        WebGLHelper2d.prototype.getMovedPoint = function (point, delta) {
            // !!! same as getTurnedPoint
            if (point.length == 2) {
                var x = point[0] + delta[0];
                var y = point[1] + delta[1];
                return [x, y];
            }
            return point;
        };
        return WebGLHelper2d;
    }());
    exports.WebGLHelper2d = WebGLHelper2d;
});
