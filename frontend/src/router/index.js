import Vue from 'vue'
import VueRouter from 'vue-router'
import api from '@/api'
import routes from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.redirect) {
    next({path: to.path+"/"+to.meta.redirect})
  } else if (to.meta.noAuth) {
    next()
  } else {
    const user = api.user()
    if (!user) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

export default router
