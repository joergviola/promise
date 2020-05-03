<template>
  <div class="components-container">
    <h2>{{task.name}}</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane key="1" label="Details" name="1">
        <task-details :id="$route.params.id" :tid="$route.params.tid" v-on:update="t => task = t" />
      </el-tab-pane>
      <el-tab-pane key="2" label="Timeline" name="2">
        <task-timeline :id="$route.params.id" :task="task" />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>

import TaskDetails from './Details'
import TaskTimeline from './Timeline'

export default {
  name: 'TaskForm',
  components: { TaskDetails, TaskTimeline },
  props: {},
  data() {
    return {
      task: {state:null},
      activeTab: '1'
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
