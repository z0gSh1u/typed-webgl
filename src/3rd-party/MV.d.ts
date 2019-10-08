//////////////////////////////////////////////////////////////////////////////
//  
//  Type declaration file of MV.js
//  Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
//  for book `Interactive Computer Graphics` (7th Edition).
//  MV2.js is now merged into MV.js.  
//
//////////////////////////////////////////////////////////////////////////////

// ------------
// uncategoried
// ------------
/** 
 * Convert DEG to RAD.
 */
declare function radians(degrees: number): number

// -------------------
// vector constructors
// -------------------
declare type Vec2 = [number, number]
declare type Vec3 = [number, number, number]
declare type Vec4 = [number, number, number, number]
declare type Vec = Vec2 | Vec3 | Vec4
/** Generater 2D vector. If args.length > 2, emit from subscript 2. */
declare function vec2(...arguments: number[]): Vec2
/** Generater 3D vector. If args.length > 3, emit from subscript 3. */
declare function vec3(...arguments: number[]): Vec3
/** Generater 4D vector. If args.length > 4, emit from subscript 4. */
declare function vec4(...arguments: number[]): Vec4

// -------------------
// matrix constructors
// -------------------
// declare type Mat2 = [Vec2, Vec2]
// declare type Mat3 = [Vec3, Vec3, Vec3]
// declare type Mat4 = [Vec4, Vec4, Vec4, Vec4]
declare interface Mat extends Array<number[]> {
  matrix?: boolean
}
/**
 * Generate a 2*2 Mat. 
 * If args.length = 0, generate an I_2.
 * If args.length = 1, generate a diagonal matrix.
 * If args.length = 2, use them as colomns of matrix. 
 */
declare function mat2(...arguments: number[]): Mat
/**
 * Generate a 3*3 Mat. 
 * If args.length = 0, generate an I_3.
 * If args.length = 1, generate a diagonal matrix.
 * If args.length = 3, use them as colomns of matrix. 
 */
declare function mat3(...arguments: number[]): Mat
/**
 * Generate a 4*4 Mat. 
 * If args.length = 0, generate an I_4.
 * If args.length = 1, generate a diagonal matrix.
 * If args.length = 4, use them as colomns of matrix. 
 */
declare function mat4(...arguments: number[]): Mat

// --------------------------------------------------------
// generic mathematical operations for vectors and matrices
// --------------------------------------------------------
/**
 * Judge whether a Vec or Mat equals to the other.
 */
declare function equal(u: Mat | Vec, v: Mat | Vec): boolean
/**
 * Add a Mat or Vec with the other.
 */
declare function add(u: Mat | Vec, v: Mat | Vec): Mat | Vec
/**
 * Subtract a Mat or Vec with the other.
 */
declare function subtract(u: Mat | Vec, v: Mat | number[]): Mat | Vec
/**
 * Multiply a Mat or Vec with the other.
 */
declare function mult(u: Mat | Vec, v: Mat | Vec): Mat | Vec

// --------------------------------------
// basic transformation matrix generators
// --------------------------------------
/**
 * Translate a vector.
 */
declare function translate(x: Vec, y: Vec, z: Vec): Mat
/**
 * Rotate axes by an angle (in DEG).
 */
declare function rotate(angle: number, axis: Vec3): Mat
/**
 * Rotate the X axis by an angle (in DEG).
 */
declare function rotateX(theta: number): Mat
/**
 * Rotate the Y axis by an angle (in DEG).
 */
declare function rotateY(theta: number): Mat
/**
 * Rotate the Z axis by an angle (in DEG).
 */
declare function rotateZ(theta: number): Mat
/**
 * ScaleM method.
 */
declare function scalem(x: Vec, y: Vec, z: Vec): Mat

// ---------------------------
// modelView matrix generators
// ---------------------------
/**
 * Look at somewhere.
 */
declare function lookAt(eye: Vec3, at: Vec3, up: Vec3): Mat
/**
 * Calculate ortho of somewhere.
 */
declare function ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat
/**
 * Calculate perspective of somewhere.
 */
declare function perspective(fovy: number, aspect: number, near: number, far: number): Mat

// ----------------
// matrix functions
// ----------------
/**
 * Transpose a matrix.
 */
declare function transpose(m: Mat): Mat

// ----------------
// vector functions
// ----------------
/**
 * Dot multiply two vectors.
 */
declare function dot(u: Vec, v: Vec): number
/**
 * Get negate of a vector.
 */
declare function negate(u: Vec): Vec
/**
 * Get cross of two vectors. If use Vec4, emit the last dimension.
 */
declare function cross(u: Vec3 | Vec4, v: Vec3 | Vec4): Vec3
/**
 * Get length of a vector.
 */
declare namespace MV {
  function length(u: Vec): number
}
/**
 * Normalize a vector.
 */
declare function normalize(u: Vec, excludeLastComponent: boolean): Vec
/**
 * Mix two vector by a scale.
 */
declare function mix(u: Vec, v: Vec, s: number): Vec

// ---------------------------
// vector and matrix functions
// ---------------------------
/**
 * Scale a vector.
 */
declare function scale(s: number, u: Vec): Vec
/** 
 * Flatten a vector or matrix.
 */
declare function flatten(v: Vec): Vec
/**
 * Constants sizeof. emit.
 */

// ----------------------
// new functions 5/2/2015
// printing
// ----------------------
/**
 * Print a matrix.
 */
declare function printm(m: Mat): void
/**
 * Det of Mat2.
 */
declare function det2(m: Mat): number
/**
 * Det of Mat3.
 */
declare function det3(m: Mat): number
/**
 * Det of Mat4.
 */
declare function det4(m: Mat): number
/**
 * Just Det of any Mat.
 */
declare function det(m: Mat): number
/**
 * Inverse of Mat2.
 */
declare function inverse2(m: Mat): number
/**
 * Inverse of Mat3.
 */
declare function inverse3(m: Mat): number
/**
 * Inverse of Mat4.
 */
declare function inverse4(m: Mat): number
/**
 * Just Inverse of any Mat.
 */
declare function inverse(m: Mat): number
/**
 * Normalize a Mat.
 */
declare function normalMartix(m: Mat, flag: boolean): Mat
