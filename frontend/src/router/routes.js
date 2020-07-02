import Home from '@/views/Home.vue'
import Parent from '@/router/view.vue'
import Tabs from '@/components/layout/Tabs.vue'
import List from '@/components/generic/List.vue'
import Details from '@/components/generic/Details.vue'

import ProjectTabs from '@/components/custom/ProjectTabs'
import organisations from './organisations'


export default [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      icon: 'el-icon-s-home',
    }
  },
//  organisations,
  {
    path: '/users',
    component: Parent,
    name: 'Users',
    meta: {
      icon: 'el-icon-s-custom',
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
    path: '/leads',
    component: Parent,
    name: 'Sales',
    meta: {
      icon: 'el-icon-shopping-cart-2'
    },
    redirect: '/leads/all',
    children: [
      {
        path: 'all',
        component: () => import('@/views/leads/List'),
        name: 'Leads',
      },
      {
        path: 'lead/:id',
        component: ProjectTabs,
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
              title: 'Timeline',
              roles: ['Admin']
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
            component: List,
            props: route => ({
              type: 'accounting',
              template: { project_id: route.params.id, type: 'QUOTE', state: 'NEW', pricePerUnit: 100, percentBuffer: 15, rounding: "10" },
              query: { project_id: route.params.id, type: 'QUOTE' },
              with: { },
              type: 'accounting',
              columns: [
                { name: 'name', editable: true, placeholder: "New Offer..." },
                { name: 'price', editable: false },
                { name: 'state', editable: false },
                { name: 'approved_at', editable: false },
              ],
              createBy: "button",
              detail: 'offer',
              allowDelete: true,
            }),
            name: 'Offers',
            meta: {
              roles: ['Admin']
            },
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
      roles: ['Admin']
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
            component: () => import('@/components/custom/Timeline'),
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
