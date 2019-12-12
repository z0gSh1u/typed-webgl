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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "../../framework/3d/WebGLHelper3d", "../../framework/WebGLUtils", "../../3rd-party/MV", "../../3rd-party/initShaders"], function (require, exports, WebGLHelper3d_1, WebGLUtils) {
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
        SKYBOX: 0, PONY: 1
    };
    var ctm;
    var cpm;
    // ==================================
    // 透视使用
    // ==================================
    var fovy = 60.0;
    var aspect = -16 / 9;
    var near = 0.1;
    var far = 100.0;
    var preCalculatedCPM = perspective(fovy, aspect, near, far);
    // ==================================
    // 盒空间
    // ==================================
    var SkyBoxVBuffer;
    // ==================================
    // 观察相机使用
    // !! 请注意，pos->at与pos->up不能共线 !!
    // ==================================
    var ROTATE_PER_Y_FPV = 0.09;
    var ROTATE_PER_X_FPV = 0.09;
    var VEC_Y = vec3(0.0, 1.0, 0.0);
    var ANGLE_UP_MAX = 89;
    var ANGLE_DOWN_MAX = -89;
    var VEC_UP_MAX = vec4(0.0, Math.sin(ANGLE_UP_MAX), Math.cos(ANGLE_UP_MAX), 1);
    var VEC_DOWN_MAX = vec4(0.0, Math.sin(ANGLE_DOWN_MAX), Math.cos(ANGLE_DOWN_MAX), 1);
    var INTERVAL = 40; // 速度降低的毫秒间隔
    var curTick;
    var lastTick;
    var cameraPos = vec3(0.0, 0.0, -1.0);
    var cameraFront = vec3(0.0, 0.1, 1.0);
    var cameraSpeed = 0.04;
    var cameraMoveId = 0; // 相机移动计时器编号
    // 初始化
    var main = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    WebGLUtils.initializeCanvas(gl, canvasDOM);
                    helper = new WebGLHelper3d_1.WebGLHelper3d(canvasDOM, gl, [
                        WebGLUtils.initializeShaders(gl, './shader/vSkyBox.glsl', './shader/fSkyBox.glsl'),
                    ]);
                    gl.enable(gl.DEPTH_TEST);
                    ctm = mat4();
                    cpm = mat4();
                    // 初始化各buffer
                    SkyBoxVBuffer = helper.createBuffer();
                    return [4 /*yield*/, initBox()];
                case 1:
                    _a.sent();
                    listenKeyboardFPV();
                    listenMouseToTurnCamera();
                    return [2 /*return*/];
            }
        });
    }); };
    var initBox = function () { return __awaiter(void 0, void 0, void 0, function () {
        var texture, faceInfos;
        return __generator(this, function (_a) {
            helper.switchProgram(PROGRAMS.SKYBOX);
            texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
            faceInfos = [
                {
                    target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                    url: './model/texture/SkyBox/right.png'
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                    url: './model/texture/SkyBox/left.png',
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                    url: './model/texture/SkyBox/up.png',
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                    url: './model/texture/SkyBox/down.png',
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                    url: './model/texture/SkyBox/back.png',
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                    url: './model/texture/SkyBox/front.png',
                },
            ];
            faceInfos.forEach(function (faceInfo) {
                var target = faceInfo.target, url = faceInfo.url;
                var level = 0;
                var format = gl.RGBA;
                var width = 512;
                var height = 512;
                var type = gl.UNSIGNED_BYTE;
                gl.texImage2D(target, level, format, width, height, 0, format, type, null);
                var image = new Image();
                image.src = url;
                image.onload = function () {
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                    gl.texImage2D(target, level, format, format, type, image);
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                };
            });
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            reRender();
            return [2 /*return*/];
        });
    }); };
    var reRenderSkyBox = function () {
        var positions = [
            [-1, -1],
            [1, -1],
            [-1, 1],
            [-1, 1],
            [1, -1],
            [1, 1],
        ];
        var cameraMatrix = lookAt(cameraPos, add(cameraPos, cameraFront), VEC_Y);
        var viewMatrix = inverse(cameraMatrix);
        var temp = mult(preCalculatedCPM, viewMatrix);
        helper.prepare({
            attributes: [
                { buffer: SkyBoxVBuffer, data: flatten(positions), varName: 'aPosition', attrPer: 2, type: gl.FLOAT },
            ],
            uniforms: [
                { varName: 'cubeTexture', data: 0, method: '1i' },
                { varName: 'modelViewMatrix', data: flatten(inverse(temp)), method: 'Matrix4fv' },
                { varName: 'projectionMatrix', data: flatten(mat4()), method: 'Matrix4fv' },
            ]
        });
        helper.drawArrays(gl.TRIANGLES, 0, 6);
    };
    var reRender = function () {
        //ctm = lookAt(cameraPos, add(cameraPos, cameraFront) as Vec3, VEC_Y)
        reRenderSkyBox();
    };
    // ==================================
    // 第一人称视角实现
    // ==================================
    // 鼠标侦听
    var listenMouseToTurnCamera = function () {
        canvasDOM.onmousedown = function (evt) {
            var mousePoint = [evt.offsetX, evt.offsetY];
            var lastTrickTick = new Date().getTime();
            var curTrickTick = lastTick;
            var MIN_INTERVAL = 40;
            canvasDOM.onmousemove = function (evt2) {
                curTrickTick = new Date().getTime();
                if (curTrickTick - lastTrickTick < MIN_INTERVAL) {
                    return;
                }
                lastTrickTick = curTrickTick;
                var newMousePoint = [evt2.offsetX, evt2.offsetY];
                var translateVector = newMousePoint.map(function (v, i) { return v - mousePoint[i]; });
                mousePoint = newMousePoint;
                cameraFront = normalize(vec3.apply(void 0, mult(rotateY(ROTATE_PER_X_FPV * translateVector[0]), vec4.apply(void 0, __spreadArrays(cameraFront, [1])))
                    .slice(0, 3)), false);
                var initZ = Math.sqrt(cameraFront[0] * cameraFront[0] + cameraFront[2] * cameraFront[2]);
                var tempVec = vec4(0, cameraFront[1], initZ, 1);
                tempVec = mult(rotateX(ROTATE_PER_Y_FPV * translateVector[1]), tempVec);
                if (tempVec[1] > VEC_UP_MAX[1] && tempVec[2] >= 0 || tempVec[1] > 0 && tempVec[2] < 0) {
                    tempVec = VEC_UP_MAX;
                }
                else if (tempVec[1] < VEC_DOWN_MAX[1] && tempVec[2] >= 0 || tempVec[1] < 0 && tempVec[2] < 0) {
                    tempVec = VEC_DOWN_MAX;
                }
                var newZ = tempVec[2];
                cameraFront = vec3(cameraFront[0] * newZ / initZ, tempVec[1], cameraFront[2] * newZ / initZ);
                reRender();
            };
        };
        // 如果想要不按住也可以鼠标观察，则注释下列钩子
        canvasDOM.onmouseup = function () {
            canvasDOM.onmousemove = function () { };
        };
    };
    // 键盘侦听
    var isKeyDown = {
        '87' /*W*/: false,
        '65' /*A*/: false,
        '83' /*S*/: false,
        '68' /*D*/: false,
        '32' /*Space*/: false,
        '16' /*Shift*/: false
    };
    var listenKeyboardFPV = function () {
        isKeyDown['87'] = isKeyDown['65'] = isKeyDown['83'] = isKeyDown['68'] = isKeyDown['32'] = isKeyDown['16'] = false;
        window.onkeydown = function (e) {
            if (e && e.keyCode) {
                isKeyDown[e.keyCode] = true;
                if (cameraMoveId == 0) {
                    cameraMoveId = window.setInterval(moveCamera, INTERVAL);
                }
            }
        };
        window.onkeyup = function (e) {
            if (e && e.keyCode) {
                isKeyDown[e.keyCode] = false;
            }
        };
    };
    var moveCamera = function () {
        var cameraMoveSpeed = vec3(0, 0, 0);
        var frontVec = normalize(vec3(cameraFront[0], 0, cameraFront[2]), false);
        var leftVec = normalize(cross(VEC_Y, cameraFront), false);
        var moveFlag = false;
        if (isKeyDown['87' /*W*/]) {
            cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(cameraSpeed), frontVec));
            moveFlag = true;
        }
        if (isKeyDown['83' /*S*/]) {
            cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(-cameraSpeed), frontVec));
            moveFlag = true;
        }
        if (isKeyDown['65' /*A*/]) {
            cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(-cameraSpeed), leftVec));
            moveFlag = true;
        }
        if (isKeyDown['68' /*D*/]) {
            cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(cameraSpeed), leftVec));
            moveFlag = true;
        }
        if (isKeyDown['32' /*Space*/]) {
            cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(cameraSpeed), VEC_Y));
            moveFlag = true;
        }
        if (isKeyDown['16' /*Shift*/]) {
            cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(-cameraSpeed), VEC_Y));
            moveFlag = true;
        }
        if (!moveFlag) {
            clearInterval(cameraMoveId);
            cameraMoveId = 0;
            return;
        }
        cameraPos = add(cameraPos, cameraMoveSpeed);
        reRender();
    };
    main();
});
