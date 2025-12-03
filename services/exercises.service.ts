// src/services/exercises.service.ts
const BASE_URL = "https://www.exercisedb.dev/api/v1";

export async function searchExercises(query: string, limit = 10, offset = 0) {
  const res = await fetch(
    `${BASE_URL}/exercises/search?q=${encodeURIComponent(
      query
    )}&limit=${limit}&offset=${offset}&threshold=0.3`
  );

  if (!res.ok) throw new Error("Erro ao buscar exercícios");

  const data = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.data.map((ex: any) => ({
    exerciseId: ex.exerciseId,
    name: ex.name,
    gifUrl: ex.gifUrl,
    bodyPart: ex.bodyParts[0] || "Desconhecido",
    targetMuscles: ex.targetMuscles || [],
    equipment: ex.equipments[0] || "Desconhecido",
  }));
}
