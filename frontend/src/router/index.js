import { createRouter, createWebHistory } from 'vue-router'
import { isLogin } from '@/utils/token'
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
      component: () => import('@/views/SignupView2.vue'),
      meta: {
        requiresAuth: false
      }
    },
    ...testRoutes,
    ...commonRoutes,
    ...adminRoutes
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 인증이 필요한 경로에 접근하려고 할 때
    if (!isLogin()) {
      // 인증되지 않은 경우 로그인 페이지로 리디렉션
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // 인증된 경우 다음으로 진행
      next()
    }
  } else {
    // 인증이 필요하지 않은 경로는 그냥 진행
    next()
  }
})

export default router
