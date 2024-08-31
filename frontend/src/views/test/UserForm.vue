<script setup>
import { useRouter } from 'vue-router'
import { register } from '@/api/test'

// vue tailwindcss user registeration form

import { useForm } from 'vee-validate'
import * as yup from 'yup'

// Define the validation schema

const validationSchema = yup.object({
  username: yup.string().required('아이디를 입력해주세요.'),
  email: yup.string().required('이메일을 입력해주세요.').email('올바른 이메일을 입력하세요.'),
  password: yup.string().min(8, '최소 8자 이상 입력해주세요.').required('비밀번호를 입력해주세요.')
})

// const router = useRouter()
const { errors, handleSubmit, defineField } = useForm({
  validationSchema
})

const [username, usernameAttrs] = defineField('username')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    // register
    const res = await register(values)
    console.log('register: ', res)

    // rediect after login
    // router.replace({
    //   path: '/login',
    //   name: 'login',
    //   replace: true
    // })
  } catch (err) {
    console.log(err)
    alert('아이디와 비밀번호를 확인하세요. ') // Show alert on failure
  }
})
</script>

<template>
  <main>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company" />
        <h2 class="mt-10 text center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Register your account now
        </h2>
      </div>

      <div class="bg-white mt-10 sm:mx-auto sm:w-full sm:max-w-lg border border-gray-400/50 p-9 rounded-lg">
        <form class="space-y-6" @submit.prevent="onSubmit">
          <div>
            <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
            <div class="mt-2">
              <input v-model="username" id="username" name="username" type="text" autocomplete="username"
                v-bind="usernameAttrs"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
            <p class="mt-2 text-sm text-red-500">{{ errors.username }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div class="mt-2">
              <input v-model="email" id="email" name="email" type="email" autocomplete="email" v-bind="emailAttrs"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
            <p class="mt-2 text-sm text-red-500">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div class="mt-2">
              <input v-model="password" id="password" name="password" type="password" autocomplete="current-password"
                v-bind="passwordAttrs"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
            <p class="mt-2 text-sm text-red-500">{{ errors.password }}</p>
          </div>

          <div>
            <button type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
