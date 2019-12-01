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
    var gl = canvasDOM.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    var helper;
    var PROGRAMS = { MAIN: 0, BACKGROUND: 1, BALL: 2 };
    var MODES = { TRACKBALL: 0, FPV: 1, LIGHT: 2 };
    var currentMode = MODES.TRACKBALL;
    // ==================================
    // 主体渲染使用
    // ==================================
    var lightBulbPosition = vec3(0.0, 0.0, 0.0); // 光源位置
    var vBuffer; // 顶点缓冲区
    var nBuffer; // 法向量缓冲区
    var tBuffer; // 材质顶点缓冲区
    var ctm; // 当前世界矩阵
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
    var HairMaterial = new PhongLightModel_1.PhongLightModel({
        lightPosition: lightBulbPosition,
        ambientColor: [64, 200, 200],
        ambientMaterial: [100, 100, 100],
        diffuseColor: [64, 200, 200],
        diffuseMaterial: [255, 255, 255],
        specularColor: [64, 200, 200],
        specularMaterial: [10, 10, 10],
        materialShiness: 80.0
    });
    // ==================================
    // 背景渲染使用
    // ==================================
    var BackgroundTexture;
    var bgVBuffer;
    var bgTBuffer;
    // ==================================
    // 光球渲染使用
    // ==================================
    var Ball;
    var ballVBuffer;
    var lastLightBulbPosition = vec3(0.0, 0.0, 0.0);
    var LIGHT_TRANSLATE_FACTOR = 0.00005;
    var LIGHT_Z_PLUS = 0.015;
    // ==================================
    // 跟踪球使用
    // ==================================
    var FRICTION = 0.0006; // 模拟摩擦力，每毫秒降低的速度
    var INTERVAL = 40; // 速度降低的毫秒间隔
    var ROTATE_PER_X = 0.2; // X轴鼠标拖动旋转的比例
    var ROTATE_PER_Y = 0.2; // Y轴鼠标拖动旋转的比例
    var slowDownId; // 减速计时器编号
    var isMouseDown = false;
    var mouseLastPos; // 上一次鼠标位置
    var vX = 0; // X轴旋转速度
    var vY = 0; // Y轴旋转速度
    var curTick;
    var lastTick;
    var PonyMaterialInputDOMs = [];
    var PonyMaterialCorrespondings = [];
    // 初始化
    var main = function () {
        WebGLUtils.initializeCanvas(gl, canvasDOM);
        helper = new WebGLHelper3d_1.WebGLHelper3d(canvasDOM, gl, [
            WebGLUtils.initializeShaders(gl, './shader/vMain.glsl', './shader/fMain.glsl'),
            WebGLUtils.initializeShaders(gl, './shader/vBackground.glsl', './shader/fBackground.glsl'),
            WebGLUtils.initializeShaders(gl, './shader/vBall.glsl', './shader/fBall.glsl'),
        ]);
        gl.enable(gl.DEPTH_TEST);
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        // gl.enable(gl.BLEND)
        // 初始化各buffer
        vBuffer = helper.createBuffer();
        tBuffer = helper.createBuffer();
        nBuffer = helper.createBuffer();
        bgVBuffer = helper.createBuffer();
        bgTBuffer = helper.createBuffer();
        ballVBuffer = helper.createBuffer();
        ctm = mat4();
        startSceneInit();
    };
    // 必须使用该函数修改前端光照位置
    var modifyLightBulbPosition = function (newPos) {
        lastLightBulbPosition = lightBulbPosition;
        lightBulbPosition = newPos;
        initPositionInput();
    };
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
                    Ball = new (DrawingPackage3d_1.DrawingPackage3d.bind.apply(DrawingPackage3d_1.DrawingPackage3d, __spreadArrays([void 0, WebGLUtils.scaleMat(0.5, 0.5, 0.5)], [
                        new DrawingObject3d_1.DrawingObject3d('ball', './model/normed/ball.obj')
                    ])))();
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
        helper.switchProgram(PROGRAMS.BACKGROUND);
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
        helper.switchProgram(PROGRAMS.MAIN);
        helper.prepare({
            attributes: [],
            uniforms: [
                { varName: 'uWorldMatrix', data: flatten(ctm), method: 'Matrix4fv' },
                { varName: 'uModelMatrix', data: flatten(Pony.modelMat), method: 'Matrix4fv' },
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
            if (obj.name != 'hairBack' && obj.name != 'hairFront') {
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
            }
        });
        // 单独处理头发材质
        helper.prepare({
            attributes: [],
            uniforms: [
                { varName: 'uShiness', data: HairMaterial.materialShiness, method: '1f' },
                { varName: 'uAmbientProduct', data: HairMaterial.ambientProduct, method: '4fv' },
                { varName: 'uDiffuseProduct', data: HairMaterial.diffuseProduct, method: '4fv' },
                { varName: 'uSpecularProduct', data: HairMaterial.specularProduct, method: '4fv' },
            ]
        });
        [Pony.getObjectByName('hairFront'), Pony.getObjectByName('hairBack')].forEach(function (obj) {
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
    };
    var reRenderLightBall = function (posChanged) {
        if (posChanged === void 0) { posChanged = false; }
        helper.switchProgram(PROGRAMS.BALL);
        if (posChanged) {
            Ball.setModelMat(mult(Ball.modelMat, translate(lightBulbPosition[0] - lastLightBulbPosition[0], lightBulbPosition[1] - lastLightBulbPosition[1], lightBulbPosition[2] - lastLightBulbPosition[2])));
        }
        Ball.innerList.forEach(function (obj) {
            var vs = helper.analyzeFtoV(obj, 'fs');
            helper.prepare({
                attributes: [
                    { buffer: ballVBuffer, data: flatten(vs), varName: 'aPosition', attrPer: 3, type: gl.FLOAT }
                ],
                uniforms: [
                    { varName: 'uColor', data: WebGLUtils.normalize8bitColor([255, 181, 41]), method: '4fv' },
                    { varName: 'uWorldMat', data: flatten(ctm), method: 'Matrix4fv' },
                    { varName: 'uModelMat', data: flatten(Ball.modelMat), method: 'Matrix4fv' },
                ]
            });
            helper.drawArrays(gl.TRIANGLES, 0, obj.objProcessor.getEffectiveVertexCount());
        });
    };
    // reRender
    var reRender = function (ctm, reCalulateMaterialProducts, lightPosChanged) {
        if (reCalulateMaterialProducts === void 0) { reCalulateMaterialProducts = false; }
        if (lightPosChanged === void 0) { lightPosChanged = false; }
        reCalulateMaterialProducts && PonyMaterial.reCalculateProducts() && HairMaterial.reCalculateProducts();
        reRenderLightBall(lightPosChanged);
        reRenderBackground();
        reRenderMain(ctm);
    };
    // ==================================
    // 光源交互相关
    // ==================================
    // 初始化位置输入框
    var initPositionInput = function () {
        document.querySelector('#lightPosX').value = lightBulbPosition[0].toString();
        document.querySelector('#lightPosY').value = lightBulbPosition[1].toString();
        document.querySelector('#lightPosZ').value = (-lightBulbPosition[2]).toString();
        // 没有人知道为什么这里要加负号才是对的
    };
    // 调节位置
    var listenPositionInput = function () {
        var positionChangedResponse = function () {
            var xx = document.querySelector('#lightPosX').value, yy = document.querySelector('#lightPosY').value, zz = document.querySelector('#lightPosZ').value;
            var res = [xx, yy, zz].map(function (_) { return parseFloat(_); });
            modifyLightBulbPosition([res[0], res[1], -res[2]]);
            reRender(ctm, true, true);
        };
        document.querySelector('#applyLightPos').onclick = positionChangedResponse;
        document.querySelector('#lightPosX').onclick = positionChangedResponse;
        document.querySelector('#lightPosY').onclick = positionChangedResponse;
        document.querySelector('#lightPosZ').onclick = positionChangedResponse;
    };
    // 初始化材质颜色参量输入框
    var initPonyMaterialInput = function () {
        PonyMaterialInputDOMs = ['#colorinputAR', '#colorinputAG', '#colorinputAB', '#colorinputDR',
            '#colorinputDG', '#colorinputDB', '#colorinputSR',
            '#colorinputSG', '#colorinputSB', '#shinessinput'];
        PonyMaterialCorrespondings = [
            'PonyMaterial.ambientMaterial[0]', 'PonyMaterial.ambientMaterial[1]', 'PonyMaterial.ambientMaterial[2]',
            'PonyMaterial.diffuseMaterial[0]', 'PonyMaterial.diffuseMaterial[1]', 'PonyMaterial.diffuseMaterial[2]',
            'PonyMaterial.specularMaterial[0]', 'PonyMaterial.specularMaterial[1]', 'PonyMaterial.specularMaterial[2]',
            'PonyMaterial.materialShiness'
        ];
        PonyMaterialCorrespondings.forEach(function (v, idx) {
            if (idx == 9) {
                eval("document.querySelector('" + PonyMaterialInputDOMs[idx] + "').value=(Math.floor(" + v + ")).toString()");
            }
            else {
                eval("document.querySelector('" + PonyMaterialInputDOMs[idx] + "').value=(Math.floor(" + v + "*255)).toString()");
            }
        });
    };
    // 调节小马材质颜色参量
    var listenPonyMaterialInput = function () {
        document.querySelector('#applyLightparam').onclick = function () {
            PonyMaterialCorrespondings.forEach(function (v, idx) {
                if (idx == 9) {
                    eval(v + "=parseInt(document.querySelector('" + PonyMaterialInputDOMs[idx] + "').value)");
                }
                else {
                    eval(v + "=parseInt(document.querySelector('" + PonyMaterialInputDOMs[idx] + "').value)/255");
                }
            });
            reRender(ctm, true);
        };
    };
    // 光源互动模式
    var listenMouseLightInteract = function () {
        // 拖动处理
        canvasDOM.onmousedown = function (evt) {
            var mousePoint = [evt.offsetX, evt.offsetY];
            canvasDOM.onmousemove = function (evt2) {
                var newMousePoint = [evt2.offsetX, evt2.offsetY];
                var translateVector = newMousePoint.map(function (v, i) { return v - mousePoint[i]; });
                translateVector[0] /= canvasDOM.width;
                translateVector[1] /= canvasDOM.height;
                translateVector[1] *= -1;
                translateVector.map(function (x) { return x * LIGHT_TRANSLATE_FACTOR; });
                modifyLightBulbPosition([lightBulbPosition[0] + translateVector[0], lightBulbPosition[1] + translateVector[1], lightBulbPosition[2]]);
                Ball.setModelMat(mult(Ball.modelMat, translate(translateVector[0], translateVector[1], 0.0)));
                reRender(ctm, true, true);
            };
        };
        canvasDOM.onmouseup = function () {
            canvasDOM.onmousemove = function () { };
        };
        // @ts-ignore
        canvasDOM.onmousewheel = function (evt) {
            var dir = evt.wheelDelta > 0 ? -1 : 1; // 1 Down -1 Up
            modifyLightBulbPosition([lightBulbPosition[0], lightBulbPosition[1], lightBulbPosition[2] + dir * LIGHT_Z_PLUS]);
            Ball.setModelMat(mult(Ball.modelMat, translate(0.0, 0.0, dir * LIGHT_Z_PLUS)));
            reRender(ctm, true, true);
        };
    };
    // ==================================
    // 跟踪球实现
    // ==================================
    // 鼠标按下时随鼠标旋转
    var rotateWithMouse = function (e) {
        var mousePos = [e.offsetX, e.offsetY];
        lastTick = curTick;
        curTick = new Date().getTime();
        var disX = (mousePos[0] - mouseLastPos[0]) * ROTATE_PER_X, disY = (mousePos[1] - mouseLastPos[1]) * ROTATE_PER_Y;
        vX = disX / (curTick - lastTick);
        vY = disY / (curTick - lastTick);
        ctm = mult(rotateX(-disY), ctm);
        ctm = mult(rotateY(-disX), ctm);
        mouseLastPos = mousePos;
        reRender(ctm, true, false);
    };
    var abs = function (n) {
        return n < 0 ? -n : n;
    };
    var sign = function (n) {
        if (n == 0) {
            return 0;
        }
        else {
            return abs(n) / n;
        }
    };
    // 松开鼠标后每INTERVAL毫秒进行一次减速
    var slowDown = function () {
        if (vX == 0 && vY == 0) {
            clearInterval(slowDownId);
            return;
        }
        ctm = mult(rotateX(-vY * INTERVAL), ctm);
        ctm = mult(rotateY(-vX * INTERVAL), ctm);
        vX = abs(vX) <= FRICTION * INTERVAL ? 0 : vX - FRICTION * INTERVAL * sign(vX);
        vY = abs(vY) <= FRICTION * INTERVAL ? 0 : vY - FRICTION * INTERVAL * sign(vY);
        reRender(ctm, true, false);
    };
    // 鼠标侦听
    var listenMouseTrackBall = function () {
        canvasDOM.onmousedown = function (e) {
            isMouseDown = true;
            mouseLastPos = [e.offsetX, e.offsetY];
            clearInterval(slowDownId);
            curTick = lastTick = new Date().getTime();
        };
        canvasDOM.onmouseup = function (e) {
            isMouseDown = false;
            clearInterval(slowDownId);
            slowDownId = window.setInterval(slowDown, INTERVAL);
        };
        canvasDOM.onmousemove = function (e) {
            if (isMouseDown) {
                rotateWithMouse(e);
            }
        };
    };
    // ==================================
    // 模式切换
    // ==================================
    var listenModeToggler = function () {
        document.querySelector('#modeToggler').onclick = function () {
            // 前端响应
            eval("document.querySelector('#mode_" + currentMode + "').style.display = 'none'");
            currentMode = (currentMode + 1) % 3;
            eval("document.querySelector('#mode_" + currentMode + "').style.display = 'inline-block'");
            // 内部模式切换
            clearMouseHooks();
            switch (currentMode) {
                case MODES.TRACKBALL:
                    listenMouseTrackBall();
                    break;
                case MODES.LIGHT:
                    listenMouseLightInteract();
                    break;
                case MODES.FPV: /* TODO: Add something here. */ break;
            }
        };
    };
    var clearMouseHooks = function () {
        canvasDOM.onmousedown = function () { };
        canvasDOM.onmouseup = function () { };
        canvasDOM.onmousemove = function () { };
        // @ts-ignore
        canvasDOM.onmousewheel = function () { };
    };
    // do it
    window.onload = function () {
        main();
        initPositionInput();
        initPonyMaterialInput();
        listenPonyMaterialInput();
        listenPositionInput();
        listenModeToggler();
        listenMouseTrackBall();
    };
});
