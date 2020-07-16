<template>
  <div class="components-container">
    <h4>{{task.name}}</h4>
    <el-row>
      <el-col :xs="24" :md="12">
        <el-tabs v-model="activeTab">
          <el-tab-pane lazy key="1" label="Details" name="1">
            <task-details :id="$route.params.id" :tid="$route.params.tid" v-on:update="t => task = t" />
          </el-tab-pane>
          <el-tab-pane lazy key="2" label="Timeline" name="2">
            <task-timeline :id="$route.params.id" :task="task" :history="true" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :xs="24" :md="12">
        <img width="100%" :src="image">
      </el-col>
    </el-row>
  </div>
</template>

<script>

import TaskDetails from './Details'
import TaskTimeline from '@/components/custom/Timeline'
import image from '@/assets/img/undraw_task_31wc.svg'

export default {
  name: 'TaskForm',
  components: { TaskDetails, TaskTimeline },
  props: {},
  data() {
    return {
      task: {state:null},
      activeTab: '1',
      image: image
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
