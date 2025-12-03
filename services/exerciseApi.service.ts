const API_URL = "https://exercisedb.dev/api/v1";

// Listar todos os exercícios
export async function getAllExercises() {
  const res = await fetch(`${API_URL}/exercises`);
  if (!res.ok) throw new Error("Erro ao buscar exercícios.");
  return res.json();
}

// Buscar por ID
export async function getExerciseById(id: string) {
  const res = await fetch(`${API_URL}/exercises/${id}`);
  if (!res.ok) throw new Error("Exercício não encontrado.");
  return res.json();
}

// Buscar por parte do corpo
export async function getByBodyPart(bodyPart: string) {
  const res = await fetch(`${API_URL}/exercises/bodyPart/${bodyPart}`);
  if (!res.ok) throw new Error("Erro ao buscar exercícios por grupo muscular.");
  return res.json();
}

// Buscar por nome (search)
export async function searchExercises(query: string) {
  const res = await fetch(`${API_URL}/exercises/name/${query}`);
  if (!res.ok) throw new Error("Erro ao pesquisar exercícios.");
  return res.json();
}
