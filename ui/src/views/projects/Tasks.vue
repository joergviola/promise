<template>
  <div>
    <el-row type="flex" class="row-bg" justify="end">
      <el-col :span="10">
        <el-form size="mini">
          <el-form-item label="Estimation for">
            <el-select v-model="offer">
              <el-option key="none" label="None" :value="null" />
              <el-option v-for="(o, i) in offers" :key="i" :label="o.name" :value="o.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <generic-list
      type="task"
      detail="/leads/lead"
      :columns="columns"
      :with="w"
      :template="template"
      createBy="row"
    />
  </div>
</template>

<script>
import GenericList from '@/components/Generic/List'
import api from '@/api'

export default {
  name: 'LeadTaskList',
  components: { GenericList },
  props: ['id'],
  data() {
    return {
      offer: null,
      offers: [],
      template: { project_id: this.id, state: 'NEW', type: "DEV", supplier: 'S'  },
      w: {  },
      type: 'task',
      columns: [
        { name: 'name', label: 'Name', editable: true, placeholder: "New Task..." },
        { name: 'position', label: 'Position', editable: true, placeholder: "Position" },
        { name: 'planned', label: 'Effort', editable: false, placeholder: "Hours" },
      ]
    }
  },
  async created() {
    this.offers = await api.find('accounting', {
      and: {project_id: this.id, state: 'NEW'}
    })
  }
}
</script>

<style scoped type="sass">
</style>
