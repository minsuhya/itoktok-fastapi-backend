export default [
  {
    path: '/redirect',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/redirect/:path',
        name: 'redirect',
        component: () => import('@/views/redirect/index.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/not-found/index.vue')
  }
]
