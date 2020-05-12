<template>
  <div class="components-container">
    <generic-list
      type="project"
      detail="/projects/project"
      :columns="columns"
      :with="w"
      :template="template"
      createBy="button"
    />
  </div>
</template>

<script>
import GenericList from '@/components/Generic/List'

export default {
  name: 'ProjectList',
  components: { GenericList },
  data() {
    return {
      template: { state: 'ACCEPTED' },
      w: { customer: { one: 'organisation', 'this': 'customer_id' }},
      type: 'project',
      columns: [
        { name: 'name', label: 'Name', editable: true },
        { name: 'customer.name', label: 'Customer' },
        { name: 'state', label: 'State' },
        { name: 'used', budget: 'planned', label: 'Progress', type: 'progress' },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
