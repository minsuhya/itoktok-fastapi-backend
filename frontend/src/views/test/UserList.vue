<script setup>
// user list tailwindcss vue component
import { ref, computed, onBeforeMount } from 'vue'
import { list_users } from '@/api/test'
import PaginationView from '@/components/PaginationView.vue'

const users = ref([])
// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)

// Fetch user list
const fetchUsers = async (page) => {
  const res = await list_users(page)
  users.value = res.data
  currentPage.value = res.page
  itemsPerPage.value = res.per_page
  totalItems.value = res.total
}

onBeforeMount(fetchUsers)

// Handle page change event
const handlePageChange = (page) => {
  fetchUsers(page)
  currentPage.value = page
}
</script>
<template>
  <header class="bg-white shadow">
    <div class="flex flex-1 mx-auto mb-1 max-w-full px-4 py-3 sm:px-6 lg:px-8">
      <h1 class="text-xl font-bold tracking-tight text-gray-900">사용자목록-Test</h1>
    </div>
  </header>
  <!-- search and table -->
  <div
    class="my-1 flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-2 border-b"
  >
    <div class="font-semibold text-sm">total: 20</div>
    <label for="table-search" class="sr-only">Search</label>
    <div class="relative">
      <div
        class="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none"
      >
        <svg
          class="w-5 h-5 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
      <input
        type="text"
        id="table-search"
        class="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search for items"
      />
    </div>
  </div>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <table class="min-w-full leading-normal">
      <thead>
        <tr>
          <th
            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            고객번호
          </th>
          <th
            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            로그인ID
          </th>
          <th
            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            담당자
          </th>
          <th
            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            담당자이메일
          </th>
          <th
            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            사진
          </th>
          <th
            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            담당부서
          </th>
          <th
            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            담당자연락처
          </th>
          <th
            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            마지막로그인
          </th>
          <th
            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            가입일
          </th>
        </tr>
      </thead>
      <tbody class="text-gray-700">
        <!-- user list -->
        <tr v-for="user in users" :key="user.id">
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ user.id }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ user.first_name }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ user.last_name }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ user.email }}</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <img class="w-10 h-10 rounded-full shadow-lg" :src="user.avatar" />
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">None</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">01050289332</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">2024-08-26 09:33:01</td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">2024-08-26 09:31:08</td>
        </tr>
      </tbody>
    </table>
  </div>
  <PaginationView
    :total-items="totalItems"
    :current-page="currentPage"
    :items-per-page="itemsPerPage"
    @page-changed="handlePageChange"
  />
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
