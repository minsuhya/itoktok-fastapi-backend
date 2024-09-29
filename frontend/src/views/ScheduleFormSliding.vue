<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { watch, ref, reactive, onBeforeMount, onMounted, inject } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useUserStore } from '@/stores/auth'
import * as yup from 'yup'
import { readUserByUsername } from '@/api/user'
import { searchClientInfos } from '@/api/client'
import { createSchedule, readSchedule } from '@/api/schedule'

const userStore = useUserStore()
const showModal = inject('showModal')

const emit = defineEmits(['close'])

// 상담 일정
const props = defineProps({
  isVisible: Boolean,
  scheduleId: String,
  scheduleDate: String
})
const searchTerm = ref('')
const clients = ref([])
const filteredClients = ref([])
const selectedClient = ref({
  id: '',
  name: ''
})

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
  form.client_name = client.client_name
  form.phone_number = client.phone_number
  filteredClients.value = []

  // 상담사 정보 추가
  try {
    const consultant_info = await readUserByUsername(client.consultant)
    selectedClient.value.consultant = consultant_info.username
    selectedClient.value.consultant_name = consultant_info.full_name
  } catch (error) {
    console.error('Error fetching clients:', error)
  }
}

// 시간 선택
const start_time = ref(null)
const finish_time = ref(null)
const timeOptions = ref([])
const endTimeOptions = ref([])

const generateTimeOptions = () => {
  const options = []
  let currentTime = new Date()
  currentTime.setHours(9, 0, 0, 0) // 자정 시작
  while (currentTime.getHours() < 18) {
    options.push(formatTime(currentTime))
    currentTime.setMinutes(currentTime.getMinutes() + 10) // 10분 단위 추가
    // console.log('currentTime:', currentTime.getHours())
    // console.log('currentTime:', currentTime.getMinutes())
  }
  return options
}
const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  // console.log('hours:', hours)
  // console.log('minutes:', minutes)
  return `${hours}:${minutes}`
}

const updateEndTimeOptions = () => {
  if (!start_time.value) return

  const [startHour, startMinute] = start_time.value.split(':').map(Number)
  const startDate = new Date()
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
  finish_time.value = endTimeOptions.value[0] // 종료 시간을 첫 번째 옵션으로 설정
}

// vee-validate 스키마 정의
const schema = yup.object({
  consultant_name: yup.string().required('내담자를 선택해주세요.'),
  client_name: yup.string().required('내담자를 선택해주세요.'),
  phone_number: yup.string().required('휴대전화번호를 입력하세요.'),
  title: yup.string().required('일정제목을 입력해주세요.'),
  start_date: yup.string().required('일정시작일을 선택해주세요.'),
  finish_date: yup.string().required('일정종료일을 선택해주세요.'),
  start_time: yup.string().required('시작시간을 선택해주세요.'),
  finish_time: yup.string().required('종료시간을 선택해주세요.')
})

const form = reactive({
  id: '',
  teacher_username: '',
  client_id: '',
  client_name: '',
  title: '',
  start_date: props.scheduleDate,
  finish_date: props.scheduleDate,
  start_time: formatTime(new Date()),
  finish_time: formatTime(new Date()),
  memo: '',
  teacher: {}
})

const closeForm = () => {
  emit('close')
}

const fetchScheduleInfo = async () => {
  if (!props.scheduleId) {
    Object.keys(form).forEach((key) => {
      form[key] = ''
    })
    console.log('scheduleDate:', props.scheduleDate)
    // 일정 초기화
    form.start_date = props.scheduleDate
    form.finish_date = props.scheduleDate
    return
  }
  console.log('scheduleId', props.scheduleId)

  try {
    const scheduleInfo = await readSchedule(props.scheduleId)
    console.log('scheduleInfo:', scheduleInfo)
    Object.assign(form, scheduleInfo)

    // 상담사 정보 추가
    selectedClient.value.consultant_name = form.teacher?.full_name
    selectedClient.value.client_id = form.client_id

    form.client_name = form.clientinfo?.client_name
    form.phone_number = form.clientinfo?.phone_number
    start_time.value = form.start_time
    updateEndTimeOptions()
    finish_time.value = form.finish_time
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

const saveScheduleInfo = async () => {
  try {
    await createSchedule(form)
    showModal('상담일정 정보가 등록되었습니다.')
  } catch (error) {
    showModal('상담일정 정보 등록 중 오류가 발생했습니다.')
    console.error('Error registering client data:', error)
  }
}

onBeforeMount(() => {
  fetchScheduleInfo()
})

onMounted(() => {
  timeOptions.value = generateTimeOptions()
  console.log(timeOptions.value)
})

const onSubmit = async (values) => {
  console.log('submitting:', values)
  Object.assign(form, values)
  await saveScheduleInfo()
  emit('close')
}

// Watch for changes in clientId and call toggleForm
watch(
  () => props.scheduleId,
  (newScheduleId, oldScheduleId) => {
    if (newScheduleId !== oldScheduleId) {
      fetchScheduleInfo()
    }
  }
)

watch(
  () => props.scheduleDate,
  (newScheduleDate, oldScheduleDate) => {
    console.log('newScheduleDate:', newScheduleDate)
    form.start_date = newScheduleDate
    form.finish_date = newScheduleDate
  }
)
</script>

<template>
  <!-- Background overlay -->
  <div
    @click="closeForm"
    class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-1000"
    :class="{ 'opacity-100 block': isVisible, 'opacity-0 hidden': !isVisible }"
  ></div>
  <div
    class="fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4 overflow-auto z-50 transition-transform duration-1000 ease-in-out"
    :class="{ 'translate-x-full': !isVisible, 'translate-x-0': isVisible }"
  >
    <div className="w-full bg-neutral-50 shadow-lg rounded-lg p-6">
      <div className="border-b pb-2 mb-4">
        <div class="flex items-center justify-evenly mb-2">
          <h2 class="font-title font-bold">상담일정</h2>
          <button class="ml-auto" @click="closeForm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <Form
          @submit="onSubmit"
          :validation-schema="schema"
          :initial-values="form"
          class="space-y-4 text-sm"
        >
          <Field type="hidden" name="teacher_username" v-model="selectedClient.consultant" />
          <Field type="hidden" name="client_id" v-model="selectedClient.id" />
          <div class="grid gap-4">
            <div class="mb-4">
              <label for="client-search" class="block text-sm font-medium text-gray-700"
                >내담자를 선택하세요.</label
              >
              <div class="relative mt-1">
                <!-- 검색 입력 필드 -->
                <input
                  v-model="searchTerm"
                  @input="filterClients"
                  type="text"
                  id="client-search"
                  placeholder="내담자 검색..."
                  class="block w-full py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />

                <!-- Heroicons 돋보기 아이콘 -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>

                <!-- 필터링된 내담자 리스트 -->
                <div>
                  <ul
                    v-if="filteredClients.length > 0"
                    class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  >
                    <li
                      v-for="client in filteredClients"
                      :key="client.id"
                      @click="selectClient(client)"
                      class="cursor-pointer px-3 py-2 hover:bg-indigo-600 hover:text-white"
                    >
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
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >상담사 <span class="text-red-500">*</span></label
              >
              <Field
                type="text"
                name="consultant_name"
                readonly
                v-model="selectedClient.consultant_name"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <ErrorMessage name="consultant_name" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-gray-700"
                >내담자 이름 <span class="text-red-500">*</span></label
              >
              <Field
                name="client_name"
                as="input"
                type="text"
                v-model="form.client_name"
                class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
                placeholder="내담자 이름을 입력하세요."
              />
              <ErrorMessage name="client_name" class="text-red-500 text-xs italic mt-2" />
            </div>
            <div>
              <label class="block mb-1 text-gray-700"
                >내담자 휴대전화번호 <span class="text-red-500">*</span></label
              >
              <Field
                name="phone_number"
                as="input"
                type="text"
                v-model="form.phone_number"
                class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
                placeholder="내담자 휴대전화번호를 입력하세요."
              />
              <ErrorMessage name="phone_number" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div>
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >일정제목 <span class="text-red-500">*</span></label
              >
              <Field
                type="text"
                name="title"
                v-model="form.title"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <ErrorMessage name="title" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label
                for="start_date"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >일정시작일 <span class="text-red-500">*</span></label
              >
              <Field
                type="date"
                name="start_date"
                v-model="form.start_date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <ErrorMessage name="start_date" class="text-red-500 text-xs italic mt-2" />
            </div>
            <div class="mb-4">
              <label
                for="finish_date"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >일정종료일 <span class="text-red-500">*</span></label
              >
              <Field
                type="date"
                name="finish_date"
                v-model="form.finish_date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <ErrorMessage name="finish_date" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label
                for="start_date"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >시작시간 <span class="text-red-500">*</span></label
              >
              <Field
                name="start_time"
                id="start_time"
                v-model="start_time"
                as="select"
                @change="updateEndTimeOptions"
                class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
              >
                <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
                <!-- 상담사 옵션 추가 -->
              </Field>
              <ErrorMessage name="start_time" class="text-red-500 text-xs italic mt-2" />
            </div>
            <div class="mb-4">
              <label
                for="finish_time"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >종료시간 <span class="text-red-500">*</span></label
              >
              <Field
                name="finish_time"
                id="finish_time"
                v-model="finish_time"
                as="select"
                class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
              >
                <option v-for="time in endTimeOptions" :key="time" :value="time">{{ time }}</option>
                <!-- 상담사 옵션 추가 -->
              </Field>
              <ErrorMessage name="finish_time" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div>
            <label class="block mb-1 text-gray-700">메모</label>
            <Field
              name="memo"
              as="textarea"
              class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
              rows="3"
              v-model="form.memo"
              placeholder="내담자의 상담정보를 메모해보세요. 최대 100자 까지 입력하실 수 있습니다."
            />
            <ErrorMessage name="memo" class="text-red-500 text-xs italic mt-2" />
            <div class="text-right text-gray-500 text-sm">0 / 100</div>
          </div>
          <div class="flex justify-between mt-4">
            <button
              type="button"
              @click="closeForm"
              class="bg-gray-400 text-white rounded-md p-2 w-[80px]"
            >
              취소
            </button>
            <button type="submit" class="bg-green-600 text-white rounded-md p-2 w-[80px]">
              확인
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
