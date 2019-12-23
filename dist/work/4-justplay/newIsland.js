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
define(["require", "exports", "./roam", "./sword", "../../framework/WebGLUtils"], function (require, exports, roam_1, sword_1, WebGLUtils_1) {
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
    var insertSwordUponMagicCube = function () {
        // TODO: HOW?
    };
    var RED = vec4(1.0, 0.0, 0.0, 1.0), GREEN = vec4(0.0, 1.0, 0.0, 1.0), YELLOW = vec4(1.0, 1.0, 0.0, 1.0);
    var gotoAndLookAt = function (goto, look) {
        roam_1.forceSetCamera(goto, look);
    };
    var zoomIn = function (howmuch) {
    };
    var upDownWave = function () {
    };
    var leftRightWave = function () {
    };
    var colorList = [RED, GREEN, YELLOW];
    var colorPointer = 0;
    var cameraPosition = {
        'lookPony': [
            vec3(0.521367, -0.5, -0.362234),
            vec3(0.39602, 0.07533, 0.91515) // front
        ]
    };
    function performNewIsland() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, playNewIsland()];
                    case 1:
                        _a.sent();
                        insertSwordUponMagicCube();
                        startShakingCTM();
                        return [4 /*yield*/, WebGLUtils_1.mySetTimeout(function () { stopShakingCTM(); }, 3200)]; // 模拟抖动3200ms
                    case 2:
                        _a.sent(); // 模拟抖动3200ms
                        window.setInterval(function () { changeSwordColorTo(colorList[colorPointer]); colorPointer += 1; colorPointer %= 3; }, 200); // 剑持续换色
                        roam_1.forceSetCamera.apply(void 0, cameraPosition['lookPony']);
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.performNewIsland = performNewIsland;
});
