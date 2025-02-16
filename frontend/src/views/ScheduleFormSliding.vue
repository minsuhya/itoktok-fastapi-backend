<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { watch, ref, reactive, onBeforeMount, onMounted, onUpdated, inject } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useUserStore } from '@/stores/auth'
import * as yup from 'yup'
import { readUserByUsername, readTeachers } from '@/api/user'
import { searchClientInfos } from '@/api/client'
import { createSchedule, updateSchedule, readSchedule, deleteSchedule } from '@/api/schedule'
import { readPrograms } from '@/api/program'

const userStore = useUserStore()
const showModal = inject('showModal')

const emit = defineEmits(['close'])

// 상담 일정
const props = defineProps({
  isVisible: Boolean,
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
      return `${now.getHours().toString().padStart(2, '0')}:00}`
    }
  }
})
const searchTerm = ref('')
const clients = ref([])
const filteredClients = ref([])
const selectedClient = ref({})
// 상담사 목록
const teacher_options = ref([])
// 프로그램 목록
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

  // 상담사 정보 추가
  try {
    const consultant_info = await readUserByUsername(client.consultant)
    form.teacher_username = consultant_info.username
    fetchProgramList()
  } catch (error) {
    console.error('Error fetching clients:', error)
  }
}

// 시간 선택
const timeOptions = ref([])
const endTimeOptions = ref([])

const generateTimeOptions = () => {
  const options = []
  let currentTime = today
  currentTime.setHours(9, 0, 0, 0) // 자정 시작
  while (currentTime.getHours() < 18) {
    options.push(formatTime(currentTime))
    currentTime.setMinutes(currentTime.getMinutes() + 10) // 10분 단위 추가
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

  // string으로 변환
  const hmString = String(hm)

  // 시간 문자열에 ':' 포함 여부 확인 
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

const updateEndTimeOptions = () => {
  if (!form.start_time) return

  const [startHour, startMinute] = form.start_time.split(':').map(Number)
  const startDate = today
  startDate.setHours(startHour, startMinute, 0, 0)

  // 시작 시간 이후 10분 단위로 1시간 뒤까지 선택지 생성
  const options = []
  const endDate = new Date(startDate)
  endDate.setHours(startDate.getHours() + 1) // 1시간 뒤까지

  let currentDate = new Date(startDate)
  currentDate.setMinutes(currentDate.getMinutes() + 10) // 10분 뒤부터

  while (currentDate <= endDate) {
    options.push(formatTime(currentDate))
    currentDate.setMinutes(currentDate.getMinutes() + 10)
  }

  endTimeOptions.value = options
  // 시작시간 + 50분을 종료시간으로 설정
  const [sh, sm] = form.start_time.split(':').map(Number)
  const endTime = new Date()
  endTime.setHours(sh, sm + 50)
  form.finish_time = formatTime(endTime)
}

// vee-validate 스키마 정의
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
    // start_date가 있는 경우 1년 후의 날짜로 자동 설정
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
  schedule_type: 1, // 재활:1, 상담/평가:2, 기타:3 기본값(재활)
  client_name: '',
  program_id: '',
  repeat_type: 1, // 매일:1, 매주:2, 매월:3 기본값(매일)
  repeat_days: {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false
  },
  schedule_status: 1, // 예약:1, 완료:2, 취소:3 기본값(예약)
  start_date: props.scheduleDate,
  finish_date: props.scheduleDate,
  start_time: formatHour(props.scheduleTime),
  finish_time: formatHour(props.scheduleTime),
  memo: '',
  teacher: {},
  update_range: 'single', // 기본값으로 '이번 일정만 변경' 설정
})

const closeForm = () => {
  emit('close')
}

const fetchScheduleInfo = async () => {
  if (!props.scheduleListId) {
    Object.keys(form).forEach((key) => {
      form[key] = ''
    })

    form.schedule_type = 1
    form.schedule_status = 1
    form.repeat_type = 1
    form.update_range = 'single'
    // 일정 초기화
    form.start_date = props.scheduleDate
    form.finish_date = props.scheduleDate

    if (!form.start_time) {
      const currentHour = today.getHours()
      form.start_time = (currentHour >= 9 && currentHour < 18) ? formatHour(currentHour) : '09:00'
    }
    updateEndTimeOptions()
    // repeat_days가 문자열인 경우 객체로 초기화
    form.repeat_days = {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false
    }
    return
  }

  try {
    const scheduleInfo = await readSchedule(props.scheduleListId)
    console.log("scheduleInfo:", scheduleInfo)
    
    // 기본 필드 복사
    const { clientinfo, teacher, schedule, ...basicInfo } = scheduleInfo
    Object.assign(form, basicInfo, schedule)

    // 메모
    form.memo = basicInfo.schedule_memo
    form.schedule_type = schedule.schedule_type
    console.log("form.schedule_type:", form.schedule_type)

    // 관계 필드 처리
    form.client_name = clientinfo?.client_name || ''
    form.phone_number = clientinfo?.phone_number || ''
    form.teacher_username = teacher?.username || ''

    // 시간 처리
    form.start_time = form.start_time || formatHour(today.getHours())
    updateEndTimeOptions()

    form.repeat_days = (() => {
      try {
        return typeof form.repeat_days === 'string' 
          ? JSON.parse(form.repeat_days
            .replace(/'/g, '"')  // 작은따옴표를 큰따옴표로 변환
            .replace(/True/g, 'true')  // Python True를 JavaScript true로 변환 
            .replace(/False/g, 'false') // Python False를 JavaScript false로 변환form.repeat_days
          )
          : form.repeat_days || {
              mon: false,
              tue: false,
              wed: false, 
              thu: false,
              fri: false,
              sat: false,
              sun: false
            }
      } catch {
        return {
          mon: false,
          tue: false,
          wed: false, 
          thu: false,
          fri: false,
          sat: false,
          sun: false
        }
      }
    })()
  } catch (error) {
    console.error('Error fetching user:', error)
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
    console.error('Error fetching client:', error)
  }
}

const fetchProgramList = async () => {
  try {
    const response = await readPrograms(1, 100, '', form.teacher_username)
    console.log('response:', response)
    program_options.value = response.items.map((item) => ({
      value: item.id,
      text: item.program_name
    }))
  } catch (error) {
    console.error('프로그램 목록 조회 중 오류:', error)
  }
}


onBeforeMount(() => {
  fetchScheduleInfo()
  fetchTeacherList()
  fetchProgramList()
})

onUpdated(() => {
  searchTerm.value = ''
  if (!form.start_date) {
    // 현재 날짜로 초기화, Asia/Seoul 기준
    form.start_date = new Date().toISOString().split('T')[0]
    form.finish_date = form.start_date
  }

  if (!form.start_time) {
    form.start_time = formatHour(new Date().getHours())
  }
  if (form.start_time >= '18:00') {
    form.start_time = '17:50'
  }
  updateEndTimeOptions()
})

onMounted(() => {
  timeOptions.value = generateTimeOptions()
})

const onSubmit = async (values) => {
  try {
    const formData = {
      ...values,
      repeat_days: form.repeat_days,
      finish_date: new Date(new Date(values.start_date).setFullYear(new Date(values.start_date).getFullYear() + 1)).toISOString().split('T')[0],
      update_range: form.update_range // 수정 범위 추가
    }
    delete formData.created_at
    delete formData.updated_at 
    delete formData.deleted_at

    if (form.id) {
      // 수정 확인 다이얼로그
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
    // 폼 초기화
    form.id = null
    form.client_id = null 
    form.client_name = ''
    form.schedule_type = 1
    form.phone_number = ''
    form.teacher_username = ''
    form.program_id = ''
    form.start_date = new Date().toISOString().split('T')[0]
    form.finish_date = form.start_date
    form.start_time = formatHour(new Date().getHours())
    form.finish_time = ''
    form.repeat_type = 1
    form.memo = ''
    form.repeat_days = {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false
    }
    form.update_range = 'single'
  } catch (error) {
    showModal('상담일정 정보 저장 중 오류가 발생했습니다.')
    console.error('Error registering schedule data:', error)
  }
  emit('close')
}

// Watch for changes in clientId and call toggleForm
watch(
  () => props.scheduleId,
  (newScheduleId, oldScheduleId) => {
    if (newScheduleId !== oldScheduleId) {
      fetchScheduleInfo()
      fetchProgramList()
    }
  }
)

watch(
  () => props.scheduleDate,
  (newScheduleDate, oldScheduleDate) => {
    form.start_date = newScheduleDate
    form.finish_date = newScheduleDate
  }
)

watch(
  () => props.scheduleTime,
  (newScheduleTime, oldScheduleTime) => {
    form.start_time = formatHour(newScheduleTime)
    // form.finish_time = newScheduleTime
    updateEndTimeOptions()
  }
)

watch(
  () => form.schedule_type,
  (newScheduleType, oldScheduleType) => {
    form.schedule_type = newScheduleType
  }
)

// 일정 삭제 함수 추가
const deleteScheduleInfo = async () => {
  try {
    if (!props.scheduleListId) return

    // 삭제 확인 다이얼로그
    const confirmMessage = form.update_range === 'all' 
      ? '이 일정과 향후 모든 반복 일정이 삭제됩니다. 계속하시겠습니까?' 
      : '이 일정만 삭제됩니다. 계속하시겠습니까?'
    
    if (!confirm(confirmMessage)) return

    // 삭제 API 호출
    await deleteSchedule(form.id, props.scheduleListId, { update_range: form.update_range })
    showModal('일정이 삭제되었습니다.')
    emit('close')
  } catch (error) {
    console.error('Error deleting schedule:', error)
    showModal('일정 삭제 중 오류가 발생했습니다.')
  }
}
</script>

<template>
  <!-- Background overlay -->
  <div @click="closeForm" v-bind="$attrs"
    class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-1000 z-49"
    :class="{ 'opacity-100 block': isVisible, 'opacity-0 hidden': !isVisible }"></div>
  <div v-bind="$attrs"
    class="fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4 overflow-auto z-50 transition-transform duration-1000 ease-in-out"
    :class="{ 'translate-x-full': !isVisible, 'translate-x-0': isVisible }">
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
        <Form @submit="onSubmit" :validation-schema="schema" :initial-values="form" class="space-y-4 text-sm">
          <Field type="hidden" name="id" v-model="form.id" />
          <Field type="hidden" name="client_id" v-model="form.client_id" />
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">일정 유형</label>
            <div class="mt-2 flex gap-4">
              <label class="inline-flex items-center">
                <Field type="radio" name="schedule_type" :value="1" v-model="form.schedule_type" 
                  class="form-radio text-indigo-600" />
                <span class="ml-2">재활</span>
              </label>
              <label class="inline-flex items-center">
                <Field type="radio" name="schedule_type" :value="2" v-model="form.schedule_type"
                  class="form-radio text-indigo-600" />
                <span class="ml-2">상담/평가</span>
              </label>
            </div>
          </div>
          <div class="grid gap-4" v-if="!props.scheduleId && !props.scheduleListId">
            <div class="mb-4">
              <label for="client-search" class="block text-sm font-medium text-gray-700">내담자를 선택하세요.</label>
              <div class="relative mt-1">
                <!-- 검색 입력 필드 -->
                <input v-model="searchTerm" @input="filterClients" type="text" id="client-search"
                  placeholder="내담자 검색..."
                  class="block w-full py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />

                <!-- Heroicons 돋보기 아이콘 -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>

                <!-- 필터링된 내담자 리스트 -->
                <div>
                  <ul v-if="filteredClients.length > 0"
                    class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <li v-for="client in filteredClients" :key="client.id" @click="selectClient(client)"
                      class="cursor-pointer px-3 py-2 hover:bg-indigo-600 hover:text-white">
                      {{ client.client_name }}
                    </li>
                  </ul>
                  <p v-else class="absolute mt-2 text-sm text-gray-500">검색 결과가 없습니다.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">상담사 <span
                  class="text-red-500">*</span></label>
              <Field name="teacher_username" v-model="form.teacher_username" as="select"
                class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
                @change="fetchProgramList">
                <option value="">상담사를 선택하세요.</option>
                <option v-for="option in teacher_options" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </Field>
              <ErrorMessage name="teacher_username" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div v-if="userStore.user.user_type == 1 && userStore.user.is_superuser == 1" class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-gray-700">내담자 이름 <span class="text-red-500">*</span></label>
              <Field name="client_name" as="input" type="text" v-model="form.client_name"
                class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2" placeholder="내담자 이름을 입력하세요." />
              <ErrorMessage name="client_name" class="text-red-500 text-xs italic mt-2" />
            </div>
            <div>
              <label class="block mb-1 text-gray-700">내담자 휴대전화번호 <span class="text-red-500">*</span></label>
              <Field name="phone_number" as="input" type="text" v-model="form.phone_number"
                class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2" placeholder="내담자 휴대전화번호를 입력하세요." />
              <ErrorMessage name="phone_number" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div v-else>
            <Field name="client_name" type="hidden" v-model="form.client_name" />
            <Field name="phone_number" type="hidden" v-model="form.phone_number" />
          </div>
          <div>
            <div class="mb-4">
              <label for="program_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">프로그램 <span
                  class="text-red-500">*</span></label>
              <Field name="program_id" v-model="form.program_id" as="select"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                <option value="">프로그램을 선택하세요</option>
                <option v-for="program in program_options" :key="program.value" :value="program.value">
                  {{ program.text }}
                </option>
              </Field>
              <ErrorMessage name="program_id" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">일정 반복 타입</label>
            <Field name="repeat_type" v-model="form.repeat_type" as="select" 
              class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2">
              <option value="1">매일</option>
              <option value="2">매주</option>
              <option value="3">매월</option>
            </Field>
            <ErrorMessage name="repeat_type" class="text-red-500 text-xs italic mt-2" />
          </div>
          <div class="mb-4" v-if="form.repeat_type == '2'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">반복 요일</label>
            <div class="flex gap-4 mt-2">
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
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label for="start_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">일정시작일 <span
                  class="text-red-500">*</span></label>
              <Field type="date" name="start_date" v-model="form.start_date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
              <ErrorMessage name="start_date" class="text-red-500 text-xs italic mt-2" />
            </div>
            <div class="mb-4 hidden">
              <label for="finish_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">일정종료일 <span
                  class="text-red-500">*</span></label>
              <Field type="date" name="finish_date" v-model="form.finish_date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
              <ErrorMessage name="finish_date" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label for="start_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">시작시간 <span
                  class="text-red-500">*</span></label>
              <Field name="start_time" id="start_time" v-model="form.start_time" as="select"
                @change="updateEndTimeOptions" class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2">
                <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
              </Field>
              <ErrorMessage name="start_time" class="text-red-500 text-xs italic mt-2" />
            </div>
            <div class="mb-4">
              <label for="finish_time" class="block text-sm font-medium text-gray-700 dark:text-gray-300">종료시간 <span
                  class="text-red-500">*</span></label>
              <Field name="finish_time" id="finish_time" v-model="form.finish_time" as="select"
                class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2">
                <option v-for="time in endTimeOptions" :key="time" :value="time">{{ time }}</option>
              </Field>
              <ErrorMessage name="finish_time" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div>
            <label class="block mb-1 text-gray-700">메모</label>
            <Field name="memo" as="textarea" class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2" rows="3"
              v-model="form.memo" placeholder="내담자의 상담정보를 메모해보세요. 최대 100자 까지 입력하실 수 있습니다." />
            <ErrorMessage name="memo" class="text-red-500 text-xs italic mt-2" />
            <div class="text-right text-gray-500 text-sm">0 / 100</div>
          </div>
          <div class="mb-4">
            <label for="schedule_status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">상태</label>
            <Field name="schedule_status" id="schedule_status" v-model="form.schedule_status" as="select" 
              class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2">
              <option value="1">예정</option>
              <option value="2">완료</option>
              <option value="3">취소</option>
            </Field>
          </div>
          <div class="mb-4" v-if="props.scheduleId && props.scheduleListId">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">일정 수정 범위</label>
            <div class="flex items-center space-x-4 mt-2">
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
          <div class="flex justify-between mt-4">
            <div>
              <button type="button" @click="closeForm" class="bg-gray-400 text-white rounded-md p-2 w-[80px]">
                취소
              </button>
            </div>
            <div class="flex gap-2">
              <button v-if="props.scheduleListId" type="button" @click="deleteScheduleInfo" class="bg-red-600 text-white rounded-md p-2 w-[80px]">
                삭제
              </button>
              <button type="submit" class="bg-green-600 text-white rounded-md p-2 w-[80px]">
                {{ props.scheduleListId ? '수정' : '등록' }}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
