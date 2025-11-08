<template>
  <MobileLayout
    header-title="치료 현황"
    :show-back="true"
    active-tab="home"
    @back="handleBack"
  >
    <div class="p-4">
      <div v-if="treatments.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
        등록된 치료 기록이 없습니다.
      </div>
      <div v-else class="space-y-3">
        <div 
          v-for="treatment in treatments" 
          :key="treatment.id"
          @click="viewTreatmentRecord(treatment)"
          class="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
        >
          <div class="flex-1">
            <div class="text-sm text-gray-500">{{ treatment.date }}</div>
            <div class="font-semibold text-lg mt-1">{{ treatment.title }}</div>
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
import { useRouter, useRoute } from 'vue-router'
import MobileLayout from '@/mobile/components/MobileLayout.vue'
// import { getTreatmentRecords } from '@/api/record' // API가 있다면 사용

const router = useRouter()
const route = useRoute()
const treatments = ref([])

const handleBack = () => {
  router.back()
}

const viewTreatmentRecord = (treatment) => {
  router.push({
    name: 'MobileTreatmentRecord',
    params: { id: treatment.id }
  })
}

const fetchTreatments = async () => {
  try {
    // TODO: 실제 API 호출로 대체
    // const response = await getTreatmentRecords(route.params.clientId)
    // treatments.value = response.data || []
    
    // 임시 데이터
    treatments.value = [
      { id: 1, date: '2023-09-01', title: '치료 제목 1' },
      { id: 2, date: '2023-09-05', title: '치료 제목 2' }
    ]
  } catch (error) {
    console.error('치료 현황 조회 오류:', error)
  }
}

onMounted(() => {
  fetchTreatments()
})
</script>

