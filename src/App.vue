<template>
  <div
    v-if="isVisible"
    class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 z-10"
  >
    {{ toastMessage }}
  </div>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <div class="flex flex-col justify-between h-full">
      <div>
      <div class="flex justify-between">
        <h2 class="text-lg font-bold mb-4">Notes</h2>
        <button
          @click="addCategory"
          class="mb-4 inline-flex items-center gap-2 bg-white hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow transition duration-200"
        >
          📁 Add Category
        </button>
      </div>
      <div v-for="category in categories" :key="category.id" class="mb-2">
        <div class="flex justify-between items-center">
          <span @click="toggleCategory(category.id)" class="cursor-pointer font-semibold">
            <span class="mr-1">
              {{ category.expanded ? '📂' : '📁' }}
            </span>
            {{ category.name }}
          </span>
          <div>
            <button @click="openRenameModal('category', category)" class="text-blue-500 mr-2">✏️</button>
            <button @click="openDeleteModal('category', category)" class="text-red-500">🗑️</button>
          </div>
        </div>
        <div v-if="category.expanded" class="ml-4">
          <div v-for="note in category.notes" :key="note.id" class="flex justify-between items-center">
            <span @click="selectNote(note)" class="cursor-pointer" :class="{ 'font-bold': note.id === selectedNote?.id }">📝 {{ note.title }}</span>
            <div>
              <button @click="openRenameModal('note', note)" class="text-blue-500 mr-2">✏️</button>
              <button @click="openDeleteModal('note', note)" class="text-red-500">🗑️</button>
            </div>
          </div>
          <button @click="addNote(category.id)" class="text-blue-500 mb-2 mt-1">➕ Add Note</button>
        </div>
      </div>
      </div>

      <!-- Auth Controls -->
      <div class="mt-6 border-t pt-4">
        <div v-if="user" class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <img
              :src="user.photoURL"
              alt="User Avatar"
              class="w-10 h-10 rounded-full border border-gray-300"
            />
            <div>
              <p class="text-sm text-gray-800 font-medium"> {{ user.displayName }}</p>
              <p class="text-xs text-gray-500">{{ user.email }}</p>
            </div>
          </div>
          <button
            @click="signOutUser"
            class="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-1.5 px-3 rounded"
          >
            🔐 Sign Out
          </button>
        </div>

        <div v-else>
          <button
            @click="signIn"
            class="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded w-full"
          >
            🔓 Sign In with Google
          </button>
        </div>
      </div>
    </div>
    </div>

    <!-- Editor -->
    <div class="w-3/4 p-4 h-full flex flex-col">
      <div class="flex justify-between items-center mb-2 ">
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <span class="text-gray-600">Note Editor</span>
          <span v-if="selectedNote"> / {{ selectedNote.title }}</span>
          <button
            v-if="selectedNote"
            @click="openRenameModal('note', selectedNote)"
            class="text-sm"
            title="Rename note"
          >
            ✏️
          </button>
        </h2>
        <button
          v-if="selectedNote"
          @click="saveNote"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <span v-if="isSaving" class="animate-spin mr-2">⏳</span>
          Save
        </button>
      </div>
      <div class="h-full">
        <editor
          v-if="selectedNote"
          :key="selectedNote.id"
          v-model="selectedNote.content"
          :init="{
            toolbar_mode: 'wrap',
            height: '100%',
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist | outdent indent | removeformat',
            skin_url: '/tinymce/skins/ui/oxide',
            content_css: '/tinymce/skins/content/default/content.css'
          }"
        />
      </div>
    </div>

    <!-- Modal -->
    <AppModal
      :show="modal.show"
      :type="modal.type"
      :title="modal.title"
      v-model:input="modal.input"
      @cancel="modal.show = false"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth } from './firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  renameItem,
  deleteItem,
} from './firebase/db'

import Editor from '@tinymce/tinymce-vue'
import AppModal from '@/components/AppModal.vue'
// import Toast from '@/components/AppToast.vue'
import { useModal } from '@/composables/useModal'
import { useNotes } from '@/composables/useNotes'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import '@/assets/styles.css'


const user = ref(null)
const isSaving = ref(false)

const { toastMessage, isVisible } = useToast()
const { categories, selectedNote, addCategory, addNote, toggleCategory, selectNote, saveNote } = useNotes(user)
const { modal, openRenameModal, openDeleteModal, handleConfirm } = useModal(user, categories, selectedNote, renameItem, deleteItem)
const { signIn, signOutUser, loadUserData } = useAuth(user, categories, selectedNote)


onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    if (currentUser) loadUserData()
  })
})
</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
</style>
