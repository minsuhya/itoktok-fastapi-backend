import LayoutView from '@/components/LayoutView.vue'

export default [
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/components/LayoutView.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/AboutView.vue')
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/HomeView.vue')
      },
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/MonthlyView.vue')
      },
      // 내정보
      {
        path: 'myinfo',
        name: 'MyInfo',
        component: () => import('@/views/MyPageView.vue')
      },
      // 내담자 관리
      {
        path: 'client',
        name: 'Client',
        component: () => import('@/views/ClientList.vue')
      },
      // 상담장 관리
      {
        path: 'counselor',
        name: 'Counselor',
        component: () => import('@/views/UserList.vue')
      },
      // 일별일정
      {
        path: 'weekly',
        name: 'Weekly',
        component: () => import('@/views/WeeklyView.vue')
      },
      // 월별일정
      {
        path: 'monthly',
        name: 'Monthly',
        component: () => import('@/views/MonthlyView.vue')
      }
    ]
  }
]
