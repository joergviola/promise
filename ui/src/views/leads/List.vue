<template>
  <div class="components-container">
    <generic-list
      type="project"
      detail="/leads/lead"
      :columns="columns"
      :with="w"
      :template="template"
      createBy="button"
      :allow-delete=false
    />
  </div>
</template>

<script>
import GenericList from '@/components/Generic/List'

export default {
  name: 'LeadList',
  components: { GenericList },
  data() {
    return {
      template: { state: 'LEAD' },
      w: {
        customer: { one: 'organisation', 'this': 'customer_id' },
        last_offer: {
          one: 'accounting',
          this: 'id',
          that: 'project_id',
          query: {
            and: { type: 'QUOTE' },
            order: { id: 'DESC' }
          }
        },
      },
      type: 'project',
      columns: [
        { name: 'name', label: 'Name', editable: true },
        { name: 'customer.name', label: 'Customer', editable: false },
        { name: 'last_offer.price', label: 'Last Offer', editable: false },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
