// src/services/auth.service.ts

import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";

// Registrar
export async function register(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

// Login
export async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

// Logout
export async function logout() {
  await signOut(auth);
}

// Listener para mudanças de auth
export function listenAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
