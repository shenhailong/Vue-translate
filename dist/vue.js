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
  var uid = 0; // 为了区分创建不同实例的标志
  function initMixin (Vue) {
    Vue.prototype._init = function(options) {
      var vm = this; // vm 就是实例本身 this
      // a uid
      vm._uid = uid++; // 每次创建新实例 +1
    };
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
