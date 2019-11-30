// Drawing object (3d) definition.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).
define(["require", "exports", "./OBJProcessor"], function (require, exports, OBJProcessor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DrawingObject3d = /** @class */ (function () {
        function DrawingObject3d(name, objFilePath, texturePath, textureIndex) {
            this._name = name;
            this._objFilePath = objFilePath;
            this._texturePath = texturePath;
            this._objProcessor = null;
            this._textureImage = null;
            this._textureIndex = textureIndex;
            this._extraMatrix = mat4();
            this._processOBJ();
        }
        DrawingObject3d.prototype.setExtraMatrix = function (newMat) {
            this._extraMatrix = newMat;
        };
        Object.defineProperty(DrawingObject3d.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DrawingObject3d.prototype, "extraMatrix", {
            get: function () {
                return this._extraMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DrawingObject3d.prototype, "objProcessor", {
            get: function () {
                return this._objProcessor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DrawingObject3d.prototype, "texturePath", {
            get: function () {
                return this._texturePath;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DrawingObject3d.prototype, "textureImage", {
            get: function () {
                return this._textureImage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DrawingObject3d.prototype, "textureIndex", {
            get: function () {
                return this._textureIndex;
            },
            enumerable: true,
            configurable: true
        });
        DrawingObject3d.prototype._processOBJ = function () {
            var responseData;
            responseData = loadFileAJAX(this._objFilePath);
            this._objProcessor = new OBJProcessor_1.OBJProcessor(responseData);
        };
        return DrawingObject3d;
    }());
    exports.DrawingObject3d = DrawingObject3d;
});
