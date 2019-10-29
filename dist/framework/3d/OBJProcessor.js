// Object file processor.
// Written by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
// for book `Interactive Computer Graphics` (7th Edition).
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 将OBJ模型文件中的顶点坐标信息和面信息提取到JavaScript
     * 【注意】
     * 1. 面必须是三角形，即f后带三个参数
     * 2. f后每个参数允许形式为 xxx 或 xxx/xxx 或 xxx/xxx/xxx 或 xxx//xxx
     * 3. 关于OBJ模型文件格式，请参考https://en.wikipedia.org/wiki/Wavefront_.obj_file#File_format
     * 4. 这里面不会对OBJ的顶点坐标归一化，请自行归一化OBJ
     * 5. 不支持OBJ模型中有多个o的情形，请合并模型到只有一个o
     */
    var OBJProcessor = /** @class */ (function () {
        function OBJProcessor(_objFileContent) {
            this.objFileContent = _objFileContent;
            this.splitedFileContent = [];
            this._vs = [];
            this._fs = [];
            this._vts = [];
            this._fts = [];
            this._vns = [];
            this._fns = [];
            this._fillInfoArray();
        }
        Object.defineProperty(OBJProcessor.prototype, "vs", {
            /**
             * 模型顶点（返回Array<Vec3>代表xyz坐标）
             */
            get: function () {
                return this._vs;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OBJProcessor.prototype, "fs", {
            /**
             * 模型面（返回Array<Vec3>代表三角形三个顶点索引，注意索引下标从1开始）
             */
            get: function () {
                return this._fs;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OBJProcessor.prototype, "vts", {
            /**
             * 材质顶点（返回Array<Vec2>代表xy坐标）
             */
            get: function () {
                return this._vts;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OBJProcessor.prototype, "fts", {
            /**
             * 材质面（返回Array<Vec3>代表三角形三个顶点索引，注意索引下标从1开始）
             */
            get: function () {
                return this._fts;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OBJProcessor.prototype, "vns", {
            /**
             * 法线顶点（返回Array<Vec3>代表xyz坐标）
             */
            get: function () {
                return this._vns;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OBJProcessor.prototype, "fns", {
            /**
             * 法线面（返回Array<Vec3>代表三角形三个顶点索引，注意索引下标从1开始）
             */
            get: function () {
                return this._fns;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取总共有效的顶点数量。即考虑了顶点的被重用，而不是仅计数v xxx yyy zzz行的数量。
         */
        OBJProcessor.prototype.getEffectiveVertexCount = function () {
            return this._fs.length * 3; // triangle
        };
        OBJProcessor.prototype._fillInfoArray = function () {
            var _this = this;
            this.splitedFileContent = this.objFileContent.split('\n');
            this.splitedFileContent.forEach(function (ele) {
                if (ele.match(/v .*/)) {
                    // 模型顶点
                    var xyz = (ele.split(' ').slice(1)).map(function (str) { return parseFloat(str); });
                    _this._vs.push(xyz);
                }
                else if (ele.match(/vt.*/)) {
                    // 材质顶点
                    var xy = (ele.split(' ').slice(1)).map(function (str) { return parseFloat(str); });
                    _this._vts.push(xy);
                }
                else if (ele.match(/vn.*/)) {
                    // 法线顶点
                    var xyz = (ele.split(' ').slice(1)).map(function (str) { return parseFloat(str); });
                    _this._vns.push(xyz);
                }
                else if (ele[0] === 'f') {
                    // 面处理
                    if (ele.indexOf('/') == -1) {
                        // f 1 1 1
                        var abc = (ele.split(' ').slice(1)).map(function (str) {
                            return parseInt(str);
                        });
                        _this._fs.push(abc);
                    }
                    else {
                        if (ele.match(/f [0-9]+\/[0-9]+\/[0-9]+ [0-9]+\/[0-9]+\/[0-9]+ [0-9]+\/[0-9]+\/[0-9]+/)) {
                            // f 3/3/3 3/3/3 3/3/3
                            var newEle = ele.substring(2);
                            newEle = newEle.replace(/\//g, ' ');
                            var intCvted = (newEle.split(' ')).map(function (str) { return parseInt(str); });
                            _this._fs.push([intCvted[0], intCvted[3], intCvted[6]]);
                            _this._fts.push([intCvted[1], intCvted[4], intCvted[7]]);
                            _this._fns.push([intCvted[2], intCvted[5], intCvted[8]]);
                        }
                        else if (ele.match(/f [0-9]+\/[0-9]+ [0-9]+\/[0-9]+ [0-9]+\/[0-9]+/)) {
                            // f 2/2 2/2 2/2
                            var newEle = ele.substring(2);
                            newEle = newEle.replace(/\//g, ' ');
                            var intCvted = (newEle.split(' ')).map(function (str) { return parseInt(str); });
                            _this._fs.push([intCvted[0], intCvted[2], intCvted[4]]);
                            _this._fts.push([intCvted[1], intCvted[3], intCvted[5]]);
                        }
                        else if (ele.match(/f [0-9]+\/\/[0-9]+ [0-9]+\/\/[0-9]+ [0-9]+\/\/[0-9]+/)) {
                            // f x//x x//x x//x
                            var newEle = ele.substring(2);
                            newEle = newEle.replace(/\/\//g, ' ');
                            var intCvted = (newEle.split(' ')).map(function (str) { return parseInt(str); });
                            _this._fs.push([intCvted[0], intCvted[2], intCvted[4]]);
                            _this._fns.push([intCvted[1], intCvted[3], intCvted[5]]);
                        }
                    }
                }
                else {
                    // do nothing
                }
            });
        };
        return OBJProcessor;
    }());
    exports.OBJProcessor = OBJProcessor;
});
