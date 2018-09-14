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
  /*
   * 文件说明：相关基本配置
   * 
   */
  // flow语法相关--> https://flow.org/en/docs/types/modules/

  // https://developer.mozilla.org/zh-CN/docs/Web/API/Performance
  var config = ({
    /**
     * Option merge strategies (used in core/util/options)
     * option 合并策略
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),
    /**
     * Whether to record perf // 是否记录性能
     */
    performance: false,
  });

  /*  */
  var uid = 0;
  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   * DEP是可观察的，可以具有订阅它的多个指令 ???
   */

  var Dep$1 = function Dep () {
    this.id = uid++;
    this.subs = [];
  };
  Dep$1.prototype.notify = function notify () {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    // console.log(subs)
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // the current target watcher being evaluated.
  // this is globally unique because there could be only one
  // watcher being evaluated at any time.
  // 正在评估的当前目标观察员。这是全球唯一的，因为在任何时候只有一个观察者被评估
  Dep$1.target = null;
  var targetStack = [];

  function pushTarget (_target) {
    if (Dep$1.target) { targetStack.push(Dep$1.target); }
    Dep$1.target = _target;
  }

  function popTarget () {
    Dep$1.target = targetStack.pop();
  }

  /*  */

  var VNode = function VNode () {};


  var createEmptyVNode = function (text) {
    if ( text === void 0 ) text = '';

    var node = new VNode();
    node.text = text;
    node.isComment = true;
    return node
  };

  /*  */
  /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
   */
  function noop(a  , b  , c  ) {}

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   * 快速对象检查-当我们知道值是符合JSON的类型时，它主要用于告诉对象与原始值
   */
  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }

  /**
   * Mix properties into target object.
   * 将属性混合到目标对象
   */
  function extend(to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to
  }

  /**
   * Check whether the object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  /**
   * Create a cached version of a pure function.
   * 创建纯函数的缓存版本
   * ???
   */
  function cached (fn) {
    var cache = Object.create(null);
    return (function cachedFn (str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str))
    })
  }

  /**
   * Camelize a hyphen-delimited string.
   * 用连字符分隔字符串
   * 就是把-连接的字符串转换成驼峰方式
   */
  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
  });


  /**
   * Get the raw type string of a value e.g. [object Object]
   * 获取值的原始类型字符串，例如[对象对象],
   * 就是转换获取原始类型
   * ^_^
   */
  var _toString = Object.prototype.toString;

  function toRawType (value) {
    return _toString.call(value).slice(8, -1)
  }
  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   * 严格的对象类型检查。只有返回真对于普通JavaScript对象
   */
  function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]'
  }

  /**
   * Simple bind polyfill for environments that do not support it... e.g.
   * PhantomJS 1.x. Technically we don't need this anymore since native bind is
   * now more performant in most browsers, but removing it would be breaking for
   * code that was able to run in PhantomJS 1.x, so this must be kept for
   * backwards compatibility.
   * @param nativeBind 原生bind
   * 简单绑定聚合体的环境不支持它…例如从本质上说，我们不再需要这个了。现在大多数浏览器的性能更高，但是删除它将是一种破坏。能够在幻像1 .x中运行的代码，因此必须保存向后兼容
   * 就是做bind兼容的
   */

  /* istanbul ignore next */
  function polyfillBind (fn, ctx) {
    function boundFn (a) {
      var l = arguments.length;
      return l
        ? l > 1
          ? fn.apply(ctx, arguments)
          : fn.call(ctx, a)
        : fn.call(ctx)
    }

    boundFn._length = fn.length;
    return boundFn
  }

  function nativeBind (fn, ctx) {
    return fn.bind(ctx)
  }
  var bind = Function.prototype.bind
    ? nativeBind
    : polyfillBind;

  var warn$1 = noop;

  var ASSET_TYPES = [
    'component',
    'directive',
    'filter'
  ];


  var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured'
  ];

  /*  */

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   * 选项重写策略是处理的函数。如何合并父选项值和子选项价值转化为最终值
   */
  var strats = config.optionMergeStrategies;
  /**
   * Options with restrictions
   * 限制？？？
   */
  {
    strats.el = strats.propsData = function (parent, child, vm, key) {
      return defaultStrat(parent, child)
    };
  }


  /**
   * Helper that recursively merges two data objects together.
   * ???
   */
  function mergeData (to, from) {
    if (!from) { return to }
    var key, toVal, fromVal;
    var keys = Object.keys(from);
    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
        mergeData(toVal, fromVal);
      }
    }
    return to
  }

  /**
   * Data
   * ???
   */
  function mergeDataOrFn (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal
      }
      if (!parentVal) {
        return childVal
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn () {
        return mergeData(
          typeof childVal === 'function' ? childVal.call(this, this) : childVal,
          typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
        )
      }
    } else {
      return function mergedInstanceDataFn () {
        // instance merge
        var instanceData = typeof childVal === 'function'
          ? childVal.call(vm, vm)
          : childVal;
        var defaultData = typeof parentVal === 'function'
          ? parentVal.call(vm, vm)
          : parentVal;
        if (instanceData) {
          return mergeData(instanceData, defaultData)
        } else {
          return defaultData
        }
      }
    }
  }

  strats.data = function (
    parentVal,
    childVal,
    vm  
  ) {
    if (!vm) {
      if (childVal && typeof childVal !== 'function') {

        return parentVal
      }
      return mergeDataOrFn(parentVal, childVal)
    }

    return mergeDataOrFn(parentVal, childVal, vm)
  };

  /**
   * Hooks and props are merged as arrays.
   * 生命周期钩子
   */
  function mergeHook (
    parentVal,
    childVal
  ) {
    return childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : Array.isArray(childVal)
          ? childVal
          : [childVal]
      : parentVal
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   * 当VM存在（实例创建）时，我们需要做构造函数选项之间的三路合并实例选项和父选项
   */
  function mergeAssets(
    parentVal,
    childVal ,
    vm  ,
    key 
  ) {
    var res = Object.create(parentVal || null);
    if (childVal) {
      assertObjectType(key, childVal, vm);
      return extend(res, childVal)
    } else {
      return res
    }
  }

  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   * @param child 
   * 将两个选项对象合并为一个新的对象。用于实例化和继承的核心实用程序
   */
  function mergeOptions(
    parent,
    child,
    vm  
  ) {
    {
      checkComponents(child); // ??? 待解
    }

    // ？？？ 传的是function？？？
    if (typeof child === 'function') {
      child = child.options;
    }

    normalizeProps(child, vm);
    // normalizeInject(child, vm) ???
    // normalizeDirectives(child) ???
    // ??? extends 还没写
    var extendsFrom = child.extends;
    if (extendsFrom) {
      parent = mergeOptions(parent, extendsFrom, vm);
    }
    // ？？？mixins 没有写
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
    var options = {};
    var key;
    // 元素参数合并
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    // 合并？？？
    function mergeField(key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options
  }

  /**
   * Default strategy.
   * 默认策略
   */
  var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ?
      parentVal :
      childVal
  };

  /**
   * Validate component names
   * 验证组件名称
   */
  function checkComponents(options) {
    for (var key in options.components) {
      validateComponentName(key);
    }
  }


  function validateComponentName(name) {
    // 校验组件名称
    // 以字母开头匹配包括下划线的任何单词字符。等价于“[A-Za-z0-9_]”。
    // 组件名称只能包含字母数字字符和连字符，必须从一个字母开始
    if (!/^[a-zA-Z][\w-]*$/.test(name)) {
      console.log('Invalid component');
    }
  }
  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   * 确保所有props选项语法都规范化为基于对象的格式
   */
  function normalizeProps(options, vm) {
    var props = options.props;
    if (!props) { return }
    var res = {};
    var i, val, name;
    // 如果是数组自动转换成对象格式，并且type = null
    if (Array.isArray(props)) {
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = {
            type: null
          };
        }
      }
    } else if (isPlainObject(props)) {
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val) ? val : {
          type: val
        };
      }
    }
    options.props = res;
  }


  // 判断是不是对象
  function assertObjectType(name, value, vm) {
    if (!isPlainObject(value)) {
      warn$1(
        "Invalid value for option \"" + name + "\": expected an Object, " +
        "but got " + (toRawType(value)) + ".",
        vm
      );
    }
  }

  /*  */

  /**
   * Check if a string starts with $ or _
   * 检查一个字符串是否以$/_开头
   * 检查保留
   */
  function isReserved (str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F
  }



  /**
   * Define a property.
   */
  function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }


  /**
   * Parse simple path.
   */
  var bailRE = /[^\w.$]/;
  function parsePath (path) {
    if (bailRE.test(path)) {
      return
    }
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }

  /*  */
  /**
   * 文件说明：环境检测
   * 
  */
  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';

  // Firefox has a "watch" function on Object.prototype...
  var nativeWatch = ({}).watch;

  // this needs to be lazy-evaled because vue may be required before
  // 由于需要VUE，所以需要先对此进行评估
  // vue-server-renderer can set VUE_ENV
  var _isServer;
  var isServerRendering = function () {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      // ???
      if (!inBrowser && !inWeex && typeof global !== 'undefined') {
        // detect presence of vue-server-renderer and avoid
        // Webpack shimming the process
        // 检测VUE服务器渲染器的存在并避免Webpack shimming进程
        _isServer = global['process'].env.VUE_ENV === 'server';
      } else {
        _isServer = false;
      }
    }
    return _isServer
  };

  /*  */
  // ???
  function initLifecycle(vm) {
    var options = vm.$options;
    var parent = options.parent;
    // ???
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }
    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function callHook (vm, hook) {
    // #7573 disable dep collection when invoking lifecycle hooks
    // 当调用生命周期挂钩时，第7573步禁用DEP集合
    // ???
    pushTarget();
    var handlers = vm.$options[hook];
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        try {
          handlers[i].call(vm);
        } catch (e) {
          handleError(e, vm, (hook + " hook"));
        }
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
  }


  function mountComponent (
    vm,
    el,
    hydrating
  ) {
    vm.$el = el;
    if (!vm.$options.render) {
      // 先创建一个空虚拟节点
      vm.$options.render = createEmptyVNode;
      {
        /* istanbul ignore if */
        if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
          vm.$options.el || el) ;
      }
    }
  }

  // ???
  var initProxy;
  {
    initProxy = function initProxy (vm) {
      vm._renderProxy = vm;
    };
  }

  /*  */
  var uid$1 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   * 观察者解析表达式，收集依赖关系，当表达式值改变时触发回调。这用于$watch()API和指令。
   * Vue 核心 !!!
   */
  var Watcher = function Watcher(
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher  
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // options ???
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.computed = !!options.computed;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.computed = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$1; // uid for batching
    this.active = true;
    this.dirty = this.computed; // for computed watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new Set();
    this.newDepIds = new Set();
    this.expression = expOrFn.toString();
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = function () {};
        warn(
          "Failed watching path: \"" + expOrFn + "\" " +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        );
      }
    }
    if (this.computed) {
      this.value = undefined;
      this.dep = new Dep();
    } else {
      this.value = this.get();
    }
  };
  /**
   * Evaluate the getter, and re-collect dependencies.
   * 评估getter并重新收集依赖关系
   */
  Watcher.prototype.get = function get () {
      
  };

  /*  */

  /**
   * Observer class that is attached to each observed
   * object. Once attached, the observer converts the target
   * object's property keys into getter/setters that
   * collect dependencies and dispatch updates.
   * 附在每个观察对象上的观测器类。一旦被连接，观察者将目标对象的属性键转换为getter/setters。收集依赖和调度更新
   */

  var Observer = function Observer(value) {
    this.value = value;
    this.dep = new Dep$1();
    this.vmCount = 0;
    def(value, '__ob__', this); /// ????
    // ???
    if (Array.isArray(value)) {
      var augment = hasProto ?
        protoAugment :
        copyAugment;
      augment(value, arrayMethods, arrayKeys);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };
  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   * 遍历每个属性并将它们转换为getter/setters。只有当值类型为对象时才调用此方法
   */
  Observer.prototype.walk = function walk (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  };

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   * 尝试为值创建观察者实例，如果成功观察则返回新观察者，如果值已经有观察者，则返回现有观察者
   */
  function observe(value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
      return
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
      /// ???
    } else if (!isServerRendering() &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue) {
      // Object.isExtensible用于判断对象是否可以被拓展
      ob = new Observer(value);
    }
    if (asRootData && ob) {
      ob.vmCount++;
    }
    return ob
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive(
    obj,
    key,
    val,
    customSetter  ,
    shallow  
  ) {
    // shallow ???
    var dep = new Dep$1();
    // Object.getOwnPropertyDescriptor
    // 该方法允许对一个属性的描述进行检索
    // 就是获取属性，举例
    // o = { bar: 42 };
    // d = Object.getOwnPropertyDescriptor(o, "bar");
    // d {
    //   configurable: true,
    //   enumerable: true,
    //   value: 42,
    //   writable: true
    // }

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }
    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }
    // 如果是对象就一直遍历
    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        var value = getter ? getter.call(obj) : val;
        return value
      },
      set: function reactiveSetter(newVal) {
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        /* eslint-enable no-self-compare */
        if (customSetter) {
          customSetter();
        }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

  /*  */

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };
  /**
   * 这里开始用到Vue的核心 Object.defineProperty
   */
  function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter(val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function initState(vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) ;
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */ );
      // ???
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }

  function initMethods(vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
      {
        if (methods[key] == null) ;
        if (props && hasOwn(props, key)) ;
        if ((key in vm) && isReserved(key)) ;
      }
      vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    }
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};
    if (!isPlainObject(data)) {
      data = {};
    }
    // proxy data on instance
    // 代理data
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      {
        if (methods && hasOwn(methods, key)) ;
      }
      if (props && hasOwn(props, key)) ; else if (!isReserved(key)) {
        /**
         * data的数据放在了_data下面
         */
        proxy(vm, "_data", key);
      }
    }
    // observe data
    // 观察data
    observe(data, true /* asRootData */ );
  }

  function getData(data, vm) {
    // #7573 disable dep collection when invoking data getters
    // 在调用数据吸收器时禁用DEP集合
    // ???
    pushTarget();
    try {
      return data.call(vm, vm)
    } catch (e) {
      // handleError(e, vm, `data()`) /// ???
    } finally {
      popTarget();
    }
  }

  function initComputed(vm, computed) {}

  function initWatch(vm, watch) {
    for (var key in watch) {
      var handler = watch[key];
      // ？？？ Array
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }


  function createWatcher(
    vm,
    expOrFn,
    handler,
    options  
  ) {
    if (isPlainObject(handler)) {
      /// ???
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options)
  }


  function stateMixin(Vue ) {
    Vue.prototype.$watch = function (
      expOrFn,
      cb,
      options  
    ) {
      var vm = this;
      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
      }
      options = options || {};
      options.user = true;
      // console.log(cb)
      var watcher = new Watcher(vm, expOrFn, cb, options);
    };
  }

  /*  */
  function initEvents(vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false; // ???
    // init parent attached events
    var listeners = vm.$options._parentListeners;
  }

  /*  */

  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots (
    children,
    context
  ) {
    var slots = {};
    if (!children) {
      return slots
    }
  }

  /*  */
  function initRender(vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    var options = vm.$options;
    var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
  }

  /*  */

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
  var uid$2 = 0; // 为了区分创建不同实例的标志
  function initMixin(Vue ) {
    Vue.prototype._init = function (options  ) {
      var vm = this; // vm 就是实例本身 this
      // a uid
      vm._uid = uid$2++; // 每次创建新实例 +1
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

      /* istanbul ignore else */
      {
        initProxy(vm); // ???
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm); // ???
      initEvents(vm); // ???
      initRender(vm); // ???
      callHook(vm, 'beforeCreate'); // ???
      initState(vm);
      // initProvide(vm) // resolve provide after data/props
      callHook(vm, 'created');
      if(vm.$options.el){
        vm.$mount(vm.$options.el);
      }
    };
  }

  function resolveConstructorOptions(Ctor ) {
    // ???
    var options = Ctor.options;
    // console.log(Ctor)
    // console.log(options)
    return options
  }

  // import { warn } from '../util/index' // 警告
  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  stateMixin(Vue);

  // 先写一点 ？？？
  var KeepAlive = {
    name: 'keep-alive'
  };

  var builtInComponents = {
    KeepAlive: KeepAlive
  };

  function initGlobalAPI(Vue) {
    // config
    var configDef = {};
    configDef.get = function () { return config; };
    {
      configDef.set = function () {
        // warn(
        //   'Do not replace the Vue.config object, set individual fields instead.'
        // )
      };
    }
    Object.defineProperty(Vue, 'config', configDef);
    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    // 注意：这些不被认为是公共API的一部分-避免依赖
    // 除非你意识到风险。
    // 这些应该是Vue构造函数内部用的
    Vue.util = {
      // ??? 先不写
    };
    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = Object.create(null);
    });
    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    // 这用于标识在WEX的多实例场景中扩展所有纯对象组件的“基”构造函数。
    // ？？？
    Vue.options._base = Vue;
    /**
     * Mix properties into target object.
     * 将属性混合到目标对象
     * 初始创建keep-alive
     */
    extend(Vue.options.components, builtInComponents);
  }

  initGlobalAPI(Vue);

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query (el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);
      if (!selected) {
        warn(
          'Cannot find element: ' + el
        );
        return document.createElement('div')
      }
      return selected
    } else {
      return el
    }
  }

  /*  */ 


  // public mount method
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating)
  };

  /*  */

  return Vue;

})));
