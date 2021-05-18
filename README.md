# Typed-WebGL

本项目为《交互式计算机图形学》（第七版，Edward Angel）自带代码库（`MV.js`，`initShaders.js`）撰写了TypeScript类型描述文件（d.ts），并搭建了简单的开发脚手架。

~~本项目正在持续更新的部分是东南大学《计算机图形学》课程的实验作业部分。~~

本项目作为东南大学《计算机图形学》课程的实验作业部分已更新结束。祝贺三名组员最终都以极高的得分通过了该课程。

在这儿可以玩到成品：[zxuuu.tech/seucg](https://zxuuu.tech/seucg/)

组员的GitHub地址：[Twileon](https://github.com/Twileon)  [LongChen2018](https://github.com/LongChen2018)  [z0gSh1u](https://github.com/z0gSh1u)


### 快速入门

- 在`dist/work/<Project Folder>`下进行HTML文件的开发

  ```html
  <body>
    <canvas id="cvs" height="300px" width="600px"></canvas>
  </body>
  ```

- 在`src/work/<Project Folder>`下进行TypeScript脚本的开发

  ```typescript
  import '../../3rd-party/MV'
  let canvasDOM: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
  let gl: WebGLRenderingContext = canvasDOM.getContext('webgl') as WebGLRenderingContext
  /* Continue your code here. */
  ```

- 编译TypeScript脚本到JavaScript脚本

  ```bash
  npm run tsc
  ```

  你也可以使用tsc来自动监视并增量编译

- 脚手架使用AMD模块化标准，所以要借助RequireJS来兼容浏览器

  ```html
  <script src="../../3rd-party/require.js" data-main="./example.js"></script>
  ```

### 第三方版权说明

- RequireJS

  ```
  @license RequireJS 2.3.6 Copyright jQuery Foundation and other contributors.
  Released under MIT license, https://github.com/requirejs/requirejs/blob/master/LICENSE
  ```

- MV.js, initShaders.js

  https://www.cs.unm.edu/~angel/BOOK/INTERACTIVE_COMPUTER_GRAPHICS/SEVENTH_EDITION/

