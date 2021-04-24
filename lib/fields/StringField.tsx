import { computed, defineComponent } from 'vue'
import { FieldPropsDefine, CommonWidgetNames } from '../types'
import { getWidget } from '../theme'

export default defineComponent({
  name: 'StringFeild',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (v: string) => {
      props.onChange(v)
    }
    const TextWidgetRef = computed(() => {
      const widgetRef = getWidget(CommonWidgetNames.TextWidget, props.uiSchema)
      // getWidget返回的是ref，computed返回的也是ref，所以应该返回value
      return widgetRef.value
    })
    const widgetOptionsRef = computed(() => {
      const {widget, properties, items, ...rest} = props.uiSchema
      return rest
    })
    return () => {
      const { rootSchema, errorSchema, ...rest } = props
      const TextWidget = TextWidgetRef.value
      return <TextWidget 
                {...rest} 
                errors={errorSchema.__errors} 
                onChange={handleChange}
                options={widgetOptionsRef.value}/>
      // return (
      //   <input type="text" value={props.value as any} onInput={handleChange} />
      // )
    }
  },
})
