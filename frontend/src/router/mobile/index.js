export default [
  {
    path: '/mobile/login',
    name: 'MobileLogin',
    component: () => import('@/mobile/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/mobile',
    name: 'MobileHome',
    component: () => import('@/mobile/views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/schedule',
    name: 'MobileSchedule',
    component: () => import('@/mobile/views/ScheduleView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/schedule/form',
    name: 'MobileScheduleForm',
    component: () => import('@/mobile/views/ScheduleFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/schedule/list/:date',
    name: 'MobileScheduleList',
    component: () => import('@/mobile/views/ScheduleListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/schedule/:id',
    name: 'MobileScheduleDetail',
    component: () => import('@/mobile/views/ScheduleFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/search',
    name: 'MobileSearch',
    component: () => import('@/mobile/views/SearchView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/clients',
    name: 'MobileClientList',
    component: () => import('@/mobile/views/ClientListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/clients/form',
    name: 'MobileClientForm',
    component: () => import('@/mobile/views/ClientFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/clients/:id',
    name: 'MobileClientDetail',
    component: () => import('@/mobile/views/ClientDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/clients/:clientId/treatments',
    name: 'MobileTreatmentStatus',
    component: () => import('@/mobile/views/TreatmentStatusView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/treatments/:id',
    name: 'MobileTreatmentRecord',
    component: () => import('@/mobile/views/TreatmentRecordView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/settings',
    name: 'MobileSettings',
    component: () => import('@/mobile/views/SettingsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/settings/change-password',
    name: 'MobileChangePassword',
    component: () => import('@/mobile/views/ChangePasswordView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/settings/change-profile',
    name: 'MobileChangeProfile',
    component: () => import('@/mobile/views/ChangeProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/notifications',
    name: 'MobileNotifications',
    component: () => import('@/mobile/views/NotificationsView.vue'),
    meta: { requiresAuth: true }
  }
]

