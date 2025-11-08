<template>
  <MobileLayout
    header-title="이용자 조회 > 상세"
    :show-back="true"
    active-tab="home"
    @back="handleBack"
  >
    <div class="p-4">
      <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div class="space-y-4">
          <div>
            <label class="text-sm text-gray-500">이름</label>
            <div class="font-semibold text-lg mt-1">{{ client.client_name }}</div>
          </div>
          <div>
            <label class="text-sm text-gray-500">전화번호</label>
            <div class="font-semibold mt-1">{{ client.phone_number }}</div>
          </div>
          <div>
            <label class="text-sm text-gray-500">생년월일</label>
            <div class="font-semibold mt-1">{{ client.birthdate || '미등록' }}</div>
          </div>
          <div>
            <label class="text-sm text-gray-500">성별</label>
            <div class="font-semibold mt-1">{{ client.gender === 'M' ? '남성' : client.gender === 'F' ? '여성' : '미등록' }}</div>
          </div>
          <div>
            <label class="text-sm text-gray-500">주소</label>
            <div class="font-semibold mt-1">{{ client.address || '미등록' }}</div>
          </div>
          <div>
            <label class="text-sm text-gray-500">등록일</label>
            <div class="font-semibold mt-1">{{ client.registration_date || '미등록' }}</div>
          </div>
          <div>
            <label class="text-sm text-gray-500">담당자</label>
            <div class="font-semibold mt-1">{{ client.consultant || '미등록' }}</div>
          </div>
        </div>
      </div>

      <!-- 버튼 -->
      <div class="flex gap-3">
        <button 
          @click="viewTreatmentStatus"
          class="flex-1 bg-blue-600 text-white rounded-md py-3 font-semibold"
        >
          치료 현황
        </button>
        <button 
          @click="editClient"
          class="flex-1 bg-gray-600 text-white rounded-md py-3 font-semibold"
        >
          수정
        </button>
      </div>
    </div>
  </MobileLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MobileLayout from '@/mobile/components/MobileLayout.vue'
import { readClientInfo } from '@/api/client'

const router = useRouter()
const route = useRoute()
const client = ref({})

const handleBack = () => {
  router.back()
}

const viewTreatmentStatus = () => {
  router.push({
    name: 'MobileTreatmentStatus',
    params: { clientId: route.params.id }
  })
}

const editClient = () => {
  router.push({
    name: 'MobileClientForm',
    params: { id: route.params.id }
  })
}

const fetchClientInfo = async () => {
  try {
    const response = await readClientInfo(route.params.id)
    client.value = response.data || response
  } catch (error) {
    console.error('이용자 정보 조회 오류:', error)
  }
}

onMounted(() => {
  fetchClientInfo()
})
</script>

