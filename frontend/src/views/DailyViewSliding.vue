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
  console.log('zoom index:', index, 'item_index:', item_index)
  event.stopPropagation() // 이벤트 전파 중지
  if (!isZoomed[index]) {
    isZoomed[index] = {}
  }

  isZoomed[index][item_index] = !isZoomed[index][item_index]
  console.log('isZoomed:', isZoomed[index][item_index])

  // 모든 아이템의 zoom 상태를 false로 초기화
  Object.keys(isZoomed).forEach(dateKey => {
    Object.keys(isZoomed[dateKey]).forEach(itemKey => {
      if (dateKey !== index && itemKey !== item_index) {
        isZoomed[dateKey][itemKey] = false
      }
    })
  })

  console.log('isZoomed:', isZoomed[index][item_index])
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

// 시간 차이를 분으로 계산하는 함수 추가
const getTimeDifferenceInMinutes = (start, end) => {
  const [startHour, startMinute] = start.split(':').map(Number)
  const [endHour, endMinute] = end.split(':').map(Number)
  return (endHour - startHour) * 60 + (endMinute - startMinute)
}

// 겹치는 일정 그룹화 함수 추가
const getOverlappingGroups = (schedules) => {
  return schedules.reduce((groups, schedule, index) => {
    const startTime = schedule.start_time
    const group = groups.find(g => 
      g.some(s => s.start_time === startTime)
    )
    if (group) {
      group.push({ ...schedule, index })
    } else {
      groups.push([{ ...schedule, index }])
    }
    return groups
  }, [])
}

// 시간 차이를 분으로 계산하고 높이를 반환하는 함수 수정
const getScheduleHeight = (start, end) => {
  const timeDiff = getTimeDifferenceInMinutes(start, end)
  const MAX_HEIGHT = 90 // 상위 요소의 최대 높이
  
  if (timeDiff >= 50) {
    return MAX_HEIGHT
  } else {
    return Math.max((timeDiff / 50) * MAX_HEIGHT, 30) // 최소 높이 30px 보장
  }
}

// 시작 시간에 따른 top 위치 계산 함수 추가
const getScheduleTop = (start_time) => {
  const [hours, minutes] = start_time.split(':').map(Number)
  const minutesFromHourStart = minutes
  const MINUTES_PER_PIXEL = 50 / 90 // 50분을 97px로 나눈 비율
  return minutesFromHourStart * (1 / MINUTES_PER_PIXEL)
}
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
        <div class="grid grid-cols-1">
          <!-- Iterate over time slots -->
          <div v-for="(hour_schedule, hour) in schedule_data" :key="hour"
            class="flex text-gray-500 border-b min-h-24 flex items-center pl-2 divide-x divide-gray-300 w-full">
            <div class="w-12 text-xs font-semibold">
              {{ convertTo12HourFormat(hour) }}
            </div>
            <!-- 시간 구분선 -->
            <div class="w-full min-h-24 relative">
              <div class="absolute left-0 w-full border-t border-gray-200 top-1/3"></div>
              <div class="absolute left-0 w-full border-t border-gray-200 top-2/3"></div>
              <div v-for="(minute_schedule, minute) in hour_schedule" :key="minute"
                class="flex-row items-center justify-between w-full">
                <div class="relative w-full">
                  <template v-for="group in getOverlappingGroups(minute_schedule)" :key="group[0].schedule_time">
                    <div v-for="(day_schedule, groupIndex) in group" :key="day_schedule.index"
                      class="flex-row text-xs text-black border border-blue-700/40 rounded-md m-1 space-y-1"
                      :class="[
                        'transform transition duration-500 ease-in-out overflow-hidden',
                        !isZoomed[day_schedule.schedule_time]?.[day_schedule.index] ? 'scale-100' : 'scale-105'
                      ]"
                      :style="{
                        backgroundColor: !isZoomed[day_schedule.schedule_time]?.[day_schedule.index]
                          ? `${day_schedule.teacher_usercolor}`
                          : 'rgb(255, 255, 255)',
                        position: 'absolute',
                        zIndex: !isZoomed[day_schedule.schedule_time]?.[day_schedule.index] ? 1 : 10,
                        left: `${(groupIndex * 15)}%`,
                        width: !isZoomed[day_schedule.schedule_time]?.[day_schedule.index]
                          ? `${85 - (groupIndex * 15)}%`
                          : '85%',
                        height: `${getScheduleHeight(day_schedule.start_time, day_schedule.finish_time)}px`,
                        top: `${getScheduleTop(day_schedule.start_time)}px`,
                        right: 'auto'
                      }"
                      @click.stop="zoom(day_schedule.schedule_time, day_schedule.index, $event)"
                    >
                      <!-- 기존 내용 -->
                      <div class="flex justify-between items-center px-1 h-6"
                           @click.stop="zoom(day_schedule.schedule_time, day_schedule.index, $event)">
                        <span class="inline-block font-semibold">{{ day_schedule.schedule_time }}</span>
                        <span class="ml-auto inline-block whitespace-nowrap overflow-hidden text-ellipsis">
                          [{{ day_schedule.client_name }}] {{ day_schedule.teacher_expertise }}
                        </span>
                      </div>
                      <!-- 확장시 보이는 내용 -->
                      <div v-show="isZoomed[day_schedule.schedule_time]?.[day_schedule.index]"
                        class="transition-all duration-300 ease-in-out">
                        <div class="flex justify-between items-center px-1 h-6">
                          <span class="inline-block">상담사</span>
                          <span class="ml-auto inline-block">{{ day_schedule.teacher_fullname }}</span>
                        </div>
                        <div class="flex justify-between items-center px-1 h-6">
                          <span class="inline-block">상담시간</span>
                          <span class="ml-auto inline-block font-semibold">
                            {{ day_schedule.start_time }} ~ {{ day_schedule.finish_time }}
                          </span>
                        </div>
                        <div class="flex justify-center items-center px-1 h-8">
                          <button class="text-xs text-blue-600 border border-blue-700/10 rounded-md m-1 p-0.5 bg-blue-400/20"
                            @click.stop="handleMoreClick(
                              day_schedule.schedule_id,
                              day_schedule.id,
                              day_schedule.schedule_date
                            )">
                            <PencilSquareIcon class="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
