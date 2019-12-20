define(["require", "exports", "../../framework/WebGLUtils", "./roam"], function (require, exports, WebGLUtils_1, roam_1) {
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
    var then = 0;
    var modelXRotationRadians = 0;
    var modelYRotationRadians = 0;
    var ped = false;
    function renderMagicCube(helper, programIndex, time) {
        helper.switchProgram(programIndex);
        var gl = helper.glContext;
        // convert to seconds
        time *= 0.001;
        // Subtract the previous time from the current time
        var deltaTime = time - then;
        // Remember the current time for the next frame.
        then = time;
        // Animate the rotation
        modelYRotationRadians += -0.7 * deltaTime;
        modelXRotationRadians += -0.4 * deltaTime;
        // Compute the camera's matrix using look at.
        //  let cameraMatrix = getLookAt()
        // Make a view matrix from the camera matrix.
        // let viewMatrix = inverse(cameraMatrix)
        var viewMatrix = inverse(roam_1.getLookAt());
        viewMatrix = mult(WebGLUtils_1.scaleMat(0.5, 0.5, 0.5), viewMatrix);
        var worldMatrix = mat4();
        if (!ped)
            printm(worldMatrix);
        ped = true;
        // printm(viewMatrix)
        // printm(cameraMatrix)
        // printm(worldMatrix)
        helper.prepare({
            attributes: [
                { buffer: vBuffer, data: positions, varName: 'a_position', attrPer: 3, type: gl.FLOAT },
                { buffer: nBuffer, data: normals, varName: 'a_normal', attrPer: 3, type: gl.FLOAT },
            ],
            uniforms: [
                { varName: 'u_projection', data: flatten(mat4()), method: 'Matrix4fv' },
                { varName: 'u_view', data: flatten(viewMatrix), method: 'Matrix4fv' },
                { varName: 'u_world', data: flatten(worldMatrix), method: 'Matrix4fv' },
                { varName: 'u_worldCameraPosition', data: roam_1.cameraPos, method: '3fv' },
                { varName: 'u_texture', data: 20, method: '1i' }
            ]
        });
        // Draw the geometry.
        gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
    }
    exports.renderMagicCube = renderMagicCube;
    var positions = new Float32Array([
        -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
        0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
        0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
        0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5, 0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
        0.5, -0.5, -0.5, 0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5, -0.5, -0.5, 0.5,
        -0.5, 0.5, -0.5, -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
        0.5, -0.5, -0.5, 0.5, 0.5, -0.5,
        0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
        0.5, 0.5, -0.5, 0.5, 0.5, 0.5,
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
