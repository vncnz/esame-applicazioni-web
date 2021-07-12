import dialogMixin from '/js/mixin/dialog-mixin.mjs'
import renderMixin from '/js/mixin/render-mixin.mjs'

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
    errors () {
      let errors = { any: false }
      if (!this.order.ord_date) {
        errors['ord_date'] = 'E\' necessario inserire una data'
        errors.any = true
      }
      if (!this.order.cust_code) {
        errors['cust_code'] = "E' necessario selezionare un cliente"
        errors.any = true
      }
      if (this.userInfo.is_manager && !this.order.agent_code) {
        errors['agent_code'] = 'E\' necessario selezionare un agente'
        errors.any = true
      }
      console.log((this.userInfo.is_agent || this.userInfo.is_manager), this.order.cust_code)
      if ((this.userInfo.is_agent || this.userInfo.is_manager) && !this.order.cust_code) {
        errors['cust_code'] = 'E\' necessario selezionare un cliente'
        errors.any = true
      }
      if (!this.order.advance_amount) {
        errors['advance_amount'] = "E' necessario inserire l'anticipo"
        errors.any = true
      }
      if (!this.order.ord_amount) {
        errors['ord_amount'] = "E' necessario inserire il totale ordine"
        errors.any = true
      }
      return errors
    },
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
      if (this.errors.any) {
        this.$el.querySelector('.input-box *:invalid').focus()
      } else {
        this.$store.dispatch(this.order.ord_num ? 'updateOrder' : 'createOrder', this.order).then(response => {
          this.internalBus.$emit('notify', {
            id: 'saveOrder' + this.uid,
            text: 'Ordine salvato con successo',
            type: 'success'
          })
          this.resolve(response)
        }).catch(err => {
          this.internalBus.$emit('notify', {
            id: 'saveOrder' + this.uid,
            text: err?.msg || 'Si è verificato un errore',
            type: 'error'
          })
        })
      }
    },
    createTitleHtml(h) {
      return this.isNew ? 'Nuovo ordine' : 'Modifica ordine'
    },
    createBodyHtml(h) {
      let orderInfoFields = [
        h('legend', 'Informazioni ordine'),
        this.createTextareaHtml(h, { label: 'Descrizione', placeholder: 'Contenuto ordine' }, this.order, 'order_description'),
        this.createSelectHtml(h, { label: 'Cliente', options: this.customerOptions, error: this.errors.cust_code }, this.order, 'cust_code')
      ]
      if (this.userInfo.is_manager) {
        orderInfoFields.push(this.createSelectHtml(h, { label: 'Agente', options: this.agentOptions, error: this.errors.agent_code }, this.order, 'agent_code'))
      }
      return [
        // this.createFieldsetHtml(h, { legend: 'Prova' }, [])
        h('fieldset', [
          h('legend', 'Identificazione ordine'),
          this.createInputHtml(h, { label: 'Numero', disabled: true, placeholder: '-' }, this.order, 'ord_num'),
          this.createInputHtml(h, { label: 'Data', type: 'date', error: this.errors.ord_date }, this.order, 'ord_date')
        ]),
        h('fieldset', orderInfoFields),
        h('fieldset', [
          h('legend', 'Importi'),
          this.createInputHtml(h, { label: 'Anticipo (euro)', type: 'number', placeholder: '100.00', error: this.errors.advance_amount }, this.order, 'advance_amount'),
          this.createInputHtml(h, { label: 'Totale (euro)', type: 'number', placeholder: '1000.00', error: this.errors.ord_amount }, this.order, 'ord_amount')
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