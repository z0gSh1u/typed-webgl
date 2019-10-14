var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "../utils/WebGLHelper2d", "../utils/WebGLUtils", "../utils/BezierCurve", "../utils/WebGLDrawingObject", "../utils/WebGLDrawingPackage", "../../3rd-party/MV", "../../3rd-party/initShaders"], function (require, exports, WebGLHelper2d_1, WebGLUtils, BezierCurve_1, WebGLDrawingObject_1, WebGLDrawingPackage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebGLUtils = __importStar(WebGLUtils);
    // common variables
    var canvasDOM = document.querySelector('#cvs');
    var gl = canvasDOM.getContext('webgl');
    var program;
    var helper;
    var vBuffer, cBuffer;
    // used colors
    var COLORS = {
        GRAY: [225, 225, 226],
        BLACK: [0, 0, 0],
        DARK: [80, 80, 80],
        LIGHTGRAY: [110, 110, 110],
        SKIN: [244, 237, 237],
        WHITE: [255, 255, 255]
    };
    // main function
    var main = function () {
        // initialization
        WebGLUtils.initializeCanvas(gl, canvasDOM);
        program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl');
        helper = new WebGLHelper2d_1.WebGLHelper2d(canvasDOM, gl, program);
        vBuffer = helper.createBuffer();
        cBuffer = helper.createBuffer();
        helper.setGlobalSettings(vBuffer, cBuffer, "aPosition", 2, "aColor");
        gl.enable(gl.DEPTH_TEST);
        // render
        render();
    };
    // packages (components) used in render function
    // render function
    var render = function () {
        // organize and draw
        // 右耳
        var ear_right = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("右瓣", [[441, 37.5], [459.5, 68], [463.5, 121.5], [423, 152]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣勾线", [[441, 37.5], [459.5, 68], [463.5, 121.5], [423, 152]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("左瓣勾线", [[375, 85], [443, 39]], null, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("中部", [[425, 151], [375, 85], [443, 39]], null, gl.TRIANGLE_FAN, COLORS.GRAY));
        helper.drawPackageLater(ear_right);
        // 左耳
        var ear_left = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("左瓣", [[128, 44], [128, 72], [151, 144], [168, 151]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("左瓣勾线", [[128, 44], [128, 72], [151, 144], [168, 151]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣勾线", [[224, 75], [128, 44]], null, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣", [[166, 151], [224, 75], [128, 44]], null, gl.TRIANGLES, COLORS.GRAY));
        helper.drawPackageLater(ear_left);
        // 左呆毛
        var cute_left = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("左瓣", [[247, 41], [248.5, 61.5], [275.5, 90.5], [301, 84]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("左瓣勾线", [[247, 41], [248.5, 61.5], [275.5, 90.5], [301, 84]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣勾线", [[247, 41], [332, 72]], null, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣", [[300, 84], [247, 41], [332, 72]], null, gl.TRIANGLES, COLORS.GRAY));
        helper.drawPackageLater(cute_left);
        // 右呆毛
        var cute_right = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("右瓣", [[332, 34.5], [311, 30], [388, 30], [359, 82]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣勾线", [[332, 34.5], [311, 30], [388, 30], [359, 82]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("左瓣勾线", [[331, 73], [332, 34.5]], null, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("左瓣", [[361, 82], [331, 73], [332, 34.5]], null, gl.TRIANGLES, COLORS.GRAY));
        helper.drawPackageLater(cute_right);
        // 左尖毛
        var sharp_left = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("下瓣", [[132.5, 188], [110, 192.3], [173.6, 189.6], [184, 179]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("下瓣勾线", [[132.5, 188], [110, 192.3], [173.6, 189.6], [184, 179]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("上瓣勾线", [[184, 136.3], [132.5, 188]], null, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("上瓣", [[184, 179], [184, 136.3], [132.5, 188]], null, gl.TRIANGLES, COLORS.GRAY));
        helper.drawPackageLater(sharp_left);
        // 中央刘海
        var liusea = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("左瓣", [[271.33, 129], [271.6, 165], [290.6, 204], [333, 202]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("左瓣勾线", [[271.33, 129], [271.6, 165], [290.6, 204], [333, 202]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣", [[365.5, 130], [365.6, 111.6], [368.6, 174.6], [328, 204]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣勾线", [[365.5, 130], [365.6, 111.6], [368.6, 174.6], [328, 204]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("中部", [[330.3, 204], [271.33, 129], [365.5, 130]], null, gl.TRIANGLES, COLORS.GRAY));
        helper.drawPackageLater(liusea);
        // 嘴巴
        var mouth = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("线", [[277.3, 257.6], [264.6, 244.6], [298.3, 293], [331, 264.6]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK));
        helper.drawPackageLater(mouth);
        // 左眼（正视）
        helper.reRender();
    };
    var listenKeyboard = function () {
        // A, D, Space
        // 右腿绕轴转动测试
        var leg_right_1 = [[340, 454], [303, 462], [358, 498], [315, 506], [308, 596]];
        var leg_right_2 = [[358, 498], [308, 596], [364, 595]];
        // 旋转15度测试
        var rotateMat = mat2(Math.cos(radians(15)), -Math.sin(radians(15)), Math.sin(radians(15)), Math.cos(radians(15)));
        var newFR1 = leg_right_1.map(function (vec) { return mult(rotateMat, vec); });
        helper.drawImmediately(newFR1, gl.TRIANGLE_STRIP, 0, newFR1.length, COLORS.SKIN);
        var newFR2 = leg_right_2.map(function (vec) { return mult(rotateMat, vec); });
        helper.drawImmediately(newFR1, gl.TRIANGLES, 0, newFR1.length, COLORS.SKIN);
    };
    main();
});
// listenKeyboard()
