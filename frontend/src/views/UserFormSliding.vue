<script setup>
import { watch, ref, reactive, onBeforeMount, defineEmits, inject } from 'vue'
import { useForm, Form, Field, ErrorMessage } from 'vee-validate'
import { useUserStore } from '@/stores/auth'
import * as yup from 'yup'
import { readUser, updateUser, registerUser, checkUsername } from '@/api/user'

const userStore = useUserStore()

const props = defineProps({
  isVisible: Boolean,
  userId: String
})

const showModal = inject('showModal')

const emit = defineEmits(['close'])

// vee-validate 스키마 정의
const schema = yup.object({
  id: yup.string().nullable(),
  username: yup.string().when('id', {
    is: (val) => !val || val === '',
    then: () =>
      yup
        .string()
        .min(4, '4자 이상 입력해주세요.')
        .required('아이디를 입력해주세요.')
        .test('usernameDup', '이미 등록된 아이디입니다.', async (value) => {
          const response = await checkUsername(value)
          return !response.exists
        }),
    otherwise: () => yup.string().notRequired()
  }),

  password: yup.string().when('id', {
    is: (val) => !val || val === '',
    then: () => yup.string().required('비밀번호를 입력해주세요.'),
    otherwise: () => yup.string().notRequired()
  }),
  password_confirm: yup.string().when('password', {
    is: (val) => val && val.length > 0,
    then: () =>
      yup
        .string()
        .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.')
        .required('비밀번호 확인을 입력해주세요.'),
    otherwise: () => yup.string().notRequired()
  }),
  full_name: yup.string().required('상담사명을 입력해주세요.'),
  email: yup.string().required('이메일을 입력해주세요.').email('올바른 이메일을 입력하세요.'),
  hp_number: yup
    .string()
    .required('휴대폰번호를 입력해주세요.')
    .transform((value) => {
      // 숫자만 남기고 하이픈을 추가하여 포맷팅
      const cleaned = ('' + value).replace(/\D/g, '')
      const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/)
      if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`
      }
      return value
    })
    .test('is-valid-phone', '올바른 휴대폰번호를 입력하세요.', (values) => {
      const phoneRegex = /^(010|011)-\d{3,4}-\d{4}$/
      return phoneRegex.test(values)
    }),
  expertise: yup.string().required('전문분야를 입력해주세요.')
})

const form = reactive({
  id: '',
  username: '',
  password: '',
  password_confirm: '',
  email: '',
  full_name: '',
  birth_date: '',
  center_username: userStore.user.center_username, // 등록 센터ID
  phone_number: '',
  hp_number: '',
  address: '',
  address_extra: '',
  zip_code: '',
  user_type: '2', // 상담자 타입(1: 센터, 2: 상담사)
  is_active: '1', // 정상(0: 비활성, 1: 활성)
  is_superuser: '0', // 최고관리자(0: 일반, 1: 최고관리자)
  expertise: ''
})

const closeForm = () => {
  emit('close')
}

const fetchUserInfo = async () => {
  if (!props.userId) {
    Object.keys(form).forEach((key) => {
      form[key] = ''
    })

    // 초기값 설정
    form.center_username = userStore.user.center_username
    form.user_type = '2'
    form.is_active = '1'
    form.is_superuser = '0'
    return
  }
  console.log('props.userId: ', props.userId)

  try {
    const userInfo = await readUser(props.userId)
    console.log('userInfo:', userInfo)
    userInfo.password = ''
    userInfo.password_confirm = ''
    Object.assign(form, userInfo)
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

onBeforeMount(() => {
  fetchUserInfo()
  console.log('userStore.user.center_username: ', userStore.user.center_username)
})

const onSubmit = async (values) => {
  console.log('submitting:', values)
  Object.assign(form, values)
  try {
    if (form.id) {
      await updateUser(form.id, form)
      showModal('상당사 정보가 수정되었습니다.')
    } else {
      await registerUser(form)
      showModal('상담사 정보가 등록되었습니다.')
    }
  } catch (error) {
    showModal('상담사 정보 저장 중 오류가 발생했습니다.')
    console.error('Error registering consultant data:', error)
  }
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
          <Field type="hidden" name="id" v-model="form.id" />
          <Field type="hidden" name="center_username" v-model="form.center_username" />
          <Field type="hidden" name="user_type" v-model="form.user_type" />
          <Field type="hidden" name="is_superuser" v-model="form.is_superuser" />
          <div class="grid grid-cols-3 gap-4">
            <div class="mb-4">
              <label
                for="username"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >상담사ID <span class="text-red-500">*</span></label
              >
              <Field
                type="text"
                name="username"
                v-model="form.username"
                :readonly="!!form.id"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <ErrorMessage name="username" class="text-red-500 text-xs italic mt-2" />
            </div>
            <div class="mb-4">
              <label
                for="full_name"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >상담사명 <span class="text-red-500">*</span></label
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
              <label class="block text-sm font-medium text-gray-700">색상 정보 </label>
              <Field
                type="color"
                name="usercolor"
                class="p-1 h-11 w-full mt-1 block rounded-lg border-gray-400"
                v-model="form.usercolor"
                title="Choose your color"
              />
              <ErrorMessage name="usercolor" class="text-red-500 text-sm" />
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
                v-model="form.password"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <ErrorMessage name="password" class="text-red-500 text-xs italic mt-2" />
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
                v-model="form.password_confirm"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <ErrorMessage name="password_confirm" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label
                for="expertise"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >전문분야 <span class="text-red-500">*</span></label
              >
              <Field
                type="text"
                name="expertise"
                v-model="form.expertise"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="ex) 미술치료, 심리치료"
              />
              <ErrorMessage name="expertise" class="text-red-500 text-xs italic mt-2" />
            </div>
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >이메일 <span class="text-red-500">*</span></label
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
                for="hp_number"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >휴대폰번호 <span class="text-red-500">*</span></label
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
            <div class="mb-4 flex items-center pt-4">
              <Field
                type="checkbox"
                name="is_active"
                v-model="form.is_active"
                class="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                :value="1"
              />
              <label for="checkbox" class="text-gray-700 ml-2"> 정상</label>
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
