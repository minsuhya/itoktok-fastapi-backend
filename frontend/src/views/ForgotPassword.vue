<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import useAuth from '@/hooks/auth'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { forgot_password } from '@/api/user'

// Define the validation schema
const validationSchema = yup.object({
  email: yup.string().required('이메일을 입력해주세요.').email('올바른 이메일을 입력하세요.')
})

const router = useRouter()
const { errors, handleSubmit, defineField } = useForm({
  validationSchema
})

// const { value: email } = useField("email");
// const { value: password } = useField("password");

const [email, emailAttrs] = defineField('email')

const onSubmit = handleSubmit(async (values) => {
  try {
    // login
    const res = await forget_password(values)
    console.log('forgot-password: ', res)

    // rediect after login
    router.replace({
      path: '/login',
      name: 'login',
      replace: true
    })
  } catch (err) {
    // console.log(err)
    alert('이메일을 확인하세요. ') // Show alert on failure
  }
})
</script>

<template>
  <main>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company" />
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Forgot password?
        </h2>
      </div>

      <div class="bg-white mt-10 sm:mx-auto sm:w-full sm:max-w-lg border border-gray-400/50 p-9 rounded-lg">
        <form class="space-y-6" @submit.prevent="onSubmit">
          <div>
            <label for="username" class="block text-sm font-medium leading-6 text-gray-900">email address</label>
            <div class="mt-2">
              <input v-model="email" id="email" name="email" type="email" autocomplete="email" v-bind="emailAttrs"
                class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
            <div class="mt-2 text-red-500">{{ errors.email }}</div>
          </div>
          <div>
            <button type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Reset password
            </button>
          </div>
        </form>
        <p
          class="flex flex-row flex-1 gap-1 mt-1 mx-auto justify-evenly items-stretch text-center text-sm text-gray-500">
          <a href="login"
            class="w-1/2 text-white bg-slate-400 hover:bg-slate-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            로그인</a>
          <a href="register"
            class="w-1/2 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            회원가입</a>
        </p>
      </div>
    </div>
  </main>
</template>
