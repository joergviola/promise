<template>
  <div class="components-container">
    <gl-table
      type="project"
      detail="/projects/project"
      :columns="columns"
      :query="query"
      :with="w"
      :template="template"
      createBy="button"
    >
      <span slot="header">
        <el-select v-model="show" placeholder="Show...">
          <el-option value="ACCEPTED" :label="$t('ui.project.accepted')" />
          <el-option value="MAINTENANCE" :label="$t('ui.project.maintenance')" />
          <el-option value="CLOSED" :label="$t('ui.project.closed')" />
        </el-select>
      </span>
    </gl-table>
  </div>
</template>

<script>
import GlTable from 'gluon-frontend/gl-table'

export default {
  name: 'ProjectList',
  components: { GlTable },
  data() {
    return {
      show: 'ACCEPTED',
      template: { state: 'ACCEPTED' },
      w: { customer: { one: 'organisation', 'this': 'customer_id' }},
      type: 'project',
      columns: [
        { name: 'name' },
        { name: 'customer.name' },
        { name: 'planned' },
        { name: 'used', budget: 'planned', type: 'progress' },
      ]
    }
  },
  computed: {
    query() {
      return { state: this.show }
    }
  },
}
</script>

<style scoped type="sass">
</style>
