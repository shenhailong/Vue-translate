const fs = require('fs') // 文件系统进行交互

//（1） 判断根目录下是否有dist文件夹，没有就创建一个
if(!fs.existsSync('dist')){
  fs.mkdirSync('dist')
}

// (2) 倒入config的配置 去看config.js

let builds = require('./config').getAllBuilds()
console.log(require('./config').getAllBuilds)
console.log(builds)