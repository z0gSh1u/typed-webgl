// ==================================
// 新宝岛相关功能
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
define(["require", "exports", "./roam", "./sword", "../../framework/WebGLUtils", "./pony"], function (require, exports, roam_1, sword_1, WebGLUtils_1, pony_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // ==================================
    // 播放新宝岛
    // ==================================
    function playNewIsland() {
        var audio = new Audio('./music.mp3');
        return audio.play();
    }
    exports.playNewIsland = playNewIsland;
    // ==================================
    // 视野抖动
    // ==================================
    exports.isShakingCTM = false;
    exports.shakedCTM = mat4();
    var timer = void 233;
    function wrappedGetLookAt() {
        return exports.isShakingCTM ? exports.shakedCTM : roam_1.getLookAt();
    }
    exports.wrappedGetLookAt = wrappedGetLookAt;
    var shakeCTMAtom = function () { return mult(translate.apply(void 0, [0, 0, 0].map(function (_) { return (Math.random() - 0.5) / 30; })), roam_1.getLookAt()); };
    var startShakingCTM = function () {
        exports.isShakingCTM = true;
        timer = window.setInterval(function () {
            exports.shakedCTM = shakeCTMAtom();
        }, 50);
    };
    var stopShakingCTM = function () {
        exports.isShakingCTM = false;
        window.clearInterval(timer);
    };
    // ==================================
    // 场景序列
    // ==================================
    var changeSwordColorTo = function (color) {
        sword_1.SwordMaterial.ambientMaterial = color;
        sword_1.SwordMaterial.diffuseMaterial = color;
        sword_1.SwordMaterial.reCalculateProducts();
    };
    var RED = vec4(1.0, 0.0, 0.0, 1.0), GREEN = vec4(0.0, 1.0, 0.0, 1.0), YELLOW = vec4(1.0, 1.0, 0.0, 1.0);
    var colorList = [RED, GREEN, YELLOW];
    var colorPointer = 0;
    function smoothZoom(from, to, front, msPeriod) {
        if (msPeriod === void 0) { msPeriod = 50; }
        var points = [];
        var _loop_1 = function (alpha) {
            // 二维凸组合
            points.push(add(__spreadArrays(from.map(function (_) { return _ * (1 - alpha); })), __spreadArrays(to.map(function (_) { return _ * alpha; }))));
        };
        for (var alpha = 0; alpha < 1; alpha += 0.08) {
            _loop_1(alpha);
        }
        var len = points.length, p = 0;
        return new Promise(function (resolve, reject) {
            var timer = window.setInterval(function () {
                roam_1.forceSetCamera(points[p], front);
                p += 1;
                if (p == len) {
                    clearInterval(timer);
                    resolve();
                }
            }, msPeriod);
        });
    }
    function smoothMove(from, to, eye, msPeriod) {
        if (msPeriod === void 0) { msPeriod = 50; }
        var points = [];
        var _loop_2 = function (alpha) {
            points.push(add(__spreadArrays(from.map(function (_) { return _ * (1 - alpha); })), __spreadArrays(to.map(function (_) { return _ * alpha; }))));
        };
        for (var alpha = 0; alpha < 1; alpha += 0.08) {
            _loop_2(alpha);
        }
        var len = points.length, p = 0;
        return new Promise(function (resolve, reject) {
            var timer = window.setInterval(function () {
                roam_1.forceSetCamera(eye, points[p]);
                p += 1;
                if (p == len) {
                    clearInterval(timer);
                    resolve();
                }
            }, msPeriod);
        });
    }
    var PonyRandomMove = function (moveSequence, msPeriod) {
        if (msPeriod === void 0) { msPeriod = 50; }
        var p = 0, len = moveSequence.length;
        return new Promise(function (resolve, reject) {
            var timer = window.setInterval(function () {
                pony_1.Pony.setModelMat(mult(pony_1.Pony.modelMat, moveSequence[p]));
                p += 1;
                if (p == len) {
                    clearInterval(timer);
                    resolve();
                }
            }, msPeriod);
        });
    };
    var simulateSpacePress = function (howlong) {
        if (howlong === void 0) { howlong = 200; }
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        roam_1.setSpaceStatus(true);
                        return [4 /*yield*/, WebGLUtils_1.mySetTimeout(function () { roam_1.setSpaceStatus(false); }, howlong)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    function performNewIsland() {
        return __awaiter(this, void 0, void 0, function () {
            var p, ms2len, ms2timer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // 放音乐
                    return [4 /*yield*/, playNewIsland()
                        // 振动
                    ];
                    case 1:
                        // 放音乐
                        _a.sent();
                        // 振动
                        startShakingCTM();
                        // 变色剑
                        window.setInterval(function () { changeSwordColorTo(colorList[colorPointer]); colorPointer += 1; colorPointer %= 3; }, 200);
                        // 模拟抖动3200ms
                        return [4 /*yield*/, WebGLUtils_1.mySetTimeout(function () { stopShakingCTM(); }, 3200)
                            // 机位行动
                        ];
                    case 2:
                        // 模拟抖动3200ms
                        _a.sent();
                        // 机位行动
                        roam_1.forceSetCamera.apply(void 0, cp['lookPony']);
                        // 等待1秒
                        return [4 /*yield*/, WebGLUtils_1.mySetTimeout(function () { }, 1000)
                            // 远近拉一次
                        ];
                    case 3:
                        // 等待1秒
                        _a.sent();
                        // 远近拉一次
                        return [4 /*yield*/, smoothZoom(cp['lookPony'][0], cp['nearPony'][0], cp['lookPony'][1])];
                    case 4:
                        // 远近拉一次
                        _a.sent();
                        return [4 /*yield*/, WebGLUtils_1.mySetTimeout(function () { }, 200)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, smoothZoom(cp['nearPony'][0], cp['lookPony'][0], cp['lookPony'][1])
                            // ----------- 对齐线 --------------
                            // 左右摇
                        ];
                    case 6:
                        _a.sent();
                        // ----------- 对齐线 --------------
                        // 左右摇
                        return [4 /*yield*/, smoothMove(cp['lookLeft'][1], cp['lookRight'][1], cp['lookLeft'][0])];
                    case 7:
                        // ----------- 对齐线 --------------
                        // 左右摇
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookRight'][1], cp['lookLeft'][1], cp['lookLeft'][0])];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookLeft'][1], cp['lookRight'][1], cp['lookLeft'][0])];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookRight'][1], cp['lookLeft'][1], cp['lookLeft'][0])];
                    case 10:
                        _a.sent();
                        roam_1.forceSetCamera.apply(void 0, cp['lookPony']);
                        return [4 /*yield*/, WebGLUtils_1.mySetTimeout(function () { }, 2900)]; // zu ki to~~
                    case 11:
                        _a.sent(); // zu ki to~~
                        return [4 /*yield*/, PonyRandomMove(moveSequence1, 100)
                            // 跳一下
                        ]; // sono zu ki to~
                    case 12:
                        _a.sent(); // sono zu ki to~
                        // 跳一下
                        return [4 /*yield*/, WebGLUtils_1.mySetTimeout(function () { }, 2000)]; // zu ki to~~  
                    case 13:
                        // 跳一下
                        _a.sent(); // zu ki to~~  
                        return [4 /*yield*/, simulateSpacePress()];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, WebGLUtils_1.mySetTimeout(function () { simulateSpacePress(); }, 500)]; // zu ki to~~
                    case 15:
                        _a.sent(); // zu ki to~~
                        return [4 /*yield*/, WebGLUtils_1.mySetTimeout(function () { }, 1000)];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, PonyRandomMove(moveSequence1, 100)];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, WebGLUtils_1.mySetTimeout(function () { }, 300)];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, PonyRandomMove(moveSequence1, 100)];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, WebGLUtils_1.mySetTimeout(function () { }, 3000)];
                    case 20:
                        _a.sent();
                        roam_1.forceSetCamera.apply(void 0, cp['lookUp']);
                        return [4 /*yield*/, WebGLUtils_1.mySetTimeout(function () { }, 5)];
                    case 21:
                        _a.sent();
                        p = 0, ms2len = moveSequence2.length;
                        ms2timer = window.setInterval(function () {
                            pony_1.Pony.setModelMat(mult(pony_1.Pony.modelMat, moveSequence2[p]));
                            p += 1;
                            p %= ms2len;
                        }, 50);
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 60)];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 60)];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 50)];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 40)];
                    case 25:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 20)];
                    case 26:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 20)];
                    case 27:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 20)];
                    case 28:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 20)];
                    case 29:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 20)];
                    case 30:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 10)];
                    case 31:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 10)];
                    case 32:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 10)];
                    case 33:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 10)];
                    case 34:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 10)];
                    case 35:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 10)];
                    case 36:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 10)];
                    case 37:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 10)];
                    case 38:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 7)];
                    case 39:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 7)];
                    case 40:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 7)];
                    case 41:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 7)];
                    case 42:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 7)];
                    case 43:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 7)];
                    case 44:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 7)];
                    case 45:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 7)];
                    case 46:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 7)];
                    case 47:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 7)];
                    case 48:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 7)];
                    case 49:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 7)];
                    case 50:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 7)];
                    case 51:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 7)];
                    case 52:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 7)];
                    case 53:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 7)];
                    case 54:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookDown'][1], cp['lookUp'][1], cp['lookUp'][0], 7)];
                    case 55:
                        _a.sent();
                        return [4 /*yield*/, smoothMove(cp['lookUp'][1], cp['lookDown'][1], cp['lookUp'][0], 7)];
                    case 56:
                        _a.sent();
                        clearInterval(ms2timer);
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.performNewIsland = performNewIsland;
    // 前段随机移动序列
    var moveSequence1 = [
        translate(0.07, 0, 0),
        translate(0.07, 0, -0.03),
        translate(-0.07, 0, 0),
        translate(0.05, 0, 0),
        translate(-0.05, 0, 0.03),
        translate(-0.05, 0, 0),
        translate(-0.05, 0, 0),
        translate(0.05, 0, 0),
    ];
    // 高潮左右横跳序列
    var moveSequence2 = [
        translate(0.12, 0, 0),
        translate(0.09, 0, 0),
        translate(-0.12, 0, 0),
        translate(-0.09, 0, 0),
    ];
    var cp = {
        'lookPony': [
            vec3(0.521367, -0.5, -0.362234),
            vec3(0.3738316, -0.026115, 0.927129) // front
        ],
        'nearPony': [
            vec3(0.45905, -0.5, -0.05723),
            vec3(0.3738316, -0.026115, 0.927129)
        ],
        'lookUp': [
            vec3(0.439758, -0.5, -0.2916108),
            vec3(0.1475383, 0.5806111, 0.800701)
        ],
        'lookDown': [
            vec3(0.439758, -0.5, -0.2916108),
            vec3(0.110558, -0.426309, 0.897796)
        ],
        'lookLeft': [
            vec3(0.439758, -0.5, -0.2916108),
            vec3(-0.68392, 0.1465398, 0.7146887),
        ],
        'lookRight': [
            vec3(0.439758, -0.5, -0.2916108),
            vec3(0.825318, 0.102904, 0.555212)
        ],
    };
});
