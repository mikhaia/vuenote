import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { GoogleAuthProvider } from 'firebase/auth'
import { firebaseConfig } from './config'

// export const firebaseConfig = {
//   apiKey: "AIzaSyCS5Mdhq735MPAW3Y3Cs-M7c9SC-9_-N88",
//   authDomain: "vuenote-be002.firebaseapp.com",
//   projectId: "vuenote-be002",
//   storageBucket: "vuenote-be002.firebasestorage.app",
//   messagingSenderId: "324190766078",
//   appId: "1:324190766078:web:2edf99c4c7da5d2475f6af"
// };

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const provider = new GoogleAuthProvider()

export { auth, db, provider }
