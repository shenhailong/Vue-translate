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
  /*
   * 文件说明：
   * 
   */


   /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  // 将两个选项对象合并为一个新的对象。用于实例化和继承的核心实用程序
  function mergeOptions (){}

  /*  */
  /**
   * 文件说明：环境检测
   * 
  */
  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';

  // 这个文件是性能判断
  var mark;
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
    ) {
      mark = function (tag) { return perf.mark(tag); };
    }
  }

  /*  */
  var uid = 0; // 为了区分创建不同实例的标志
  function initMixin(Vue ) {
    Vue.prototype._init = function (options  ) {
      var vm = this; // vm 就是实例本身 this
      // a uid
      vm._uid = uid++; // 每次创建新实例 +1
        var startTag;
      var endTag; // 测试性能时间用 为了performance.measure()使用
      /* istanbul ignore if */ //？？？
      // 开发环境性能测试
      // ??? 
      if (mark) {
        startTag = "vue-perf-start:" + (vm._uid);
        endTag = "vue-perf-end:" + (vm._uid);
        console.log(0);
        mark(startTag);
      }
      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      // ???
      if (options && options._isComponent) ; else {
        // 合并option
        vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor));
      }
    };
  }

  function resolveConstructorOptions (){}

  // import { warn } from '../util/index' // 警告
  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  /*  */

  /*  */

  return Vue;

})));
