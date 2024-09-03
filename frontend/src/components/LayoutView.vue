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
      <router-view v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <div :key="route.name">
            <component :is="Component" />
          </div>
        </Transition>
      </router-view>
    </main>
  </div>
  <!-- Bottom Footer -->
  <FooterView />
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
