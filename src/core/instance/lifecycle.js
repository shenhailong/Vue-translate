/* @flow */
export function initLifecycle (vm: Component) {
  const options = vm.$options
  console.log(options)
  let parent = options.parent
}