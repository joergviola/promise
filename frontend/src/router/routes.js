import Home from '@/views/Home.vue'
import Parent from '@/router/view.vue'

import organisations from './organisations'
import sales from './sales'
import planning from './planning'
import projects from './projects'


export default [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      icon: 'el-icon-s-home',
    }
  },
  organisations,
  sales,
  planning,
  projects,
  {
    path: '/users',
    component: Parent,
    name: 'Users',
    meta: {
      icon: 'el-icon-s-custom',
      bottom: true,
      roles: ['Admin']
    },
    redirect: '/users/all',
    children: [
      {
        path: 'all',
        component: () => import('@/views/users/List'),
        name: 'All',
      },
      {
        path: ':id/detail',
        component: () => import('@/views/users/Form'),
        name: 'User',
      },
    ]
  },
  {
    path: '/roles',
    name: 'Roles',
    component: () => import('@/views/admin/roles/Index.vue'),
    meta: {
      icon: 'el-icon-s-home',
      layout: 'default',
      bottom: true,
      roles: ['Admin']
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: {
      layout: 'no-sidebar',
      hidden: true,
      noAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue'),
    meta: {
      layout: 'no-sidebar',
      hidden: true,
      noAuth: true
    }
  },
  {
    path: '/version',
    name: 'Version',
    component: () => import('../views/Version.vue'),
    meta: {
      hidden: true,
    }
  },
]
