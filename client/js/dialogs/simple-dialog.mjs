import dialogMixin from '/js/mixin/dialog-mixin.mjs'

export default {
  name: 'SimpleDialog',
  mixins: [dialogMixin],
  computed: {
    isConfirmDialog () {
      return this.params.type === 'confirm'
    }
  },
  methods: {
    createTitleHtml(h) {
      if (this.params.title) {
        return this.params.title
      }
      return this.isConfirmDialog ? 'Conferma necessaria' : 'Avviso'
    },
    createBodyHtml(h) {
      if (this.params.text) {
        return this.params.text
      }
      return this.isConfirmDialog ? 'Sei sicuro di voler proseguire?' : ''
    },
    createFooterHtml(h) {
      if (this.isConfirmDialog) {
        return [
          h('button', {
            class: 'secondary',
            domProps: { type: 'button' },
            on: {
              click: () => { this.resolve(false) }
            }
          }, ['No']),
          h('button', {
            class: 'primary',
            domProps: { type: 'button' },
            on: {
              click: () => { this.resolve(true) }
            }
          }, ['Sì'])
        ]
      } else {
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
}