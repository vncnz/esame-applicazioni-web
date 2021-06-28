export default {
  name: 'SortableMixin',
  data() {
    return {
      results: [],
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
    sortedResults () {
      if (this.sortedBy) {
        const results = this.results.slice()
        results.sort(this.sortingFunction)
        return results
      }
      return this.results
    }
  }
}