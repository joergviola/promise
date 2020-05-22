<template>
  <div class="components-container">
    <generic-list
      type="allocation"
      :columns="columns"
      :with="w"
      :order="order"
      :template="template"
      :query="query"
      :allowDelete="true"
    />
  </div>
</template>

<script>
import GenericList from '@/components/generic/List'

export default {
  name: 'UserList',
  components: { GenericList },
  props: ['id', 'user', 'types'],
  data() {
    return {
      w: { },
      order: {from: 'DESC'},
      baseColumns: [
        { name: 'from', label: 'From', type: 'date', editable: true, width: 100 },
        { name: 'to', label: 'To', type: 'date', editable: true, width: 100 },
      ]
    }
  },
  computed: {
    columns() {
      let additional = []
      switch(this.types[0]) {
        case 'CONTRACT':
          additional = [
            { name: 'salary', label: 'Salary', editable: true },
            { name: 'parttime', label: 'Percent', editable: true },
          ]
          break;
        case 'HOLIDAY':
          additional = [
            { name: 'type', label: 'Type', type:'select', editable: true, options: this.types },
          ]
          break;
      }
      additional.push({ name: 'comment', label: 'Comment', editable: true, width: 300 })
      return this.baseColumns.concat(additional)
    },
    template() {
      return { user_id: this.user.id, type: this.types[0], role: 'NONE' }
    },
    query() {
      return { 
        user_id: this.user.id,
        type: {'in': this.types}
      }
    },

  }

}
</script>

<style scoped type="sass">
</style>
