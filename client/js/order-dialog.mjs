import dialogMixin from './dialog-mixin.mjs'

export default {
  name: 'OrderDialog',
  mixins: [dialogMixin],
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
      }
    }
  },
  computed: {
    isNew () {
      return !this.order?.ord_num
    }
  },
  methods: {
    createTitleHtml(h) {
      return this.isNew ? 'Nuovo ordine' : 'Modifica ordine'
    },
    createBodyHtml(h) {
      return this.order?.ord_num
    },
    createFooterHtml(h) {
      return [
        h('button', {
          class: 'secondary',
          on: {
            click: () => { this.reject() }
          }
        }, ['Annulla']),
        h('button', {
          class: 'primary',
          on: {
            click: () => { this.resolve() }
          }
        }, ['Salva'])
      ]
    }
  },
  mounted () {
    Object.entries(this.params).forEach((key_value) => {
      this.$set(this.order, key_value[0], key_value[1])
    })
  }
}