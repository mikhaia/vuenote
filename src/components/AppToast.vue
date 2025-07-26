<!-- components/Toast.vue -->
<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50"
    >
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')

let timeoutId

function showToast(text, duration = 3000) {
  message.value = text
  visible.value = true

  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    visible.value = false
  }, duration)
}

defineExpose({ showToast })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
