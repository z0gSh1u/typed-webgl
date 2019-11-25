// Core code of 3-Shining.
// by z0gSh1u
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
    // common variables
    var canvasDOM = document.querySelector('#cvs');
    var gl = canvasDOM.getContext('webgl');
    var program;
    var helper;
    var vBuffer; // 顶点缓冲区
    var textureBuffer; // 材质缓冲区
    var nBuffer; // 法向量缓冲区
    var ctm; // 当前世界矩阵
    var Pony; // 小马全身
    var PonyTextureManager = []; // 小马材质管理器
    var Floor; // 地板
    var slowDownId; // 减速计时器编号
    var isMouseDown = false;
    var mouseLastPos; // 上一次鼠标位置
    var vX = 0; // X轴旋转速度
    var vY = 0; // Y轴旋转速度
    var curTick;
    var lastTick;
    var PonyMaterialInputDOMs = [];
    var PonyMaterialCorrespondings = [];
    // global constant
    var FRICTION = 0.0006; // 模拟摩擦力，每毫秒降低的速度
    var INTERVAL = 40; // 速度降低的毫秒间隔
    var ROTATE_PER_X = 0.2; // X轴鼠标拖动旋转的比例
    var ROTATE_PER_Y = 0.2; // Y轴鼠标拖动旋转的比例
    var lightBulbPosition = vec3(0, 0, 0);
    // material parameters
    var PonyMaterial = new PhongLightModel_1.PhongLightModel({
        lightPosition: lightBulbPosition,
        ambientColor: [50, 50, 50],
        ambientMaterial: [50, 50, 50],
        diffuseColor: [192, 149, 83],
        diffuseMaterial: [50, 100, 100],
        specularColor: [255, 255, 255],
        specularMaterial: [45, 45, 45],
        materialShiness: 10.0
    });
    var FloorMaterial = new PhongLightModel_1.PhongLightModel({
        lightPosition: lightBulbPosition,
        ambientColor: [50, 50, 50],
        ambientMaterial: [50, 50, 50],
        diffuseColor: [192, 149, 83],
        diffuseMaterial: [50, 100, 100],
        specularColor: [255, 255, 255],
        specularMaterial: [45, 45, 45],
        materialShiness: 10.0
    });
    // main function
    var main = function () {
        // initialization
        WebGLUtils.initializeCanvas(gl, canvasDOM);
        program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl');
        helper = new WebGLHelper3d_1.WebGLHelper3d(canvasDOM, gl, program);
        gl.enable(gl.DEPTH_TEST);
        vBuffer = helper.createBuffer();
        textureBuffer = helper.createBuffer();
        nBuffer = helper.createBuffer();
        helper.setGlobalSettings(vBuffer, 'aPosition', textureBuffer, 'aTexCoord', 'uTexture', 'uWorldMatrix', 'uModelMatrix', 'uExtraMatrix', nBuffer, 'aNormal', 'uLightPosition', 'uShiness', 'uAmbientProduct', 'uDiffuseProduct', 'uSpecularProduct');
        ctm = mat4();
        initializePony();
    };
    /**
     * 读入模型数据，初始化JS中的模型信息记录变量，传送材质，渲染小马
     */
    var initializePony = function () {
        // 设定小马模型
        Pony = new (DrawingPackage3d_1.DrawingPackage3d.bind.apply(DrawingPackage3d_1.DrawingPackage3d, __spreadArrays([void 0, mult(translate(0, -0.3, 0), mult(rotateZ(180), rotateX(270)))], [
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
        // 设定地板模型
        Floor = new (DrawingPackage3d_1.DrawingPackage3d.bind.apply(DrawingPackage3d_1.DrawingPackage3d, __spreadArrays([void 0, mat4()], [
            new DrawingObject3d_1.DrawingObject3d('floor', './model/normed/Floor/floor.obj')
        ])))();
        Floor.setMeshOnly(gl.TRIANGLE_STRIP, [111, 193, 255]);
        Pony.preloadTexture(ponyLoadedCallback);
    };
    // 材质初次加载完成后渲染一次，把材质绑到WebGL预置变量上
    var ponyLoadedCallback = function (loadedElements) {
        // 把素材图像传送到GPU  
        for (var i = 0; i < loadedElements.length; i++) {
            var no = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, no);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, loadedElements[i]);
            gl.generateMipmap(gl.TEXTURE_2D);
            PonyTextureManager.push(no);
        }
        // 为预置的材质变量绑定上各部分的材质，材质编号从0开始
        for (var i = 0; i < PonyTextureManager.length; i++) {
            // PonyTextureManager.length == 8
            var cmd1 = "gl.activeTexture(gl.TEXTURE" + i + ")", cmd2 = "gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[" + i + "])";
            eval(cmd1);
            eval(cmd2);
        }
        // 渲染
        resetScene();
        reRenderLighting();
        helper.reRender(mat4());
    };
    /**
     * 重设Pony全身和地面坐标，但不会重传材质，也不会重设模型视图矩阵
     */
    var resetScene = function () {
        helper.clearWaitingQueue();
        [Floor, Pony].forEach(function (ele) {
            helper.drawPackageLater(ele);
        });
    };
    var reRenderLighting = function (posOnly) {
        if (posOnly === void 0) { posOnly = false; }
        [PonyMaterial, FloorMaterial].forEach(function (ele) {
            ele.reCalculateProducts();
        });
        helper.setLighting(PonyMaterial);
        helper.updateLighting();
    };
    // ===============================
    // 光源交互相关
    // ===============================
    /**
     * 初始化位置输入框
     */
    var initPositionInput = function () {
        document.querySelector('#lightPosX').value = lightBulbPosition[0].toString();
        document.querySelector('#lightPosY').value = lightBulbPosition[1].toString();
        document.querySelector('#lightPosZ').value = lightBulbPosition[2].toString();
    };
    /**
     * 调节位置
     */
    var listenPositionInput = function () {
        document.querySelector('#applyLightPos').onclick = function () {
            var xx = document.querySelector('#lightPosX').value, yy = document.querySelector('#lightPosY').value, zz = document.querySelector('#lightPosZ').value;
            lightBulbPosition = ([xx, yy, zz].map(function (_) { return parseFloat(_); }));
            [PonyMaterial, FloorMaterial].forEach(function (ele) {
                ele.setLightPosition(lightBulbPosition);
            });
            reRenderLighting(true);
            helper.reRender(ctm);
        };
    };
    /**
     * 初始化材质颜色参量输入框
     */
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
    /**
     * 调节小马材质颜色参量
     */
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
            reRenderLighting(false);
            helper.reRender(ctm);
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
        var disX = (mousePos[0] - mouseLastPos[0]) * ROTATE_PER_X;
        var disY = (mousePos[1] - mouseLastPos[1]) * ROTATE_PER_Y;
        vX = disX / (curTick - lastTick);
        vY = disY / (curTick - lastTick);
        ctm = mult(rotateX(-disY), ctm);
        ctm = mult(rotateY(-disX), ctm);
        mouseLastPos = mousePos;
        resetScene();
        helper.reRender(ctm);
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
        resetScene();
        helper.reRender(ctm);
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
