import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config.js';

export function loginUsuario(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function registrarUsuario(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function deslogarUsuario() {
  return signOut(auth);
}

export function observarEstadoAutenticacao(callback) {
  return onAuthStateChanged(auth, callback);
}
