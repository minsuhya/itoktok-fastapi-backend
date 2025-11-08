<template>
  <MobileLayout
    header-title="비밀번호 변경"
    :show-back="true"
    active-tab="profile"
    @back="handleBack"
  >
    <div class="p-4">
      <Form @submit="onSubmit" :validation-schema="schema" class="space-y-4">
        <!-- 현재 비밀번호 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            현재 비밀번호 <span class="text-red-500">*</span>
          </label>
          <Field 
            name="current_password" 
            type="password" 
            v-model="form.current_password"
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
            placeholder="현재 비밀번호를 입력하세요" 
          />
          <ErrorMessage name="current_password" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 새 비밀번호 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            새 비밀번호 <span class="text-red-500">*</span>
          </label>
          <Field 
            name="new_password" 
            type="password" 
            v-model="form.new_password"
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
            placeholder="새 비밀번호를 입력하세요" 
          />
          <ErrorMessage name="new_password" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 새 비밀번호 확인 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            새 비밀번호 확인 <span class="text-red-500">*</span>
          </label>
          <Field 
            name="confirm_password" 
            type="password" 
            v-model="form.confirm_password"
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
            placeholder="새 비밀번호를 다시 입력하세요" 
          />
          <ErrorMessage name="confirm_password" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 버튼 -->
        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white rounded-md py-3 font-semibold"
        >
          변경
        </button>
      </Form>
    </div>
  </MobileLayout>
</template>

<script setup>
import { inject, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ErrorMessage, Field, Form } from 'vee-validate'
import * as yup from 'yup'
import MobileLayout from '@/mobile/components/MobileLayout.vue'
// import { changePassword } from '@/api/user' // API가 있다면 사용

const router = useRouter()
const showModal = inject('showModal', () => {})

const schema = yup.object({
  current_password: yup.string().required('현재 비밀번호를 입력해주세요.'),
  new_password: yup.string()
    .required('새 비밀번호를 입력해주세요.')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  confirm_password: yup.string()
    .required('새 비밀번호 확인을 입력해주세요.')
    .oneOf([yup.ref('new_password')], '비밀번호가 일치하지 않습니다.')
})

const form = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const handleBack = () => {
  router.back()
}

const onSubmit = async (values) => {
  try {
    // TODO: 실제 API 호출로 대체
    // await changePassword(values)
    showModal('비밀번호가 변경되었습니다.')
    router.back()
  } catch (error) {
    showModal('비밀번호 변경 중 오류가 발생했습니다.')
    console.error('Error changing password:', error)
  }
}
</script>

