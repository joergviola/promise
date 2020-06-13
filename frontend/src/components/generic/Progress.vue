<template>
  <el-tooltip
    class="item"
    effect="dark"
    placement="top-start"
  >
    <div slot="content">
      <span v-if="!used && !planned">Not worked on, no planned budget</span>
      <span v-else-if="!planned">{{used}}, but no planned budget</span>
      <span v-else-if="!used">0 of {{planned}}</span>
      <span v-else-if="status=='exception'">{{Math.round(used/planned*100-100)}}% OVERRUN! {{used}} of {{planned}}</span>
      <span v-else-if="status=='warning'">{{percentage}}% warning, {{used}} of {{planned}}</span>
      <span v-else>{{used}} of {{planned}}</span>
    </div>
    <div
      class="el-progress"
      :class="[
        'el-progress--' + type,
        {'blink': status=='exception'},
        'el-progress--without-text',
      ]"
      role="progressbar"
      :aria-valuenow="percentage"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="el-progress-bar" v-if="type === 'line'">
        <div class="el-progress-bar__outer" :style="backStyle">
          <div class="el-progress-bar__inner" :style="barStyle">
          </div>
        </div>
      </div>
    </div>
</el-tooltip>

</template>

<script>
export default {
  name: 'Progress',
  props: ['used', 'planned', 'width'],
  data() {
    return {
      type: 'line'
    }
  },
  computed: {
    percentage() {
      if (!this.used) return 0
      if (!this.planned) return 100
      const progress = this.used<this.planned 
        ? this.used / this.planned
        : 1-((this.used-this.planned) / this.used)
      return Math.round(100.0 * progress)
    },
    status() {
      if (!this.used) return 'success'
      if (!this.planned) return 'exception'
      const progress = this.used / this.planned
      if (progress <= 0.8) return 'success'
      if (progress <= 1.0) return 'warning'
      return 'exception'
    },
    barStyle() {
      const style = {};
      style.width = this.percentage + '%';
      // if (this.used > this.planned) {
      //  style.marginLeft = (100-this.percentage) + '%'
      // }
//      style.backgroundColor = this.getCurrentColor(this.percentage);
      return style;
    },
    backStyle() {
      const style = {};
      style.height = (this.width||12) + 'px';
      if (this.used > this.planned) {
        style.backgroundColor = '#CC8844';
      }
      return style;
    },
  
  }
}
</script>

<style>
@keyframes blink {
  50% { opacity: 0.0; } }
@-webkit-keyframes blink {
  50% { opacity: 0.0; } }
.blink {
    animation: blink 2s  5;
    -webkit-animation: blink 2s 5;
}
</style>