/* @flow */
/**
 * 文件说明：环境检测
 * 
*/
// Browser environment sniffing
export const inBrowser = typeof window !== 'undefined'

// Firefox has a "watch" function on Object.prototype...
export const nativeWatch = ({}).watch

// this needs to be lazy-evaled because vue may be required before
// 由于需要VUE，所以需要先对此进行评估
// vue-server-renderer can set VUE_ENV
let _isServer
export const isServerRendering = () => {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    // ???
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      // 检测VUE服务器渲染器的存在并避免Webpack shimming进程
      _isServer = global['process'].env.VUE_ENV === 'server'
    } else {
      _isServer = false
    }
  }
  return _isServer
}