<template>
  <MobileLayout
    header-title="이용자 조회"
    :show-menu="true"
    :show-plus="true"
    active-tab="home"
    @menu="handleMenu"
    @plus="handlePlus"
  >
    <div class="p-4">
      <!-- 검색 바 -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div class="relative">
          <input 
            v-model="searchQuery"
            @input="performSearch"
            type="text"
            placeholder="이름, 전화번호로 검색"
            class="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 이용자 목록 -->
      <div v-if="clients.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
        등록된 이용자가 없습니다.
      </div>
      <div v-else class="space-y-3">
        <div 
          v-for="client in clients" 
          :key="client.id"
          @click="viewClientDetail(client)"
          class="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
        >
          <div class="flex-1">
            <div class="font-semibold text-lg">{{ client.client_name }}</div>
            <div class="text-sm text-gray-500 mt-1">{{ client.phone_number }}</div>
            <div class="text-sm text-gray-500">{{ client.birthdate || '생년월일 미등록' }}</div>
            <div class="text-sm text-gray-500">{{ client.gender || '성별 미등록' }}</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </div>
  </MobileLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MobileLayout from '@/mobile/components/MobileLayout.vue'
import { readClientInfos, searchClientInfos } from '@/api/client'

const router = useRouter()
const searchQuery = ref('')
const clients = ref([])

const handleMenu = () => {
  // 메뉴는 MobileLayout에서 처리
}

const handlePlus = () => {
  router.push({ name: 'MobileClientForm' })
}

const viewClientDetail = (client) => {
  router.push({
    name: 'MobileClientDetail',
    params: { id: client.id }
  })
}

const performSearch = async () => {
  try {
    if (searchQuery.value.trim()) {
      const response = await searchClientInfos(searchQuery.value)
      clients.value = response.data || []
    } else {
      await fetchClients()
    }
  } catch (error) {
    console.error('검색 오류:', error)
  }
}

const fetchClients = async () => {
  try {
    const response = await readClientInfos(1, 100, '')
    clients.value = response.data?.items || []
  } catch (error) {
    console.error('이용자 조회 오류:', error)
  }
}

onMounted(() => {
  fetchClients()
})
</script>

