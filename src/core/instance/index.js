// import { warn } from '../util/index' // 警告
import { initMixin } from './init'
import { stateMixin } from './state'
function Vue(options) {
  if(process.env.NODE_ENV !== 'production' && !(this instanceof Vue)){

  }else{
    // 必须用new 创建
    // warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
export default Vue