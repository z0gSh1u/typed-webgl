// ==================================
// 小马渲染
// by z0gSh1u
// ==================================
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define(["require", "exports", "../../framework/3d/DrawingPackage3d", "../../framework/WebGLUtils", "../../framework/3d/DrawingObject3d", "../../framework/3d/PhongLightModel"], function (require, exports, DrawingPackage3d_1, WebGLUtils_1, DrawingObject3d_1, PhongLightModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Pony; // 小马全身
    var vBuffer, nBuffer, tBuffer;
    var lightBulbPosition = [0.0, 0.0, 0.0];
    var PonyMaterial = new PhongLightModel_1.PhongLightModel({
        lightPosition: lightBulbPosition,
        ambientColor: [255, 255, 255],
        ambientMaterial: [200, 200, 200],
        diffuseColor: [255, 255, 255],
        diffuseMaterial: [66, 66, 66],
        specularColor: [255, 255, 255],
        specularMaterial: [200, 200, 200],
        materialShiness: 30.0
    });
    function PonyModifyLightBuldPosition(newPos) {
        lightBulbPosition = newPos;
    }
    exports.PonyModifyLightBuldPosition = PonyModifyLightBuldPosition;
    function initPony(helper, _lightBulbPosition, ponyProgram) {
        return __awaiter(this, void 0, void 0, function () {
            var initPonyModelMat, urls, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        helper.switchProgram(ponyProgram);
                        PonyModifyLightBuldPosition(_lightBulbPosition);
                        vBuffer = helper.createBuffer();
                        tBuffer = helper.createBuffer();
                        nBuffer = helper.createBuffer();
                        initPonyModelMat = mult(rotateZ(180), rotateX(270));
                        initPonyModelMat = mult(translate(0.7, -1.32, 0.5), initPonyModelMat);
                        initPonyModelMat = mult(WebGLUtils_1.scaleMat(0.75, 0.75, 0.75), initPonyModelMat);
                        Pony = new (DrawingPackage3d_1.DrawingPackage3d.bind.apply(DrawingPackage3d_1.DrawingPackage3d, __spreadArrays([void 0, initPonyModelMat], [
                            new DrawingObject3d_1.DrawingObject3d('body', './model/normed/Pony/pony.obj', './model/texture/Pony/pony.png', 6),
                            new DrawingObject3d_1.DrawingObject3d('tail', './model/normed/Pony/tail.obj', './model/texture/Pony/tail.png', 7),
                            new DrawingObject3d_1.DrawingObject3d('hairBack', './model/normed/Pony/hairBack.obj', './model/texture/Pony/hairBack.png', 8),
                            new DrawingObject3d_1.DrawingObject3d('hairFront', './model/normed/Pony/hairFront.obj', './model/texture/Pony/hairFront.png', 9),
                            new DrawingObject3d_1.DrawingObject3d('horn', './model/normed/Pony/horn.obj', './model/texture/Pony/horn.png', 10),
                            new DrawingObject3d_1.DrawingObject3d('leftEye', './model/normed/Pony/leftEye.obj', './model/texture/Pony/leftEye.png', 11),
                            new DrawingObject3d_1.DrawingObject3d('rightEye', './model/normed/Pony/rightEye.obj', './model/texture/Pony/rightEye.png', 12),
                            new DrawingObject3d_1.DrawingObject3d('teeth', './model/normed/Pony/teeth.obj', './model/texture/Pony/teeth.png', 13),
                            new DrawingObject3d_1.DrawingObject3d('eyelashes', './model/normed/Pony/eyelashes.obj', './model/texture/Pony/eyelashes.png', 14),
                        ])))();
                        urls = [];
                        Pony.innerList.forEach(function (obj) {
                            urls.push(obj.texturePath);
                        });
                        _b = (_a = helper).sendTextureImageToGPU;
                        return [4 /*yield*/, WebGLUtils_1.loadImageAsync(urls)];
                    case 1:
                        _b.apply(_a, [_c.sent(), 6, 15]);
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.initPony = initPony;
    function renderPony(helper, ctm, perspectiveMat, ponyProgram) {
        helper.switchProgram(ponyProgram);
        var gl = helper.glContext;
        helper.prepare({
            attributes: [],
            uniforms: [
                { varName: 'uWorldMatrix', data: flatten(ctm), method: 'Matrix4fv' },
                { varName: 'uLightCtm', data: flatten(ctm), method: 'Matrix4fv' },
                { varName: 'uModelMatrix', data: flatten(Pony.modelMat), method: 'Matrix4fv' },
                { varName: 'uProjectionMatrix', data: flatten(perspectiveMat), method: 'Matrix4fv' },
                { varName: 'uLightPosition', data: __spreadArrays(lightBulbPosition, [1.0]), method: '4fv' },
                { varName: 'uShiness', data: PonyMaterial.materialShiness, method: '1f' },
                { varName: 'uAmbientProduct', data: PonyMaterial.ambientProduct, method: '4fv' },
                { varName: 'uDiffuseProduct', data: PonyMaterial.diffuseProduct, method: '4fv' },
                { varName: 'uSpecularProduct', data: PonyMaterial.specularProduct, method: '4fv' },
                {
                    varName: 'uWorldMatrixTransInv', data: flatten(transpose(inverse(mat3(Pony.modelMat[0][0], Pony.modelMat[0][1], Pony.modelMat[0][2], Pony.modelMat[1][0], Pony.modelMat[1][1], Pony.modelMat[1][2], Pony.modelMat[2][0], Pony.modelMat[2][1], Pony.modelMat[2][2])))), method: 'Matrix3fv'
                },
            ]
        });
        Pony.innerList.forEach(function (obj) {
            var vs = helper.analyzeFtoV(obj, 'fs'), vts = helper.analyzeFtoV(obj, 'fts'), vns = helper.analyzeFtoV(obj, 'fns');
            helper.prepare({
                attributes: [
                    { buffer: vBuffer, data: flatten(vs), varName: 'aPosition', attrPer: 3, type: gl.FLOAT },
                    { buffer: tBuffer, data: flatten(vts), varName: 'aTexCoord', attrPer: 2, type: gl.FLOAT },
                    { buffer: nBuffer, data: flatten(vns), varName: 'aNormal', attrPer: 3, type: gl.FLOAT },
                ],
                uniforms: [
                    { varName: 'uTexture', data: obj.textureIndex, method: '1i' },
                ]
            });
            helper.drawArrays(gl.TRIANGLES, 0, obj.objProcessor.getEffectiveVertexCount());
        });
    }
    exports.renderPony = renderPony;
});
