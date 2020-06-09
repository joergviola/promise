<template>
  <div class="components-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :router="true">
       <el-menu-item 
        v-for="route in childRoutes" 
        v-if="valid(route)"
        :key="route.name" 
        :route="{name: route.name}" 
        :index="route.name" 
      >{{(route.meta && route.meta.title) || route.name}}</el-menu-item>
    </el-menu>
    <div class="padd">
      <router-view ></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Tabs',
  props: {},
  computed: {
    childRoutes() {
      const route = this.findRoute(this.$router.options.routes)
      return route ? route.children || [] : []
    },
    activeIndex() {
      return this.$route.name
    }
  },
  data() {
    return {
    }
  },
  methods: {
    findRoute(routes) {
      let path = ""
      let route = null
      for (let i=0; i<this.$route.matched.length; i++) {
        const match = this.$route.matched[i]
        route = routes.find(r => (r.path.startsWith('/') ? r.path : path+'/'+r.path)==match.path)
        if (!route) return null
        if (route.component.name=='Tabs') return route
        routes = route.children
        if (!routes) return null
        path = route.path.startsWith('/') ? route.path : path+'/'+route.path
      }
      return route
    },
    valid(route) {
      let path = route.path
      for (let key in this.$attrs) {
        path = path.replace(':'+key, this.$attrs[key])
      }
      return path.indexOf(':')==-1
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu--horizontal > .el-menu-item {
  height: 30px;
  line-height: 30px;
}

.padd {
  margin-top: 1rem;
}
</style>
