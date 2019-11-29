// WebGL drawing object.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DrawingObject2d = /** @class */ (function () {
        function DrawingObject2d(_name, _data, _preFn, _method, _color, _arg1, _arg2) {
            this.name = _name;
            this.data = _data;
            this.preFn = _preFn;
            this.method = _method;
            this.cookedData = [];
            this.cookData();
            this.arg1 = _arg1 ? _arg1 : 0;
            this.arg2 = _arg2 ? _arg2 : this.cookedData.length;
            this.color = _color;
        }
        DrawingObject2d.prototype.getMethod = function () { return this.method; };
        DrawingObject2d.prototype.getArg1 = function () { return this.arg1; };
        DrawingObject2d.prototype.getArg2 = function () { return this.arg2; };
        DrawingObject2d.prototype.getColor = function () { return this.color; };
        DrawingObject2d.prototype.getCookedData = function () { return this.cookedData; };
        DrawingObject2d.prototype.getRawData = function () { return this.data; };
        /**
         * Get the name of this object.
         */
        DrawingObject2d.prototype.getName = function () {
            return this.name;
        };
        /**
         * Set a new raw data, and you can cook it again.
         */
        DrawingObject2d.prototype.setData = function (newData, cookAgain) {
            if (cookAgain === void 0) { cookAgain = true; }
            this.data = newData;
            cookAgain && this.cookData();
        };
        /**
         * Set a new preprocess function.
         */
        DrawingObject2d.prototype.setPreFn = function (newPreFn) {
            this.preFn = newPreFn;
        };
        /**
         * Cook the raw data manually using `this.preFn`.
         */
        DrawingObject2d.prototype.cookData = function () {
            if (this.preFn) {
                this.cookedData = this.preFn.apply(this, this.data);
            }
            else {
                this.cookedData = this.data;
            }
        };
        return DrawingObject2d;
    }());
    exports.DrawingObject2d = DrawingObject2d;
});
