<template>
    <el-container class="grid">
        <el-header class="header">
            <app-header />
        </el-header>
        <el-container>
            <el-aside class="sidebar" width="150px">
                <router-menu />
                <router-menu :bottom="true" />
                <div style="text-align: center; font-size: 70%; padding-bottom: 10px">
                    <router-link to="/version"><span>gluon 21.07.20</span></router-link>
                </div>
            </el-aside>
            <el-main class="content">
                <transition name="content">
                    <router-view ></router-view>
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import Header from '@/components/custom/Header'
import RouterMenu from 'gluon-frontend/gl-routerMenu'

export default {
  name: 'default-layout',
  components: {
    'app-header': Header,
    RouterMenu
  }
}
</script>

<style scoped>
.grid {
  grid-template-columns: 150px auto;
  grid-template-rows: 60px auto;
  grid-template-areas: 
    "header header"
    "sidebar content";
}

.grid .header {
    grid-area: header;
    border-bottom: 1px solid #DDDDDD; padding: 0
}

.grid .sidebar {
    grid-area: sidebar;
    background-color:#666666;
}

.grid .content {
    grid-area: content;
}

</style>