<script setup>
import { inject } from 'vue'
import { useForm } from 'vee-validate'
import { checkUsername, signup } from '@/api/user'
import * as yup from 'yup'

// Define the validation schema
const validationSchema = yup.object({
  username: yup
    .string()
    .min(4, '4자 이상 입력해주세요.')
    .required('아이디를 입력해주세요.')
    .test('usernameDup', '이미 등록된 아이디입니다.', async (value) => {
      const response = await checkUsername(value)
      return !response.exists
    }),
  password: yup.string().min(8, '최소 8자 이상 입력해주세요.').required('비밀번호를 입력해주세요.'),
  password_confirm: yup
    .string()
    .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호를 입력해주세요.'),
  email: yup.string().required('이메일을 입력해주세요.').email('올바른 이메일을 입력하세요.'),
  full_name: yup.string().required('이름을 입력해주세요.'),
  hp_number: yup
    .string()
    .required('휴대폰번호를 입력해주세요.')
    .test('is-valid-phone', '올바른 휴대폰번호를 입력하세요.', (values) => {
      const phoneRegex = /^(010|011)-\d{3,4}-\d{4}$/
      return phoneRegex.test(values)
    })
})

const { errors, handleSubmit, defineField, setValues } = useForm({
  validationSchema
})

const [username, userNameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')
const [password_confirm, passwordConfirmAttrs] = defineField('password_confirm')
const [email, emailAttrs] = defineField('email')
const [full_name, fullNameAttrs] = defineField('full_name')
const [birth_date, birthDateAttrs] = defineField('birth_date')
const [address, addressAttrs] = defineField('address')
const [address_extra, addressExtraAttrs] = defineField('address_extra')
const [phone_number, phoneNumberAttrs] = defineField('phone_number')
const [hp_number, hpNumberAttrs] = defineField('hp_number')
const [zip_code, zipCodeAttrs] = defineField('zip_code')
const [user_type, userTypeAttrs] = defineField('user_type')
const [is_active, isActiveAttrs] = defineField('is_active')
const [is_superuser, isSuperUserAttrs] = defineField('is_superuser')

// Set the default values
setValues({
  username: '',
  password: '',
  user_type: '1', // 1: center, 2: teacher, 3: student
  is_active: '1',
  is_superuser: '0' // 1: superuser, 0: normal user
})

const navigateTo = inject('$navigateTo')
const showModal = inject('showModal')

const register = handleSubmit(async (values) => {
  try {
    // register
    const res = await signup(values)
    console.log('signup res: ', res)

    // Show alert on success
    showModal('회원가입이 완료되었습니다. 로그인해주세요.')

    // rediect after login
    navigateTo('/login')
  } catch (err) {
    console.log(err)
  }
})
</script>

<template>
  <main>
    <div class="flex min-h-full mx-auto w-full flex-col justify-center px-6 py-12 lg:px-8 border">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto rounded-lg" src="/imgs/itoktok-sm.png" alt="Your Company" />
        <h2 class="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign up to your account
        </h2>
      </div>
      <div
        class="bg-white mt-10 sm:mx-auto sm:w-full sm:max-w-2xl border border-gray-400/50 p-9 rounded-lg"
      >
        <form @submit.prevent="register">
          <div class="mb-4">
            <label
              class="text-base font-semibold leading-7 text-gray-900 before:content-['*'] before:text-red-500"
              >아이디</label
            >
            <input
              v-bind="userNameAttrs"
              v-model="username"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="아이디"
            />
            <div class="mt-1 text-red-500">{{ errors.username }}</div>
          </div>
          <div class="mb-4">
            <label
              class="text-base font-semibold leading-7 text-gray-900 before:content-['*'] before:text-red-500"
              >비밀번호</label
            >
            <input
              v-bind="passwordAttrs"
              v-model="password"
              type="password"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="abcd!@34"
            />
            <div class="mt-1 text-red-500">{{ errors.password }}</div>
          </div>
          <div class="mb-4">
            <label
              class="text-base font-semibold leading-7 text-gray-900 before:content-['*'] before:text-red-500"
              >비밀번호 확인</label
            >
            <input
              v-bind="passwordConfirmAttrs"
              v-model="password_confirm"
              type="password"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <div class="mt-1 text-red-500">{{ errors.password_confirm }}</div>
          </div>
          <div class="mb-4">
            <label
              class="text-base font-semibold leading-7 text-gray-900 before:content-['*'] before:text-red-500"
              >이메일</label
            >
            <input
              v-bind="emailAttrs"
              v-model="email"
              type="email"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="your@email.com"
            />
            <div class="mt-1 text-red-500">{{ errors.email }}</div>
          </div>
          <div class="mb-4">
            <label
              class="text-base font-semibold leading-7 text-gray-900 before:content-['*'] before:text-red-500"
              >이름</label
            >
            <input
              v-bind="fullNameAttrs"
              v-model="full_name"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="홍길동"
            />
            <div class="mt-1 text-red-500">{{ errors.full_name }}</div>
          </div>
          <div class="mb-4">
            <label
              class="text-base font-semibold leading-7 text-gray-900 before:content-['*'] before:text-red-500"
              >휴대폰번호</label
            >
            <input
              v-bind="hpNumberAttrs"
              v-model="hp_number"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="000-0000-0000"
            />
            <div class="mt-1 text-red-500">{{ errors.hp_number }}</div>
          </div>
          <div class="mb-4">
            <label class="text-base font-semibold leading-7 text-gray-900">생년월일</label>
            <input
              v-bind="birthDateAttrs"
              v-model="birth_date"
              type="date"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div class="mb-4">
            <label class="text-base font-semibold leading-7 text-gray-900">주소</label>
            <input
              v-bind="addressAttrs"
              v-model="address"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div class="mb-4">
            <label class="text-base font-semibold leading-7 text-gray-900">주소 상세</label>
            <input
              v-bind="addressExtraAttrs"
              v-model="address_extra"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div class="mb-4">
            <label class="text-base font-semibold leading-7 text-gray-900">전화번호</label>
            <input
              v-bind="phoneNumberAttrs"
              v-model="phone_number"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="000-0000-0000"
            />
          </div>
          <input v-bind="zipCodeAttrs" v-model="zip_code" type="hidden" />
          <input v-bind="userTypeAttrs" v-model="user_type" type="hidden" />
          <input v-bind="isActiveAttrs" v-model="is_active" type="hidden" />
          <input v-bind="isSuperUserAttrs" v-model="is_superuser" type="hidden" />
          <div class="flex justify-center gap-1">
            <button
              type="submit"
              class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              회원가입
            </button>
            <router-link
              to="/login"
              class="flex focus:outline-none text-white bg-gray-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              로그인
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
