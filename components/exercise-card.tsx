"use client";

import Image from "next/image";

interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  bodyPart: string;
  target: string;
  equipment: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const getBadgeColor = (target: string): string => {
    const colors: Record<string, string> = {
      chest: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      back: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      legs: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      shoulders:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      biceps:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      triceps: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      forearms:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      abs: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
    return (
      colors[target.toLowerCase()] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/50">
      {/* GIF Container */}
      <div className="relative h-64 w-full overflow-hidden bg-muted">
        <Image
          src={exercise.gifUrl || "/placeholder.svg"}
          alt={exercise.name}
          fill
          className="object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = "none";
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center bg-muted"
          style={{ display: "none" }}
        >
          <span className="text-sm text-muted-foreground">
            GIF não disponível
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Exercise Name */}
        <h3 className="mb-3 text-lg font-semibold text-foreground capitalize line-clamp-2">
          {exercise.name}
        </h3>

        {/* Details Grid */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Parte do corpo:
            </span>
            <span className="text-sm font-medium text-foreground capitalize">
              {exercise.bodyPart}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Equipamento:</span>
            <span className="text-sm font-medium text-foreground capitalize">
              {exercise.equipment}
            </span>
          </div>
        </div>

        {/* Target Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Alvo:</span>
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${getBadgeColor(
              exercise.target
            )}`}
          >
            {exercise.target}
          </span>
        </div>
      </div>
    </div>
  );
}
