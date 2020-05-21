<template>
  <div v-loading="loading" class="components-container">
    <gantt :rows="data.rows.map(r => r.name)" :tasks="data.tasks" :view_mode="view_mode" @update="update" @click="onClick" @clickBack="onClickBack"/>
    <div class="text-right">
      <el-radio-group v-model="view_mode" size="small" class="pull-left">
        <el-radio-button label="Quarter Day">Hourly</el-radio-button>
        <el-radio-button label="Day" ></el-radio-button>
        <el-radio-button label="Week"></el-radio-button>
        <el-radio-button label="Month"></el-radio-button>
      </el-radio-group>
      <el-button v-if="modified" type="primary" @click="save">
        Save
      </el-button>
    </div>
    <el-dialog
      title="Edit allocation"
      :visible.sync="selected.task"
      width="50%"
      center>
      <el-form label-position="top">
        <el-form-item v-if="selected.task && !selected.task.allocation.id" label="Type">
          <el-select v-model="selected.type" placeholder="Type...">
            <el-option-group label="Standard">
              <el-option value="HOLIDAY" label="Holiday" />
              <el-option value="ILL" label="Ill" />
            </el-option-group>
            <el-option-group label="Projects">
              <el-option v-for="p in projects" :key="p.id" :value="p.id" :label="p.name" />
            </el-option-group>
          </el-select>

        </el-form-item>
        <el-form-item label="Part time">
          <el-slider v-model="selected.parttime" :step="10" show-stops show-input />
        </el-form-item>
        <el-form-item label="Date">
          <el-date-picker
            v-model="selected.date"
            type="daterange"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selected = {}">Cancel</el-button>
        <el-button v-if="!selected.isNew" type="primary" @click="saveSelected(false)">Save</el-button>
        <el-button v-if="!selected.isNew" type="danger" @click="deleteSelected">Delete</el-button>
        <el-button v-if="selected.isNew" type="primary" @click="saveSelected(true)">Create</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Gantt from '@/components/gantt/Index'
import moment from 'moment'
import api from '@/api'

export default {
  name: 'Planning',
  components: { Gantt },
  data() {
    return {
      projects: [],
      users: [],
      view_mode: 'Week',
      modified: null,
      user: api.user(),
      selected: {},
      loading: false,
    }
  },
  computed: {
    data() {
      let row = 0
      const tasks = []
      this.projects.forEach((p,i) => {

        let allocated = 0
        this.users.forEach((u,i) => {
            const off = u.allocations
                .filter(a => a.type=='ILL' || a.type=='HOLIDAY')
            u.allocations.forEach((a,j) =>  {
                if (a.project_id == p.id && a.role=='Dev') {
                    allocated += (a.parttime || 100)/100 * this.workdays(a.from || p.starts_at, a.to || p.ends_at, off)        
                }
            })
        })

        const buffer = Math.round(((allocated / (p.planned/8)) - 1) * 100)

        let cl = null
        if (buffer>=20) cl = 'gantt-normal'
        else if (buffer>=0) cl = 'gantt-warn'
        else cl = 'gantt-critical'
        tasks.push({
          id: 'Project-' + i,
          name: `${p.name} [${buffer}%]`,
          start: p.starts_at,
          end: p.ends_at,
          custom_class: cl,
          project: p,
        })
      })
      
      const rows = this.packTasks("Projects", tasks, 0)

      this.users.forEach((u,i) => {
        const usertasks = []
        u.allocations.forEach((a,j) =>  {
          if (u.organisation_id != this.user.organisation_id) return
          const task = {
            id: `Allocation-${i}-${j}`,
            name: a.type,
            start: a.from,
            end: a.to,
            custom_class: 'gantt-normal',
            allocation: a,
            user: u,
          }        
          const p = a.project
          if (p) {
            task.name = `${p.name} [${a.role} ${a.parttime || '100'}%]`
            if (!task.start) task.start = p.starts_at
            if (!task.end) task.end = p.ends_at
          }
          switch (a.type) {
            case 'PROJECT': 
              if (!p) return
              break
            case 'CONTRACT': 
              return
              break;
            case 'ILL': 
            case 'HOLIDAY':
              task.custom_class = 'gantt-off'
              break;
            default:
              break;
          }
          usertasks.push(task)
        })
        const userRows = this.packTasks(u.name, usertasks, rows.length, u)
        tasks.push(...usertasks)
        rows.push(...userRows)
      })

      this.checkTasks(tasks)

      return {tasks, rows}
    },
  },
  methods: {
    packTasks(rowname, tasks, firstRow, user=null) {
      const rows = []
      tasks.sort((a,b) => a.start - b.start)
      tasks.forEach(t => {
        let row = rows.find(r => t.start && r.date < t.start)
        if (!row) {
          row = {
            no: rows.length + firstRow,
            name: rows.length==0 ? rowname : ''
          }
          if (t.allocation) {
            row.user = t.allocation.user
          }
          rows.push(row)
        }
        t.row = row.no
        row.date = t.end
      })
      if (rows.length==0) rows.push({no: rows.length + firstRow, name: rowname, user: user})
      return rows
    },
    checkTasks(tasks) {
      const usertasks = tasks.filter(t => t.allocation)
      usertasks.forEach(t => {
        const simultan = usertasks
          .filter(o => t.allocation.user_id==o.allocation.user_id && o.allocation.type=='PROJECT')
          .filter(o => t.end>=o.start && t.start<=o.end) // Must be dates!
        let load = 0
        let start = null
        let end = null
        simultan.forEach(o => {
          load += (o.allocation.parttime || 100)
          start = Math.max(start, o.start)
          end = Math.min(end, o.end)
        })

        const contracts = t.user.allocations.filter(c => c.type=='CONTRACT'
          && (c.from<=end || c.to >= start))

        const parttime = contracts.reduce((part, c) => Math.min(part, c.parttime), 100) 

        console.log('CHECK', t.name, load, parttime, simultan)

        if (load>parttime) {
          simultan
            .filter(t => t.allocation.type=='PROJECT')
            .forEach(o => o.custom_class = 'gantt-critical')
          const projectTask = tasks
            .find(o => o.project && o.project.id == t.allocation.project_id)
          if (projectTask) projectTask.custom_class = 'gantt-critical'
        }
      })
    },
    onClickBack(rowNo) {
      const row = this.data.rows[rowNo]
      console.log(row)
      if (!row.user) return

      const allocation = {
        user: row.user,
        user_id: row.user.id,
        parttime: 100,
        role: 'Dev'
      }

      const task = {
        allocation: allocation
      }

      this.selected = {
        isNew: true,
        task: task,
        parttime: task.allocation.parttime,
        date: [task.allocation.from || '', task.allocation.to || ''],
        type: task.allocation.type=='PROJECT' ? task.allocation.project_id : task.allocation.type
      }

    },
    onClick(task) {
      if (task.allocation) {
        this.selected = {
          task: task,
          parttime: task.allocation.parttime,
          date: [task.allocation.from || '', task.allocation.to || ''],
          type: task.allocation.type=='PROJECT' ? task.allocation.project_id : task.allocation.type
        }
      }
    },
    saveSelected(create = false) {
      const a = this.selected.task.allocation
      a.parttime = this.selected.parttime
      switch (this.selected.type) {
        case 'ILL':
        case 'HOLIDAY':
          a.type = this.selected.type
          a.project_id = null
          break;
        default:
          a.type = 'PROJECT'
          a.project_id = this.selected.type
          a.project = this.projects.find(p => p.id == a.project_id)
      }
      a.from = this.selected.date[0]=='' ? null : new Date(this.selected.date[0])
      a.to = this.selected.date[1]=='' ? null : new Date(this.selected.date[1])
      console.log(this.selected.date, a)
      this.allocationModified(a, create)
      this.selected = {}
    },
    deleteSelected() {
      const a = this.selected.task.allocation
      const user = this.users.find(u=>u.id == a.user_id)
      const index = user.allocations.indexOf(a)
      if (index>=0) {
        user.allocations.splice(index, 1);
      }
      
      if (a.id) {
        if (!this.modified) this.modified = {}
        if (!this.modified.deleted) this.modified.deleted = {}
        if (!this.modified.deleted.allocations) this.modified.deleted.allocations = []
        this.modified.deleted.allocations.push(a.id)
      }

      this.selected = {}
    },
    update(task, start, end) {
      if (!this.modified) this.modified = {}
      if (task.project) {
        if (!this.modified.projects) this.modified.projects = {}
        this.modified.projects[task.project.id] = {
          starts_at: api.datetime(start),
          ends_at: api.datetime(end)
        }
        task.project.starts_at = start
        task.project.ends_at = end
      }
      if (task.allocation) {
        task.allocation.from = start
        task.allocation.to = end
        this.allocationModified(task.allocation)
      }
    },
    allocationModified(allocation, create=false) {
      if (!this.modified) this.modified = {}
      if (create) {
        if (!this.modified.created) this.modified.created = {}
        if (!this.modified.created.allocations) this.modified.created.allocations = []
        this.modified.created.allocations.push(allocation)
        const user = this.users.find(u=>u.id == allocation.user_id)
        user.allocations.push(allocation)
      } else {
        const data = {
          from: api.datetime(allocation.from),
          to: api.datetime(allocation.to),
          parttime: allocation.parttime,
        } 
        if (this.modified.created && this.modified.created.allocations) {
          // Wurd die Allocation neu erzeugt? 
          if (this.modified.created.allocations.find(a => a===allocation))
            return
        }
        if (!this.modified.allocations) this.modified.allocations = {}
        this.modified.allocations[allocation.id] = data
      }
    },
    async save() {
      try {
        if (this.modified.projects) {
          await api.updateBulk('project', this.modified.projects)
        }
        if (this.modified.allocations) {
          await api.updateBulk('allocation', this.modified.allocations)
        }
        if (this.modified.created) {
          if (this.modified.created.allocations) {
            const data = this.modified.created.allocations.map(allocation => ({ 
              user_id: allocation.user_id,
              project_id: allocation.project_id,
              type: allocation.type,
              role: allocation.role,
              from: api.datetime(allocation.from),
              to: api.datetime(allocation.to),
              parttime: allocation.parttime,
            }))
            await api.create('allocation', data)
          }
        }
        if (this.modified.deleted) {
          if (this.modified.deleted.allocations) {
            await api.delete('allocation', this.modified.deleted.allocations.join(','))
          }
        }
        this.modified = null
      } catch (error) {
        this.$notify.error({
          title: 'Could not save',
          message: error.message
        });
      }
    },
    dateOrFromNow(date, days) {
      let mom = 0
      if (date) {
        mom = moment(date)
      } else {
        mom = moment()
        mom.add(days, 'days')
      }
      return mom.toDate()
    },
    async loadProjects() {
      this.projects = await api.find('project', {
        and: {
          state: 'ACCEPTED'
        },
      })
      this.projects.forEach( p => {
          p.starts_at = this.dateOrFromNow(p.starts_at, 0)
          p.ends_at = this.dateOrFromNow(p.ends_at, Math.max(5, p.planned/8))
      } )
    },
    async loadUsers() {
      this.users = await api.find('users', {
        and: {
          organisation_id: this.user.organisation_id
        },
        with: {
          allocations: { 
            many: 'allocation', 
            that: 'user_id',
            query: {
              order: {
                type: 'ASC',
                project_id: 'ASC',
              }
            }
          }
        }
      })
      this.users.forEach( u => {
        u.allocations.forEach( a => {
          a.project = this.projects.find(p => p.id==a.project_id)
          a.from = a.from ? new Date(a.from) : null
          a.to = a.to ? new Date(a.to) : null
          a.user = u
        })
      })
    },
    workdays(from, to, off) {
        // braindead impl
        return (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24) + 1
    }
  },
  async mounted() {
    this.loading = true
    await this.loadProjects()
    await this.loadUsers()    
    this.loading = false
  }
}
</script>

<style scoped type="sass">
</style>