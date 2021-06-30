export default {
  name: 'ConfirmDialog',
  props: {
    params: {
      type: Object,
      required: true,
    }
  },
  methods: {
    yes () {
      this.$emit('resolve', true)
    },
    no () {
      this.$emit('resolve', false)
    }
  },
  mounted () {
    this.$el.querySelector('button:first-child').focus()
  },
  render (h) {
    let buttons = []
    let title = this.params.title
    let text = this.params.text
    if (this.params.type === 'confirm') {
      if (title === undefined) {
        title = 'Conferma necessaria'
      }
      if (text === undefined) {
        text = 'Sei sicuro di voler proseguire?'
      }
      buttons = [
        h('button', {
          class: 'secondary',
          on: {
            click: () => { this.no() }
          }
        }, ['No']),
        h('button', {
          class: 'primary',
          on: {
            click: () => { this.yes() }
          }
        }, ['Sì'])
      ]
    } else {
      if (title === undefined) {
        title = 'Avviso'
      }
      buttons = [
        h('button', {
          class: 'primary',
          on: {
            click: () => { this.yes() }
          }
        }, ['ok'])
      ]
    }
    return h('div', {
      class: 'dcontainer',
    }, [
      h('div', { class: 'dglass' }, []),
      h('div', {
        class: 'dialog'
      }, [
        h('div', { class: 'dheader' }, [title]),
        h('div', { class: 'dbody' }, [text]),
        h('div', { class: 'dfooter' }, buttons)
      ])
    ])
  }
}