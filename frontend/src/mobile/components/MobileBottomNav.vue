<template>
  <nav class="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around z-50">
    <button 
      @click="navigate('home')" 
      :class="['flex flex-col items-center justify-center flex-1 h-full', activeTab === 'home' ? 'text-blue-600' : 'text-gray-500']"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
      <span class="text-xs mt-1">홈</span>
    </button>
    
    <button 
      @click="navigate('calendar')" 
      :class="['flex flex-col items-center justify-center flex-1 h-full', activeTab === 'calendar' ? 'text-blue-600' : 'text-gray-500']"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
      <span class="text-xs mt-1">달력</span>
    </button>
    
    <button 
      @click="navigate('search')" 
      :class="['flex flex-col items-center justify-center flex-1 h-full', activeTab === 'search' ? 'text-blue-600' : 'text-gray-500']"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <span class="text-xs mt-1">검색</span>
    </button>
    
    <button 
      @click="navigate('profile')" 
      :class="['flex flex-col items-center justify-center flex-1 h-full', activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500']"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
      <span class="text-xs mt-1">프로필</span>
    </button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'home'
  }
})

const router = useRouter()

const navigate = (tab) => {
  const routes = {
    home: '/mobile',
    calendar: '/mobile/schedule',
    search: '/mobile/search',
    profile: '/mobile/settings'
  }
  
  if (routes[tab]) {
    router.push(routes[tab])
  }
}
</script>

<style scoped>
nav {
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}
</style>

