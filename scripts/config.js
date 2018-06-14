const path = require('path')  // http://nodejs.cn/api/path.html
const aliases = require('./alias') // 倒入别名js,就是文件完整绝对路径

const resolve = p => {
  const base = p.split('/')[0] // 截取‘/’前面的名称，找到文件夹 如 web
  // 如果存在key返回完整的文件路径 ： 就是入口文件的完整绝对路径
  if(aliases[base]){
    // p.slice(base.length + 1) 就是截取/后面的 如 entry-runtime-with-compiler.js。不理解为什么不直接用 p.split('/')[1],也许别的文件用，这里暂时没用用到
    return path.resolve(aliases[base], p.slice(base.length + 1))
  }else {
    // 这个是目标文件路径，直接根目录下的dist 如 /Users/dragon/MyProject/Vue学习/Vue-translate/dist/vue.js
    return path.resolve(__dirname, '../', p)
  }
}

// 每一种vue的基本配置，按照rollup的基本配置
// http://www.rollupjs.com/
const builds = {
  // 没有压缩的基本的Vue。属于开发模式
  'web-full-dev': {
    entry : resolve('web/entry-runtime-with-compiler.js'), // 入口文件
    dest : resolve('dist/vue.js'), // 目标文件
    format : 'umd', // 生成包的格式 通用模块定义，以amd，cjs 和 iife 为一体 http://www.rollupjs.com/big-list-of-options/
    env: 'development', // 环境 开发模式
    alias: { he: './entity-decoder' }, // ？？？
  }
}

console.log(builds)
exports.getAllBuilds = () => {}