"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ExerciseSearch from "@/components/exercise-search";
import ExerciseCard, { ExerciseDetail } from "@/components/exercise-card";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<ExerciseDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  //   const handleSearch = async (query: string) => {
  //     if (!query.trim()) {
  //       setExercises([]);
  //       setHasSearched(false);
  //       return;
  //     }

  //     setIsLoading(true);
  //     setHasSearched(true);

  //     try {
  //       // 1. Buscar lista de exercícios
  //       const res = await fetch(
  //         `https://v2.exercisedb.dev/api/v1/exercises/search?search=${query}&limit=10`
  //       );
  //       const listData = await res.json();
  //       const list = Array.isArray(listData.data) ? listData.data : [];

  //       // 2. Buscar detalhes de cada exercício (videoUrl, etc)
  //       const detailed: ExerciseDetail[] = await Promise.all(
  //         list.map(async (ex: any) => {
  //           try {
  //             const detailRes = await fetch(
  //               `https://v2.exercisedb.dev/api/v1/exercises/${ex.exerciseId}`
  //             );
  //             const detailData = await detailRes.json();

  //             return {
  //               exerciseId: ex.exerciseId,
  //               name: ex.name,
  //               imageUrl: detailData.data.imageUrl || ex.imageUrl,
  //               videoUrl: detailData.data.videoUrl,
  //               bodyPart: detailData.data.bodyParts?.[0],
  //               equipment: detailData.data.equipments?.[0],
  //               targetMuscles: detailData.data.targetMuscles,
  //             };
  //           } catch {
  //             // fallback se não conseguir pegar detalhes
  //             return {
  //               exerciseId: ex.exerciseId,
  //               name: ex.name,
  //               imageUrl: ex.imageUrl,
  //             };
  //           }
  //         })
  //       );

  //       setExercises(detailed);
  //     } catch (error) {
  //       console.error("Erro ao buscar exercícios:", error);
  //       setExercises([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setExercises([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // 1. Buscar lista completa
      const res = await fetch(
        `https://v2.exercisedb.dev/api/v1/exercises/search?search=${query}&limit=50`
      );
      const listData = await res.json();
      const list = Array.isArray(listData.data) ? listData.data : [];

      // 2. Criar array de exercícios
      const exercisesWithMedia: ExerciseDetail[] = await Promise.all(
        list.map(async (ex: any) => {
          // Faz request de detalhe **só se quiser verificar vídeo**
          try {
            const detailRes = await fetch(
              `https://v2.exercisedb.dev/api/v1/exercises/${ex.exerciseId}`
            );
            const detailData = await detailRes.json();

            return {
              exerciseId: ex.exerciseId,
              name: ex.name,
              imageUrl: detailData.data.imageUrl || ex.imageUrl,
              videoUrl:
                detailData.data.videoUrl &&
                detailData.data.videoUrl !== "string"
                  ? detailData.data.videoUrl
                  : undefined,
              bodyPart: detailData.data.bodyParts?.[0],
              equipment: detailData.data.equipments?.[0],
              targetMuscles: detailData.data.targetMuscles,
            };
          } catch {
            // fallback só com imagem
            return {
              exerciseId: ex.exerciseId,
              name: ex.name,
              imageUrl: ex.imageUrl,
            };
          }
        })
      );

      setExercises(exercisesWithMedia);
    } catch (error) {
      console.error("Erro ao buscar exercícios:", error);
      setExercises([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-foreground">
            Workout Plan
          </Link>
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      </header>

      {/* Search Section */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Pesquise Exercícios
          </h1>
          <p className="mb-8 text-muted-foreground">
            Digite o nome de um exercício para encontrar vídeos, instruções e
            detalhes completos.
          </p>
          <ExerciseSearch onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </section>

      {/* Results Section */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
              <p className="text-muted-foreground">Buscando exercícios...</p>
            </div>
          </div>
        )}

        {!isLoading && hasSearched && exercises.length === 0 && (
          <div className="flex items-center justify-center py-12 text-center">
            <p className="mb-2 text-lg font-semibold text-foreground">
              Nenhum exercício encontrado
            </p>
            <p className="text-muted-foreground">
              Tente uma busca diferente ou verifique a ortografia.
            </p>
          </div>
        )}

        {!isLoading && exercises.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {exercises.length}{" "}
                {exercises.length === 1
                  ? "exercício encontrado"
                  : "exercícios encontrados"}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {exercises.map((ex) => (
                <ExerciseCard key={ex.exerciseId} exercise={ex} />
              ))}
            </div>
          </>
        )}

        {!hasSearched && exercises.length === 0 && (
          <div className="flex items-center justify-center py-12 text-center">
            <p className="mb-2 text-lg font-semibold text-foreground">
              Comece sua busca
            </p>
            <p className="text-muted-foreground">
              Use a barra de pesquisa acima para encontrar exercícios.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
