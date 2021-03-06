import PasswordWidget from '../components/PasswordWidget'

export default {
  name: 'Demo',
  schema: {
    type: 'object',
    properties: {
      pass1: {
        type: 'string',
        minLength: 10,
        title: 'password'
      },
      pass2: {
        type: 'string',
        minLength: 10,
        title: 're try password'
      }
    }
  },
  async customValidate(data: any, errors: any){
    // 通过proxy代理，当发现没有pass属性时会增加该属性
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if(data.pass1 !== data.pass2){
          errors.pass2.addError('密码必须相同')  
        }
        resolve()
      }, 2000)
    })
  },
  // 在uischema传入组件实现自定义组件
  uiSchema: {
    properties: {
      pass1: {
        widget: PasswordWidget,
      },
      pass2: {
        color: 'red'
      }
    }
  },
  default: 123,
}
