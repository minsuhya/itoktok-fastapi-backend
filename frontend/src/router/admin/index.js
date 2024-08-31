import LayoutView from '@/components/LayoutView.vue'

export default [
  {
    path: '/admin',
    name: 'Admin',
    component: () => LayoutView,
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
        path: 'home',
        name: 'Home',
        component: () => import('@/views/HomeView.vue')
      },
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue')
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
        component: () => import('@/views/CounselorList.vue')
      },
      // 일별일정
      {
        path: 'daily',
        name: 'Daily',
        component: () => import('@/views/DailyView.vue')
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
