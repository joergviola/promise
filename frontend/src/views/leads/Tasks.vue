<template>
  <div>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">>
      <el-table-column type="selection" />

      <el-table-column label="Name">
        <template slot-scope="{row, $index}">
          <el-input
            class="no-border"
            v-model="row.name"
            @blur="save(row, 'name')"
            placeholder="New task..."
            :ref="`field-${$index}-0`"
            @keyup.enter.native="onEnter(row, 0, $index)"
            @keyup.up.native="onArrow(0, $index, -1)"
            @keyup.down.native="onArrow(0, $index, +1)"
          />
        </template>
      </el-table-column>

      <el-table-column label="Position">
        <template slot-scope="{row, $index}">
          <el-select class="no-border" v-model="row.position" filterable allow-create @change="save(row, 'position')" >
            <el-option v-for="(name, i) in positionNames" :value="name" :key="i" :label="name" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="Planned" prop="planned" />

      <el-table-column label="Estimation" >
        <template slot-scope="{row, $index}">
          <el-input
            v-if="row.id"
            class="no-border"
            v-model="row.estimation.planned"
            @blur="saveEstimation(row, 'planned')"
            placeholder="Your estimation..."
            :ref="`field-${$index}-3`"
            @keyup.enter.native="onEnter(row, 3, $index)"
            @keyup.up.native="onArrow(3, $index, -1)"
            @keyup.down.native="onArrow(3, $index, +1)"
          />
        </template>
      </el-table-column>

      <el-table-column label="Comment">
        <template slot-scope="{row, $index}">
          <el-input
            v-if="row.id"
            class="no-border"
            v-model="row.estimation.comment"
            @blur="saveEstimation(row, 'comment')"
            placeholder="Comment"
            :ref="`field-${$index}-4`"
            @keyup.enter.native="onEnter(row, 4, $index)"
            @keyup.up.native="onArrow(4, $index, -1)"
            @keyup.down.native="onArrow(4, $index, +1)"
          />
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

export default {
  name: 'LeadTaskList',
  mixins: [list],
  props: ['id'],
  watch: {
    list() {
      this.list.forEach(task => {
        if (!task.estimation) task.estimation = { project_id: this.id, task_id: task.id, user_id: api.user().id }
      });
    }
  },
  data() {
    return {
      type: 'task',
      template: { project_id: this.id, state: 'NEW', type: 'DEV', estimation: {} },
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
      positionNames: [],
      selectedTasks: [],
    }
  },
  methods: {
    async createWithEstimation(row) {
      await this.create(row)
      row.estimation = { project_id: this.id, task_id: row.id, user_id: api.user().id, planned: null, comment: null }
    },
    async saveEstimation(task, attr) {
      if (!task.estimation.id) {
        task.estimation.task_id = task.id
        task.estimation.user_id = api.user().id
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
  },
  async created() {
    const offers = await api.find('accounting', {
      and: { project_id: this.id },
      with: { positions: {many: 'position' } }
    })
    this.positionNames = []
    offers.forEach(offer => {
      offer.positions.forEach(pos => {
        if (this.positionNames.indexOf(pos.name) === -1) {
          this.positionNames.push(pos.name)
        }
      })
    })
  }
}
</script>

<style scoped type="sass">
</style>
