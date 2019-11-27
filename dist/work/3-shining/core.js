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
    var PROGRAMS = {
        MAIN: 0, BACKGROUND: 1, RECT: 2
    };
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
    // ==================================
    // 背景渲染使用
    // ==================================
    var BackgroundTexture;
    var bgVBuffer;
    var bgTBuffer;
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
            WebGLUtils.initializeShaders(gl, './shader/vRect.glsl', './shader/fRect.glsl'),
        ]);
        gl.enable(gl.DEPTH_TEST);
        // 初始化各buffer
        vBuffer = helper.createBuffer();
        tBuffer = helper.createBuffer();
        nBuffer = helper.createBuffer();
        bgVBuffer = helper.createBuffer();
        bgTBuffer = helper.createBuffer();
        ctm = mat4();
        // 保证背景渲染
        initBackground();
    };
    // 初始化背景图
    var initBackground = function () {
        WebGLUtils.loadImageAsync(['./model/bg.png'])
            .then(function (data) {
            // 分配背景材质位置为9
            initBackgroundCallback(data);
        })
            .catch(function (what) {
            console.warn(what);
        });
    };
    var initBackgroundCallback = function (data) {
        helper.sendTextureImageToGPU(data, 9, 10);
        initPony();
    };
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
    // 读入模型数据，初始化JS中的模型信息记录变量，传送材质，渲染小马
    var initPony = function () {
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
        var urls = [];
        Pony.innerList.forEach(function (obj) {
            urls.push(obj.texturePath);
        });
        WebGLUtils.loadImageAsync(urls)
            .then(function (data) {
            ponyLoadedCallback(data);
        });
    };
    // 材质初次加载完成后渲染一次
    var ponyLoadedCallback = function (loadedElements) {
        helper.sendTextureImageToGPU(loadedElements, 0, 9);
        reRender(ctm);
    };
    // 重绘MAIN
    var reRenderMain = function (ctm) {
        helper.switchProgram(PROGRAMS.MAIN);
        helper.prepare({
            attributes: [],
            uniforms: [
                { varName: 'uWorldMatrix', data: flatten(ctm), method: 'Matrix4fv' },
                { varName: 'uModelMatrix', data: flatten(Pony.modelMat), method: 'Matrix4fv' },
                { varName: 'uLightPosition', data: __spreadArrays(PonyMaterial.lightPosition, [1.0]), method: '4fv' },
                { varName: 'uShiness', data: PonyMaterial.materialShiness, method: '1f' },
                { varName: 'uAmbientProduct', data: PonyMaterial.ambientProduct, method: '4fv' },
                { varName: 'uDiffuseProduct', data: PonyMaterial.diffuseProduct, method: '4fv' },
                { varName: 'uSpecularProduct', data: PonyMaterial.specularProduct, method: '4fv' },
            ]
        });
        Pony.innerList.forEach(function (obj) {
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
    // reRender
    var reRender = function (ctm, reCalulateMaterialProducts) {
        if (reCalulateMaterialProducts === void 0) { reCalulateMaterialProducts = false; }
        reCalulateMaterialProducts && PonyMaterial.reCalculateProducts();
        reRenderBackground();
        reRenderMain(ctm);
    };
    // ===============================
    // 光源交互相关
    // ===============================
    // 初始化位置输入框
    var initPositionInput = function () {
        document.querySelector('#lightPosX').value = lightBulbPosition[0].toString();
        document.querySelector('#lightPosY').value = lightBulbPosition[1].toString();
        document.querySelector('#lightPosZ').value = lightBulbPosition[2].toString();
    };
    // 调节位置
    var listenPositionInput = function () {
        document.querySelector('#applyLightPos').onclick = function () {
            var xx = document.querySelector('#lightPosX').value, yy = document.querySelector('#lightPosY').value, zz = document.querySelector('#lightPosZ').value;
            lightBulbPosition = ([xx, yy, zz].map(function (_) { return parseFloat(_); }));
            PonyMaterial.setLightPosition(lightBulbPosition);
            reRender(ctm, true);
        };
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
    // ===============================
    // 跟踪球实现
    // ===============================
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
        reRender(ctm);
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
        reRender(ctm);
    };
    // 鼠标侦听
    var listenMouse = function () {
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
    // do it
    main();
    initPositionInput();
    initPonyMaterialInput();
    listenPonyMaterialInput();
    listenPositionInput();
    listenMouse();
});
// ===============================
// Fin. 2019-11-27.
// ===============================
