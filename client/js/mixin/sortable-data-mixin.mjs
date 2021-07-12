export default {
  name: 'SortableMixin',
  data() {
    return {
      // datalist: [],
      sortedBy: '',
      sortedAsc: true
    }
  },
  computed: {
    /*results () {
      return []
    },*/
    sortingFunction () {
      return this.sortedAsc ?
        ((a, b) => a[this.sortedBy] > b[this.sortedBy] ? 1 : -1) :
        ((a, b) => a[this.sortedBy] < b[this.sortedBy] ? 1 : -1)
    },
    sortedDatalist () {
      if (this.sortedBy) {
        const results = this.datalist.slice()
        results.sort(this.sortingFunction)
        return results
      }
      return this.datalist
    }
  },
  methods: {
    setSorting(col) {
      if (this.sortedBy === col) {
        this.sortedAsc = !this.sortedAsc
      } else {
        this.sortedBy = col
        this.sortedAsc = true
      }
      this.$router.replace({ query: { ...this.$route.query, sortedby: this.sortedBy, sortedasc: this.sortedAsc }})
    }
  },
  mounted () {
    if (this.$route.query) {
      if (this.$route.query.sortedasc !== undefined) {
        this.sortedAsc = this.$route.query.sortedasc
      }
      if (this.$route.query.sortedby) {
        this.sortedBy = this.$route.query.sortedby
      }
    }
  }
}