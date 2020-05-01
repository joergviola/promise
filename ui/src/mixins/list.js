
import api from '@/api'

export default {
  data() {
    return {
      list: null,
      loading: true,
      template: { state: 'LEAD' },
      with: {customer: {one:'customer', 'this': 'customer_id'}},
      type: 'project',
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
      this.loading = false
    },
    async save(row, attr) {
      const data = {}
      data[attr] = row[attr]
      await api.update(this.type, row.id, data)
    }
  }
}
