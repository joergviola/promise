<template>
  <div>
    <tabs component="ProjectTabs" :attrs="$attrs"/>
  </div>
</template>

<script>

import api from '@/api'
import Tabs from 'gluon-frontend/gl-tabs'
import store from '@/util/Store.js'

export default {
  name: 'ProjectTabs',
  components: {Tabs},
  props: {},
  data() {
    return {
      project: {  customer: {}},
      store: store,
    }
  },
  async mounted() {
    if (this.$route.params.id!='new') {
      this.project = await api.findFirst('project', { 
        and: { id: this.$route.params.id },
        with: { customer: {one: 'organisation', this: 'customer_id'} }
      })
      const breadcrumb = this.project.customer 
        ? `@${this.project.customer.name}: ${this.project.name}`
        : `@${this.project.name}`
      this.store.breadcrumbs = [null, breadcrumb, null]
    }
  },
  destroyed() {
    this.store.breadcrumbs = []
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 10px;
}

.name {
  font-size: 120%;
  font-weight: bold;
  padding-right: 1rem;
  margin-bottom: 10px;
}
</style>