import SortableDataMixin from './sortable-data-mixin.js'

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
    selArray: {
      type: Array,
      required: false,
      default: false
    },
    selKey: {
      type: String,
      required: false,
      default: null
    }
  },
  render(h) {
    let headrow = this.columns.map(col => h('th', col.l))
    if (this.selKey) {
      headrow.unshift(h('td', null, ''))
    }
    let data = this.datalist.map(result => {
      let row = this.columns.map(col => {
        // console.log('->', colkey, this.$scopedSlots[colkey], result[colkey])
        if (this.$scopedSlots[col.k]) {
          return h('td', null, this.$scopedSlots[col.k]({ row: result, value: result[col.k] }))
        } else {
          return h('td', null, result[col.k])
        }
      })
      if (this.selKey) {
        row.unshift(h('td', null, '-'))
      }
      return h('tr', [row])
    })
    return h('table', {
      class: this.fixFirstCol ? 'fix-first-column' : null
    }, [
      h('thead', [h('tr', headrow)]),
      h('tbody', [data])
    ])
  }
}