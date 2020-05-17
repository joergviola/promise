<template>
  <div class="components-container">
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

export default {
  name: 'UserList',
  components: { GenericList },
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
        { name: 'project.name', label: 'Project' },
        { name: 'project.planned', label: 'Planned' },
        { name: 'role', label: 'Role' },
        { name: 'parttime', label: 'Part' },
        { name: 'comment', label: 'Comment' },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
