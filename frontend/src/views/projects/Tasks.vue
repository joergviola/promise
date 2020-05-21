<template>
  <div>
    <generic-list
      type="task"
      detail="task"
      :columns="columns"
      :with="w"
      :template="template"
      :query="query"
      createBy="row"
    />
  </div>
</template>

<script>
import GenericList from '@/components/generic/List'
import api from '@/api'

export default {
  name: 'ProjetTaskList',
  components: { GenericList },
  props: ['id'],
  data() {
    return {
      allocations: [],
      template: { project_id: this.id, state: 'NEW', type: "DEV", supplier: 'S'  },
      w: {},
      query: { project_id: this.id, type: "DEV"  },
      type: 'task',
    }
  },
  computed: {
    columns() {
      return [
        { name: 'name', label: 'Name', editable: true, placeholder: "New Task..." },
        { name: 'user_id', label: 'Responsible', editable: true, type: 'select', options: this.allocations, display: 'user.name', id: 'user.id', placeholder: 'New member...' },
        { name: 'due_at', label: 'Due', type: 'date', editable: true },
        { name: 'state', label: 'State' },
        { name: 'used', budget: 'planned', label: 'Progress', type: 'progress' },
      ]
    }
  },
  async created() {
    this.allocations = await api.find('allocation', {
      and: { project_id: this.id },
      with: { user: { one: 'users', this: 'user_id' }}
    })
  }
}
</script>

<style scoped type="sass">
</style>
