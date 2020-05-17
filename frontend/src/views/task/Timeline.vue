<template>
  <el-timeline>
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
            <el-button v-loading="loading" type="primary" @click="save">
              Save
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-timeline-item>
    <el-timeline-item v-for="(a,i) in actions" :key="i" :timestamp="a.user.name + ', ' + a.to + ', ' + a.used + ' hours'" placement="top">
      <p>{{a.comment}}</p>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
import api from '@/api'
import moment from 'moment'

export default {
  name: 'TaskTimeline',
  props: ['id', 'task'],
  data() {
    return {
      action: {},
      actions: [],
      duration: "",
      loading: null
    }
  },
  async created() {
    this.reload()
  },
  methods: {
    async reload() {
      const tasks = await api.find('task', {
        and: {
          id: this.task.id
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
      this.actions = tasks[0].actions
      this.action =  { project_id: this.id, task_id: this.task.id }
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
    async save() {
      console.log('Saving', this.action)
      this.loading = true
      try {
        if (this.action.id) {
          await api.update('action', this.action.id, this.action)
        } else {
          this.prepare(this.action)

          const result = await api.create('action', this.action)
          this.action.id = result.id
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
    }
  }

}
</script>

<style scoped type="sass">
</style>
