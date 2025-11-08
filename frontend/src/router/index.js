import { isLogin } from '@/utils/token'
import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from './admin'
import commonRoutes from './common'
import mobileRoutes from './mobile'
import testRoutes from './test'

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
    ...mobileRoutes,
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLogin()) {
    // 모바일 경로인 경우 모바일 로그인으로 리다이렉트
    if (to.path.startsWith('/mobile')) {
      next({ name: 'MobileLogin' })
    } else {
      next({ name: 'Login' })
    }
  } else {
    next()
  }
})

export default router
