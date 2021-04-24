import Ajv from 'ajv'
import { PropType, defineComponent, DefineComponent } from 'vue'
import { ErrorSchema } from './validator'

export enum SchemaTypes {
  'NUMBER' = 'number',
  'INTEGER' = 'integer',
  'STRING' = 'string',
  'OBJECT' = 'object',
  'ARRAY' = 'array',
  'BOOLEAN' = 'boolean',
}

type SchemaRef = { $ref: string }

export interface Schema {
  type?: SchemaTypes | string
  const?: any
  format?: string

  title?: string
  default?: any

  properties?: {
    [key: string]: Schema
  }
  items?: Schema | Schema[] | SchemaRef
  uniqueItems?: any
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef
  }
  oneOf?: Schema[]
  anyOf?: Schema[]
  allOf?: Schema[]

  required?: string[]
  enum?: any[]
  enumNames?: any[]
  enumKeyValue?: any[]
  additionalProperties?: any
  additionalItems?: Schema

  minLength?: number
  maxLength?: number
  minimun?: number
  maximum?: number
  multipleOf?: number
  exclusiveMaximum?: number
  exclusiveMinimum?: number
}

export const FieldPropsDefine = {
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  uiSchema: {
    type: Object as PropType<UISchema>,
    required: true
  },
  value: {
    required: true,
  },
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
  rootSchema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  errorSchema: {
    type: Object as PropType<ErrorSchema>,
    required: true
  }
} as const

export const TypeHelperComponent = defineComponent({
  props: FieldPropsDefine,
})

export type CommonFieldType = typeof TypeHelperComponent

export const CommonWidgetPropsDefine = {
  // 通用的props
  value: {},
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
  errors: {
    type: Array as PropType<string[]>
  },
  schema: {
    type: Object as PropType<Schema>,
    required: true
  },
  options: {
    type: Object as PropType<{[keys: string]: any}>
  }
} as const

export const SelectionWidgetPropsDefine = {
  ...CommonWidgetPropsDefine,
  options: {
    type: Array as PropType<
      {
        key: string
        value: any
      }[]
    >,
    required: true,
  },
} as const 
export type CommonWidgetDefine = DefineComponent<typeof CommonWidgetPropsDefine>

export type SelectionWidgetDefine = DefineComponent<typeof SelectionWidgetPropsDefine>

export enum SelectionWidgetNames {
  SelectionWidget = 'SelectionWidget'
}
export enum CommonWidgetNames {
  TextWidget = 'TextWidget',
  NumberWidget = 'NumberWidget'
}

export interface Theme {
  widgets: {
    [SelectionWidgetNames.SelectionWidget]: SelectionWidgetDefine
    [CommonWidgetNames.TextWidget]: CommonWidgetDefine
    [CommonWidgetNames.NumberWidget]: CommonWidgetDefine
  }
}

export type UISchema = {
  widget?: string | CommonWidgetDefine
  properties?: {
    // 嵌套向下传递
    [key: string]: UISchema
  }
  items?: UISchema | UISchema[]
} & {
  // 接收事先定义好的固定属性以外的其他属性
  [key: string]: any
}