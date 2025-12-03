"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ExerciseSearch from "@/components/exercise-search";
import ExerciseCard from "@/components/exercise-card";

interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  bodyPart: string;
  target: string;
  equipment: string;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setExercises([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/exercises/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setExercises(Array.isArray(data) ? data : []);
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
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Workout Plan
            </Link>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
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
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="mb-2 text-lg font-semibold text-foreground">
                Nenhum exercício encontrado
              </p>
              <p className="text-muted-foreground">
                Tente uma busca diferente ou verifique a ortografia.
              </p>
            </div>
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
              {exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </>
        )}

        {!hasSearched && exercises.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="mb-2 text-lg font-semibold text-foreground">
                Comece sua busca
              </p>
              <p className="text-muted-foreground">
                Use a barra de pesquisa acima para encontrar exercícios.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
