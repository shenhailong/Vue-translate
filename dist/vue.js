/*!
 * Vue.js v2.5.17-beta.0
 * (c) 2014-2018 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Vue = factory());
}(this, (function () { 'use strict';

  /*  */

  /*  */
  function initLifecycle (vm) {
    var options = vm.$options;
    console.log(options);
    var parent = options.parent;
  }

  /*  */
  function initEvents (vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false; // ???
  }

  /*  */
  function initRender(vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
  }

  /*  */

  /*  */

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  // 将两个选项对象合并为一个新的对象。用于实例化和继承的核心实用程序
  function mergeOptions(
    parent,
    child,
    vm  
  ) {
    {
      checkComponents(child); // ??? 待解
    }
  }

  /**
   * Validate component names
   * 验证组件名称
   * ???
   */

  function checkComponents(options) {
    for (var key in options.components) {
      validateComponentName(key);
    }
  }


  function validateComponentName(name) {
    // ???
    // 以字母开头匹配包括下划线的任何单词字符。等价于“[A-Za-z0-9_]”。
    if (!/^[a-zA-Z][\w-]*$/.test(name)) ;
  }

  /*  */
  /**
   * 文件说明：环境检测
   * 
  */
  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';

  // 这个文件是性能判断
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/performance
  // 性能
  // mark 创建标记，没有返回值（自己的理解 ）该方法一般用来多次记录时间，用于求得各记录间的时间差
  {
    var perf = inBrowser && window.performance;
    /* istanbul ignore if */
    if (
      perf &&
      perf.mark &&
      perf.measure &&
      perf.clearMarks &&
      perf.clearMeasures
    ) ;
  }

  /*  */
  var uid = 0; // 为了区分创建不同实例的标志
  function initMixin(Vue ) {
    Vue.prototype._init = function (options  ) {
      var vm = this; // vm 就是实例本身 this
      // a uid
      vm._uid = uid++; // 每次创建新实例 +1
      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      // ???
      if (options && options._isComponent) ; else {
        // 合并option
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        );
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm); // ???
      initEvents(vm); // ???
      initRender(vm); // ???
    };
  }

  function resolveConstructorOptions(Ctor ) {
    // ???
    var options = Ctor.options;
    console.log(Ctor);
    console.log(options);
    return options
  }

  // import { warn } from '../util/index' // 警告
  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  /*  */

  /*  */

  return Vue;

})));
