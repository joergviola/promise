<template>
  <div class="components-container">
    <generic-list
      type="users"
      detail="/users"
      :columns="columns"
      :with="w"
      :template="template"
      create-by="button"
      :allowDelete="true"
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
        organisation: { one: 'organisation' },
        role: { one: 'role' },
      },
      type: 'users',
      columns: [
        { name: 'name', label: 'Name', editable: true },
        { name: 'email', label: 'E-mail', editable: true },
        { name: 'organisation.name', label: 'Company' },
        { name: 'role.name', label: 'Role' },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
