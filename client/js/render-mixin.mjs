export default {
  methods: {
    /* createFieldsetHtml (h, params, children) {
      return h('fieldset', [])
    }, */
    createInputHtml(h, params, model, key) {
      const self = this
      params = Object.assign({ type: 'text', disabled: false, placeholder: null }, params)
      return h('div', {
        class: 'input-box-2'
      }, [
        h('label', params.label),
        h('input', {
          domProps: {
            type: params.type,
            disabled: params.disabled,
            placeholder: params.placeholder,
            value: model[key]
          },
          on: {
            input: function (event) {
              self.$set(model, key, event.target.value)
            }
          }
        })
      ])
    },
    createSelectHtml(h, params, model, key) {
      const self = this
      params = Object.assign({ disabled: false, placeholder: null, options: [] }, params)
      return h('div', {
        class: 'input-box-2'
      }, [
        h('label', params.label),
        h('select', {
          domProps: {
            disabled: params.disabled,
            placeholder: params.placeholder,
            value: model[key]
          },
          on: {
            change: function (event) {
              self.$set(model, key, event.target.value)
            }
          }
        }, params.options.map(opt => h('option', {
          domProps: {
            value: opt.key,
            selected: opt.key === model[key]
          }
        }, opt.label)))
      ])
    },
    createTextareaHtml(h, params, model, key) {
      const self = this
      params = Object.assign({ disabled: false, placeholder: null }, params)
      return h('div', {
        class: 'input-box-2'
      }, [
        h('label', params.label),
        h('textarea', {
          domProps: {
            disabled: params.disabled,
            placeholder: params.placeholder,
            value: model[key]
          },
          on: {
            input: function (event) {
              self.$set(model, key, event.target.value)
            }
          }
        })
      ])
    },
  }
}