import dialogMixin from './dialog-mixin.mjs'
import renderMixin from './render-mixin.mjs'

export default {
  name: 'OrderDialog',
  mixins: [dialogMixin, renderMixin],
  props: {
    params: {
      type: Object,
      required: true,
    }
  },
  data () {
    return {
      order: {
        ord_num: null,
        ord_amount: null,
        advance_amount: null,
        ord_date: null,
        cust_code: null,
        agent_code: null,
        order_description: null
      },
      customers: [],
      agents: []
    }
  },
  computed: {
    isNew () {
      return !this.order?.ord_num
    },
    customerOptions () {
      /* avrei potuto far restituire al server già la lista così come mi serve, ma disaccoppiamo le cose... */
      return this.customers.map(cust => {
        return {
          key: cust.code,
          label: cust.name
        }
      })
    },
    agentOptions () {
      /* avrei potuto far restituire al server già la lista così come mi serve, ma disaccoppiamo le cose... */
      return this.agents.map(agent => {
        return {
          key: agent.code,
          label: agent.name
        }
      })
    }
  },
  methods: {
    save () {
      this.$store.dispatch(this.order.ord_num ? 'updateOrder' : 'createOrder', this.order).then(response => {
        this.resolve(response)
      }).catch(err => {
        // TODO
      })
    },
    createTitleHtml(h) {
      return this.isNew ? 'Nuovo ordine' : 'Modifica ordine'
    },
    createBodyHtml(h) {
      let orderInfoFields = [
        h('legend', 'Informazioni ordine'),
        this.createTextareaHtml(h, { label: 'Descrizione', placeholder: 'Contenuto ordine' }, this.order, 'order_description'),
        this.createSelectHtml(h, { label: 'Cliente', options: this.customerOptions }, this.order, 'cust_code')
      ]
      if (this.userInfo.is_manager) {
        orderInfoFields.push(this.createSelectHtml(h, { label: 'Agente', options: this.agentOptions }, this.order, 'agent_code'))
      }
      return [
        // this.createFieldsetHtml(h, { legend: 'Prova' }, [])
        h('fieldset', [
          h('legend', 'Identificazione ordine'),
          this.createInputHtml(h, { label: 'Numero', disabled: true, placeholder: '-' }, this.order, 'ord_num'),
          this.createInputHtml(h, { label: 'Data', type: 'date' }, this.order, 'ord_date')
        ]),
        h('fieldset', orderInfoFields),
        h('fieldset', [
          h('legend', 'Costi?'),
          this.createInputHtml(h, { label: 'Anticipo', type: 'number', placeholder: '100.00' }, this.order, 'advance_amount'),
          this.createInputHtml(h, { label: 'Totale', type: 'number', placeholder: '1000.00' }, this.order, 'ord_amount')
        ])
        // h('pre', JSON.stringify(this.order))
      ]
    },
    createFooterHtml(h) {
      return [
        h('button', {
          class: 'secondary',
          domProps: { type: 'button' },
          on: {
            click: () => { this.reject() }
          }
        }, ['Annulla']),
        h('button', {
          class: 'primary',
          domProps: { type: 'button' },
          on: {
            click: () => { this.save() }
          }
        }, ['Salva'])
      ]
    }
  },
  mounted () {
    this.$store.dispatch('loadCustomersResume').then(customers => {
      this.customers.splice(0, 0, ...customers)
    }).catch(err => {
      this.internalBus.$emit('notify', {
        text: err.body?.msg || 'Si è verificato un errore',
        type: 'error'
      })
      this.reject()
    })
    if (this.userInfo?.is_manager) {
      this.$store.dispatch('loadAgentsResume').then(agents => {
        this.agents.splice(0, 0, ...agents)
      }).catch(err => {
        this.internalBus.$emit('notify', {
          text: err.body?.msg || 'Si è verificato un errore',
          type: 'error'
        })
        this.reject()
      })
    }
    Object.entries(this.params).forEach((key_value) => {
      this.$set(this.order, key_value[0], key_value[1])
    })
  }
}