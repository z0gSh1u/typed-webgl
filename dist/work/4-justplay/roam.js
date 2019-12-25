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
define(["require", "exports", "./sword", "../../3rd-party/MV"], function (require, exports, sword_1) {
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
    var POS_MIN = vec3(-0.82, 0, -0.82); // 相机位置边界，分别为XZ坐标的最小值，第二个分量无效
    var POS_MAX = vec3(0.82, 0, 0.82); // 相机位置边界，分别为XZ坐标的最大值，第二个分量无效
    var GRAVITY = -0.02; // 重力加速度
    var GETUP_SPEED = 0.1; // 起身速度
    var CEIL = 0.8; // 天花板坐标
    var FLOOR_STAND = -0.5; // 站立时地板坐标
    var FLOOR_SQUAT = -0.8; // 蹲下时地板坐标
    var JUMP_SPEED = 0.15; // 起跳速度
    var floor = FLOOR_STAND; // 相机Y坐标最小值，可变以实现下蹲
    var isOnFloor = false; // 是否站在地板上
    var verticalSpeed = 0; // 垂直方向速度，主要用于跳跃
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
        canvasDOM.onmouseup = function () {
            sword_1.waveSword();
            // 如果想要不按住也可以鼠标观察，则注释下列钩子
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
    function setSpaceStatus(down) {
        isKeyDown['32'] = down;
    }
    exports.setSpaceStatus = setSpaceStatus;
    var listenKeyboardFPV = function () {
        if (cameraMoveId == 0) {
            cameraMoveId = window.setInterval(moveCamera, INTERVAL);
        }
        isKeyDown['87'] = isKeyDown['65'] = isKeyDown['83'] = isKeyDown['68'] = isKeyDown['32'] = isKeyDown['16'] = false;
        window.onkeydown = function (e) {
            if (e && e.keyCode) {
                isKeyDown[e.keyCode] = true;
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
        if (isKeyDown['87' /*W*/]) {
            cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(cameraSpeed), frontVec));
        }
        if (isKeyDown['83' /*S*/]) {
            cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(-cameraSpeed), frontVec));
        }
        if (isKeyDown['65' /*A*/]) {
            cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(-cameraSpeed), leftVec));
        }
        if (isKeyDown['68' /*D*/]) {
            cameraMoveSpeed = add(cameraMoveSpeed, mult(mat3(cameraSpeed), leftVec));
        }
        if (isKeyDown['32' /*Space*/]) {
            if (isOnFloor) {
                verticalSpeed = JUMP_SPEED;
            }
        }
        if (isKeyDown['16' /*Shift*/]) {
            floor = FLOOR_SQUAT;
        }
        else {
            floor = FLOOR_STAND;
        }
        if (!isOnFloor) {
            verticalSpeed += GRAVITY;
        }
        cameraMoveSpeed[1] += verticalSpeed;
        exports.cameraPos = add(exports.cameraPos, cameraMoveSpeed);
        if (!isOnFloor && exports.cameraPos[1] > CEIL) {
            exports.cameraPos[1] = CEIL;
            verticalSpeed = 0;
        }
        if (!isOnFloor && exports.cameraPos[1] <= floor) {
            exports.cameraPos[1] = floor;
            verticalSpeed = 0;
            isOnFloor = true;
        }
        if (isOnFloor && exports.cameraPos[1] < floor) {
            exports.cameraPos[1] = Math.min(exports.cameraPos[1] + GETUP_SPEED, floor);
        }
        if (exports.cameraPos[1] > floor) {
            isOnFloor = false;
        }
        // 简单粗暴的水平方向空气墙实现
        [0, 2].forEach(function (v) {
            exports.cameraPos[v] = Math.min(exports.cameraPos[v], POS_MAX[v]);
            exports.cameraPos[v] = Math.max(exports.cameraPos[v], POS_MIN[v]);
        });
    };
    function forceSetCamera(pos, front) {
        exports.cameraPos = pos;
        exports.cameraFront = front;
    }
    exports.forceSetCamera = forceSetCamera;
    // ==================================
    // 透视
    // ==================================
    var fovy = 119;
    var aspect = -16 / 9;
    var near = 0.05;
    var far = 2.8; // 越小越好（房间就显得越大），经过精密的调试，这个参数最棒
    exports.preCalculatedCPM = perspective(fovy, aspect, near, far);
});
