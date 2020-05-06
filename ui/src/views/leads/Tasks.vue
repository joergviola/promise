<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-button class="filter-item pull-right" :disabled="selectedTasks.length==0" type="primary" @click="remove(row)">
          New offer
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">>
      <el-table-column type="selection" />

      <el-table-column label="Name">
        <template slot-scope="{row}">
          <el-input class="no-border" v-model="row.name" @blur="save(row, 'name')" placeholder="New task..." />
        </template>
      </el-table-column>

      <el-table-column label="Position">
        <template slot-scope="{row}">
          <el-input class="no-border" v-model="row.position" @blur="save(row, 'position')" />
        </template>
      </el-table-column>

      <el-table-column label="Planned" prop="planned" />

      <el-table-column label="Estimation" >
        <template slot-scope="{row}">
          <el-input v-if="row.id" class="no-border" v-model="row.estimation.planned" @blur="saveEstimation(row, 'planned')" placeholder="Your estimation..." />
        </template>
      </el-table-column>

      <el-table-column label="Risk">
        <template slot-scope="{row}">
          <el-input v-if="row.id" class="no-border" v-model="row.estimation.risk" @blur="saveEstimation(row, 'risk')" placeholder="Risk" />
        </template>
      </el-table-column>

      <el-table-column label="Comment">
        <template slot-scope="{row}">
          <el-input v-if="row.id" class="no-border" v-model="row.estimation.comment" @blur="saveEstimation(row, 'comment')" placeholder="Comment" />
        </template>
      </el-table-column>

      <el-table-column align="right" label="Actions" fixed="right">
        <template slot-scope="{row}">
          <el-button v-if="row.id" class="filter-item pull-right" type="danger" icon="el-icon-remove" @click="remove(row)">
          </el-button>
          <el-button v-if="!row.id" class="filter-item pull-right" type="primary" icon="el-icon-plus" @click="createWithEstimation(row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import list from '@/mixins/list'
import api from '@/api'
import { mapGetters } from 'vuex'

export default {
  name: 'LeadTaskList',
  mixins: [list],
  props: ['id'],
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  watch: {
    list() {
      this.list.forEach(task => {
        if (!task.estimation) task.estimation = { project_id: this.id, task_id: task.id, user_id: this.user.id }
      });
    }
  },
  data() {
    return {
      type: 'task',
      template: { project_id: this.id, state: 'NEW', type: 'DEV' },
      query: { project_id: this.id, type: 'DEV' },
      with: {
        estimation: {
          one: 'estimation',
          this: 'id',
          that: 'task_id',
          query: { and: { user_id: 1 } }
        }
      },
      loading: false,
      list: [],
      selectedTasks: [],
    }
  },
  methods: {
    async createWithEstimation(row) {
      await this.create(row)
      row.estimation = { project_id: this.id, task_id: row.id, user_id: this.user.id }
    },
    async saveEstimation(task, attr) {
      if (!task.estimation.id) {
        task.estimation.task_id = task.id
        task.estimation.user_id = this.user.id
        const result = await api.create('estimation', task.estimation)
        task.estimation.id = result.id
      } else {
        // Wenn null, wird das nicht in data übernommen ???!
        task.estimation[attr] = task.estimation[attr] || ''
        const data = {}
        data[attr] = task.estimation[attr]
        await api.update('estimation', task.estimation.id, data)
      }
      const changed = await api.get('task', task.id)
      task.planned = changed.planned
    },
    handleSelectionChange(val) {
      this.selectedTasks = val.map(v => v.id);
    }

  }
}
</script>

<style scoped type="sass">
</style>
