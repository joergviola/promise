<template>
  <div class="components-container">
    <h2>Welcome, {{user.name}}</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            Your tasks
          </div>
          <h4>Today</h4>
          <draggable class="list-group" :list="today" group="tasks" @change="dragToday">
            <div v-for="task in today" :class="['task', {selected: selected==task}]" :key="task.id" @click="selected = task">
              <div class="header">
                <span class="pull-left">
                  {{task.project.name}} 
                  <router-link :to="`/projects/project/${task.project.id}/detail`">
                    &gt;
                  </router-link>
                </span>
                <span v-if="task.due_at" class="pull-right">
                  {{task.due_at}}
                </span>
              </div>
              <div class="body pull-clear">
                {{task.name}}
                <router-link :to="`/projects/project/${task.project.id}/task/${task.id}/detail`">
                  &gt;
                </router-link>
              </div>
              <el-progress
                :show-text="false"
                :stroke-width="5"
                :percentage="percentage(task)"
                status="success"
              />
            </div>
          </draggable>
          <h4>Current</h4>
          <draggable class="list-group" :list="current" group="tasks" @change="dragCurrent">
            <div v-for="task in current" :class="['task', {selected: selected==task}]" :key="task.id"  @click="selected = null">
              <div class="header">
                {{task.project.name}}
                <router-link :to="`/projects/project/${task.project.id}/detail`">
                    &gt;
                </router-link>
              </div>
              <div class="body">
                {{task.name}} 
                <router-link :to="`/projects/project/${task.project.id}/task/${task.id}/detail`">
                    &gt;
                </router-link>
              </div>
              <el-progress
                :show-text="false"
                :stroke-width="5"
                :percentage="percentage(task)"
                status="success"
              />
            </div>
          </draggable>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            <span v-if="!selected">Book time</span>
            <span v-if="selected">{{selected.name}}</span>
          </div>
            <span v-if="!selected">Select a task</span>
          <task-timeline v-if="selected" :task="selected" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            Your projects
          </div>
          <div v-for="allocation in allocations" class="task" :key="allocation.id">
            <div class="header">
              {{allocation.role}} {{allocation.project.starts_at}} - {{allocation.project.ends_at}}
            </div>
            <div class="body pull-clear">
                {{allocation.project.name}} 
                <router-link :to="`/projects/project/${allocation.project.id}/detail`">
                  &gt;
                </router-link>
            </div>
            <el-progress
              :show-text="false"
              :stroke-width="5"
              :percentage="percentage(allocation.project)"
              status="success"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GenericList from '@/components/generic/List'
import TaskTimeline from '@/views/commons/Timeline'
import Draggable from 'vuedraggable'
import api from '@/api'

export default {
  name: 'Dashboard',
  components: { GenericList, TaskTimeline, Draggable },
  data() {
    return {
      user: api.user(),
      today: [],
      current: [],
      allocations: [],
      selected: null,
    }
  },
  methods: {
    percentage(task) {
      if (!task.planned) return 0
      return task.used/task.planned*100.0
    },
    dragToday(evt) {
      this.dragTo('STARTED', evt)
    },
    dragCurrent(evt) {
      this.dragTo('PLANNED', evt)
    },
    async dragTo(newState, evt) {
       const action = evt.added || evt.moved
       if (!action) return
       const task = action.element
       if (task.state != newState) {
         task.state = newState
         await this.saveTaskState(task)
       }
       await this.saveTaskOrder()
    },
    async saveTaskState(task) {
      await api.update('task', task.id, {state: task.state})
    },
    async saveTaskOrder() {
      const data = {}
      this.today.forEach((task, i) => data[task.id] = {sort_user: i})
      const offset = this.today.length
      this.current.forEach((task, i) => data[task.id] = {sort_user: offset + i})
      await api.updateBulk('task', data)
    },
    async loadTasks() {
      const tasks = await api.find('task', {
        and: { user_id: this.user.id, state: {'<>': 'NEW' }},
        with: {
          project: { one: 'project' }
        },
        order: { sort_user: 'ASC' }
      })
      this.today = tasks.filter(t => t.state=='STARTED')
      this.current = tasks.filter(t => t.state!='STARTED')
    },
    async loadProjects() {
      this.allocations = await api.find('allocation', {
        and: { user_id: this.user.id },
        with: {
          project: { one: 'project' }
        },
      })
    },
  },
  async mounted() {
    this.loadTasks()
    this.loadProjects()
  },
}
</script>

<style lang="sass" scoped>
.task 
  margin-bottom: 5px
  cursor: pointer
  padding: 3px
  border-radius: 3px

  &.selected  
    background-color: #EEEEEE

  &:hover
    background-color: #EEEEEE

  .header
    color: #AAAAAA
    font-size: 80%

  a
    text-decoration: none

</style>