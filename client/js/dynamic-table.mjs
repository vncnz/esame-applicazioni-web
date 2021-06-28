import SortableDataMixin from './sortable-data-mixin.mjs'

export default {
  name: 'OrdersView',
  mixins: [SortableDataMixin],
  props: {
    datalist: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    fixFirstCol: {
      type: Boolean,
      required: false,
      default: false
    },
    selKey: {
      type: String,
      required: false,
      default: null
    },
    value: {
      required: false
    }
  },
  render(h) {
    let headrow = this.columns.map(col => h('th', {
      class: col.sticky ? 'sticky' : ''
    }, col.l))
    if (this.selKey) {
      let checked = this.value.length === this.datalist.length
      headrow.unshift(h('th', null, [
        h('input', {
          attrs: { type: 'checkbox', title: checked ? 'Deseleziona tutto' : 'Seleziona tutto' },
          domProps: { checked },
          on: {
            input: () => {
              if (this.value.length === this.datalist.length) {
                this.$emit('input', [])
              } else {
                this.$emit('input', this.datalist.map(r => r[this.selKey]))
              }
            }
          }
        })
      ]))
    }
    let data = this.datalist.map(result => {
      let row = this.columns.map(col => {
        let attrs = { class: col.sticky ? 'sticky' : '', attrs: { 'data-title': col.l }}
        if (this.$scopedSlots[col.k]) {
          return h('td', attrs, this.$scopedSlots[col.k]({ row: result, value: result[col.k] }))
        } else {
          return h('td', attrs, result[col.k])
        }
      })
      if (this.selKey) {
        let checked = this.value.indexOf(result[this.selKey]) > -1
        row.unshift(h('td', null, [
          h('input', {
            attrs: { type: 'checkbox', title: `${checked ? 'Deseleziona' : 'Seleziona'} ${result[this.selKey]}`},
            domProps: { checked },
            on: { input: evt => {
                if (!evt.target.checked) {
                this.$emit('input', this.value.filter(c => c !== result[this.selKey]))
                } else {
                  this.$emit('input', this.value.concat([result[this.selKey]]))
                }
              }
            }
          })
        ]))
      }
      return h('tr', [row])
    })
    let children = [
      h('thead', [h('tr', headrow)]),
      h('tbody', [data])
    ]
    if (this.$slots['tfoot']) {
      children.push(h('tfoot', null, [
        h('tr', null, [
          h('td', {
            attrs: {
              colspan: this.columns.length + (this.selKey ? 1 : 0)
            }
          }, [this.$slots['tfoot']])
        ])
      ]))
    }
    return h('table', { class: 'responsive' }, children)
  }
}