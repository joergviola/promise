<template>
  <div class="components-container">

    <el-tabs v-model="activeTab">
      <el-tab-pane key="1" label="Details" name="1">
        <project-details :id="$route.params.id" @change="p => project=p" />
      </el-tab-pane>
      <el-tab-pane key="2" label="Tasks" name="2">
        <project-tasks :id="$route.params.id" />
      </el-tab-pane>
      <el-tab-pane key="3" label="Board" name="3">
        <project-board :id="$route.params.id" />
      </el-tab-pane>
      <el-tab-pane key="4" label="Team" name="4">
        <project-team :id="$route.params.id" />
      </el-tab-pane>
      <el-tab-pane key="5" label="State" name="5">
        <project-burndown :id="$route.params.id" />
      </el-tab-pane>
      <el-tab-pane key="6" label="Timeline" name="6">
        <project-timeline :id="$route.params.id" />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>

import ProjectDetails from './Details'
import ProjectTasks from './Tasks'
import ProjectBoard from './Board'
import ProjectTeam from './Team'
import ProjectBurndown from './Burndown'
import ProjectTimeline from './Timeline'

export default {
  name: 'ProjectForm',
  components: { ProjectDetails, ProjectBoard, ProjectTasks, ProjectTeam, ProjectBurndown, ProjectTimeline },
  props: {},
  data() {
    return {
      activeTab: '1',
      project: null
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
