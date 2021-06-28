import LoginView from './login-view.mjs'
import OrdersView from './orders-view.mjs'
import CustomersView from './customers-view.mjs'
import AgentsView from './agents-view.mjs'
import store from './store.mjs'

window.agenti = [
  { "agent_code": "A007", "agent_name": "Ramasundar", "working_area": "Bangalore", "commission": "0.15", "phone_no": "077-25814763", "country": '' },
  { "agent_code": "A003", "agent_name": "Alex", "working_area": "London", "commission": "0.13", "phone_no": "075-12458969", "country": '' },
  { "agent_code": "A008", "agent_name": "Alford", "working_area": "New York", "commission": "0.12", "phone_no": "044-25874365", "country": '' },
  { "agent_code": "A011", "agent_name": "Ravi Kumar", "working_area": "Bangalore", "commission": "0.15", "phone_no": "077-45625874", "country": '' },
  { "agent_code": "A010", "agent_name": "Santakumar", "working_area": "Chennai", "commission": "0.14", "phone_no": "007-22388644", "country": '' },
  { "agent_code": "A012", "agent_name": "Lucida", "working_area": "San Jose", "commission": "0.12", "phone_no": "044-52981425", "country": '' },
  { "agent_code": "A005", "agent_name": "Anderson", "working_area": "Brisban", "commission": "0.13", "phone_no": "045-21447739", "country": '' },
  { "agent_code": "A001", "agent_name": "Subbarao", "working_area": "Bangalore", "commission": "0.14", "phone_no": "077-12346674", "country": '' },
  { "agent_code": "A002", "agent_name": "Mukesh", "working_area": "Mumbai", "commission": "0.11", "phone_no": "029-12358964", "country": '' },
  { "agent_code": "A006", "agent_name": "McDen", "working_area": "London", "commission": "0.15", "phone_no": "078-22255588", "country": '' },
  { "agent_code": "A004", "agent_name": "Ivan", "working_area": "Torento", "commission": "0.15", "phone_no": "008-22544166", "country": '' },
  { "agent_code": "A009", "agent_name": "Benjamin", "working_area": "Hampshair", "commission": "0.11", "phone_no": "008-22536178", "country": '' }
]
window.clienti = [
  { "cust_code": "C00013", "cust_name": "Holmes", "cust_city": "London", "working_area": "London", "cust_country": "UK", "grade": "2", "opening_amt": "6000.00", "receive_amt": "5000.00", "payment_amt": "7000.00", "outstanding_amt": "4000.00", "phone_no": "BBBBBBB", "agent_code": "A003" },
  { "cust_code": "C00001", "cust_name": "Micheal", "cust_city": "NewYork", "working_area": "NewYork", "cust_country": "USA", "grade": "2", "opening_amt": "3000.00", "receive_amt": "5000.00", "payment_amt": "2000.00", "outstanding_amt": "6000.00", "phone_no": "CCCCCCC", "agent_code": "A008" },
  { "cust_code": "C00020", "cust_name": "Albert", "cust_city": "NewYork", "working_area": "NewYork", "cust_country": "USA", "grade": "3", "opening_amt": "5000.00", "receive_amt": "7000.00", "payment_amt": "6000.00", "outstanding_amt": "6000.00", "phone_no": "BBBBSBB", "agent_code": "A008" },
  { "cust_code": "C00025", "cust_name": "Ravindran", "cust_city": "Bangalore", "working_area": "Bangalore", "cust_country": "India", "grade": "2", "opening_amt": "5000.00", "receive_amt": "7000.00", "payment_amt": "4000.00", "outstanding_amt": "8000.00", "phone_no": "AVAVAVA", "agent_code": "A011" },
  { "cust_code": "C00024", "cust_name": "Cook", "cust_city": "London", "working_area": "London", "cust_country": "UK", "grade": "2", "opening_amt": "4000.00", "receive_amt": "9000.00", "payment_amt": "7000.00", "outstanding_amt": "6000.00", "phone_no": "FSDDSDF", "agent_code": "A006" },
  { "cust_code": "C00015", "cust_name": "Stuart", "cust_city": "London", "working_area": "London", "cust_country": "UK", "grade": "1", "opening_amt": "6000.00", "receive_amt": "8000.00", "payment_amt": "3000.00", "outstanding_amt": "11000.00", "phone_no": "GFSGERS", "agent_code": "A003" },
  { "cust_code": "C00002", "cust_name": "Bolt", "cust_city": "NewYork", "working_area": "NewYork", "cust_country": "USA", "grade": "3", "opening_amt": "5000.00", "receive_amt": "7000.00", "payment_amt": "9000.00", "outstanding_amt": "3000.00", "phone_no": "DDNRDRH", "agent_code": "A008" },
  { "cust_code": "C00018", "cust_name": "Fleming", "cust_city": "Brisban", "working_area": "Brisban", "cust_country": "Australia", "grade": "2", "opening_amt": "7000.00", "receive_amt": "7000.00", "payment_amt": "9000.00", "outstanding_amt": "5000.00", "phone_no": "NHBGVFC", "agent_code": "A005" },
  { "cust_code": "C00021", "cust_name": "Jacks", "cust_city": "Brisban", "working_area": "Brisban", "cust_country": "Australia", "grade": "1", "opening_amt": "7000.00", "receive_amt": "7000.00", "payment_amt": "7000.00", "outstanding_amt": "7000.00", "phone_no": "WERTGDF", "agent_code": "A005" },
  { "cust_code": "C00019", "cust_name": "Yearannaidu", "cust_city": "Chennai", "working_area": "Chennai", "cust_country": "India", "grade": "1", "opening_amt": "8000.00", "receive_amt": "7000.00", "payment_amt": "7000.00", "outstanding_amt": "8000.00", "phone_no": "ZZZZBFV", "agent_code": "A010" },
  { "cust_code": "C00005", "cust_name": "Sasikant", "cust_city": "Mumbai", "working_area": "Mumbai", "cust_country": "India", "grade": "1", "opening_amt": "7000.00", "receive_amt": "11000.00", "payment_amt": "7000.00", "outstanding_amt": "11000.00", "phone_no": "147-25896312", "agent_code": "A002" },
  { "cust_code": "C00007", "cust_name": "Ramanathan", "cust_city": "Chennai", "working_area": "Chennai", "cust_country": "India", "grade": "1", "opening_amt": "7000.00", "receive_amt": "11000.00", "payment_amt": "9000.00", "outstanding_amt": "9000.00", "phone_no": "GHRDWSD", "agent_code": "A010" },
  { "cust_code": "C00022", "cust_name": "Avinash", "cust_city": "Mumbai", "working_area": "Mumbai", "cust_country": "India", "grade": "2", "opening_amt": "7000.00", "receive_amt": "11000.00", "payment_amt": "9000.00", "outstanding_amt": "9000.00", "phone_no": "113-12345678", "agent_code": "A002" },
  { "cust_code": "C00004", "cust_name": "Winston", "cust_city": "Brisban", "working_area": "Brisban", "cust_country": "Australia", "grade": "1", "opening_amt": "5000.00", "receive_amt": "8000.00", "payment_amt": "7000.00", "outstanding_amt": "6000.00", "phone_no": "AAAAAAA", "agent_code": "A005" },
  { "cust_code": "C00023", "cust_name": "Karl", "cust_city": "London", "working_area": "London", "cust_country": "UK", "grade": "0", "opening_amt": "4000.00", "receive_amt": "6000.00", "payment_amt": "7000.00", "outstanding_amt": "3000.00", "phone_no": "AAAABAA", "agent_code": "A006" },
  { "cust_code": "C00006", "cust_name": "Shilton", "cust_city": "Torento", "working_area": "Torento", "cust_country": "Canada", "grade": "1", "opening_amt": "10000.00", "receive_amt": "7000.00", "payment_amt": "6000.00", "outstanding_amt": "11000.00", "phone_no": "DDDDDDD", "agent_code": "A004" },
  { "cust_code": "C00010", "cust_name": "Charles", "cust_city": "Hampshair", "working_area": "Hampshair", "cust_country": "UK", "grade": "3", "opening_amt": "6000.00", "receive_amt": "4000.00", "payment_amt": "5000.00", "outstanding_amt": "5000.00", "phone_no": "MMMMMMM", "agent_code": "A009" },
  { "cust_code": "C00017", "cust_name": "Srinivas", "cust_city": "Bangalore", "working_area": "Bangalore", "cust_country": "India", "grade": "2", "opening_amt": "8000.00", "receive_amt": "4000.00", "payment_amt": "3000.00", "outstanding_amt": "9000.00", "phone_no": "AAAAAAB", "agent_code": "A007" },
  { "cust_code": "C00012", "cust_name": "Steven", "cust_city": "San Jose", "working_area": "San Jose", "cust_country": "USA", "grade": "1", "opening_amt": "5000.00", "receive_amt": "7000.00", "payment_amt": "9000.00", "outstanding_amt": "3000.00", "phone_no": "KRFYGJK", "agent_code": "A012" },
  { "cust_code": "C00008", "cust_name": "Karolina", "cust_city": "Torento", "working_area": "Torento", "cust_country": "Canada", "grade": "1", "opening_amt": "7000.00", "receive_amt": "7000.00", "payment_amt": "9000.00", "outstanding_amt": "5000.00", "phone_no": "HJKORED", "agent_code": "A004" },
  { "cust_code": "C00003", "cust_name": "Martin", "cust_city": "Torento", "working_area": "Torento", "cust_country": "Canada", "grade": "2", "opening_amt": "8000.00", "receive_amt": "7000.00", "payment_amt": "7000.00", "outstanding_amt": "8000.00", "phone_no": "MJYURFD", "agent_code": "A004" },
  { "cust_code": "C00009", "cust_name": "Ramesh", "cust_city": "Mumbai", "working_area": "Mumbai", "cust_country": "India", "grade": "3", "opening_amt": "8000.00", "receive_amt": "7000.00", "payment_amt": "3000.00", "outstanding_amt": "12000.00", "phone_no": "Phone No", "agent_code": "A002" },
  { "cust_code": "C00014", "cust_name": "Rangarappa", "cust_city": "Bangalore", "working_area": "Bangalore", "cust_country": "India", "grade": "2", "opening_amt": "8000.00", "receive_amt": "11000.00", "payment_amt": "7000.00", "outstanding_amt": "12000.00", "phone_no": "AAAATGF", "agent_code": "A001" },
  { "cust_code": "C00016", "cust_name": "Venkatpati", "cust_city": "Bangalore", "working_area": "Bangalore", "cust_country": "India", "grade": "2", "opening_amt": "8000.00", "receive_amt": "11000.00", "payment_amt": "7000.00", "outstanding_amt": "12000.00", "phone_no": "JRTVFDD", "agent_code": "A007" },
  { "cust_code": "C00011", "cust_name": "Sundariya", "cust_city": "Chennai", "working_area": "Chennai", "cust_country": "India", "grade": "3", "opening_amt": "7000.00", "receive_amt": "11000.00", "payment_amt": "7000.00", "outstanding_amt": "11000.00", "phone_no": "PPHGRTS", "agent_code": "A010" }
]
window.ordini = [
  { "ord_num": "200100", "ord_amount": "1000.00", "advance_amount": "600.00", "ord_date": "08/01/2008", "cust_code": "C00013", "agent_code": "A003", "order_description": "SOD" },
  { "ord_num": "200110", "ord_amount": "3000.00", "advance_amount": "500.00", "ord_date": "04/15/2008", "cust_code": "C00019", "agent_code": "A010", "order_description": "SOD" },
  { "ord_num": "200107", "ord_amount": "4500.00", "advance_amount": "900.00", "ord_date": "08/30/2008", "cust_code": "C00007", "agent_code": "A010", "order_description": "SOD" },
  { "ord_num": "200112", "ord_amount": "2000.00", "advance_amount": "400.00", "ord_date": "05/30/2008", "cust_code": "C00016", "agent_code": "A007", "order_description": "SOD" },
  { "ord_num": "200113", "ord_amount": "4000.00", "advance_amount": "600.00", "ord_date": "06/10/2008", "cust_code": "C00022", "agent_code": "A002", "order_description": "SOD" },
  { "ord_num": "200102", "ord_amount": "2000.00", "advance_amount": "300.00", "ord_date": "05/25/2008", "cust_code": "C00012", "agent_code": "A012", "order_description": "SOD" },
  { "ord_num": "200114", "ord_amount": "3500.00", "advance_amount": "2000.00", "ord_date": "08/15/2008", "cust_code": "C00002", "agent_code": "A008", "order_description": "SOD" },
  { "ord_num": "200122", "ord_amount": "2500.00", "advance_amount": "400.00", "ord_date": "09/16/2008", "cust_code": "C00003", "agent_code": "A004", "order_description": "SOD" },
  { "ord_num": "200118", "ord_amount": "500.00", "advance_amount": "100.00", "ord_date": "07/20/2008", "cust_code": "C00023", "agent_code": "A006", "order_description": "SOD" },
  { "ord_num": "200119", "ord_amount": "4000.00", "advance_amount": "700.00", "ord_date": "09/16/2008", "cust_code": "C00007", "agent_code": "A010", "order_description": "SOD" },
  { "ord_num": "200121", "ord_amount": "1500.00", "advance_amount": "600.00", "ord_date": "09/23/2008", "cust_code": "C00008", "agent_code": "A004", "order_description": "SOD" },
  { "ord_num": "200130", "ord_amount": "2500.00", "advance_amount": "400.00", "ord_date": "07/30/2008", "cust_code": "C00025", "agent_code": "A011", "order_description": "SOD" },
  { "ord_num": "200134", "ord_amount": "4200.00", "advance_amount": "1800.00", "ord_date": "09/25/2008", "cust_code": "C00004", "agent_code": "A005", "order_description": "SOD" },
  { "ord_num": "200108", "ord_amount": "4000.00", "advance_amount": "600.00", "ord_date": "02/15/2008", "cust_code": "C00008", "agent_code": "A004", "order_description": "SOD" },
  { "ord_num": "200103", "ord_amount": "1500.00", "advance_amount": "700.00", "ord_date": "05/15/2008", "cust_code": "C00021", "agent_code": "A005", "order_description": "SOD" },
  { "ord_num": "200105", "ord_amount": "2500.00", "advance_amount": "500.00", "ord_date": "07/18/2008", "cust_code": "C00025", "agent_code": "A011", "order_description": "SOD" },
  { "ord_num": "200109", "ord_amount": "3500.00", "advance_amount": "800.00", "ord_date": "07/30/2008", "cust_code": "C00011", "agent_code": "A010", "order_description": "SOD" },
  { "ord_num": "200101", "ord_amount": "3000.00", "advance_amount": "1000.00", "ord_date": "07/15/2008", "cust_code": "C00001", "agent_code": "A008", "order_description": "SOD" },
  { "ord_num": "200111", "ord_amount": "1000.00", "advance_amount": "300.00", "ord_date": "07/10/2008", "cust_code": "C00020", "agent_code": "A008", "order_description": "SOD" },
  { "ord_num": "200104", "ord_amount": "1500.00", "advance_amount": "500.00", "ord_date": "03/13/2008", "cust_code": "C00006", "agent_code": "A004", "order_description": "SOD" },
  { "ord_num": "200106", "ord_amount": "2500.00", "advance_amount": "700.00", "ord_date": "04/20/2008", "cust_code": "C00005", "agent_code": "A002", "order_description": "SOD" },
  { "ord_num": "200125", "ord_amount": "2000.00", "advance_amount": "600.00", "ord_date": "10/10/2008", "cust_code": "C00018", "agent_code": "A005", "order_description": "SOD" },
  { "ord_num": "200117", "ord_amount": "800.00", "advance_amount": "200.00", "ord_date": "10/20/2008", "cust_code": "C00014", "agent_code": "A001", "order_description": "SOD" },
  { "ord_num": "200123", "ord_amount": "500.00", "advance_amount": "100.00", "ord_date": "09/16/2008", "cust_code": "C00022", "agent_code": "A002", "order_description": "SOD" },
  { "ord_num": "200120", "ord_amount": "500.00", "advance_amount": "100.00", "ord_date": "07/20/2008", "cust_code": "C00009", "agent_code": "A002", "order_description": "SOD" },
  { "ord_num": "200116", "ord_amount": "500.00", "advance_amount": "100.00", "ord_date": "07/13/2008", "cust_code": "C00010", "agent_code": "A009", "order_description": "SOD" },
  { "ord_num": "200124", "ord_amount": "500.00", "advance_amount": "100.00", "ord_date": "06/20/2008", "cust_code": "C00017", "agent_code": "A007", "order_description": "SOD" },
  { "ord_num": "200126", "ord_amount": "500.00", "advance_amount": "100.00", "ord_date": "06/24/2008", "cust_code": "C00022", "agent_code": "A002", "order_description": "SOD" },
  { "ord_num": "200129", "ord_amount": "2500.00", "advance_amount": "500.00", "ord_date": "07/20/2008", "cust_code": "C00024", "agent_code": "A006", "order_description": "SOD" },
  { "ord_num": "200127", "ord_amount": "2500.00", "advance_amount": "400.00", "ord_date": "07/20/2008", "cust_code": "C00015", "agent_code": "A003", "order_description": "SOD" },
  { "ord_num": "200128", "ord_amount": "3500.00", "advance_amount": "1500.00", "ord_date": "07/20/2008", "cust_code": "C00009", "agent_code": "A002", "order_description": "SOD" },
  { "ord_num": "200135", "ord_amount": "2000.00", "advance_amount": "800.00", "ord_date": "09/16/2008", "cust_code": "C00007", "agent_code": "A010", "order_description": "SOD" },
  { "ord_num": "200131", "ord_amount": "900.00", "advance_amount": "150.00", "ord_date": "08/26/2008", "cust_code": "C00012", "agent_code": "A012", "order_description": "SOD" },
  { "ord_num": "200133", "ord_amount": "1200.00", "advance_amount": "400.00", "ord_date": "06/29/2008", "cust_code": "C00009", "agent_code": "A002", "order_description": "SOD" }
]

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

Vue.mixin({
  computed: {
    userToken () {
      return this.$store.state.userToken
    },
    userInfo() {
      return this.$store.getters.userInfo
    }
  }
})

const router = new VueRouter({
  routes: [
    {
      path: '/ordini', component: OrdersView, beforeEnter: (to, from, next) => {
        if (!store.getters.userInfo) { next('/accesso') } else { next() }
      } },
    {
      path: '/agenti', component: AgentsView, beforeEnter: (to, from, next) => {
        if (!store.getters.userInfo?.is_manager) { next('/accesso') } else { next() }
      } },
    {
      path: '/clienti', component: CustomersView, beforeEnter: (to, from, next) => {
        if (!(store.getters.userInfo?.is_agente || store.getters.userInfo?.is_manager)) { next('/accesso') } else { next() }
      }
    },
    { path: '/accesso', component: LoginView },
    { path: '/', component: CustomersView },
    { path: '*', redirect: '/' }
  ]
})

/*var app = */new Vue({
  // el: '#app',
  router,
  store,
  data() {
    return {
      test: 'Hello world!'
    }
  },
  methods: {},
  mounted () {
    this.tokenInterval = setInterval(() => {
      console.log('check token', this.userInfo && (this.userInfo.exp + 60) * 1000 < (new Date()).getTime())
      if (this.userInfo) {
        console.log(this.userInfo.exp, (this.userInfo.exp + 60) * 1000, (new Date()).getTime())
      }
      if (this.userInfo && (this.userInfo.exp + 60) * 1000 < (new Date()).getTime()) {
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
        this.$router.go('/accesso')
      }
    }
  }
}).$mount('#app')