define(["require", "exports", "../../framework/2d/DrawingPackage2d", "../../framework/2d/DrawingObject2d", "../../framework/2d/BezierCurve", "../../framework/2d/BasicShape", "../../framework/WebGLUtils"], function (require, exports, DrawingPackage2d_1, DrawingObject2d_1, BezierCurve_1, BasicShape_1, WebGLUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // packages (components) used in render function
    var ear_right, ear_left, cute_left, cute_right, sharp_left, liusea, mouth, eye_left, eye_right, arm_left, hand_left, cloth_left, cloth_right, face, head, arm_right, hand_right, tail, cloth_center_1, leg_left, leg_right, foot_left, foot_right, cloth_center_2, backhair_left;
    // get the whole entity, ensuring the order
    var getLappland = function () {
        return [ear_right, ear_left, cute_left, cute_right, sharp_left, liusea, mouth,
            eye_left, eye_right, arm_left, hand_left, cloth_left, cloth_right, face, head,
            backhair_left, arm_right, hand_right, leg_left, tail, cloth_center_1,
            leg_right, foot_left, foot_right, cloth_center_2];
    };
    // ==========================================
    var canvasDOM;
    var gl;
    var vBuffer;
    var helper;
    function __lappland_adapter(_canvasDOM, _gl, _helper) {
        canvasDOM = _canvasDOM;
        gl = _gl;
        helper = _helper;
        vBuffer = helper.createBuffer();
        // 右耳
        ear_right = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("右瓣", [[441, 37.5], [459.5, 68], [463.5, 121.5], [423, 152]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new DrawingObject2d_1.DrawingObject2d("右瓣勾线", [[441, 37.5], [459.5, 68], [463.5, 121.5], [423, 152]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("左瓣勾线", [[375, 85], [443, 39]], null, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("中部", [[425, 151], [375, 85], [443, 39]], null, gl.TRIANGLE_FAN, COLORS.GRAY));
        // 左耳
        ear_left = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("左瓣", [[128, 44], [128, 72], [151, 144], [168, 151]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new DrawingObject2d_1.DrawingObject2d("左瓣勾线", [[128, 44], [128, 72], [151, 144], [168, 151]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("右瓣勾线", [[224, 75], [128, 44]], null, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("右瓣", [[166, 151], [224, 75], [128, 44]], null, gl.TRIANGLES, COLORS.GRAY));
        // 左呆毛
        cute_left = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("左瓣", [[247, 41], [248.5, 61.5], [275.5, 90.5], [301, 84]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new DrawingObject2d_1.DrawingObject2d("左瓣勾线", [[247, 41], [248.5, 61.5], [275.5, 90.5], [301, 84]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("右瓣勾线", [[247, 41], [332, 72]], null, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("右瓣", [[300, 84], [247, 41], [332, 72]], null, gl.TRIANGLES, COLORS.GRAY));
        // 右呆毛
        cute_right = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("右瓣", [[332, 34.5], [311, 30], [388, 30], [359, 82]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new DrawingObject2d_1.DrawingObject2d("右瓣勾线", [[332, 34.5], [311, 30], [388, 30], [359, 82]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("左瓣勾线", [[331, 73], [332, 34.5]], null, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("左瓣", [[361, 82], [331, 73], [332, 34.5]], null, gl.TRIANGLES, COLORS.GRAY));
        // 左尖毛
        sharp_left = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("下瓣", [[132.5, 188], [110, 192.3], [173.6, 189.6], [184, 179]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new DrawingObject2d_1.DrawingObject2d("下瓣勾线", [[132.5, 188], [110, 192.3], [173.6, 189.6], [184, 179]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("上瓣勾线", [[184, 136.3], [132.5, 188]], null, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("上瓣", [[184, 179], [184, 136.3], [132.5, 188]], null, gl.TRIANGLES, COLORS.GRAY));
        // 中央刘海
        liusea = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("左瓣", [[271.33, 129], [271.6, 165], [290.6, 204], [333, 202]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new DrawingObject2d_1.DrawingObject2d("左瓣勾线", [[271.33, 129], [271.6, 165], [290.6, 204], [333, 202]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("右瓣", [[365.5, 130], [365.6, 111.6], [368.6, 174.6], [328, 204]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new DrawingObject2d_1.DrawingObject2d("右瓣勾线", [[365.5, 130], [365.6, 111.6], [368.6, 174.6], [328, 204]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("中部", [[330.3, 204], [271.33, 129], [365.5, 130]], null, gl.TRIANGLES, COLORS.GRAY));
        // 嘴巴
        mouth = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("线", [[277.3, 257.6], [264.6, 244.6], [298.3, 293], [331, 264.6]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK));
        // 左眼（正视）
        eye_left = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("眼珠线", [[271.5, 225.3], [272, 240.3]], null, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("上眼线", [[233, 236], [248, 209.33], [287, 193], [294.6, 238]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("上眼底", [[233, 236], [248, 209.33], [287, 193], [294.6, 238]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.WHITE), new DrawingObject2d_1.DrawingObject2d("下眼线", [[233, 236], [218, 231], [289.6, 254], [294.6, 235.6]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("下眼底", [[233, 236], [218, 231], [289.6, 254], [294.6, 235.6]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.WHITE));
        // 右眼（正视）
        eye_right = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("眼珠线", [[347.5, 223], [348, 237]], null, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("上眼线", [[330, 229], [335.3, 209.6], [355.3, 195], [368, 228]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("上眼底", [[330, 229], [335.3, 209.6], [355.3, 195], [368, 228]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.WHITE), new DrawingObject2d_1.DrawingObject2d("下眼线", [[331, 229], [318, 229], [350, 250], [368, 226.6]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("下眼底", [[331, 229], [318, 229], [350, 250], [368, 226.6]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.WHITE));
        // 左臂（正视）
        arm_left = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("上连接点", [[223, 308.5], [209, 331.5], [263.5, 242], [272, 319]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.DARKGRAY), new DrawingObject2d_1.DrawingObject2d("主体", [[162, 395], [225, 306], [247, 429], [270, 315]], null, gl.TRIANGLE_STRIP, COLORS.DARKGRAY));
        // 左手（正视）
        hand_left = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("下部", [[174.6, 404.3], [142.6, 442.6], [162.6, 531.6], [220.6, 456]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.SKIN), new DrawingObject2d_1.DrawingObject2d("大拇指", [[220.6, 456], [225.6, 469.3], [236.3, 473.3], [236.6, 431.3]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.SKIN), new DrawingObject2d_1.DrawingObject2d("主体", [[174.6, 404.3], [220, 459.6], [237, 431.3]], null, gl.TRIANGLES, COLORS.SKIN));
        // 衣服左（正视）
        cloth_left = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("主体", [[210, 271], [295, 358], [298, 289], [210, 271], [295, 358], [144, 468], [144, 468], [295, 358], [273, 497]], null, gl.TRIANGLE_STRIP, COLORS.DARK));
        // 衣服右（正视）
        cloth_right = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("主体", [[277, 330], [346, 275], [319, 388], [347, 370], [391, 488]], null, gl.TRIANGLE_STRIP, COLORS.DARK));
        // 脸
        face = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("主体", [[304, 220], 170 / 2, 168 / 2], BasicShape_1.generateOval, gl.TRIANGLE_FAN, COLORS.SKIN), new DrawingObject2d_1.DrawingObject2d("勾线", [[304, 220], 170 / 2, 168 / 2], BasicShape_1.generateOval, gl.LINE_STRIP, COLORS.BLACK));
        // 头部实体
        head = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("主体", [[290, 180], 274 / 2, 235 / 2], BasicShape_1.generateOval, gl.TRIANGLE_FAN, COLORS.GRAY), new DrawingObject2d_1.DrawingObject2d("勾线", [[290, 180], 274 / 2, 235 / 2], BasicShape_1.generateOval, gl.LINE_STRIP, COLORS.BLACK));
        // 后部头发左
        backhair_left = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("左部", [[155, 200], [116.5, 239.5], [62.5, 310.5], [49, 392.5]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new DrawingObject2d_1.DrawingObject2d("左部勾线", [[155, 200], [116.5, 239.5], [62.5, 310.5], [49, 392.5]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("右部", [[179, 260], [166, 292.5], [102.5, 366.5], [49, 392.5]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new DrawingObject2d_1.DrawingObject2d("右部勾线", [[179, 260], [166, 292.5], [102.5, 366.5], [49, 392.5]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("下部", [[112, 332.5], [97.5, 379.5], [110, 437.5], [141.5, 463]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new DrawingObject2d_1.DrawingObject2d("下部勾线", [[112, 332.5], [97.5, 379.5], [110, 437.5], [141.5, 463]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("下部右边", [[158, 441], [141.5, 463]], null, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("上中部", [[49, 392.5], [184.5, 254], [152, 202]], null, gl.TRIANGLES, COLORS.GRAY), new DrawingObject2d_1.DrawingObject2d("下中部", [[110, 329], [141.5, 463], [179, 254], [210, 344], [221, 270.5]], null, gl.TRIANGLE_STRIP, COLORS.GRAY));
        // 右臂（正视）
        arm_right = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("主体", [[347, 361], [390, 401], [365, 417]], null, gl.TRIANGLES, COLORS.DARK));
        // 右手（正视）
        hand_right = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("大拇指", [[393.3, 443.3], [383.3, 435], [426.3, 463], [380.3, 409.6]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.SKIN), new DrawingObject2d_1.DrawingObject2d("主体", [[376, 444], [367, 418], [392, 438], [381, 411]], null, gl.TRIANGLE_STRIP, COLORS.SKIN), new DrawingObject2d_1.DrawingObject2d("下部", [[347, 361], [390, 401], [365, 417], [376, 444], [389, 438], [387.3, 478.6]], null, gl.TRIANGLES, COLORS.SKIN));
        // 左腿（正视）
        leg_left = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("主体", [[226, 489], [227, 505], [272, 497], [196, 588], [254, 598]], null, gl.TRIANGLE_STRIP, COLORS.SKIN));
        // 尾巴
        tail = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("左瓣", [[137, 559], [142, 598], [97, 440], [236, 433]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new DrawingObject2d_1.DrawingObject2d("左瓣勾线", [[137, 559], [142, 598], [97, 440], [236, 433]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("右瓣", [[137, 559], [112, 570], [290, 541], [236, 433]], BezierCurve_1.generateBezierCurve2dL3, gl.TRIANGLE_FAN, COLORS.GRAY), new DrawingObject2d_1.DrawingObject2d("右瓣勾线", [[137, 559], [112, 570], [290, 541], [236, 433]], BezierCurve_1.generateBezierCurve2dL3, gl.LINE_STRIP, COLORS.BLACK), new DrawingObject2d_1.DrawingObject2d("中部", [[137, 559], [200, 443], [240, 461]], null, gl.TRIANGLES, COLORS.GRAY));
        // 衣服中间 - Part 1
        cloth_center_1 = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("主体", [[298.5, 359.75], [281.5, 463], [360, 448]], null, gl.TRIANGLES, COLORS.DARK));
        // 右腿（正视）
        leg_right = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("左上瓣", [[340, 454], [303, 462], [358, 498], [315, 506], [308, 596]], null, gl.TRIANGLE_STRIP, COLORS.SKIN), new DrawingObject2d_1.DrawingObject2d("右下瓣", [[358, 498], [308, 596], [364, 595]], null, gl.TRIANGLES, COLORS.SKIN));
        // 左脚（正视）
        foot_left = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("主体", [[262, 599], [187, 585], [270, 670], [169, 662]], null, gl.TRIANGLE_STRIP, COLORS.DARK));
        // 右脚（正视）
        foot_right = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("主体", [[377, 596], [300, 598], [397, 662], [297, 665]], null, gl.TRIANGLE_STRIP, COLORS.DARK));
        // 衣服中间 - Part 2
        cloth_center_2 = new DrawingPackage2d_1.DrawingPackage2d(new DrawingObject2d_1.DrawingObject2d("主体", [[360, 448], [280, 467], [387, 484]], null, gl.TRIANGLES, COLORS.DARK));
        faceToward = 1; // 1: right, -1: left
        legLeftCenter = [251, 480];
        legRightCenter = [318, 444];
        legStatus = { L: 5, R: -5 };
    }
    exports.__lappland_adapter = __lappland_adapter;
    canvasDOM = canvasDOM;
    gl = gl;
    helper = helper;
    function __lappland_reRender(programIndex) {
        console.log('__lappland_reRender called.');
        var h = helper;
        h.switchProgram(programIndex);
        var g = gl;
        getLappland().forEach(function (pkg) {
            pkg.getInnerList().forEach(function (obj) {
                var c = WebGLUtils_1.normalize8bitColor(obj.getColor());
                h.prepare({
                    attributes: [
                        { buffer: vBuffer, data: flatten(obj.getCookedData()), varName: 'aPosition', attrPer: 2, type: g.FLOAT },
                    ],
                    uniforms: [
                        { varName: 'uColor', data: c, method: '4fv' },
                    ]
                });
                h.drawArrays(obj.getMethod(), obj.getArg1(), obj.getArg2());
            });
        });
    }
    exports.__lappland_reRender = __lappland_reRender;
    // ==========================================
    var faceToward = 1; // 1: right, -1: left
    var legLeftCenter = [251, 480];
    var legRightCenter = [318, 444];
    var isJumping = false;
    var JUMP_V = -1000; // 起跳初速度(每秒)
    var GRAVITY = 2000; // 重力加速度(每秒)
    var INTERVAL = 40; // 渲染间隔(毫秒)
    var GROUND = 632; //地面Y坐标
    var AXIS = 300; // 身体中线
    var curV = 0;
    var curPos = GROUND;
    var legStatus = { L: 5, R: -5 }; // new mechanism: positive to right, negative to left, from -10 to 10, no 0
    // used colors
    var COLORS = {
        GRAY: [225, 225, 226],
        BLACK: [0, 0, 0],
        DARK: [80, 80, 80],
        DARKGRAY: [110, 110, 110],
        LIGHTGRAY: [245, 245, 245],
        SKIN: [244, 237, 237],
        WHITE: [255, 255, 255]
    };
    // update leg status to next one
    var nextLegStatus = function () {
        var h;
        h = function (a) {
            if (a >= 10)
                return -1;
            else if (a <= -10)
                return 1;
            else if (a > 0)
                return a + 1;
            else if (a < 0)
                return a - 1;
            else
                return 0;
        };
        legStatus.L = h(legStatus.L);
        legStatus.R = h(legStatus.R);
    };
    // get leg rotation angle according to the status turning to
    var rotationAngle;
    rotationAngle = function (status) {
        if (status > 0)
            return -5;
        else if (status < 0)
            return 5;
        else
            return 0;
    };
    var mirrorIt = function () {
        getLappland().forEach(function (ele) {
            ele.performToAllObjectData(function (vec) {
                var _vec = vec;
                var res = WebGLUtils_1.getTurnedPoint(_vec, AXIS);
                return res;
            });
        });
        legRightCenter = WebGLUtils_1.getTurnedPoint(legRightCenter, AXIS);
        legLeftCenter = WebGLUtils_1.getTurnedPoint(legLeftCenter, AXIS);
        legStatus.L *= -1;
        legStatus.R *= -1;
    };
    // process D key press
    function __lappland_goRight() {
        if (faceToward == -1) {
            faceToward = 1;
            // mirror it
            mirrorIt();
        }
        nextLegStatus();
        // 右脚前进
        [leg_right, foot_right].forEach(function (ele) {
            ele.performToAllObjectData(function (vec) {
                var _vec = vec;
                var res = WebGLUtils_1.getRotatedPoint(canvasDOM, _vec, [legRightCenter[0], legRightCenter[1]], rotationAngle(legStatus.R));
                return res;
            });
        });
        // 左脚前进
        [leg_left, foot_left].forEach(function (ele) {
            ele.performToAllObjectData(function (vec) {
                var _vec = vec;
                var res = WebGLUtils_1.getRotatedPoint(canvasDOM, _vec, [legLeftCenter[0], legLeftCenter[1]], rotationAngle(legStatus.L));
                return res;
            });
        });
    }
    exports.__lappland_goRight = __lappland_goRight;
    // process A key press
    function __lappland_goLeft() {
        if (faceToward == 1) {
            faceToward = -1;
            // mirror it
            mirrorIt();
        }
        nextLegStatus();
        // 右脚前进
        [leg_right, foot_right].forEach(function (ele) {
            ele.performToAllObjectData(function (vec) {
                var _vec = vec;
                var res = WebGLUtils_1.getRotatedPoint(canvasDOM, _vec, [legRightCenter[0], legRightCenter[1]], rotationAngle(legStatus.R));
                return res;
            });
        });
        // 左脚前进
        [leg_left, foot_left].forEach(function (ele) {
            ele.performToAllObjectData(function (vec) {
                var _vec = vec;
                var res = WebGLUtils_1.getRotatedPoint(canvasDOM, _vec, [legLeftCenter[0], legLeftCenter[1]], rotationAngle(legStatus.L));
                return res;
            });
        });
    }
    exports.__lappland_goLeft = __lappland_goLeft;
    function __lappland_jump() {
        isJumping = true;
        curV = JUMP_V;
        var id = setInterval(function () {
            var moveDis = curV * INTERVAL / 1000;
            curV += GRAVITY * INTERVAL / 1000;
            curPos += moveDis;
            if (curPos > GROUND) {
                moveDis -= curPos - GROUND;
                curPos = GROUND;
                isJumping = false;
                curV = 0;
                clearInterval(id);
            }
            getLappland().forEach(function (ele) {
                ele.performToAllObjectData(function (vec) {
                    var _vec = vec;
                    var res = _vec;
                    res = WebGLUtils_1.getMovedPoint(_vec, [0, moveDis]);
                    return res;
                });
            });
        }, INTERVAL);
    }
    exports.__lappland_jump = __lappland_jump;
});
