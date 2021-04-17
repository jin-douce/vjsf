import { FieldPropsDefine } from '../types'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NumberFeild',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      // e.target.value返回字符串，转换为number
      const value = e.target.value
      const num = Number(value)
      if (Number.isNaN(num)) {
        props.onChange(undefined)
      } else {
        props.onChange(num)
      }
    }
    return () => {
      const { value } = props
      return <input value={value as any} type="number" onInput={handleChange} />
    }
  },
})
