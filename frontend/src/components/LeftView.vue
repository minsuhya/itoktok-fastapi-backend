<script setup>
import { ref } from 'vue'

const open_user_menu = ref(false)
const open_schedule_menu = ref(false)
</script>
<template>
  <aside class="w-64 bg-gray-800 text-gray-200 flex flex-col shadow-lg">
    <!-- <div class="h-16 flex items-center justify-center border-b border-gray-700"> -->
    <!--   <span class="text-xl font-bold text-white">Monkey</span> -->
    <!-- </div> -->
    <nav class="flex-grow p-4">
      <router-link to="/admin" class="block py-2.5 px-4 rounded hover:bg-gray-800 transition-colors duration-200">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18"></path>
          </svg>
          Dashboard
        </div>
      </router-link>

      <!-- Users section with submenu -->
      <div>
        <button @click="open_user_menu = !open_user_menu"
          class="w-full flex justify-between items-center py-2.5 px-4 rounded hover:bg-gray-800 transition-colors duration-200 focus:outline-none">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5.121 17.804A7.5 7.5 0 0112 2.5a7.5 7.5 0 016.879 15.304M15 21h6m0 0v-6m0 6l-6-6"></path>
            </svg>
            사용자
          </div>
          <svg :class="{ 'transform rotate-180': open_user_menu }" class="w-4 h-4 transition-transform" fill="none"
            stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div class="mt-2 space-y-2 pl-8 text-gray-400" :class="open_user_menu ? 'block' : 'hidden'">
          <router-link to="/admin/client"
            class="block py-2.5 px-4 rounded hover:bg-gray-800 hover:text-white transition-colors duration-200">내담자
            관리</router-link>
          <router-link to="/admin/counselor"
            class="block py-2.5 px-4 rounded hover:bg-gray-800 hover:text-white transition-colors duration-200">상담사
            관리</router-link>
        </div>
      </div>

      <!-- 일정관리 section with submenu -->
      <div class="mt-2">
        <button @click="open_schedule_menu = !open_schedule_menu"
          class="w-full flex justify-between items-center py-2.5 px-4 rounded hover:bg-gray-800 transition-colors duration-200 focus:outline-none">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 11V7m0 4v4m0-4H7m4 0h4M21 12.255a9.253 9.253 0 01-.965 4.365l-1.634-1.635m2.599-2.73l-2.599 2.731M5 6.636l1.635-1.635M3 12.255c.051-1.23.246-2.422.58-3.551L6.636 5m0 0l1.635 1.635m0 0l4.83 4.83m-4.83 0h.001l-4.831 4.83m4.83-4.83L12 12.25">
              </path>
            </svg>
            일정관리
          </div>
          <svg :class="{ 'transform rotate-180': open_schedule_menu }" class="w-4 h-4 transition-transform" fill="none"
            stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div x-show="open" class="mt-2 space-y-2 pl-8 text-gray-400" :class="open_schedule_menu ? 'block' : 'hidden'">
          <router-link to="/admin/monthly"
            class="block py-2.5 px-4 rounded hover:bg-gray-800 hover:text-white transition-colors duration-200">Monthly</router-link>
          <router-link to="/admin/daily"
            class="block py-2.5 px-4 rounded hover:bg-gray-800 hover:text-white transition-colors duration-200">Daily</router-link>
        </div>
      </div>

      <a href="#" class="block py-2.5 px-4 rounded mt-4 hover:bg-gray-800 transition-colors duration-200">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 15a4 4 0 104 4H3v-4zm12-4v8m-4-4h8"></path>
          </svg>
          Reports
        </div>
      </a>
    </nav>
  </aside>
</template>
