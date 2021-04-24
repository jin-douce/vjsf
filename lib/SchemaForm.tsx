import { defineComponent, PropType, provide, Ref, shallowRef, watch, watchEffect, ref } from 'vue'
import { Schema, SchemaTypes, Theme, UISchema } from './types'
import SchemaItem from './SchemaItems'
import { SchemaFormContextKey } from './context'
import Ajv, { Options } from 'ajv'
import { validateFormData, ErrorSchema } from './validator'

interface contextRef {
  doValidate: () => Promise<{
    errors: any[],
    valid: boolean
  }>
}
// 要使用ajv-errors必须的配置
const defaultAjvOptions: Options = {
  allErrors: true,
  // jsonPointers: true 
}

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
    // theme: {
    //   type: Object as PropType<Theme>,
    //   required: true
    // }
    contextRef: {
      type: Object as PropType<Ref<contextRef | undefined>>
    },
    ajvOptions: {
      type: Object as PropType<Options>
    },
    locale: {
      type: String,
      default: 'zh'
    },
    customValidate: {
      // 自定义校验
      type: Function as PropType<(data: any, errors: any) => void>
    },
    uiSchema: {
      type: Object as PropType<UISchema>
    }
  },
  name: 'SchemaForm',

  setup(props, { slots, emit, attrs }) {
    const handleChange = (v: any) => {
      props.onChange(v)
    }
    const context: any = {
      SchemaItem,
      // theme: props.theme
    }

    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({})
    const validatorRef: Ref<Ajv> = shallowRef() as any
    watchEffect(() => {
      // 回调中引用到的响应式属性变化的时候，就会引起回调重新执行，得到一个新的value
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions
      })
    })
   
    // 保存返回校验结果的方式
    const validateResolveRef = ref()
    // 记录每次校验的上下文
    const validateIndex = ref(0)
    watch(() => props.value, () => {
      if(validateResolveRef.value){
        doValidate()
      }
      
    }, {deep: true})

    async function doValidate(){
      console.log('start validate-----------》');
      
      const index = validateIndex.value+=1
      // 校验结果会赋值给value
      const valid = validatorRef.value.validate(props.schema, props.value)
      const result = await validateFormData(
        validatorRef.value, 
        props.value, 
        props.schema, 
        props.locale,
        props.customValidate
        )
        // index和实际上下文index不同，则放弃本次校验
      if(index !== validateIndex.value) return
      console.log('end validate-----------》');
      errorSchemaRef.value = result.errorSchema
      validateResolveRef.value(result)
      validateResolveRef.value = undefined
      // return result
    }
    // 第一个参数写成函数返回值，因为watch不接收undefined类型参数
    watch(() => props.contextRef, () => {
      if(props.contextRef){
        props.contextRef.value = {
          doValidate(){
            return new Promise((resolve) => {
              validateResolveRef.value = resolve
              doValidate()
            })
            
          }
        }
      }
    },
    {
      immediate: true
    }
    )
    // 通过provide api向子节点提供SchemaItem组件
    provide(SchemaFormContextKey, context)

    return () => {
      const { schema, value, uiSchema } = props
      return (
        <SchemaItem
          schema={schema}
          rootSchema={schema}
          value={value}
          onChange={handleChange}
          uiSchema={uiSchema || {}}
          errorSchema={errorSchemaRef.value || {}}
        />
      )
    }
  },
})
