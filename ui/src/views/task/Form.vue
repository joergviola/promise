<template>
  <div class="components-container">

    <el-tabs v-model="activeTab">
      <el-tab-pane key="1" label="Details" name="1">
        <task-details :id="$route.params.id" :oid="$route.params.tid"/>
      </el-tab-pane>
      <el-tab-pane key="2" label="Timeline" name="2">
        <task-timeline :id="$route.params.id" :oid="$route.params.tid"/>
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
      activeTab: '1'
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
