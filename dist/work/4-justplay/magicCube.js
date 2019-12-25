// ==================================
// 魔法方块（环境反射）
// by z0gSh1u, LongChen, Twi
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
define(["require", "exports", "./roam", "../../framework/WebGLUtils"], function (require, exports, roam_1, WebGLUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var vBuffer;
    var nBuffer;
    var texture;
    exports.MagicCubeActBox = [vec3(-0.16, -0.7, -0.37), vec3(0.16, -0.35, 0.08)];
    function initMagicCube(canvasDOM, helper, magicCubeProgram) {
        return __awaiter(this, void 0, void 0, function () {
            var gl, texture, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        helper.switchProgram(magicCubeProgram);
                        gl = helper.glContext;
                        vBuffer = helper.createBuffer();
                        nBuffer = helper.createBuffer();
                        exports.MagicCubeModelMat = translate(0, -0.5, 0.2);
                        exports.MagicCubeModelMat = mult(rotateX(45), exports.MagicCubeModelMat);
                        texture = gl.createTexture();
                        _b = (_a = helper).sendCubeMapTextureToGPU;
                        return [4 /*yield*/, WebGLUtils_1.loadImageAsync(['./model/texture/Cube/X+.png'])];
                    case 1:
                        _b.apply(_a, [(_o.sent())[0], texture, '+x']);
                        _d = (_c = helper).sendCubeMapTextureToGPU;
                        return [4 /*yield*/, WebGLUtils_1.loadImageAsync(['./model/texture/Cube/X-.png'])];
                    case 2:
                        _d.apply(_c, [(_o.sent())[0], texture, '-x']);
                        _f = (_e = helper).sendCubeMapTextureToGPU;
                        return [4 /*yield*/, WebGLUtils_1.loadImageAsync(['./model/texture/Cube/Y+.png'])];
                    case 3:
                        _f.apply(_e, [(_o.sent())[0], texture, '+y']);
                        _h = (_g = helper).sendCubeMapTextureToGPU;
                        return [4 /*yield*/, WebGLUtils_1.loadImageAsync(['./model/texture/Cube/Y-.png'])];
                    case 4:
                        _h.apply(_g, [(_o.sent())[0], texture, '-y']);
                        _k = (_j = helper).sendCubeMapTextureToGPU;
                        return [4 /*yield*/, WebGLUtils_1.loadImageAsync(['./model/texture/Cube/Z+.png'])];
                    case 5:
                        _k.apply(_j, [(_o.sent())[0], texture, '+z']);
                        _m = (_l = helper).sendCubeMapTextureToGPU;
                        return [4 /*yield*/, WebGLUtils_1.loadImageAsync(['./model/texture/Cube/Z-.png'])];
                    case 6:
                        _m.apply(_l, [(_o.sent())[0], texture, '-z']);
                        helper.postProcessCubeMapTexture();
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.initMagicCube = initMagicCube;
    function renderMagicCube(helper, perspectiveMat, programIndex) {
        helper.switchProgram(programIndex);
        var gl = helper.glContext;
        helper.prepare({
            attributes: [
                { buffer: vBuffer, data: positions, varName: 'aPoition', attrPer: 3, type: gl.FLOAT },
                { buffer: nBuffer, data: normals, varName: 'aNormal', attrPer: 3, type: gl.FLOAT },
            ],
            uniforms: [
                { varName: 'texMap', data: 20, method: '1i' },
                { varName: 'uWorldMatrix', data: flatten(roam_1.getLookAt()), method: 'Matrix4fv' },
                { varName: 'uModelMatrix', data: flatten(exports.MagicCubeModelMat), method: 'Matrix4fv' },
                { varName: 'uProjectionMatrix', data: flatten(perspectiveMat), method: 'Matrix4fv' },
                { varName: 'uModelInvTransMatrix', data: flatten(transpose(inverse(exports.MagicCubeModelMat))), method: 'Matrix4fv' },
                { varName: 'uSightLine', data: add(roam_1.cameraPos, roam_1.cameraFront), method: '3fv' }
            ]
        });
        helper.drawArrays(gl.TRIANGLES, 0, 6 * 6);
    }
    exports.renderMagicCube = renderMagicCube;
    function startMagicCubeAutoRotate(msPeriod) {
        window.setInterval(function () {
            exports.MagicCubeModelMat = mult(exports.MagicCubeModelMat, rotateY(3));
        }, msPeriod);
    }
    exports.startMagicCubeAutoRotate = startMagicCubeAutoRotate;
    // 坐标信息
    var n = 0.15;
    var positions = new Float32Array([
        -n, -n, -n, -n, n, -n, n, -n, -n, -n, n, -n,
        n, n, -n, n, -n, -n, -n, -n, n, n, -n, n,
        -n, n, n, -n, n, n, n, -n, n, n, n, n,
        -n, n, -n, -n, n, n, n, n, -n, -n, n, n,
        n, n, n, n, n, -n, -n, -n, -n, n, -n, -n,
        -n, -n, n, -n, -n, n, n, -n, -n, n, -n, n,
        -n, -n, -n, -n, -n, n, -n, n, -n, -n, -n, n,
        -n, n, n, -n, n, -n, n, -n, -n, n, n, -n,
        n, -n, n, n, -n, n, n, n, -n, n, n, n,
    ]);
    var normals = new Float32Array([
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
        0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1,
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
        0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0,
        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    ]);
});
