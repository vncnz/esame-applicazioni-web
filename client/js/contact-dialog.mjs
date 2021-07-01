export default {
  name: 'ContactDialog',
  props: {
    params: {
      type: Object,
      required: true,
    }
  },
  methods: {
    close () {
      this.$emit('resolve')
    }
  },
  mounted () {
    this.$el.querySelector('button:first-child').focus()
  },
  render (h) {
    return h('div', {
      class: 'dcontainer',
    }, [
      h('div', { class: 'dglass' }, []),
      h('div', {
        class: 'dialog'
      }, [
        h('div', { class: 'dheader' }, [`${this.params.typeLabel} ${this.params.code}`]),
        h('div', { class: 'dbody' }, [
          h('div', [`Nome: ${this.params.name}`]),
          h('div', [`Numero: ${this.params.phone}`])
        ]),
        h('div', { class: 'dfooter' }, [
          h('button', {
            class: 'primary',
            on: {
              click: () => { this.close() }
            }
          }, ['ok'])
        ])
      ])
    ])
  }
}