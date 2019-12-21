define(["require", "exports", "./roam"], function (require, exports, roam_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // 魔法方块
    var vBuffer;
    var nBuffer;
    var texture;
    function initMagicCube(canvasDOM, helper, magicCubeProgram) {
        helper.switchProgram(magicCubeProgram);
        var gl = helper.glContext;
        vBuffer = helper.createBuffer();
        nBuffer = helper.createBuffer();
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        var faceInfos = [
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                url: './model/texture/Cube/1.png',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                url: './model/texture/Cube/2.png',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                url: './model/texture/Cube/3.png',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                url: './model/texture/Cube/4.png',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                url: './model/texture/Cube/5.png',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                url: './model/texture/Cube/6.png',
            },
        ];
        faceInfos.forEach(function (faceInfo) {
            var target = faceInfo.target, url = faceInfo.url;
            var level = 0;
            var internalFormat = gl.RGBA;
            var width = 512;
            var height = 512;
            var format = gl.RGBA;
            var type = gl.UNSIGNED_BYTE;
            gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
            var image = new Image();
            image.src = url;
            image.addEventListener('load', function () {
                gl.activeTexture(gl.TEXTURE20);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.texImage2D(target, level, internalFormat, format, type, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            });
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }
    exports.initMagicCube = initMagicCube;
    function renderMagicCube(helper, perspectiveMat, programIndex, theta) {
        helper.switchProgram(programIndex);
        var gl = helper.glContext;
        var ctm = roam_1.getLookAt();
        helper.prepare({
            attributes: [
                { buffer: vBuffer, data: positions, varName: 'vPoition', attrPer: 3, type: gl.FLOAT },
                { buffer: nBuffer, data: normals, varName: 'Normal', attrPer: 3, type: gl.FLOAT },
            ],
            uniforms: [
                { varName: 'texMap', data: 20, method: '1i' },
                { varName: 'uWorldMatrix', data: flatten(ctm), method: 'Matrix4fv' },
                { varName: 'uModelMatrix', data: flatten(translate(0.2, 0.2, 0.2)), method: 'Matrix4fv' },
                { varName: 'uProjectionMatrix', data: flatten(perspectiveMat), method: 'Matrix4fv' },
            ]
        });
        // Draw the geometry.
        helper.drawArrays(gl.TRIANGLES, 0, 6 * 6);
    }
    exports.renderMagicCube = renderMagicCube;
    var positions = new Float32Array([
        -0.2, -0.2, -0.2, -0.2, 0.2, -0.2,
        0.2, -0.2, -0.2, -0.2, 0.2, -0.2,
        0.2, 0.2, -0.2, 0.2, -0.2, -0.2,
        -0.2, -0.2, 0.2, 0.2, -0.2, 0.2,
        -0.2, 0.2, 0.2, -0.2, 0.2, 0.2,
        0.2, -0.2, 0.2, 0.2, 0.2, 0.2,
        -0.2, 0.2, -0.2, -0.2, 0.2, 0.2,
        0.2, 0.2, -0.2, -0.2, 0.2, 0.2,
        0.2, 0.2, 0.2, 0.2, 0.2, -0.2,
        -0.2, -0.2, -0.2, 0.2, -0.2, -0.2,
        -0.2, -0.2, 0.2, -0.2, -0.2, 0.2,
        0.2, -0.2, -0.2, 0.2, -0.2, 0.2,
        -0.2, -0.2, -0.2, -0.2, -0.2, 0.2,
        -0.2, 0.2, -0.2, -0.2, -0.2, 0.2,
        -0.2, 0.2, 0.2, -0.2, 0.2, -0.2,
        0.2, -0.2, -0.2, 0.2, 0.2, -0.2,
        0.2, -0.2, 0.2, 0.2, -0.2, 0.2,
        0.2, 0.2, -0.2, 0.2, 0.2, 0.2,
    ]);
    var normals = new Float32Array([
        0, 0, -1, 0, 0, -1,
        0, 0, -1, 0, 0, -1,
        0, 0, -1, 0, 0, -1,
        0, 0, 1, 0, 0, 1,
        0, 0, 1, 0, 0, 1,
        0, 0, 1, 0, 0, 1,
        0, 1, 0, 0, 1, 0,
        0, 1, 0, 0, 1, 0,
        0, 1, 0, 0, 1, 0,
        0, -1, 0, 0, -1, 0,
        0, -1, 0, 0, -1, 0,
        0, -1, 0, 0, -1, 0,
        -1, 0, 0, -1, 0, 0,
        -1, 0, 0, -1, 0, 0,
        -1, 0, 0, -1, 0, 0,
        1, 0, 0, 1, 0, 0,
        1, 0, 0, 1, 0, 0,
        1, 0, 0, 1, 0, 0,
    ]);
});
