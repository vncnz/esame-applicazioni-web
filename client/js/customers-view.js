import SortableDataMixin from './sortable-data-mixin.js'

export default {
  name: 'CustomersView',
  template: '#CustomersViewTemplate',
  mixins: [SortableDataMixin],
  data () {
    return {
      results: [],
      sortedBy: 'cust_code'
    }
  },
  computed: {
    /*results () {
      return this.$store.state.customers
    }*/
  },
  methods: {
    openBrokerInfo(id) {
      console.log('openBrokerInfo', id)
      this.$store.dispatch({ type: "loadBroker", id }).then(response => {
        console.log(response)
      })
    }
  },
  mounted () {
    this.$store.dispatch("loadCustomers").then(results => {
      this.results.splice(0, this.results.length, ...results)
    })
  }
}