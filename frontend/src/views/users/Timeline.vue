<template>
  <div class="components-container">
    <generic-list
      type="action"
      :columns="columns"
      :with="w"
      :template="template"
      :query="query"
      :allowDelete="true"
    />
  </div>
</template>

<script>
import GenericList from '@/components/generic/List'

export default {
  name: 'UserList',
  components: { GenericList },
  props: ['user'],
  data() {
    return {
      template: {  },
      w: { 
        project: { one: 'project'},
        task: { one: 'task'},
       },
      columns: [
        { name: 'project.name', label: 'Project' },
        { name: 'task.name', label: 'Task', width: 200 },
        { name: 'from', label: 'Started', type: 'datetime', editable: true, width: 180 },
        { name: 'used', label: 'Duration', editable: true },
        { name: 'comment', label: 'Comment', editable: true, width: 200 },
      ]
    }
  },
  computed: {
      query() {
        return { user_id: this.user.id }
      }
  }
}
</script>

<style scoped type="sass">
</style>
