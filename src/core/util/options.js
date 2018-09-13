/* @flow */
/*
 * 文件说明：
 * 
 */
import config from '../config'
import {
  warn
} from './debug'

import {
  ASSET_TYPES
} from 'shared/constants'

import {
  extend,
  hasOwn,
  camelize,
  isPlainObject,
  toRawType
} from 'shared/util'

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 * 选项重写策略是处理的函数。如何合并父选项值和子选项价值转化为最终值
 */
const strats = config.optionMergeStrategies
/**
 * Options with restrictions
 * 限制？？？
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        `option "${key}" can only be used during instance ` +
        'creation with the `new` keyword.'
      )
    }
    return defaultStrat(parent, child)
  }
}


/**
 * Helper that recursively merges two data objects together.
 * ???
 */
function mergeData (to: Object, from: ?Object): Object {
  if (!from) return to
  let key, toVal, fromVal
  const keys = Object.keys(from)
  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    toVal = to[key]
    fromVal = from[key]
    if (!hasOwn(to, key)) {
      set(to, key, fromVal)
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal)
    }
  }
  return to
}

/**
 * Data
 * ???
 */
export function mergeDataOrFn (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
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
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal: any,
  childVal: any,
  vm ? : Component
): ? Function {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
}

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 * 当VM存在（实例创建）时，我们需要做构造函数选项之间的三路合并实例选项和父选项
 */
function mergeAssets(
  parentVal: ? Object,
  childVal : ? Object,
  vm ? : Component,
  key : string
): Object {
  const res = Object.create(parentVal || null)
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 * @param child 
 * 将两个选项对象合并为一个新的对象。用于实例化和继承的核心实用程序
 */
export function mergeOptions(
  parent: Object,
  child: Object,
  vm ? : Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child) // ??? 待解
  }

  // ？？？ 传的是function？？？
  if (typeof child === 'function') {
    child = child.options
  }

  normalizeProps(child, vm)
  // normalizeInject(child, vm) ???
  // normalizeDirectives(child) ???
  // ??? extends 还没写
  const extendsFrom = child.extends
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm)
  }
  // ？？？mixins 没有写
  if (child.mixins) {
    for (let i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm)
    }
  }
  const options = {}
  let key
  // 元素参数合并
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  // 合并？？？
  function mergeField(key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}

/**
 * Default strategy.
 * 默认策略
 */
const defaultStrat = function (parentVal: any, childVal: any): any {
  return childVal === undefined ?
    parentVal :
    childVal
}

/**
 * Validate component names
 * 验证组件名称
 */
function checkComponents(options: Object) {
  for (const key in options.components) {
    validateComponentName(key)
  }
}


export function validateComponentName(name: string) {
  // 校验组件名称
  // 以字母开头匹配包括下划线的任何单词字符。等价于“[A-Za-z0-9_]”。
  // 组件名称只能包含字母数字字符和连字符，必须从一个字母开始
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    )
    console.log('Invalid component')
  }
}
/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 * 确保所有props选项语法都规范化为基于对象的格式
 */
function normalizeProps(options: Object, vm: ? Component) {
  const props = options.props
  if (!props) return
  const res = {}
  let i, val, name
  // 如果是数组自动转换成对象格式，并且type = null
  if (Array.isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = {
          type: null
        }
      } else if (process.env.NODE_ENV !== 'production') {
        // warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val) ? val : {
        type: val
      }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    // warn(
    //   `Invalid value for option "props": expected an Array or an Object, ` +
    //   `but got ${toRawType(props)}.`,
    //   vm
    // )
  }
  options.props = res
}


// 判断是不是对象
function assertObjectType(name: string, value: any, vm: ? Component) {
  if (!isPlainObject(value)) {
    warn(
      `Invalid value for option "${name}": expected an Object, ` +
      `but got ${toRawType(value)}.`,
      vm
    )
  }
}