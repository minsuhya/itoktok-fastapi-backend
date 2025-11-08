<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-12">
    <!-- 로고 영역 -->
    <div class="text-center mb-8">
      <img 
        class="mx-auto h-16 w-auto rounded-lg mb-4" 
        src="/imgs/itoktok-sm.png" 
        alt="아이토크톡" 
      />
      <h2 class="text-2xl font-bold text-gray-900">
        로그인
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        계정에 로그인하세요
      </p>
    </div>

    <!-- 로그인 폼 -->
    <div class="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto w-full">
      <form class="space-y-5" @submit.prevent="onSubmit">
        <!-- 아이디 입력 -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            아이디
          </label>
          <input 
            v-model="username" 
            id="username" 
            name="username" 
            type="text" 
            autocomplete="username"
            v-bind="userNameAttrs"
            placeholder="아이디를 입력하세요"
            class="block w-full rounded-md border border-gray-300 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
          />
          <div v-if="errors.username" class="mt-1 text-sm text-red-500">
            {{ errors.username }}
          </div>
        </div>

        <!-- 비밀번호 입력 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label for="password" class="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <a 
              href="/forgot-password" 
              class="text-sm font-semibold text-blue-600 hover:text-blue-500"
            >
              비밀번호 찾기
            </a>
          </div>
          <input 
            v-model="password" 
            id="password" 
            name="password" 
            type="password" 
            autocomplete="current-password"
            v-bind="passwordAttrs"
            placeholder="비밀번호를 입력하세요"
            class="block w-full rounded-md border border-gray-300 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
          />
          <div v-if="errors.password" class="mt-1 text-sm text-red-500">
            {{ errors.password }}
          </div>
        </div>

        <!-- 로그인 버튼 -->
        <div>
          <button 
            type="submit"
            :disabled="isLoading"
            class="flex w-full justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">로그인</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 12 5.373 12 12H4z"></path>
              </svg>
              로그인 중...
            </span>
          </button>
        </div>
      </form>

      <!-- 회원가입 링크 -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          회원이 아니신가요?
          <a 
            href="/signup" 
            class="font-semibold text-blue-600 hover:text-blue-500"
          >
            회원가입
          </a>
        </p>
      </div>
    </div>

    <!-- 에러 메시지 모달 -->
    <div 
      v-if="errorMessage"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      @click="errorMessage = ''"
    >
      <div 
        class="bg-white rounded-lg p-6 max-w-sm w-full"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">오류</h3>
          <button 
            @click="errorMessage = ''"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-gray-700">{{ errorMessage }}</p>
        <button 
          @click="errorMessage = ''"
          class="mt-4 w-full bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-500"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/auth'
import useAuth from '@/hooks/auth'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const router = useRouter()
const authStore = useUserStore()
const { loginApp } = useAuth()
const showModal = inject('showModal', () => {})
const isLoading = ref(false)
const errorMessage = ref('')

// Validation schema
const validationSchema = yup.object({
  username: yup.string().required('아이디를 입력해주세요.'),
  password: yup.string().min(8, '최소 8자 이상 입력해주세요.').required('비밀번호를 입력해주세요.')
})

const { errors, handleSubmit, defineField, setValues } = useForm({
  validationSchema
})

const [username, userNameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

// Set default values
setValues({
  username: '',
  password: ''
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // 로그인
    await loginApp(values)
    
    // 로그인 성공 후 모바일 홈으로 리다이렉트
    router.push('/mobile')
  } catch (err) {
    console.error('Login error:', err)
    const message = '아이디와 비밀번호를 확인하세요.'
    errorMessage.value = message
    showModal(message)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* 모바일 최적화 스타일 */
@media (max-width: 640px) {
  .min-h-screen {
    padding: 1rem;
  }
}
</style>

