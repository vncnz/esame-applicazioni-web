import SortableDataMixin from './sortable-data-mixin.js'
import dynamicTable from './dynamic-table.js'

export default {
  name: 'OrdersView',
  template: '#OrdersViewTemplate',
  mixins: [SortableDataMixin],
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
        { l: 'Numero', k: 'ord_num' },
        { l: 'Data', k: 'ord_date' },
        { l: 'Descrizione', k: 'order_description' },
        { l: 'Agente', k: 'agent_code' },
        { l: 'Cliente', k: 'cust_code' },
        { l: 'Totale', k: 'ord_amount' },
        { l: 'Anticipo', k: 'advance_amount' }
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
    edit(row) { },
    delete(row) { }
  },
  mounted () {
    this.$store.dispatch("loadOrders").then(results => {
      this.results.splice(0, this.results.length, ...results)
    })
  }
}