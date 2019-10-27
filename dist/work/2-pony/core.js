// Core code of 2-Pony.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "../../framework/3d/WebGLHelper3d", "../../framework/WebGLUtils", "../../framework/3d/DrawingObject3d", "../../3rd-party/MV", "../../3rd-party/initShaders"], function (require, exports, WebGLHelper3d_1, WebGLUtils, DrawingObject3d_1) {
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
    var ctm; // 当前世界矩阵
    var modelMat; // 当前物体自身矩阵
    var Pony = []; // 小马全身
    // global status recorder
    var COORD_SYS = {
        SELF: 0, WORLD: 1
    };
    var currentCoordSys = COORD_SYS.WORLD;
    // global constant
    var ROTATE_DELTA = 10; // 每次转多少度，角度制
    var TRANSLATE_DELTA = 0.010; // 每次平移多少距离，WebGL归一化系
    // main function
    var main = function () {
        // initialization
        WebGLUtils.initializeCanvas(gl, canvasDOM);
        program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl');
        helper = new WebGLHelper3d_1.WebGLHelper3d(canvasDOM, gl, program);
        gl.enable(gl.DEPTH_TEST);
        // gl.enable(gl.CULL_FACE)
        vBuffer = helper.createBuffer();
        textureBuffer = helper.createBuffer();
        helper.setGlobalSettings(vBuffer, 'aPosition', textureBuffer, 'aTexCoord');
        // 不知道为什么小马一出来是背对的，而且还贼高。绕y轴先转180度，再微调一下y坐标位置
        ctm = rotateY(180);
        ctm = mult(translate(0, -0.2, 0), ctm);
        modelMat = mat4();
        initializePony();
        // resetPony()
        // helper.reRender(ctm, modelMat)
    };
    var PonyTextureManager = [];
    // 读入模型数据，初始化JS中的模型信息记录变量
    var initializePony = function () {
        Pony = [
            new DrawingObject3d_1.DrawingObject3d('./model/normed/Pony/pony.obj', './model/texture/Pony/pony.png'),
            new DrawingObject3d_1.DrawingObject3d('./model/normed/Pony/tail.obj', './model/texture/Pony/tail.png'),
            new DrawingObject3d_1.DrawingObject3d('./model/normed/Pony/hairBack.obj', './model/texture/Pony/hairBack.png'),
            new DrawingObject3d_1.DrawingObject3d('./model/normed/Pony/hairFront.obj', './model/texture/Pony/hairFront.png'),
            new DrawingObject3d_1.DrawingObject3d('./model/normed/Pony/horn.obj', './model/texture/Pony/horn.png'),
            new DrawingObject3d_1.DrawingObject3d('./model/normed/Pony/leftEye.obj', './model/texture/Pony/leftEye.png'),
            new DrawingObject3d_1.DrawingObject3d('./model/normed/Pony/rightEye.obj', './model/texture/Pony/rightEye.png'),
            new DrawingObject3d_1.DrawingObject3d('./model/normed/Pony/teeth.obj', './model/texture/Pony/teeth.png'),
        ];
        function preloadimages(arr) {
            var newimages = [], loadedimages = 0;
            var postaction = function (ni) {
                for (var i_1 = 0; i_1 < ni.length; i_1++) {
                    Pony[i_1]._textureImage = ni[i_1];
                    var no = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, no);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Pony[i_1]._textureImage);
                    gl.generateMipmap(gl.TEXTURE_2D);
                    PonyTextureManager.push(no);
                }
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[0]);
                gl.activeTexture(gl.TEXTURE2);
                gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[1]);
                gl.activeTexture(gl.TEXTURE3);
                gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[2]);
                gl.activeTexture(gl.TEXTURE4);
                gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[3]);
                gl.activeTexture(gl.TEXTURE5);
                gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[4]);
                gl.activeTexture(gl.TEXTURE6);
                gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[5]);
                gl.activeTexture(gl.TEXTURE7);
                gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[6]);
                gl.activeTexture(gl.TEXTURE8);
                gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[7]);
                gl.activeTexture(gl.TEXTURE9);
                gl.bindTexture(gl.TEXTURE_2D, PonyTextureManager[8]);
                resetPony();
                helper.reRender(ctm, modelMat);
            };
            var arr = (typeof arr != "object") ? [arr] : arr;
            function imageloadpost() {
                loadedimages++;
                if (loadedimages == arr.length) {
                    postaction(newimages); //call postaction and pass in newimages array as parameter
                }
            }
            for (var i = 0; i < arr.length; i++) {
                newimages[i] = new Image();
                newimages[i].src = arr[i].texturePath;
                newimages[i].onload = function () {
                    imageloadpost();
                };
                newimages[i].onerror = function () {
                    imageloadpost();
                };
            }
        }
        preloadimages(Pony);
    };
    var resetPony = function () {
        helper.clearWaitingQueue();
        Pony.forEach(function (ele) {
            helper.drawLater(ele);
        });
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
            ctm = mult(translate(0, TRANSLATE_DELTA, 0), ctm);
            resetPony();
            helper.reRender(ctm, mat4());
        }
    };
    // A键，左平移或左转向
    var processAKey = function () {
        if (currentCoordSys == COORD_SYS.WORLD) {
            // 向左平移(x axis minus)
            ctm = mult(translate(-TRANSLATE_DELTA, 0, 0), ctm);
            resetPony();
            helper.reRender(ctm, mat4());
        }
    };
    // S键，下平移或后退
    var processSKey = function () {
        if (currentCoordSys == COORD_SYS.WORLD) {
            // 向下平移(y axis minus)
            ctm = mult(translate(0, -TRANSLATE_DELTA, 0), ctm);
            resetPony();
            helper.reRender(ctm, mat4());
        }
    };
    // D键，右平移或右转向
    var processDKey = function () {
        if (currentCoordSys == COORD_SYS.WORLD) {
            // 向右平移(x axis add)
            ctm = mult(translate(TRANSLATE_DELTA, 0, 0), ctm);
            resetPony();
            helper.reRender(ctm, mat4());
        }
    };
    // X键，绕世界系X轴旋转
    var processXKey = function () {
        if (currentCoordSys != COORD_SYS.WORLD) {
            return;
        }
        ctm = mult(rotateX(ROTATE_DELTA), ctm);
        resetPony();
        helper.reRender(ctm, mat4());
    };
    // Y键，绕世界系Y轴旋转
    var processYKey = function () {
        if (currentCoordSys != COORD_SYS.WORLD) {
            return;
        }
        ctm = mult(rotateY(ROTATE_DELTA), ctm);
        resetPony();
        helper.reRender(ctm, mat4());
    };
    // Z键，绕世界系Z轴旋转
    var processZKey = function () {
        if (currentCoordSys != COORD_SYS.WORLD) {
            return;
        }
        ctm = mult(rotateZ(ROTATE_DELTA), ctm);
        resetPony();
        helper.reRender(ctm, mat4());
    };
    // do it
    main();
    listenKeyboard();
});
