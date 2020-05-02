<template>
  <div class="components-container">

    <el-tabs v-model="activeTab">
      <el-tab-pane key="1" label="Details" name="1">
        <offer-details :id="$route.params.id" :oid="$route.params.oid"/>
      </el-tab-pane>
      <el-tab-pane key="2" label="Positions" name="2">
        <offer-positions :id="$route.params.id" :oid="$route.params.oid"/>
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>

import OfferDetails from './Details'
import OfferPositions from './Positions'

export default {
  name: 'OfferForm',
  components: { OfferDetails, OfferPositions },
  props: {},
  data() {
    return {
      activeTab: '1',
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
