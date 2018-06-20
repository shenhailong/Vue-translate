/* @flow */


export type Config = {
  performance: boolean;
}
// https://developer.mozilla.org/zh-CN/docs/Web/API/Performance
export default ({
  /**
   * Whether to record perf // 是否记录性能
   */
  performance: 2,
}: Config)