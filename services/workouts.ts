import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Buscar todos os workouts do usuário
export const fetchWorkouts = async (uid: string) => {
  const ref = doc(db, "userWorkouts", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data().workouts || {};
  }
  return {};
};

// Buscar os exercícios de um dia específico
export const fetchWorkoutByDay = async (uid: string, day: string) => {
  const workouts = await fetchWorkouts(uid);
  return workouts[day] || [];
};

// Criar um dia de treino vazio
export const addWorkout = async (uid: string, day: string) => {
  const workouts = await fetchWorkouts(uid);
  if (!workouts[day]) {
    await updateWorkout(uid, day, []);
  }
};

// Atualizar o array de exercícios de um dia
export const updateWorkout = async (
  uid: string,
  day: string,
  exercises: string[]
) => {
  const ref = doc(db, "userWorkouts", uid);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};
  await setDoc(
    ref,
    {
      workouts: {
        ...(data.workouts || {}),
        [day]: exercises,
      },
    },
    { merge: true }
  );
};

// Adicionar exercício
export const addExercise = async (uid: string, day: string, exId: string) => {
  const dayList = await fetchWorkoutByDay(uid, day);
  if (!dayList.includes(exId)) {
    await updateWorkout(uid, day, [...dayList, exId]);
  }
};

// Remover exercício
export const removeExercise = async (
  uid: string,
  day: string,
  exId: string
) => {
  const dayList = await fetchWorkoutByDay(uid, day);
  await updateWorkout(
    uid,
    day,
    dayList.filter((id: string) => id !== exId)
  );
};
