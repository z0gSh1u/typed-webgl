define(["require", "exports", "./OBJProcessor"], function (require, exports, OBJProcessor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DrawingObject3d = /** @class */ (function () {
        function DrawingObject3d(objFilePath, texturePath) {
            this._objFilePath = objFilePath;
            this._texturePath = texturePath;
            this._objProcessor = null;
            this._textureImage = null;
            this._processOBJ();
            // this._processTexture()
        }
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
        DrawingObject3d.prototype._processOBJ = function () {
            var responseData;
            responseData = loadFileAJAX(this._objFilePath);
            this._objProcessor = new OBJProcessor_1.OBJProcessor(responseData);
        };
        // TODO: synchronize this
        DrawingObject3d.prototype._processTexture = function () {
            var textureImage = new Image();
            textureImage.src = this._texturePath;
            // let curTick = new Date().getTime()
            // while (1) {
            //   if (new Date().getTime() - curTick >= 150) {
            //     break
            //   }
            // }
            this._textureImage = textureImage;
            console.log(this._textureImage);
        };
        return DrawingObject3d;
    }());
    exports.DrawingObject3d = DrawingObject3d;
});
