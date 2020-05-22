<template>
  <div class="components-container">
    <div style="display: none/*flex*/; justify-content: flex-start; align-items: baseline;">
      <h3 style="margin-top: 0em; margin-bottom: 0em">{{item.name}}</h3>
      <small style="padding-left: 2em;">
        <span v-if="item.customer.name">{{item.customer.name}}</span>
        <span v-if="item.customer.website"><a :href="item.customer.website">{{item.customer.website}}</a>,</span>
        <span v-if="item.contact.user.name">{{item.contact.user.name}},</span>
        <span v-if="item.contact.user.phone">{{item.contact.user.phone}},</span>
        <span v-if="item.contact.user.email"><a :href="'mailto:'+item.contact.user.email">{{item.contact.user.email}}</a></span>
      </small>
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
