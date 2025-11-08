<template>
  <MobileLayout
    header-title="검색 도구"
    :show-back="true"
    :show-filter="true"
    active-tab="search"
    @back="handleBack"
    @filter="handleFilter"
  >
    <div class="p-4">
      <!-- 검색 바 -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div class="relative">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="검색어를 입력하세요"
            class="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 필터 옵션 -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h3 class="font-semibold mb-3">검색 필터</h3>
        <div class="space-y-3">
          <label class="flex items-center">
            <input type="checkbox" v-model="filters.name" class="form-checkbox h-4 w-4 text-blue-600">
            <span class="ml-2">이름</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="filters.phone" class="form-checkbox h-4 w-4 text-blue-600">
            <span class="ml-2">전화번호</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="filters.birthdate" class="form-checkbox h-4 w-4 text-blue-600">
            <span class="ml-2">생년월일</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="filters.gender" class="form-checkbox h-4 w-4 text-blue-600">
            <span class="ml-2">성별</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="filters.address" class="form-checkbox h-4 w-4 text-blue-600">
            <span class="ml-2">주소</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="filters.registrationDate" class="form-checkbox h-4 w-4 text-blue-600">
            <span class="ml-2">등록일</span>
          </label>
        </div>
      </div>

      <!-- 검색 결과 -->
      <div v-if="searchResults.length > 0" class="bg-white rounded-lg shadow-sm p-4">
        <h3 class="font-semibold mb-3">검색 결과</h3>
        <div class="space-y-3">
          <div 
            v-for="result in searchResults" 
            :key="result.id"
            @click="selectResult(result)"
            class="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <div class="font-semibold">{{ result.name }}</div>
            <div class="text-sm text-gray-500 mt-1">{{ result.phone }}</div>
          </div>
        </div>
      </div>

      <!-- 검색 버튼 -->
      <button 
        @click="performSearch"
        class="w-full bg-blue-600 text-white rounded-md py-3 font-semibold mt-4"
      >
        검색
      </button>
    </div>
  </MobileLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MobileLayout from '@/mobile/components/MobileLayout.vue'
import { searchClientInfos } from '@/api/client'

const router = useRouter()
const searchQuery = ref('')
const searchResults = ref([])

const filters = ref({
  name: true,
  phone: false,
  birthdate: false,
  gender: false,
  address: false,
  registrationDate: false
})

const handleBack = () => {
  router.back()
}

const handleFilter = () => {
  // 필터 토글 로직
}

const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  try {
    const response = await searchClientInfos(searchQuery.value)
    searchResults.value = response.data || []
  } catch (error) {
    console.error('검색 오류:', error)
  }
}

const selectResult = (result) => {
  // 검색 결과 선택 시 일정 등록 화면으로 이동
  router.push({
    name: 'MobileScheduleForm',
    query: { clientId: result.id }
  })
}
</script>

