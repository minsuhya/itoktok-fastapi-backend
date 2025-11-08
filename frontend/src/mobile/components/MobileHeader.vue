<template>
  <header class="bg-blue-600 text-white h-14 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
    <!-- 왼쪽 아이콘 -->
    <div class="flex items-center">
      <button v-if="showBack" @click="handleBack" class="mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button v-if="showMenu" @click="handleMenu" class="mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <button v-if="showSearch" @click="handleSearch" class="mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </button>
    </div>

    <!-- 중앙 제목 -->
    <h1 class="flex-1 text-center font-semibold text-lg">{{ title }}</h1>

    <!-- 오른쪽 아이콘 -->
    <div class="flex items-center">
      <button v-if="showBell" @click="handleBell" class="ml-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      </button>
      <button v-if="showPlus" @click="handlePlus" class="ml-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
      <button v-if="showSave" @click="handleSave" class="ml-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </button>
      <button v-if="showFilter" @click="handleFilter" class="ml-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678a1.5 1.5 0 011.256 1.563l-.498 6.122M12 3c-2.754 0-5.454.232-8.082.678a1.5 1.5 0 00-1.256 1.562l.497 6.123M8.25 15H6a4.5 4.5 0 01-1.41-8.775l1.345-6.327a1.5 1.5 0 011.577-1.205l5.909.792a1.5 1.5 0 011.205 1.577l-1.345 6.327A4.5 4.5 0 0115.75 15H12" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: false
  },
  showMenu: {
    type: Boolean,
    default: false
  },
  showSearch: {
    type: Boolean,
    default: false
  },
  showBell: {
    type: Boolean,
    default: false
  },
  showPlus: {
    type: Boolean,
    default: false
  },
  showSave: {
    type: Boolean,
    default: false
  },
  showFilter: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['back', 'menu', 'search', 'bell', 'plus', 'save', 'filter'])

const handleBack = () => emit('back')
const handleMenu = () => emit('menu')
const handleSearch = () => emit('search')
const handleBell = () => emit('bell')
const handlePlus = () => emit('plus')
const handleSave = () => emit('save')
const handleFilter = () => emit('filter')
</script>

<style scoped>
header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>

