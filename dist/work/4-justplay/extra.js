// 杂项功能
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     *
     */
    /**
     * 播放新宝岛
     */
    function playNewIsland() {
        var audio = new Audio('./music.mp3');
        return audio.play();
    }
    exports.playNewIsland = playNewIsland;
});
