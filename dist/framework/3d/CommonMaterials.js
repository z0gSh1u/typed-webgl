define(["require", "exports", "./PhongLightModel"], function (require, exports, PhongLightModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getCommonMaterials(name, position) {
        if (name == 'test') {
            return new PhongLightModel_1.PhongLightModel({
                lightPosition: position,
                ambientColor: [50, 50, 50],
                ambientMaterial: [50, 50, 50],
                diffuseColor: [192, 149, 83],
                diffuseMaterial: [50, 100, 100],
                specularColor: [255, 255, 255],
                specularMaterial: [45, 45, 45],
                materialShiness: 10.0
            });
        }
    }
    exports.getCommonMaterials = getCommonMaterials;
});
