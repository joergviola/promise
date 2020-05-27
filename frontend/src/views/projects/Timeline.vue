<template>
  <div class="components-container">
    <generic-list
      type="action"
      detail="/user"
      :columns="columns"
      :with="w"
      :template="template"
      :query="query"
    />
  </div>
</template>

<script>
import GenericList from '@/components/generic/List'

export default {
  name: 'ProjectTimeline',
  components: { GenericList },
  props: ['id'],
  data() {
    return {
      template: {  },
      w: { 
        user: { one: 'users', this: 'user_id'},
        task: { one: 'task'},
      },
      columns: [
        { name: 'user.name', label: 'User' },
        { name: 'task.name', label: 'Task', width: 200 },
        { name: 'from', label: 'Started', type: 'datetime', editable: true, width: 180 },
        { name: 'used', label: 'Duration', editable: true },
        { name: 'comment', label: 'Comment', editable: true, width: 200 },
      ]
    }
  },
  computed: {
      query() {
        return { project_id: this.id }
      }
  }
}
</script>

<style scoped type="sass">
</style>
