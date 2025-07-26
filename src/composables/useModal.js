// src/composables/useModal.js
import { ref } from 'vue'

export function useModal(user, categories, selectedNote, renameItem, deleteItem) {
  const modal = ref({ show: false, type: '', title: '', item: null, input: '' })

  const openRenameModal = (type, item) => {
    modal.value = {
      show: true,
      type: 'rename',
      title: `Rename ${type}`,
      item,
      input: item.name || item.title
    }
  }

  const openDeleteModal = (type, item) => {
    modal.value = {
      show: true,
      type: 'delete',
      title: `Are you sure to delete this ${type}?`,
      item
    }
  }

  const confirmRename = async (newValue) => {
    const item = modal.value.item
    if (item.name !== undefined) {
      await renameItem(user.value.uid, 'category', item, newValue)
      item.name = newValue
    } else {
      const category = categories.value.find(c => c.notes.includes(item))
      if (category) {
        await renameItem(user.value.uid, 'note', item, newValue, category.id)
        item.title = newValue
      }
    }
    modal.value.show = false
  }

  const confirmDelete = async () => {
    const item = modal.value.item
    if (item.name !== undefined) {
      await deleteItem(user.value.uid, 'category', item)
      categories.value = categories.value.filter(c => c.id !== item.id)
    } else {
      const category = categories.value.find(c => c.notes.includes(item))
      if (category) {
        await deleteItem(user.value.uid, 'note', item, category.id)
        category.notes = category.notes.filter(n => n.id !== item.id)
        if (selectedNote.value?.id === item.id) selectedNote.value = null
      }
    }
    modal.value.show = false
  }

  const handleConfirm = (inputValue) => {
    if (modal.value.type === 'rename') {
      confirmRename(inputValue)
    } else {
      confirmDelete()
    }
  }

  return {
    modal,
    openRenameModal,
    openDeleteModal,
    handleConfirm
  }
}