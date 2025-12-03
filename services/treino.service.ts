/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/treino.service.ts

import { db } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

export async function createTreino(userId: string, treino: any) {
  const ref = collection(db, "users", userId, "treinos");
  const docRef = await addDoc(ref, treino);
  return docRef.id;
}

export async function getTreinos(userId: string) {
  const ref = collection(db, "users", userId, "treinos");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateTreino(
  userId: string,
  treinoId: string,
  data: any
) {
  const ref = doc(db, "users", userId, "treinos", treinoId);
  await updateDoc(ref, data);
}

export async function deleteTreino(userId: string, treinoId: string) {
  const ref = doc(db, "users", userId, "treinos", treinoId);
  await deleteDoc(ref);
}
