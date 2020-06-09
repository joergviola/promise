import Home from '@/views/Home.vue'
import Parent from '@/router/view.vue'
import Tabs from '@/components/layout/Tabs.vue'

export default [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      icon: 'el-icon-s-home',
    }
  },
  {
    path: '/users',
    component: Parent,
    name: 'Users',
    meta: {
      icon: 'el-icon-s-custom'
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
    path: '/leads',
    component: Parent,
    name: 'Leads',
    meta: {
      icon: 'el-icon-shopping-cart-2'
    },
    redirect: '/leads/all',
    children: [
      {
        path: 'all',
        component: () => import('@/views/leads/List'),
        name: 'All',
      },
      {
        path: 'lead/:id',
        component: Tabs,
        name: 'Lead',
        props: true,
        redirect: 'detail',
        children: [
          {
            path: 'detail',
            component: () => import('@/views/leads/Details'),
            props: true,
            name: 'Lead-Detail',
            meta: {
              title: 'Detail'
            },
          },
          {
            path: 'timeline',
            component: () => import('@/views/leads/Timeline'),
            props: true,
            name: 'Lead-Timeline',
            meta: {
              title: 'Timeline'
            },
          },
          {
            path: 'tasks',
            component: () => import('@/views/leads/Tasks'),
            props: true,
            name: 'Lead-Tasks',
            meta: {
              title: 'Tasks'
            },
          },
          {
            path: 'offers',
            component: () => import('@/views/leads/Offers'),
            props: true,
            name: 'Offers',
          },
          {
            path: 'offer/:oid/detail',
            component: () => import('@/views/offer/Details'),
            props: true,
            name: 'Offer',
          },
          {
            path: 'offer/:oid/positions',
            component: () => import('@/views/offer/Positions'),
            props: true,
            name: 'Positions',
          }
        ]
      },
    ]
  },
  {
    path: '/planning',
    component: () => import('@/views/planning/Gantt'),
    name: 'Planning',
    meta: {
      icon: 'el-icon-date'
    },
  },
  {
    path: '/projects',
    component: Parent,
    name: 'Projects',
    meta: {
      icon: 'el-icon-folder'
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
        component: Tabs,
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
              title: 'Tasks'
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
            component: () => import('@/views/commons/Timeline'),
            props: true,
            name: 'Work',
          },
          {
            path: 'board',
            component: () => import('@/views/projects/Board'),
            props: true,
            name: 'Board',
          },
          {
            path: 'team',
            component: () => import('@/views/projects/Team'),
            props: true,
            name: 'Team',
          },
          {
            path: 'state',
            component: () => import('@/views/projects/Burndown'),
            props: true,
            name: 'State',
          },
          {
            path: 'timeline',
            component: () => import('@/views/projects/Timeline'),
            props: true,
            name: 'Project-Timeline',
            meta: {
              title: 'Timeline'
            },
          },
        ]
      }
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
  }
]
