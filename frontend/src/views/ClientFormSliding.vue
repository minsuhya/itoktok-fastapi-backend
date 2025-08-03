<script setup>
import { watch, ref, reactive, onBeforeMount, defineEmits, inject } from 'vue'
import { useForm, Form, Field, ErrorMessage } from 'vee-validate'
import { useUserStore } from '@/stores/auth'
import * as yup from 'yup'
import { registerClientInfo, updateClientInfo, readClientInfo } from '@/api/client'
import { readTeachers } from '@/api/user'

const userStore = useUserStore()

const props = defineProps({
  isVisible: Boolean,
  clientId: String
})

const showModal = inject('showModal')

const emit = defineEmits(['close'])

// 상담사 목록
const consultant_options = ref([])

// vee-validate 스키마 정의
const schema = yup.object({
  consultant: yup.string().required('상담사를 선택하세요.'),
  // consultant_status: yup.string().required('상담상태를 선택하세요.'),
  client_name: yup.string().required('내담자 이름을 입력하세요.'),
  phone_number: yup.string().required('내담자 휴대전화번호를 입력하세요.'),
  tags: yup.string(),
  memo: yup.string().max(100, '최대 100자까지 입력할 수 있습니다.'),
  birth_date: yup.string(),
  gendar: yup.string(),
  email_address: yup.string().email('올바른 이메일 주소를 입력하세요.'),
  address_region: yup.string(),
  address_city: yup.string(),
  family_members: yup.string(),
  consultation_path: yup.string().required('상담 신청 경로를 선택하세요.'),
  center_username: yup.string()
})

// snake_case
const form = reactive({
  id: '',
  consultant: '',
  consultant_status: '1',
  client_name: '',
  phone_number: '',
  tags: '',
  memo: '',
  birth_date: '',
  gender: '',
  email_address: '',
  address_region: '',
  address_city: '',
  family_members: '',
  consultation_path: '',
  center_username: userStore.user.center_username
})

const closeForm = () => {
  emit('close')
}

const fetchClientInfo = async () => {
  if (!props.clientId) {
    Object.keys(form).forEach((key) => {
      form[key] = ''
    })
    return
  }
  console.log('props.clientId: ', props.clientId)

  try {
    const clientInfo = await readClientInfo(props.clientId)
    console.log('clientInfo:', clientInfo)
    Object.assign(form, clientInfo)
  } catch (error) {
    console.error('Error fetching client:', error)
  }
}

const fetchTeacherList = async () => {
  try {
    const teacherList = await readTeachers()
    console.log('teacherList:', teacherList)
    consultant_options.value = teacherList.map((item) => ({
      value: item.username,
      text: item.full_name
    }))
  } catch (error) {
    console.error('Error fetching client:', error)
  }
}

onBeforeMount(() => {
  fetchClientInfo()
  fetchTeacherList()
  console.log('userStore.user.center_username: ', userStore.user.center_username)
})

const onSubmit = async (values) => {
  console.log('submitting:', values)
  Object.assign(form, values)
  if (!form.consultant_status) {
    form.consultant_status = '1'
  }
  
  try {
    if (form.id) {
      await updateClientInfo(form.id, form)
      showModal('내담자 정보가 수정되었습니다.')
    } else {
      await registerClientInfo(form)
      showModal('내담자 정보가 등록되었습니다.')
    }
    
    // 폼 초기화
    Object.keys(form).forEach((key) => {
      form[key] = key === 'center_username' ? userStore.user.center_username : ''
    })
  } catch (error) {
    console.error('내담자 정보 저장 중 오류 발생:', error)
    showModal('내담자 정보 저장 중 오류가 발생했습니다.')
  }
  emit('close')
}

// Step 2: Watch for changes in clientId and call toggleForm
watch(
  () => props.clientId,
  (newClientId, oldClientId) => {
    if (newClientId !== oldClientId && newClientId) {
      fetchClientInfo(newClientId)
    }
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
          <h2 class="font-title font-bold">내담자 등록 {{ clientId }}</h2>
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
          <Field name="id" as="input" type="hidden" v-model="form.id" />
          <Field name="family_members" as="input" type="hidden" />
          <Field name="center_username" as="input" type="hidden" />
          <div>
            <label class="block mb-1 text-gray-700"
              >상담사 <span class="text-red-500">*</span></label
            >
            <Field
              name="consultant"
              v-model="form.consultant"
              as="select"
              class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
            >
              <option value="">상담사를 선택하세요.</option>
              <option
                v-for="option in consultant_options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
              <!-- 상담사 옵션 추가 -->
            </Field>
            <ErrorMessage name="consultant_options" class="text-red-500 text-xs italic mt-2" />
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
            <label class="block mb-1 text-gray-700">관련 태그 입력</label>
            <Field
              name="tags"
              as="input"
              type="text"
              v-model="form.tags"
              class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
            />
            <ErrorMessage name="tags" class="text-red-500 text-xs italic mt-2" />
          </div>
          <div>
            <label class="block mb-1 text-gray-700">메모(주소소 문제)</label>
            <Field
              name="memo"
              as="textarea"
              class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
              rows="3"
              v-model="form.memo"
              placeholder="내담자의 주소 문제를 메모해보세요. 최대 100자 까지 입력하실 수 있습니다."
            />
            <ErrorMessage name="memo" class="text-red-500 text-xs italic mt-2" />
            <div class="text-right text-gray-500 text-sm">0 / 100</div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-gray-700">생년월일</label>
              <Field
                name="birth_date"
                as="input"
                type="date"
                v-model="form.birth_date"
                class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
                placeholder="2000.01.01"
              />
              <ErrorMessage name="birth_date" class="text-red-500 text-xs italic mt-2" />
            </div>
            <div>
              <label class="block mb-1 text-gray-700">성별</label>
              <Field
                v-model="form.gender"
                name="gender"
                as="select"
                class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
              >
                <option value="">성별을 선택하세요.</option>
                <option value="M">남성</option>
                <option value="F">여성</option>
              </Field>
              <ErrorMessage name="gender" class="text-red-500 text-xs italic mt-2" />
            </div>
          </div>
          <div>
            <label class="block mb-1 text-gray-700">이메일 주소</label>
            <Field
              name="email_address"
              as="input"
              type="email"
              v-model="form.email_address"
              class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
            />
            <ErrorMessage name="email_address" class="text-red-500 text-xs italic mt-2" />
          </div>
          <div>
            <label class="block mb-1 text-gray-700">주소</label>
            <div class="grid grid-cols-2 gap-4">
              <Field
                name="address_region"
                as="input"
                v-model="form.address_region"
                class="bg-neutral-50 border border-gray-300 rounded-md p-2"
              />
              <Field
                name="address_city"
                as="input"
                v-model="form.address_city"
                class="bg-neutral-50 border border-gray-300 rounded-md p-2"
              />
            </div>
            <ErrorMessage name="address_region" class="text-red-500 text-xs italic mt-2" />
            <ErrorMessage name="address_city" class="text-red-500 text-xs italic mt-2" />
          </div>
          <div>
            <label class="block mb-1 text-gray-700"
              >상담 신청 경로 <span class="text-red-500">*</span></label
            >
            <Field
              name="consultation_path"
              as="select"
              v-model="form.consultation_path"
              class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
            >
              <option value="">상담 신청 경로를 선택하세요.</option>
              <option value="1">가족/지인추천</option>
              <option value="2">병원/상담센터를 통해</option>
              <option value="3">PC/모바일광고</option>
              <option value="4">카페/커뮤니티</option>
              <!-- 신청 경로 옵션 추가 -->
            </Field>
            <ErrorMessage name="consultation_path" class="text-red-500 text-xs italic mt-2" />
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
