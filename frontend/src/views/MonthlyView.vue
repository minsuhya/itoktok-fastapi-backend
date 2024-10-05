<script setup>
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  PlusIcon,
  PencilSquareIcon
} from '@heroicons/vue/20/solid'
import ScheduleFormSliding from '@/views/ScheduleFormSliding.vue'
import DailyViewSliding from '@/views/DailyViewSliding.vue'
import { getMonthlyCalendar } from '@/api/schedule'
import { ref, reactive, onMounted, onBeforeMount } from 'vue'

const isZoomed = reactive({})
const isVisible = ref(false)
const isDailyViewSlidingVisible = ref(false)
const currentScheduleId = ref('')
const currentScheduleDate = ref('')

const zoom = (index, item_index, event) => {
  event.stopPropagation() // 이벤트 전파 중지
  if (!isZoomed[index]) {
    isZoomed[index] = {}
  }
  isZoomed[index][item_index] = !isZoomed[index][item_index]
}

// 일정 상세 등록/수정 Form 토글
const toggleForm = () => {
  isVisible.value = !isVisible.value
  if (!isVisible.value) {
    currentScheduleId.value = ''
    currentScheduleDate.value = ''
  }
  // currentYear, currentMonth Schedule 가져오기
  fetchSchedule(currentDateInfo.value.currentYear, currentDateInfo.value.currentMonth)
}

// DailyViewSliding
const toggleDailyViewSliding = () => {
  isDailyViewSlidingVisible.value = !isDailyViewSlidingVisible.value
  if (!isDailyViewSlidingVisible.value) {
    currentScheduleDate.value = ''
  }
  // currentYear, currentMonth Schedule 가져오기
  fetchSchedule(currentDateInfo.value.currentYear, currentDateInfo.value.currentMonth)
}

const clickMoreDailyView = (schedule_date) => {
  currentScheduleDate.value = schedule_date
  toggleDailyViewSliding()
}

const clickCalendarDay = (date) => {
  currentScheduleDate.value = date
  toggleForm()
}

const clickCalendarSchedule = (scheduleId, scheduleDate) => {
  currentScheduleId.value = parseInt(scheduleId, 10)
  currentScheduleDate.value = scheduleDate
  toggleForm()
}

// 날짜 관련 Reference
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
const schedule_data = ref([])
const currentDateInfo = ref({})
const today = ref('')

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

today.value = formatDate(new Date())
console.log('today:', today.value)

// 현재 날짜 정보 가져오기
const getCurrentDateInfo = (year, month) => {
  const currentDate = new Date(year, month, 1)
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1 // 월은 0부터 시작하므로 +1

  // 이전 월 계산
  let prevYear = currentYear
  let prevMonth = currentMonth - 1
  if (prevMonth === 0) {
    prevMonth = 12
    prevYear -= 1
  }

  // 다음 월 계산
  let nextYear = currentYear
  let nextMonth = currentMonth + 1
  if (nextMonth === 13) {
    nextMonth = 1
    nextYear += 1
  }
  console.log('currentYear:', currentYear, 'currentMonth:', currentMonth)

  return {
    currentDate,
    currentYear,
    currentMonth,
    currentMonthName: monthNames[currentMonth - 1],
    prevYear,
    prevMonth,
    prevMonthName: monthNames[prevMonth - 1],
    nextYear,
    nextMonth,
    nextMonthName: monthNames[nextMonth - 1]
  }
}

// Schedule 가져오기
const fetchSchedule = async (year, month) => {
  if (!year) {
    year = new Date().getFullYear()
  }
  if (!month) {
    month = new Date().getMonth() + 1
  }

  try {
    const data = await getMonthlyCalendar(year, month)
    schedule_data.value = data.data
    setDateInfo(year, month - 1)
    console.log('schedule_data:', schedule_data.value)
  } catch (error) {
    console.error('Error fetching monthly schedule data:', error)
  }
}

const setDateInfo = (year, month) => {
  currentDateInfo.value = getCurrentDateInfo(year, month)
}

onBeforeMount(() => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth()

  setDateInfo(year, month)

  // currentYear, currentMonth Schedule 가져오기
  fetchSchedule(currentDateInfo.value.currentYear, currentDateInfo.value.currentMonth)
})
</script>

<template>
  <!-- ====== Page Title Section Start -->
  <section>
    <div class="w-full sm:container">
      <div class="border-black border-l-[5px] pl-5">
        <h2 class="text-dark mb-2 text-2xl font-semibold dark:text-white">Monthly Schedule</h2>
        <!-- <p class="text-body-color dark:text-dark-6 text-sm font-medium"> -->
        <!--   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultrices lectus sem. -->
        <!-- </p> -->
      </div>
    </div>
  </section>
  <!-- ====== Page Title Section End -->
  <div class="max-w-full mx-auto p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <button class="p-2 rounded-full font-semibold"
          @click="fetchSchedule(currentDateInfo.prevYear, currentDateInfo.prevMonth)">
          <ChevronLeftIcon class="w-6 h-6" />
        </button>
        <h2 class="text-xl font-semibold">
          {{ currentDateInfo.currentMonthName }} {{ currentDateInfo.currentYear }}
        </h2>
        <button class="p-2 rounded-full font-semibold"
          @click="fetchSchedule(currentDateInfo.nextYear, currentDateInfo.nextMonth)">
          <ChevronRightIcon class="w-6 h-6" />
        </button>
      </div>
      <div class="flex space-x-2 text-sm font-semibold">
        <button class="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center" @click="fetchSchedule()">
          <span>Today</span>
        </button>
        <button class="px-4 py-2 bg-blue-500 text-white rounded-md" @click="toggleForm">
          상담 등록
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden text-sm">
      <!-- Day Names -->
      <div class="bg-white py-2 text-center text-sm font-medium">Mon</div>
      <div class="bg-white py-2 text-center text-sm font-medium">Tue</div>
      <div class="bg-white py-2 text-center text-sm font-medium">Wed</div>
      <div class="bg-white py-2 text-center text-sm font-medium">Thu</div>
      <div class="bg-white py-2 text-center text-sm font-medium">Fri</div>
      <div class="bg-white py-2 text-center text-sm font-medium">Sat</div>
      <div class="bg-white py-2 text-center text-sm font-medium">Sun</div>

      <!-- schedule data loop -->
      <div class="bg-white h-32 p-2" v-for="(day_schedules, index) in schedule_data" :key="index"
        @click="clickCalendarDay(index)">
        <span :class="{
          'block text-sm bg-sky-500 text-white ring rounded-full font-semibold w-5 text-center':
            index === today
        }">{{ index.split('-')[2] }}</span>
        <div class="flex-row text-xs text-blue-600 border border-blue-700/10 rounded-md m-1 space-y-1"
          v-for="(day_schedule, itemindex) in day_schedules.slice(0, 2)" :key="itemindex" :class="[
            'transform transition duration-500 ease-in-out overflow-hidden',
            !isZoomed[index]?.[itemindex]
              ? 'scale-100 h-6 bg-blue-400/20'
              : 'scale-105 h-auto min-h-6 w-full pt-1 bg-white/100 border-blue-700'
          ]" @click="zoom(index, itemindex, $event)">
          <div class="flex justify-between items-center px-1 h-full w-full">
            <span class="inline-block">[{{ day_schedule.client_name }}] {{ day_schedule.teacher_expertise }}</span>
            <span class="ml-auto inline-block">{{ day_schedule.schedule_time }}</span>
          </div>
          <div class="flex justify-between items-center px-1 h-full w-full">
            <span class="inline-block">상담사</span>
            <span class="ml-auto inline-block">{{ day_schedule.teacher_fullname }}</span>
          </div>
          <div class="flex justify-between items-center px-1 h-full w-full">
            <span class="inline-block">상담시간</span>
            <span class="ml-auto inline-block">{{ day_schedule.start_time }} ~ {{ day_schedule.finish_time }}</span>
          </div>
          <div class="flex justify-between items-center px-1 h-full w-full">
            <span class="inline-block">상담제목</span>
            <span class="ml-auto inline-block">{{ day_schedule.title }}</span>
          </div>
          <div class="flex justify-center items-center px-1 h-full w-full">
            <!-- 수정 버튼 -->
            <button class="text-xs text-blue-600 border border-blue-700/10 rounded-md m-1 p-0.5 bg-blue-400/20"
              @click="clickCalendarSchedule(day_schedule.schedule_id, day_schedule.schedule_date)">
              <PencilSquareIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div v-if="day_schedules.length > 2"
          class="mt-4 flex items-center justify-center text-xs text-blue-600 border border-blue-700/10 rounded-md m-1 p-0.5 bg-blue-400/20"
          @click.stop="clickMoreDailyView(index)">
          <PlusIcon class="w-4 h-4" />
        </div>
      </div>
    </div>
    <ScheduleFormSliding :isVisible="isVisible" :scheduleId="currentScheduleId" :scheduleDate="currentScheduleDate"
      @close="toggleForm" class="z-20" />
    <DailyViewSliding :isDailyViewSlidingVisible="isDailyViewSlidingVisible" :scheduleDate="currentScheduleDate"
      @close="toggleDailyViewSliding" @clickCalendarSchedule="clickCalendarSchedule" class="z-10" />
  </div>
</template>

<style></style>
