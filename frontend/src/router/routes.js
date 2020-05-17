import Home from '@/views/Home.vue'
import Parent from '@/router/view.vue'

export default [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      icon: 'el-icon-s-home',
      layout: 'default'
    }
  },
  {
    path: '/users',
    component: Parent,
    name: 'Users',
    meta: {
      title: 'Users',
      icon: 'user'
    },
    redirect: '/users/all',
    children: [
      {
        path: 'all',
        component: () => import('@/views/users/List'),
        name: 'All',
        meta: { title: 'Users', icon: 'people' }
      },
      {
        path: ':id/detail',
        component: () => import('@/views/users/Form'),
        hidden: true,
        name: 'User',
        meta: { title: 'User' }
      },
    ]
  },
  {
    path: '/leads',
    component: Parent,
    name: 'Leads',
    meta: {
      title: 'Leads',
      icon: 'table'
    },
    redirect: '/leads/all',
    children: [
      {
        path: 'all',
        component: () => import('@/views/leads/List'),
        name: 'All',
        hidden: true,
        meta: { title: 'All' }
      },
      {
        path: 'lead/:id',
        component: () => import('@/views/leads/Layout'),
        hidden: true,
        name: 'Lead',
        meta: { title: 'Lead' },
        redirect: 'detail',
        children: [
          {
            path: 'detail',
            component: () => import('@/views/leads/Form'),
            hidden: true,
            name: 'Detail',
            meta: { title: 'Detail', breadcrumb: false },
          },
          {
            path: 'offer/:oid/detail',
            component: () => import('@/views/offer/Form'),
            hidden: true,
            name: 'Offer',
            meta: { title: 'Offer' }
          }
            ]
      },
    ]
  },
  {
    path: '/projects',
    component: Parent,
    name: 'Projects',
    meta: {
      title: 'Projects',
      icon: 'education'
    },
    redirect: '/projects/all',
    children: [
      {
        path: 'all',
        component: () => import('@/views/projects/List'),
        name: 'All',
        hidden: true,
        meta: { title: 'All' }
      },
      {
        path: 'project/:id',
        component: () => import('@/views/projects/Layout'),
        hidden: true,
        name: 'Project',
        meta: { title: 'Project' },
        redirect: 'detail',
        children: [
          {
            path: 'detail',
            component: () => import('@/views/projects/Form'),
            hidden: true,
            name: 'Detail',
            meta: { title: 'Detail', breadcrumb: false },
          },
          {
            path: 'task/:tid/detail',
            component: () => import('@/views/task/Form'),
            hidden: true,
            name: 'Task',
            meta: { title: 'Task' }
          }
        ]
      }
    ]
  },
   
  {
    path: '/user',
    name: 'Users',
    component: () => import('@/views/admin/users/Index.vue'),
    meta: {
      icon: 'el-icon-s-home',
      layout: 'default',
      redirect: 'all'
    },
    children: [
      {
        path: 'all',
        name: 'All',
        component: () => import('@/views/admin/users/List.vue'),
      },
      {
        path: ':id/detail',
        name: 'Detail',
        component: () => import('@/views/admin/users/Form.vue'),
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/auth/Login.vue'),
    meta: {
      icon: 'el-icon-edit',
      layout: 'no-sidebar',
      hidden: true,
      noAuth: true
    }
  }
]
