<template>
  <gl-header>
    <span slot="custom" class="timer">
      <router-link v-if="store.action" :to="route">{{duration}}</router-link>
    </span>
  </gl-header>
</template>

<script>
import GlHeader from 'gluon-frontend/gl-header'
import store from '@/util/Store.js'
import moment from 'moment'

export default {
  name: 'CustomHeader',
  components: {GlHeader},
  data() {
    return {
      store: store,
    }
  },
  computed: {
    duration() {
      if (!store.action) return null
      const duration = moment.duration(moment().diff(moment(store.action.from)))
      return moment.utc(duration.asMilliseconds()).format("HH:mm")
    },
    route() {
      if (!store.action) return null
      const pid = store.action.project_id
      const tid = store.action.task_id
      return {
        path: `/projects/project/${pid}/task/${tid}/timeline`
      }
    }
  },
}
</script>

<style scoped>
.timer a {
  text-decoration: none;
}
</style>