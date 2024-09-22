<script setup>
import { ChevronRightIcon, ChevronLeftIcon, PlusIcon } from '@heroicons/vue/20/solid'
import ScheduleFormSliding from '@/views/ScheduleFormSliding.vue'
import { getMonthlyCalendar } from '@/api/schedule'
import { ref, reactive, onMounted } from 'vue'

const isZoomed = reactive({})
const zoom = (index, item_index, event) => {
  event.stopPropagation(); // 이벤트 전파 중지
  if (!isZoomed[index]) {
    isZoomed[index] = {};
  }
  isZoomed[index][item_index] = !isZoomed[index][item_index]
}

const isVisible = ref(false)
const currentScheduleId = ref('')
const toggleForm = (scheduleId) => {
  currentScheduleId.value = String(scheduleId)
  isVisible.value = !isVisible.value
  if (!isVisible.value) {
    currentScheduleId.value = ''
  }
}

// 날짜 관련 Reference
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const schedule_data = ref([])
const currentDateInfo = ref({})
const today = ref('');

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

today.value = formatDate(new Date());
console.log('today:', today.value)

// 현재 날짜 정보 가져오기
const getCurrentDateInfo = (year, month) => {
  const currentDate = new Date(year, month, 1);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1

  // 이전 월 계산
  let prevYear = currentYear;
  let prevMonth = currentMonth - 1;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }

  // 다음 월 계산
  let nextYear = currentYear;
  let nextMonth = currentMonth + 1;
  if (nextMonth === 13) {
    nextMonth = 1;
    nextYear += 1;
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
  };
};

// Schedule 가져오기
const fetchSchedule = async (year, month) => {
  if (!year) {
    year = new Date().getFullYear();
  }
  if (!month) {
    month = new Date().getMonth() + 1;
  }

  try {
    const data = await getMonthlyCalendar(year, month)
    schedule_data.value = data.data
    setDateInfo(year, month - 1)
    console.log('schedule_data:', schedule_data.value)
  } catch (error) {
    console.error('Error fetching monthly schedule data:', error)
  }
};

const setDateInfo = (year, month) => {
  currentDateInfo.value = getCurrentDateInfo(year, month);
}

// onmounted hook
onMounted(() => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();

  setDateInfo(year, month)

  // currentYear, currentMonth Schedule 가져오기
  fetchSchedule(currentDateInfo.value.currentYear, currentDateInfo.value.currentMonth)
});

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
        <h2 class="text-xl font-semibold">{{ currentDateInfo.currentMonthName }} {{
          currentDateInfo.currentYear }}</h2>
        <button class="p-2 rounded-full font-semibold"
          @click="fetchSchedule(currentDateInfo.nextYear, currentDateInfo.nextMonth)">
          <ChevronRightIcon class="w-6 h-6" />
        </button>
      </div>
      <div class="flex space-x-2 text-sm font-semibold">
        <button class="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center" @click="fetchSchedule()">
          <span>Today</span>
        </button>
        <button class="px-4 py-2 bg-blue-500 text-white rounded-md" @click="toggleForm">상담 등록</button>
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
      <div class="bg-white h-32 p-2" v-for="(schedule, index) in schedule_data" :key="index" @click="toggleForm(index)">
        <span
          :class="{ 'block text-sm bg-sky-500 text-white ring rounded-full font-semibold w-5 text-center': index === today }">{{
            index.split("-")[2]
          }}</span>
        <p class="flex-row text-xs text-blue-600 border border-blue-700/10 rounded-md m-1 p-1 bg-blue-400/20 *:scale-100 [& *]:scale-100"
          v-for="(item, itemindex) in ['홍길동', '파이썬']" :key="itemindex" :class="{
            'transform transition duration-500 ease-in-out overflow-hidden': true,
            'scale-100 h-6': !isZoomed[index]?.[itemindex],
            'scale-150 h-auto': isZoomed[index]?.[itemindex]
          }" @click="zoom(index, itemindex, $event)">
        <div class="flex justify-between" v-for="i in [...new Array(index + 1).keys()]">
          <span class="inline-block">{{ item }}</span>
          <span class="ml-auto inline-block text-blue-700">02:00 PM</span>
        </div>
        </p>
        <div
          class="mt-4 flex items-center justify-center text-xs text-blue-600 border border-blue-700/10 rounded-md m-1 p-0.5 bg-blue-400/20">
          <PlusIcon class="w-4 h-4" />
        </div>
      </div>
    </div>
    <ScheduleFormSliding :isVisible="isVisible" :scheduleId="currentScheduleId" @close="toggleForm" />
  </div>
</template>

<style></style>
