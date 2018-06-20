一个重现vue源码项目
## 说明 ？？？ 代表暂时未知

## 执行方法说明
1、npm run build //  打包
2、npm run flow    // flow 检测
2、npm run flow:no // 去掉flow后的文件样式 
## 第一步 先从build入手
npm run  build  --> node scripts/build.js
<p>所以找到scripts下的builds,按照步骤找到对应文件，都有详细说明，就是打包基本配置</p>

打包方式rollup
## 第二步 添加flow
第一次运行npm run flow init
然后运行  npm run flow
https://flow.org/en/docs/install/
<p>按照教程安装</p>

## 第三步 添加eslint
.eslintignore 文件是不需要检验的文件

## 正式开始写Vue了😄

1、先从Vue-translate/src/platforms/web/entry-runtime-with-compiler.js 一直找到 Vue-translate/src/core/instance/index.js Vue
2、先初始化