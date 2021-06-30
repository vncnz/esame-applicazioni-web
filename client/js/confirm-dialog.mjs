export default {
  name: 'ConfirmDialog',
  template: '<div><button @click="yes">y</button></div>',
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
    this.$el.querySelector('button.secondary').focus()
  },
  render (h) {
    return h('div', {
      class: 'dcontainer',
    }, [
      h('div', { class: 'dglass' }, []),
      h('div', {
        class: 'dialog'
      }, [
        h('div', { class: 'dheader' }, [this.params.title || 'Conferma necessaria']),
        h('div', { class: 'dbody' }, [this.params.text || 'Sei sicuro di voler proseguire?']),
        h('div', { class: 'dfooter' }, [
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
            } }, ['Sì'])
        ])
      ])
    ])
  }
}