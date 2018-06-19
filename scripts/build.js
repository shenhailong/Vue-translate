const fs = require('fs') // 文件系统进行交互
const path = require('path')
const zlib = require('zlib')
const rollup = require('rollup') // 打包工具 http://www.rollupjs.com/
const uglify = require('uglify-js') // 压缩js 生产环境用
//（1） 判断根目录下是否有dist文件夹，没有就创建一个
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

// (2) 导入config的配置 去看config.js

let builds = require('./config').getAllBuilds()
// console.log(require('./config').getAllBuilds)
// filter builds via command line arg 通过命令行ARG建立过滤器
// process.argv （一个包含命令行参数的数组。第一个元素是’node’，第二个元素是JavaScript文件的文件名。接下来的元素则是附加的命令行参数。）
// process.argv.forEach(function(val, index, array) {
//   console.log(index + ': ' + val)
// })

if (process.argv[2]) {
  // ??? 待解
  // const filters = process.argv[2].split(',')
  // builds = builds.filter(b => {
  //   return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  // })
} else {
  // ??? 待解
  builds = builds.filter(b => {
    // console.log(b)
    return b.output.file.indexOf('weex') === -1
  })
}

build(builds)

function build(builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }
  next()
}
// console.log(builds)
// Rollup 提供 JavaScript 接口那样可以通过 Node.js 来使用
function buildEntry(config) {
  const output = config.output
  const {
    file,
    banner
  } = output
  const isProd = /min\.js$/.test(file) // 判断是否是生产打包
  // rollup.rollup 函数返回一个 Promise，它解析了一个 bundle 对象，此对象带有不同的属性及方法
  return rollup.rollup(config)
    .then(bundle =>
      // bundle.generate() 函数返回一个 Promise，
      bundle.generate(output)
    ).then(({
      code
    }) => {
      if (isProd) {
        var minified = (banner ? banner + '\n' : '') + uglify.minify(code, {
          output: {
            ascii_only: true // ???
          },
          compress: {
            pure_funcs: ['makeMap'] // ???
          }
        }).code
        // 待解
        return write(file, minified, true)
      } else {
        return write(file, code)
      }
    })
}

function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      // path.relative() 方法返回从 from 到 to 的相对路径（基于当前工作目录）
      // process cwd() 方法返回 Node.js 进程当前工作的目录
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }
    fs.writeFile(dest, code, err => {
      if (err) return reject(err) // 如果有error
      // 如果是压缩
      if (zip) {
        // ???
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

// 文件大小
function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

// node js 控制颜色输出
function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

function logError(e) {
  console.log(e)
}