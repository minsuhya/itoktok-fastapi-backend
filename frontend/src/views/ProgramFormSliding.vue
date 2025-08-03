<template>
  <div
    v-bind="$attrs"
    @click="emit('close')"
    :class="[
      'fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-1000',
      {
        'opacity-100 block': props.isVisible,
        'opacity-0 hidden': !props.isVisible
      }
    ]"
  ></div>

  <div
    v-bind="$attrs"
    :class="[
      'fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4 overflow-auto z-50 transition-transform duration-1000 ease-in-out',
      {
        'translate-x-full': !props.isVisible,
        'translate-x-0': props.isVisible
      }
    ]"
  >
    <div class="w-full bg-neutral-50 shadow-lg rounded-lg p-6">
      <div class="border-b pb-2 mb-4">
        <div class="flex items-center justify-between mb-2">
          <h2 class="font-title font-bold">{{ props.programId ? '프로그램 수정' : '프로그램 등록' }}</h2>
          <button class="ml-auto" @click="emit('close')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }" :initial-values="formData">
          <div class="space-y-4 text-sm">
            <div>
              <label class="block mb-1 text-gray-700">프로그램 유형 <span class="text-red-500">*</span></label>
              <Field
                name="program_type"
                as="select"
                class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
                v-model="formData.program_type"
                :class="{ 'border-red-500': errors.program_type }"
              >
                <option value="">프로그램 유형을 선택하세요</option>
                <option value="미술">미술</option>
                <option value="음악">음악</option>
                <option value="무용">무용</option>
                <option value="기타">기타</option>
              </Field>
              <ErrorMessage name="program_type" class="text-red-500 text-xs mt-1" />
            </div>

            <div>
              <label class="block mb-1 text-gray-700">프로그램명 <span class="text-red-500">*</span></label>
              <Field
                name="program_name"
                type="text"
                class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
                v-model="formData.program_name"
                :class="{ 'border-red-500': errors.program_name }"
                placeholder="프로그램명을 입력하세요"
              />
              <ErrorMessage name="program_name" class="text-red-500 text-xs mt-1" />
            </div>

            <div>
              <label class="block mb-1 text-gray-700">담당 선생님</label>
              <div class="mb-2">
                <label class="inline-flex items-center">
                  <Field
                    name="is_all_teachers"
                    type="checkbox"
                    @change="handleAllTeachersChange"
                    v-model="formData.is_all_teachers"
                    :value="true"
                  />
                  <!-- <input name="is_all_teachers" @change="handleAllTeachersChange" type="checkbox" v-model="formData.is_all_teachers" /> -->
                  <span class="ml-2">전체 선생님</span>
                </label>
              </div>
              <Field
                name="teacher_username"
                as="select"
                class="w-full bg-neutral-50 border border-gray-300 rounded-md p-2"
                v-model="formData.teacher_username"
                :class="{ 'border-red-500': errors.teacher_username }"
                :disabled="isAllTeachers"
              >
                <option value="">담당 선생님을 선택하세요</option>
                <option v-for="teacher in teachers" 
                        :key="teacher.username"
                        :value="teacher.username">
                  {{ teacher.full_name }}
                </option>
              </Field>
              <ErrorMessage name="teacher_username" class="text-red-500 text-xs mt-1" />
            </div>

            <div class="flex justify-between pt-4">
              <button
                type="button"
                @click="emit('close')"
                class="bg-gray-400 text-white rounded-md px-4 py-2 hover:bg-gray-500"
              >
                취소
              </button>
              <button 
                type="submit"
                class="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
              >
                {{ props.programId ? '수정' : '등록' }}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { inject } from 'vue'
import { readTeachers } from '@/api/user'
import { createProgram, readProgram, updateProgram } from '@/api/program'

const showModal = inject('showModal')
const props = defineProps({
  isVisible: Boolean,
  programId: String
})

const emit = defineEmits(['close'])
const teachers = ref([])
const isAllTeachers = ref(false)

const schema = yup.object({
  program_type: yup.string().required('프로그램 유형을 선택하세요'),
  program_name: yup.string().required('프로그램명을 입력하세요'),
  teacher_username: yup.string().when('is_all_teachers', {
    is: false,
    then: () => yup.string().required('담당 선생님을 선택하세요'),
    otherwise: () => yup.string().nullable()
  })
})

const formData = reactive({
  program_type: '',
  program_name: '',
  is_all_teachers: false, // 명시적으로 boolean 타입 지정
  teacher_username: '',
  description: '',
  duration: 60,
  max_participants: 1,
  price: 0
})

const handleAllTeachersChange = (e) => {
  const isChecked = e.target.checked
  if (isChecked) {
    formData.teacher_username = null
  }
  formData.is_all_teachers = isChecked
  isAllTeachers.value = isChecked
  console.log("formData.is_all_teachers:", formData.is_all_teachers)
}

const loadTeachers = async () => {
  try {
    const response = await readTeachers()
    teachers.value = response
    console.log("teachers", teachers.value)
  } catch (error) {
    console.error('Error fetching teachers:', error)
    showModal('선생님 목록을 불러오는데 실패했습니다.')
  }
}

const loadProgram = async () => {
  if (!props.programId) {
    Object.assign(formData, {
      program_type: '',
      program_name: '',
      is_all_teachers: false, // 명시적으로 boolean 타입 지정
      teacher_username: '',
      description: '',
      duration: 60,
      max_participants: 1,
      price: 0
    })
    isAllTeachers.value = false
    return
  }

  try {
    const response = await readProgram(props.programId)
    Object.assign(formData, response)
    isAllTeachers.value = formData.is_all_teachers
    console.log("loadProgram:", formData)
  } catch (error) {
    console.error('Error fetching program:', error)
    showModal('프로그램 정보를 불러오는데 실패했습니다.')
  }
}

const onSubmit = async (values) => {
  try {
    const programData = {
      ...values,
      is_all_teachers: isAllTeachers.value,
      teacher_username: isAllTeachers.value ? null : values.teacher_username
    }

    if (props.programId) {
      await updateProgram(props.programId, programData)
      showModal('프로그램이 수정되었습니다.')
    } else {
      await createProgram(programData)
      showModal('프로그램이 등록되었습니다.')
    }
    emit('close')
  } catch (error) {
    console.error('Error saving program:', error)
    showModal('프로그램 저장 중 오류가 발생했습니다.')
  }
}

onMounted(() => {
  loadTeachers()
  loadProgram()
})

// programId가 변경되었을 때는 isVisible 감시자에서 처리하므로 별도 감시 불필요
// isVisible이 true일 때만 데이터를 로드하거나 초기화
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    if (!props.programId) {
      // programId가 없을 경우 폼 데이터 초기화
      Object.assign(formData, {
        program_type: '',
        program_name: '',
        is_all_teachers: false,
        teacher_username: '',
        description: '',
        duration: 60,
        max_participants: 1,
        price: 0
      })
      isAllTeachers.value = false
      console.log("폼 초기화:", formData)
    } else {
      // programId가 있는 경우에만 프로그램 데이터 로드
      loadProgram()
      console.log("프로그램 데이터 로드:", formData)
    }
  }
})
</script> 