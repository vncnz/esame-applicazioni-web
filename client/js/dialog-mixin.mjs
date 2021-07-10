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
  beforeCreate () {
    console.log(document.activeElement)
    this.lastFocusedElement = document.activeElement
  },
  beforeDestroy () {
    this.lastFocusedElement.focus()
  },
  render (h) {
    return h('div', {
      class: 'dcontainer'
    }, [
      h('div', { class: 'dglass' }, []),
      h('div', {
        class: 'dialog',
        domProps: { 'aria-labelledby': 'dialogtitle', role: 'dialog' },
        on: {
          keyup: evt => {
            if (evt.key === "Escape") {
              this.reject()
            }
          }
        }
      }, [
        h('div', { class: 'dheader', id: 'dialogtitle' }, this.createTitleHtml(h)),
        h('div', { class: 'dbody' }, this.createBodyHtml(h)),
        h('div', { class: 'dfooter' }, this.createFooterHtml(h))
      ])
    ])
  }
}