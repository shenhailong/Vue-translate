const path = require('path') // http://nodejs.cn/api/path.html
// http://npm.taobao.org/package/rollup
const replace = require('rollup-plugin-replace') // http://npm.taobao.org/package/rollup-plugin-replace
const flow = require('rollup-plugin-flow-no-whitespace') // 插件用来去掉flow使用的类型检查代码。有趣的是，插件是还是Vue作者自己写的，只是想去掉打包后遗留的空格
const buble = require('rollup-plugin-buble') // 插件用来替代babel，用来转换es5用的
const alias = require('rollup-plugin-alias') // http://npm.taobao.org/package/rollup-plugin-alias 用来配置打包过程中各个模块的路径映射，具体的配置写在 build/alias.js 中。这样代码中就可以用src作为根目录引用模块了。值得注意的是，src/platforms 目录下的 web 模块和 weex 模块，也都做了映射，所以在看代码时有 import xxx from ‘web/xxx’的引用，就都是从 platforms 下引用的。貌似这是缩短引用路径、区分目录结构和代码逻辑的好方法呢，可以借鉴一下。所以根据 alias 的配置，vue模块对应的就是 src/entries/web-runtime-with-compiler.js 文件
const version = process.env.VERSION || require('../package.json').version // vue文件版本
const weexVersion = process.env.WEEX_VERSION // || require('../packages/weex-vue-framework/package.json').version // ???
// 文件头部介绍
const banner =
  '/*!\n' +
  ' * Vue.js v' + version + '\n' +
  ' * (c) 2014-' + new Date().getFullYear() + ' Evan You\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const aliases = require('./alias') // 倒入别名js,就是文件完整绝对路径

const resolve = p => {
  const base = p.split('/')[0] // 截取‘/’前面的名称，找到文件夹 如 web
  // 如果存在key返回完整的文件路径 ： 就是入口文件的完整绝对路径
  if (aliases[base]) {
    // p.slice(base.length + 1) 就是截取/后面的 如 entry-runtime-with-compiler.js。不理解为什么不直接用 p.split('/')[1],也许别的文件用，这里暂时没用用到
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    // 这个是目标文件路径，直接根目录下的dist 如 /Users/dragon/MyProject/Vue学习/Vue-translate/dist/vue.js
    return path.resolve(__dirname, '../', p)
  }
}

// 每一种vue的基本配置，按照rollup的基本配置
// http://www.rollupjs.com/
const builds = {
  // 没有压缩的基本的Vue。属于开发模式
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'), // 入口文件
    dest: resolve('dist/vue.js'), // 目标文件
    format: 'umd', // 生成包的格式 通用模块定义，以amd，cjs 和 iife 为一体 http://www.rollupjs.com/big-list-of-options/
    env: 'development', // 环境 开发模式
    alias: {
      he: './entity-decoder'
    }, // ???
    banner
  },
  // 压缩的生产版本
  // Runtime+compiler production build  (Browser)
  'web-full-prod': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.min.js'),
    format: 'umd',
    env: 'production',
    alias: { he: './entity-decoder' },
    banner
  },
}
// 更改成 rollup 规定的格式
// http://www.rollupjs.com/big-list-of-options/
function genConfig(name) {
  const opts = builds[name]
  const config = {
    input: opts.entry, // 这个包的入口点
    external: opts.external, // 外链 ??? 暂时没用到
    plugins: [
      // 替换作用
      replace({
        __WEEX__: !!opts.weex,
        __WEEX_VERSION__: weexVersion,
        __VERSION__: version
      }),
      flow(),
      buble(), // babel 作用
      alias(Object.assign({}, aliases, opts.alias))
    ].concat(opts.plugins || []), // 插件
    // 输出
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'Vue'
    }
  }
  if (opts.env) {
    config.plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }
  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })
  // console.log(config)
  return config
}

exports.getAllBuilds = () => Object.keys(builds).map(genConfig)