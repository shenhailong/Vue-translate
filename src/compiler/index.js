/* @flow */
import { parse } from './parser/index'
import { createCompilerCreator } from './create-compiler'
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  console.log(parse)
  return {
    
  }
})
