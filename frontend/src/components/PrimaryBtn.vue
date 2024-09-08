<template>
  <button :class="buttonClass" @click="handleClick">
    {{ label }}
  </button>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  buttonClass: {
    type: String,
    default:
      'text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.4 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
  },
  route: {
    type: String,
    required: true
  }
})

const navigateTo = inject('$navigateTo')

const handleClick = () => {
  navigateTo(props.route)
}
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
