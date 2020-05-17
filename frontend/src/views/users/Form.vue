<template>
  <div class="components-container">
    <h4>{{user.name}}</h4>
    <el-tabs v-model="activeTab">
      <el-tab-pane lazy key="1" label="Details" name="1">
        <user-details :id="$route.params.id" :tid="$route.params.tid" v-on:update="t => user = t" />
      </el-tab-pane>
      <el-tab-pane lazy key="2" label="Timeline" name="2">
        <user-timeline :id="$route.params.id" />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>

import UserDetails from './Details'
import UserTimeline from './Timeline'

export default {
  name: 'TaskForm',
  components: { UserDetails, UserTimeline },
  props: {},
  data() {
    return {
      user: {},
      activeTab: '1'
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
