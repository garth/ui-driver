import getMeta from '../helpers/getMeta'

function format (value, formatter) {
  if (typeof formatter === 'function') {
    return formatter(value)
  }
  if (typeof value !== 'string') {
    return typeof value !== 'undefined' && value !== null ? '' : `${value}`
  }
  return value
}

export default function ({
  driverModule,
  formModule,
  state,
  props,
  propsMap
}) {
  return function bindInput (fieldName, fieldProps = {}, noFormatting) {
    const statePath = [...formModule.path, fieldName]
    const driverPath = [...driverModule.path, ...formModule.path, 'fields', fieldName]
    const formValue = getMeta(state, statePath)
    const meta = getMeta(state, driverPath) || {}
    const useInputValue = typeof meta.value !== 'undefined' && meta.value !== null
    const field = (formModule.meta.form && formModule.meta.form.fields && formModule.meta.form.fields[fieldName]) || {}
    const formattedValue = noFormatting ? formValue : format(formValue, driverModule.meta.options.formatters[field.type])
    const value = useInputValue ? meta.value : formattedValue

    // if the field is not formatted then it should't be cast
    field.noCasting = noFormatting

    return Object.assign({
      [propsMap['value']]: value,
      [propsMap['isError']]: !!meta.error,
      [propsMap['isValidating']]: !!meta.isValidating,
      [propsMap['message']]: !meta.error && useInputValue && formattedValue !== value ? formattedValue : meta.error,
      [propsMap['onChange']]: function (e) {
        driverModule.meta.signals.valueChanged({
          moduleName: formModule.name,
          fields: [{
            name: fieldName,
            type: field.type,
            value: e.target.value
          }]
        })
      }
    }, { type: 'text' }, props, fieldProps)
  }
}
