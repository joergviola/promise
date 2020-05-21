import Home from '@/views/Home.vue'
import Parent from '@/router/view.vue'

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
        component: () => import('@/views/leads/Layout'),
        name: 'Lead',
        redirect: 'detail',
        children: [
          {
            path: 'detail',
            component: () => import('@/views/leads/Form'),
            name: 'Detail',
          },
          {
            path: 'offer/:oid/detail',
            component: () => import('@/views/offer/Form'),
            name: 'Offer',
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
        component: () => import('@/views/projects/Layout'),
        name: 'Project',
        redirect: 'detail',
        children: [
          {
            path: 'detail',
            component: () => import('@/views/projects/Form'),
            name: 'Detail',
          },
          {
            path: 'task/:tid/detail',
            component: () => import('@/views/task/Form'),
            name: 'Task',
          }
        ]
      }
    ]
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
