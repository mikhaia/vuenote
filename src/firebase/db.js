import { db } from './firebase'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'

export const getUserCategories = async (uid) => {
  const catSnapshot = await getDocs(collection(db, 'users', uid, 'categories'))
  const categories = []

  for (const catDoc of catSnapshot.docs) {
    const catData = catDoc.data()
    const notesSnapshot = await getDocs(
        collection(db, 'users', uid, 'categories', catDoc.id, 'notes')
    )
    const notes = notesSnapshot.docs.map(noteDoc => ({
      id: noteDoc.id,
      categoryId: catDoc.id,
      ...noteDoc.data()
    }))
    categories.push({
      id: catDoc.id,
      ...catData,
      notes
    })
  }

  return categories
}

export const addCategoryForUser = async (uid, name) => {
  const ref = await addDoc(collection(db, 'users', uid, 'categories'), {
    name,
    userId: uid,
    expanded: true,
  })
  return { id: ref.id, name, expanded: true, notes: [] }
}

export const addNoteToCategory = async (uid, categoryId, title, content) => {
  const ref = await addDoc(collection(db, 'users', uid, 'categories', categoryId, 'notes'), {
    title,
    content,
  })
  return { id: ref.id, title, content }
}

export const renameItem = async (uid, type, item, newValue, categoryId = null) => {
  let ref
  if (type === 'category') {
    ref = doc(db, 'users', uid, 'categories', item.id)
    await updateDoc(ref, { name: newValue })
  } else {
    ref = doc(db, 'users', uid, 'categories', categoryId, 'notes', item.id)
    await updateDoc(ref, { title: newValue })
  }
}

export const updateCategoryExpanded = async (uid, categoryId, expanded) => {
  const ref = doc(db, 'users', uid, 'categories', categoryId)
  await updateDoc(ref, { expanded })
}

export const deleteItem = async (uid, type, item, categoryId = null) => {
  let ref
  if (type === 'category') {
    ref = doc(db, 'users', uid, 'categories', item.id)
  } else {
    ref = doc(db, 'users', uid, 'categories', categoryId, 'notes', item.id)
  }
  await deleteDoc(ref)
}

export const saveItem = async (uid, note) => {
  if (!note.id || !note.categoryId) return

  try {
    const noteRef = doc(db, 'users', uid, 'categories', note.categoryId, 'notes', note.id)
    await updateDoc(noteRef, {
      content: note.content,
      updatedAt: new Date()
    })
    // alert('Note saved!')
  } catch (error) {
    console.error('Failed to save note:', error)
    // alert('Failed to save note!')
  }
}
