import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from './firebase'

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

export const registerWithEmail = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(userCredential.user, { displayName })
  return userCredential
}

export const loginWithGoogle = () =>
  signInWithPopup(auth, googleProvider)

export const logout = () => signOut(auth)

export const getIdToken = async () => {
  if (!auth.currentUser) throw new Error('Usuário não autenticado')
  return auth.currentUser.getIdToken()
}
