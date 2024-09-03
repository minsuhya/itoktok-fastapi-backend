import { ref } from 'vue'

export function useModal() {
  const isVisible = ref(false)
  const message = ref('')

  const showModal = (msg) => {
    message.value = msg
    isVisible.value = true
  }

  const hideModal = () => {
    isVisible.value = false
    message.value = ''
  }

  return {
    isVisible,
    message,
    showModal,
    hideModal
  }
}
