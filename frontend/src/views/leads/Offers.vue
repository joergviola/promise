<template>
  <generic-list
    type="accounting"
    :detail="'offer'"
    :columns="columns"
    :with="w"
    :template="template"
    :query="query"
    createBy="button"
    :allowDelete="true"
  />
</template>

<script>
import GenericList from '@/components/generic/List'

export default {
  name: 'OfferList',
  components: { GenericList },
  props: ['id'],
  data() {
    return {
      template: { project_id: this.id, type: 'QUOTE', state: 'NEW', pricePerUnit: 100, percentBuffer: 15, rounding: "10" },
      query: { project_id: this.id, type: 'QUOTE' },
      w: { },
      type: 'accounting',
      columns: [
        { name: 'name', label: 'Name', editable: true, placeholder: "New Offer..." },
        { name: 'price', label: 'Price', editable: false },
        { name: 'state', label: 'State', editable: false },
        { name: 'approved_at', label: 'Approved', editable: false },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
