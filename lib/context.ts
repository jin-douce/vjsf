import { inject, reactive } from 'vue'
import { CommonFieldType, Theme } from './types'

// 维护inject用到的所有的key
// 用Symbol保证唯一性，如果不同父组件提供了相同key，后者会覆盖前者
export const SchemaFormContextKey = Symbol()

// 子节点中调用，在祖先节点中用provide提供内容，子孙节点中用inject获取内容
export function useVJSFContext() {
  const context: { SchemaItem: CommonFieldType } | undefined = inject(
    SchemaFormContextKey,
  )

  if (!context) {
    throw Error('SchemaForm needed')
  }

  return context
}
