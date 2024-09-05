<template>
  <div>
    <!-- Trigger button to open the modal -->
    <button @click="openModal" class="bg-blue-500 text-white px-4 py-2 rounded font-semibold">
      Open Modal
    </button>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div
        class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
      >
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Register your account</h3>
          <div class="mt-2">
            <DynamicForm @close="closeModal" :schema="formSchema" :isModal="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DynamicForm from '@/components/DynamicForm.vue'
import * as yup from 'yup'

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const formSchema = {
  fields: [
    {
      label: 'Your Name',
      name: 'name',
      as: 'input',
      rules: yup.string().required()
    },
    {
      label: 'Your Email',
      name: 'email',
      as: 'input',
      rules: yup.string().email().required()
    },
    {
      label: 'Your Password',
      name: 'password',
      as: 'input',
      type: 'password',
      rules: yup.string().min(8).required()
    },
    {
      label: 'Favorite Drink',
      name: 'drink',
      as: 'select',
      children: [
        {
          tag: 'option',
          value: '',
          text: 'Select a drink'
        },
        {
          tag: 'option',
          value: 'coffee',
          text: 'Coffeee'
        },
        {
          tag: 'option',
          value: 'tea',
          text: 'Tea'
        },
        {
          tag: 'option',
          value: 'coke',
          text: 'Coke'
        }
      ]
    }
  ]
}
</script>
