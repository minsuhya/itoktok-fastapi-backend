<template>
  <MobileLayout
    header-title="이용자 등록"
    :show-back="true"
    :show-save="true"
    active-tab="home"
    @back="handleBack"
    @save="handleSave"
  >
    <div class="p-4">
      <Form @submit="onSubmit" :validation-schema="schema" :initial-values="form" class="space-y-4">
        <Field type="hidden" name="id" v-model="form.id" />

        <!-- 이름 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            이름 <span class="text-red-500">*</span>
          </label>
          <Field 
            name="client_name" 
            as="input" 
            type="text" 
            v-model="form.client_name"
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
            placeholder="이름을 입력하세요" 
          />
          <ErrorMessage name="client_name" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 전화번호 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            전화번호 <span class="text-red-500">*</span>
          </label>
          <Field 
            name="phone_number" 
            as="input" 
            type="text" 
            v-model="form.phone_number"
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
            placeholder="전화번호를 입력하세요" 
          />
          <ErrorMessage name="phone_number" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 생년월일 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            생년월일 <span class="text-red-500">*</span>
          </label>
          <Field 
            name="birthdate" 
            as="input" 
            type="date" 
            v-model="form.birthdate"
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
          />
          <ErrorMessage name="birthdate" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 성별 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            성별 <span class="text-red-500">*</span>
          </label>
          <Field 
            name="gender" 
            as="select" 
            v-model="form.gender"
            class="w-full bg-white border border-gray-300 rounded-md p-2"
          >
            <option value="">성별을 선택하세요</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </Field>
          <ErrorMessage name="gender" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 주소 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">주소</label>
          <Field 
            name="address" 
            as="input" 
            type="text" 
            v-model="form.address"
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
            placeholder="주소를 입력하세요" 
          />
        </div>

        <!-- 등록일 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            등록일 <span class="text-red-500">*</span>
          </label>
          <Field 
            name="registration_date" 
            as="input" 
            type="date" 
            v-model="form.registration_date"
            class="w-full bg-white border border-gray-300 rounded-md p-2" 
          />
          <ErrorMessage name="registration_date" class="text-red-500 text-xs italic mt-1" />
        </div>

        <!-- 담당자 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">담당자</label>
          <Field 
            name="consultant" 
            as="select" 
            v-model="form.consultant"
            class="w-full bg-white border border-gray-300 rounded-md p-2"
          >
            <option value="">담당자를 선택하세요</option>
            <option v-for="teacher in teacher_options" :key="teacher.value" :value="teacher.value">
              {{ teacher.text }}
            </option>
          </Field>
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
            type="submit" 
            class="flex-1 bg-blue-600 text-white rounded-md py-3 font-semibold"
          >
            {{ form.id ? '수정' : '등록' }}
          </button>
        </div>
      </Form>
    </div>
  </MobileLayout>
</template>

<script setup>
import { registerClientInfo, readClientInfo, updateClientInfo } from '@/api/client'
import { readTeachers } from '@/api/user'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { inject, onBeforeMount, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import * as yup from 'yup'
import MobileLayout from '@/mobile/components/MobileLayout.vue'

const router = useRouter()
const route = useRoute()
const showModal = inject('showModal', () => {})

const teacher_options = ref([])

const schema = yup.object({
  client_name: yup.string().required('이름을 입력해주세요.'),
  phone_number: yup.string().required('전화번호를 입력해주세요.'),
  birthdate: yup.string().required('생년월일을 선택해주세요.'),
  gender: yup.string().required('성별을 선택해주세요.'),
  registration_date: yup.string().required('등록일을 선택해주세요.')
})

const form = reactive({
  id: '',
  client_name: '',
  phone_number: '',
  birthdate: '',
  gender: '',
  address: '',
  registration_date: new Date().toISOString().split('T')[0],
  consultant: ''
})

const fetchClientInfo = async () => {
  const clientId = route.params.id
  if (!clientId) return

  try {
    const response = await readClientInfo(clientId)
    Object.assign(form, response.data || response)
  } catch (error) {
    console.error('이용자 정보 조회 오류:', error)
    showModal('이용자 정보를 불러오는 중 오류가 발생했습니다.')
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

const handleBack = () => {
  router.back()
}

const handleSave = () => {
  document.querySelector('form').requestSubmit()
}

const onSubmit = async (values) => {
  try {
    if (form.id) {
      await updateClientInfo(form.id, values)
      showModal('이용자 정보가 수정되었습니다.')
    } else {
      await registerClientInfo(values)
      showModal('이용자 정보가 등록되었습니다.')
    }
    router.back()
  } catch (error) {
    showModal('이용자 정보 저장 중 오류가 발생했습니다.')
    console.error('Error saving client data:', error)
  }
}

onBeforeMount(async () => {
  await fetchTeacherList()
  await fetchClientInfo()
})
</script>

