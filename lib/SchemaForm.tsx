import { defineComponent, PropType, provide } from 'vue'
import { Schema, SchemaTypes } from './types'
import SchemaItem from './SchemaItems'
import { SchemaFormContextKey } from './context'

// 入口
export default defineComponent({
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
  },
  name: 'SchemaForm',
  setup(props, { slots, emit, attrs }) {
    const handleChange = (v: any) => {
      props.onChange(v)
    }
    const context: any = {
      SchemaItem,
    }
    // 通过provide api向子节点提供SchemaItem组件
    provide(SchemaFormContextKey, context)

    return () => {
      const { schema, value } = props
      return (
        <SchemaItem
          schema={schema}
          rootSchema={schema}
          value={value}
          onChange={handleChange}
        />
      )
    }
  },
})
