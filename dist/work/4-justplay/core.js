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
define(["require", "exports", "../../framework/3d/WebGLHelper3d", "../../framework/WebGLUtils", "../../framework/3d/DrawingObject3d", "../../framework/3d/DrawingPackage3d", "../../framework/3d/PhongLightModel", "../../3rd-party/MV", "../../3rd-party/initShaders"], function (require, exports, WebGLHelper3d_1, WebGLUtils, DrawingObject3d_1, DrawingPackage3d_1, PhongLightModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebGLUtils = __importStar(WebGLUtils);
    // ==================================
    // 主要变量
    // ==================================
    var canvasDOM = document.querySelector('#cvs');
    var gl = canvasDOM.getContext('webgl');
    var helper;
    var PROGRAMS = { PONY: 0, SKYBOX: 1 };
    // ==================================
    // 主体渲染使用
    // ==================================
    var lightBulbPosition = vec3(0.0, 0.0, 0.0); // 光源位置
    var PonyVBuffer; // 顶点缓冲区
    var PonyNBuffer; // 法向量缓冲区
    var PonyTBuffer; // 材质顶点缓冲区
    var ctm; // 当前世界矩阵
    var lightCtm; // [暂时的权宜] 由于观察需要覆写全局ctm，故保留一份备份用于光照计算
    var Pony; // 小马全身
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
    // ==================================
    // 背景渲染使用
    // ==================================
    var BackgroundTexture;
    var bgVBuffer;
    var bgTBuffer;
    // ==================================
    // 透视使用
    // ==================================
    var cpm;
    var fovy = 45.0;
    var aspect = -1;
    var near = 0.1;
    var far = 5.0;
    var preCalculatedCPM = perspective(fovy, aspect, near, far);
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
    var cameraPos = vec3(0.0, 0.0, -3.0);
    var cameraFront = vec3(0.0, 0.0, 1.0);
    var cameraSpeed = 0.04;
    var cameraMoveId = 0; // 相机移动计时器编号
    var INTERVAL = 40; // 速度降低的毫秒间隔
    var lastTick;
    // 初始化
    var main = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    WebGLUtils.initializeCanvas(gl, canvasDOM);
                    helper = new WebGLHelper3d_1.WebGLHelper3d(canvasDOM, gl, [
                        WebGLUtils.initializeShaders(gl, './shader/vMain.glsl', './shader/fMain.glsl'),
                        WebGLUtils.initializeShaders(gl, './shader/vBackground.glsl', './shader/fBackground.glsl'),
                    ]);
                    gl.enable(gl.DEPTH_TEST);
                    // 初始化各buffer
                    PonyVBuffer = helper.createBuffer();
                    PonyTBuffer = helper.createBuffer();
                    PonyNBuffer = helper.createBuffer();
                    bgVBuffer = helper.createBuffer();
                    bgTBuffer = helper.createBuffer();
                    ctm = mat4();
                    cpm = mat4();
                    lightCtm = mat4();
                    return [4 /*yield*/, startSceneInit()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    // 场景初始化
    var startSceneInit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, urls, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    // 初始化背景图，分配9号纹理
                    _b = (_a = helper).sendTextureImageToGPU;
                    return [4 /*yield*/, WebGLUtils.loadImageAsync(['./model/bg.png'])];
                case 1:
                    // 初始化背景图，分配9号纹理
                    _b.apply(_a, [_e.sent(), 9, 10]);
                    // 设定光球模型
                    // 设定小马模型
                    Pony = new (DrawingPackage3d_1.DrawingPackage3d.bind.apply(DrawingPackage3d_1.DrawingPackage3d, __spreadArrays([void 0, mult(translate(0, -0.35, 0), mult(rotateZ(180), rotateX(270)))], [
                        new DrawingObject3d_1.DrawingObject3d('body', './model/normed/Pony/pony.obj', './model/texture/Pony/pony.png', 0),
                        new DrawingObject3d_1.DrawingObject3d('tail', './model/normed/Pony/tail.obj', './model/texture/Pony/tail.png', 1),
                        new DrawingObject3d_1.DrawingObject3d('hairBack', './model/normed/Pony/hairBack.obj', './model/texture/Pony/hairBack.png', 2),
                        new DrawingObject3d_1.DrawingObject3d('hairFront', './model/normed/Pony/hairFront.obj', './model/texture/Pony/hairFront.png', 3),
                        new DrawingObject3d_1.DrawingObject3d('horn', './model/normed/Pony/horn.obj', './model/texture/Pony/horn.png', 4),
                        new DrawingObject3d_1.DrawingObject3d('leftEye', './model/normed/Pony/leftEye.obj', './model/texture/Pony/leftEye.png', 5),
                        new DrawingObject3d_1.DrawingObject3d('rightEye', './model/normed/Pony/rightEye.obj', './model/texture/Pony/rightEye.png', 6),
                        new DrawingObject3d_1.DrawingObject3d('teeth', './model/normed/Pony/teeth.obj', './model/texture/Pony/teeth.png', 7),
                        new DrawingObject3d_1.DrawingObject3d('eyelashes', './model/normed/Pony/eyelashes.obj', './model/texture/Pony/eyelashes.png', 8),
                    ])))();
                    urls = [];
                    Pony.innerList.forEach(function (obj) {
                        urls.push(obj.texturePath);
                    });
                    _d = (_c = helper).sendTextureImageToGPU;
                    return [4 /*yield*/, WebGLUtils.loadImageAsync(urls)];
                case 2:
                    _d.apply(_c, [_e.sent(), 0, 9]);
                    reRender(ctm);
                    return [2 /*return*/];
            }
        });
    }); };
    // 重绘背景
    var reRenderBackground = function () {
        helper.switchProgram(PROGRAMS.SKYBOX);
        var VBack = [
            [-1.0, -1.0], [1.0, -1.0],
            [1.0, 1.0], [-1.0, 1.0]
        ], vTBack = [
            [0.0, 0.0], [1.0, 0.0],
            [1.0, 1.0], [0.0, 1.0]
        ];
        // 发送背景顶点信息
        helper.prepare({
            attributes: [
                { buffer: bgVBuffer, data: flatten(VBack), varName: 'aPosition', attrPer: 2, type: gl.FLOAT },
                { buffer: bgTBuffer, data: flatten(vTBack), varName: 'aTexCoord', attrPer: 2, type: gl.FLOAT }
            ],
            uniforms: [
                { varName: 'uTexture', data: 9, method: '1i' }
            ]
        });
        helper.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    };
    // 重绘MAIN
    var reRenderMain = function (ctm) {
        helper.switchProgram(PROGRAMS.PONY);
        helper.prepare({
            attributes: [],
            uniforms: [
                { varName: 'uWorldMatrix', data: flatten(ctm), method: 'Matrix4fv' },
                { varName: 'uLightCtm', data: flatten(lightCtm), method: 'Matrix4fv' },
                { varName: 'uModelMatrix', data: flatten(Pony.modelMat), method: 'Matrix4fv' },
                { varName: 'uProjectionMatrix', data: flatten(cpm), method: 'Matrix4fv' },
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
                    { buffer: PonyVBuffer, data: flatten(vs), varName: 'aPosition', attrPer: 3, type: gl.FLOAT },
                    { buffer: PonyTBuffer, data: flatten(vts), varName: 'aTexCoord', attrPer: 2, type: gl.FLOAT },
                    { buffer: PonyNBuffer, data: flatten(vns), varName: 'aNormal', attrPer: 3, type: gl.FLOAT },
                ],
                uniforms: [
                    { varName: 'uTexture', data: obj.textureIndex, method: '1i' },
                ]
            });
            helper.drawArrays(gl.TRIANGLES, 0, obj.objProcessor.getEffectiveVertexCount());
        });
        // reRender
        var reRender = function (ctm, reCalulateMaterialProducts, lightPosChanged) {
            if (reCalulateMaterialProducts === void 0) { reCalulateMaterialProducts = false; }
            if (lightPosChanged === void 0) { lightPosChanged = false; }
            if (reCalulateMaterialProducts) {
                PonyMaterial.reCalculateProducts();
            }
            cpm = preCalculatedCPM;
            ctm = lookAt(cameraPos, add(cameraPos, cameraFront), VEC_Y);
            reRenderBackground();
            reRenderMain(ctm);
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
                    reRender(ctm, true, true);
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
            reRender(ctm);
        };
        // do it
        main();
    };
});
