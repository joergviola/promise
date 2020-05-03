<template>
  <generic-list
    type="project"
    detail="/projects/project"
    :columns="columns"
    :with="w"
    :template="template"
    createBy="button"
  />
</template>

<script>
import GenericList from '@/components/Generic/List'

export default {
  name: 'ProjectList',
  components: { GenericList },
  data() {
    return {
      template: { state: 'ACCEPTED' },
      w: { customer: { one: 'customer', 'this': 'customer_id' }},
      type: 'project',
      columns: [
        { name: 'name', label: 'Name', editable: true },
        { name: 'customer.name', label: 'Customer' },
        { name: 'state', label: 'State' },
        { name: 'planned', label: 'Planned' },
        { name: 'used', label: 'Used' },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
