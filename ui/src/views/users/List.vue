<template>
  <generic-list
    type="users"
    detail="/users"
    :columns="columns"
    :with="w"
    :template="template"
    create-by="button"
  />
</template>

<script>
import GenericList from '@/components/Generic/List'

export default {
  name: 'UserList',
  components: { GenericList },
  data() {
    return {
      template: {  },
      w: { },
      type: 'users',
      columns: [
        { name: 'name', label: 'Name', editable: true },
        { name: 'email', label: 'email', editable: true },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
