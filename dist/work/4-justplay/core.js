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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "../../framework/3d/WebGLHelper3d", "../../framework/WebGLUtils", "./skybox", "./roam", "./pony", "./textureField", "./light", "../../3rd-party/MV", "../../3rd-party/initShaders"], function (require, exports, WebGLHelper3d_1, WebGLUtils, skybox_1, roam_1, pony_1, textureField_1, light_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebGLUtils = __importStar(WebGLUtils);
    // ==================================
    // 主要变量
    // ==================================
    var canvasDOM = document.querySelector('#cvs');
    var gl = canvasDOM.getContext('webgl');
    var helper;
    var PROGRAMS = {
        SKYBOX: 0, PONY: 1, LAPPLAND: 2
    };
    var lightBulbPosition = vec3(0.5, 0.5, 0.0); // 光源位置
    // 材质分配
    /**
     * 0~5：天空盒，其中5为纹理场
     * 6~14：小马
     */
    var main = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    WebGLUtils.initializeCanvas(gl, canvasDOM);
                    helper = new WebGLHelper3d_1.WebGLHelper3d(canvasDOM, gl, [
                        WebGLUtils.initializeShaders(gl, './shader/SkyBox.glslv', './shader/SkyBox.glslf'),
                        WebGLUtils.initializeShaders(gl, './shader/Pony.glslv', './shader/Pony.glslf'),
                    ]);
                    gl.enable(gl.DEPTH_TEST);
                    return [4 /*yield*/, skybox_1.initSkyBox(helper, PROGRAMS.SKYBOX)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, pony_1.initPony(helper, lightBulbPosition, PROGRAMS.PONY)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, textureField_1.initTF(helper, PROGRAMS.SKYBOX)];
                case 3:
                    _a.sent();
                    roam_1.enableRoaming(canvasDOM);
                    light_1.startLightBulbAutoRotate(100);
                    // 纹理场行动
                    window.setInterval(function () {
                        textureField_1.stepTFStatus();
                    }, 150);
                    // 全局统一重新渲染
                    window.setInterval(function () {
                        reRender();
                    }, 30); // 60 fps
                    return [2 /*return*/];
            }
        });
    }); };
    // 全局统一重新渲染
    var reRender = function () {
        pony_1.PonyModifyLightBuldPosition(light_1.getLightBulbPosition());
        pony_1.renderPony(helper, roam_1.getLookAt(), roam_1.preCalculatedCPM, PROGRAMS.PONY);
        skybox_1.renderSkyBox(helper, roam_1.getLookAt(), roam_1.preCalculatedCPM, PROGRAMS.SKYBOX);
        textureField_1.renderTF(helper, roam_1.getLookAt(), roam_1.preCalculatedCPM, PROGRAMS.SKYBOX);
    };
    main();
});
