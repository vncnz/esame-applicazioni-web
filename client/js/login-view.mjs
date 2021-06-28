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
      this.$store.dispatch('doLogin', { username: this.username, password: this.password })
    },
    esci () {
      this.$store.commit('doLogout')
    },
    test () {
      this.$http.get('/protected')
    }
  }
}