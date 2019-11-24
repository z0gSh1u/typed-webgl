// WebGL drawing package.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A `WebGLDrawingPackage` is something that contains many `DrawingObject2d`.
     * You can use it to store a specific part of your entity.
     */
    var DrawingPackage2d = /** @class */ (function () {
        function DrawingPackage2d() {
            var objects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                objects[_i] = arguments[_i];
            }
            this.innerList = objects.length == 0 ? [] : objects;
        }
        DrawingPackage2d.prototype.push = function (obj) {
            this.innerList.push(obj);
        };
        /**
         * Perform a function to all object's rawData and re-cook it.
         * Your function should take a parameter=`element` and return the processed value.
         */
        DrawingPackage2d.prototype.performToAllObjectData = function (fn) {
            this.innerList.forEach(function (ele) {
                ele.setData(ele.getRawData().map(fn), true);
            });
        };
        /**
         * Calculate the hit box of this package. Returns [xmin, xmax, ymin, ymax] as Vec4 (Rect).
         */
        DrawingPackage2d.prototype.calculateHitBox = function () {
            var xmin = 99999, xmax = -99999, ymin = 99999, ymax = -99999;
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
         * Judge a point as Vec2 whether is in the hit box of this package
         */
        DrawingPackage2d.prototype.judgeInHitBox = function (point) {
            var hitBox = this.calculateHitBox();
            return (point[0] >= hitBox[0] && point[0] <= hitBox[1] && point[1] >= hitBox[2] && point[1] <= hitBox[3]);
        };
        /**
         * Get `innerList` of package.
         */
        DrawingPackage2d.prototype.getInnerList = function () {
            return this.innerList;
        };
        /**
         * Get an object using `name`.
         */
        DrawingPackage2d.prototype.getAnObject = function (name) {
            for (var i = 0; i < this.innerList.length; i++) {
                if (this.innerList[i].getName() == name) {
                    return this.innerList[i];
                }
            }
        };
        /**
         * Remove an object in `innerList` using `name`. If not found, do nothing.
         */
        DrawingPackage2d.prototype.removeAnObject = function (name) {
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
        DrawingPackage2d.prototype.modifyAnObject = function (name, newObject) {
            for (var i = 0; i < this.innerList.length; i++) {
                if (this.innerList[i].getName() == name) {
                    this.innerList[i] = newObject;
                    break;
                }
            }
        };
        return DrawingPackage2d;
    }());
    exports.DrawingPackage2d = DrawingPackage2d;
});
