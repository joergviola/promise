<template>
  <div>

    <el-table ref="theTable" v-loading="loading" :data="list" row-key="id">
      <!--
      <el-table-column v-if="sort" label="" width="25">
        <template slot-scope="{row, $index}">
          <i class="grab el-icon-menu"></i>
        </template>
      </el-table-column>
      -->
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-input 
            v-model="row.description" 
            :rows="2" type="textarea" 
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="More info..." 
            @blur="save(row, 'description')"
          />
        </template>
      </el-table-column>
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

      <el-table-column label="Planned" align="right">
        <template slot-scope="{row, $index}">
          <span v-if="row.id" class="estimation el-input el-input--small">
            <el-popover
              slot="suffix" 
              placement="bottom"
              title="Estimations"
              width="200"
              trigger="click">
              <el-table :data="row.estimations" :summary-method="getEstSummaries" show-summary >
                <el-table-column prop="user.name" label="By"/>
                <el-table-column prop="planned" label="Estimated" align="right"/>
              </el-table>
              <span slot="reference">
                <i v-if="deviating(row.estimations)" class="warning el-icon-warning"></i>
                {{row.planned}}
              </span>
            </el-popover>
          </span>
          
        </template>
      </el-table-column>

      <el-table-column label="Estimation" >
        <template slot-scope="{row, $index}">
          <el-input
            v-if="row.id"
            class="no-border pull-left"
            v-model="row.estimation.planned"
            :disabled="row.position_id!=null"
            @blur="saveEstimation(row, 'planned')"
            placeholder="Your estimation..."
            :ref="`field-${$index}-3`"
            @keyup.enter.native="onEnter(row, 3, $index)"
            @keyup.up.native="onArrow(3, $index, -1)"
            @keyup.down.native="onArrow(3, $index, +1)"
          >
           <el-popover
            v-if="row.position_id" 
            slot="suffix" 
            placement="bottom"
            title="Offer already sent"
            width="200"
            trigger="click"
            content="This task is already offered to the customer.">
            <i slot="reference" class="el-icon-remove-outline"></i>
          </el-popover>
          </el-input>
        </template>
      </el-table-column>

      <el-table-column label="Comment">
        <template slot-scope="{row, $index}">
          <el-input
            v-if="row.id"
            class="no-border"
            v-model="row.estimation.comment"
            @blur="saveEstimation(row, 'comment')"
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
      template: { project_id: this.id, state: 'NEW', type: 'DEV', estimation: {}, planned: null },
      query: { project_id: this.id, type: 'DEV' },
      with: {
        estimation: {
          one: 'estimation',
          this: 'id',
          that: 'task_id',
          query: { 
            and: { user_id: api.user().id } ,
          }
        },
        estimations: {
          many: 'estimation',
          query: { 
            with: { user: {one: 'users', this: 'user_id'} } ,
          }
        }
      },
      loading: false,
      list: [],
      sort: 'sort_project',
      positionNames: [],
    }
  },
  methods: {
    async createWithEstimation(row) {
      await this.create(row)
      row.estimation = { project_id: this.id, task_id: row.id, user_id: api.user().id, planned: null, comment: null }
    },
    async saveEstimation(task, attr) {
      if (!task.estimation.id) {
        task.estimation.project_id = task.project_id
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
    deviating(estimations) {
      if (estimations.length==0) return null
      const min = estimations.reduce((m, c) => Math.min(m, c.planned), estimations[0].planned)
      const max = estimations.reduce((m, c) => Math.max(m, c.planned), estimations[0].planned)
      const av = (max+min)/2
      if ((max-min) / av > 0.2) return {min, max}
      else return null
    },
    getEstSummaries(param) {
      if (param.data.length==0) return ['', '']
      const sum = param.data.reduce((s, c) => s + c.planned, 0)
      return ['Estimation', sum/param.data.length]
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

<style scoped>
i.grab {
  color: #EEEEEE;
  cursor: grab;
}

.estimation .count {
  margin-left: 10px;
  font-size: 80%;
  color: #AAAAAA;
}
.estimation .warning {
  margin-left: 10px;
  color: red;
}

</style>
