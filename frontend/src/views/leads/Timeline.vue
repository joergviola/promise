<template>
  <el-timeline>
    <el-timeline-item v-for="(t,i) in open" :key="'open-'+i" :timestamp="t.created_at">
      <el-card v-loading="loading">
        <el-form>
          <el-form-item>
            <el-input v-model="t.name" type="text" :placeholder="$t('ui.leads.timeline.add')"/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="t.description" type="textarea" :rows="2" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="$t('type.task.description')" />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="t.due_at"
              type="date"
              :placeholder="$t('type.task.due_at')"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="t.user_id">
              <el-option v-for="u in users" :key="u.id" :label="u.name" :value="u.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="close(t)">
              {{$t('ui.leads.timeline.close')}}
            </el-button>
            <el-button type="primary" @click="save(t)">
              {{$t('ui.leads.timeline.save')}}
            </el-button>
            <el-button type="primary" @click="newTask">
              {{$t('ui.leads.timeline.add')}}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-timeline-item>
    <el-timeline-item v-for="(t,i) in closed" :key="i" :timestamp="(t.finished?t.finished.name:'') + ', ' + t.finished_at" placement="top">
      <el-card>
        <h4>{{t.name}}</h4>
        <p>{{t.description}}</p>
        <p>{{t.due_at | date}}</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
import api from 'gluon-api'

export default {
  name: 'LeadTimeline',
  props: ['id'],
  data() {
    return {
      template: {project_id: this.id, type: 'SALES', state: 'APPROVED'},
      open: [],
      closed: [],
      loading: null,
      users: [],
    }
  },
  async created() {
    this.reload()
  },
  methods: {
    async reload() {
      const tasks = await api.find('task', {
        and: {
          project_id: this.id,
          type: 'SALES'
        },
        with: {
          finished: { one: 'users', this: 'finished_by' }
        },
        order: {
          finished_at: 'DESC'
        }
      })
      this.closed = tasks.filter(t => t.state === 'CLOSED')
      this.open = tasks.filter(t => t.state !== 'CLOSED')
      if (this.open.length === 0) {
        const task = Object.assign({}, this.template)
        this.save(task)
      }
      this.users = await api.find('users', {
        and: {organisation_id: {in: [api.user().organisation_id]}}
      })
    },
    close(task) {
      task.state = 'CLOSED'
      task.finished_at = api.datetime(new Date())
      task.finished_by = api.user().id
      this.save(task)
    },
    newTask() {
        const task = Object.assign({}, this.template)
        this.save(task)
    },
    async save(task) {
      console.log('Saving', task)
      this.loading = true
      try {
        if (task.id) {
          await api.update('task', task.id, task)
        } else {
          task.user_id = api.user().id
          const result = await api.create('task', task)
          task.id = result.id
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
  }

}
</script>

<style scoped type="sass">
</style>
