import Home from '@/views/Home.vue'
import Parent from '@/router/view.vue'
import Tabs from '@/components/layout/Tabs.vue'
import List from '@/components/generic/List.vue'
import Details from '@/components/generic/Details.vue'

import ProjectTabs from '@/components/custom/ProjectTabs'
import organisations from './organisations'
import sales from './sales'


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
  {
    path: '/planning',
    component: () => import('@/views/planning/Gantt'),
    name: 'Planning',
    meta: {
      icon: 'el-icon-date',
      roles: ['Admin']
    },
  },
  {
    path: '/projects',
    component: Parent,
    name: 'Projects',
    meta: {
      icon: 'el-icon-folder',
    },
    redirect: '/projects/all',
    children: [
      {
        path: 'all',
        component: () => import('@/views/projects/List'),
        name: 'All',
      },
      {
        path: 'project/:id',
        component: ProjectTabs,
        props: true,
        name: 'Project',
        redirect: 'detail',
        children: [
          {
            path: 'detail',
            component: () => import('@/views/projects/Details'),
            props: true,
            name: 'Project-Detail',
            meta: {
              title: 'Detail'
            },
          },
          {
            path: 'tasks',
            component: () => import('@/views/projects/Tasks'),
            props: true,
            name: 'Project-Tasks',
            meta: {
              title: 'Tasks',
              show: params => params.id!='new'
            },
          },
          {
            path: 'task/:tid/detail',
            component: () => import('@/views/task/Details'),
            props: true,
            name: 'Task',
          },
          {
            path: 'task/:tid/timeline',
            component: () => import('@/components/custom/Timeline'),
            props: true,
            name: 'Work',
          },
          {
            path: 'board',
            component: () => import('@/views/projects/Board'),
            props: true,
            name: 'Board',
            meta: {
              show: params => params.id!='new'
            },
          },
          {
            path: 'team',
            component: () => import('@/views/projects/Team'),
            props: true,
            name: 'Team',
            meta: {
              show: params => params.id!='new'
            },
          },
          {
            path: 'state',
            component: () => import('@/views/projects/Burndown'),
            props: true,
            name: 'State',
            meta: {
              show: params => params.id!='new'
            },
          },
          {
            path: 'timeline',
            component: () => import('@/views/projects/Timeline'),
            props: true,
            name: 'Project-Timeline',
            meta: {
              title: 'Timeline',
              show: params => params.id!='new'
            },
          },
        ]
      }
    ]
  },
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
