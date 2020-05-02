<template>
  <generic-list
    type="task"
    detail="/leads/lead"
    :columns="columns"
    :with="w"
    :template="template"
    createBy="row"
  />
</template>

<script>
import GenericList from '@/components/Generic/List'

export default {
  name: 'LeadTaskList',
  components: { GenericList },
  props: ['id'],
  data() {
    return {
      template: { project_id: this.id, state: 'NEW', type: "DEV", supplier: 'S'  },
      w: { },
      type: 'task',
      columns: [
        { name: 'name', label: 'Name', editable: true, placeholder: "New Task..." },
        { name: 'planned', label: 'Effort', editable: false, placeholder: "Hours" },
      ]
    }
  }

}
</script>

<style scoped type="sass">
</style>
