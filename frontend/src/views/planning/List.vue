<template>
  <div class="components-container">
    <gantt :rows="rows" :tasks="tasks" @update="update" />
    <div class="text-right">
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
  name: 'UserList',
  components: { Gantt },
  data() {
    return {
      projects: [],
      users: [],
      modified: null,
    }
  },
  computed: {
    tasks() {
      let row = 0
      const tasks = []
      this.projects.forEach((p,i) => {
        tasks.push({
          id: 'Project-' + i,
          row: row++,
          row_name: p.name,
          name: p.name,
          start: this.dateOrFromNow(p.starts_at, 0),
          end: this.dateOrFromNow(p.ends_at, p.planned/8),
          custom_class: 'gantt-red',
          project: p,
        })
      })
      this.projects.forEach((p,i) => {
        p.allocations.forEach(a =>  {
          tasks.push({
            id: 'Allocation-' + i,
            row: row++,
            row_name: a.user.name,
            name: `${p.name} [${a.parttime || '100'}%]`,
            start: this.dateOrFromNow(p.starts_at, 0),
            end: this.dateOrFromNow(p.ends_at, p.planned/8),
            custom_class: 'gantt-red',
            allocation: a,
          })
        })
      })
      return tasks
    },
    rows() {
      const rows = []
      this.tasks.forEach(t => rows[t.row] = t.row_name)
      return rows
    }
  },
  methods: {
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
      return mom.format('YYYY-MM-DD')
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
  }
}
</script>

<style scoped type="sass">
</style>
