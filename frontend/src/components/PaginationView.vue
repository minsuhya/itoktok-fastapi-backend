<template>
  <nav
    class="flex items-center flex-column flex-wrap md:flex-row justify-between p-4"
    aria-label="Table navigation"
  >
    <span
      class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto"
      >Showing
      <span class="font-semibold text-gray-900 dark:text-white">{{ start }}-{{ end }}</span> of
      <span class="font-semibold text-gray-900 dark:text-white">{{ totalPages }}</span></span
    >
    <ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
      <li @click="prevPage" :disabled="currentPage === 1">
        <a
          href="#"
          class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >Previous</a
        >
      </li>
      <li v-for="page in pages" :key="page" @click="changePage(page)">
        <a
          href="#"
          :class="page === currentPage ? 'bg-blue-700/20' : 'bg-white'"
          class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >{{ page }}</a
        >
      </li>
      <li @click="nextPage" :disabled="currentPage === totalPages">
        <a
          href="#"
          class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >Next</a
        >
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  totalItems: Number,
  currentPage: Number,
  itemsPerPage: Number
})

const emit = defineEmits(['page-changed'])

// Compute the total number of pages
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

// Compute the start and end of the current page
const start = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
const end = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))

// Generate an array of page numbers to display
const pages = computed(() => {
  const range = []
  for (let i = 1; i <= totalPages.value; i++) {
    range.push(i)
  }
  return range
})

// Change to a specific page
const changePage = (page) => {
  emit('page-changed', page)
}

// Move to the next page
const nextPage = () => {
  if (props.currentPage < totalPages.value) {
    emit('page-changed', props.currentPage + 1)
  }
}

// Move to the previous page
const prevPage = () => {
  if (props.currentPage > 1) {
    emit('page-changed', props.currentPage - 1)
  }
}
</script>
