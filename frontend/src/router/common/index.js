export default [
  {
    path: '/redirect',
    children: [
      {
        path: '/redirect/:path',
        name: 'redirect',
        component: () => import('@/views/redirect/IndexView.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/not-found/NotFound.vue')
  }
]
