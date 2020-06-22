<template>
  <div>

    <el-table ref="theTable" v-loading="loading" :data="list" row-key="id" fit>
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
            @change="saveWithEstimation(row, 'description')"
          />
        </template>
      </el-table-column>
      <el-table-column label="Name" min-width="200">
        <template slot-scope="{row, $index}">
          <el-input
            class="no-border"
            v-model="row.name"
            @change="saveWithEstimation(row, 'name')"
            placeholder="New task..."
            :ref="`field-${$index}-0`"
            @keydown.enter.native="onEnter(row, 0, $index)"
            @keydown.up.native="onArrow(0, $index, -1)"
            @keydown.down.native="onArrow(0, $index, +1)"
          />
        </template>
      </el-table-column>
      <el-table-column label="Position" min-width="50">
        <template slot-scope="{row, $index}">
          <el-select class="no-border" v-model="row.position" filterable allow-create @change="save(row, 'position')" >
            <el-option v-for="(name, i) in positionNames" :value="name" :key="i" :label="name" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="Planned" align="right" min-width="50">
        <template slot-scope="{row, $index}">
          <span v-if="row.id" class="estimation el-input el-input--small">
            <el-popover
              slot="suffix" 
              placement="bottom"
              title="Estimations"
              width="200"
              trigger="click">
              <table class="est-table">
                <tr v-for="e in row.estimations" :key="e.id">
                  <td>{{e.user.name}}</td>
                  <td align="right">{{e.planned}}</td>
                </tr>
                <tr>
                  <td>Summary</td>
                  <td align="right">{{getEstSummaries(row.estimations)}}</td>
                </tr>
              </table>
              <span slot="reference">
                <i v-if="deviating(row.estimations)" class="warning el-icon-warning"></i>
                {{row.planned}}
              </span>
            </el-popover>
          </span>
          
        </template>
      </el-table-column>


      <el-table-column label="Estimation" min-width="50">
        <template slot-scope="{row, $index}">
          <el-input
            v-if="row.id"
            class="no-border pull-left"
            v-model="row.estimation.planned"
            :disabled="row.position_id!=null"
            @change="saveEstimation(row, 'planned')"
            placeholder="Your estimation..."
            :ref="`field-${$index}-3`"
            @keydown.enter.native="onEnter(row, 3, $index)"
            @keydown.up.native="onArrow(3, $index, -1)"
            @keydown.down.native="onArrow(3, $index, +1)"
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

      <el-table-column label="Comment" min-width="200">
        <template slot-scope="{row, $index}">
          <el-input
            v-if="row.id"
            type="textarea"
            :rows="1" 
            autosize 
            class="no-border"
            v-model="row.estimation.comment"
            @change="saveEstimation(row, 'comment')"
            :ref="`field-${$index}-4`"
            @keydown.enter.native="onEnter(row, 4, $index)"
            @keydown.up.native="onArrow(4, $index, -1)"
            @keydown.down.native="onArrow(4, $index, +1)"
          />
        </template>
      </el-table-column>

      <el-table-column align="right" label="" width="40">
        <template slot-scope="{row}">
          <i v-if="row.id && (row.estimations.length==0 || (row.estimations.length==1 && row.estimations[0].user_id==user.id))" class="action el-icon-remove-outline" @click="removeWithEstimation(row)" title="Delete this line"/> 
          <i v-if="!row.id" class="action el-icon-circle-plus-outline" @click="createWithEstimation(row)"  title="Create a new line"/> 
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
      user: api.user(),
      template: { project_id: this.id, state: 'NEW', type: 'DEV', estimation: {}, estimations: [], planned: null },
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
    async saveWithEstimation(row, field) {
      if (row.id) {
        await this.save(row, field)
      } else {
        await this.save(row, field)
        row.estimation = { project_id: this.id, task_id: row.id, user_id: api.user().id, planned: null, comment: null }
      }
    },
    async saveEstimation(task, attr) {
      if (attr=='planned') this.repairPlanned(task.estimation)
      try {
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
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 5000
        })
      }
    },
    repairPlanned(estimation) {
      if (typeof estimation.planned == 'string') {
        const comps = estimation.planned.split(':')
        if (comps.length==2) {
          // HH:MM
          estimation.planned = parseFloat(comps[0]) + Math.round(parseFloat(comps[1])/60*100)/100
        } else {
          estimation.planned = parseFloat(comps[0])
        }
      }
    },
    deviating(estimations) {
      if (estimations.length==0) return null
      const min = estimations.reduce((m, c) => Math.min(m, c.planned), estimations[0].planned)
      const max = estimations.reduce((m, c) => Math.max(m, c.planned), estimations[0].planned)
      const av = (max+min)/2
      if ((max-min) / av > 0.2) return {min, max}
      else return null
    },
    getEstSummaries(data) {
      if (data.length==0) return 0
      const sum = data.reduce((s, c) => s + c.planned, 0)
      return sum/data.length
    },
    async removeWithEstimation(row) {
      if (row.estimations.length>1) return
      if (row.estimations.length==1 && row.estimations[0].user_id != api.user().id) return;
      try {
        try {
          await this.$confirm('Are you sure?', 'Warning', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning'
          })
        } catch (cancel) {
          return
        }
        await api.delete('estimation', row.estimation.id)
        await this.remove(row, false)
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 15000
        })
      }
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
  },
}
</script>

<style scoped>
i.action {
  color: #AAAAAA;
  cursor: pointer;
  font-size: 150%;
  margin-top: 10px;
  margin-left: 10px;
}
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
.est-table {
  width: 100%;
}
.est-table td {
  border-bottom: 1px solid #DDDDDD;
}

</style>
