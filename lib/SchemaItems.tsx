import { computed, defineComponent, PropType } from 'vue'
import NumberField from './fields/NumberField'
import StringField from './fields/StringField'
import ObjectField from './fields/ObjectField'
import ArrayField from './fields/ArrayField'
import { Schema, SchemaTypes, FieldPropsDefine } from './types'
import { retrieveSchema } from './utils'

// 根据不同的类型将schema的渲染工作分发给对应组件
export default defineComponent({
  name: 'SchemaItem',
  props: FieldPropsDefine,
  setup(props) {
    //
    const retrievedSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props
      return retrieveSchema(schema, rootSchema, value)
    })
    // 不用每次渲染时都重新计算，只有变化的时候才需要重新计算
    return () => {
      const { schema, rootSchema, value } = props
      const retrievedSchema = retrievedSchemaRef.value
      const type = schema.type
      let Component: any
      switch (type) {
        case SchemaTypes.STRING: {
          Component = StringField
          break
        }
        case SchemaTypes.NUMBER: {
          Component = NumberField
          break
        }
        case SchemaTypes.OBJECT: {
          Component = ObjectField
          break
        }
        case SchemaTypes.ARRAY: {
          Component = ArrayField
          break
        }
        default: {
          console.warn(`${type} is not surpported`)
        }
      }
      return <Component {...props} schema={retrievedSchema} />
    }
  },
})
