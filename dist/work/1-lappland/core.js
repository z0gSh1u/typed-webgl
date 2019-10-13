var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "../utils/WebGLUtils", "../utils/BezierCurve", "../../3rd-party/MV", "../../3rd-party/initShaders", "../utils/BezierCurve"], function (require, exports, WebGLUtils, BezierCurve_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebGLUtils = __importStar(WebGLUtils);
    // common variables
    var canvasDOM = document.querySelector('#cvs');
    var gl = canvasDOM.getContext('webgl');
    var program;
    var helper;
    var vBuffer, cBuffer;
    var main = function () {
        // initialization
        WebGLUtils.initializeCanvas(gl, canvasDOM);
        program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl');
        helper = new WebGLUtils.WebGLHelper2d(canvasDOM, gl, program);
        vBuffer = helper.createBuffer();
        cBuffer = helper.createBuffer();
        // helper.setLineWidth(5) // !!! won't work in Windows
        // organize component data
        var COLORS = {
            GRAY: [225, 225, 226],
            BLACK: [0, 0, 0],
            DARK: [53, 53, 53],
            SKIN: [249, 242, 242]
        };
        // organize and draw
        // 右耳
        var ear_right_1 = BezierCurve_1.generateBezierCurve2dL3([441, 37.5], [459.5, 68], [463.5, 121.5], [423, 152]);
        helper.drawImmediately(ear_right_1, gl.LINE_STRIP, 0, ear_right_1.length, COLORS.BLACK, vBuffer, 'aPosition', 2, cBuffer, 'aColor');
        helper.drawImmediately(ear_right_1, gl.TRIANGLE_FAN, 0, ear_right_1.length, COLORS.GRAY, vBuffer, 'aPosition', 2, cBuffer, 'aColor');
        // let ear_right_2 = generateStraightLineSegment([375, 85], [442, 43])
        // helper.drawImmediately(helper.convertCoordSystemAndFlatten(ear_right_2), gl.LINE_STRIP, 0, ear_right_2.length)
        var ear_filling_1 = [[375, 85], [425, 151], [443, 39]];
        var ear_right_2 = [[375, 85], [443, 39]];
        helper.drawImmediately(ear_right_2, gl.LINE_STRIP, 0, ear_right_2.length, COLORS.BLACK, vBuffer, 'aPosition', 2, cBuffer, 'aColor');
        helper.drawImmediately(ear_filling_1, gl.TRIANGLES, 0, ear_filling_1.length, COLORS.GRAY, vBuffer, 'aPosition', 2, cBuffer, 'aColor');
    };
    main();
});
