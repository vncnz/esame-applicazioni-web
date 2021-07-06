export default {
  name: 'LoginView',
  template: '#LoginViewTemplate',
  data() {
    return {
      username: 'dirigente',
      password: 'test'
    }
  },
  methods: {
    accedi() {
      this.$store.dispatch('doLogin', { username: this.username, password: this.password }).then(() => {
        this.internalBus.$emit('notify', {
          id: 'trylogin',
          text: 'Accesso effettuato con successo',
          type: 'success'
        })
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
          id: 'trylogin',
          text,
          type: 'error'
        })
      })
    },
    esci () {
      this.$store.commit('doLogout')
    }
  }
}