import { createWebHistory, createRouter } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (!localStorage.getItem('auth')) {
    if (to.path !== '/') router.push('/')
  } else {
    if (to.path === '/') {
      router.push('dashboard')
    }
  }
  next()
})

export default router
