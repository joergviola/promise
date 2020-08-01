<template>
  <div class="components-container">
    <gl-table
      type="project"
      detail="/leads/lead"
      :query="query"
      :columns="columns"
      :with="w"
      :template="template"
      createBy="none"
      :allow-delete=false
    >
      <span slot="header">
          <el-select v-if="admin" v-model="show" placeholder="Show..." @change="updateShow">
            <el-option value="OPEN" :label="$t('ui.leads.open')" />
            <el-option value="ACC" :label="$t('ui.leads.accepted')" />
            <el-option value="REJ" :label="$t('ui.leads.rejected')" />
            <el-option value="TMPL" :label="$t('ui.leads.template')" />
          </el-select>
      </span>
    </gl-table>
  </div>
</template>

<script>
import GlTable from 'gluon-frontend/gl-table'
import api from 'gluon-api'
import states from '@/util/states'

export default {
  name: 'LeadList',
  components: { GlTable },
  data() {
    return {
      show: 'OPEN',
      templates: [],
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
      query: {
        state: {in: states.project.filter(s=>s.lead).map(s=>s.state)}, 
        template: false
      },
      type: 'project',
      columns: [
        { name: 'name', editable: true },
        { name: 'customer.name' },
        { name: 'state'},
        { name: 'last_offer.price' },
      ]
    }
  },
  computed: {
    admin() {
      return api.userCan('project', ['CRUD', 'U'])
    }
  },
  methods: {
    updateShow() {
      switch (this.show) {
        case 'OPEN':
          this.query = {state: 'LEAD', template: false};
          break;
        case 'ACC':
          this.query = {state: 'ACCEPTED', template: false};
          break;
        case 'REJ':
          this.query = {state: 'REJECTED', template: false};
          break;
        case 'TMPL':
          this.query = {template: true};
          break;
      }
    },
  }
}
</script>

<style scoped type="sass">
</style>
