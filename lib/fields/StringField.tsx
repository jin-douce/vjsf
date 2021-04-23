import { defineComponent } from 'vue'
import { FieldPropsDefine, CommonWidgetNames } from '../types'
import { getWidget } from '../theme'

export default defineComponent({
  name: 'StringFeild',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (v: string) => {
      props.onChange(v)
    }
    const TextWidgetRef = getWidget(CommonWidgetNames.TextWidget)
    return () => {
      const { rootSchema, errorSchema, ...rest } = props
      const TextWidget = TextWidgetRef.value
      return <TextWidget {...rest} errors={errorSchema.__errors} onChange={handleChange}/>
      // return (
      //   <input type="text" value={props.value as any} onInput={handleChange} />
      // )
    }
  },
})
