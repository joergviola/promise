<template>
  <div class="components-container">
    <generic-list
      type="project"
      detail="/leads/lead"
      :query="query"
      :columns="columns"
      :with="w"
      :template="template"
      createBy="button"
      :allow-delete=false
    >
      <span slot="header">
          <el-select v-model="show" placeholder="Show..." @change="updateShow">
            <el-option value="OPEN" label="Open" />
            <el-option value="ACC" label="Accepted" />
            <el-option value="REJ" label="Rejected" />
            <el-option value="TMPL" label="Templates" />
          </el-select>
      </span>
    </generic-list>
  </div>
</template>

<script>
import GenericList from '@/components/generic/List'

export default {
  name: 'LeadList',
  components: { GenericList },
  data() {
    return {
      show: 'OPEN',
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
      query: {state: 'LEAD', template: false},
      type: 'project',
      columns: [
        { name: 'name', label: 'Name', editable: true },
        { name: 'customer.name', label: 'Customer', editable: false },
        { name: 'last_offer.price', label: 'Last Offer', editable: false },
      ]
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
    }
  }

}
</script>

<style scoped type="sass">
</style>
