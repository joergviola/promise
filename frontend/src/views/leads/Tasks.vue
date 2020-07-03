<template>
  <div>
    <el-row v-if="groupBy" style="margin-top: 20px">
      <el-col align="right">
        <el-button type="default" @click="addGroup()">
            {{$t('ui.list.addGroup')}}
        </el-button>
      </el-col>
    </el-row>
    <div ref="groupedTable">
      <div v-for="(group,groupIndex) in lists" :key="group.key" class="group"  :data-list="group.group">
        <div v-if="group.header" class="grouped-header">
          <svg class="group-handle grab" focusable="false" viewBox="0 0 32 32"><path fill="#CCCCCC" d="M14,5.5c0,1.7-1.3,3-3,3s-3-1.3-3-3s1.3-3,3-3S14,3.8,14,5.5z M21,8.5c1.7,0,3-1.3,3-3s-1.3-3-3-3s-3,1.3-3,3S19.3,8.5,21,8.5z M11,12.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S12.7,12.5,11,12.5z M21,12.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S22.7,12.5,21,12.5z M11,22.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S12.7,22.5,11,22.5z M21,22.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S22.7,22.5,21,22.5z"></path></svg>
          <i v-if="group.show" class="el-icon-arrow-down"  @click="group.show = !group.show"/>
          <i v-if="!group.show" class="el-icon-arrow-right"  @click="group.show = !group.show"/>
          <el-input v-model="group.group" class="no-border heading" @change="groupChanged(group)"/>
        </div>
        <el-table v-if="group.show" ref="theTable" v-loading="loading" :show-header="groupIndex==0" :data="group.list" row-key="id" fit>
          
          <el-table-column v-if="sort" label="" width="25">
            <template slot-scope="{row, $index}">
              <svg class="handle grab" focusable="false" viewBox="0 0 32 32"><path fill="#CCCCCC" d="M14,5.5c0,1.7-1.3,3-3,3s-3-1.3-3-3s1.3-3,3-3S14,3.8,14,5.5z M21,8.5c1.7,0,3-1.3,3-3s-1.3-3-3-3s-3,1.3-3,3S19.3,8.5,21,8.5z M11,12.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S12.7,12.5,11,12.5z M21,12.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S22.7,12.5,21,12.5z M11,22.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S12.7,22.5,11,22.5z M21,22.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S22.7,22.5,21,22.5z"></path></svg>
            </template>
          </el-table-column>
          
          <el-table-column type="expand"  width="25">
            <template slot-scope="{row}">
              <el-form label-position="left" label-width="120px" >
                <el-form-item :label="$t('type.task.percent')">
                  <el-checkbox
                    :label="$t('ui.leads.tasks.percent')"
                    :value="!!row.percent"
                    @input="value => row.percent = value"
                    @change="saveWithEstimation(row, 'percent')"
                  />
                </el-form-item>
                <el-form-item :label="$t('type.task.purchased')">
                  <el-checkbox
                    :label="$t('ui.leads.tasks.purchased')"
                    :value="!!row.purchased"
                    @input="value => row.purchased = value"
                    @change="saveWithEstimation(row, 'purchased')"
                  />
                </el-form-item>
                <el-form-item v-if="row.purchased" :label="$t('type.task.price')">
                  <el-input
                    type="text"
                    v-model="row.price"
                    @change="saveWithEstimation(row, 'price')"
                  />
                </el-form-item>
                <el-form-item v-if="row.purchased" :label="$t('type.task.supplier')">
                  <el-input
                    type="text"
                    v-model="row.supplier"
                    @change="saveWithEstimation(row, 'supplier')"
                  />
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column :label="$t('type.task.name')" min-width="150">
            <template slot-scope="{row, $index}">
              <el-input
                class="no-border"
                v-model="row.name"
                @change="saveWithEstimation(row, 'name')"
                :placeholder="$t('type.task.name')"
                :ref="`field-${groupIndex}-${$index}-0`"
                @keydown.enter.native="onEnter(row, groupIndex, 0, $index)"
                @keydown.up.native="onArrow(groupIndex, 0, $index, -1)"
                @keydown.down.native="onArrow(groupIndex, 0, $index, +1)"
                @keydown.delete.native="event=>onDelete(event, row, groupIndex, 0, $index, row.name)"
              />
            </template>
          </el-table-column>

          <el-table-column :label="$t('type.task.description')" min-width="200">
            <template slot-scope="{row, $index}">
              <el-input
                type="textarea"
                :autosize="{minRows:1, maxRows:4}"
                class="no-border"
                v-model="row.description"
                @change="saveWithEstimation(row, 'description')"
                :ref="`field-${groupIndex}-${$index}-1`"
                @keydown.up.native="onArrow(groupIndex, 1, $index, -1)"
                @keydown.down.native="onArrow(groupIndex, 1, $index, +1)"
              />
            </template>
          </el-table-column>

          <el-table-column :label="$t('type.task.position')" min-width="120">
            <template slot-scope="{row, $index}">
              <el-select class="no-border" v-model="row.position" filterable allow-create @change="save(row, 'position')" >
                <el-option v-for="(name, i) in positionNames" :value="name" :key="i" :label="name" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column :label="$t('type.task.planned')" align="right" min-width="50">
            <template slot-scope="{row, $index}">
              <span v-if="!row.purchased" class="no-border estimation el-input el-input--small">
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
                    {{row.planned}} {{ row.percent?'%':'' }}
                  </span>
                </el-popover>
              </span>
              <span v-if="row.purchased" class="no-border estimation el-input el-input--small">
                {{row.price  || 0}} EUR
              </span>
            </template>
          </el-table-column>


          <el-table-column :label="$t('type.estimation.planned')" min-width="60">
            <template slot-scope="{row, $index}">
              <el-input
                v-if="!row.purchased"
                class="no-border pull-left"
                v-model="row.estimation.planned"
                :disabled="row.position_id!=null"
                @change="saveEstimation(row, 'planned')"
                :placeholder="$t('type.estimation.planned')"
                :ref="`field-${groupIndex}-${$index}-4`"
                @keydown.enter.native="onEnter(row, groupIndex, 0, $index)"
                @keydown.up.native="onArrow(groupIndex, 4, $index, -1)"
                @keydown.down.native="onArrow(groupIndex, 4, $index, +1)"
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

          <el-table-column :label="$t('type.estimation.comment')" min-width="200">
            <template slot-scope="{row, $index}">
              <el-input
                v-if="!row.purchased"
                type="textarea"
                :autosize="{minRows:1, maxRows:4}"
                class="no-border"
                v-model="row.estimation.comment"
                @change="saveEstimation(row, 'comment')"
                :ref="`field-${groupIndex}-${$index}-5`"
                @keydown.up.native="onArrow(groupIndex, 5, $index, -1)"
                @keydown.down.native="onArrow(groupIndex, 5, $index, +1)"
              />
              <span v-if="row.purchased" class="no-border estimation el-input el-input--small">
                Purchased from {{row.supplier || '??'}}
              </span>
            </template>
          </el-table-column>

          <el-table-column align="right" label="" width="40">
            <template slot-scope="{row}">
              <i v-if="row.id && (row.estimations.length==0 || (row.estimations.length==1 && row.estimations[0].user_id==user.id))" class="action el-icon-remove-outline" @click="removeWithEstimation(groupIndex, row)" title="Delete this line"/> 
              <i v-if="!row.id" class="action el-icon-remove-outline" @click="remove(groupIndex, row, false)" title="Delete this line"/> 
            </template>
          </el-table-column>

        </el-table>
      </div>
      <el-row style="margin-top: 20px">
        <el-col align="right">
          <el-button type="default" @click="exportCSV('Tasks.csv', ['id', 'name', 'position', 'planned', 'estimation.id', 'estimation.planned', 'estimation.comment'])">
              Export
          </el-button>
        </el-col>
      </el-row>
    </div>
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
    lists() {
      this.lists.forEach(list => {
        list.list.forEach(task => {
          if (!task.estimation) task.estimation = { project_id: this.id, task_id: task.id, user_id: api.user().id }
        })
      })
    }
  },
  data() {
    return {
      test: '',
      type: 'task',
      groupBy: {field: 'category'},
      user: api.user(),
      template: { id: null, project_id: this.id, state: 'NEW', type: 'DEV', estimation: {}, estimations: [], planned: null, _meta: {estimation: {ignore: true}, estimations: {ignore: true}} },
      query: { project_id: this.id, type: 'DEV' },
      copyOnEnter: ['position'],
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
      sort: 'sort_project',
      positionNames: [],
    }
  },
  methods: {
    stopEvent(event) {
      console.log(event)
      event.stopPropagation();
    },
    async createWithEstimation(groupIndex, row) {
      await this.create(groupIndex, row)
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
          if (task.estimation[attr]==null) {
            task.estimation[attr] = ''
          }
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
    async removeWithEstimation(groupIndex, row) {
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
        if (row.estimation.id) {
          await api.delete('estimation', row.estimation.id)
        }
        await this.remove(groupIndex, row, false)
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 15000
        })
      }
    },
    getTextAreaColumns() {
      return [1, 5]
    },

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

<style>
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
  font-size: 17px;
  vertical-align: -3px;
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
.group {
  margin-top: 10px;
}
.group-handle {
  margin-left: 10px;
  margin-right: 8px;
}
.heading {
  display: inline;
  margin-left: 12px;
}
.heading input {
  font-size: 120%;
  font-weight: bold;
  width: 80%;
}
.grouped-header .handle {
  padding-left: 10px;
  padding-right: 5px;
}
.el-table .cell {
  text-overflow: clip;
}
</style>
