import { createRouter, createWebHistory } from 'vue-router'
import testRoutes from './test'
import commonRoutes from './common'
import adminRoutes from './admin'

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
      component: () => import('@/views/SignupView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    ...testRoutes,
    ...commonRoutes,
    ...adminRoutes
  ]
})

export default router
