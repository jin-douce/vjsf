import { defineComponent, DefineComponent } from 'vue'
import { FieldPropsDefine, CommonFieldType } from '../types'
import { isObject } from '../utils'
import { SchemaFormContextKey, useVJSFContext } from '../context'

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    age: {
      type: 'number',
    },
  },
}

type A = DefineComponent<typeof FieldPropsDefine, {}, {}>

export default defineComponent({
  name: 'ObjectField',
  props: FieldPropsDefine,
  setup(props) {
    const context = useVJSFContext()
    // compsion api不仅可以从组件层面抽象逻辑，还可以把组件需要的逻辑拆成更细的函数，
    // 然后通过这些函数的组合形成一个新的组件，粒度更细
    // 不同key需要不同的onChange
    const handleObjectFieldChange = (key: string, v: any) => {
      const value: any = isObject(props.value) ? props.value : {}

      if (v === undefined) {
        delete value[key]
      } else {
        value[key] = v
      }
      props.onChange(value)
    }

    return () => {
      const { schema, rootSchema, value, errorSchema, uiSchema } = props
      // SchemaItem会根据类型进行分发，可以嵌套渲染
      const { SchemaItem } = context
      const properties = schema.properties || {}
      const currentValue: any = isObject(value) ? value : {}
      // 遍历properties所有的key，按照类型进行渲染
      return Object.keys(properties).map((k: string, index: number) => (
        <SchemaItem
          schema={properties[k]}
          uiSchema={uiSchema.properties ? uiSchema.properties[k] || {} : {} }
          rootSchema={rootSchema}
          value={currentValue[k]}
          errorSchema={errorSchema[k] || {}}
          key={index}
          onChange={(v: any) => handleObjectFieldChange(k, v)}
        />
      ))
    }
  },
})
