/* @flow */
/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
export function noop(a ? : any, b ? : any, c ? : any) {}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 * 快速对象检查-当我们知道值是符合JSON的类型时，它主要用于告诉对象与原始值
 */
export function isObject (obj: mixed): boolean %checks {
  return obj !== null && typeof obj === 'object'
}

/**
 * Mix properties into target object.
 * 将属性混合到目标对象
 */
export function extend(to: Object, _from: ? Object): Object {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

/**
 * Check whether the object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj: Object | Array<*>, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 * 创建纯函数的缓存版本
 * ???
 */
export function cached<F: Function> (fn: F): F {
  const cache = Object.create(null)
  return (function cachedFn (str: string) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }: any)
}

/**
 * Camelize a hyphen-delimited string.
 * 用连字符分隔字符串
 * 就是把-连接的字符串转换成驼峰方式
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})


/**
 * Get the raw type string of a value e.g. [object Object]
 * 获取值的原始类型字符串，例如[对象对象],
 * 就是转换获取原始类型
 * ^_^
 */
const _toString = Object.prototype.toString

export function toRawType (value: any): string {
  return _toString.call(value).slice(8, -1)
}
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 * 严格的对象类型检查。只有返回真对于普通JavaScript对象
 */
export function isPlainObject(obj:any): boolean {
  return _toString.call(obj) === '[object Object]'
}