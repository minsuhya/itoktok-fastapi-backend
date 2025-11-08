<template>
  <MobileLayout
    header-title="치료 기록"
    :show-back="true"
    active-tab="home"
    @back="handleBack"
  >
    <div class="p-4">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="space-y-4">
          <div>
            <label class="text-sm text-gray-500">날짜</label>
            <div class="font-semibold text-lg mt-1">{{ record.date }}</div>
          </div>
          <div>
            <label class="text-sm text-gray-500">제목</label>
            <div class="font-semibold text-lg mt-1">{{ record.title }}</div>
          </div>
          <div>
            <label class="text-sm text-gray-500">내용</label>
            <div class="mt-2 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">{{ record.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </MobileLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MobileLayout from '@/mobile/components/MobileLayout.vue'
// import { getTreatmentRecord } from '@/api/record' // API가 있다면 사용

const router = useRouter()
const route = useRoute()
const record = ref({
  date: '',
  title: '',
  content: ''
})

const handleBack = () => {
  router.back()
}

const fetchRecord = async () => {
  try {
    // TODO: 실제 API 호출로 대체
    // const response = await getTreatmentRecord(route.params.id)
    // record.value = response.data || response
    
    // 임시 데이터
    record.value = {
      date: '2023-09-01',
      title: '치료 제목',
      content: '치료 내용이 여기에 표시됩니다.'
    }
  } catch (error) {
    console.error('치료 기록 조회 오류:', error)
  }
}

onMounted(() => {
  fetchRecord()
})
</script>

