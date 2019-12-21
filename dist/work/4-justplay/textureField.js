// ==================================
// 纹理场实现
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
define(["require", "exports", "../../framework/WebGLUtils"], function (require, exports, WebGLUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TFVBuffer;
    var TFTBuffer;
    function initTF(helper, skyBoxProgram) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        TFVBuffer = helper.createBuffer();
                        TFTBuffer = helper.createBuffer();
                        helper.switchProgram(skyBoxProgram);
                        _b = (_a = helper).sendTextureImageToGPU;
                        return [4 /*yield*/, WebGLUtils_1.loadImageAsync([
                                './model/texture/SkyBox/front.png',
                            ])];
                    case 1:
                        _b.apply(_a, [_c.sent(), 5, 6]); // 0~5 texture
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.initTF = initTF;
    var n = 1.0;
    var frontCoord = [
        [-n, -n, 1.0], [n, -n, 1.0],
        [n, n, 1.0], [-n, n, 1.0]
    ];
    var part = 0.33;
    var texCoords = [
        [0.0, 0.0], [part, 0.0],
        [part, part], [0.0, part]
    ];
    var STEP = 0.04;
    var currentLine = 0;
    var currentX = 0, currentY = 0; // 都是起点，一个part*part方块
    function stepTFStatus() {
        currentX += STEP;
        if (currentX >= 1) { // 换行
            currentX = 0;
            currentLine = (currentLine + 1) % 3;
        }
        currentY = currentLine * part;
        texCoords = [
            [currentX, currentY], [currentX + part, currentY],
            [currentX + part, currentY + part], [currentX, currentY + part],
        ];
    }
    exports.stepTFStatus = stepTFStatus;
    function renderTF(helper, lookAt, perspectiveMat, skyBoxProgram) {
        helper.switchProgram(skyBoxProgram);
        var gl = helper.glContext;
        helper.prepare({
            attributes: [
                { buffer: TFVBuffer, data: flatten(frontCoord), varName: 'aPosition', attrPer: 3, type: gl.FLOAT },
                { buffer: TFTBuffer, data: flatten(texCoords), varName: 'aTexCoord', attrPer: 2, type: gl.FLOAT }
            ],
            uniforms: [
                { varName: 'uTexture', data: 5, method: '1i' },
                { varName: 'uPerspectiveMatrix', data: flatten(perspectiveMat), method: 'Matrix4fv' },
                { varName: 'uWorldMatrix', data: flatten(lookAt), method: 'Matrix4fv' }
            ]
        });
        helper.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
    exports.renderTF = renderTF;
});
