import { auth, provider } from '@/firebase/firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import { getUserCategories } from '@/firebase/db'

export function useAuth(user, categories, selectedNote) {
  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      user.value = result.user
      loadUserData()
    } catch (error) {
      console.error('Sign-in error:', error)
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth)
      user.value = null
      categories.value = []
      selectedNote.value = null
    } catch (error) {
      console.error('Sign-out error:', error)
    }
  }

  const loadUserData = async () => {
    if (user.value?.uid) {
      categories.value = await getUserCategories(user.value.uid)
    }
  }

  return {
    signIn,
    signOutUser,
    loadUserData,
  }
}
