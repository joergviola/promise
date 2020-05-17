<template>
  <div class="components-container">
    <gantt />
    <generic-list
      type="allocation"
      detail="/user"
      :columns="columns"
      :with="w"
      :template="template"
      create-by="button"
    />
  </div>
</template>

<script>
import GenericList from '@/components/generic/List'
import Gantt from '@/components/gantt/Index'

export default {
  name: 'UserList',
  components: { GenericList, Gantt },
  data() {
    return {
      template: {  },
      w: { 
        user: { one: 'users', this: 'user_id' },
        project: { one: 'project', query: {
          and: {state: {'<>': 'LEAD'}}
        } },
       },
      type: 'allocation',
      columns: [
        { name: 'user.name', label: 'User' },
        { name: 'from', label: 'From', type: 'date' },
        { name: 'to', label: 'To', type: 'date'},
        { name: 'type', label: 'Type' },
        { name: 'role', label: 'Role' },
        { name: 'project.name', label: 'Project' },
        { name: 'project.planned', label: 'Planned' },
        { name: 'parttime', label: 'Part' },
        { name: 'comment', label: 'Comment' },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
