<template>
  <MobileLayout
    header-title="일정"
    :show-menu="true"
    :show-plus="true"
    active-tab="calendar"
    @menu="handleMenu"
    @plus="handlePlus"
  >
    <div class="p-4">
      <!-- 월 선택 -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between">
          <button @click="previousMonth" class="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h2 class="font-semibold text-lg">{{ currentMonthText }}</h2>
          <button @click="nextMonth" class="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 달력 -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div class="text-center text-xs font-semibold text-gray-500 py-2">일</div>
          <div class="text-center text-xs font-semibold text-gray-500 py-2">월</div>
          <div class="text-center text-xs font-semibold text-gray-500 py-2">화</div>
          <div class="text-center text-xs font-semibold text-gray-500 py-2">수</div>
          <div class="text-center text-xs font-semibold text-gray-500 py-2">목</div>
          <div class="text-center text-xs font-semibold text-gray-500 py-2">금</div>
          <div class="text-center text-xs font-semibold text-gray-500 py-2">토</div>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <div 
            v-for="day in calendarDays" 
            :key="day.date"
            @click="selectDate(day.date)"
            :class="[
              'text-center py-2 rounded-lg cursor-pointer text-sm',
              day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
              day.isToday ? 'bg-blue-100 text-blue-600 font-semibold' : '',
              day.isSelected ? 'bg-blue-600 text-white font-semibold' : '',
              day.hasSchedule ? 'font-semibold' : ''
            ]"
          >
            {{ day.day }}
          </div>
        </div>
      </div>

      <!-- 일정 목록 -->
      <div class="bg-white rounded-lg shadow-sm p-4">
        <h3 class="font-semibold text-lg mb-3">일정 목록</h3>
        <div v-if="schedules.length === 0" class="text-center py-8 text-gray-500">
          등록된 일정이 없습니다.
        </div>
        <div v-else class="space-y-3">
          <div 
            v-for="schedule in schedules" 
            :key="schedule.id"
            @click="viewScheduleDetail(schedule)"
            class="border-l-4 border-blue-600 pl-4 py-2 cursor-pointer hover:bg-gray-50 rounded-r-lg"
          >
            <div class="text-sm text-gray-500">{{ schedule.time }}</div>
            <div class="font-semibold">{{ schedule.title }}</div>
            <div class="text-sm text-gray-600 mt-1">{{ schedule.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </MobileLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MobileLayout from '@/mobile/components/MobileLayout.vue'
import { getMonthlyCalendar } from '@/api/schedule'

const router = useRouter()
const currentDate = ref(new Date())
const selectedDate = ref(new Date())
const schedules = ref([])

const currentMonthText = computed(() => {
  const date = currentDate.value
  return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월`
})

const currentMonth = computed(() => {
  const date = currentDate.value
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1
  }
})

const calendarDays = computed(() => {
  const year = currentMonth.value.year
  const month = currentMonth.value.month
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  
  const days = []
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  
  // 이전 달의 마지막 날들
  const prevMonth = new Date(year, month - 2, 0)
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 2, prevMonth.getDate() - i)
    days.push({
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      hasSchedule: false
    })
  }
  
  // 현재 달의 날들
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const dateStr = date.toISOString().split('T')[0]
    days.push({
      date: dateStr,
      day: day,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedDate.value.toISOString().split('T')[0],
      hasSchedule: schedules.value.some(s => s.date === dateStr)
    })
  }
  
  // 다음 달의 첫 날들 (42개 셀 채우기)
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month, day)
    days.push({
      date: date.toISOString().split('T')[0],
      day: day,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      hasSchedule: false
    })
  }
  
  return days
})

const previousMonth = () => {
  const date = new Date(currentDate.value)
  date.setMonth(date.getMonth() - 1)
  currentDate.value = date
  fetchSchedules()
}

const nextMonth = () => {
  const date = new Date(currentDate.value)
  date.setMonth(date.getMonth() + 1)
  currentDate.value = date
  fetchSchedules()
}

const selectDate = (dateStr) => {
  selectedDate.value = new Date(dateStr)
  router.push({
    name: 'MobileScheduleList',
    params: { date: dateStr }
  })
}

const handleMenu = () => {
  // 메뉴는 MobileLayout에서 처리
}

const handlePlus = () => {
  router.push({ name: 'MobileScheduleForm' })
}

const viewScheduleDetail = (schedule) => {
  router.push({
    name: 'MobileScheduleDetail',
    params: { id: schedule.id }
  })
}

const fetchSchedules = async () => {
  try {
    const response = await getMonthlyCalendar(
      currentMonth.value.year,
      currentMonth.value.month
    )
    // interceptors에서 이미 response.data를 반환하므로 직접 사용
    // API 응답이 배열인 경우 그대로 사용, 객체인 경우 data 속성 확인
    if (Array.isArray(response)) {
      schedules.value = response
    } else if (response && response.data) {
      schedules.value = Array.isArray(response.data) ? response.data : []
    } else {
      schedules.value = []
    }
  } catch (error) {
    console.error('일정 조회 오류:', error)
    schedules.value = []
    // 에러 발생 시에도 빈 배열로 설정하여 화면이 표시되도록 함
  }
}

onMounted(() => {
  fetchSchedules()
})
</script>

