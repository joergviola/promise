
import api from '@/api'

export default {
  data() {
    return {
      list: null,
      loading: true,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      this.list = await api.find(this.type, {
        and: [this.template],
        with: this.with
      })
      if (this.createBy !== 'button') {
        this.list.push(Object.assign({}, this.template))
      }
      this.loading = false
    },
    async save(row, attr) {
      if (!row.id) return
      const data = {}
      data[attr] = row[attr]
      await api.update(this.type, row.id, data)
    },
    async create(row) {
      try {
        const result = await api.create(this.type, row)
        row.id = result.id
        if (this.createBy !== 'button') {
          this.list.push(Object.assign({}, this.template))
        }
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 5000
        })
      }
    }
  }
}
