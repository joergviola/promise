<template>
  <div class="components-container">
    <generic-list
      type="users"
      detail="/users"
      :columns="columns"
      :query="query"
      :with="w"
      :template="template"
      create-by="button"
      :allowDelete="true"
    />
  </div>
</template>

<script>
import GenericList from '@/components/generic/List'
import api from '@/api'

export default {
  name: 'UserList',
  components: { GenericList },
  data() {
    return {
      template: {  },
      w: { 
        role: { one: 'role' },
      },
      query: { organisation_id: api.user().organisation_id },
      type: 'users',
      columns: [
        { name: 'name', label: 'Name', editable: true },
        { name: 'email', label: 'E-mail', editable: true },
        { name: 'role.name', label: 'Role' },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
