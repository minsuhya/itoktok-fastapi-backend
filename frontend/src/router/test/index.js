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
      },
      {
        path: 'validation-test',
        name: 'ValidationTest',
        component: () => import('@/views/test/ValidationTest.vue')
      },
      {
        path: 'dynamic-form-test',
        name: 'DynamicFormTest',
        component: () => import('@/views/test/ValidationTest2.vue')
      },
      {
        path: 'modal-form-test',
        name: 'ModalFormTest',
        component: () => import('@/views/test/ModalForm.vue')
      }
    ]
  }
]
