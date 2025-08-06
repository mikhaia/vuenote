  <template>
    <div
      v-if="isVisible"
      class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 z-10"
    >
      {{ toastMessage }}
    </div>
    <div class="flex h-screen flex-col md:flex-row dark:bg-gray-700">
      <!-- Sidebar -->
      <div v-if="!isMobileView || mobileView === 'list'"
        class="w-full md:w-1/4 p-4 overflow-y-auto h-full dark:text-white dark:bg-gray-800">
        <div class="flex flex-col justify-between h-full">
        <div>
          <div class="flex justify-between">
            <div>
              <button @click="toggleTheme" class="text-xl">
                {{ isDark ? '🌙' : '☀️' }}
              </button>
            </div>
            <h1 class="text-2xl font-bold mb-4">Notes</h1>
          </div>
          
        <div v-for="category in categories" :key="category.id" class="mb-2">
          <div class="flex justify-between items-center">
            <span @click="toggleCategory(category.id)" class="cursor-pointer font-semibold">
              <span class="material-symbols-outlined mr-1 align-middle">
                {{ category.expanded ? 'folder_open' : 'folder' }}
              </span>
              {{ category.name }}
            </span>
            <div>
              <button @click="openRenameModal('category', category)" class="mr-2"><span class="material-symbols-outlined">edit</span></button>
              <button @click="openDeleteModal('category', category)"><span class="material-symbols-outlined">delete</span></button>
            </div>
          </div>
          <div v-if="category.expanded" class="ml-4">
            <div v-for="note in category.notes" :key="note.id" class="flex justify-between items-center">
              <span @click="handleSelectNote(note)" class="cursor-pointer" :class="{ 'font-bold': note.id === selectedNote?.id }"><span class="material-symbols-outlined mb-1 align-middle">sticky_note_2</span> {{ note.title }}</span>
              <div>
                <button @click="openRenameModal('note', note)" class="mr-2"><span class="material-symbols-outlined">edit</span></button>
                <button @click="openDeleteModal('note', note)"><span class="material-symbols-outlined">delete</span></button>
              </div>
            </div>
            <button @click="addNote(category.id)" class="text-blue-800 mb-2 mt-1 dark:text-blue-200"><span class="material-symbols-outlined mb-1 align-middle">add_notes</span> Add Note</button>
          </div>
        </div>
          <button
            @click="addCategory"
            class="mb-4 inline-flex items-center gap-2 bg-white hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow transition duration-200"
          >
            <span class="material-symbols-outlined">create_new_folder</span> Add Category
          </button>
        </div>

        <!-- Auth Controls -->
        <div class="mt-6 border-t pt-4 ">
          <div v-if="user" class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <img
                :src="user.photoURL"
                alt="User Avatar"
                class="w-10 h-10 rounded-full border border-gray-300"
              />
              <div>
                <p class="text-sm text-gray-800 font-medium dark:text-gray-200"> {{ user.displayName }}</p>
                <p class="text-xs text-gray-500">{{ user.email }}</p>
              </div>
            </div>
            <button
              @click="signOutUser"
              class="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-1.5 px-3 rounded"
            >
              <span class="material-symbols-outlined text-base align-middle">logout</span> Sign Out
            </button>
          </div>

          <div v-else>
            <button
              @click="signIn"
              class="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded w-full"
            >
              <span class="material-symbols-outlined text-base align-middle">login</span> Sign In with Google
            </button>
          </div>
        </div>
      </div>
      </div>

      <!-- Editor -->
      <div v-if="!isMobileView || mobileView === 'editor'"
        class="w-full md:w-3/4 p-4 h-full flex flex-col">
        <div class="flex justify-between items-center mb-2">
          <button
            v-if="isMobileView && mobileView === 'editor'"
            @click="mobileView = 'list'"
          >
            <span class="material-symbols-outlined my-1 sm:my-2">chevron_left</span>
          </button>
          <h2 class="text-xl font-semibold flex items-center gap-2 dark:text-white">
            <span class="text-gray-600 dark:text-gray-400" v-if="!isMobileView">Note Editor</span>
            <span class="text-gray-600 dark:text-gray-400" v-if="selectedNote">/</span>
            <span v-if="selectedNote">{{ selectedNote.title }}</span>
            <button
              v-if="selectedNote"
              @click="openRenameModal('note', selectedNote)"
              title="Rename note"
            >
              <span class="material-symbols-outlined mt-2">edit</span>
            </button>
          </h2>
          <button
            v-if="selectedNote"
            @click="saveNote"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 sm:py-2 rounded"
          >
            <span v-if="isSaving" class="animate-spin mr-2">⏳</span>
            Save
          </button>
        </div>
        <div class="h-full">
          <editor
            v-if="selectedNote"
            api-key="di9z7wa9tcdsjxic7y9uid4lbh9zfsl8j03eyjm4xoss8qa5"
            :key="selectedNote.id"
            v-model="selectedNote.content"
            :init="{
              toolbar_mode: 'wrap',
              height: '100%',
              menubar: false,
              plugins: [
                'advlist',
                'autolink',
                'lists',
                'link',
                'image',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'help',
                'wordcount',
                'codesample'
              ],
              toolbar: 'bold italic underline backcolor | alignleft aligncenter alignright alignjustify | checklist bullist numlist outdent indent | table link image code codesample | undo redo removeformat',
              skin: isDark ? 'oxide-dark' : 'oxide',
              content_css: isDark ? 'dark' : 'default'
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
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { auth } from './firebase/firebase'
  import { onAuthStateChanged } from 'firebase/auth'
  import {
    renameItem,
    deleteItem,
  } from './firebase/db'

  import Editor from '@tinymce/tinymce-vue'
  import AppModal from '@/components/AppModal.vue'
  import { useModal } from '@/composables/useModal'
  import { useNotes } from '@/composables/useNotes'
  import { useAuth } from '@/composables/useAuth'
  import { useToast } from '@/composables/useToast'


  const user = ref(null)
  const isDark = ref(false)
  const isSaving = ref(false)
  const isMobileView = ref(false)
  const mobileView = ref('list')

  const { toastMessage, isVisible } = useToast()
  const { categories, selectedNote, addCategory, addNote, toggleCategory, selectNote, saveNote } = useNotes(user)
  const { modal, openRenameModal, openDeleteModal, handleConfirm } = useModal(user, categories, selectedNote, renameItem, deleteItem)
  const { signIn, signOutUser, loadUserData } = useAuth(user, categories, selectedNote)

  const checkMobile = () => {
    isMobileView.value = window.innerWidth < 768
    if (!isMobileView.value) {
      mobileView.value = 'list'
    }
  }

  const handleSelectNote = (note) => {
    selectNote(note)
    if (isMobileView.value) {
      mobileView.value = 'editor'
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateBodyClass()
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  const updateBodyClass = () => {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  onMounted(() => {
    const saved = localStorage.getItem('theme')
    isDark.value = saved === 'dark'
    updateBodyClass()

    checkMobile()
    window.addEventListener('resize', checkMobile)

    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser
      if (currentUser) loadUserData()
    })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile)
  })
  </script>
