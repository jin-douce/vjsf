const Ajv = require('ajv')

const schema = {
  type: 'string',
  minLength: 10,
}

const ajv = new Ajv()
const validate = ajv.compile(schema)
const valid = validate(123)
if (!valid) console.log(validate.errors)
