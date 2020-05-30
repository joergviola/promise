<template>
  <div class="components-container">
    <div style="display: none/*flex*/; justify-content: flex-start; align-items: baseline;">
    </div>
    <el-tabs v-model="activeTab">
      <el-tab-pane key="1" label="Details" name="1">
        <lead-details @update="i => item = i" />
      </el-tab-pane>
      <el-tab-pane lazy key="2" label="Timeline" name="2">
        <lead-timeline :id="$route.params.id" />
      </el-tab-pane>
      <el-tab-pane lazy key="3" label="Tasks" name="3">
        <lead-tasks :id="$route.params.id" />
      </el-tab-pane>
      <el-tab-pane lazy key="4" label="Offers" name="4">
        <lead-offers :id="$route.params.id"  />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>

import LeadDetails from './Details'
import LeadTasks from './Tasks'
import LeadTimeline from './Timeline'
import LeadOffers from './Offers'

export default {
  name: 'LeadForm',
  components: { LeadDetails, LeadTimeline, LeadTasks, LeadOffers },
  props: {},
  data() {
    return {
      activeTab: '1',
      item: {customer:{}, contact:{user:{}}}
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
