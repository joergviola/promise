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
        tasks.push({
          id: 'Project-' + i,
          name: p.name,
          start: p.starts_at,
          end: p.ends_at,
          custom_class: 'gantt-blue',
          project: p,
        })
      })
      
      const rows = this.packTasks("Projects", tasks, 0)

      const users = {}
      this.projects.forEach((p,i) => {
        p.allocations.forEach(a =>  {
          if (a.user.organisation_id != this.user.organisation_id) return
          if (!users[a.user.id]) users[a.user.id] = {name: a.user.name, tasks: []}
          users[a.user.id].tasks.push({
            id: 'Allocation-' + i,
            name: `${p.name} [${a.parttime || '100'}%]`,
            start: p.starts_at,
            end: p.ends_at,
            custom_class: 'gantt-blue',
            allocation: a,
          })
        })
      })

      for (let id in users) {
        const userRows = this.packTasks(users[id].name, users[id].tasks, rows.length)
        tasks.push(...users[id].tasks)
        rows.push(...userRows)
      }

      this.checkTasks(tasks)

      return {tasks, rows}
    },
  },
  methods: {
    packTasks(rowname, tasks, firstRow) {
      const rows = []
      tasks.sort((a,b) => a.start - b.start)
      tasks.forEach(t => {
        let row = rows.find(r => r.date < t.start)
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
        const load = simultan
          .reduce((acc, o) => acc + (o.allocation.parttime||100), 0)
        if (load>(t.allocation.user.parttime || 100)) {
          simultan.forEach(o => o.custom_class = 'gantt-red')
          const projectTask = tasks
            .find(o => o.project && o.project.id == t.allocation.project_id)
          projectTask.custom_class = 'gantt-red'
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
    },
    async save() {
      try {
        if (this.modified.projects) {
          await api.updateBulk('project', this.modified.projects)
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
    }
  },
  async mounted() {
    this.projects = await api.find('project', {
      and: {
        state: {'<>': 'LEAD'}
      },
      with: {
        allocations: { 
          many: 'allocation', 
          query: {
            with: {
              user: { one: 'users', this: 'user_id' }
            }
          }
        }
      }
    })
    this.projects.forEach( p => {
        p.starts_at = this.dateOrFromNow(p.starts_at, 0)
        p.ends_at = this.dateOrFromNow(p.ends_at, Math.max(1, p.planned/8))
    } )
    
  }
}
</script>

<style scoped type="sass">
</style>
