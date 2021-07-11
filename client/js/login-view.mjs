export default {
  name: 'LoginView',
  template: '#LoginViewTemplate',
  data () {
    return {
      username: null, // 'A002',
      password: null // 'test'
    }
  },
  methods: {
    login () {
      this.$store.dispatch('doLogin', { username: this.username, password: this.password }).then(() => {
        this.internalBus.$emit('notify', {
          id: 'useraccess',
          text: 'Accesso effettuato con successo',
          type: 'success'
        })
        this.$router.push('/ordini')
      }).catch(err => {
        let text = err.body?.msg
        if (!text) {
          if (err.status === 401) {
            text = 'Accesso negato'
          } else {
            text = 'Si è verificato un errore'
          }
        }
        this.internalBus.$emit('notify', {
          id: 'useraccess',
          text,
          type: 'error'
        })
      })
    }
  }
}