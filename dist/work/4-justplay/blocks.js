// ==================================
// 障碍物坐标文件
// by LongChen
// ==================================
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.blocks = [
        [vec3(-2, -2, -2), vec3(2, -1, 2)],
        [vec3(-2, 1, -2), vec3(2, 2, 2)],
        [vec3(1, -2, -2), vec3(2, 2, 2)],
        [vec3(-2, -2, -2), vec3(-1, 2, 2)],
        [vec3(-2, -2, 1), vec3(2, 2, 2)],
        [vec3(-2, -2, -2), vec3(2, 2, -1)],
        [vec3(-0.16, -2, -0.35), vec3(0.16, -0.2, -0.07)] // 魔方
    ];
});
