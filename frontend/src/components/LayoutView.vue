<script setup>
import HeaderView from '@/components/HeaderView.vue'
import LeftView from '@/components/LeftView.vue'
import FooterView from '@/components/FooterView.vue'
</script>
<template>
  <!-- Top Navigaktion Bar -->
  <HeaderView />
  <div class="flex flex-1 overflow-hidden">
    <!-- Left Sidebar -->
    <LeftView />
    <main class="flex-1 overflow-y-auto p-3">
      <!-- Main Content -->
      <RouterView />
    </main>
  </div>
  <!-- Bottom Footer -->
  <FooterView />
</template>
