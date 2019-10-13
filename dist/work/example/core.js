var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "../utils/WebGLUtils", "../../3rd-party/MV", "../../3rd-party/initShaders"], function (require, exports, WebGLUtils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebGLUtils = __importStar(WebGLUtils);
    // common variables
    var canvasDOM = document.querySelector('#cvs');
    var gl = canvasDOM.getContext('webgl');
    var program;
    var helper;
    var mainBuffer;
    // bind code to hook `window.onload`
    window.onload = function () {
        // initialization
        WebGLUtils.initializeCanvas(gl, canvasDOM);
        program = WebGLUtils.initializeShaders(gl, './vShader.glsl', './fShader.glsl');
        helper = new WebGLUtils.WebGLHelper2d(canvasDOM, gl, program);
        mainBuffer = helper.createBuffer();
        // organize data
        var vertices = [
            vec2(0, 1),
            vec2(-1, 0),
            vec2(1, 0),
            vec2(0, -1)
        ];
        // send to buffer, and convey to attribute next
        helper.vertexSettingMode(mainBuffer, "vPosition", 2);
        helper.sendDataToBuffer(flatten(vertices));
        // request shader to draw it
        helper.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
});
