import SortableDataMixin from './sortable-data-mixin.mjs'
import dynamicTable from './dynamic-table.mjs'

export default {
  name: 'OrdersView',
  template: '#OrdersViewTemplate',
  components: { dynamicTable },
  data () {
    return {
      results: [],
      sortedBy: 'ord_num',
      selected: []
    }
  },
  computed: {
    columns () {
      let lst = [
        { l: 'Numero', k: 'ord_num', sticky: true },
        { l: 'Data', k: 'ord_date' },
        { l: 'Descrizione', k: 'order_description' },
        { l: 'Agente', k: 'agent_code' },
        { l: 'Cliente', k: 'cust_code' },
        { l: 'Totale', k: 'ord_amount', numeric: true },
        { l: 'Anticipo', k: 'advance_amount', numeric: true }
      ]
      if (this.userInfo?.is_manager || this.userInfo?.is_agent) {
        lst.push({ l: 'Azioni', k: 'actions' })
      }
      return lst
    }
  },
  methods: {
    canEdit (row) {
      if (this.userInfo?.is_manager) {
        return true
      }
      if (userInfo?.is_agent) {
        return userInfo?.sub === row.agent_code
      }
      return false
    },
    openAgentInfo(id) {
      console.log('openAgentInfo', id)
      this.$store.dispatch({ type: "loadAgent", id }).then(response => {
        console.log(response)
      })
    },
    openCustomerInfo(id) {
      console.log('openCustomerInfo', id)
      this.$store.dispatch({ type: "loadCustomer", id }).then(response => {
        console.log(response)
      })
    },
    edit(row) { },
    delete(row) { }
  },
  mounted () {
    this.$store.dispatch("loadOrders").then(results => {
      this.results.splice(0, this.results.length, ...results)
    })
  }
}