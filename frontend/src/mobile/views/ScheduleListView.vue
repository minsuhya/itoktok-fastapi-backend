<template>
  <MobileLayout
    :header-title="dateText"
    :show-menu="true"
    :show-search="true"
    :show-plus="true"
    active-tab="calendar"
    @menu="handleMenu"
    @search="handleSearch"
    @plus="handlePlus"
  >
    <div class="p-4">
      <div v-if="schedules.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
        등록된 일정이 없습니다.
      </div>
      <div v-else class="space-y-3">
        <div 
          v-for="schedule in schedules" 
          :key="schedule.id"
          @click="viewScheduleDetail(schedule)"
          class="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-50 border-l-4 border-blue-600"
        >
          <div class="text-sm text-gray-500 mb-1">{{ schedule.time }}</div>
          <div class="font-semibold text-lg mb-1">{{ schedule.title }}</div>
          <div class="text-sm text-gray-600">{{ schedule.content }}</div>
        </div>
      </div>
    </div>
  </MobileLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MobileLayout from '@/mobile/components/MobileLayout.vue'
import { getDailyCalendar } from '@/api/schedule'

const router = useRouter()
const route = useRoute()
const schedules = ref([])

const dateText = computed(() => {
  const date = route.params.date || new Date().toISOString().split('T')[0]
  const dateObj = new Date(date)
  return `${dateObj.getFullYear()}년 ${String(dateObj.getMonth() + 1).padStart(2, '0')}월 ${String(dateObj.getDate()).padStart(2, '0')}일`
})

const handleMenu = () => {
  // 메뉴는 MobileLayout에서 처리
}

const handleSearch = () => {
  router.push({ name: 'MobileSearch' })
}

const handlePlus = () => {
  router.push({ 
    name: 'MobileScheduleForm',
    query: { date: route.params.date }
  })
}

const viewScheduleDetail = (schedule) => {
  router.push({
    name: 'MobileScheduleDetail',
    params: { id: schedule.id }
  })
}

const fetchSchedules = async () => {
  try {
    const date = route.params.date || new Date().toISOString().split('T')[0]
    const [year, month, day] = date.split('-')
    const response = await getDailyCalendar(parseInt(year), parseInt(month), parseInt(day))
    schedules.value = response.data || []
  } catch (error) {
    console.error('일정 조회 오류:', error)
  }
}

onMounted(() => {
  fetchSchedules()
})
</script>

