const API_URL = "https://www.exercisedb.dev/api/v1";

export async function getBodyPart() {
  const res = await fetch(`${API_URL}/bodyparts`);
  if (!res.ok) throw new Error("Erro ao buscar exercícios.");
  return res.json();
  // {
  //       "name": "neck"
  //     },
}

export async function getMuscles() {
  const res = await fetch(`${API_URL}/muscles`);
  if (!res.ok) throw new Error("Erro ao buscar exercícios.");
  return res.json();
  //  {
  //     "name": "shins"
  //   },
}

export async function getEquipments() {
  const res = await fetch(`${API_URL}/equipments`);
  if (!res.ok) throw new Error("Erro ao buscar exercícios.");
  return res.json();
  //  {
  //     "name": "stepmill machine"
  //   },
}

export async function getExerciseByMuscle(muscleName: string) {
  const res = await fetch(`${API_URL}/muscles/${muscleName}/exercises`);
  if (!res.ok) throw new Error("Erro ao buscar exercícios.");
  return res.json();
  //  {
  //       "exerciseId": "wnEscH8",
  //       "name": "barbell press sit-up",
  //       "gifUrl": "https://static.exercisedb.dev/media/wnEscH8.gif",
  //       "targetMuscles": [
  //         "abs"
  //       ],
  //       "bodyParts": [
  //         "waist"
  //       ],
  //       "equipments": [
  //         "barbell"
  //       ],
  //       "secondaryMuscles": [
  //         "shoulders",
  //         "chest"
  //       ],
  //       "instructions": [
  //         "Step:1 Lie flat on your back on a mat with your knees bent and feet flat on the ground.",
  //         "Step:2 Hold the barbell with an overhand grip, resting it on your chest.",
  //         "Step:3 Engaging your abs, slowly lift your upper body off the ground, curling forward until your torso is at a 45-degree angle.",
  //         "Step:4 Pause for a moment at the top, then slowly lower your upper body back down to the starting position.",
  //         "Step:5 Repeat for the desired number of repetitions."
  //       ]
  //     },
}

export async function getExerciseByEquipment(equipmentName: string) {
  const res = await fetch(`${API_URL}/equipments/${equipmentName}/exercises`);
  if (!res.ok) throw new Error("Erro ao buscar exercícios.");
  return res.json();
  // {
  //     "exerciseId": "ecl28tP",
  //     "name": "dumbbell contralateral forward lunge",
  //     "gifUrl": "https://static.exercisedb.dev/media/ecl28tP.gif",
  //     "targetMuscles": [
  //       "glutes"
  //     ],
  //     "bodyParts": [
  //       "upper legs"
  //     ],
  //     "equipments": [
  //       "dumbbell"
  //     ],
  //     "secondaryMuscles": [
  //       "quadriceps",
  //       "hamstrings",
  //       "calves"
  //     ],
  //     "instructions": [
  //       "Step:1 Stand with your feet shoulder-width apart, holding a dumbbell in each hand.",
  //       "Step:2 Take a step forward with your right foot, keeping your back straight and core engaged.",
  //       "Step:3 Lower your body by bending both knees until your right thigh is parallel to the ground.",
  //       "Step:4 Push through your right heel to return to the starting position.",
  //       "Step:5 Repeat with your left leg.",
  //       "Step:6 Alternate legs for the desired number of repetitions."
  //     ]
  //   },
}

export async function getExerciseByBodyPart(bodyPartName: string) {
  const res = await fetch(`${API_URL}/bodyparts/${bodyPartName}/exercises`);
  if (!res.ok) throw new Error("Erro ao buscar exercícios.");
  return res.json();
  //   {
  //   "exerciseId": "LMGXZn8",
  //   "name": "barbell decline close grip to skull press",
  //   "gifUrl": "https://static.exercisedb.dev/media/LMGXZn8.gif",
  //   "targetMuscles": [
  //     "triceps"
  //   ],
  //   "bodyParts": [
  //     "upper arms"
  //   ],
  //   "equipments": [
  //     "barbell"
  //   ],
  //   "secondaryMuscles": [
  //     "chest",
  //     "shoulders"
  //   ],
  //   "instructions": [
  //     "Step:1 Lie on a decline bench with your head lower than your feet and hold a barbell with a close grip.",
  //     "Step:2 Lower the barbell towards your forehead by bending your elbows, keeping your upper arms stationary.",
  //     "Step:3 Pause for a moment, then extend your arms to press the barbell back up to the starting position.",
  //     "Step:4 Repeat for the desired number of repetitions."
  //   ]
  // },
}

export async function getExerciseById(exerciseId: string) {
  const res = await fetch(`${API_URL}/exercises/${exerciseId}`);
  if (!res.ok) throw new Error("Erro ao buscar exercícios.");
  return res.json();
  //   {
  //     "exerciseId": "ztAa1RK",
  //     "name": "band alternating v-up",
  //     "gifUrl": "https://static.exercisedb.dev/media/ztAa1RK.gif",
  //     "targetMuscles": [
  //       "abs"
  //     ],
  //     "bodyParts": [
  //       "waist"
  //     ],
  //     "equipments": [
  //       "band"
  //     ],
  //     "secondaryMuscles": [
  //       "hip flexors"
  //     ],
  //     "instructions": [
  //       "Step:1 Lie flat on your back with your legs straight and your arms extended overhead, holding the band.",
  //       "Step:2 Engage your abs and lift your legs and upper body off the ground simultaneously, reaching your hands towards your toes.",
  //       "Step:3 As you lower your legs and upper body back down, switch the position of your legs, crossing one over the other.",
  //       "Step:4 Repeat the movement, alternating the position of your legs with each repetition.",
  //       "Step:5 Continue for the desired number of repetitions."
  //     ]
  //   }
  // }
}
