<template>
  <generic-list
    type="position"
    :columns="columns"
    :with="w"
    :template="template"
    createBy="row"
  />
</template>

<script>
import GenericList from '@/components/Generic/List'

export default {
  name: 'OfferPositionList',
  components: { GenericList },
  props: ['id', 'oid'],
  data() {
    return {
      template: { accounting_id: this.oid  },
      w: { },
      type: 'position',
      columns: [
        { name: 'comment', label: 'Comment', editable: true, placeholder: "New Position..." },
        { name: 'planned', label: 'Effort', editable: false },
        { name: 'price', label: 'Price', editable: false },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
