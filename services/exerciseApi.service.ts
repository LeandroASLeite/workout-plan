const API_URL = "https://www.exercisedb.dev/api/v1";

/**
 * Garante que nenhuma request seja feita via HTTP
 * (a API às vezes devolve nextPage em http)
 */
function normalizeUrl(url: string) {
  return url.startsWith("http://") ? url.replace("http://", "https://") : url;
}

async function safeFetch(url: string) {
  const res = await fetch(normalizeUrl(url));

  if (!res.ok) {
    throw new Error("Erro ao buscar exercícios.");
  }

  return res.json();
}

// ========================
// CATEGORIAS
// ========================

export async function getBodyPart() {
  return safeFetch(`${API_URL}/bodyparts`);
}

export async function getMuscles() {
  return safeFetch(`${API_URL}/muscles`);
}

export async function getEquipments() {
  return safeFetch(`${API_URL}/equipments`);
}

// ========================
// EXERCÍCIOS POR FILTRO
// ========================

export async function getExerciseByMuscle(muscleName: string) {
  return safeFetch(`${API_URL}/muscles/${muscleName}/exercises`);
}

export async function getExerciseByEquipment(equipmentName: string) {
  return safeFetch(`${API_URL}/equipments/${equipmentName}/exercises`);
}

export async function getExerciseByBodyPart(bodyPartName: string) {
  return safeFetch(`${API_URL}/bodyparts/${bodyPartName}/exercises`);
}

// ========================
// EXERCÍCIO POR ID
// ========================

export async function getExerciseById(exerciseId: string) {
  return safeFetch(`${API_URL}/exercises/${exerciseId}`);
}

// ========================
// PAGINAÇÃO (nextPage)
// ========================

/**
 * Usar SOMENTE para metadata.nextPage
 */
export async function getNextPage(nextPageUrl: string) {
  return safeFetch(nextPageUrl);
}
