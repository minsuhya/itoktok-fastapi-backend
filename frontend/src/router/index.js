import { createRouter, createWebHistory } from 'vue-router'
import { isLogin } from '@/utils/token'
import testRoutes from './test'
import commonRoutes from './common'
import adminRoutes from './admin'
import ProgramView from '../views/ProgramView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'Login' }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/forgot-password',
      name: 'Forgot-Password',
      component: () => import('@/views/ForgotPassword.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/views/SignupView2.vue'),
      meta: {
        requiresAuth: false
      }
    },
    ...testRoutes,
    ...commonRoutes,
    ...adminRoutes,
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLogin()) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
