import { PropType, defineComponent, provide, computed, inject, ComputedRef } from "vue";
import { Theme, SelectionWidgetNames, CommonWidgetNames } from './types'

const THEME_PROVIDER_KEY = Symbol()
const ThemeProvider = defineComponent({
  name: 'VJSFThemeProvider',
  props:{
    theme:{
      type: Object as PropType<Theme>,
      required: true 
    }
  },
  setup(props, {slots}){
    // ref??
    const context = computed(() => props.theme)
    // 提供context而不是context.value  形成依赖关系的更新逻辑
    provide(THEME_PROVIDER_KEY, context)
    // slots是函数
    return () => slots.default && slots.default()
  }
})

export function getWidget<T extends SelectionWidgetNames | CommonWidgetNames>(name: T){
  // 获取theme提供的所有的widget
  const context: ComputedRef<Theme> | undefined = inject<ComputedRef<Theme>>(THEME_PROVIDER_KEY)
  if(!context){
    throw new Error('vjsv theme required')
  }
  // 也是ref
  const widgetRef = computed(() => {
    return context.value.widgets[name]
  })
  return widgetRef
}

export default ThemeProvider