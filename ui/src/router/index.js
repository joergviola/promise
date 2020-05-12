import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Home',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Home',
        meta: { title: 'Home', name: 'Home', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/users',
    component: Layout,
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
    component: Layout,
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
    component: Layout,
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
  // 404 page must be placed at the end !!!
  //{ path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
