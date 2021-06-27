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
    let headrow = this.columns.map(col => h('th', col.l))
    if (this.selKey) {
      headrow.unshift(h('td', null, [
        h('input', {
          attrs: { type: 'checkbox', value: this.value.length === this.datalist.length },
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
        // console.log('->', colkey, this.$scopedSlots[colkey], result[colkey])
        if (this.$scopedSlots[col.k]) {
          return h('td', null, this.$scopedSlots[col.k]({ row: result, value: result[col.k] }))
        } else {
          return h('td', null, result[col.k])
        }
      })
      if (this.selKey) {
        console.log(this.value.indexOf(result[this.selKey]) > -1)
        row.unshift(h('td', null, [
          h('input', {
            attrs: { type: 'checkbox', value: this.value.indexOf(result[this.selKey]) > -1 },
            on: { input: evt => { 
              // console.log(value)
              // let idx = this.value.indexOf(result[this.selKey])
              // if (idx > -1) {
                if (!evt.target.checked) {
                this.$emit('input', this.value.filter(c => c !== result[this.selKey]))
              } else {
                this.$emit('input', this.value.concat([result[this.selKey]]))
              }
             } }
          })
        ]))
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