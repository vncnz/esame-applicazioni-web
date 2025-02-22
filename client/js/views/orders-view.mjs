import dynamicTable from '../components/dynamic-table.mjs'
import SimpleDialog from '../dialogs/simple-dialog.mjs'
import OrderDialog from '../dialogs/order-dialog.mjs'
import storeMjs from '../store.mjs'
const { createPromiseDialog } = window.vuePromiseDialogs

const simpleDialog = createPromiseDialog(SimpleDialog)
const orderDialog = createPromiseDialog(OrderDialog)

export default {
  name: 'OrdersView',
  template: '#OrdersViewTemplate',
  components: { dynamicTable },
  data () {
    return {
      results: [],
      sortedBy: 'ord_num'
      // selected: []
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
      if (!this.userInfo?.is_agent) {
        lst.splice(3, 0, { l: 'Agente', k: 'agent_name' })
      }
      if (!this.userInfo?.is_customer) {
        lst.splice(3, 0, { l: 'Cliente', k: 'cust_name' })
      }
      if (this.userInfo?.is_manager || this.userInfo?.is_agent) {
        lst.push({ l: 'Azioni', k: 'actions', sortable: false })
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
      orderDialog({}).then(new_row => {
        this.results.push(new_row)
      }).catch(() => {
        // TODO
      })
    },
    editOrder (row) {
      orderDialog(row).then(new_row => {
          Object.entries(new_row).forEach((key_value) => {
            this.$set(row, key_value[0], key_value[1])
          })
        }
      ).catch(() => {})
    },
    deleteOrder (row) {
      console.log('delete')
      simpleDialog({ text: `Sei sicuro di voler eliminare l\'ordine numero ${row.ord_num}?`, type: 'confirm' }).then(confirmed => {
        if (!confirmed) {
          window.previousFocusedElement?.focus()
        } else {
          storeMjs.dispatch('deleteOrder', row.ord_num).then(() => {
            this.internalBus.$emit('notify', {
              id: 'deleteOrder' + this.uid,
              text: 'Ordine salvato con successo',
              type: 'success'
            })
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