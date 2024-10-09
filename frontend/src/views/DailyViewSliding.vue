<script setup>
import { ref, reactive, inject, onMounted, watch } from 'vue'
import { PencilSquareIcon } from '@heroicons/vue/20/solid'
import { getDailyCalendar } from '@/api/schedule'

const showModal = inject('showModal')

// 상담 일정
const props = defineProps({
  isDailyViewSlidingVisible: Boolean,
  scheduleDate: String,
  scheduleTime: String
})

const emit = defineEmits(['close', 'clickCalendarSchedule'])

const schedule_data = ref([])

const isZoomed = reactive({})
const zoom = (index, item_index, event) => {
  event.stopPropagation() // 이벤트 전파 중지
  if (!isZoomed[index]) {
    isZoomed[index] = {}
  }
  isZoomed[index][item_index] = !isZoomed[index][item_index]
}

const handleMoreClick = (schedule_id, schedule_list_id, schedule_date) => {
  emit('clickCalendarSchedule', schedule_id, schedule_list_id, schedule_date)
}

function getDayOfWeek(dateString) {
  const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const date = new Date(dateString)
  return daysOfWeek[date.getDay()]
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

const closeForm = () => {
  emit('close')
}

// Schedule 가져오기
const fetchDailySchedule = async () => {
  if (!props.scheduleDate) return

  const [year, month, day] = props.scheduleDate.split('-')

  try {
    const data = await getDailyCalendar(year, month, day)
    schedule_data.value = data.data
    console.log('daily sliding schedule_data:', schedule_data.value)
  } catch (error) {
    console.error('Error fetching monthly schedule data:', error)
  }
}

onMounted(() => {
  fetchDailySchedule()
})

watch(
  () => props.scheduleDate,
  (newScheduleDate, oldScheduleDate) => {
    if (newScheduleDate !== oldScheduleDate) {
      fetchDailySchedule()
    }
  }
)
</script>

<template>
  <!-- Background overlay -->
  <div @click="closeForm" class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-1000 z-39"
    v-bind="$attrs" :class="{
      'opacity-100 block': isDailyViewSlidingVisible,
      'opacity-0 hidden': !isDailyViewSlidingVisible
    }"></div>
  <div
    class="fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4 overflow-auto z-40 transition-transform duration-1000 ease-in-out"
    v-bind="$attrs" :class="{
      'translate-x-full': !isDailyViewSlidingVisible,
      'translate-x-0': isDailyViewSlidingVisible
    }">
    <div className="w-full bg-neutral-50 shadow-lg rounded-lg p-6">
      <div className="border-b pb-2 mb-4">
        <div class="flex items-center justify-evenly mb-2">
          <h2 class="font-title font-bold">상담일정</h2>
          <button class="ml-auto" @click="closeForm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>
          <div class="text-lg font-semibold text-gray-500 flex items-center justify-center">
            <span>{{ scheduleDate }}({{ getDayOfWeek(scheduleDate) }})</span>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-y-6">
          <!-- Iterate over time slots -->
          <div v-for="(hour_schedule, hour) in schedule_data" :key="hour"
            class="flex text-gray-500 border-b min-h-10 h-auto flex items-center pl-2 divide-x divide-gray-300 w-full">
            <div class="w-12 text-xs font-semibold">
              {{ convertTo12HourFormat(hour) }}
            </div>
            <div class="w-full">
              <div v-for="(minute_schedule, minute) in hour_schedule" :key="minute"
                class="flex-row items-center justify-between w-full">
                <div class="flex-row text-xs text-blue-600 border border-blue-700/40 rounded-md m-1 space-y-1 w-full"
                  v-for="(day_schedule, itemindex) in minute_schedule" :key="itemindex" :class="[
                    'transform transition duration-500 ease-in-out overflow-hidden',
                    !isZoomed[day_schedule.schedule_time]?.[itemindex]
                      ? 'scale-100 h-6'
                      : 'scale-105 h-auto min-h-6 w-full pt-1',
                    !isZoomed[day_schedule.schedule_time]?.[itemindex]
                      ? day_schedule.teacher_usercolor
                      : 'bg-white/100'
                  ]" @click.stop="zoom(day_schedule.schedule_time, itemindex, $event)">
                  <div class="flex justify-between items-center px-1 h-full w-full">
                    <span class="inline-block font-semibold">{{ day_schedule.schedule_time }}</span>
                    <span class="ml-auto inline-block">[{{ day_schedule.client_name }}] {{
                      day_schedule.teacher_expertise }}</span>
                  </div>
                  <div class="flex justify-between items-center px-1 h-full w-full">
                    <span class="inline-block">상담사</span>
                    <span class="ml-auto inline-block">{{ day_schedule.teacher_fullname }}</span>
                  </div>
                  <div class="flex justify-between items-center px-1 h-full w-full">
                    <span class="inline-block">상담시간</span>
                    <span class="ml-auto inline-block font-semibold">{{ day_schedule.start_time }} ~ {{
                      day_schedule.finish_time }}</span>
                  </div>
                  <div class="flex justify-center items-center px-1 h-full w-full">
                    <!-- 수정 버튼 -->
                    <button class="text-xs text-blue-600 border border-blue-700/10 rounded-md m-1 p-0.5 bg-blue-400/20"
                      @click.stop="
                        handleMoreClick(
                          day_schedule.schedule_id,
                          day_schedule.id,
                          day_schedule.schedule_date
                        )
                        ">
                      <PencilSquareIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
