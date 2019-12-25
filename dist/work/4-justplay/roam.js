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
define(["require", "exports", "./sword", "./magicCube", "./newIsland", "./blocks", "../../3rd-party/MV"], function (require, exports, sword_1, magicCube_1, newIsland_1, blocks_1) {
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
    var GRAVITY = -0.02; // 重力加速度
    var GETUP_SPEED = 0.1; // 起身速度
    var HEAD_SIZE = 0.2; // 
    var BODY_WIDTH = 0.18; // 
    var STAND_HEIGHT = 0.5; // 
    var SQUAT_HEIGHT = 0.2; // 
    var legHeight = STAND_HEIGHT; // 
    var JUMP_SPEED = 0.2; // 起跳速度
    var isOnFloor = false; // 是否站在地板上
    var isGettingUp = false; // 是否正在起身
    var verticalSpeed = 0; // 垂直方向速度，主要用于跳跃
    var actDistance = 0.32; // 最远互动距离
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
        '16' /*Shift*/: false,
        '69' /*E*/: false
    };
    var listenKeyboardFPV = function () {
        if (cameraMoveId == 0) {
            cameraMoveId = window.setInterval(moveCamera, INTERVAL);
        }
        isKeyDown['87'] = isKeyDown['65'] = isKeyDown['83'] = isKeyDown['68'] = isKeyDown['32'] = isKeyDown['16'] = false;
        window.onkeydown = function (e) {
            if (e && e.keyCode) {
                if (e.keyCode == 69 && !isKeyDown['69'] && isActing(magicCube_1.MagicCubeActBox)) {
                    launchNewIsland();
                }
                isKeyDown[e.keyCode] = true;
            }
        };
        window.onkeyup = function (e) {
            if (e && e.keyCode) {
                isKeyDown[e.keyCode] = false;
            }
        };
    };
    //判断互动时镜头朝向与距离是否正确
    var isActing = function (actBox) {
        var lookat = exports.cameraFront;
        lookat = lookat.map(function (v) { return actDistance * v; });
        lookat = add(lookat, exports.cameraPos);
        var res = exports.cameraPos.map(function (v, i) { return v >= actBox[0][i] && v <= actBox[1][i]; });
        if (res[0] && res[1] && res[2]) {
            return true;
        }
        res = lookat.map(function (v, i) { return v >= actBox[0][i] && v <= actBox[1][i]; });
        if (res[0] && res[1] && res[2]) {
            return true;
        }
        return false;
    };
    //判断当前位置是否在障碍物内
    var isInBlock = function (block, pos) {
        return block[0][0] < pos[0] && block[1][0] > pos[0] && block[0][2] < pos[2] && block[1][2] > pos[2] && block[0][1] < pos[1] && block[1][1] > pos[1];
    };
    //判断是否站在某个障碍物商
    var isOnBlock = function (block) {
        return block[0][0] < exports.cameraPos[0] && block[1][0] > exports.cameraPos[0] && block[0][2] < exports.cameraPos[2] && block[1][2] > exports.cameraPos[2] && block[1][1] == exports.cameraPos[1];
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
                isOnFloor = false;
            }
        }
        if (isKeyDown['16' /*Shift*/]) {
            legHeight = SQUAT_HEIGHT;
        }
        else {
            if (legHeight == SQUAT_HEIGHT) {
                isGettingUp = true;
            }
            legHeight = STAND_HEIGHT;
        }
        var vBlocks = blocks_1.blocks.map(function (v) { return [add(v[0], vec3(-BODY_WIDTH, -HEAD_SIZE, -BODY_WIDTH)), add(v[1], vec3(BODY_WIDTH, legHeight, BODY_WIDTH))]; });
        if (!isOnFloor) {
            verticalSpeed += GRAVITY;
        }
        else {
            verticalSpeed = Math.max(0, verticalSpeed);
        }
        cameraMoveSpeed[1] += verticalSpeed;
        var lastPos = exports.cameraPos;
        exports.cameraPos = add(exports.cameraPos, cameraMoveSpeed);
        var isIn = vBlocks.map(function (v) { return isInBlock(v, exports.cameraPos); });
        if (isGettingUp) {
            vBlocks.map(function (v, i) {
                if (isIn[i]) {
                    exports.cameraPos[1] = Math.min(exports.cameraPos[1] + GETUP_SPEED, v[1][1]);
                    if (exports.cameraPos[1] == v[1][1]) {
                        isGettingUp = false;
                        isIn[i] = false;
                    }
                }
            });
        }
        if (exports.cameraPos[1] < lastPos[1]) {
            vBlocks.map(function (v, i) {
                if (isIn[i]) {
                    if (lastPos[1] >= v[1][1]) {
                        exports.cameraPos[1] = v[1][1];
                        isIn[i] = false;
                        isGettingUp = false;
                        isOnFloor = true;
                    }
                    if (v[1][1] - exports.cameraPos[1] <= GETUP_SPEED) {
                        exports.cameraPos[1] = v[1][1];
                        isIn[i] = false;
                        isGettingUp = false;
                        isOnFloor = true;
                    }
                }
            });
        }
        else if (exports.cameraPos[1] > lastPos[1]) {
            vBlocks.map(function (v, i) {
                if (isIn[i]) {
                    if (lastPos[1] <= v[0][1]) {
                        exports.cameraPos[1] = v[0][1];
                        isIn[i] = false;
                        verticalSpeed = 0;
                    }
                    else if (v[1][1] - exports.cameraPos[1] <= GETUP_SPEED) {
                        exports.cameraPos[1] = v[1][1];
                        isIn[i] = false;
                        isGettingUp = false;
                        isOnFloor = true;
                    }
                }
                else {
                }
            });
        }
        if (exports.cameraPos[0] < lastPos[0]) {
            vBlocks.map(function (v, i) {
                if (isIn[i]) {
                    if (lastPos[0] >= v[1][0]) {
                        exports.cameraPos[0] = v[1][0];
                        isIn[i] = false;
                    }
                }
            });
        }
        else if (exports.cameraPos[0] > lastPos[0]) {
            vBlocks.map(function (v, i) {
                if (isIn[i]) {
                    if (lastPos[0] <= v[0][0]) {
                        exports.cameraPos[0] = v[0][0];
                        isIn[i] = false;
                    }
                }
            });
        }
        if (exports.cameraPos[2] < lastPos[2]) {
            vBlocks.map(function (v, i) {
                if (isIn[i]) {
                    if (lastPos[2] >= v[1][2]) {
                        exports.cameraPos[2] = v[1][2];
                        isIn[i] = false;
                    }
                }
            });
        }
        else if (exports.cameraPos[2] > lastPos[2]) {
            vBlocks.map(function (v, i) {
                if (isIn[i]) {
                    if (lastPos[2] <= v[0][2]) {
                        exports.cameraPos[2] = v[0][2];
                        isIn[i] = false;
                    }
                }
            });
        }
        var flag = false;
        vBlocks.map(function (v, i) {
            if (isOnBlock(v)) {
                flag = true;
                isOnFloor = true;
                isGettingUp = false;
            }
            else if (isIn[i]) {
                flag = true;
                isOnFloor = true;
            }
        });
        if (!flag) {
            isOnFloor = false;
        }
    };
    //启动新宝岛的代码写在这里
    var launchNewIsland = function () {
        newIsland_1.performNewIsland();
        // alert("久等了")
    };
    function forceSetCamera(pos, front) {
        exports.cameraPos = pos;
        exports.cameraFront = front;
    }
    exports.forceSetCamera = forceSetCamera;
    // ==================================
    // 透视
    // ==================================
    var fovy = 90;
    var aspect = -16 / 9;
    var near = 0.05;
    var far = 2.8; // 越小越好（房间就显得越大），经过精密的调试，这个参数最棒
    exports.preCalculatedCPM = perspective(fovy, aspect, near, far);
});
