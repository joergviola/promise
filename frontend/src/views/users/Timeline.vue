<template>
  <div class="components-container">
    <generic-list
      type="action"
      detail="/user"
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
  props: ['id'],
  data() {
    return {
      template: {  },
      query: { user_id: this.id },
      w: { 
        user: { one: 'users', this: 'user_id' },
        project: { one: 'project'},
        task: { one: 'task'},
       },
      columns: [
        { name: 'user.name', label: 'User' },
        { name: 'project.name', label: 'Project' },
        { name: 'task.name', label: 'Task' },
        { name: 'from', label: 'Started', type: 'datetime', editable: true, width: 180 },
        { name: 'used', label: 'Duration', editable: true },
        { name: 'comment', label: 'Comment', editable: true, width: 500 },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
