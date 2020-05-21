<template>
  <div class="components-container">
    <gantt :rows="data.rows" :tasks="data.tasks" :view_mode="view_mode" @update="update" />
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
                if (a.project_id == p.id) {
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
            task.name = `${p.name} [${a.parttime || '100'}%]`
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
        if (usertasks.length > 0) {
          const userRows = this.packTasks(u.name, usertasks, rows.length)
          tasks.push(...usertasks)
          rows.push(...userRows)
        }
      })

      this.checkTasks(tasks)

      return {tasks, rows}
    },
  },
  methods: {
    packTasks(rowname, tasks, firstRow) {
      const rows = []
      tasks.sort((a,b) => a.start - b.start)
      tasks.forEach(t => {
        let row = rows.find(r => t.start && r.date < t.start)
        if (!row) {
          row = {no: rows.length + firstRow}
          rows.push(row)
        }
        t.row = row.no
        row.date = t.end
      })
      const result = [rowname] 
      for (let i=1; i<rows.length; i++) result.push('')
      return result
    },
    checkTasks(tasks) {
      const usertasks = tasks.filter(t => t.allocation)
      usertasks.forEach(t => {
        const simultan = usertasks
          .filter(o => t.allocation.user_id==o.allocation.user_id)
          .filter(o => t.end>=o.start && t.start<=o.end)
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
        // if (!this.modified.projects) this.modified.projects = {}
        // this.modified.projects[task.project.id] = {
        //   starts_at: api.datetime(start),
        //   ends_at: api.datetime(end)
        // }
        task.allocation.from = start
        task.allocation.to = end
        if (!this.modified.allocations) this.modified.allocations = {}
        this.modified.allocations[task.allocation.id] = {
          from: api.datetime(start),
          to: api.datetime(end)
        }
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
        })
      })
    },
    workdays(from, to, off) {
        // braindead impl
        return (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24) + 1
    }
  },
  async mounted() {
    await this.loadProjects()
    await this.loadUsers()    
  }
}
</script>

<style scoped type="sass">
</style>
