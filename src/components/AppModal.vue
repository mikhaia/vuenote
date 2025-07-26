<!-- src/components/AppModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-4 rounded shadow-lg w-80">
      <h3 class="text-lg font-bold mb-4">{{ title }}</h3>
      <input v-if="type === 'rename'" :value="input" @input="$emit('update:input', $event.target.value)" class="border p-2 mb-4 w-full" />
      <div class="flex justify-end">
        <button @click="$emit('cancel')" class="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
        <button v-if="type === 'rename'" @click="$emit('confirm', input)" class="bg-blue-500 text-white px-4 py-2 rounded">Rename</button>
        <button v-if="type === 'delete'" @click="$emit('confirm')" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  type: String,
  title: String,
  input: String
})
defineEmits(['cancel', 'confirm', 'update:input'])
</script>