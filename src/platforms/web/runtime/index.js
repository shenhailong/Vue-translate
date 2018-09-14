/* @flow */ 
import Vue from 'core/index'
import { inBrowser } from 'core/util/index'
import { mountComponent } from 'core/instance/lifecycle'
import {
  query
} from 'web/util/index'


// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
export default Vue