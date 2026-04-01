import { isLogin } from '@/utils/token'
import { useUserStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from './admin'
import commonRoutes from './common'
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
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLogin()) {
    next({ name: 'Login' })
    return
  }

  const allowedRoles = to.meta.allowedRoles || to.matched.find(r => r.meta.allowedRoles)?.meta.allowedRoles
  if (allowedRoles) {
    const userStore = useUserStore()
    if (!userStore.role || !allowedRoles.includes(userStore.role)) {
      next({ name: 'Weekly' })
      return
    }
  }

  next()
})

export default router
