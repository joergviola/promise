<template>
  <div>
    <generic-list
      type="task"
      detail="/leads/lead"
      :columns="columns"
      :with="w"
      :template="template"
      createBy="row"
    />
  </div>
</template>

<script>
import GenericList from '@/components/Generic/List'
import api from '@/api'

export default {
  name: 'LeadTaskList',
  components: { GenericList },
  props: ['id'],
  data() {
    return {
      allocations: [],
      template: { project_id: this.id, state: 'NEW', type: "DEV", supplier: 'S'  },
      type: 'task',
    }
  },
  computed: {
    columns() {
      return [
        { name: 'name', label: 'Name', editable: true, placeholder: "New Task..." },
        { name: 'user_id', label: 'Responsible', editable: true, type: 'select', options: this.allocations, display: 'user.name', id: 'user.id', placeholder: 'New member...' },
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
