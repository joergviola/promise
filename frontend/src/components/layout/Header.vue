<template>
    <div style="display: flex;">
        <div style="width: 150px;" >
            <img height="50px" style="margin: 5px" src="@/assets/img/logo.png" />
        </div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 60px; line-height: 60px">
            <el-breadcrumb-item 
                v-for="(m,i) in $route.matched"
                :to="{ path: m.path }"
                :key="i"
            >{{m.name}}</el-breadcrumb-item>
        </el-breadcrumb>            
        <el-dropdown style="height: 60px; line-height: 60px; margin-left: auto;margin-right: 5px">
            <span class="el-dropdown-link text-right">
                {{user.name}}
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><a @click.prevent="logout">Logout</a></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>

import api from '@/api'

export default {
    name: "Header",
    data() {
        return {
            user: api.user()
        }
    },
    methods: {
        async logout() {
            await api.logout()
            this.$router.push("/login")
        }
    }
}
</script>