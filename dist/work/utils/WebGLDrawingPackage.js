define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // WebGL drawing package.
    // Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
    // for book `Interactive Computer Graphics` (7th Edition).
    /**
     * A `WebGLDrawingPackage` is something that contains many `WebGLDrawingObject`.
     * You can use it to store a specific part of your entity.
     */
    var WebGLDrawingPackage = /** @class */ (function () {
        function WebGLDrawingPackage() {
            var objects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                objects[_i] = arguments[_i];
            }
            this.innerList = objects.length == 0 ? [] : objects;
        }
        WebGLDrawingPackage.prototype.push = function (obj) {
            this.innerList.push(obj);
        };
        /**
         * Perform a function to all object's rawData and re-cook it.
         */
        WebGLDrawingPackage.prototype.performToAllObjectData = function (fn) {
            this.innerList.forEach(function (ele) {
                ele.setData(ele.getRawData().map(fn), true);
            });
        };
        /**
         * Calculate the hit box of this package. Returns [xmin, xmax, ymin, ymax] as Vec4 (Rect).
         */
        WebGLDrawingPackage.prototype.calculateHitBox = function () {
            var xmin = 99999, xmax = -99999, ymin = 99999, ymax = -9999;
            this.innerList.forEach(function (ele) {
                ele.getRawData().forEach(function (rd) {
                    var _rd = rd;
                    if (xmin > _rd[0])
                        xmin = _rd[0];
                    if (xmax < _rd[0])
                        xmax = _rd[0];
                    if (ymin > _rd[1])
                        ymin = _rd[1];
                    if (ymax < _rd[1])
                        ymax = _rd[1];
                });
            });
            return [xmin, xmax, ymin, ymax];
        };
        /**
         * Get `innerList` of package.
         */
        WebGLDrawingPackage.prototype.getInnerList = function () {
            return this.innerList;
        };
        /**
         * Get an object using `name`.
         */
        WebGLDrawingPackage.prototype.getAnObject = function (name) {
            for (var i = 0; i < this.innerList.length; i++) {
                if (this.innerList[i].getName() == name) {
                    return this.innerList[i];
                }
            }
        };
        /**
         * Remove an object in `innerList` using `name`. If not found, do nothing.
         */
        WebGLDrawingPackage.prototype.removeAnObject = function (name) {
            for (var i = 0; i < this.innerList.length; i++) {
                if (this.innerList[i].getName() == name) {
                    this.innerList.splice(i, 1);
                    break;
                }
            }
        };
        /**
         * Modify an object in `innerList` using `name`. If not found, do nothing.
         */
        WebGLDrawingPackage.prototype.modifyAnObject = function (name, newObject) {
            for (var i = 0; i < this.innerList.length; i++) {
                if (this.innerList[i].getName() == name) {
                    this.innerList[i] = newObject;
                    break;
                }
            }
        };
        return WebGLDrawingPackage;
    }());
    exports.WebGLDrawingPackage = WebGLDrawingPackage;
});
