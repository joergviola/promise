<template>
  <div v-loading="loading" class="components-container">
    <div v-if="users.length>0">
      <gantt :rows="data.rows.map(r => r.name)" :tasks="data.tasks" :view_mode="view_mode" @update="update" @click="onClick" @clickBackground="onClickBackground"/>
    </div>
    <div class="text-right">
      <el-radio-group v-model="view_mode" size="small" class="pull-left">
        <el-radio-button label="Quarter Day">{{$t('ui.planning.quarter')}}</el-radio-button>
        <el-radio-button label="Day" >{{$t('ui.planning.day')}}</el-radio-button>
        <el-radio-button label="Week">{{$t('ui.planning.week')}}</el-radio-button>
        <el-radio-button label="Month">{{$t('ui.planning.month')}}</el-radio-button>
      </el-radio-group>
      <el-button v-if="modified" type="primary" @click="save">
        {{$t('ui.planning.save')}}
      </el-button>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="selected.task!=null"
      width="50%"
      center>
      <el-form label-position="top">
        <el-form-item v-if="selected.task" :label="$t('ui.planning.type')">
          <el-select v-model="selected.type" :placeholder="$t('ui.planning.type')" :disabled="selected.task.allocation.id!=null">
            <el-option-group :label="$t('ui.planning.standard')">
              <el-option value="HOLIDAY" :label="$t('ui.planning.holiday')" />
              <el-option value="ILL" :label="$t('ui.planning.ill')" />
            </el-option-group>
            <el-option-group :label="$tc('ui.planning.projects', projects.length)">
              <el-option v-for="p in projects" :key="p.id" :value="p.id" :label="p.name" />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('ui.planning.parttime')">
          <el-slider v-model="selected.parttime" :step="10" show-stops show-input />
        </el-form-item>
        <el-form-item :label="$t('ui.planning.date')">
          <el-date-picker
            v-model="selected.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            :pickerOptions="{firstDayOfWeek: 1}"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selected = {}">{{$t('ui.planning.cancel')}}</el-button>
        <el-button v-if="!selected.isNew" type="primary" @click="saveSelected(false)">{{$t('ui.planning.save')}}</el-button>
        <el-button v-if="!selected.isNew" type="danger" @click="deleteSelected">{{$t('ui.planning.delete')}}</el-button>
        <el-button v-if="selected.isNew" type="primary" @click="saveSelected(true)">{{$t('ui.planning.create')}}</el-button>
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
  components: { Gantt: () => import('@/components/gantt/Index') },
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
    dialogTitle() {
      if (!this.selected.task) return 'No task selected'
      const user = this.selected.task.allocation.user.name
      if (this.selected.task.allocation.id) {
        return this.$t('ui.planning.edit-title', {user})
      } else {
        return this.$t('ui.planning.create-title', {user})
      }
    },
    data() {
      let row = 0
      const tasks = []
      this.projects.forEach((p,i) => {

        let cl = 'gantt-normal'
        let title = p.name
        if (p.starts_at && p.ends_at) {
          console.log(p.name)
          const buffer = this.calcBuffer(p)
          if (buffer>=0 && buffer<20) cl = 'gantt-warn'
          else if (buffer < 0) cl = 'gantt-critical'
          title += ` [${buffer}%]`
        }
        tasks.push({
          id: 'Project-' + i,
          name: title,
          start: p.starts_at,
          end: p.ends_at,
          custom_class: cl,
          project: p,
        })
      })
      
      const rows = this.packTasks(this.$tc('ui.planning.projects', this.projects.length), tasks, 0)

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
        let row = rows.find(r => t.start && r.date && r.date < t.start)
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
    calcBuffer(p) {
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

        return Math.round(((allocated / (p.planned/8)) - 1) * 100)
    },
    overlap(t1, t2) {
      return endAfterStart(t1, t2) && endAfterStart(t2, t1)

      function endAfterStart(t1, t2) {
        if (t1.end==null) return true
        if (t2.start==null) return true
        return t1.end>=t2.start
      }
    },
    checkTasks(tasks) {
      const usertasks = tasks.filter(t => t.allocation)
      usertasks.forEach(t => {
        const simultan = usertasks
          .filter(o => t.allocation.user_id==o.allocation.user_id)
          .filter(o => this.overlap(t, o)) // Must be dates!
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
    onClickBackground(click) {
      const row = this.data.rows[click.row]
      if (!row.user) return

      const allocation = {
        user: row.user,
        user_id: row.user.id,
        parttime: 100,
        role: 'Dev',
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
      if (Array.isArray(this.selected.date)) {
        a.from = this.selected.date[0]=='' ? null : new Date(this.selected.date[0])
        a.to = this.selected.date[1]=='' ? null : new Date(this.selected.date[1])
      } else {
        a.from = null
        a.to = null
      }
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
          starts_at: api.date(start),
          ends_at: api.date(end)
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
          from: api.date(allocation.from),
          to: api.date(allocation.to),
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
              from: api.date(allocation.from),
              to: api.date(allocation.to),
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
    ensureDate(value) {
      if (value==null) return null
      if (value instanceof Date) return value
      else return new Date(value);
    },
    async loadProjects() {
      this.projects = await api.find('project', {
        and: {
          state: 'ACCEPTED',
        },
      })
      this.projects.forEach( p => {
          p.starts_at = this.ensureDate(p.starts_at)
          p.ends_at = this.ensureDate(p.ends_at)
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
    // Calc working days between from and to.
    // Take into account weekends and holidays and the off allocations.
    workdays(from, to, off) {
        // braindead impl
        //return (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24) + 1
      let date = new Date(); 
      date.setTime(from.getTime())
      let result = 0
      while (date <= to) {
        if (!isOff(date)) result += 1
        date.setDate(date.getDate()+1)
      }
      return result

      function isOff(date) {
        return date.getDay()==0 || date.getDay()==6
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (!this.modified) {
      next()
    } else {
      this.$confirm(this.$t('ui.planning.exit.title'), this.$t('ui.planning.exit.warning'), {
        confirmButtonText: this.$t('ui.planning.exit.confirm'),
        cancelButtonText: this.$t('ui.planning.exit.cancel'),
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        next(false)
      });
    }
  },
  async created() {
    this.loading = true
    await this.loadProjects()
    await this.loadUsers()    
    this.loading = false
  }
}
</script>

<style scoped type="sass">
</style>
