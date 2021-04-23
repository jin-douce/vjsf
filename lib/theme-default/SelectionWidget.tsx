import { defineComponent, PropType, ref, watch } from '@vue/runtime-core'
import { SelectionWidgetPropsDefine, SelectionWidgetDefine } from '../types'
import { withFormItem } from './FormItem'

const Selection: SelectionWidgetDefine = withFormItem(defineComponent({
  name: 'SelectionWidget',
  props: SelectionWidgetPropsDefine,
  setup(props) {
    const currentValueRef = ref(props.value)
    watch(currentValueRef, (newv, oldv) => {
      if (newv !== props.value) {
        props.onChange(newv)
      }
    })
    watch(
      () => props.value,
      (v) => {
        if (v !== currentValueRef.value) {
          currentValueRef.value = v
        }
      },
    )
    return () => {
      const { options } = props
      return (
        <select multiple={true} v-model={currentValueRef.value}>
          {options.map((op) => (
            <option value={op.value}>{op.key}</option>
          ))}
        </select>
      )
    }
  },
}))
 
export default Selection