<template>
  <div class="components-container">
    <h2>{{$t('ui.home.welcome', {user: user.name}) }}</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="mb-4">
          <div slot="header" class="card-header">
            <h4>{{$t('ui.home.today')}}</h4>
          </div>
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
                  {{task.due_at | dateHuman}}
                </span>
              </div>
              <div class="body pull-clear">
                {{task.name}}
                <router-link :to="`/projects/project/${task.project.id}/task/${task.id}/detail`">
                  &gt;
                </router-link>
              </div>
              <progress-bar
                :used="task.used"
                :planned="task.planned"
                :width="2"
              />
            </div>
          </draggable>
        </el-card>
        <el-card>
          <div slot="header" class="card-header">
            <h4>{{$t('ui.home.upcoming')}}</h4>
          </div>
          <draggable class="list-group" :list="current" group="tasks" @change="dragCurrent">
            <div v-for="task in current" :class="['task', {selected: selected==task}]" :key="task.id" @click="selected = task">
              <div class="header">
                {{task.project.name}}
                <router-link :to="`/projects/project/${task.project.id}/detail`">
                    &gt;
                </router-link>
                <span v-if="task.due_at" class="pull-right">
                  {{task.due_at | dateHuman}}
                </span>
              </div>
              <div class="body">
                {{task.name}} 
                <router-link :to="`/projects/project/${task.project.id}/task/${task.id}/detail`">
                    &gt;
                </router-link>
              </div>
              <progress-bar
                :used="task.used"
                :planned="task.planned"
                :width="2"
              />
            </div>
          </draggable>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header"class="card-header">
            <h4 v-if="selected">{{selected.name}}</h4>
            <h4 v-if="!selected">{{$t('ui.home.notask')}}</h4>
          </div>
          <task-timeline v-if="selected" :tid="selected.id" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card v-if="actions.length>0" class="mb-4">
          <div slot="header" class="card-header">
            <h4>{{$t('ui.home.otherTasks')}}</h4>
          </div>
          <div v-for="action in actions" class="task" :key="action.task.id"  @click="selected = action.task">
            <div class="header">
                {{action.task.project.name}}
                <router-link :to="`/projects/project/${action.task.project_id}/detail`">
                    &gt;
                </router-link>
              <span class="pull-right"> 
                {{action.fr | date}}
              </span>
            </div>
            <div class="body pull-clear">
                {{action.task.name}} 
                <router-link :to="`/projects/project/${action.task.project_id}/task/${action.task.id}/detail`">
                    &gt;
                </router-link>
            </div>
            <progress-bar
              :used="action.task.used"
              :planned="action.task.planned"
              :width="2"
            />
          </div>
        </el-card>
        <el-card>
          <div slot="header" class="card-header">
            <h4>{{$t('ui.home.projects')}}</h4>
          </div>
          <div v-for="allocation in allocations" class="task" :key="allocation.id">
            <div class="header">
              {{allocation.role}}
              <span class="pull-right"> 
                {{allocation.project.starts_at | date}} - {{allocation.project.ends_at | date}}
              </span>
            </div>
            <div class="body pull-clear">
                {{allocation.project.name}} 
                <router-link v-if="allocation.project.state=='LEAD'" :to="`/leads/lead/${allocation.project.id}/detail`">
                  &gt;
                </router-link>
                <router-link v-else :to="`/projects/project/${allocation.project.id}/detail`">
                  &gt;
                </router-link>
            </div>
            <progress-bar
              :used="allocation.project.used"
              :planned="allocation.project.planned"
              :width="2"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GenericList from '@/components/generic/List'
import ProgressBar from '@/components/generic/Progress'
import TaskTimeline from '@/components/custom/Timeline'
import Draggable from 'vuedraggable'
import api from '@/api'

export default {
  name: 'Dashboard',
  components: { GenericList, TaskTimeline, Draggable, ProgressBar },
  data() {
    return {
      user: api.user(),
      today: [],
      current: [],
      allocations: [],
      actions: [],
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
      this.today = tasks.filter(t => t.state=='STARTED' && !t.project.template)
      this.current = tasks.filter(t => (t.state=='APPROVED' || t.state=='PLANNED') && !t.project.template)
    },
    async loadProjects() {
      const allocations = await api.find('allocation', {
        and: { user_id: this.user.id, type: 'PROJECT' },
        with: {
          project: { one: 'project' }
        },
      })
      this.allocations = allocations.filter(a => !a.project.template)
    },
    async loadActions() {
      const actions = await api.find('action', {
        select: ['task_id', {max: 'from', as: 'fr'}],
        group: ['task_id'],
        and: { 'action.user_id': this.user.id },
        with: {
          task: { 
            one: 'task',
            query: {
              with: {
                project: { one: 'project' }
              },
            }
          },
        },
        order: {'fr': 'DESC'},
      })
      this.actions = actions.filter(action => action.task.user_id!=this.user.id)
    },
  },
  async mounted() {
    this.loadTasks()
    this.loadProjects()
    this.loadActions()
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

.mb-4
  margin-bottom: 20px

.card-header
  height: 20px 
  margin-top: -20px 
</style>