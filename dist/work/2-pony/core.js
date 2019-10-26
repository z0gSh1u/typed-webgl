// Core code of 2-Pony.
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
define(["require", "exports", "../../framework/3d/WebGLHelper3d", "../../framework/WebGLUtils", "../../framework/3d/OBJProcessor", "../../3rd-party/MV", "../../3rd-party/initShaders"], function (require, exports, WebGLHelper3d_1, WebGLUtils, OBJProcessor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebGLUtils = __importStar(WebGLUtils);
    // common variables
    var canvasDOM = document.querySelector('#cvs');
    var gl = canvasDOM.getContext('webgl');
    var program;
    var helper;
    var vBuffer;
    var ctm; // current world matrix
    var ponyVertices = [];
    var objProcessor;
    // global status recorder
    var COORD_SYS = {
        SELF: 0, WORLD: 1
    };
    var currentCoordSys = COORD_SYS.WORLD;
    // global constant
    var ROTATE_DELTA = 10; // 每次转多少度，角度制
    var COS_RD = Math.cos(radians(ROTATE_DELTA));
    var SIN_RD = Math.sin(radians(ROTATE_DELTA));
    var TRANSLATE_DELTA = 0.010; // 每次平移多少距离，WebGL归一化系
    // main function
    var main = function () {
        // initialization
        WebGLUtils.initializeCanvas(gl, canvasDOM);
        program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl');
        helper = new WebGLHelper3d_1.WebGLHelper3d(canvasDOM, gl, program);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        vBuffer = helper.createBuffer();
        initializePony();
    };
    // 坐标系切换处理
    document.querySelector('#coordToggler').onclick = function () {
        currentCoordSys = (currentCoordSys + 1) % 2;
        if (currentCoordSys == COORD_SYS.SELF) {
            document.querySelector('#curCoord_screen').style.display = 'none';
            document.querySelector('#curCoord_object').style.display = 'inline-block';
        }
        else {
            document.querySelector('#curCoord_screen').style.display = 'inline-block';
            document.querySelector('#curCoord_object').style.display = 'none';
        }
    };
    // initialize the pony
    function initializePony() {
        return __awaiter(this, void 0, void 0, function () {
            var responseData_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        responseData_1 = '';
                        return [4 /*yield*/, axios.get('./model/normed/pony.obj').then(function (res) {
                                responseData_1 = res.data;
                            })];
                    case 1:
                        _a.sent();
                        objProcessor = new OBJProcessor_1.OBJProcessor(responseData_1);
                        // 把各个面的组成推进去
                        objProcessor.fs.forEach(function (face) {
                            face.forEach(function (vOfFace) {
                                var subscript = vOfFace - 1;
                                ponyVertices.push(objProcessor.vs[subscript]); // xyzxyzxyz
                            });
                        });
                        helper.useBuffer(vBuffer);
                        helper.sendDataToBuffer(flatten(ponyVertices));
                        helper.vertexSettingMode(vBuffer, 'aPosition', 3);
                        helper.setUniformColor('uColor', [0, 0, 0]);
                        ctm = mat4();
                        reRender();
                        return [2 /*return*/];
                }
            });
        });
    }
    // 重渲染
    var reRender = function () {
        helper.clearCanvas();
        helper.setUniformMatrix4d('uWorldMatrix', ctm);
        helper.setUniformMatrix4d('uModelMatrix', mat4());
        helper.drawArrays(gl.LINE_LOOP, 0, objProcessor.getEffectiveVertexCount());
    };
    // 键盘监听
    var listenKeyboard = function () {
        var handlers = {
            '88' /*X*/: processXKey,
            '89' /*Y*/: processYKey,
            '90' /*Z*/: processZKey,
            '87' /*W*/: processWKey,
            '65' /*A*/: processAKey,
            '83' /*S*/: processSKey,
            '68' /*D*/: processDKey
        };
        window.onkeydown = function (e) {
            if (e && e.keyCode) {
                try {
                    handlers[e.keyCode.toString()].call(null);
                }
                catch (ex) { }
            }
        };
    };
    // W键，上平移或前进
    var processWKey = function () {
        if (currentCoordSys == COORD_SYS.WORLD) {
            // 向上平移(y axis add)
            var transMat = mat4(1, 0, 0, 0, 0, 1, 0, TRANSLATE_DELTA, 0, 0, 1, 0, 0, 0, 0, 1);
            ctm = mult(transMat, ctm);
            helper.setUniformMatrix4d('uWorldMatrix', ctm);
            reRender();
        }
    };
    // A键，左平移或左转向
    var processAKey = function () {
        if (currentCoordSys == COORD_SYS.WORLD) {
            // 向左平移(x axis minus)
            var transMat = mat4(1, 0, 0, -TRANSLATE_DELTA, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            ctm = mult(transMat, ctm);
            helper.setUniformMatrix4d('uWorldMatrix', ctm);
            reRender();
        }
    };
    // S键，下平移或后退
    var processSKey = function () {
        if (currentCoordSys == COORD_SYS.WORLD) {
            // 向下平移(y axis minus)
            var transMat = mat4(1, 0, 0, 0, 0, 1, 0, -TRANSLATE_DELTA, 0, 0, 1, 0, 0, 0, 0, 1);
            ctm = mult(transMat, ctm);
            helper.setUniformMatrix4d('uWorldMatrix', ctm);
            reRender();
        }
    };
    // D键，右平移或右转向
    var processDKey = function () {
        if (currentCoordSys == COORD_SYS.WORLD) {
            // 向右平移(x axis add)
            var transMat = mat4(1, 0, 0, TRANSLATE_DELTA, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            ctm = mult(transMat, ctm);
            helper.setUniformMatrix4d('uWorldMatrix', ctm);
            reRender();
        }
    };
    // X键，绕世界系X轴旋转
    var processXKey = function () {
        if (currentCoordSys != COORD_SYS.WORLD) {
            return;
        }
        var transMat = mat4(1, 0, 0, 0, 0, COS_RD, -SIN_RD, 0, 0, SIN_RD, COS_RD, 0, 0, 0, 0, 1);
        ctm = mult(transMat, ctm);
        helper.setUniformMatrix4d('uWorldMatrix', ctm);
        reRender();
    };
    // Y键，绕世界系Y轴旋转
    var processYKey = function () {
        if (currentCoordSys != COORD_SYS.WORLD) {
            return;
        }
        var transMat = mat4(COS_RD, 0, SIN_RD, 0, 0, 1, 0, 0, -SIN_RD, 0, COS_RD, 0, 0, 0, 0, 1);
        ctm = mult(transMat, ctm);
        helper.setUniformMatrix4d('uWorldMatrix', ctm);
        reRender();
    };
    // Z键，绕世界系Z轴旋转
    var processZKey = function () {
        if (currentCoordSys != COORD_SYS.WORLD) {
            return;
        }
        var transMat = mat4(COS_RD, -SIN_RD, 0, 0, SIN_RD, COS_RD, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        ctm = mult(transMat, ctm);
        helper.setUniformMatrix4d('uWorldMatrix', ctm);
        reRender();
    };
    // do it
    main();
    listenKeyboard();
});
