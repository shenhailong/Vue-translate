/* @flow */
import Dep from './dep'
import VNode from '../vdom/vnode'
import {
  def,
  isObject,
  hasOwn,
  isServerRendering,
  isPlainObject
} from '../util/index'

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 * 在某些情况下，我们可能希望禁用组件的先验计算中的观察
 */
export let shouldObserve: boolean = true

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 * 附在每个观察对象上的观测器类。一旦被连接，观察者将目标对象的属性键转换为getter/setters。收集依赖和调度更新
 */

export class Observer {
  value: any;
  dep: Dep
  vmCount: number; // number of vms that has this object as root $data  ???
  constructor(value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this) /// ????
    // ???
    if (Array.isArray(value)) {
      const augment = hasProto ?
        protoAugment :
        copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   * 遍历每个属性并将它们转换为getter/setters。只有当值类型为对象时才调用此方法
   */
  walk(obj: Object) {
    const keys = Object.keys(obj)
    console.log(keys)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 * 尝试为值创建观察者实例，如果成功观察则返回新观察者，如果值已经有观察者，则返回现有观察者
 */
export function observe(value: any, asRootData: ? boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
    /// ???
  } else if (shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue) {
    // Object.isExtensible用于判断对象是否可以被拓展
    ob = new Observer(value)
  }
}

/**
 * Define a reactive property on an Object.
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  
}