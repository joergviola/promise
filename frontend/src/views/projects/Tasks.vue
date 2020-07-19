<template>
  <div>
    <gl-table
      type="task"
      detail="task"
      :columns="columns"
      :with="w"
      :template="template"
      :query="query"
      createBy="row"
      :allowDelete="true"
      sort="sort_project"
      :groupBy="groupBys[groupBy]"
    >
      <el-radio-group v-model="groupBy" slot="header">
        <el-radio-button label="none">{{$t('ui.project.tasks.none')}}</el-radio-button>
        <el-radio-button label="category">{{$t('ui.project.tasks.category')}}</el-radio-button>
        <el-radio-button label="user">{{$t('ui.project.tasks.user')}}</el-radio-button>
        <el-radio-button label="state">{{$t('ui.project.tasks.state')}}</el-radio-button>
        <el-radio-button label="position">{{$t('ui.project.tasks.position')}}</el-radio-button>
      </el-radio-group>
    </gl-table>
  </div>
</template>

<script>
import glTable from 'gluon-frontend/gl-table'
import api from '@/api'

export default {
  name: 'ProjectTaskList',
  components: { glTable },
  props: ['id'],
  data() {
    return {
      allocations: [],
      template: { project_id: this.id, state: 'NEW', type: "DEV", supplier: 'S'  },
      w: {},
      query: { project_id: this.id, type: "DEV"  },
      type: 'task',
      groupBy: 'none',
    }
  },
  computed: {
    columns() {
      return [
        { name: 'name', label: 'Name', editable: true, placeholder: "New Task..." },
        { name: 'user_id', label: 'Responsible', editable: true, type: 'select', options: this.team, display: 'name', id: 'id', placeholder: 'New member...' },
        { name: 'due_at', label: 'Due', type: 'date', editable: true },
        { name: 'planned', label: 'Planned', editable: task=>task.position_id==null },
        { name: 'state', label: 'State' },
        { name: 'used', budget: 'planned', label: 'Progress', type: 'progress' },
      ]
    },
    groupBys() { 
      return {
        category: {field: 'category', reduce:[{name:'planned', method:'sum'}]},
        user: {field: 'user_id', type: 'select', options: this.team, display: 'name', id: 'id', reduce:[{name:'planned', method:'sum'}]},
        state: {field: 'state', type: 'select', options: ['NEW', 'APPROVED', 'PLANNED', 'STARTED', 'IMPLEMENTED', 'TESTED', 'DEPLOYED'], reduce:[{name:'planned', method:'sum'}]},
        position: {field: 'position', reduce:[{name:'planned', method:'sum'}]},
        none: null
      }
    },
    team() {
      return _.uniqBy(this.allocations.map(a => a.user), 'id')
    }
  },
  async mounted() {
    this.allocations = await api.find('allocation', {
      and: { project_id: this.id },
      with: { user: { one: 'users', this: 'user_id' }}
    })
  }
}
</script>

<style scoped type="sass">
</style>
