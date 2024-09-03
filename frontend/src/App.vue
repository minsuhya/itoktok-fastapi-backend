<script setup>
import { provide } from 'vue'
import { useGlobalNavigation } from '@/composables/useGlobalNavigation'
import { useModal } from '@/composables/useModal'
import GlobalModal from '@/components/GlobalModal.vue'

const { navigateTo } = useGlobalNavigation()
provide('$navigateTo', navigateTo)

const { isVisible, message, showModal, hideModal } = useModal()
provide('isVisible', isVisible)
provide('message', message)
provide('showModal', showModal)
provide('hideModal', hideModal)
</script>

<template>
  <RouterView />
  <GlobalModal />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
