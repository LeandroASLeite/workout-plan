type Exercise = {
  id: string;
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
};

type PartialExercise = {
  id: string;
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  equipments: string[];
};
