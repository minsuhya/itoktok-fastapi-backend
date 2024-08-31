export default [
  {
    path: '/test',
    name: 'Test',
    children: [
      {
        path: 'user-list',
        name: 'TestUserList',
        component: () => import('@/views/test/UserList.vue')
      },
      {
        path: 'user-form',
        name: 'TestUserForm',
        component: () => import('@/views/test/UserForm.vue')
      }
    ]
  }
]
