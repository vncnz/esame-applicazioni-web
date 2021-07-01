// import SortableDataMixin from './sortable-data-mixin.mjs'
import dynamicTable from './dynamic-table.mjs'
import SimpleDialog from './simple-dialog.mjs'
import ContactDialog from './contact-dialog.mjs'
import storeMjs from './store.mjs'
const { createPromiseDialog } = window.vuePromiseDialogs

const simpleDialog = createPromiseDialog(SimpleDialog)
const contactDialog = createPromiseDialog(ContactDialog)

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
        { l: 'Totale', k: 'ord_amount', numeric: true },
        { l: 'Anticipo', k: 'advance_amount', numeric: true }
      ]
      if (!this.userInfo?.is_manager) {
        lst.splice(3, 0, { l: 'Agente', k: 'agent_name' })
      }
      if (!this.userInfo?.is_customer) {
        lst.splice(3, 0, { l: 'Cliente', k: 'cust_name' })
      }
      if (this.userInfo?.is_manager || this.userInfo?.is_agent) {
        lst.push({ l: 'Azioni', k: 'actions' })
      }
      return lst
    },
    canCreateNewOrder() {
      return this.userInfo?.is_agent
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
    createNewOrder () {
      // TODO
    },
    openAgentInfo(id) {
      console.log('openAgentInfo', id)
      this.$store.dispatch({ type: "loadAgent", id }).then(response => {
        console.log(response)
        contactDialog({
          typeLabel: 'Agente',
          code: response.agent_code,
          name: response.agent_name,
          phone: response.phone_no
        })
      })
    },
    openCustomerInfo(id) {
      console.log('openCustomerInfo', id)
      this.$store.dispatch({ type: "loadCustomer", id }).then(response => {
        console.log(response)
        contactDialog({
          typeLabel: 'Cliente',
          code: response.cust_code,
          name: response.cust_name,
          phone: response.phone_no
        })
      })
    },
    editOrder (row) {
      console.log('edit')
    },
    deleteOrder (row) {
      console.log('delete')
      simpleDialog({ text: `Sei sicuro di voler eliminare l\'ordine numero ${row.ord_num}?`, type: 'confirm' }).then(confirmed => {
        if (!confirmed) {
          window.previousFocusedElement?.focus()
        } else {
          storeMjs.dispatch('deleteOrder', row.ord_num).then(() => {
            this.results = this.results.filter(r => r !== row)
          }).catch(() => {
            simpleDialog({ text: 'Si è verificato un errore' })
          })
        }
      })/*.catch(err => {
        console.log(err)
      })*/
    }
  },
  mounted () {
    this.$store.dispatch("loadOrders").then(results => {
      this.results.splice(0, this.results.length, ...results)
    })
  }
}