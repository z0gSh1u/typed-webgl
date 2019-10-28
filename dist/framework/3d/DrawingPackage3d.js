// 
define(["require", "exports"], function (require, exports) {
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
        }
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
