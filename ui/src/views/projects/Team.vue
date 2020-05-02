<template>
  <generic-list
    type="allocation"
    :columns="columns"
    :with="w"
    :template="template"
    createBy="row"
  />
</template>

<script>
import GenericList from '@/components/Generic/List'
import api from '@/api'

export default {
  name: 'ProjectAllocationList',
  components: { GenericList },
  props: ['id'],
  data() {
    return {
      template: { project_id: this.id, type: 'PROJECT' },
      w: { },
      type: 'allocation',
      users: [],
      roles: ['Sales', 'Mgmt', 'Dev', 'QA', 'Customer']
    }
  },
  computed: {
    columns() {
      return [
        { name: 'user_id', label: 'Responsible', editable: true, type: 'select', options: this.users, display: 'name', id: 'id' },
        { name: 'role', label: 'Role', editable: true, type: 'select', options: this.roles },
        { name: 'parttime', label: 'Part[%]', editable: true, postfix: '%' },
        { name: 'from', label: 'From', editable: true, type: 'date' },
        { name: 'to', label: 'To', editable: true, type: 'date' },
        { name: 'comment', label: 'Comment', editable: true },
      ]
    }
  },
  async created() {
    this.users = await api.find('users', {})
  }

}
</script>

<style scoped type="sass">
</style>
