import SortableDataMixin from '/js/sortable-data-mixin.js'

export default {
  name: 'CustomersView',
  template: '#CustomersViewTemplate',
  mixins: [SortableDataMixin],
  data () {
    return {
      results: window.clienti,
      sortedBy: 'cust_code'
    }
  },
  mounted () {
    console.log(this.sortedResults)
  }
}