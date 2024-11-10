<template>
  <section>
    <div class="w-full sm:container">
      <div class="border-black border-l-[5px] pl-5">
        <h2 class="text-dark mb-2 text-2xl font-semibold dark:text-white">프로그램 관리</h2>
      </div>
    </div>
  </section>

  <div class="lg:flex lg:items-center lg:justify-between mb-2">
    <div class="min-w-0 flex-1">
      <div class="relative">
        <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="text"
          id="table-search-users"
          v-model="searchText"
          name="search-text"
          class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="프로그램 검색"
          @keyup.enter="searchPrograms"
        >
      </div>
    </div>
    <div class="mt-5 flex lg:ml-4 lg:mt-0">
      <span class="sm:ml-3">
        <button
          type="button"
          @click="toggleForm()"
          class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <CheckIcon class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          프로그램 등록
        </button>
      </span>
    </div>
  </div>

  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">프로그램 유형</th>
          <th scope="col" class="px-6 py-3">프로그램명</th>
          <th scope="col" class="px-6 py-3">담당 선생님</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="program in programs" :key="program.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <td class="px-6 py-4">{{ program.program_type }}</td>
          <td class="px-6 py-4">{{ program.program_name }}</td>
          <td class="px-6 py-4">{{ program.is_all_teachers ? '전체' : program.teacher?.full_name }}</td>
          <td class="px-6 py-4">
            <div class="flex items-center space-x-2">
              <a 
                href="#" 
                @click.prevent="toggleForm(program.id)" 
                class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                수정
              </a>
              <a 
                href="#" 
                @click.prevent="handleDelete(program.id)" 
                class="font-medium text-red-600 dark:text-red-500 hover:underline"
              >
                삭제
              </a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ProgramFormSliding
    :is-visible="isFormVisible"
    :program-id="selectedProgramId"
    @close="toggleForm"
  />
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { CheckIcon } from '@heroicons/vue/20/solid'
import ProgramFormSliding from './ProgramFormSliding.vue'
import { readPrograms, deleteProgram } from '@/api/program'

const showModal = inject('showModal')

const isFormVisible = ref(false)
const selectedProgramId = ref('')
const searchText = ref('')
const programs = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const toggleForm = (programId = '') => {
  isFormVisible.value = !isFormVisible.value
  selectedProgramId.value = programId ? String(programId) : ''
  if (!isFormVisible.value) {
    loadPrograms()
  }
}

const searchPrograms = async () => {
  try {
    const response = await readPrograms(
      currentPage.value,
      pageSize.value,
      searchText.value
    )
    programs.value = response.items
  } catch (error) {
    console.error('Error searching programs:', error)
  }
}

const loadPrograms = async () => {
  try {
    const response = await readPrograms(
      currentPage.value,
      pageSize.value
    )
    console.log("response:", response)
    programs.value = response.items
  } catch (error) {
    console.error('Error fetching programs:', error)
  }
}

const handleDelete = async (programId) => {
  if (!confirm('프로그램을 삭제하시겠습니까?')) return

  try {
    await deleteProgram(programId)
    showModal('프로그램이 삭제되었습니다.')
    loadPrograms()
  } catch (error) {
    console.error('Error deleting program:', error)
    showModal('프로그램 삭제 중 오류가 발생했습니다.')
  }
}

onMounted(loadPrograms)
</script> 