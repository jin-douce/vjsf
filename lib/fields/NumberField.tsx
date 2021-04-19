import { FieldPropsDefine, CommonWidgetNames } from '../types'
import { defineComponent } from 'vue'
import { getWidget } from '../theme'


export default defineComponent({
  name: 'NumberFeild',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (v: string) => {
      // e.target.value返回字符串，转换为number
      // const value = e.target.value
      const num = Number(v)
      if (Number.isNaN(num)) {
        props.onChange(undefined)
      } else {
        props.onChange(num)
      }
    }
    const NumberWidgetRef = getWidget(CommonWidgetNames.NumberWidget)

    return () => {
      const NumberWidget = NumberWidgetRef.value
      const { schema, rootSchema, ...rest } = props
      return <NumberWidget {...rest} onChange={handleChange}/>
      // return <input value={value as any} type="number" onInput={handleChange} />
    }
  },
})
