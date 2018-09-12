import config from '../config'
import {
  ASSET_TYPES
} from '../../shared/constants'
import {
  extend
} from '../util/index'
import builtInComponents from '../components/index'
export function initGlobalAPI(Vue) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      // warn(
      //   'Do not replace the Vue.config object, set individual fields instead.'
      // )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)
  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  // 注意：这些不被认为是公共API的一部分-避免依赖
  // 除非你意识到风险。
  // 这些应该是Vue构造函数内部用的
  Vue.util = {
    // ??? 先不写
  }
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })
  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  // 这用于标识在WEX的多实例场景中扩展所有纯对象组件的“基”构造函数。
  // ？？？
  Vue.options._base = Vue
  /**
   * Mix properties into target object.
   * 将属性混合到目标对象
   * 初始创建keep-alive
   */
  extend(Vue.options.components, builtInComponents)
}