// src/composables/useNotes.js
import { ref, nextTick } from 'vue'
import tinymce from 'tinymce'
import { addCategoryForUser, addNoteToCategory, updateCategoryExpanded, saveItem } from '@/firebase/db'
import { useToast } from './useToast'

export function useNotes(user) {
  const categories = ref([])
  const selectedNote = ref(null)
  const isSaving = ref(false)
  const { showToast } = useToast()

  const addCategory = async () => {
    if (!user.value?.uid) return
    const newCategory = await addCategoryForUser(user.value.uid, 'New Category')
    categories.value.push(newCategory)
  }

  const addNote = async (categoryId) => {
    if (!user.value?.uid) return
    const newNote = await addNoteToCategory(user.value.uid, categoryId, 'New Note', '<p>New note content</p>')
    const category = categories.value.find(c => c.id === categoryId)
    category.notes.push(newNote)
  }

  const toggleCategory = async (categoryId) => {
    const category = categories.value.find(c => c.id === categoryId)
    category.expanded = !category.expanded
    await updateCategoryExpanded(user.value.uid, categoryId, category.expanded)
  }

  const selectNote = async (note) => {
    console.log('note', note)
    tinymce.remove()
    selectedNote.value = null
    await nextTick()
    selectedNote.value = note
  }

    const saveNote = async () => {
        if (!selectedNote.value?.id || !selectedNote.value?.categoryId) return false

        isSaving.value = true
        try {
            await saveItem(user.value.uid, selectedNote.value)
            console.log('showToast 2');
            showToast('Note saved!')
            return true
        } catch (e) {
            console.error('Error:', e)
            return false
        } finally {
            isSaving.value = false
        }
    }

  return {
    categories,
    selectedNote,
    addCategory,
    addNote,
    toggleCategory,
    selectNote,
    saveNote
  }
}