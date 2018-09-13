
/* @flow */
let uid = 0
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * DEP是可观察的，可以具有订阅它的多个指令 ???
 */

export default class Dep{
  static target: ?Watcher;
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
// 正在评估的当前目标观察员。这是全球唯一的，因为在任何时候只有一个观察者被评估
Dep.target = null
const targetStack = []

export function pushTarget (_target: ?Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}