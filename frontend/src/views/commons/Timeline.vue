<template>
  <el-timeline  v-loading="loading">
    <el-timeline-item timestamp="You, Now" placement="top">
      <el-card>
        <el-form>
          <el-form-item>
            <el-input v-model="action.comment" :rows="1" type="textarea" autosize placeholder="What did you do...?" />
          </el-form-item>
          <el-form-item  v-if="task.state != 'NEW'">
            <el-input v-model="duration" type="text" placeholder="hh:mm [hh:mm]" />
          </el-form-item>
          <el-form-item>
            <el-button type="secondary" @click="save(null)">
              Save
            </el-button>
            <el-button v-if="task.state == 'PLANNED'" type="danger" @click="save('STARTED')">
              Start working
            </el-button>
            <el-button v-if="task.state == 'STARTED'" type="danger" @click="save('IMPLEMENTED')">
              Close
            </el-button>
            <el-button v-if="task.state == 'IMPLEMENTED'" type="danger" @click="save('STARTED')">
              Reopen
            </el-button>
            <el-button v-if="task.state == 'IMPLEMENTED'" type="danger" @click="save('TESTED')">
              Tested
            </el-button>
            <el-button v-if="task.state == 'TESTED'" type="danger" @click="save('DEPLOYED')">
              Deployed
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <a class="detail" href="#" @click.prevent="toggleDetail">Show Detail</a>
    </el-timeline-item>
    <el-timeline-item v-for="(a,i) in actions" :key="i" :timestamp="timestamp(a)" placement="top">
      <p>{{a.comment}}</p>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
import api from '@/api'
import moment from 'moment'

export default {
  name: 'TaskTimeline',
  props: ['tid'],
  data() {
    return {
      action: {},
      actions: [],
      logs: [],
      duration: "",
      loading: null,
      detail: false
    }
  },
  async created() {
    this.reload()
  },
  watch: {
    task() {
      this.reload()
    }
  },
  methods: {
    async reload() {
      this.loading = true
      const tasks = await api.find('task', {
        and: {
          id: this.tid
        },
        with: {
          actions: {
            many: 'action',
            query: {
              with: {
                user: { one: 'users', this: 'user_id' }
              },
              order: {
                to: 'DESC'
              }
            }
          }
        }
      })
      this.task = tasks[0]
      this.actions = this.task.actions
      if (this.detail) {
        const logs = await api.log('task', this.tid)
        if (logs.length>0) {
          let state = {}
          logs.forEach(l => {
            const content = l.content
            const diff = {}
            for (let key in content) {
              if (content[key] && content[key]!==state[key]) {
                switch (key) {
                  case 'name': diff.Name = content.name; break;
                  case 'state': diff.State = content.state; break;
                  case 'planned': diff.Planned = content.planned; break;
                  case 'user_id': diff.Assigned = content.user_id; break;
                }
              }
            }
            state = Object.assign(state, content)
            if (_.isEmpty(diff)) return
            const entry = {$log: true, user: l.user, to: l.created_at, diff: diff}
            this.actions.push(entry)
          })
        }
        this.actions.sort((a, b) => new Date(b.to) - new Date(a.to))
      }
      this.action =  { project_id: this.task.project_id, task_id: this.task.id }
      this.loading = false
    },
    timestamp(action) {
      let result = `${action.user.name}, ${action.to}`
      if (action.$log) {
        for (let key in action.diff) {
          result += `, ${key}: ${action.diff[key]}`
        }
      } else if (action.used) {
        result += ', ' + action.used + ' hours'
      }
      return result
    },
    prepare(action) {
      const fromTo = this.duration.split(' ')

      let to = moment()
      let duration = moment.duration(fromTo[0]).asHours()
      if (fromTo[0].indexOf(':') === -1) duration = parseInt(fromTo[0])
      let from = to.clone().subtract(duration, 'hours')

      if (fromTo.length === 2) {
        from = moment(fromTo[0], 'H:m')
        to = moment(fromTo[1], 'H:m')
        duration = moment.duration(to.diff(from)).asHours()
      }

      action.to = to.format('YYYY-MM-DD HH:mm:ss')
      action.from = from.format('YYYY-MM-DD HH:mm:ss')
      action.used = duration
      action.user_id = api.user().id
    },
    async save(state=null) {
      console.log('Saving', this.action)
      this.loading = true
      try {
        if (state) {
          this.task.state = state
          await api.update('task', this.task.id, {state: state})
        }
        if (this.action.id) {
          await api.update('action', this.action.id, this.action)
        } else {
          this.prepare(this.action)

          const result = await api.create('action', this.action)
          this.action.id = result.id
          this.task.used = parseFloat(this.task.used) + this.action.used
        }
        this.reload()
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 5000
        })
      }
      this.loading = false
    },
    toggleDetail() {
      this.detail = !this.detail
      this.reload()
    }
  }

}
</script>

<style scoped type="sass">
a.detail {
  font-size: 80%;
  float: right;
  color: #CCCCCC;
  padding-bottom: 10px;
}
</style>
