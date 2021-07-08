import LoginView from './login-view.mjs'
import OrdersView from './orders-view.mjs'
import CustomersView from './customers-view.mjs'
import AgentsView from './agents-view.mjs'
import store from './store.mjs'
import notifier from './notifier.mjs'
import ContactDialog from './contact-dialog.mjs'
const { PromiseDialogsWrapper, createPromiseDialog } = window.vuePromiseDialogs

// retry mechanism: https://gist.github.com/nivv/f41f2bb2486e8057cc0f5c931a67d7bc
// tabelle accessibili https://adrianroselli.com/2021/04/sortable-table-columns.html

window.currentFocusedElement = null
window.previousFocusedElement = null
document.body.addEventListener('focusin', evt => {
  window.previousFocusedElement = window.currentFocusedElement
  window.currentFocusedElement = evt.target
})

Vue.http.interceptors.push((request, next) => {
  if (store.state.userToken) {
    request.headers.set('Authorization', 'Bearer ' + store.state.userToken)
    request.headers.set('Accept', 'application/json')
  }

  next(response => {
    if (response.status === 401) {
      store.commit('doLogout')
    }
    /*//Check for expired token response, if expired, refresh token and resubmit original request
    if (response.headers('Authorization')) {
      var token = response.headers('Authorization');
      localStorage.setItem('id_token', token);
    }
    auth.checkExpiredToken(response, request).then(function (response) {
      return response;
    })*/
  })
})

const currencyFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0
})
Vue.filter('currency', function (value) {
  if (isNaN(value)) {
    return value
  }
  return currencyFormatter.format(value)
})

/* const dateFormatter = new Intl.DateTimeFormat('it-IT')
Vue.filter('date', function (value) {
  if (!value) {
    return value
  }
  console.log(value)
  return dateFormatter.format(value)
}) */
Vue.filter('date', function (value) {
  if (!value || value.length < 10) {
    return value
  }
  return `${value.substring(8,10)}/${value.substring(5,7)}/${value.substring(0,4)}`
})

Vue.directive('col-sortable', {
  inserted (el, binding, vnode) {
    el.className = vnode.context.classiOrdinamento(binding.value)
    vnode.context.$on('sorted', () => {
      el.className = vnode.context.classiOrdinamento(binding.value)
    })
    el.addEventListener('click', evt => {
      evt.stopImmediatePropagation()
      evt.preventDefault()
      vnode.context.ordinaPerCol(binding.value)
      vnode.context.$emit('sorted')
    })
  }
})

let internalBus = new Vue()

/* Utilities varie valide un po' per tutti */
const contactDialog = createPromiseDialog(ContactDialog)
Vue.mixin({
  data () {
    return {
      internalBus
    }
  },
  computed: {
    userToken () {
      return this.$store.state.userToken
    },
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    openAgentInfo(id) {
      this.$store.dispatch({ type: "loadAgent", id }).then(response => {
        contactDialog({
          typeLabel: 'Agente',
          code: response.agent_code,
          name: response.agent_name,
          phone: response.phone_no
        })
      })
    },
    openCustomerInfo(id) {
      this.$store.dispatch({ type: "loadCustomer", id }).then(response => {
        contactDialog({
          typeLabel: 'Cliente',
          code: response.cust_code,
          name: response.cust_name,
          phone: response.phone_no
        })
      })
    }
  }
})

const router = new VueRouter({
  routes: [
    {
      path: '/ordini', component: OrdersView, beforeEnter: (to, from, next) => {
        if (!store.getters.userInfo) { next('/accesso') } else { next() }
      }
    },
    {
      path: '/agenti', component: AgentsView, beforeEnter: (to, from, next) => {
        if (!store.getters.userInfo?.is_manager) { next('/accesso') } else { next() }
      }
    },
    {
      path: '/clienti', component: CustomersView, beforeEnter: (to, from, next) => {
        if (!(store.getters.userInfo?.is_agent || store.getters.userInfo?.is_manager)) { next('/accesso') } else { next() }
      }
    },
    { path: '/accesso', component: LoginView },
    // { path: '/', component: OrdersView },
    { path: '*', redirect: '/accesso' }
  ]
})

/*var app = */new Vue({
  // el: '#app',
  router,
  store,
  components: { PromiseDialogsWrapper, notifier },
  methods: {
    logout () {
      this.$store.commit('doLogout')
      this.internalBus.$emit('notify', {
        text: 'Utente disconnesso con successo',
        type: 'success'
      })
    }
  },
  mounted () {
    this.tokenInterval = setInterval(() => {
      /* console.log('check token', this.userInfo && (this.userInfo.exp - 60) * 1000 < (new Date()).getTime())
      if (this.userInfo) {
        console.log((this.userInfo.exp - (new Date()).getTime() / 1000) + ' secs', this.userInfo.exp, (this.userInfo.exp - 60) * 1000, (new Date()).getTime())
      } */
      if (this.userInfo && (this.userInfo.exp - 60) * 1000 < (new Date()).getTime()) {
        this.$store.dispatch('refreshToken')
      }
    }, 20000)
  },
  beforeDestroy () {
    clearInterval(this.tokenInterval)
  },
  watch: {
    userToken (newV) {
      if (!newV) {
        this.$router.push('/accesso')
      }
    }
  }
}).$mount('#app')