<template>
  <MobileLayout
    header-title="설정"
    :show-back="true"
    active-tab="profile"
    @back="handleBack"
  >
    <div class="p-4">
      <!-- 프로필 영역 -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div class="flex items-center">
          <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
            {{ userInitial }}
          </div>
          <div class="flex-1">
            <div class="font-semibold text-lg">{{ userName }}</div>
            <div class="text-sm text-gray-500">{{ userId }}</div>
          </div>
        </div>
      </div>

      <!-- 설정 메뉴 -->
      <div class="bg-white rounded-lg shadow-sm">
        <div 
          v-for="item in menuItems" 
          :key="item.path"
          @click="navigateTo(item.path)"
          class="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 last:border-b-0"
        >
          <span class="font-medium">{{ item.label }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </div>
  </MobileLayout>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/auth'
import useAuth from '@/hooks/auth'
import MobileLayout from '@/mobile/components/MobileLayout.vue'

const router = useRouter()
const userStore = useUserStore()
const { logoutApp } = useAuth()
const showModal = inject('showModal', (message) => alert(message))

const userName = computed(() => userStore.user?.full_name || '사용자')
const userId = computed(() => userStore.user?.username || '')
const userInitial = computed(() => userName.value.charAt(0) || 'U')

const menuItems = [
  { label: '비밀번호 변경', path: '/mobile/settings/change-password' },
  { label: '프로필 변경', path: '/mobile/settings/change-profile' },
  { label: '알림 설정', path: '/mobile/notifications' },
  { label: '로그아웃', path: '/logout' }
]

const handleBack = () => {
  router.back()
}

const navigateTo = async (path) => {
  if (path === '/logout') {
    // 로그아웃 확인
    if (confirm('로그아웃 하시겠습니까?')) {
      try {
        await logoutApp()
        showModal('로그아웃되었습니다.')
        // 모바일 로그인 페이지로 리다이렉트
        router.push('/mobile/login')
      } catch (error) {
        console.error('로그아웃 오류:', error)
        showModal('로그아웃 중 오류가 발생했습니다.')
      }
    }
  } else {
    router.push(path)
  }
}
</script>

