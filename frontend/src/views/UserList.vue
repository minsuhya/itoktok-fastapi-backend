<script setup>
import { ref, onBeforeMount, inject } from 'vue'
import { CheckIcon } from '@heroicons/vue/20/solid'
import { readUsers } from '@/api/user'
import PaginationView from '@/components/PaginationView.vue'
import UserFormSliding from '@/views/UserFormSliding.vue'

const showModal = inject('showModal')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const isFormVisible = ref(false)
const currentUserId = ref('') // str user_id
const searchQuery = ref('') // 검색어
const users = ref([])

const toggleForm = () => {
  isFormVisible.value = !isFormVisible.value
  if (!isFormVisible.value) {
    currentUserId.value = ''
    fetchUsers(currentPage.value)
  }
}

// Fetch user list
const fetchUsers = async (page) => {
  const data = await readUsers(page)
  users.value = data.items
  currentPage.value = data.page
  itemsPerPage.value = data.size
  totalItems.value = data.total
}

// 검색어 기반 내담자 검색
const searchUsers = async () => {
  try {
    const data = await readUsers(1, 10, searchQuery.value)
    users.value = data.items
    currentPage.value = data.page
    itemsPerPage.value = data.size
    totalItems.value = data.total
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

// Handle page change event
const handlePageChange = (page) => {
  fetchUsers(page)
  currentPage.value = page
}

const clickUserInfo = (userId = '') => {
  if (!userId) {
    currentUserId.value = ''
  } else {
    currentUserId.value = String(userId)
  }

  toggleForm()
}

onBeforeMount(fetchUsers)
</script>
<template>
  <!-- ====== Page Title Section Start -->
  <section>
    <div class="w-full sm:container">
      <div class="border-black border-l-[5px] pl-5">
        <h2 class="text-dark mb-2 text-2xl font-semibold dark:text-white">상담자 관리</h2>
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
          placeholder="상담사 검색"
          @keyup.enter="searchUsers"
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
          상담사 등록
        </button>
      </span>
    </div>
  </div>
  <!-- ====== Search and Table Section End -->
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">아이디</th>
          <th scope="col" class="px-6 py-3">상담사명</th>
          <th scope="col" class="px-6 py-3">이메일</th>
          <th scope="col" class="px-6 py-3">센터명</th>
          <th scope="col" class="px-6 py-3">휴대폰번호</th>
          <th scope="col" class="px-6 py-3">전화번호</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ user.username }}
          </th>
          <td class="px-6 py-4">{{ user.full_name }}</td>
          <td class="px-6 py-4">{{ user.email }}</td>
          <td class="px-6 py-4">{{ user.center_info?.center_name }}({{ user.center_username }})</td>
          <td class="px-6 py-4">{{ user.hp_number }}</td>
          <td class="px-6 py-4">{{ user.phone_number }}</td>
          <td class="px-6 py-4">
            <a
              href="#"
              @click="clickUserInfo(user.id)"
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >상담자정보</a
            >
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
    <UserFormSliding :isVisible="isFormVisible" :userId="currentUserId" @close="toggleForm" />
  </div>
</template>
