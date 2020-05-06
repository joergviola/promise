<template>
  <generic-list
    type="accounting"
    :detail="'offer'"
    :columns="columns"
    :with="w"
    :template="template"
    createBy="button"
  />
</template>

<script>
import GenericList from '@/components/Generic/List'

export default {
  name: 'OfferList',
  components: { GenericList },
  props: ['id'],
  data() {
    return {
      template: { project_id: this.id, type: 'QUOTE', state: 'NEW', pricePerUnit: 100, percentBuffer: 15, rounding: "10" },
      w: { },
      type: 'accounting',
      columns: [
        { name: 'name', label: 'Name', editable: true, placeholder: "New Offer..." },
        { name: 'price', label: 'Price', editable: false },
        { name: 'state', label: 'State', editable: false },
        { name: 'approved_at', label: 'Approved', editable: false },
        { name: 'accepted_at', label: 'Accepted', editable: false },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
