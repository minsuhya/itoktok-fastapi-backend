<script setup>
import { watch, ref, reactive, onBeforeMount, defineEmits, inject } from 'vue'
import { useForm, Form, Field, ErrorMessage } from 'vee-validate'
import { useUserStore } from '@/stores/auth'
import * as yup from 'yup'
import { readUser, updateUser } from '@/api/user'

const userStore = useUserStore()

const props = defineProps({
  isVisible: Boolean,
  userId: String
})

const showModal = inject('showModal')

const emit = defineEmits(['close'])

// vee-validate 스키마 정의
const schema = yup.object({
  username: yup.string().min(8, '8자 이상 입력해주세요.').required('아이디를 입력해주세요.'),
  password: yup.string(),
  password_confirm: yup.string().when('password', {
    is: (val) => val && val.length > 0,
    then: () =>
      yup
        .string()
        .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.')
        .required('비밀번호 확인을 입력해주세요.'),
    otherwise: () => yup.string().notRequired()
  }),
  email: yup.string().required('이메일을 입력해주세요.').email('올바른 이메일을 입력하세요.'),
  full_name: yup.string().required('이름을 입력해주세요.'),
  hp_number: yup
    .string()
    .required('휴대폰번호를 입력해주세요.')
    .test('is-valid-phone', '올바른 휴대폰번호를 입력하세요.', (values) => {
      const phoneRegex = /^(010|011)-\d{3,4}-\d{4}$/
      return phoneRegex.test(values)
    }),
  phone_number: yup
    .string()
    .required('전화번호를 입력해주세요.')
    .test('is-valid-phone', '올바른 전화번호를 입력하세요.', (values) => {
      const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/
      return phoneRegex.test(values)
    })
})

const form = reactive({
  username: userStore.user.username,
  password: '',
  email: userStore.user.email,
  full_name: userStore.user.full_name,
  birth_date: userStore.user.birth_date,
  center_username: userStore.user.center_username,
  phone_number: userStore.user.phone_number,
  hp_number: userStore.user.hp_number,
  address: userStore.user.address,
  address_extra: userStore.user.address_extra,
  zip_code: userStore.user.zip_code,
  user_type: userStore.user.user_type,
  is_active: userStore.user.is_active,
  is_superuser: userStore.user.is_superuser
})

const closeForm = () => {
  emit('close')
}

const fetchUserInfo = async () => {
  if (!props.userId) {
    Object.keys(form).forEach((key) => {
      form[key] = ''
    })
    return
  }
  console.log('props.userId: ', props.userId)

  try {
    const userInfo = await readUser(props.userId)
    console.log('userInfo:', userInfo)
    Object.assign(form, userInfo)
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

const saveUserInfo = async () => {
  try {
    await updateUser(props.userId, form)
    showModal('내담자 정보가 등록되었습니다.')
  } catch (error) {
    showModal('내담자 정보 등록 중 오류가 발생했습니다.')
    console.error('Error registering client data:', error)
  }
}

onBeforeMount(() => {
  fetchUserInfo()
  console.log('userStore.user.center_username 1111: ', userStore.user.center_username)
})

const onSubmit = async (values) => {
  console.log('submitting:', values)
  Object.assign(form, values)
  await saveUserInfo()
  emit('close')
}

// Step 2: Watch for changes in clientId and call toggleForm
watch(
  () => props.userId,
  (newUserId, oldUserId) => {
    if (newUserId !== oldUserId) {
      fetchUserInfo(newUserId)
    }
  }
)
</script>

<template>
  <!-- Background overlay -->
  <div
    @click="closeForm"
    class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-1000"
    :class="{ 'opacity-100 block': isVisible, 'opacity-0 hidden': !isVisible }"
  ></div>
  <div
    class="fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4 overflow-auto z-50 transition-transform duration-1000 ease-in-out"
    :class="{ 'translate-x-full': !isVisible, 'translate-x-0': isVisible }"
  >
    <div className="w-full bg-neutral-50 shadow-lg rounded-lg p-6">
      <div className="border-b pb-2 mb-4">
        <div class="flex items-center justify-evenly mb-2">
          <h2 class="font-title font-bold">상담사 정보</h2>
          <button class="ml-auto" @click="closeForm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <Form
          @submit="onSubmit"
          :validation-schema="schema"
          :initial-values="form"
          class="space-y-4 text-sm"
        >
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label
                for="username"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >상담사ID</label
              >
              <Field
                type="text"
                name="username"
                v-model="form.username"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <ErrorMessage name="username" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >비밀번호</label
              >
              <Field
                type="password"
                name="password"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div class="mb-4">
              <label
                for="password_confirm"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >비밀번호 확인</label
              >
              <Field
                type="password"
                name="password_confirm"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >이메일</label
              >
              <Field
                type="email"
                name="email"
                v-model="form.email"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <ErrorMessage name="email" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label
                for="full_name"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >상담사명</label
              >
              <Field
                type="text"
                name="full_name"
                v-model="form.full_name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <ErrorMessage name="full_name" class="text-red-500 text-xs italic mt-2" />
            </div>
            <div class="mb-4">
              <label
                for="birth_date"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >생년월일</label
              >
              <Field
                type="date"
                name="birth_date"
                v-model="form.birth_date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label
                for="center_username"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >센터ID</label
              >
              <Field
                type="text"
                name="center_username"
                v-model="form.center_username"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div class="mb-4">
              <label
                for="phone_number"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >전화번호</label
              >
              <Field
                type="text"
                name="phone_number"
                v-model="form.phone_number"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <ErrorMessage name="phone_number" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label
                for="hp_number"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >휴대폰번호</label
              >
              <Field
                type="text"
                name="hp_number"
                v-model="form.hp_number"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <ErrorMessage name="hp_number" class="text-red-500 text-xs italic mt-2" />
            </div>
            <div class="mb-4">
              <label
                for="zip_code"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >우편번호</label
              >
              <Field
                type="text"
                name="zip_code"
                v-model="form.zip_code"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >주소</label
            >
            <Field
              type="text"
              name="address"
              v-model="form.address"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
          <div class="mb-4">
            <label
              for="address_extra"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >주소 상세</label
            >
            <Field
              type="text"
              name="address_extra"
              v-model="form.address_extra"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
          <div class="grid grid-cols-3 gap-4 justify-stretch">
            <div class="mb-4">
              <label
                for="user_type"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >상담자 타입</label
              >
              <Field
                type="text"
                name="user_type"
                v-model="form.user_type"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div class="mb-4 flex items-center pt-4">
              <label
                for="is_active"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2"
                >정상</label
              >
              <Field type="checkbox" name="is_active" v-model="form.is_active" class="mt-1 block" />
            </div>
            <div class="mb-4 flex items-center pt-4">
              <label
                for="is_superuser"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >최고관리자</label
              >
              <Field
                type="checkbox"
                name="is_superuser"
                v-model="form.is_superuser"
                class="mt-1 block"
              />
            </div>
          </div>
          <div class="flex justify-between mt-4">
            <button
              type="button"
              @click="closeForm"
              class="bg-gray-400 text-white rounded-md p-2 w-[80px]"
            >
              취소
            </button>
            <button type="submit" class="bg-green-600 text-white rounded-md p-2 w-[80px]">
              확인
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
