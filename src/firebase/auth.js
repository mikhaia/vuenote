import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

const provider = new GoogleAuthProvider()

export const signIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    console.log('Signed in:', user.displayName)
    return user
  } catch (err) {
    console.error('Sign-in error:', err)
    throw err
  }
}

export const signOutUser = async () => {
  await auth.signOut()
}

onAuthStateChanged(auth, user => {
  if (user) {
    console.log('Пользователь вошёл:', user.displayName)
  } else {
    console.log('Пользователь вышел')
  }
})