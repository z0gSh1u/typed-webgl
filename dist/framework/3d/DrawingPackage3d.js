// 
define(["require", "exports", "../WebGLUtils"], function (require, exports, WebGLUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DrawingPackage3d = /** @class */ (function () {
        function DrawingPackage3d(modelMat) {
            var objects = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                objects[_i - 1] = arguments[_i];
            }
            this._innerList = objects.length == 0 ? [] : objects;
            this._modelMat = modelMat;
            this._meshOnly = false;
            this._colorMeshOnly = null;
            this._methodMeshOnly = null;
        }
        DrawingPackage3d.prototype.setMeshOnly = function (method, color8bit) {
            this._meshOnly = true;
            this._colorMeshOnly = WebGLUtils_1.normalize8bitColor(color8bit);
            this._methodMeshOnly = method;
        };
        Object.defineProperty(DrawingPackage3d.prototype, "colorMeshOnly", {
            get: function () {
                return this._colorMeshOnly;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DrawingPackage3d.prototype, "methodMeshOnly", {
            get: function () {
                return this._methodMeshOnly;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DrawingPackage3d.prototype, "meshOnly", {
            get: function () {
                return this._meshOnly;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DrawingPackage3d.prototype, "modelMat", {
            get: function () {
                return this._modelMat;
            },
            set: function (newMat) {
                this._modelMat = newMat;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DrawingPackage3d.prototype, "innerList", {
            get: function () {
                return this._innerList;
            },
            enumerable: true,
            configurable: true
        });
        DrawingPackage3d.prototype.push = function (obj) {
            this.innerList.push(obj);
        };
        DrawingPackage3d.prototype.setModelMat = function (newMat) {
            this._modelMat = newMat;
        };
        DrawingPackage3d.prototype.preloadTexture = function (callback) {
            var newImages = [], loadedImagesCount = 0;
            var _arr = this.innerList;
            var arr = (typeof _arr != "object") ? [_arr] : _arr;
            function sendImageLoadedMessage() {
                loadedImagesCount++;
                if (loadedImagesCount == arr.length) {
                    callback(newImages);
                }
            }
            for (var i = 0; i < arr.length; i++) {
                newImages[i] = new Image();
                newImages[i].src = arr[i].texturePath;
                newImages[i].onload = function () {
                    sendImageLoadedMessage();
                };
                newImages[i].onerror = function () {
                    sendImageLoadedMessage();
                };
            }
        };
        return DrawingPackage3d;
    }());
    exports.DrawingPackage3d = DrawingPackage3d;
});
