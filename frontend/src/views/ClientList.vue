<script setup>
import { ref, reactive, onBeforeMount, inject } from 'vue'
import { CheckIcon } from '@heroicons/vue/20/solid'
import { readClientInfos, updateClientConsultantStauts } from '@/api/client'
import PaginationView from '@/components/PaginationView.vue'
import ClientFormSliding from '@/views/ClientFormSliding.vue'

const showModal = inject('showModal')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const isFormVisible = ref(false)
const currentClientId = ref('') // str client_id
const searchQuery = ref('') // 검색어
const clients = ref([])

const toggleForm = () => {
  isFormVisible.value = !isFormVisible.value
  if (!isFormVisible.value) {
    currentClientId.value = ''
    fetchClients(currentPage.value)
  }
}

// Fetch client list
const fetchClients = async (page) => {
  const data = await readClientInfos(page)
  clients.value = data.items
  currentPage.value = data.page
  itemsPerPage.value = data.size
  totalItems.value = data.total
  console.log('clients:', clients.value)
}

// 검색어 기반 내담자 검색
const searchClients = async () => {
  try {
    const data = await readClientInfos(1, 10, searchQuery.value)
    clients.value = data.items
    currentPage.value = data.page
    itemsPerPage.value = data.size
    totalItems.value = data.total
  } catch (error) {
    console.error('Error fetching clients:', error)
  }
}

// Handle page change event
const handlePageChange = (page) => {
  fetchClients(page)
  currentPage.value = page
}

// 상담상태 변경
const handleStatusChange = async (client) => {
  console.log('client:', client)
  try {
    await updateClientConsultantStauts(client.id, client.consultant_status)
    showModal('상담상태 정보가 수정되었습니다.')
  } catch (error) {
    showModal('상담상태 정보 등록 중 오류가 발생했습니다.')
    console.error('Error registering client data:', error)
  }
}

const clickClientInfo = (clientId = '') => {
  if (!clientId) {
    currentClientId.value = ''
  } else {
    currentClientId.value = String(clientId)
  }
  toggleForm()
}

onBeforeMount(fetchClients)
</script>
<template>
  <!-- ====== Page Title Section Start -->
  <section>
    <div class="w-full sm:container">
      <div class="border-black border-l-[5px] pl-5">
        <h2 class="text-dark mb-2 text-2xl font-semibold dark:text-white">내담자 관리</h2>
        <!-- <p class="text-body-color dark:text-dark-6 text-sm font-medium"> -->
        <!--   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultrices lectus sem. -->
        <!-- </p> -->
      </div>
    </div>
  </section>
  <!-- ====== Page Title Section End -->
  <!-- ====== Search and Table Section Start -->
  <div class="lg:flex lg:items-center lg:justify-between mb-2">
    <div class="min-w-0 flex-1">
      <div class="relative">
        <div
          class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none"
        >
          <svg
            class="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          id="table-search-users"
          name="search-text"
          v-model="searchQuery"
          class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="내담자 검색"
          @keyup.enter="searchClients"
        />
      </div>
    </div>
    <div class="mt-5 flex lg:ml-4 lg:mt-0">
      <span class="sm:ml-3">
        <button
          type="button"
          @click="toggleForm"
          class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <CheckIcon class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          내담자 등록
        </button>
      </span>
    </div>
  </div>
  <!-- ====== Search and Table Section End -->
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <!-- <th scope="col" class="p-4"> -->
          <!--   <div class="flex items-center"> -->
          <!--     <input id="checkbox-all-search" type="checkbox" -->
          <!--       class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /> -->
          <!--     <label for="checkbox-all-search" class="sr-only">checkbox</label> -->
          <!--   </div> -->
          <!-- </th> -->
          <th scope="col" class="px-6 py-3">내담자명</th>
          <th scope="col" class="px-6 py-3">내담자 휴대전화</th>
          <th scope="col" class="px-6 py-3">내담자 이메일</th>
          <th scope="col" class="px-6 py-3">상담사</th>
          <th scope="col" class="px-6 py-3">상담상태</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- user list -->
        <tr
          v-for="client in clients"
          :key="client.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <!-- <td class="w-4 p-4"> -->
          <!--   <div class="flex items-center"> -->
          <!--     <input id="checkbox-table-search-1" type="checkbox" -->
          <!--       class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /> -->
          <!--     <label for="checkbox-table-search-1" class="sr-only">checkbox</label> -->
          <!--   </div> -->
          <!-- </td> -->
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ client.client_name }}
          </th>
          <td class="px-6 py-4">{{ client.phone_number }}</td>
          <td class="px-6 py-4">{{ client.email_address }}</td>
          <td class="px-6 py-4">
            <div v-if="client.consultant" class="flex items-center">
              {{ client.consultant_info?.full_name }}({{ client.consultant }})
            </div>
            <div v-if="!client.consultant" class="flex items-center">
              <button
                class="text-blue-600 dark:text-blue-500 hover:underline font-semibold border py-1 px-3 rounded-lg bg-blue-100 dark:bg-blue-800 dark:border-blue-600 dark:hover:bg-blue-700 dark:hover:border-blue-700 dark:text-white dark:hover:text-white dark:hover:bg-blue-700 dark:hover:border-blue-700"
                @click="toggleForm(client.id)"
              >
                상담자배정
              </button>
            </div>
          </td>
          <td class="px-6 py-4">
            <select
              class="w-24 h-9 bg-gray-100 border border-gray-300 rounded-md px-2 text-sm"
              v-model="client.consultant_status"
              @change="handleStatusChange(client)"
            >
              <option value="1">상담진행</option>
              <option value="2">상담보류</option>
              <option value="3">상담종결</option>
            </select>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center space-x-2">
              <a
                href="#"
                @click="clickClientInfo(client.id)"
                class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >내담자정보</a
              >
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <PaginationView
      :total-items="totalItems"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      @page-changed="handlePageChange"
    />
    <ClientFormSliding :isVisible="isFormVisible" :clientId="currentClientId" @close="toggleForm" />
  </div>
</template>
