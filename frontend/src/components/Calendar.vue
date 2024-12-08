<script setup>
import { ref, computed } from 'vue'

const currentDate = ref(new Date())
const selectedDate = ref(null)

const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
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
                  selectedDate.value.getFullYear() === currentYear.value
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

const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1)
}

const selectDate = (day) => {
  if (day.isCurrentMonth) {
    selectedDate.value = new Date(currentYear.value, currentMonth.value, day.date)
  }
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
            'hover:bg-gray-100 rounded': day.isCurrentMonth && !day.isSelected
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