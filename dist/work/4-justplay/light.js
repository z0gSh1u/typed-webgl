// ==================================
// 光照实现
// by z0gSh1u
// ==================================
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var timerID;
    var hasStart = false;
    var lightBulbPosition = [0.0, 1.0, 0.0];
    var PER_ROTATE_DEG = 7;
    var lightAutoRotateAtom = function () {
        var v4 = vec4.apply(void 0, __spreadArrays(lightBulbPosition, [1.0]));
        v4 = mult(rotateZ(PER_ROTATE_DEG), v4);
        lightBulbPosition = vec3.apply(void 0, v4);
    };
    function getLightBulbPosition() {
        return lightBulbPosition;
    }
    exports.getLightBulbPosition = getLightBulbPosition;
    function startLightBulbAutoRotate(msPeriod) {
        timerID = window.setInterval(function () {
            lightAutoRotateAtom();
        }, msPeriod);
        hasStart = true;
    }
    exports.startLightBulbAutoRotate = startLightBulbAutoRotate;
    function stopLightBulbAutoRotate() {
        if (hasStart) {
            window.clearInterval(timerID);
        }
        hasStart = false;
    }
    exports.stopLightBulbAutoRotate = stopLightBulbAutoRotate;
    function setLightBulbPositionForce(v3) {
        stopLightBulbAutoRotate();
        lightBulbPosition = v3;
    }
    exports.setLightBulbPositionForce = setLightBulbPositionForce;
});
