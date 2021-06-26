const fake = false

export default new Vuex.Store({
  state: {
    userToken: localStorage.getItem('user_token'),
    // customers: []
  },
  mutations: {
    registerUser (state, { token }) {
      state.userToken = token
      localStorage.setItem('user_token', token)
    },
    doLogout (state) {
      state.userToken = null
      localStorage.removeItem('user_token')
    }/*,
    registerCustomers(state, { customers }) {
      // state.customers.splice(0, state.customers.length, ...customers)
      state.customers = customers
    }*/
  },
  actions: {
    doLogin (context, { username, password }) {
      if (fake) {
        // TODO
        // token per dirigente: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYyNDcxMDE1NSwianRpIjoiMTcxMDAwYjMtY2IzZC00YTlmLWE0ZDAtM2E1Y2ZiNTA3OWU1IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImRpcmlnZW50ZSIsIm5iZiI6MTYyNDcxMDE1NSwiZXhwIjoxNjI0NzExMDU1LCJvcmRpbmkiOnRydWUsImNsaWVudGkiOnRydWUsImFnZW50aSI6dHJ1ZX0.uLhzW5WpbpgTrnP4FJjwnvGtsF6EJjs-zepuEWbnYbE
      }
      Vue.http.post('/login', { username, password }).then(response => {
        context.commit('registerUser', { token: response.body?.access_token })
      })
    },
    loadCustomers(/*context*/) {
      return Vue.http.get('/customers').then(response => {
        console.log('response', response)
        // context.commit('registerCustomers', { customers: response.body })
        return response.body
      })
    },
    loadBrokers() {
      return Vue.http.get('/brokers').then(response => {
        return response.body
      })
    },
    loadBroker(ctx, { id }) {
      return Vue.http.get('/broker/' + id).then(response => {
        return response.body
      })
    },
    loadOrders() {
      return Vue.http.get('/orders').then(response => {
        return response.body
      })
    }

  }
})