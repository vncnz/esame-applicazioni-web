import dynamicTable from './dynamic-table.mjs'

export default {
  name: 'CustomersView',
  template: '#CustomersViewTemplate',
  components: { dynamicTable },
  data () {
    return {
      results: [],
      sortedBy: 'cust_code',
      columns: [
        { l: 'Codice', k: 'cust_code' },
        { l: 'Nome', k: 'cust_name' },
        { l: 'Città', k: 'cust_city' },
        { l: 'Area', k: 'working_area' },
        { l: 'Nazione', k: 'cust_country' },
        { l: 'Valut.', k: 'grade' },
        { l: 'Anticipo', k: 'opening_amt' },
        { l: 'Ricevuto', k: 'receive_amt' },
        { l: 'Pagato', k: 'payment_amt' },
        { l: 'Rimanente', k: 'outstanding_amt' },
        { l: 'Telefono', k: 'phone_no' },
        { l: 'Agente', k: 'agent_code' }
      ]
    }
  },
  computed: {
    /*results () {
      return this.$store.state.customers
    }*/
  },
  methods: {
    openAgentInfo(id) {
      console.log('openAgentInfo', id)
      this.$store.dispatch({ type: "loadAgent", id }).then(response => {
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