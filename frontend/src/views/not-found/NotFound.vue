<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-800 dark:text-gray-200">404</h1>
      <p class="text-2xl font-semibold text-gray-600 dark:text-gray-400 mt-4">Page Not Found</p>
      <p class="text-gray-500 dark:text-gray-500 mt-2">
        Sorry, the page you are looking for does not exist.
      </p>
      <router-link
        to="/"
        class="mt-6 inline-block px-6 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        Go to Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No additional script needed for this simple template
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
