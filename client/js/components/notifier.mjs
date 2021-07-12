export default {
  name: 'Notifier',
  template: '#NotifierTemplate',
  data () {
    return {
      notifications: []
    }
  },
  computed: {
    
  },
  methods: {
    close (id) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    }
  },
  mounted () {
    setInterval (() => {
      let time = new Date().getTime()
      this.notifications = this.notifications.filter(n => n.removeAt > time)
      
    }, 1000)
    this.internalBus.$on('notify', notification => {
      if (notification.id) {
        this.close(notification.id)
      }
      let removeAt = null
      if (notification.type === 'error') {
        removeAt = Infinity
      } else {
        removeAt = new Date().getTime() + 5000
      }
      notification = Object.assign({
        id: Math.random(),
        type: null,
        removeAt
      }, notification)
      this.notifications.push(notification)
    })
  }
}