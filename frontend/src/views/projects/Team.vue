<template>
  <gl-table
    type="allocation"
    :columns="columns"
    :with="w"
    :template="template"
    createBy="row"
    :allowDelete="true"
  />
</template>

<script>
import GlTable from 'gluon-frontend/gl-table'
import api from '@/api'

export default {
  name: 'ProjectAllocationList',
  components: { GlTable },
  props: ['id'],
  data() {
    return {
      template: { project_id: this.id, type: 'PROJECT' },
      w: { },
      type: 'allocation',
      users: [],
      columns: [],
      roles: ['Sales', 'Mgmt', 'Dev', 'QA', 'Customer']
    }
  },
  async created() {
    const project = await api.get('project', this.id)
    this.users = await api.find('users', {
      and: {organisation_id: {in: [api.user().organisation_id, project.customer_id]}}
    })
    this.columns = [
        { name: 'user_id', label: 'Responsible', editable: true, type: 'select', options: this.users, display: 'name', id: 'id' },
        { name: 'role', label: 'Role', editable: true, type: 'select', options: this.roles },
        { name: 'parttime', label: 'Part[%]', editable: true, postfix: '%' },
        { name: 'from', label: 'From', editable: true, type: 'date' },
        { name: 'to', label: 'To', editable: true, type: 'date' },
        { name: 'comment', label: 'Comment', editable: true },
    ]
  }

}
</script>

<style scoped type="sass">
</style>
