<script setup>
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/vue/20/solid'
import ScheduleFormSliding from '@/views/ScheduleFormSliding.vue'
import DailyViewSliding from '@/views/DailyViewSliding.vue'
import { ref, reactive, onBeforeMount, watch } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import { useTeacherStore } from '@/stores/teacherStore'
import { getWeeklyCalendar, deleteScheduleList } from '@/api/schedule'

const calendarStore = useCalendarStore()
const teacherStore = useTeacherStore()
// Ref 설정
const isZoomed = reactive({})
const isVisible = ref(false)
const isDailyViewSlidingVisible = ref(false)
const currentScheduleId = ref('')
const currentScheduleListId = ref('')
const currentScheduleDate = ref('')
const currentScheduleTime = ref('')
const schedule_data = ref([])
const currentDateInfo = ref({})
const today = new Date()

// 날짜 관련 Reference
const weekNames = ['Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat', 'Sun']

const zoom = (day_index, time_index, item_index, event) => {
  event.stopPropagation() // 이벤트 전파 중지
  if (!isZoomed[day_index]) {
    isZoomed[day_index] = {}
  }
  if (!isZoomed[day_index][time_index]) {
    isZoomed[day_index][time_index] = {}
  }
  isZoomed[day_index][time_index][item_index] = !isZoomed[day_index][time_index][item_index]

  // Sibling 요소 hidden 처리
  const parentElement = event.target.closest('.relative')
  if (parentElement) {
    const siblings = parentElement.parentElement.children
    for (let sibling of siblings) {
      if (sibling !== parentElement) {
        sibling.style.display = isZoomed[day_index][time_index][item_index] ? 'none' : ''
      }
    }
  }
}

// 시간 변환 함수
const convertTo12HourFormat = (hour) => {
  const period = hour >= 12 ? 'PM' : 'AM'
  const adjustedHour = hour % 12 || 12
  return `${adjustedHour} ${period}`
}

function formatHour(hour) {
  if (hour < 10) {
    return `0${hour}:00`
  }
  return `${hour}:00`
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getWeeklyDates = (startDate) => {
  const dates = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dayIndex = date.getDay() - 1
    dates.push({
      date: formatDate(date),
      day: weekNames[dayIndex === -1 ? 6 : dayIndex]
    })
  }
  return dates
}

// 일정 상세 등록/수정 Form 토글
const toggleForm = () => {
  isVisible.value = !isVisible.value
  if (!isVisible.value) {
    currentScheduleId.value = ''
    currentScheduleDate.value = ''
    currentScheduleTime.value = ''

    // currentYear, currentMonth Schedule 가져오기
    fetchSchedule(
      currentDateInfo.value.currentYear,
      currentDateInfo.value.currentMonth,
      currentDateInfo.value.currentDay
    )
  }
}

// DailyViewSliding
const toggleDailyViewSliding = () => {
  isDailyViewSlidingVisible.value = !isDailyViewSlidingVisible.value
  if (!isDailyViewSlidingVisible.value) {
    currentScheduleDate.value = ''
    currentScheduleTime.value = ''

    // currentYear, currentMonth Schedule 가져오기
    fetchSchedule(
      currentDateInfo.value.currentYear,
      currentDateInfo.value.currentMonth,
      currentDateInfo.value.currentDay
    )
  }
}

const clickMoreDailyView = (schedule_date) => {
  currentScheduleDate.value = schedule_date
  toggleDailyViewSliding()
}

const clickCalendarTime = (selected_date, selected_time, event) => {
  // 클릭한 위치의 Y 좌표를 구함
  const rect = event.target.getBoundingClientRect()
  const clickY = event.clientY - rect.top
  const cellHeight = rect.height
  
  // 시간 구간 계산 (3등분)
  let minutes = 0
  if (clickY < cellHeight / 3) {
    minutes = 0 // 첫 번째 구간: 1분
  } else if (clickY < (cellHeight * 2) / 3) {
    minutes = 20 // 두 번째 구간: 20분
  } else {
    minutes = 40 // 세 번째 구간: 40분
  }

  currentScheduleId.value = ''
  currentScheduleListId.value = ''
  currentScheduleDate.value = ''

  currentScheduleDate.value = selected_date
  currentScheduleTime.value = `${selected_time}:${minutes.toString().padStart(2, '0')}`
  toggleForm()
  console.log('currentScheduleTime:', currentScheduleTime.value)
}

const clickCalendarSchedule = (scheduleId, scheduleListId, scheduleDate) => {
  currentScheduleId.value = String(scheduleId)
  currentScheduleListId.value = String(scheduleListId)
  currentScheduleDate.value = scheduleDate
  toggleForm()
}

// 해당 일정 삭제
const deleteCalendarSchedule = async (scheduleListId) => {
  if (!confirm('해당 일정을 삭제하시겠습니까?')) return
  if (!scheduleListId) return

  try {
    await deleteScheduleList(scheduleListId)
    fetchSchedule(currentDateInfo.value.currentYear, currentDateInfo.value.currentMonth)
  } catch (error) {
    console.error('Error deleting schedule:', error)
  }
}

// Schedule 가져오기
const fetchSchedule = async (year, month, day) => {
  year = year || new Date().getFullYear()
  month = month || new Date().getMonth() + 1
  day = day || new Date().getDate()

  console.log('year:', year, 'month:', month, 'day:', day)

  try {
    const data = await getWeeklyCalendar(year, month, day)
    schedule_data.value = data.data
    setDateInfo(year, month - 1, day)
    console.log('schedule_data:', schedule_data.value)
  } catch (error) {
    console.error('Error fetching monthly schedule data:', error)
  }
}

// 현재 날짜에 대한 정보 생성
const getCurrentDateInfo = (year, month, day) => {
  const date = new Date(year, month, day)
  console.log('date:', date)
  let dayOfWeek = date.getDay()
  dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // 일요일(0)을 월요일(1)로 변경

  const startDate = new Date(date)
  startDate.setDate(date.getDate() - dayOfWeek)
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)
  const prevStartDate = new Date(startDate)
  prevStartDate.setDate(startDate.getDate() - 1)
  const nextEndDate = new Date(endDate)
  nextEndDate.setDate(endDate.getDate() + 1)

  return {
    currentYear: year,
    currentMonth: month + 1,
    currentDay: day,
    weekStartDate: startDate,
    weekEndDate: endDate,
    prevStartDate: prevStartDate,
    nextEndDate: nextEndDate
  }
}

const clickBeforeWeek = () => {
  const year = currentDateInfo.value.prevStartDate.getFullYear()
  const month = currentDateInfo.value.prevStartDate.getMonth() + 1
  const day = currentDateInfo.value.prevStartDate.getDate()

  setDateInfo(year, month, day)
  fetchSchedule(year, month, day)
}

const clickNextWeek = () => {
  const year = currentDateInfo.value.nextEndDate.getFullYear()
  const month = currentDateInfo.value.nextEndDate.getMonth() + 1
  const day = currentDateInfo.value.nextEndDate.getDate()

  setDateInfo(year, month, day)
  fetchSchedule(year, month, day)
}

const setDateInfo = (year, month, day) => {
  currentDateInfo.value = getCurrentDateInfo(year, month, day)
  currentDateInfo.value.weekDates = getWeeklyDates(currentDateInfo.value.weekStartDate)
  console.log('set Date Info - currentDateInfo:', currentDateInfo.value)
}

// 일정 높이 계산 함수 추가
const calculateScheduleHeight = (startTime, finishTime) => {
  const start = new Date(`2000-01-01 ${startTime}`);
  const finish = new Date(`2000-01-01 ${finishTime}`);
  const diffMinutes = (finish - start) / (1000 * 60);
  
  // 50분 이상이면 90px, 그 이하는 비율로 계산
  return diffMinutes >= 50 ? 80 : (diffMinutes / 50) * 80;
}

// 시작 시간에 따른 top 위치 계산 함수 추가
const calculateScheduleTop = (startTime) => {
  const [hours, minutes] = startTime.split(':').map(Number)
  const minutesFromHourStart = minutes
  return (minutesFromHourStart / 60) * 90 // 90px 높이 기준으로 비율 계산
}

onBeforeMount(() => {
  currentScheduleDate.value = formatDate(new Date())
  currentScheduleTime.value = formatHour(new Date().getHours())

  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const day = new Date().getDate()

  setDateInfo(year, month, day)

  // currentYear, currentMonth Schedule 가져오기
  fetchSchedule(year, month, day)
})
// 스토어의 selectedDate 변경 감지
watch(() => calendarStore.selectedDate, (newDate) => {
  if (newDate) {
    fetchSchedule(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      newDate.getDate()
    )
  }
})

// 스토어의 selectedTeachers 변경 감지
watch(() => teacherStore.selectedTeachers, (newTeachers) => {
  if (newTeachers) {
    fetchSchedule(
      calendarStore.selectedDate.getFullYear(),
      calendarStore.selectedDate.getMonth() + 1,
      calendarStore.selectedDate.getDate()
    )
  }
})
</script>

<template>
  <!-- ====== Page Title Section Start -->
  <section>
    <div class="w-full sm:container">
      <div class="border-black border-l-[5px] pl-5">
        <h2 class="text-dark mb-2 text-2xl font-semibold dark:text-white">주간 일정</h2>
        <!-- <p class="text-body-color dark:text-dark-6 text-sm font-medium"> -->
        <!--   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultrices lectus sem. -->
        <!-- </p> -->
      </div>
    </div>
  </section>
  <div class="max-w-full mx-auto p-4">
    <!-- ====== Page Title Section End -->
    <div class="flex justify-between items-center">
      <div class="inline-flex rounded-lg border border-gray-200 bg-white p-1">
        <router-link
          to="/admin/weekly"
          class="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          :class="{ 'bg-blue-500 text-white': $route.path === '/admin/weekly' }"
        >
          <span class="text-sm font-medium"> 주간 </span>
        </router-link>

        <router-link
          to="/admin/monthly"
          class="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          :class="{ 'bg-blue-500 text-white': $route.path === '/admin/monthly' }"
        >
          <span class="text-sm font-medium"> 월간 </span>
        </router-link>
      </div>
      <div class="flex items-center space-x-2">
        <button @click.stop="clickBeforeWeek()" class="p-2 rounded-full font-semibold">
          <ChevronLeftIcon class="w-6 h-6" />
        </button>
        <h2 class="text-xl font-semibold">
          {{ formatDate(currentDateInfo.weekStartDate) }} ~
          {{ formatDate(currentDateInfo.weekEndDate) }}
        </h2>
        <button @click.stop="clickNextWeek()" class="p-2 rounded-full font-semibold">
          <ChevronRightIcon class="w-6 h-6" />
        </button>
      </div>
      <div class="flex space-x-2 text-sm font-semibold">
        <button
          @click="fetchSchedule(today.getFullYear(), today.getMonth() + 1, today.getDate())"
          class="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center"
        >
          <span>Today</span>
        </button>
        <button 
          @click="toggleForm"
          class="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          상담 등록
        </button>
      </div>
    </div>
  </div>
  <div
    class="not-prose relative bg-slate-50 rounded-xl overflow-hidden w-full mx-auto dark:bg-slate-800/25"
  >
    <div class="relative rounded-xl overflow-auto">
      <div class="mx-4 mt-4 box-content bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
        <div class="grid grid-cols-[70px,repeat(7,1fr)] grid-rows-1 h-auto">
          <!-- class="overflow-y-scroll grid grid-cols-[70px,repeat(7,1fr)] grid-rows-[auto,repeat(16,50px)] max-h-screen"> -->
          <!-- Calendar frame -->
          <div
            class="row-start-[1] col-start-[1] sticky top-0 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2"
          ></div>
          <div
            v-for="(week_days, index) in currentDateInfo.weekDates" 
            :key="index"
            :class="[
              'row-start-[1] col-start-[{{ index + 2 }}] sticky top-0 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center',
              week_days.date === today.toISOString().split('T')[0] ? 'bg-yellow-100' : 'bg-white'
            ]"
          >
            <span
              class="sm:inline-block rounded-full bg-slate-400 w-5 h-5 text-white font-semibold"
              >{{ week_days.date.split('-')[2] }}</span
            >
            {{ week_days.day }}
          </div>
        </div>
      </div>
      <div class="mx-4 mb-4 box-content bg-white dark:bg-slate-800 shadow-xl overflow-y-auto max-h-[calc(100vh-200px)]">
        <div class="grid grid-cols-[70px,repeat(7,1fr)] grid-rows-1 max-h-full h-full">
          <div class="flex-row h-full">
            <div
              v-for="times in 11"
              :key="times"
              class="h-[90px] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium relative"
            >
              <div 
                v-if="today.getHours() >= times + 7 && today.getHours() < times + 8"
                class="absolute left-0"
                :style="{
                  top: `${(today.getMinutes() / 60) * 90}px`
                }"
              >
                <div class="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-red-500"></div>
              </div>
              {{ times + 7 >= 12 ? `${(times + 7) % 12 || 12} PM` : `${times + 7} AM` }}
            </div>
          </div>
          <!-- 요일/날짜 반복 -->
          <div
            v-for="(day_schedule, dayIndex) in schedule_data"
            :key="dayIndex"
            class="flex-row h-full items-center text-center border-slate-100 dark:border-slate-200/5 border-r divide-y divide-slate-100 dark:divide-slate-200"
          >
            <!-- 시간 반복 -->
            <div
              v-for="(time_schedules, timeIndex) in day_schedule"
              :key="timeIndex"
              @click="clickCalendarTime(dayIndex, timeIndex, $event)"
              :class="[
                'h-[90px] text-xs text-slate-400 font-medium p-[1px] relative',
                dayIndex === new Date().toISOString().split('T')[0] ? 'bg-yellow-100' : ''
              ]"
            >
              <div class="absolute left-0 w-full border-t border-slate-100 top-[30px]"></div>
              <div class="absolute left-0 w-full border-t border-slate-100 top-[60px]"></div>
              <div 
                v-if="dayIndex == new Intl.DateTimeFormat('fr-CA').format(new Date()) && 
                      timeIndex == Math.floor(new Date().getHours())"
                class="absolute left-0 w-full border-t border-red-500 border-dashed"
                :style="{
                  top: `${(new Date().getMinutes() / 60) * 90}px`
                }"
              ></div>
              <!-- 시간 대 개별일정들 -->
              <div
                class="absolute flex-row text-xs text-black border border-gray-700 rounded-md m-1 space-y-1 w-full pt-1 border-blue-700"
                v-for="(time_schedule, itemindex) in time_schedules"
                :key="itemindex"
                :class="[
                  'transform transition duration-500 ease-in-out overflow-hidden absolute',
                  !isZoomed[dayIndex]?.[timeIndex]?.[itemindex]
                    ? 'scale-100'
                    : 'scale-105 w-full pt-1 border-blue-700'
                ]"
                :style="{
                  backgroundColor: !isZoomed[dayIndex]?.[timeIndex]?.[itemindex]
                    ? `${time_schedule.teacher_usercolor}`
                    : 'rgb(255, 255, 255)',
                  zIndex: !isZoomed[dayIndex]?.[timeIndex]?.[itemindex] ? 1 : 10,
                  height: calculateScheduleHeight(time_schedule.start_time, time_schedule.finish_time) + 'px',
                  left: itemindex > 0 ? (itemindex * 20) + 'px' : '0px',
                  width: itemindex > 0 ? 'calc(98% - ' + (itemindex * 20) + 'px)' : '98%',
                  top: calculateScheduleTop(time_schedule.start_time) + 'px'
                }"
                @click.stop="
                  clickCalendarSchedule(
                    time_schedule.schedule_id,
                    time_schedule.id,
                    time_schedule.schedule_date
                  )
                "
              >
                <div class="flex justify-between items-center px-1 w-full">
                  <span class="inline-block">{{ time_schedule.schedule_time }}</span>
                  <span class="ml-auto inline-block whitespace-nowrap overflow-hidden text-ellipsis"
                    >[{{ time_schedule.client_name }}] {{ time_schedule.program_name.length > 10 ? time_schedule.program_name.slice(0,10) + '...' : time_schedule.program_name }}</span
                  >
                </div>
                <div class="flex justify-between items-center px-1 w-full">
                  <span class="inline-block">상담사</span>
                  <span class="ml-auto inline-block">{{ time_schedule.teacher_fullname }}</span>
                </div>
                <div class="flex justify-between items-center px-1 w-full">
                  <span class="inline-block">상담시간</span>
                  <span class="ml-auto inline-block"
                    >{{ time_schedule.start_time }} ~ {{ time_schedule.finish_time }}</span
                  >
                </div>
              </div>
              <div
                v-if="time_schedules.length > 2"
                class="flex items-center justify-center ml-auto w-6 h-5 text-xs text-black border border-blue-700/10 rounded-md m-1 bg-blue-400/20"
                @click.stop="clickMoreDailyView(dayIndex)"
              >
                <PlusIcon class="w-5 h-4" /> {{ time_schedules.length - 2 }}
              </div>
              <!-- 시간 대 개별일정들 END -->
            </div>
            <!-- 시간 반복 END -->
          </div>
          <!-- 요일/날짜 반복 END -->
        </div>
      </div>
    </div>
    <div
      class="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"
    ></div>
    <ScheduleFormSliding
      :isVisible="isVisible"
      :scheduleId="currentScheduleId"
      :scheduleListId="currentScheduleListId"
      :scheduleDate="currentScheduleDate"
      :scheduleTime="currentScheduleTime"
      @close="toggleForm"
      class="z-20"
    />
    <DailyViewSliding
      :isDailyViewSlidingVisible="isDailyViewSlidingVisible"
      :scheduleDate="currentScheduleDate"
      :scheduleTime="currentScheduleTime"
      @close="toggleDailyViewSliding"
      @clickCalendarSchedule="clickCalendarSchedule"
      class="z-10"
    />
  </div>
</template>

<style></style>
