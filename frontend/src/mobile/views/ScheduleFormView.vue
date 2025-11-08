<template>
  <MobileLayout
    header-title="일정 등록"
    :show-back="true"
    :show-save="true"
    active-tab="calendar"
    @back="handleBack"
    @save="handleSave"
  >
    <div class="p-4">
      <Form @submit="onSubmit" :validation-schema="schema" :initial-values="form" class="space-y-4">
        <Field type="hidden" name="id" v-model="form.id" />
        <Field type="hidden" name="client_id" v-model="form.client_id" />

        <!-- 일정 유형 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-3">일정 유형</label>
          <div class="flex gap-4">
            <label class="inline-flex items-center">
              <Field type="radio" name="schedule_type" :value="1" v-model="form.schedule_type" 
                class="form-radio text-blue-600" />
              <span class="ml-2">재활</span>
            </label>
            <label class="inline-flex items-center">
              <Field type="radio" name="schedule_type" :value="2" v-model="form.schedule_type"
                class="form-radio text-blue-600" />
              <span class="ml-2">상담/평가</span>
            </label>
          </div>
        </div>

        <!-- 내담자 검색 (신규 일정인 경우) -->
        <div v-if="!props.scheduleId && !props.scheduleListId" class="bg-white rounded-lg shadow-sm p-4">
          <label for="client-search" class="block text-sm font-medium text-gray-700 mb-2">내담자</label>
          <div class="relative">
            <input 
              v-model="searchTerm" 
              @input="filterClients" 
              type="text" 
              id="client-search"
              placeholder="내담자 검색..."
              class="block w-full py-2 pr-10 pl-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <ul v-if="filteredClients.length > 0"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <li 
                v-for="client in filteredClients" 
                :key="client.id" 
                @click="selectClient(client)"
                class="cursor-pointer px-3 py-2 hover:bg-blue-600 hover:text-white"
              >
                {{ client.client_name }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 상담사 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            상담사 <span class="text-red-500">*</span>
          </label>
          <Field 
            name="teacher_username" 
            v-model="form.teacher_username" 
            as="select"
            class="w-full bg-white border border-gray-300 rounded-md p-2"
            @change="fetchProgramList"
          >
            <option value="">상담사를 선택하세요.</option>
            <option v-for="option in teacher_options" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </Field>
          <ErrorMessage name="teacher_username" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 내담자 정보 (최고관리자인 경우) -->
        <div v-if="userStore.user.user_type == 1 && userStore.user.is_superuser == 1" class="bg-white rounded-lg shadow-sm p-4">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                내담자 이름 <span class="text-red-500">*</span>
              </label>
              <Field 
                name="client_name" 
                as="input" 
                type="text" 
                v-model="form.client_name"
                class="w-full bg-white border border-gray-300 rounded-md p-2" 
                placeholder="내담자 이름을 입력하세요." 
              />
              <ErrorMessage name="client_name" class="text-red-500 text-xs italic mt-1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                내담자 휴대전화번호 <span class="text-red-500">*</span>
              </label>
              <Field 
                name="phone_number" 
                as="input" 
                type="text" 
                v-model="form.phone_number"
                class="w-full bg-white border border-gray-300 rounded-md p-2" 
                placeholder="내담자 휴대전화번호를 입력하세요." 
              />
              <ErrorMessage name="phone_number" class="text-red-500 text-xs italic mt-1" />
            </div>
          </div>
        </div>
        <div v-else>
          <Field name="client_name" type="hidden" v-model="form.client_name" />
          <Field name="phone_number" type="hidden" v-model="form.phone_number" />
        </div>

        <!-- 프로그램 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            프로그램 <span class="text-red-500">*</span>
          </label>
          <Field 
            name="program_id" 
            v-model="form.program_id" 
            as="select"
            class="w-full bg-white border border-gray-300 rounded-md p-2"
          >
            <option value="">프로그램을 선택하세요</option>
            <option v-for="program in program_options" :key="program.value" :value="program.value">
              {{ program.text }}
            </option>
          </Field>
          <ErrorMessage name="program_id" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 일정 반복 타입 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">일정 반복 타입</label>
          <Field 
            name="repeat_type" 
            v-model="form.repeat_type" 
            as="select" 
            class="w-full bg-white border border-gray-300 rounded-md p-2"
          >
            <option value="1">매일</option>
            <option value="2">매주</option>
            <option value="3">매월</option>
          </Field>
          <ErrorMessage name="repeat_type" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 반복 요일 (매주인 경우) -->
        <div v-if="form.repeat_type == '2'" class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-3">반복 요일</label>
          <div class="grid grid-cols-4 gap-3">
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="form.repeat_days.mon" class="form-checkbox h-4 w-4 text-blue-600">
              <span class="ml-2">월</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="form.repeat_days.tue" class="form-checkbox h-4 w-4 text-blue-600">
              <span class="ml-2">화</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="form.repeat_days.wed" class="form-checkbox h-4 w-4 text-blue-600">
              <span class="ml-2">수</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="form.repeat_days.thu" class="form-checkbox h-4 w-4 text-blue-600">
              <span class="ml-2">목</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="form.repeat_days.fri" class="form-checkbox h-4 w-4 text-blue-600">
              <span class="ml-2">금</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="form.repeat_days.sat" class="form-checkbox h-4 w-4 text-blue-600">
              <span class="ml-2">토</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="form.repeat_days.sun" class="form-checkbox h-4 w-4 text-blue-600">
              <span class="ml-2">일</span>
            </label>
          </div>
        </div>

        <!-- 날짜 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            일정시작일 <span class="text-red-500">*</span>
          </label>
          <Field 
            type="date" 
            name="start_date" 
            v-model="form.start_date"
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
          />
          <ErrorMessage name="start_date" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 시간 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                시작시간 <span class="text-red-500">*</span>
              </label>
              <Field 
                name="start_time" 
                v-model="form.start_time" 
                as="select"
                @change="updateEndTimeOptions" 
                class="w-full bg-white border border-gray-300 rounded-md p-2"
              >
                <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
              </Field>
              <ErrorMessage name="start_time" class="text-red-500 text-xs italic mt-1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                종료시간 <span class="text-red-500">*</span>
              </label>
              <Field 
                name="finish_time" 
                v-model="form.finish_time" 
                as="select"
                class="w-full bg-white border border-gray-300 rounded-md p-2"
              >
                <option v-for="time in endTimeOptions" :key="time" :value="time">{{ time }}</option>
              </Field>
              <ErrorMessage name="finish_time" class="text-red-500 text-xs italic mt-1" />
            </div>
          </div>
        </div>

        <!-- 메모 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">메모</label>
          <Field 
            name="memo" 
            as="textarea" 
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
            rows="3"
            v-model="form.memo" 
            placeholder="내담자의 상담정보를 메모해보세요. 최대 100자 까지 입력하실 수 있습니다." 
          />
          <ErrorMessage name="memo" class="text-red-500 text-xs italic mt-1" />
          <div class="text-right text-gray-500 text-sm mt-1">{{ form.memo.length }} / 100</div>
        </div>

        <!-- 상태 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">상태</label>
          <Field 
            name="schedule_status" 
            v-model="form.schedule_status" 
            as="select" 
            class="w-full bg-white border border-gray-300 rounded-md p-2"
          >
            <option value="1">예정</option>
            <option value="2">완료</option>
            <option value="3">취소</option>
          </Field>
        </div>

        <!-- 일정 수정 범위 (수정 모드인 경우) -->
        <div v-if="props.scheduleId && props.scheduleListId" class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-3">일정 수정 범위</label>
          <div class="space-y-2">
            <label class="inline-flex items-center">
              <Field type="radio" name="update_range" value="single" v-model="form.update_range" class="form-radio" />
              <span class="ml-2">이번 일정만 변경</span>
            </label>
            <label class="inline-flex items-center">
              <Field type="radio" name="update_range" value="all" v-model="form.update_range" class="form-radio" />
              <span class="ml-2">이후 반복일정 모두 변경</span>
            </label>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="flex gap-3 pb-4">
          <button 
            type="button" 
            @click="handleBack" 
            class="flex-1 bg-gray-400 text-white rounded-md py-3 font-semibold"
          >
            취소
          </button>
          <button 
            v-if="props.scheduleListId" 
            type="button" 
            @click="deleteScheduleInfo" 
            class="flex-1 bg-red-600 text-white rounded-md py-3 font-semibold"
          >
            삭제
          </button>
          <button 
            type="submit" 
            class="flex-1 bg-blue-600 text-white rounded-md py-3 font-semibold"
          >
            {{ props.scheduleListId ? '수정' : '등록' }}
          </button>
        </div>
      </Form>
    </div>
  </MobileLayout>
</template>

<script setup>
import { searchClientInfos } from '@/api/client'
import { readPrograms } from '@/api/program'
import { createSchedule, deleteSchedule, readSchedule, updateSchedule } from '@/api/schedule'
import { readTeachers, readUserByUsername } from '@/api/user'
import { useUserStore } from '@/stores/auth'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { inject, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import MobileLayout from '@/mobile/components/MobileLayout.vue'

const router = useRouter()
const userStore = useUserStore()
const showModal = inject('showModal', () => {})

const props = defineProps({
  scheduleId: String,
  scheduleListId: String,
  scheduleDate: {
    type: String,
    default: () => {
      const now = new Date()
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    }
  },
  scheduleTime: {
    type: String,
    default: () => {
      const now = new Date()
      return `${now.getHours().toString().padStart(2, '0')}:00`
    }
  }
})

const searchTerm = ref('')
const clients = ref([])
const filteredClients = ref([])
const selectedClient = ref({})
const teacher_options = ref([])
const program_options = ref([])
const today = new Date()

const filterClients = async () => {
  const search = searchTerm.value.toLowerCase()
  if (!search) {
    filteredClients.value = []
    return
  }

  try {
    const data = await searchClientInfos(search)
    clients.value = data.data
    filteredClients.value = clients.value
  } catch (error) {
    console.error('Error fetching clients:', error)
  }
}

const selectClient = async (client) => {
  selectedClient.value = client
  searchTerm.value = client.client_name
  form.client_id = client.id
  form.client_name = client.client_name
  form.phone_number = client.phone_number
  filteredClients.value = []

  if (client.consultant) {
    try {
      const consultant_info = await readUserByUsername(client.consultant)
      form.teacher_username = consultant_info.username
      await fetchProgramList()
    } catch (error) {
      console.error('Error fetching consultant info:', error)
    }
  }
}

const timeOptions = ref([])
const endTimeOptions = ref([])

const generateTimeOptions = () => {
  const options = []
  let currentTime = new Date(today)
  currentTime.setHours(9, 0, 0, 0)
  while (currentTime.getHours() < 18) {
    options.push(formatTime(currentTime))
    currentTime.setMinutes(currentTime.getMinutes() + 10)
  }
  return options
}

const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function formatHour(hm) {
  if (!hm) {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const currentMinutes = now.getMinutes()
    let minutes
    if (currentMinutes >= 40) {
      minutes = '40'
    } else if (currentMinutes >= 20) {
      minutes = '20'
    } else {
      minutes = '00'
    }
    return `${hours}:${minutes}`
  }

  const hmString = String(hm)
  if (!hmString.includes(':')) {
    const hourNum = parseInt(hmString)
    if (hourNum < 10) {
      return `0${hourNum}:00`
    }
    return `${hmString}:00`
  }

  const [hour, minute] = hmString.split(':')
  const hourNum = parseInt(hour)
  if (hourNum < 10) {
    return `0${hourNum}:${minute}`
  }
  return `${hour}:${minute}`
}

const updateEndTimeOptions = (preserveFinishTime = false) => {
  if (!form.start_time) return

  const [startHour, startMinute] = form.start_time.split(':').map(Number)
  const startDate = new Date(today)
  startDate.setHours(startHour, startMinute, 0, 0)

  const options = []
  const endDate = new Date(startDate)
  endDate.setHours(startDate.getHours() + 1)

  let currentDate = new Date(startDate)
  currentDate.setMinutes(currentDate.getMinutes() + 10)

  while (currentDate <= endDate) {
    options.push(formatTime(currentDate))
    currentDate.setMinutes(currentDate.getMinutes() + 10)
  }

  endTimeOptions.value = options
  
  if (!preserveFinishTime && !form.finish_time) {
    const [sh, sm] = form.start_time.split(':').map(Number)
    const endTime = new Date()
    endTime.setHours(sh, sm + 50)
    form.finish_time = formatTime(endTime)
  }
}

const schema = yup.object({
  teacher_username: yup.string().required('상담사를 선택해주세요.'),
  client_name: yup.string().required('내담자를 선택해주세요.'),
  phone_number: yup.string().required('휴대전화번호를 입력하세요.'),
  program_id: yup.string().when('teacher_username', {
    is: (value) => value && value.length > 0,
    then: () => yup.string().required('프로그램을 선택해주세요.'),
    otherwise: () => yup.string()
  }),
  start_date: yup.string().required('일정시작일을 선택해주세요.'),
  finish_date: yup.string().transform((value, originalValue, context) => {
    const startDate = context?.parent?.start_date;
    if (startDate) {
      const oneYearLater = new Date(startDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      return oneYearLater.toISOString().split('T')[0];
    }
    return value;
  }),
  start_time: yup.string().required('시작시간을 선택해주세요.'),
  finish_time: yup.string().required('종료시간을 선택해주세요.'),
  repeat_type: yup.string().required("반복 타입을 선택해주세요.")
})

const form = reactive({
  id: '',
  teacher_username: '',
  client_id: '',
  schedule_type: 1,
  client_name: '',
  program_id: '',
  repeat_type: 2,
  repeat_days: {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false
  },
  schedule_status: 1,
  start_date: props.scheduleDate,
  finish_date: props.scheduleDate,
  start_time: formatHour(props.scheduleTime),
  finish_time: formatHour(props.scheduleTime),
  memo: '',
  update_range: 'single',
})

const initializeRepeatDays = (date) => {
  const weekdayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  const selectedDate = new Date(date)
  const selectedWeekday = weekdayMap[selectedDate.getDay()]

  return {
    mon: selectedWeekday === 'mon',
    tue: selectedWeekday === 'tue',
    wed: selectedWeekday === 'wed',
    thu: selectedWeekday === 'thu',
    fri: selectedWeekday === 'fri',
    sat: selectedWeekday === 'sat',
    sun: selectedWeekday === 'sun'
  }
}

const parseRepeatDays = (repeatDays) => {
  const defaultRepeatDays = {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false
  }

  if (!repeatDays) return defaultRepeatDays

  if (typeof repeatDays === 'object' && !Array.isArray(repeatDays)) {
    return repeatDays
  }

  if (typeof repeatDays === 'string') {
    try {
      return JSON.parse(
        repeatDays
          .replace(/'/g, '"')
          .replace(/True/g, 'true')
          .replace(/False/g, 'false')
      )
    } catch {
      return defaultRepeatDays
    }
  }

  return defaultRepeatDays
}

const resetForm = () => {
  form.id = ''
  form.teacher_username = ''
  form.client_id = ''
  form.schedule_type = 1
  form.client_name = ''
  form.program_id = ''
  form.repeat_type = 2
  form.repeat_days = initializeRepeatDays(props.scheduleDate)
  form.schedule_status = 1
  form.start_date = props.scheduleDate
  form.finish_date = props.scheduleDate
  form.start_time = props.scheduleTime ? formatHour(props.scheduleTime) : formatHour(today.getHours())
  form.finish_time = ''
  form.memo = ''
  form.update_range = 'single'
}

const fetchScheduleInfo = async () => {
  if (!props.scheduleListId) {
    resetForm()
    form.repeat_days = initializeRepeatDays(props.scheduleDate)
    updateEndTimeOptions()
    return
  }

  try {
    const scheduleInfo = await readSchedule(props.scheduleListId)
    
    const { clientinfo, teacher, schedule, ...basicInfo } = scheduleInfo
    Object.assign(form, basicInfo, schedule)

    form.memo = basicInfo.schedule_memo || ''
    form.schedule_type = schedule.schedule_type || 1

    form.client_name = clientinfo?.client_name || ''
    form.phone_number = clientinfo?.phone_number || ''
    form.teacher_username = teacher?.username || ''

    form.start_time = basicInfo.schedule_time || formatHour(today.getHours())
    form.finish_time = basicInfo.schedule_finish_time || ''

    if (form.teacher_username) {
      await fetchProgramList()
    }

    updateEndTimeOptions(true)
    form.repeat_days = parseRepeatDays(form.repeat_days)
  } catch (error) {
    console.error('Error fetching schedule info:', error)
    showModal('일정 정보를 불러오는 중 오류가 발생했습니다.')
  }
}

const fetchTeacherList = async () => {
  try {
    const teacherList = await readTeachers()
    teacher_options.value = teacherList.map((item) => ({
      value: item.username,
      text: item.full_name
    }))
  } catch (error) {
    console.error('Error fetching teacher list:', error)
  }
}

const fetchProgramList = async () => {
  try {
    const response = await readPrograms(1, 100, '', form.teacher_username)
    program_options.value = response.items.map((item) => ({
      value: item.id,
      text: item.program_name
    }))
  } catch (error) {
    console.error('프로그램 목록 조회 중 오류:', error)
  }
}

const handleBack = () => {
  router.back()
}

const handleSave = () => {
  // 저장은 폼 제출로 처리
  document.querySelector('form').requestSubmit()
}

const onSubmit = async (values) => {
  try {
    const formData = {
      ...values,
      repeat_days: form.repeat_days,
      finish_date: new Date(new Date(values.start_date).setFullYear(new Date(values.start_date).getFullYear() + 1)).toISOString().split('T')[0],
      update_range: form.update_range
    }
    delete formData.created_at
    delete formData.updated_at 
    delete formData.deleted_at

    if (form.id) {
      const confirmMessage = form.update_range === 'all' 
        ? '이 일정과 향후 모든 반복 일정이 수정됩니다. 계속하시겠습니까?' 
        : '이 일정만 수정됩니다. 계속하시겠습니까?'
      
      if (!confirm(confirmMessage)) return

      await updateSchedule(form.id, props.scheduleListId, formData)
      showModal('상담일정 정보가 수정되었습니다.')
    } else {
      await createSchedule(formData)
      showModal('상담일정 정보가 등록되었습니다.')
    }
    resetForm()
    router.back()
  } catch (error) {
    showModal('상담일정 정보 저장 중 오류가 발생했습니다.')
    console.error('Error registering schedule data:', error)
  }
}

const deleteScheduleInfo = async () => {
  try {
    if (!props.scheduleListId) return

    const confirmMessage = form.update_range === 'all' 
      ? '이 일정과 향후 모든 반복 일정이 삭제됩니다. 계속하시겠습니까?' 
      : '이 일정만 삭제됩니다. 계속하시겠습니까?'
    
    if (!confirm(confirmMessage)) return

    await deleteSchedule(form.id, props.scheduleListId, form.update_range)
    showModal('일정이 삭제되었습니다.')
    router.back()
  } catch (error) {
    console.error('Error deleting schedule:', error)
    showModal('일정 삭제 중 오류가 발생했습니다.')
  }
}

watch(
  () => props.scheduleDate,
  (newScheduleDate) => {
    if (newScheduleDate) {
      form.start_date = newScheduleDate
      form.finish_date = newScheduleDate

      if (!props.scheduleListId && newScheduleDate) {
        form.repeat_days = initializeRepeatDays(newScheduleDate)
      }
    }
  }
)

watch(
  () => props.scheduleTime,
  (newScheduleTime) => {
    if (newScheduleTime) {
      form.start_time = formatHour(newScheduleTime)
      updateEndTimeOptions()
    }
  }
)

onBeforeMount(() => {
  fetchScheduleInfo()
  fetchTeacherList()
})

onMounted(() => {
  timeOptions.value = generateTimeOptions()
  if (!form.start_time) {
    form.start_time = formatHour(today.getHours())
  }
  if (form.start_time >= '18:00') {
    form.start_time = '17:50'
  }
  updateEndTimeOptions()
})
</script>

