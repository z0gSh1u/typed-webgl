// ==================================
// 第一人称漫游实现
// by LongChen
// ==================================
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define(["require", "exports", "../../3rd-party/MV"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // ==================================
    // 观察相机
    // ==================================
    // !! 请注意，pos->at与pos->up不能共线 !!
    var ROTATE_PER_Y_FPV = 0.09;
    var ROTATE_PER_X_FPV = 0.09;
    exports.VEC_Y = vec3(0.0, 1.0, 0.0);
    var ANGLE_UP_MAX = 120;
    var ANGLE_DOWN_MAX = -120;
    var VEC_UP_MAX = vec4(0.0, Math.sin(ANGLE_UP_MAX), Math.cos(ANGLE_UP_MAX), 1);
    var VEC_DOWN_MAX = vec4(0.0, Math.sin(ANGLE_DOWN_MAX), Math.cos(ANGLE_DOWN_MAX), 1);
    exports.cameraPos = vec3(0.0, 0.0, 0.0);
    exports.cameraFront = vec3(0.1, 0.0, 0.0);
    var cameraSpeed = 0.04;
    var cameraMoveId = 0; // 相机移动计时器编号
    var INTERVAL = 40; // 速度降低的毫秒间隔
    var lastTick;
    var canvasDOM;
    /**
     * 开始监听鼠标键盘
     */
    function enableRoaming(_canvasDOM) {
        canvasDOM = _canvasDOM;
        listenMouseToTurnCamera();
        listenKeyboardFPV();
    }
    exports.enableRoaming = enableRoaming;
    /**
     * 获取当前lookAt
     */
    function getLookAt() {
        return lookAt(exports.cameraPos, add(exports.cameraPos, exports.cameraFront), exports.VEC_Y);
    }
    exports.getLookAt = getLookAt;
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
                exports.cameraFront = normalize(vec3.apply(void 0, mult(rotateY(ROTATE_PER_X_FPV * translateVector[0]), vec4.apply(void 0, __spreadArrays(exports.cameraFront, [1])))
                    .slice(0, 3)), false);
                var initZ = Math.sqrt(exports.cameraFront[0] * exports.cameraFront[0] + exports.cameraFront[2] * exports.cameraFront[2]);
                var tempVec = vec4(0, exports.cameraFront[1], initZ, 1);
                tempVec = mult(rotateX(ROTATE_PER_Y_FPV * translateVector[1]), tempVec);
                if (tempVec[1] > VEC_UP_MAX[1] && tempVec[2] >= 0 || tempVec[1] > 0 && tempVec[2] < 0) {
                    tempVec = VEC_UP_MAX;
                }
                else if (tempVec[1] < VEC_DOWN_MAX[1] && tempVec[2] >= 0 || tempVec[1] < 0 && tempVec[2] < 0) {
                    tempVec = VEC_DOWN_MAX;
                }
                var newZ = tempVec[2];
                exports.cameraFront = vec3(exports.cameraFront[0] * newZ / initZ, tempVec[1], exports.cameraFront[2] * newZ / initZ);
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
                // TODO: 空气墙
                // 这种写法不对
                // if (cameraPos.some(v => Math.abs(v) >= 0.88)) {
                //   return
                // }
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
        var frontVec = normalize(vec3(exports.cameraFront[0], 0, exports.cameraFront[2]), false);
        var leftVec = normalize(cross(exports.VEC_Y, exports.cameraFront), false);
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
            cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(cameraSpeed), exports.VEC_Y));
            moveFlag = true;
        }
        if (isKeyDown['16' /*Shift*/]) {
            cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(-cameraSpeed), exports.VEC_Y));
            moveFlag = true;
        }
        if (!moveFlag) {
            clearInterval(cameraMoveId);
            cameraMoveId = 0;
            return;
        }
        exports.cameraPos = add(exports.cameraPos, cameraMoveSpeed);
    };
    // ==================================
    // 透视
    // ==================================
    var fovy = 90.0;
    var aspect = -16 / 9;
    var near = 0.05;
    var far = 2.8; // 越小越好（房间就显得越大），经过精密的调试，这个参数最棒
    exports.preCalculatedCPM = perspective(fovy, aspect, near, far);
});
