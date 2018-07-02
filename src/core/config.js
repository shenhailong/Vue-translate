/* @flow */
/*
 * 文件说明：相关基本配置
 * 
 */
// flow语法相关--> https://flow.org/en/docs/types/modules/
export type Config = {
  performance: boolean;
}
// https://developer.mozilla.org/zh-CN/docs/Web/API/Performance
export default ({
  /**
   * Whether to record perf // 是否记录性能
   */
  performance: false,
}: Config)