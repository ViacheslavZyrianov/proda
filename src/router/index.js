import { createWebHistory, createRouter } from 'vue-router'
import routes from './routes'

const router = createRouter({
  mode: 'hash',
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (!localStorage.getItem('auth')) {
    if (to.path !== '/') router.push('/')
  }
  next()
})

export default router
