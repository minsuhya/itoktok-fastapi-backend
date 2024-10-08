<script setup>
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/20/solid'
import { ref, reactive, onBeforeMount } from 'vue'
import { getWeeklyCalendar } from '@/api/schedule'

// Ref 설정
const schedule_data = ref([])
const currentDateInfo = ref({})
const today = ref('')

// Schedule 가져오기
const fetchSchedule = async (year, month, day) => {
  year = year || new Date().getFullYear()
  month = (month || new Date().getMonth()) + 1
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
  const dayOfWeek = date.getDay()

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

const setDateInfo = (year, month, day) => {
  currentDateInfo.value = getCurrentDateInfo(year, month, day)
}

onBeforeMount(() => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth()
  const day = new Date().getDate()

  setDateInfo(year, month, day)

  // currentYear, currentMonth Schedule 가져오기
  fetchSchedule(year, month, day)
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
  <!-- ====== Page Title Section End -->
  <div class="flex justify-between items-center mb-4">
    <div class="flex items-center space-x-2">
      <button class="p-2 rounded-full font-semibold">
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
      <h2 class="text-xl font-semibold">2024.09.01 ~ 2024.09.07</h2>
      <button class="p-2 rounded-full font-semibold">
        <ChevronRightIcon class="w-6 h-6" />
      </button>
    </div>
    <div class="flex space-x-2 text-sm font-semibold">
      <button class="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center">
        <span>Today</span>
      </button>
      <button class="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center">
        <span>Monthly</span>
      </button>
      <button class="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center">
        <span>Daily</span>
      </button>
      <button class="px-4 py-2 bg-blue-500 text-white rounded-md">상담 등록</button>
    </div>
  </div>

  <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden w-full mx-auto dark:bg-slate-800/25">
    <div class="relative rounded-xl overflow-auto">
      <div class="mx-4 my-4 box-content bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
        <div class="grid grid-cols-[70px,repeat(7,1fr)] grid-rows-[auto,repeat(16,50px)] max-h-full">
          <!-- class="overflow-y-scroll grid grid-cols-[70px,repeat(7,1fr)] grid-rows-[auto,repeat(16,50px)] max-h-screen"> -->
          <!-- Calendar frame -->
          <div
            class="row-start-[1] col-start-[1] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2">
          </div>
          <div
            class="row-start-[1] col-start-[2] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
            <span class="sm:inline-block rounded-full bg-slate-400 w-4 h-4 text-white font-semibold">1</span>
            Sun
          </div>
          <div
            class="row-start-[1] col-start-[3] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
            <span class="sm:inline-block rounded-full bg-slate-400 w-4 h-4 text-white font-semibold">2</span>
            Mon
          </div>
          <div
            class="row-start-[1] col-start-[4] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
            <span class="sm:inline-block rounded-full bg-slate-400 w-4 h-4 text-white font-semibold">3</span>
            Tue
          </div>
          <div
            class="row-start-[1] col-start-[5] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
            <span class="sm:inline-block rounded-full bg-slate-400 w-4 h-4 text-white font-semibold">4</span>
            Wed
          </div>
          <div
            class="row-start-[1] col-start-[6] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
            <span class="sm:inline-block rounded-full bg-slate-400 w-4 h-4 text-white font-semibold">5</span>
            Thu
          </div>
          <div
            class="row-start-[1] col-start-[7] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
            <span class="sm:inline-block rounded-full bg-slate-400 w-4 h-4 text-white font-semibold">6</span>
            Fri
          </div>
          <div
            class="row-start-[1] col-start-[8] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
            <span class="sm:inline-block rounded-full bg-slate-400 w-4 h-4 text-white font-semibold">7</span>
            Sat
          </div>
          <div
            class="row-start-[2] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            5 AM
          </div>
          <div class="row-start-[2] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[2] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[2] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[2] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[2] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[2] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[2] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[3] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            6 AM
          </div>
          <div class="row-start-[3] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[3] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[3] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[3] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[3] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[3] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[3] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[4] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            7 AM
          </div>
          <div class="row-start-[4] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[4] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[4] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[4] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[4] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[4] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[4] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[5] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            8 AM
          </div>
          <div class="row-start-[5] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[5] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[5] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[5] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[5] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[5] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[5] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[6] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            9 AM
          </div>
          <div class="row-start-[6] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[6] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[6] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[6] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[6] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[6] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[6] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[7] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            10 AM
          </div>
          <div class="row-start-[7] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[7] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[7] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[7] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[7] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[7] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[7] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[8] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            11 AM
          </div>
          <div class="row-start-[8] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[8] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[8] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[8] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[8] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[8] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[8] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[9] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            12 PM
          </div>
          <div class="row-start-[9] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[9] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[9] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[9] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[9] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[9] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[9] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[10] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            1 PM
          </div>
          <div class="row-start-[10] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[10] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[10] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[10] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[10] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[10] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[10] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[11] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            2 PM
          </div>
          <div class="row-start-[11] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[11] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[11] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[11] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[11] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[11] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[11] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[12] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            3 PM
          </div>
          <div class="row-start-[12] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[12] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[12] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[12] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[12] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[12] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[12] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[13] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            4 PM
          </div>
          <div class="row-start-[13] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[13] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[13] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[13] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[13] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[13] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[13] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[14] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            5 PM
          </div>
          <div class="row-start-[14] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[14] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[14] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[14] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[14] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[14] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[14] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[15] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            6 PM
          </div>
          <div class="row-start-[15] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[15] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[15] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[15] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[15] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[15] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[15] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[16] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            7 PM
          </div>
          <div class="row-start-[16] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[16] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[16] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[16] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[16] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[16] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[16] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[17] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            8 PM
          </div>
          <div class="row-start-[17] col-start-[2] border-slate-100 dark:border-slate-200/5 border-r"></div>
          <div class="row-start-[17] col-start-[3] border-slate-100 dark:border-slate-200/5 border-r"></div>
          <div class="row-start-[17] col-start-[4] border-slate-100 dark:border-slate-200/5 border-r"></div>
          <div class="row-start-[17] col-start-[5] border-slate-100 dark:border-slate-200/5 border-r"></div>
          <div class="row-start-[17] col-start-[6] border-slate-100 dark:border-slate-200/5 border-r"></div>
          <div class="row-start-[17] col-start-[7] border-slate-100 dark:border-slate-200/5 border-r"></div>
          <div class="row-start-[17] col-start-[8]"></div>
          <!-- Calendar contents -->
          <div
            class="row-start-[2] col-start-3 row-span-4 bg-blue-400/20 dark:bg-sky-600/50 border border-blue-700/10 dark:border-sky-500 rounded-lg m-1 p-1 flex flex-col">
            <span class="text-xs text-blue-600 dark:text-sky-100">5 AM</span>
            <span class="text-xs font-medium text-blue-600 dark:text-sky-100">Flight to Vancouver</span>
            <span class="text-xs text-blue-600 dark:text-sky-100">Toronto YYZ</span>
          </div>
          <div
            class="row-start-[3] col-start-[4] row-span-4 bg-purple-400/20 dark:bg-fuchsia-600/50 border border-purple-700/10 dark:border-fuchsia-500 rounded-lg m-1 p-1 flex flex-col">
            <span class="text-xs text-purple-600 dark:text-fuchsia-100">6 AM</span>
            <span class="text-xs font-medium text-purple-600 dark:text-fuchsia-100">Breakfast</span>
            <span class="text-xs text-purple-600 dark:text-fuchsia-100">Mel's Diner</span>
          </div>
          <div
            class="row-start-[14] col-start-[7] row-span-3 bg-pink-400/20 dark:bg-indigo-600/50 border border-pink-700/10 dark:border-indigo-500 rounded-lg m-1 p-1 flex flex-col">
            <span class="text-xs text-pink-600 dark:text-indigo-100">5 PM</span>
            <span class="text-xs font-medium text-pink-600 dark:text-indigo-100">🎉 Party party 🎉</span>
            <span class="text-xs text-pink-600 dark:text-indigo-100">We like to party!</span>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
  </div>
</template>

<style></style>
