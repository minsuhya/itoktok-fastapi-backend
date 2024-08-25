<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

// Define the validation schema
const validationSchema = yup.object({
  username: yup.string().required("아이디를 입력해주세요."),
  password: yup
    .string()
    .min(8, "최소 8자 이상 입력해주세요.")
    .required("비밀번호를 입력해주세요."),
});

const authStore = useAuthStore();
const router = useRouter();
const { errors, handleSubmit, defineField } = useForm({
  validationSchema,
});

// const { value: email } = useField("email");
// const { value: password } = useField("password");

const [username, userNameAttrs] = defineField("username");
const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  const result = await authStore.login(values);
  if (result === true) {
    router.push({ path: "/table", replace: true }); // Redirect to /home on success
  } else {
    alert("아이디와 비밀번호를 확인하세요. "); // Show alert on failure
  }
});
</script>
<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Itoktok Sign In
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="onSubmit">
        <div>
          <label for="username" class="block text-sm font-medium leading-6 text-gray-900">User ID</label>
          <div class="mt-2">
            <input v-model="username" id="username" name="username" type="text" autocomplete="username"
              v-bind="userNameAttrs"
              class="peer block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            <div class="mt-1 text-red-900">{{ errors.username }}</div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
          </div>
          <div class="mt-2">
            <input v-model="password" id="password" name="password" type="password" autocomplete="current-password"
              v-bind="passwordAttrs"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            <div class="mt-1 text-red-900">{{ errors.password }}</div>
          </div>
        </div>

        <div>
          <button type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Sign in
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        회원이 아니면?
        <a href="#" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">회원가입</a>
      </p>
    </div>
  </div>
</template>
