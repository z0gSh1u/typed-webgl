var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "../utils/WebGLHelper2d", "../utils/WebGLUtils", "../utils/BezierCurve", "../utils/BasicShape", "../utils/WebGLDrawingObject", "../utils/WebGLDrawingPackage", "../../3rd-party/MV", "../../3rd-party/initShaders"], function (require, exports, WebGLHelper2d_1, WebGLUtils, BezierCurve_1, BasicShape_1, WebGLDrawingObject_1, WebGLDrawingPackage_1) {
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
        fillingDefault();
        prepareDrawLater();
        helper.reRender();
    };
    // packages (components) used in render function
    var ear_right, ear_left, cute_left, cute_right, sharp_left, liusea, mouth, eye_left, eye_right, arm_left, hand_left, cloth_left, cloth_right, face, head, arm_right, hand_right, tail, cloth_center_1, leg_left, leg_right, foot_left, foot_right, cloth_center_2;
    // fill packages using default coordinate data
    var fillingDefault = function () {
        // organize and draw
        // 右耳
        ear_right = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("右瓣", [[441, 37.5], [459.5, 68], [463.5, 121.5], [423, 152]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣勾线", [[441, 37.5], [459.5, 68], [463.5, 121.5], [423, 152]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("左瓣勾线", [[375, 85], [443, 39]], null, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("中部", [[425, 151], [375, 85], [443, 39]], null, gl.TRIANGLE_FAN, COLORS.GRAY));
        // 左耳
        ear_left = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("左瓣", [[128, 44], [128, 72], [151, 144], [168, 151]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("左瓣勾线", [[128, 44], [128, 72], [151, 144], [168, 151]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣勾线", [[224, 75], [128, 44]], null, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣", [[166, 151], [224, 75], [128, 44]], null, gl.TRIANGLES, COLORS.GRAY));
        // 左呆毛
        cute_left = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("左瓣", [[247, 41], [248.5, 61.5], [275.5, 90.5], [301, 84]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("左瓣勾线", [[247, 41], [248.5, 61.5], [275.5, 90.5], [301, 84]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣勾线", [[247, 41], [332, 72]], null, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣", [[300, 84], [247, 41], [332, 72]], null, gl.TRIANGLES, COLORS.GRAY));
        // 右呆毛
        cute_right = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("右瓣", [[332, 34.5], [311, 30], [388, 30], [359, 82]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣勾线", [[332, 34.5], [311, 30], [388, 30], [359, 82]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("左瓣勾线", [[331, 73], [332, 34.5]], null, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("左瓣", [[361, 82], [331, 73], [332, 34.5]], null, gl.TRIANGLES, COLORS.GRAY));
        // 左尖毛
        sharp_left = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("下瓣", [[132.5, 188], [110, 192.3], [173.6, 189.6], [184, 179]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("下瓣勾线", [[132.5, 188], [110, 192.3], [173.6, 189.6], [184, 179]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("上瓣勾线", [[184, 136.3], [132.5, 188]], null, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("上瓣", [[184, 179], [184, 136.3], [132.5, 188]], null, gl.TRIANGLES, COLORS.GRAY));
        // 中央刘海
        liusea = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("左瓣", [[271.33, 129], [271.6, 165], [290.6, 204], [333, 202]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("左瓣勾线", [[271.33, 129], [271.6, 165], [290.6, 204], [333, 202]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣", [[365.5, 130], [365.6, 111.6], [368.6, 174.6], [328, 204]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣勾线", [[365.5, 130], [365.6, 111.6], [368.6, 174.6], [328, 204]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("中部", [[330.3, 204], [271.33, 129], [365.5, 130]], null, gl.TRIANGLES, COLORS.GRAY));
        // 嘴巴
        mouth = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("线", [[277.3, 257.6], [264.6, 244.6], [298.3, 293], [331, 264.6]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK));
        // 左眼（正视）
        eye_left = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("眼珠线", [[271.5, 225.3], [272, 240.3]], null, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("上眼线", [[233, 236], [248, 209.33], [287, 193], [294.6, 238]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("上眼底", [[233, 236], [248, 209.33], [287, 193], [294.6, 238]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.WHITE), new WebGLDrawingObject_1.WebGLDrawingObject("下眼线", [[233, 236], [218, 231], [289.6, 254], [294.6, 235.6]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("下眼底", [[233, 236], [218, 231], [289.6, 254], [294.6, 235.6]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.WHITE));
        // 右眼（正视）
        eye_right = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("眼珠线", [[347.5, 223], [348, 237]], null, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("上眼线", [[330, 229], [335.3, 209.6], [355.3, 195], [368, 228]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("上眼底", [[330, 229], [335.3, 209.6], [355.3, 195], [368, 228]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.WHITE), new WebGLDrawingObject_1.WebGLDrawingObject("下眼线", [[331, 229], [318, 229], [350, 250], [368, 226.6]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("下眼底", [[331, 229], [318, 229], [350, 250], [368, 226.6]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.WHITE));
        // 左臂（正视）
        arm_left = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("上连接点", [[223, 308.5], [209, 331.5], [263.5, 242], [272, 319]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.LIGHTGRAY), new WebGLDrawingObject_1.WebGLDrawingObject("主体", [[162, 395], [225, 306], [247, 429], [270, 315]], null, gl.TRIANGLE_STRIP, COLORS.LIGHTGRAY));
        // 左手（正视）
        hand_left = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("下部", [[174.6, 404.3], [142.6, 442.6], [162.6, 531.6], [220.6, 456]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.SKIN), new WebGLDrawingObject_1.WebGLDrawingObject("大拇指", [[220.6, 456], [225.6, 469.3], [236.3, 473.3], [236.6, 431.3]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.SKIN), new WebGLDrawingObject_1.WebGLDrawingObject("主体", [[174.6, 404.3], [220, 459.6], [237, 431.3]], null, gl.TRIANGLES, COLORS.SKIN));
        // 衣服左（正视）
        cloth_left = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("主体", [[210, 271], [295, 358], [298, 289], [210, 271], [295, 358], [144, 468], [144, 468], [295, 358], [273, 497]], null, gl.TRIANGLE_STRIP, COLORS.DARK));
        // 衣服右（正视）
        cloth_right = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("主体", [[277, 330], [346, 275], [319, 388], [347, 370], [391, 488]], null, gl.TRIANGLE_STRIP, COLORS.DARK));
        // 脸
        face = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("主体", [[304, 220], 170 / 2, 168 / 2], BasicShape_1.generateOval, gl.TRIANGLE_FAN, COLORS.SKIN), new WebGLDrawingObject_1.WebGLDrawingObject("勾线", [[304, 220], 170 / 2, 168 / 2], BasicShape_1.generateOval, gl.LINE_STRIP, COLORS.BLACK));
        // 头部实体
        head = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("主体", [[290, 180], 274 / 2, 235 / 2], BasicShape_1.generateOval, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("勾线", [[290, 180], 274 / 2, 235 / 2], BasicShape_1.generateOval, gl.LINE_STRIP, COLORS.BLACK));
        // 右臂（正视）
        arm_right = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("主体", [[347, 361], [390, 401], [365, 417]], null, gl.TRIANGLES, COLORS.DARK));
        // 右手（正视）
        hand_right = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("大拇指", [[393.3, 443.3], [383.3, 435], [426.3, 463], [380.3, 409.6]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.SKIN), new WebGLDrawingObject_1.WebGLDrawingObject("主体", [[376, 444], [367, 418], [392, 438], [381, 411]], null, gl.TRIANGLE_STRIP, COLORS.SKIN), new WebGLDrawingObject_1.WebGLDrawingObject("下部", [[347, 361], [390, 401], [365, 417], [376, 444], [389, 438], [387.3, 478.6]], null, gl.TRIANGLES, COLORS.SKIN));
        // 尾巴
        tail = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("左瓣", [[150.6, 472.6], [136.6, 512.6], [133.3, 547.6], [139, 563]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("左瓣勾线", [[150.6, 472.6], [136.6, 512.6], [133.3, 547.6], [139, 563]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣", [[139, 564.3], [106, 571.3], [207.6, 554], [225.3, 508.6]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new WebGLDrawingObject_1.WebGLDrawingObject("右瓣勾线", [[139, 564.3], [106, 571.3], [207.6, 554], [225.3, 508.6]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new WebGLDrawingObject_1.WebGLDrawingObject("中部", [[150.6, 472.6], [138, 565], [225.3, 509.6], [150.6, 472.6], [225.3, 509.6], [224, 489]], null, gl.TRIANGLES, COLORS.GRAY));
        // 衣服中间 - Part 1
        cloth_center_1 = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("主体", [[298.5, 359.75], [281.5, 463], [360, 448]], null, gl.TRIANGLES, COLORS.DARK));
        // 左腿（正视）
        leg_left = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("主体", [[226, 489], [227, 505], [272, 497], [196, 588], [254, 598]], null, gl.TRIANGLE_STRIP, COLORS.SKIN));
        // 右腿（正视）
        leg_right = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("左上瓣", [[340, 454], [303, 462], [358, 498], [315, 506], [308, 596]], null, gl.TRIANGLE_STRIP, COLORS.SKIN), new WebGLDrawingObject_1.WebGLDrawingObject("右下瓣", [[358, 498], [308, 596], [364, 595]], null, gl.TRIANGLES, COLORS.SKIN));
        // 左脚（正视）
        foot_left = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("主体", [[262, 599], [187, 585], [270, 670], [169, 662]], null, gl.TRIANGLE_STRIP, COLORS.DARK));
        // 右脚（正视）
        foot_right = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("主体", [[377, 596], [300, 598], [397, 662], [297, 665]], null, gl.TRIANGLE_STRIP, COLORS.DARK));
        // 衣服中间 - Part 2
        cloth_center_2 = new WebGLDrawingPackage_1.WebGLDrawingPackage(new WebGLDrawingObject_1.WebGLDrawingObject("主体", [[360, 448], [280, 467], [387, 484]], null, gl.TRIANGLES, COLORS.DARK));
    };
    // buffer current coordinate data to helper
    var prepareDrawLater = function () {
        helper.drawPackageLater(ear_right);
        helper.drawPackageLater(ear_left);
        helper.drawPackageLater(cute_left);
        helper.drawPackageLater(cute_right);
        helper.drawPackageLater(sharp_left);
        helper.drawPackageLater(liusea);
        helper.drawPackageLater(mouth);
        helper.drawPackageLater(eye_left);
        helper.drawPackageLater(eye_right);
        helper.drawPackageLater(arm_left);
        helper.drawPackageLater(hand_left);
        helper.drawPackageLater(cloth_left);
        helper.drawPackageLater(cloth_right);
        helper.drawPackageLater(face);
        helper.drawPackageLater(head);
        helper.drawPackageLater(arm_right);
        helper.drawPackageLater(hand_right);
        helper.drawPackageLater(tail);
        helper.drawPackageLater(cloth_center_1);
        helper.drawPackageLater(leg_left);
        helper.drawPackageLater(leg_right);
        helper.drawPackageLater(foot_left);
        helper.drawPackageLater(foot_right);
        helper.drawPackageLater(cloth_center_2);
    };
    var processDKey = function () {
        // 右脚前进
        [leg_right, foot_right].forEach(function (ele) {
            ele.performToAllObjectData(function (vec) {
                var _vec = vec;
                var res = helper.getRotatedPoint(_vec, [318, 444], 15);
                return res;
            });
        });
        // 左脚前进
        [leg_left, foot_left].forEach(function (ele) {
            ele.performToAllObjectData(function (vec) {
                var _vec = vec;
                var res = helper.getRotatedPoint(_vec, [251, 480], 15);
                return res;
            });
        });
        prepareDrawLater();
        helper.reRender();
    };
    var processSpaceKey = function () {
        var step = 9, max = 45, min = -45;
        var rec = 0;
        var itv = setInterval(function () {
            fillingDefault();
            [leg_right, foot_right].forEach(function (ele) {
                ele.performToAllObjectData(function (vec) {
                    var _vec = vec;
                    var res = helper.getRotatedPoint(_vec, [318, 444], rec + step);
                    return res;
                });
                rec += step;
                prepareDrawLater();
                helper.reRender();
                if (rec > max) {
                    clearInterval(itv);
                }
            });
        }, 200);
        rec = 0;
    };
    var listenKeyboard = function () {
        // A, D, Space
        // 右腿绕轴转动测试
        console.log(leg_right);
        window.onkeydown = function (e) {
            if (e && e.keyCode == 68 /*D*/) {
                processDKey();
            }
            else if (e && e.keyCode == 32 /*Space*/) {
                processSpaceKey();
            }
        };
    };
    main();
    listenKeyboard();
});
