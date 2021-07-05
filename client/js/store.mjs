const fake = false

export default new Vuex.Store({
  state: {
    userToken: localStorage.getItem('user_token'),
    // customers: []
  },
  getters: {
    userInfo: state => {
      if (!state.userToken) {
        return null
      }
      var base64Url = state.userToken.split('.')[1]
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))

      return JSON.parse(jsonPayload)
    }
  },
  mutations: {
    registerUser (state, { token }) {
      state.userToken = token
      localStorage.setItem('user_token', token)
    },
    doLogout (state) {
      state.userToken = null
      localStorage.removeItem('user_token')
      console.log('logout done')
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
    refreshToken () {
      Vue.http.post('/refreshtoken').then(response => {
        context.commit('registerUser', { token: response.body?.access_token })
      })
    },
    loadCustomers(/*context*/) {
      return Vue.http.get('/customers').then(response => {
        // context.commit('registerCustomers', { customers: response.body })
        return response.body
      })
    },
    loadCustomersResume () {
      return Vue.http.get('/customers-resume').then(response => {
        return response.body
      })
    },
    loadCustomer(ctx, { id }) {
      return Vue.http.get('/customer/' + id).then(response => {
        return response.body
      })
    },
    loadAgents() {
      return Vue.http.get('/agents').then(response => {
        return response.body
      })
    },
    loadAgent(ctx, { id }) {
      return Vue.http.get('/agent/' + id).then(response => {
        return response.body
      })
    },
    loadOrders() {
      return Vue.http.get('/orders').then(response => {
        return response.body
      })
    },
    deleteOrder (ctx, id) {
      return Vue.http.delete('/order/' + id).then(response => {
        return response.body
      })
    },
    updateOrder (ctx, order) {
      return Vue.http.put('/order/' + order.ord_num, order).then(response => {
        return response.body
      })
    },
    createOrder(ctx, order) {
      return Vue.http.post('/order', order).then(response => {
        return response.body
      })
    }

  }
})