/* @flow */
/*
 * 文件说明：
 * 
 */
import { warn } from './debug'

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
// 将两个选项对象合并为一个新的对象。用于实例化和继承的核心实用程序
export function mergeOptions(
  parent: Object,
  child: Object,
  vm ? : Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child) // ??? 待解
  }
}

/**
 * Validate component names
 * 验证组件名称
 * ???
 */

function checkComponents(options: Object) {
  for (const key in options.components) {
    validateComponentName(key)
  }
}


export function validateComponentName(name: string) {
  // ???
  // 以字母开头匹配包括下划线的任何单词字符。等价于“[A-Za-z0-9_]”。
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    )
  }
}