/* @flow */

import Vue from './runtime/index' // 导入
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'
// 这个是有编译器的
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)
  // 禁止挂载在 body 和 html
  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }
  const options = this.$options
  // resolve template/el and convert to render function
  // 解析模板/EL并转换为渲染函数
  if (!options.render) {
    let template = options.template
    if (template) {
      if(typeof template === 'string'){
        // 这里是#选择器的
        if (template.charAt(0) === '#') {

        }
      }
    } else if(el){}

    if (template) {
      /* istanbul ignore if */
      // if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      //   mark('compile')
      // }
      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      // delimiters comments ???
      console.log(render)
      console.log(staticRenderFns)
    }
  }
}

export default Vue