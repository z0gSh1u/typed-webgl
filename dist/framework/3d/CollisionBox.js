// Collision box. (Not used currently.)
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CollisionBox = /** @class */ (function () {
        function CollisionBox(xmin, xmax, ymin, ymax, zmin, zmax) {
            this._eightVertices = [
                [xmin, ymin, zmin],
                [xmin, ymin, zmax],
                [xmin, ymax, zmin],
                [xmin, ymax, zmax],
                [xmax, ymin, zmin],
                [xmax, ymin, zmax],
                [xmax, ymax, zmin],
                [xmax, ymax, zmax]
            ];
        }
        Object.defineProperty(CollisionBox.prototype, "vertices", {
            get: function () {
                return this._eightVertices;
            },
            enumerable: true,
            configurable: true
        });
        CollisionBox.prototype.performMatMul = function (mat, rightMul) {
            if (rightMul === void 0) { rightMul = true; }
            this._eightVertices.map(function (v) { return rightMul ? mult(v, mat) : mult(mat, v); });
        };
        return CollisionBox;
    }());
    exports.CollisionBox = CollisionBox;
    function checkCollision(box1, box2) {
    }
    exports.checkCollision = checkCollision;
});
