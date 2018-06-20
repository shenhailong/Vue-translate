/* @flow */
import config from '../config'
let uid = 0 // 为了区分创建不同实例的标志
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function(options?: Object) {
    const vm: Component = this // vm 就是实例本身 this
    // a uid
    vm._uid = uid++ // 每次创建新实例 +1
    let startTag 
    let endTag  // 测试性能时间用 为了performance.measure()使用
    /* istanbul ignore if */ //？？？
    // 开发环境性能测试
    if(process.env.NODE_ENV !== 'production' && config.performance) {}
  }
}