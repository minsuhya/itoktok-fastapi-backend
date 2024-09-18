<template>
  <!-- <header class="bg-white shadow-md py-4 px-6 flex justify-between items-center"> -->
  <!--   <div class="text-xl font-bold">EzyOps - Admin</div> -->
  <!--   <div class="flex items-center space-x-4"> -->
  <!--     <input type="text" placeholder="Search..." -->
  <!--       class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /> -->
  <!--     <div class="relative"> -->
  <!--       <button class="focus:outline-none"> -->
  <!--         <img src="https://www.ezyops.kr/ui/pc/image/content/ezyops.jpg" alt="User Avatar" -->
  <!--           class="w-10 h-10 rounded-full" /> -->
  <!--       </button> -->
  <!--       <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden"> -->
  <!--         <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a> -->
  <!--         <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a> -->
  <!--         <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</a> -->
  <!--       </div> -->
  <!--     </div> -->
  <!--   </div> -->
  <!-- </header> -->
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="max-w-screen-full flex flex-wrap items-center justify-between mx-auto p-4">
      <router-link to="/admin" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img class="h-8 w-auto rounded-lg" src="/imgs/itoktok-sm.png" alt="Your Company" />
        <span
          class="self-center text-sm align-bottom text-gray-500 font-semibold whitespace-nowrap dark:text-white"
          >with children</span
        >
      </router-link>
      <div class="w-full md:block md:w-auto text-md font-bold" id="navbar-default">
        <ul
          class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li
            @click="$emit('toggleSettingsSlide')"
            class="cursor-pointer block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
          >
            설정
          </li>
          <router-link
            to="/admin/myinfo"
            class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            tab="li"
            >내정보</router-link
          >
          <li @click="logout">
            <a
              href="#"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >로그아웃</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { inject, defineEmits } from 'vue'
import useAuth from '@/hooks/auth'

const { logoutApp } = useAuth()
const navigateTo = inject('$navigateTo')
defineEmits(['toggleSettingsSlide'])

const logout = async () => {
  // logout
  await logoutApp()
  console.log('logout')

  // navigate to login page
  navigateTo('/login')
  // window.location.href = '/login'
}
</script>
