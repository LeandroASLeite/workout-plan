export interface Exercise {
  exerciseId: string;
  name: string;
  bodyPart: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  exerciseType: string;
  instructions?: string[];
  imageUrl?: string;
  videoUrl?: string;
}
