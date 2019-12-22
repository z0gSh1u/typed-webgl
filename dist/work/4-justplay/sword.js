// ==================================
// 黄金剑相关代码
// by Twi & z0gSh1u
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
define(["require", "exports", "../../framework/3d/DrawingPackage3d", "../../framework/3d/DrawingObject3d", "../../framework/WebGLUtils", "../../framework/3d/PhongLightModel"], function (require, exports, DrawingPackage3d_1, DrawingObject3d_1, WebGLUtils_1, PhongLightModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var vBuffer, nBuffer;
    var Sword;
    var vs;
    var vns;
    var waveLock = false;
    var lightBulbPosition = [0.0, 0.0, 0.0];
    exports.SwordMaterial = new PhongLightModel_1.PhongLightModel({
        lightPosition: lightBulbPosition,
        ambientColor: [255, 255, 255],
        ambientMaterial: [200, 200, 200],
        diffuseColor: [255, 255, 255],
        diffuseMaterial: [66, 66, 66],
        specularColor: [255, 255, 255],
        specularMaterial: [200, 200, 200],
        materialShiness: 90.0
    });
    function SwordModifyLightBulbPosition(newPos) {
        lightBulbPosition = newPos;
    }
    exports.SwordModifyLightBulbPosition = SwordModifyLightBulbPosition;
    function initSword(helper, _lightBulbPosition, swordProgram) {
        return __awaiter(this, void 0, void 0, function () {
            var initSwordMat;
            return __generator(this, function (_a) {
                helper.switchProgram(swordProgram);
                vBuffer = helper.createBuffer();
                nBuffer = helper.createBuffer();
                initSwordMat = mat4();
                initSwordMat = mult(initSwordMat, rotateX(90));
                initSwordMat = mult(initSwordMat, rotateZ(60));
                initSwordMat = mult(translate(0.85, -0.9, 0.9), initSwordMat);
                Sword = new (DrawingPackage3d_1.DrawingPackage3d.bind.apply(DrawingPackage3d_1.DrawingPackage3d, __spreadArrays([void 0, initSwordMat], [
                    new DrawingObject3d_1.DrawingObject3d('sword', './model/normed/minecraft_sword.obj')
                ])))();
                vs = helper.analyzeFtoV(Sword.getObjectByName('sword'), 'fs');
                vns = helper.analyzeFtoV(Sword.getObjectByName('sword'), 'fns');
                vns = vns.map(function (v3) {
                    var v4 = vec4.apply(void 0, __spreadArrays(v3, [1.0]));
                    var shaker = vec3(Math.random(), Math.random(), Math.random());
                    v4 = mult(translate.apply(void 0, shaker), v4);
                    return vec3.apply(void 0, v4);
                });
                return [2 /*return*/];
            });
        });
    }
    exports.initSword = initSword;
    function renderSword(helper, ctm, swordProgram) {
        helper.switchProgram(swordProgram);
        var gl = helper.glContext;
        helper.prepare({
            attributes: [],
            uniforms: [
                { varName: 'uWorldMatrix', data: flatten(mat4()), method: 'Matrix4fv' },
                { varName: 'uModelMatrix', data: flatten(Sword.modelMat), method: 'Matrix4fv' },
                { varName: 'uLightCtm', data: flatten(ctm), method: 'Matrix4fv' },
                { varName: 'uLightPosition', data: __spreadArrays(lightBulbPosition, [1.0]), method: '4fv' },
                { varName: 'uShiness', data: exports.SwordMaterial.materialShiness, method: '1f' },
                { varName: 'uAmbientProduct', data: exports.SwordMaterial.ambientProduct, method: '4fv' },
                { varName: 'uDiffuseProduct', data: exports.SwordMaterial.diffuseProduct, method: '4fv' },
                { varName: 'uSpecularProduct', data: exports.SwordMaterial.specularProduct, method: '4fv' },
                {
                    varName: 'uWorldMatrixTransInv', data: flatten(transpose(inverse(mat3(Sword.modelMat[0][0], Sword.modelMat[0][1], Sword.modelMat[0][2], Sword.modelMat[1][0], Sword.modelMat[1][1], Sword.modelMat[1][2], Sword.modelMat[2][0], Sword.modelMat[2][1], Sword.modelMat[2][2])))), method: 'Matrix3fv'
                },
            ]
        });
        Sword.innerList.forEach(function (obj) {
            helper.prepare({
                attributes: [
                    { buffer: vBuffer, data: flatten(vs), varName: 'aPosition', attrPer: 3, type: gl.FLOAT },
                    { buffer: nBuffer, data: flatten(vns), varName: 'aNormal', attrPer: 3, type: gl.FLOAT },
                ],
                uniforms: [
                    { varName: 'uColor', data: WebGLUtils_1.normalize8bitColor([255, 222, 13]), method: '4fv' }
                ]
            });
            helper.drawArrays(gl.TRIANGLES, 0, obj.objProcessor.getEffectiveVertexCount());
        });
    }
    exports.renderSword = renderSword;
    function waveSword() {
        if (waveLock) {
            return;
        }
        waveLock = true;
        var old = Sword.modelMat;
        Sword.setModelMat(mult(old, rotateX(10)));
        window.setTimeout(function () { Sword.setModelMat(old); waveLock = false; }, 150);
    }
    exports.waveSword = waveSword;
});
