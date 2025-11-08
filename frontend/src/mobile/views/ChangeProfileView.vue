<template>
  <MobileLayout
    header-title="프로필 변경"
    :show-back="true"
    :show-save="true"
    active-tab="profile"
    @back="handleBack"
    @save="handleSave"
  >
    <div class="p-4">
      <Form @submit="onSubmit" :validation-schema="schema" :initial-values="form" class="space-y-4">
        <!-- 이름 / 담당자명 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            이름 / 담당자명 <span class="text-red-500">*</span>
          </label>
          <Field 
            name="full_name" 
            as="input" 
            type="text" 
            v-model="form.full_name"
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
            placeholder="이름을 입력하세요" 
          />
          <ErrorMessage name="full_name" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 아이디 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">아이디</label>
          <input 
            type="text" 
            :value="form.username"
            disabled
            class="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500" 
          />
        </div>

        <!-- 이메일 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
          <Field 
            name="email" 
            as="input" 
            type="email" 
            v-model="form.email"
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
            placeholder="이메일을 입력하세요" 
          />
          <ErrorMessage name="email" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 휴대폰 번호 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">휴대폰 번호</label>
          <Field 
            name="phone_number" 
            as="input" 
            type="text" 
            v-model="form.phone_number"
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
            placeholder="휴대폰 번호를 입력하세요" 
          />
          <ErrorMessage name="phone_number" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 생년월일 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">생년월일</label>
          <Field 
            name="birth_date" 
            as="input" 
            type="date" 
            v-model="form.birth_date"
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
          />
        </div>

        <!-- 성별 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">성별</label>
          <Field 
            name="gender" 
            as="select" 
            v-model="form.gender"
            class="w-full bg-white border border-gray-300 rounded-md p-2"
          >
            <option value="">성별을 선택하세요</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </Field>
        </div>

        <!-- 주소 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">주소</label>
          <Field 
            name="address" 
            as="input" 
            type="text" 
            v-model="form.address"
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
            placeholder="주소를 입력하세요" 
          />
        </div>

        <!-- 버튼 -->
        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white rounded-md py-3 font-semibold"
        >
          저장
        </button>
      </Form>
    </div>
  </MobileLayout>
</template>

<script setup>
import { inject, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/auth'
import { ErrorMessage, Field, Form } from 'vee-validate'
import * as yup from 'yup'
import MobileLayout from '@/mobile/components/MobileLayout.vue'
// import { updateUserProfile } from '@/api/user' // API가 있다면 사용

const router = useRouter()
const userStore = useUserStore()
const showModal = inject('showModal', () => {})

const schema = yup.object({
  full_name: yup.string().required('이름을 입력해주세요.'),
  email: yup.string().email('올바른 이메일 주소를 입력해주세요.')
})

const form = reactive({
  full_name: '',
  username: '',
  email: '',
  phone_number: '',
  birth_date: '',
  gender: '',
  address: ''
})

const handleBack = () => {
  router.back()
}

const handleSave = () => {
  document.querySelector('form').requestSubmit()
}

const onSubmit = async (values) => {
  try {
    // TODO: 실제 API 호출로 대체
    // await updateUserProfile(values)
    // userStore.updateUser(values)
    showModal('프로필이 변경되었습니다.')
    router.back()
  } catch (error) {
    showModal('프로필 변경 중 오류가 발생했습니다.')
    console.error('Error updating profile:', error)
  }
}

onMounted(() => {
  const user = userStore.user
  if (user) {
    form.full_name = user.full_name || ''
    form.username = user.username || ''
    form.email = user.email || ''
    form.phone_number = user.phone_number || ''
    form.birth_date = user.birth_date || ''
    form.gender = user.gender || ''
    form.address = user.address || ''
  }
})
</script>

