import dialogMixin from './dialog-mixin.mjs'

export default {
  name: 'ContactDialog',
  mixins: [dialogMixin],
  methods: {
    createTitleHtml(h) {
      return [`${this.params.typeLabel} ${this.params.code}`]
    },
    createBodyHtml(h) {
      return [
        h('div', [`Nome: ${this.params.name}`]),
        h('div', [`Numero: ${this.params.phone}`])
      ]
    },
    createFooterHtml(h) {
      return [
        h('button', {
          class: 'primary',
          domProps: { type: 'button' },
          on: {
            click: () => { this.resolve() }
          }
        }, ['ok'])
      ]
    }
  }
}