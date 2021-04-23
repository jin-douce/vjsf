import { defineComponent } from '@vue/runtime-core'
import { CommonWidgetPropsDefine, CommonWidgetDefine } from '../types'
import { createUseStyles} from 'vue-jss'

const useStyles = createUseStyles({
  container:{},
  label: {
    display: 'block',
    color: '#777'
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    margin: '5px 0',
    padding: '0',
    paddingLeft: '20px'
  }
})

const FormItem =  defineComponent({
  name: 'FormItem',
  props: CommonWidgetPropsDefine,
  setup(props, { slots }){
    const classesRef = useStyles()
    return () => {
      const classes = classesRef.value
      const { schema, errors } = props
      return <div class={classes.container}>
        <label class={classes.label}>{schema.title}</label>
        {slots.default && slots.default()}
        <ul class={classes.errorText}>
          {errors?.map((err) => (<li>{err}</li>))}
        </ul>
      </div>
    }
  }
})

export default FormItem

// HOC：高阶组件  用函数包装组件
// composition api只能抽离非渲染部分的逻辑，高阶组件可以抽离渲染部分的逻辑
export function withFormItem(Widget: any){
  return defineComponent({
    name: `Wrapped${Widget.name}`,
    props: CommonWidgetPropsDefine,
    setup(props, { attrs }){
      return () => {
        return <FormItem {...props}>
          <Widget {...props} {...attrs} />
        </FormItem>
      }
    }
  }) as any
} 