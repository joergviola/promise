<template>
  <generic-list
    type="position"
    :columns="columns"
    :with="w"
    :template="template"
    createBy="row"
    :allowDelete="true"
  />
</template>

<script>
import GenericList from '@/components/Generic/List'
import api from '@/api'

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
        { name: 'no', label: 'No', editable: true, placeholder: "New Position..."},
        { name: 'name', label: 'Name', editable: true },
        { name: 'comment', label: 'Comment', editable: true },
        { name: 'planned', label: 'Effort', editable: false },
        { name: 'price', label: 'Price', editable: false },
      ],
      planned: {}
    }
  }
}
</script>

<style scoped type="sass">
</style>
