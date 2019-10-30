// Core code of 2-Pony.
// by z0gSh1u & LongChen
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
define(["require", "exports", "../../framework/3d/WebGLHelper3d", "../../framework/WebGLUtils", "../../framework/3d/DrawingObject3d", "../../framework/3d/DrawingPackage3d", "../../3rd-party/MV", "../../3rd-party/initShaders"], function (require, exports, WebGLHelper3d_1, WebGLUtils, DrawingObject3d_1, DrawingPackage3d_1) {
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
    var Pony; // 小马全身
    var PonyTextureManager = []; // 小马材质管理器
    var PonyTailAngle; // 小马尾部当前旋转角度（DEG）
    var PonyTailDirection; // 小马尾部旋转方向，-1或1
    var Floor; // 地板
    var slowDownId; //减速计时器编号
    var autoRotateId; //自动旋转计时器编号
    var isMouseDown = false;
    var mouseLastPos; // 上一次鼠标位置
    var vX = 0; // X轴旋转速度
    var vY = 0; // Y轴旋转速度
    var curTick;
    var lastTick;
    var isAutoRotating = false; //是否正在自动旋转
    // global status recorder
    var COORD_SYS = {
        SELF: 0, WORLD: 1
    };
    var currentCoordSys = COORD_SYS.WORLD;
    // global constant
    var ROTATE_DELTA = 5; // 每次转多少度，角度制
    var TRANSLATE_DELTA = 0.010; // 每次平移多少距离，WebGL归一化系
    var TAIL_ROTATE_DELTA = 2;
    var TAIL_ROTATE_LIMIT = 6;
    var FRICTION = 0.0006; //模拟摩擦力，每毫秒降低的速度
    var INTERVAL = 40; //速度降低的毫秒间隔
    var ROTATE_PER_X = 0.2; //X轴鼠标拖动旋转的比例
    var ROTATE_PER_Y = 0.2; //Y轴鼠标拖动旋转的比例
    var AUTO_ROTATE_DELTA = 1; //自动旋转速度
    // main function
    var main = function () {
        // initialization
        WebGLUtils.initializeCanvas(gl, canvasDOM);
        program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl');
        helper = new WebGLHelper3d_1.WebGLHelper3d(canvasDOM, gl, program);
        gl.enable(gl.DEPTH_TEST);
        vBuffer = helper.createBuffer();
        textureBuffer = helper.createBuffer();
        helper.setGlobalSettings(vBuffer, 'aPosition', textureBuffer, 'aTexCoord', 'uTexture', 'uWorldMatrix', 'uModelMatrix', 'uExtraMatrix');
        ctm = mat4();
        initializePony();
    };
    /**
     * 读入模型数据，初始化JS中的模型信息记录变量，传送材质，渲染小马
     */
    var initializePony = function () {
        // 不知道为什么小马一出来是背对的，而且还贼高。绕y轴先转180度，再微调一下y坐标位置
        var initModelMap = mult(translate(0, -0.3, 0), rotateY(180));
        // 设定小马尾部角度
        PonyTailAngle = 0;
        PonyTailDirection = -1;
        // 设定小马模型
        Pony = new (DrawingPackage3d_1.DrawingPackage3d.bind.apply(DrawingPackage3d_1.DrawingPackage3d, __spreadArrays([void 0, initModelMap], [
            new DrawingObject3d_1.DrawingObject3d('body', './model/normed/Pony/pony.obj', './model/texture/Pony/pony.png', 0),
            new DrawingObject3d_1.DrawingObject3d('tail', './model/normed/Pony/tail.obj', './model/texture/Pony/tail.png', 1),
            new DrawingObject3d_1.DrawingObject3d('hairBack', './model/normed/Pony/hairBack.obj', './model/texture/Pony/hairBack.png', 2),
            new DrawingObject3d_1.DrawingObject3d('hairFront', './model/normed/Pony/hairFront.obj', './model/texture/Pony/hairFront.png', 3),
            new DrawingObject3d_1.DrawingObject3d('horn', './model/normed/Pony/horn.obj', './model/texture/Pony/horn.png', 4),
            new DrawingObject3d_1.DrawingObject3d('leftEye', './model/normed/Pony/leftEye.obj', './model/texture/Pony/leftEye.png', 5),
            new DrawingObject3d_1.DrawingObject3d('rightEye', './model/normed/Pony/rightEye.obj', './model/texture/Pony/rightEye.png', 6),
            new DrawingObject3d_1.DrawingObject3d('teeth', './model/normed/Pony/teeth.obj', './model/texture/Pony/teeth.png', 7),
        ])))();
        // 设定地板模型
        Floor = new (DrawingPackage3d_1.DrawingPackage3d.bind.apply(DrawingPackage3d_1.DrawingPackage3d, __spreadArrays([void 0, mat4()], [
            new DrawingObject3d_1.DrawingObject3d('floor', './model/normed/Floor/floor.obj')
        ])))();
        Floor.setMeshOnly(gl.LINE_LOOP, [0, 0, 0]);
        // 材质初次加载完成后渲染一次，把材质绑到WebGL预置变量上
        var renderAfterTextureLoad = function (loadedElements) {
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
            helper.reRender(ctm);
        };
        // 有需要加载外部材质的，在这里加载
        Pony.preloadTexture(renderAfterTextureLoad);
    };
    /**
     * 重设Pony全身和地面坐标，但不会重传材质，也不会重设模型视图矩阵
     */
    var resetScene = function () {
        helper.clearWaitingQueue();
        [Floor, Pony,].forEach(function (ele) {
            helper.drawPackageLater(ele);
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
    //重置所有对象位置
    document.querySelector('#resetAll').onclick = function () {
        ctm = mat4();
        Pony.setModelMat(mult(translate(0, -0.3, 0), rotateY(180)));
        vX = vY = 0;
        resetScene();
        helper.reRender(ctm);
    };
    // 自动旋转开启与停止
    document.querySelector('#autoRotateToggler').onclick = function () {
        isAutoRotating = !isAutoRotating;
        if (isAutoRotating) {
            document.querySelector('#autoRotateToggler').innerText = '停止旋转';
            clearInterval(autoRotateId);
            setInterval(function () {
                if (!isAutoRotating) {
                    clearInterval(autoRotateId);
                    return;
                }
                if (currentCoordSys == COORD_SYS.SELF) {
                    var newMat = mult(Pony.modelMat, rotateY(AUTO_ROTATE_DELTA));
                    Pony.setModelMat(newMat);
                    resetScene();
                    helper.reRender(ctm);
                }
                else {
                    ctm = mult(rotateY(AUTO_ROTATE_DELTA), ctm);
                    resetScene();
                    helper.reRender(ctm);
                }
            }, INTERVAL);
        }
        else {
            document.querySelector('#autoRotateToggler').innerText = '开始旋转';
            clearInterval(autoRotateId);
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
            '68' /*D*/: processDKey,
            '37' /*←*/: processLAKey,
            '38' /*↑*/: processUAKey,
            '39' /*→*/: processRAKey,
            '40' /*↓*/: processDAKey
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
    // 尾部旋转处理器
    var rotateTail = function () {
        var tailObject = Pony.getObjectByName('tail');
        if (PonyTailAngle >= TAIL_ROTATE_LIMIT || PonyTailAngle <= -TAIL_ROTATE_LIMIT) {
            PonyTailDirection *= -1;
        }
        PonyTailAngle += PonyTailDirection * TAIL_ROTATE_DELTA;
        var newTailExtra = mult(tailObject.extraMatrix, rotateY(PonyTailAngle));
        Pony.setObjectExtraMatrix('tail', newTailExtra);
    };
    // 右方向键，右翻滚
    var processRAKey = function () {
        if (currentCoordSys != COORD_SYS.SELF) {
            return;
        }
        var newMat = mult(Pony.modelMat, rotateZ(ROTATE_DELTA));
        Pony.setModelMat(newMat);
        resetScene();
        helper.reRender(ctm);
    };
    // 上方向键，后仰
    var processUAKey = function () {
        if (currentCoordSys != COORD_SYS.SELF) {
            return;
        }
        var newMat = mult(Pony.modelMat, rotateX(-ROTATE_DELTA));
        Pony.setModelMat(newMat);
        resetScene();
        helper.reRender(ctm);
    };
    // 左方向键，左翻滚
    var processLAKey = function () {
        if (currentCoordSys != COORD_SYS.SELF) {
            return;
        }
        var newMat = mult(Pony.modelMat, rotateZ(-ROTATE_DELTA));
        Pony.setModelMat(newMat);
        resetScene();
        helper.reRender(ctm);
    };
    // 下方向键，前俯
    var processDAKey = function () {
        if (currentCoordSys != COORD_SYS.SELF) {
            return;
        }
        var newMat = mult(Pony.modelMat, rotateX(ROTATE_DELTA));
        Pony.setModelMat(newMat);
        resetScene();
        helper.reRender(ctm);
    };
    // W键，上平移或前进
    var processWKey = function () {
        if (currentCoordSys == COORD_SYS.WORLD) {
            // 向上平移(y axis add)
            ctm = mult(translate(0, TRANSLATE_DELTA, 0), ctm);
        }
        else {
            // 面向前进
            var newMat = mult(Pony.modelMat, translate(0, 0, TRANSLATE_DELTA));
            Pony.setModelMat(newMat);
            rotateTail();
        }
        resetScene();
        helper.reRender(ctm);
    };
    // A键，左平移或左转向
    var processAKey = function () {
        if (currentCoordSys == COORD_SYS.WORLD) {
            // 向左平移(x axis minus)
            ctm = mult(translate(-TRANSLATE_DELTA, 0, 0), ctm);
        }
        else {
            // 向左转
            var newMat = mult(Pony.modelMat, rotateY(-ROTATE_DELTA));
            Pony.setModelMat(newMat);
        }
        resetScene();
        helper.reRender(ctm);
    };
    // S键，下平移或后退
    var processSKey = function () {
        if (currentCoordSys == COORD_SYS.WORLD) {
            // 向下平移(y axis minus)
            ctm = mult(translate(0, -TRANSLATE_DELTA, 0), ctm);
        }
        else {
            // 面向后退
            var newMat = mult(Pony.modelMat, translate(0, 0, -TRANSLATE_DELTA));
            Pony.setModelMat(newMat);
            rotateTail();
        }
        resetScene();
        helper.reRender(ctm);
    };
    // D键，右平移或右转向
    var processDKey = function () {
        if (currentCoordSys == COORD_SYS.WORLD) {
            // 向右平移(x axis add)
            ctm = mult(translate(TRANSLATE_DELTA, 0, 0), ctm);
        }
        else {
            // 向右转
            var newMat = mult(Pony.modelMat, rotateY(ROTATE_DELTA));
            Pony.setModelMat(newMat);
        }
        resetScene();
        helper.reRender(ctm);
    };
    // X键，绕世界系X轴旋转
    var processXKey = function () {
        if (currentCoordSys != COORD_SYS.WORLD) {
            return;
        }
        ctm = mult(rotateX(ROTATE_DELTA), ctm);
        resetScene();
        helper.reRender(ctm);
    };
    // Y键，绕世界系Y轴旋转
    var processYKey = function () {
        if (currentCoordSys != COORD_SYS.WORLD) {
            return;
        }
        ctm = mult(rotateY(ROTATE_DELTA), ctm);
        resetScene();
        helper.reRender(ctm);
    };
    // Z键，绕世界系Z轴旋转
    var processZKey = function () {
        if (currentCoordSys != COORD_SYS.WORLD) {
            return;
        }
        ctm = mult(rotateZ(ROTATE_DELTA), ctm);
        resetScene();
        helper.reRender(ctm);
    };
    // 鼠标按下时随鼠标旋转
    var rotateWithMouse = function (e) {
        if (!isMouseDown) {
            return;
        }
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
            // fixed `setInterval` conflict with NodeJS definition.
        };
        canvasDOM.onmousemove = function (e) {
            rotateWithMouse(e);
        };
    };
    // do it
    main();
    listenKeyboard();
    listenMouse();
});
