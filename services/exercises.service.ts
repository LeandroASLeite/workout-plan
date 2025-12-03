/* eslint-disable @typescript-eslint/no-explicit-any */

import { Exercise } from "@/types/exercise";

// src/services/exercises.service.ts
const BASE_URL = "https://v2.exercisedb.dev/api/v1";

export async function searchExercises(
  query: string,
  limit = 10,
  after?: string
): Promise<Exercise[]> {
  const params = new URLSearchParams({
    search: query,
    limit: limit.toString(),
  });
  if (after) params.append("after", after);

  const res = await fetch(`${BASE_URL}/exercises/search?${params.toString()}`);

  if (!res.ok) throw new Error("Erro ao buscar exercícios");

  const data = await res.json();

  // mapeando os exercícios para o nosso formato
  return data.data.map((ex: any) => ({
    exerciseId: ex.exerciseId,
    name: ex.name,
    bodyPart: ex.bodyParts?.[0] || "Desconhecido",
    targetMuscles: ex.targetMuscles || [],
    secondaryMuscles: ex.secondaryMuscles || [],
    equipment: ex.equipments?.[0] || "Desconhecido",
    exerciseType: ex.exerciseType || "Desconhecido",
    instructions: ex.instructions || [],
    imageUrl: ex.imageUrl || "",
    videoUrl: ex.videoUrl || "",
  }));
}
export async function getExerciseById(exerciseId: string): Promise<Exercise> {
  const res = await fetch(`${BASE_URL}/exercises/${exerciseId}`);

  if (!res.ok) throw new Error("Erro ao buscar exercício por ID");

  const ex = (await res.json()).data;

  return {
    exerciseId: ex.exerciseId,
    name: ex.name,
    bodyPart: ex.bodyParts?.[0] || "Desconhecido",
    targetMuscles: ex.targetMuscles || [],
    secondaryMuscles: ex.secondaryMuscles || [],
    equipment: ex.equipments?.[0] || "Desconhecido",
    exerciseType: ex.exerciseType || "Desconhecido",
    instructions: ex.instructions || [],
    imageUrl: ex.imageUrl || "",
    videoUrl: ex.videoUrl || "",
  };
}
