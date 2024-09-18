<script setup>
import { watch, ref, reactive, onBeforeMount, defineEmits, inject } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useUserStore } from '@/stores/auth'
import * as yup from 'yup'

const props = defineProps({
  isVisible: Boolean
})

const emit = defineEmits(['close'])

// vee-validate 스키마 정의
const schema = yup.object({
  timeInterval: yup.string().required('시간간격을 선택하세요.')
})

const timeIntervals = [5, 10, 15, 20, 30, 60]

// snake_case

// const { handleSubmit, resetForm } = useForm({
//   validationSchema: schema,
//   initialValues: form
// })

const onSubmit = async (values) => {
  console.log('submitting:', values)
  emit('close')
}
</script>

<template>
  <!-- Background overlay -->
  <div
    @click="$emit('close')"
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
          <h2 class="font-title font-bold">설정</h2>
          <button class="ml-auto" @click="$emit('close')">
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
        <Form :validation-schema="schema" @submit="onSubmit">
          <div class="mb-4">
            <label for="timeInterval" class="block text-gray-700">일정 시간 간격</label>
            <Field
              as="select"
              name="timeInterval"
              id="timeInterval"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option v-for="interval in timeIntervals" :key="interval" :value="interval">
                {{ interval }} 분
              </option>
            </Field>
            <ErrorMessage name="timeInterval" class="text-red-500 text-sm" />
          </div>
          <div class="flex justify-between mt-4">
            <button
              type="button"
              @click="$emit('close')"
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
