// Phong light model.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define(["require", "exports", "../WebGLUtils"], function (require, exports, WebGLUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PhongLightModel = /** @class */ (function () {
        function PhongLightModel(cfg) {
            this._lightPosition = __spreadArrays(cfg.lightPosition, [1.0]);
            this._ambientColor = WebGLUtils_1.normalize8bitColor(cfg.ambientColor);
            this._diffuseColor = WebGLUtils_1.normalize8bitColor(cfg.diffuseColor);
            this._specularColor = WebGLUtils_1.normalize8bitColor(cfg.specularColor);
            this._ambientMaterial = WebGLUtils_1.normalize8bitColor(cfg.ambientMaterial);
            this._diffuseMaterial = WebGLUtils_1.normalize8bitColor(cfg.diffuseMaterial);
            this._specularMaterial = WebGLUtils_1.normalize8bitColor(cfg.specularMaterial);
            this._materialShiness = cfg.materialShiness;
            this._ambientProduct = mult(this._ambientColor, this._ambientMaterial);
            this._diffuseProduct = mult(this._diffuseColor, this._diffuseMaterial);
            this._specularProduct = mult(this._specularColor, this._specularMaterial);
        }
        PhongLightModel.prototype.setLightPosition = function (newPos) {
            this._lightPosition = __spreadArrays(newPos, [1.0]);
        };
        Object.defineProperty(PhongLightModel.prototype, "lightPosition", {
            get: function () {
                return this._lightPosition.slice(0, 3);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PhongLightModel.prototype, "ambientProduct", {
            get: function () {
                return this._ambientProduct;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PhongLightModel.prototype, "diffuseProduct", {
            get: function () {
                return this._diffuseProduct;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PhongLightModel.prototype, "specularProduct", {
            get: function () {
                return this._specularProduct;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PhongLightModel.prototype, "materialShiness", {
            get: function () {
                return this._materialShiness;
            },
            enumerable: true,
            configurable: true
        });
        return PhongLightModel;
    }());
    exports.PhongLightModel = PhongLightModel;
});
