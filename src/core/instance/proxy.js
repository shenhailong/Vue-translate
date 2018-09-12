// ???
let initProxy
if (process.env.NODE_ENV !== 'production') {
  initProxy = function initProxy (vm) {
    vm._renderProxy = vm
  }
}
// 初始化Proxy。代理拦截
export { initProxy }