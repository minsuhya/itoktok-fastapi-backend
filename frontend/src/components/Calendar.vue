<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCalendarStore } from '@/stores/calendarStore'

defineOptions({ name: 'CalendarView' })

const router = useRouter()
const calendarStore = useCalendarStore()
const currentDate = ref(new Date())
const selectedDate = ref(null) 
const today = new Date()

const days = ['일', '월', '화', '수', '목', '금', '토']

const currentMonth = computed(() => {
  return currentDate.value.getMonth()
})

const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

const daysInMonth = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  
  const days = []
  // 이전 달의 날짜들
  const prevMonthLastDate = new Date(year, month, 0).getDate()
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: prevMonthLastDate - i,
      isCurrentMonth: false,
      isPrevMonth: true
    })
  }
  
  // 현재 달의 날짜들
  for (let i = 1; i <= lastDate; i++) {
    days.push({
      date: i,
      isCurrentMonth: true,
      isSelected: selectedDate.value && 
                  selectedDate.value.getDate() === i && 
                  selectedDate.value.getMonth() === currentMonth.value &&
                  selectedDate.value.getFullYear() === currentYear.value,
      isToday: today.getDate() === i && 
               today.getMonth() === currentMonth.value &&
               today.getFullYear() === currentYear.value
    })
  }
  
  // 다음 달의 날짜들
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isNextMonth: true
    })
  }
  
  return days
})

const selectDate = (day) => {
  let selectedYear = currentYear.value
  let selectedMonth = currentMonth.value
  
  if (day.isPrevMonth) {
    if (currentMonth.value === 0) {
      selectedYear = currentYear.value - 1
      selectedMonth = 11
    } else {
      selectedMonth = currentMonth.value - 1
    }
  } else if (day.isNextMonth) {
    if (currentMonth.value === 11) {
      selectedYear = currentYear.value + 1
      selectedMonth = 0
    } else {
      selectedMonth = currentMonth.value + 1
    }
  }

  selectedDate.value = new Date(selectedYear, selectedMonth, day.date)
  
  // 스토어에 선택된 날짜 저장
  calendarStore.setSelectedDate(selectedDate.value)

  // 현재 라우트에 따라 다른 동작 수행
  router.push(`/admin/weekly`)
}

const prevMonth = () => {
  // 이전달의 첫날로 설정
  const firstDayOfPrevMonth = new Date(currentYear.value, currentMonth.value - 1, 1)
  currentDate.value = firstDayOfPrevMonth
  
  // 스토어에 선택된 날짜 저장
  calendarStore.setSelectedDate(firstDayOfPrevMonth)

  // if (route.path.includes('/admin/monthly')) {
  //   router.push('/admin/monthly')
  // }
}

const nextMonth = () => {
  // 다음달의 첫날로 설정  
  const firstDayOfNextMonth = new Date(currentYear.value, currentMonth.value + 1, 1)
  currentDate.value = firstDayOfNextMonth

  // 스토어에 선택된 날짜 저장
  calendarStore.setSelectedDate(firstDayOfNextMonth)

  // if (route.path.includes('/admin/monthly')) {
  //   router.push('/admin/monthly')
  // }
}
</script>

<template>
  <div class="w-auto bg-white rounded-lg shadow">
    <div class="p-2">
      <!-- 달력 헤더 -->
      <div class="flex items-center justify-between mb-1">
        <button @click="prevMonth" class="text-gray-800 hover:text-gray-800">
          <span class="material-icons">◀</span>
        </button>
        <h2 class="text-lg text-gray-800 font-semibold">
          {{ currentYear }}-{{ String(currentMonth + 1).padStart(2, '0') }}
        </h2>
        <button @click="nextMonth" class="text-gray-800 hover:text-gray-800">
          <span class="material-icons">▶</span>
        </button>
      </div>

      <!-- 요일 헤더 -->
      <div class="grid grid-cols-7 gap-1 mb-1">
        <div v-for="day in days" :key="day" class="text-center text-sm font-medium">
          <span :class="day === '일' ? 'text-red-500' : 'text-gray-800'">{{ day }}</span>
        </div>
      </div>

      <!-- 달력 날짜 -->
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="(day, index) in daysInMonth"
          :key="index"
          @click="selectDate(day)"
          class="text-center text-gray-800 py-1 cursor-pointer text-sm"
          :class="{
            'text-gray-500': !day.isCurrentMonth,
            'text-red-500': new Date(currentYear, currentMonth, day.date).getDay() === 0 && day.isCurrentMonth,
            'bg-blue-100 rounded': day.isSelected,
            'bg-green-100 rounded': day.isToday,
            'hover:bg-gray-100 rounded': !day.isSelected && !day.isToday
          }"
        >
          {{ day.date }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-icons {
  font-size: 1rem;
}
</style>
