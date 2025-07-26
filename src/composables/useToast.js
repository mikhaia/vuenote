// useToast.js
import { ref } from 'vue'

const toastMessage = ref('')
const isVisible = ref(false)

const showToast = (message, duration = 3000) => {
  console.log('ShowToast:', message)
  toastMessage.value = message
  isVisible.value = true
  setTimeout(() => {
    isVisible.value = false
    toastMessage.value = ''
  }, duration)
}

export function useToast() {
  return {
    toastMessage,
    isVisible,
    showToast,
  }
}
