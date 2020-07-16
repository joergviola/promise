<template>
  <div class="components-container">
    <gl-table
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
import GlTable from 'gluon-frontend/gl-table'

export default {
  name: 'UserList',
  components: { GlTable },
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
        { name: 'comment', type: 'textarea', editable: true, width: 200 },
      ],
      // filter: {
      //   search: [
      //     {name: 'customer.id'},
      //     {name: 'project.id'},
      //     {name: 'user.id'},
      //     {name: 'from'},
      //     {name: 'task.state'},
      //   ],
      //   group: [
      //     {name: 'date', select: {sum: 'used'}},
      //     {name: 'customer.name', select: ['min(date)', 'max(date)', 'sum(used)']},
      //     {name: 'project', select: ['project.name', {used: 'sum'}]},
      //     {name: 'user'},
      //     {name: 'task.state'},
      //   ]
      // },
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
