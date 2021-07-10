import dynamicTable from './dynamic-table.mjs'

export default {
  name: 'AgentsView',
  template: '#AgentsViewTemplate',
  components: { dynamicTable },
  data () {
    return {
      results: [],
      sortedBy: 'agent_code',
      columns: [
        { l: 'Codice', k: 'agent_code' },
        { l: 'Nome', k: 'agent_name' },
        { l: 'Area', k: 'working_area' },
        { l: 'Commissione', k: 'commission' },
        { l: 'Telefono', k: 'phone_no' },
        { l: 'Nazione', k: 'country' }
      ]
    }
  },
  methods: {},
  mounted () {
    this.$store.dispatch("loadAgents").then(results => {
      this.results.splice(0, this.results.length, ...results)
    })
  }
}