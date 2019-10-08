//////////////////////////////////////////////////////////////////////////////
//  
//  Type declaration file of initShaders.js.
//  Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
//  for book `Interactive Computer Graphics` (7th Edition).
//  initShaders2.js is now renamed into initShaders.js.
//
//////////////////////////////////////////////////////////////////////////////

/**
 * Get a file as a string using AJAX request.
 */
declare function loadFileAJAX(name: string): string | null

/**
 * Initialize OpenGL (WebGL) shaders.
 */
declare function initShaders(gl: WebGLRenderingContext, vShaderName: string, fShaderName: string): WebGLProgram | null
