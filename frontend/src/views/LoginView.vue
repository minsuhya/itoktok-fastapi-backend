<script setup>
import { computed, inject } from 'vue'
import { useUserStore } from '@/stores/auth'
import useAuth from '@/hooks/auth'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

// Define the validation schema
const validationSchema = yup.object({
  username: yup.string().required('아이디를 입력해주세요.'),
  password: yup.string().min(8, '최소 8자 이상 입력해주세요.').required('비밀번호를 입력해주세요.')
})

const authStore = useUserStore()
const { loginApp } = useAuth()
const { errors, handleSubmit, defineField, setValues } = useForm({
  validationSchema
})

// const { value: email } = useField("email");
// const { value: password } = useField("password");

const [username, userNameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

// Set the default values
setValues({
  username: '',
  password: ''
})

const showModal = inject('showModal')
const navigateTo = inject('$navigateTo')

const onSubmit = handleSubmit(async (values) => {
  try {
    // login
    await loginApp(values)

    // rediect after login
    navigateTo('/admin')
  } catch (err) {
    console.log(err)
    showModal('아이디와 비밀번호를 확인하세요.')
  }
})
</script>

<template>
  <main>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto rounded-lg" src="/imgs/itoktok-sm.png" alt="Your Company" />
        <h2 class="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div
        class="bg-white mt-5 sm:mx-auto sm:w-full sm:max-w-[600px] border border-gray-400/50 rounded-lg grid grid-cols-2"
      >
        <div>
          <img
            src="/imgs/login.png"
            alt="Login Image"
            class="w-full h-[400px] object-none object-center rounded-lg"
          />
        </div>
        <div class="p-6 mb-auto">
          <form class="space-y-6" @submit.prevent="onSubmit">
            <div>
              <label for="username" class="block text-sm font-medium leading-6 text-gray-900"
                >아이디</label
              >
              <div class="mt-2">
                <input
                  v-model="username"
                  id="username"
                  name="username"
                  type="username"
                  autocomplete="email"
                  v-bind="userNameAttrs"
                  tabindex="1"
                  class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div class="mt-1 text-red-500">{{ errors.username }}</div>
            </div>
            <div>
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
                  >비밀번호</label
                >
                <div class="text-sm">
                  <a
                    href="/forgot-password"
                    class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >비밀번호를 잊어버렸나요?</a
                  >
                </div>
              </div>
              <div class="mt-2">
                <input
                  v-model="password"
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  v-bind="passwordAttrs"
                  tabindex="2"
                  class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div class="mt-1 text-red-500">{{ errors.password }}</div>
            </div>

            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                로그인
              </button>
            </div>
          </form>

          <p class="mt-10 text-center text-sm text-gray-500">
            회원이 아니신가요?
            <a href="/signup" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >회원가입</a
            >
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
