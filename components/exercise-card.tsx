// "use client";

import Image from "next/image";

// ==========================
// Tipos
// ==========================
export interface ExerciseDetail {
  exerciseId: string;
  name: string;
  imageUrl?: string;
  videoUrl?: string;
  bodyPart?: string;
  equipment?: string;
  targetMuscles?: string[];
}

// ==========================
// Componente do Card
// ==========================
interface ExerciseCardProps {
  exercise: ExerciseDetail;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <div className="border rounded shadow p-2">
      <div className="relative h-64 w-full bg-gray-200">
        {exercise.videoUrl && exercise.videoUrl !== "string" ? (
          <video
            src={exercise.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : exercise.imageUrl ? (
          <Image
            src={exercise.imageUrl}
            alt={exercise.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <span>Mídia não disponível</span>
          </div>
        )}
      </div>

      <h3 className="mt-2 font-bold line-clamp-2">{exercise.name}</h3>
      <p className="text-sm text-gray-600">
        {exercise.bodyPart || "Desconhecido"} |{" "}
        {exercise.equipment || "Desconhecido"}
      </p>
    </div>
  );
}
