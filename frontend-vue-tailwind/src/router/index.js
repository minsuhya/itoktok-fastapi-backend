import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/CalendarView.vue')
    },
    {
      path: '/calendar2',
      name: 'calendar2',
      component: () => import('../views/CalendarView2.vue')
    },
    {
      path: '/calendar3',
      name: 'calendar3',
      component: () => import('../views/CalendarView3.vue')
    },
    {
      path: '/table',
      name: 'table',
      component: () => import('../views/TableView.vue')
    },
    {
      path: '/float',
      name: 'float',
      component: () => import('../views/FloatView.vue')
    },
    {
      path: '/daily',
      name: 'daily',
      component: () => import('../views/DailyView.vue')
    }
  ]
})

// route gruards
router.beforeEach((to, from, next) => {
  // Redirect to login page if not authenticated
  if (to.name !== 'login' && !localStorage.getItem('authToken')) next({ name: 'login' })
  else next()
})

export default router
