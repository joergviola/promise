<template>
  <div class="components-container">
    <generic-list
      type="users"
      detail="/users"
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
      w: { organisation: { one: 'organisation' } },
      type: 'users',
      columns: [
        { name: 'name', label: 'Name', editable: true },
        { name: 'email', label: 'E-mail', editable: true },
        { name: 'organisation.name', label: 'Company' },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
