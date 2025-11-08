<template>
  <div class="mobile-layout min-h-screen bg-gray-50 pb-16 pt-14">
    <MobileHeader
      :title="headerTitle"
      :show-back="showBack"
      :show-menu="showMenu"
      :show-search="showSearch"
      :show-bell="showBell"
      :show-plus="showPlus"
      :show-save="showSave"
      :show-filter="showFilter"
      @back="handleBack"
      @menu="handleMenu"
      @search="handleSearch"
      @bell="handleBell"
      @plus="handlePlus"
      @save="handleSave"
      @filter="handleFilter"
    />
    
    <main class="mobile-content">
      <slot />
    </main>
    
    <MobileBottomNav :active-tab="activeTab" />
    
    <!-- 슬라이딩 메뉴 -->
    <div 
      v-if="isMenuOpen"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity"
      @click="closeMenu"
    >
      <div 
        class="fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform"
        :class="{ 'translate-x-0': isMenuOpen, '-translate-x-full': !isMenuOpen }"
        @click.stop
      >
        <slot name="menu">
          <div class="p-4">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {{ userInitial }}
                </div>
                <div>
                  <div class="font-semibold">{{ userName }}</div>
                  <div class="text-sm text-gray-500">{{ userId }}</div>
                </div>
              </div>
              <button @click="closeMenu" class="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav class="space-y-2">
              <button 
                v-for="item in menuItems" 
                :key="item.path"
                @click="navigateTo(item.path)"
                class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center"
              >
                <span class="flex-1">{{ item.label }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </nav>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/auth'
import useAuth from '@/hooks/auth'
import MobileHeader from './MobileHeader.vue'
import MobileBottomNav from './MobileBottomNav.vue'

const props = defineProps({
  headerTitle: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: false
  },
  showMenu: {
    type: Boolean,
    default: false
  },
  showSearch: {
    type: Boolean,
    default: false
  },
  showBell: {
    type: Boolean,
    default: false
  },
  showPlus: {
    type: Boolean,
    default: false
  },
  showSave: {
    type: Boolean,
    default: false
  },
  showFilter: {
    type: Boolean,
    default: false
  },
  activeTab: {
    type: String,
    default: 'home'
  }
})

const emit = defineEmits(['back', 'menu', 'search', 'bell', 'plus', 'save', 'filter'])

const router = useRouter()
const userStore = useUserStore()
const { logoutApp } = useAuth()
const showModal = inject('showModal', (message) => alert(message))
const isMenuOpen = ref(false)

const userName = computed(() => userStore.user?.full_name || '사용자')
const userId = computed(() => userStore.user?.username || '')
const userInitial = computed(() => userName.value.charAt(0) || 'U')

const menuItems = [
  { label: '일정 관리', path: '/mobile/schedule' },
  { label: '내담자 관리', path: '/mobile/clients' },
  { label: '치료 관리', path: '/mobile/treatments' },
  { label: '설정', path: '/mobile/settings' },
  { label: '로그아웃', path: '/logout' }
]

const handleBack = () => {
  emit('back')
  router.back()
}

const handleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  emit('menu')
}

const handleSearch = () => emit('search')
const handleBell = () => emit('bell')
const handlePlus = () => emit('plus')
const handleSave = () => emit('save')
const handleFilter = () => emit('filter')

const closeMenu = () => {
  isMenuOpen.value = false
}

const navigateTo = async (path) => {
  closeMenu()
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

<style scoped>
.mobile-layout {
  padding-bottom: 4rem; /* 하단 네비게이션 높이 */
  padding-top: 3.5rem; /* 헤더 높이 */
}
</style>

