export default {
  props: {
    params: {
      type: Object,
      required: true,
    }
  },
  methods: {
    resolve (data) {
      this.$emit('resolve', data)
    },
    reject (data) {
      this.$emit('reject', data)
    },
    createTitleHtml (h) {},
    createBodyHtml(h) {},
    createFooterHtml(h) {}
  },
  mounted () {
    let firstInput = this.$el.querySelector('input:enabled')
    if (firstInput) {
      firstInput.focus()
    } else {
      this.$el.querySelector('button:first-child').focus()
    }
  },
  render (h) {
    return h('div', {
      class: 'dcontainer',
    }, [
      h('div', { class: 'dglass' }, []),
      h('div', {
        class: 'dialog'
      }, [
        h('div', { class: 'dheader' }, this.createTitleHtml(h)),
        h('div', { class: 'dbody' }, this.createBodyHtml(h)),
        h('div', { class: 'dfooter' }, this.createFooterHtml(h))
      ])
    ])
  }
}