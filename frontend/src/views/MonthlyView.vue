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
import { getMonthlyCalendar, deleteScheduleList, updateScheduleDate } from '@/api/schedule'
import { ref, reactive, onMounted, onBeforeMount, watch } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import { useTeacherStore } from '@/stores/teacherStore'

const calendarStore = useCalendarStore()
const teacherStore = useTeacherStore()

const isZoomed = reactive({})
const isVisible = ref(false)
const isDailyViewSlidingVisible = ref(false)
const currentScheduleId = ref('')
const currentScheduleListId = ref('')
const currentScheduleDate = ref('')

// 드래그 앤 드롭 관련 상태 추가
const isDragging = ref(false)
const draggedSchedule = ref(null)
const showUpdateModal = ref(false)
const dropTargetDate = ref('')
const updateAllFutureSchedules = ref(false)

const zoom = (index, item_index, event) => {
  event.stopPropagation() // 이벤트 전파 중지
  if (!isZoomed[index]) {
    isZoomed[index] = {}
  }

  // 선택된 아이템만 zoom 상태 토글
  isZoomed[index][item_index] = !isZoomed[index][item_index]
  
  // 모든 아이템의 zoom 상태를 false로 초기화
  Object.keys(isZoomed).forEach(dateKey => {
    Object.keys(isZoomed[dateKey]).forEach(itemKey => {
      if (dateKey !== index && itemKey !== item_index) {
        isZoomed[dateKey][itemKey] = false
      }
    })
  })

  
  // Sibling 요소 hidden 처리
  const parentElement = event.target.closest('.relative')
  if (parentElement) {
    const siblings = parentElement.parentElement.children
    for (let sibling of siblings) {
      if (sibling !== parentElement) {
        sibling.style.display = isZoomed[index][item_index] ? 'none' : ''
      }
    }
  }
}

// 일정 상세 등록/수정 Form 토글
const toggleForm = () => {
  isVisible.value = !isVisible.value
  if (!isVisible.value) {
    currentScheduleId.value = ''
    currentScheduleListId.value = ''
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

    // 각 날짜별 일정을 시간순으로 정렬
    Object.keys(data.data).forEach(date => {
      data.data[date].sort((a, b) => {
        // 시간을 비교하기 위해 시간 문자열을 Date 객체로 변환
        const timeA = new Date(`2000-01-01 ${a.schedule_time}`)
        const timeB = new Date(`2000-01-01 ${b.schedule_time}`)
        return timeA - timeB
      })
    })

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

// 스토어의 selectedDate 변경 감지
watch(() => calendarStore.selectedDate, (newDate) => {
  if (newDate) {
    fetchSchedule(
      newDate.getFullYear(),
      newDate.getMonth() + 1
    )
  }
})

// 스토어의 selectedTeachers 변경 감지
watch(() => teacherStore.selectedTeachers, (newTeachers) => {
  if (newTeachers) {
    fetchSchedule(
      calendarStore.selectedDate.getFullYear(),
      calendarStore.selectedDate.getMonth() + 1
    )
  }
})

// 드래그 시작 핸들러
const handleDragStart = (schedule, event) => {
  isDragging.value = true
  draggedSchedule.value = schedule
  event.dataTransfer.effectAllowed = 'move'
  event.target.style.zIndex = '9999'
}

// 드래그 종료 핸들러
const handleDragEnd = (event) => {
  isDragging.value = false
  event.target.style.zIndex = ''
}

// 드롭 가능한 영역 표시
const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

// 드롭 핸들러
const handleDrop = (date, event) => {
  event.preventDefault()
  if (!draggedSchedule.value) return
  
  dropTargetDate.value = date
  showUpdateModal.value = true
}

// 일정 업데이트 처리
const handleScheduleUpdate = async () => {
  try {
    const response = await updateScheduleDate({
      scheduleId: draggedSchedule.value.schedule_id,
      scheduleListId: draggedSchedule.value.id,
      newDate: dropTargetDate.value,
      updateAllFuture: updateAllFutureSchedules.value
    })
    
    if (response.success) {
      // 일정 목록 새로고침
      await fetchSchedule(currentDateInfo.value.currentYear, currentDateInfo.value.currentMonth)
      showUpdateModal.value = false
      updateAllFutureSchedules.value = false
    }
  } catch (error) {
    console.error('Error updating schedule:', error)
  }
}

</script>

<template>
  <!-- ====== Page Title Section Start -->
  <section>
    <div class="w-full sm:container">
      <div class="border-black border-l-[5px] pl-5">
        <h2 class="text-dark mb-2 text-2xl font-semibold dark:text-white">월간 일정</h2>
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
          :class="{ 'bg-blue-500 text-white': $route.path === '/admin/monthly' || $route.path === '/admin' }"
        >
          <span class="text-sm font-medium"> 월간 </span>
        </router-link>
      </div>

      <div class="flex items-center space-x-2">
        <button
          class="p-2 rounded-full font-semibold"
          @click="fetchSchedule(currentDateInfo.prevYear, currentDateInfo.prevMonth)"
        >
          <ChevronLeftIcon class="w-6 h-6" />
        </button>
        <h2 class="text-xl font-semibold">
          {{ currentDateInfo.currentMonthName }} {{ currentDateInfo.currentYear }}
        </h2>
        <button
          class="p-2 rounded-full font-semibold"
          @click="fetchSchedule(currentDateInfo.nextYear, currentDateInfo.nextMonth)"
        >
          <ChevronRightIcon class="w-6 h-6" />
        </button>
      </div>

      <div class="flex space-x-2 text-sm font-semibold">
        <button
          class="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center"
          @click="fetchSchedule()"
        >
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
    </div>
    <div class="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-y-auto max-h-[calc(100vh-200px)] text-sm">
      <!-- schedule data loop -->
      <div
        :class="[
          'h-32 p-2',
          index === today ? 'bg-yellow-100' : 'bg-white',
          isDragging ? 'border-2 border-dashed border-blue-500' : ''
        ]"
        v-for="(day_schedules, index) in schedule_data"
        :key="index"
        @click="clickCalendarDay(index)"
        @dragover="handleDragOver"
        @drop="handleDrop(index, $event)"
      >
        <span
          :class="{
            'block text-sm bg-sky-500 text-white ring rounded-full font-semibold w-5 text-center':
              index === today
          }"
          >{{ index.split('-')[2] }}</span
        >
        <div
          class="relative flex-row text-xs text-black border border-blue-700/40 rounded-md m-1 space-y-1"
          v-for="(day_schedule, itemindex) in day_schedules.slice(0, 2)"
          :key="itemindex"
          draggable="true"
          @dragstart="handleDragStart(day_schedule, $event)"
          @dragend="handleDragEnd($event)"
          :class="[
            'transform transition duration-500 ease-in-out overflow-hidden cursor-move',
            !isZoomed[index]?.[itemindex] ? 'scale-100 h-6' : 'scale-105 h-auto min-h-6 w-full pt-1'
          ]"
          :style="{
            backgroundColor: !isZoomed[index]?.[itemindex]
              ? day_schedule.teacher_usercolor
              : 'rgba(255, 255, 255, 1)'
          }"
          @click.stop="zoom(index, itemindex, $event)"
        >
          <div class="flex justify-between items-center px-1 h-full w-full" :class="{ 'line-through': day_schedule.schedule_status === '3' }" @click.stop="zoom(index, itemindex, $event)">
            <span class="inline-block">{{ day_schedule.schedule_time }}</span>
            <span class="ml-auto inline-block"
              >[{{ day_schedule.client_name }}] {{ day_schedule.program_name.length > 10 ? day_schedule.program_name.slice(0,10) + '...' : day_schedule.program_name }}</span
            >
          </div>
          <div class="flex justify-between items-center px-1 h-full w-full" :class="{ 'line-through': day_schedule.schedule_status === '3' }" @click.stop="zoom(index, itemindex, $event)">
            <span class="inline-block">상담사</span>
            <span class="ml-auto inline-block">{{ day_schedule.teacher_fullname }}</span>
          </div>
          <div class="flex justify-between items-center px-1 h-full w-full" :class="{ 'line-through': day_schedule.schedule_status === '3' }" @click.stop="zoom(index, itemindex, $event)">
            <span class="inline-block">상담시간</span>
            <span class="ml-auto inline-block"
              >{{ day_schedule.schedule_time }} ~ {{ day_schedule.schedule_finish_time }}</span
            >
          </div>
          <div class="flex justify-center items-center px-1 h-full w-full" @click.stop="zoom(index, itemindex, $event)">
            <!-- 수정 버튼 -->
            <button
              class="text-xs text-blue-600 border border-blue-700/10 rounded-md m-1 p-0.5 bg-blue-400/20"
              @click.stop="
                clickCalendarSchedule(
                  day_schedule.schedule_id,
                  day_schedule.id,
                  day_schedule.schedule_date
                )
              "
            >
              <PencilSquareIcon class="w-4 h-4" />
            </button>
            <!-- 삭제버튼 -->
            <button
              class="text-xs text-blue-600 border border-blue-700/10 rounded-md m-1 p-0.5 bg-blue-400/20"
              @click.stop="deleteCalendarSchedule(day_schedule.id)"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div
          v-if="day_schedules.length > 2"
          class="mt-4 flex items-center justify-center text-xs text-blue-600 border border-blue-700/10 rounded-md m-1 p-0.5 bg-blue-400/20"
          @click.stop="clickMoreDailyView(index)"
        >
          <PlusIcon class="w-4 h-4" /> {{ day_schedules.length - 2 }} more
        </div>
      </div>
    </div>
    <ScheduleFormSliding
      :isVisible="isVisible"
      :scheduleId="currentScheduleId"
      :scheduleListId="currentScheduleListId"
      :scheduleDate="currentScheduleDate"
      @close="toggleForm"
      class="z-20"
    />
    <DailyViewSliding
      :isDailyViewSlidingVisible="isDailyViewSlidingVisible"
      :scheduleDate="currentScheduleDate"
      @close="toggleDailyViewSliding"
      @clickCalendarSchedule="clickCalendarSchedule"
      class="z-10"
    />

    <!-- 일정 업데이트 모달 -->
    <div v-if="showUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-96">
        <h3 class="text-lg font-semibold mb-4">일정 이동</h3>
        <p class="mb-4">
          {{ dropTargetDate }}로 일정을 이동하시겠습니까?
        </p>
        <div class="mb-4">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="updateAllFutureSchedules"
              class="mr-2"
            >
            이후 모든 일정에 적용
          </label>
        </div>
        <div class="flex justify-end space-x-2">
          <button
            class="px-4 py-2 bg-gray-200 rounded"
            @click="showUpdateModal = false"
          >
            취소
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="handleScheduleUpdate"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
