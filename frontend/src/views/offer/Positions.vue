<template>
  <generic-list
    type="position"
    :columns="columns"
    :with="w"
    :template="template"
    createBy="row"
    :allowDelete="true"
    sort="no"
  />
</template>

<script>
import GenericList from '@/components/generic/List'
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
        { name: 'no', label: 'No', width: 40, placeholder: "New Position..."},
        { name: 'name', label: 'Name', editable: true },
        { name: 'comment', type: 'textarea', label: 'Comment', editable: true, width: 200 },
        { name: 'planned', label: 'Effort', editable: false },
        { name: 'price', label: 'Price', editable: false },
        { name: 'optional', type: 'checkbox', label: 'Optional', editable: true },
        { name: 'accepted', type: 'checkbox', label: 'Accepted', editable: row => row.optional },
      ],
      planned: {}
    }
  }
}
</script>

<style scoped type="sass">
</style>
