import getMeta from '../helpers/getMeta'

export default function ({
  driverModule,
  formModule,
  state,
  props,
  propsMap
}) {
  return function (fieldName, fieldProps = {}) {
    const statePath = [...formModule.path, fieldName]
    const driverPath = [...driverModule.path, ...formModule.path, 'fields', fieldName]
    const formValue = getMeta(state, statePath)
    const meta = getMeta(state, driverPath) || {}
    const useInputValue = typeof meta.value !== 'undefined' && meta.value !== null
    const formattedValue = formValue // format(formValue)
    const value = useInputValue ? meta.value : formattedValue

    return Object.assign({
      [propsMap['value']]: value,
      [propsMap['isError']]: !!meta.error,
      [propsMap['message']]: !meta.error && useInputValue && formattedValue !== value ? formattedValue : meta.error,
      [propsMap['onChange']]: function (e) {
        driverModule.signals.valuesChanged({
          fields: [{
            name: fieldName,
            type: formModule.meta.form.fields[fieldName].type,
            value: e.target.value
          }]
        })
      }
    }, { type: 'text' }, props, fieldProps)
  }
}
