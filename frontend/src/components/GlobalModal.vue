<template>
  <div
    v-if="isVisible"
    class="min-w-72 fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-300 ease-in-out z-50"
    :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
  >
    <div
      class="min-w-72 bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out"
      :class="{ 'scale-95': !isVisible, 'scale-100': isVisible }"
    >
      <h2 class="text-2xl font-bold mb-6 text-center">ITokTok</h2>
      <p class="my-4">{{ message }}</p>
      <button @click="hideModal" class="w-full bg-blue-500 text-white py-2 rounded-lg">확인</button>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const isVisible = inject('isVisible')
const message = inject('message')
const hideModal = inject('hideModal')
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}
</style>
