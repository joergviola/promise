<template>
  <div class="components-container">
    <h4>{{user.name}}</h4>
    <el-tabs v-model="activeTab">
      <el-tab-pane lazy key="1" label="Details" name="1">
        <user-details :id="$route.params.id" :tid="$route.params.tid" v-on:update="t => user = t" />
      </el-tab-pane>
      <el-tab-pane v-if="employee" lazy key="2" label="Timeline" name="2">
        <user-timeline :user="user" />
      </el-tab-pane>
      <el-tab-pane v-if="employee" lazy key="3" label="Contracts" name="3">
        <user-allocations :user="user" :types="['CONTRACT']" />
      </el-tab-pane>
      <el-tab-pane v-if="employee" lazy key="4" label="Times off" name="4">
        <user-allocations :user="user" :types="['HOLIDAY','ILL']" />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>

import UserDetails from './Details'
import UserTimeline from './Timeline'
import UserAllocations from './Allocations'
import api from '@/api'

export default {
  name: 'UserForm',
  components: { UserDetails, UserTimeline, UserAllocations },
  props: {},
  data() {
    return {
      user: {},
      activeTab: '1'
    }
  },
  computed: {
    employee() { return this.user.organisation_id === api.user().organisation_id }
  }
}
</script>

<style lang="scss" scoped>
</style>
