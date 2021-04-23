import Ajv,{ErrorObject} from 'ajv'
import toPath from 'lodash.topath'
import { Schema } from './types'
const i18n = require('ajv-i18n')
import { isObject } from  './utils'

interface TransformedErrorObject {
    name: string
    property: string
    message: string | undefined
    params: Record<string, any>
    schemaPath: string
  }
// 中间类型，解决循环引用问题
  interface ErrorSchemaObject {
    [level: string]: ErrorSchema
  }
  
  export type ErrorSchema = ErrorSchemaObject & {
    __errors?: string[]
  }


function toErrorSchema(errors: TransformedErrorObject[]){
    if(errors.length < 1) return {}
    return errors.reduce((errorSchema, error) => {

        const { property, message } = error
        const path = toPath(property) //  将 /obj/a 转化为[obj, a]
        let parent = errorSchema
    
        // 如果访问的是根节点，返回的是空数组
        if (path.length > 0 && path[0] === '') {
          path.splice(0, 1)
        }
    
        // 一直遍历到最后一个对象为止，避免和key的名字冲突
        for (const segment of path.slice(0)) {
          if (!(segment in parent)) {
            ;(parent as any)[segment] = {}
          }
          parent = parent[segment]
        }
    
        if (Array.isArray(parent.__errors)) {
          // 将错误信息存在_errors属性中
          parent.__errors = parent.__errors.concat(message || '')
        } else {
          if (message) {
            parent.__errors = [message]
          }
        }
        return errorSchema
      }, {} as ErrorSchema)
    }



function transformErrors(errors: ErrorObject[] | null | undefined): TransformedErrorObject[] 
{
  if (errors === null || errors === undefined) return []

  return errors.map(({ message, instancePath, keyword, params, schemaPath }) => {
    // 将/xxx改为xxx，否则toPath不能识别
    const pathStr = instancePath ? instancePath.split('/')[1] : instancePath
    
    return {
      name: keyword,
      property: `${pathStr}`,
      message,
      params,
      schemaPath,
    }
  })
}
export async function validateFormData(
    validator: Ajv,
    formData: any,
    schema: Schema,
    locale: string = 'zh',
    customValidate?: (data: any, errors: any) => void
){
    let validationError = null
    try{
        validator.validate(schema, formData)
    }catch(err){
      // schema错误导致的报错
        validationError = err
    }
    i18n[locale](validator.errors)
    let errors = transformErrors(validator.errors)

    if(validationError){
        errors = [
            ...errors,
            {
                message: validationError.message
            } as TransformedErrorObject,
        ]       
    }
    const errorSchema = toErrorSchema(errors)

    if(!customValidate){
      // 如果没有自定义校验
      return {
        errors,
        errorSchema,
        valid: errors.length===0,
      }
    }
    
    // 如果有自定义校验
    const proxy = createErrorProxy()
    await customValidate(formData, proxy)
    // 合并现有的errorSchema和proxy
    const newErrorSchema = mergeObjects(errorSchema, proxy, true)
    return {
      errors,
      errorSchema: newErrorSchema,
      valid: errors.length === 0,
    }
}

// 使用Proxy拦截addError 存储__errors
function createErrorProxy(){
  const raw = {}
  return new Proxy(raw, {
    get(target, key, receiver){
      if(key==='addError'){
        return (msg: string) => {
          const __errors = Reflect.get(target, '__errors', receiver)
          if(__errors && Array.isArray( __errors)){
            __errors.push(msg)
          }else{
            ;(target as any).__errors = [msg]
          }
        }
      }
      const res = Reflect.get(target, key, receiver)
      if(res === undefined){
        const p: any = createErrorProxy()
        ;(target as any)[key] = p
        // 不能直接返回res[key] 否则会进入get造成循环
        return p
      }
      return res
    }
  })
}

// 合并对象
export function mergeObjects(obj1: any, obj2: any, concatArrays = false) {
  // Recursively merge deeply nested objects.
  const acc = Object.assign({}, obj1) // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {},
      right = obj2[key]
    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeObjects(left, right, concatArrays)
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right)
    } else {
      acc[key] = right
    }
    return acc
  }, acc)
}