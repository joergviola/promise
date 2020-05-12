<template>
  <div class="components-container">
    <h2>Welcome, {{user.name}}</h2>
    <el-row>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            Your tasks
          </div>
          <generic-list
            type="task"
            :columns="columns"
            :with="w"
            :query="query"
            create-by="row"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GenericList from '@/components/Generic/List'

export default {
  name: 'Dashboard',
  components: { GenericList },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  data() {
    console.log('XXX', 'data', this.user)
    return {
      query: { user_id: 1, state: 'APPROVED' },
      w: {
        project: { one: 'project' }
      },
      type: 'task',
      columns: [
        { name: 'name', label: 'Name', editable: true, placeholder: "New Task..." },
        { name: 'project.name', label: 'Project' },
        { name: 'used', label: 'Planned', type: 'progress', budget: 'planned' },
      ]
    }
  },
}
</script>
