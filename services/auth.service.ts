// src/services/auth.service.ts

import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

// Registrar + salvar nome no Firestore
export async function register(email: string, password: string, name: string) {
  // Cria o usuário no Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // Salva dados adicionais no Firestore
  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    createdAt: new Date(),
  });

  return user;
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
