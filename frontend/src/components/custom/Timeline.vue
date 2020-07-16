<template>
  <div>
    <el-card>
      <el-form>
        <el-form-item>
          <el-input v-model="action.comment" :rows="1" type="textarea" :autosize="{minRows: 2}" :placeholder="$t('ui.timeline.comment')" />
        </el-form-item>
        <el-form-item  v-if="task.state != 'NEW'">
          <el-input v-model="duration" type="text" placeholder="hh:mm [hh:mm]" >
            <el-button v-if="!action.id && duration==''" type="secondary" slot="append" @click="save(null)">
              <i class="el-icon-arrow-right"/>
            </el-button>
            <el-button v-if="action.id && isStarted(action)" type="secondary" slot="append" @click="save(null)">
              <i class="el-icon-check"/>
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="duration==''" type="secondary" @click="save(null)">
            {{$t('ui.timeline.save')}}
          </el-button>
          <el-button :disabled="duration==''" v-if="task.state == 'PLANNED'" type="danger" @click="save('STARTED')">
            {{$t('ui.timeline.start')}}
          </el-button>
          <el-button :disabled="duration==''" v-if="task.state == 'STARTED'" type="danger" @click="save('IMPLEMENTED')">
            {{$t('ui.timeline.close')}}
          </el-button>
          <el-button :disabled="duration==''" v-if="task.state == 'IMPLEMENTED'" type="danger" @click="save('STARTED')">
            {{$t('ui.timeline.reopen')}}
          </el-button>
          <el-button :disabled="duration==''" v-if="task.state == 'IMPLEMENTED'" type="danger" @click="save('TESTED')">
            {{$t('ui.timeline.tested')}}
          </el-button>
          <el-button :disabled="duration==''" v-if="task.state == 'TESTED'" type="danger" @click="save('DEPLOYED')">
            {{$t('ui.timeline.deployed')}}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="detail">
    <a v-if="showHistory" href="#" @click.prevent="toggleDetail">{{$t('ui.timeline.detail')}}</a>
    <span v-if="showHistory"> | </span>
    <a href="#" @click.prevent="showHistory=!showHistory">{{$t('ui.timeline.history')}}</a>
    </div>
    <el-timeline v-if="showHistory" class="timeline" v-loading="loading">
      <el-timeline-item v-for="(a,i) in actions" :key="i" :timestamp="timestamp(a)" placement="top">
        <pre class="comment">{{ a.comment }}</pre>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import api from '@/api'
import moment from 'moment'
import store from '@/util/Store.js'

export default {
  name: 'TaskTimeline',
  props: ['tid', 'history'],
  data() {
    return {
      task: {},
      action: {},
      actions: [],
      logs: [],
      duration: "",
      loading: null,
      detail: false,
      showHistory: this.history,
      timerId: null,
      store: store,
    }
  },
  async created() {
    this.reload()
  },
  watch: {
    tid() {
      this.reload()
    }
  },
  methods: {
    async reload() {
      try {
        this.loading = true
        this.duration = ''
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
        const started = this.actions.filter(action => this.isStarted(action))
        if (started.length>0) {
          this.action = started[0]
          this.actions = this.actions.filter(action => !this.isStarted(action))
          this.startTimer(this.action)
        } else {
          this.action =  { project_id: this.task.project_id, task_id: this.task.id }
        }
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
    isStarted(action) {
      return action.from && !action.to
    },
    startTimer(action = null) {
      if (action) this.timerId = action.id
      else if (this.timerId!=this.action.id || !this.isStarted(this.action)) {
        // Timer stops
        console.log('timer is stopped')
        return
      }
      const now = moment()
      const duration = moment.duration(moment().diff(moment(this.action.from)))
      this.duration = moment.utc(duration.asMilliseconds()).format("HH:mm")
      this.timer = setTimeout(this.startTimer, 10*1000)
      this.store.action = this.action
      console.log('timer is running')
    },
    timestamp(action) {
      const fromNow = moment(action.to).fromNow()
      let result = `${action.user.name}, ${fromNow}`
      if (action.$log) {
        for (let key in action.diff) {
          result += `, ${key}: ${action.diff[key]}`
        }
      } else if (action.used && action.user_id==api.user().id) {
        result += ', ' + this.hours(action.used) + ' ' +this.$tc('ui.timeline.hours', action.used)
      }
      return result
    },
    hours(h) {
      const hours = Math.floor(h)
      const minutes = Math.round(h*60 % 60)

      return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes)    
    },
    /*
    Supported time entry formats:
    "1" 1 hour until now
    "1.5" 1.5 hours until now
    "1:20" 1 hour 20 minutes until now
    "" start timer
    "08:10 10:20" from until to
    */
    prepare(action) {
      let from = null
      let to = null
      let duration = null

      if (!this.duration) {
        from = moment()
      } else {
        const fromTo = this.duration.split(' ')

        to = moment()
        duration = moment.duration(fromTo[0]).asHours()
        if (fromTo[0].indexOf(':') === -1) duration = parseInt(fromTo[0])
        from = to.clone().subtract(duration, 'hours')

        if (fromTo.length === 2) {
          from = moment(fromTo[0], 'H:m')
          to = moment(fromTo[1], 'H:m')
          duration = moment.duration(to.diff(from)).asHours()
        }
      }

      action.to = to ? to.format('YYYY-MM-DD HH:mm:ss') : null
      action.from = from ? from.format('YYYY-MM-DD HH:mm:ss') : null
      action.used = duration
      action.user_id = api.user().id
    },
    async stopRunning() {
      if (store.action && this.action.id != store.action.id) {
        const from = moment(store.action.from)
        const to = moment()
        await api.update('action', store.action.id, {
          to: to.format('YYYY-MM-DD HH:mm:ss'),
          used: moment.duration(to.diff(from)).asHours()
        })
        store.action = null
      }
    },
    async save(state=null) {
      this.loading = true
      try {
        await this.stopRunning()
        if (state) {
          this.task.state = state
          await api.update('task', this.task.id, {state: state})
        }
        this.prepare(this.action)
        if (this.action.id) {
          await api.update('action', this.action.id, this.action)
        } else {
          const result = await api.create('action', this.action)
          this.action.id = result.id
          this.task.used = parseFloat(this.task.used) + this.action.used
        }
        this.reload()
        this.duration = ''
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
.detail {
  font-size: 80%;
  float: right;
  color: #CCCCCC;
}

.detail a {
  color: #CCCCCC;
}

.timeline {
  margin-top: 30px;
}

pre.comment {
  font-family: inherit;
}
</style>
