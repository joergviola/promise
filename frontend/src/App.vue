<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>

  </div>
</template>

<script>

import DefaultLayout from '@/layouts/Default'
import NoSidebarLayout from '@/layouts/NoSidebar'

export default {
  components: {DefaultLayout, NoSidebarLayout},
  computed: {
    layout() {
      return (this.$route.meta.layout || 'default') + '-layout'
    }
  },
  mounted () {
    document.addEventListener('swUpdated', this.showRefreshUI);
  },
  beforeDestroy () {
    document.removeEventListener('swUpdated', this.showRefreshUI);
  },
  methods: {
    async showRefreshUI() {
      try {
        await this.$confirm('New version is available', 'Reload?', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        })
      } catch (cancel) {
        return
      }
      window.location.reload(true)
    }
  }
}
</script>

<style lang="scss">
@import 'assets/css/main.scss';
</style>
