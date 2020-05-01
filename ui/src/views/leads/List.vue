<template>
  <generic-list
    type="project"
    detail="/leads/lead"
    :columns="columns"
    :with="w"
    :template="template"
    createBy="button"
  />
</template>

<script>
import GenericList from '@/components/Generic/List'

export default {
  name: 'LeadList',
  components: { GenericList },
  data() {
    return {
      template: { state: 'LEAD' },
      w: { customer: { one: 'customer', 'this': 'customer_id' }},
      type: 'project',
      columns: [
        { name: 'name', label: 'Name', editable: true },
        { name: 'customer.name', label: 'Customer', editable: false },
        { name: 'state', label: 'State', editable: true },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
