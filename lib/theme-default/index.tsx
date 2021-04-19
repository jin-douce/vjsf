import SelectionWidget from './SelectionWidget'
import TextWidget from './TextWidget'
import NumberWidget from './NumberWidget'
import { CommonWidgetPropsDefine, CommonWidgetDefine } from '../types'
import { defineComponent } from '@vue/runtime-core'
// types中没有import，可以公用

const CommonWidget: CommonWidgetDefine = defineComponent({
  props: CommonWidgetPropsDefine,
  setup(){
    return () => null
  }
})

export default {
  widgets: {
    SelectionWidget,
    TextWidget, 
    NumberWidget
  }
}