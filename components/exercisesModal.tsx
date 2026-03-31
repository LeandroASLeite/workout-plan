"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getBodyPart,
  getEquipments,
  getExerciseByMuscle,
  getExerciseByEquipment,
  getExerciseByBodyPart,
  getNextPage,
} from "@/services/exerciseApi.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";

type TabType = "muscle" | "bodyPart" | "equipment";

type CategoryItem = {
  name: string;
};

type Props = {
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  addedExercises: Exercise[];
};

const fixedMuscles: CategoryItem[] = [
  "pectorals",
  "lats",
  "quads",
  "glutes",
  "abs",
  "deltoids",
  "biceps",
  "triceps",
  "hamstrings",
  "calves",
].map((m) => ({ name: m }));

// ========================
// RETRY COM BACKOFF
// ========================
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 800,
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const isTooMany = err?.response?.status === 429;

    if (retries > 0 && isTooMany) {
      await new Promise((res) => setTimeout(res, delay));
      return fetchWithRetry(fn, retries - 1, delay * 2);
    }

    throw err;
  }
}

export default function ExercisesModal({
  onClose,
  onSelectExercise,
  addedExercises = [],
}: Props) {
  const [bodyParts, setBodyParts] = useState<CategoryItem[]>([]);
  const [equipments, setEquipments] = useState<CategoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("muscle");

  const [selectedFilter, setSelectedFilter] = useState<{
    name: string;
    category: TabType;
  } | null>(null);

  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // ========================
  // LOAD CATEGORIAS
  // ========================
  useEffect(() => {
    async function load() {
      try {
        const [bpRes, eqRes] = await Promise.all([
          fetchWithRetry(() => getBodyPart()),
          fetchWithRetry(() => getEquipments()),
        ]);

        setBodyParts(bpRes.data || []);
        setEquipments(eqRes.data || []);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
      }
    }

    load();
  }, []);

  // ========================
  // FETCH EXERCÍCIOS
  // ========================
  const fetchExercises = async (name: string, category: TabType) => {
    if (loading) return;

    setLoading(true);

    try {
      let res;

      if (category === "muscle") {
        res = await fetchWithRetry(() => getExerciseByMuscle(name));
      }

      if (category === "equipment") {
        res = await fetchWithRetry(() => getExerciseByEquipment(name));
      }

      if (category === "bodyPart") {
        res = await fetchWithRetry(() => getExerciseByBodyPart(name));
      }

      if (res?.data) {
        setAllExercises(res.data);
        setNextPage(res.metadata?.nextPage || null);
      } else {
        setAllExercises([]);
        setNextPage(null);
      }
    } catch (err) {
      console.error("Erro ao buscar exercícios:", err);
      setAllExercises([]);
      setNextPage(null);
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // LOAD MORE
  // ========================
  const loadMore = async () => {
    if (!nextPage || loadingMore) return;

    setLoadingMore(true);

    try {
      const res = await fetchWithRetry(() => getNextPage(nextPage));

      if (res?.data) {
        setAllExercises((prev) => [...prev, ...res.data]);
        setNextPage(res.metadata?.nextPage || null);
      }
    } catch (err) {
      console.error("Erro ao carregar mais:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // ========================
  // SELECT FILTER (ANTI-SPAM)
  // ========================
  const handleSelect = (name: string, category: TabType) => {
    if (loading || loadingMore) return;

    setSelectedFilter({ name, category });
    setAllExercises([]);
    setNextPage(null);

    fetchExercises(name, category);
  };

  // ========================
  // FILTRO LOCAL
  // ========================
  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) return allExercises;

    const q = searchQuery.toLowerCase();

    return allExercises.filter(
      (ex) =>
        ex.name.toLowerCase().includes(q) ||
        ex.targetMuscles?.some((m) => m.toLowerCase().includes(q)) ||
        ex.equipments?.some((e) => e.toLowerCase().includes(q)),
    );
  }, [allExercises, searchQuery]);

  const getCategoryItems = (): CategoryItem[] => {
    switch (activeTab) {
      case "bodyPart":
        return bodyParts;
      case "equipment":
        return equipments;
      case "muscle":
        return fixedMuscles;
      default:
        return [];
    }
  };

  // ========================
  // UI
  // ========================
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-16 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-background w-full max-w-6xl rounded-lg shadow-lg p-6 pt-20 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={onClose}
          variant="ghost"
          className="absolute top-4 right-4"
        >
          <X className="w-5 h-5" />
        </Button>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabType)}
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="muscle">Músculos</TabsTrigger>
            <TabsTrigger value="bodyPart">Partes do Corpo</TabsTrigger>
            <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="flex flex-wrap gap-2 my-4">
              {getCategoryItems().map((item) => (
                <Button
                  key={`${item.name}-${activeTab}`}
                  size="sm"
                  variant={
                    selectedFilter?.name === item.name ? "default" : "outline"
                  }
                  onClick={() => handleSelect(item.name, activeTab)}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="max-h-[65vh] overflow-auto">
          {loading && (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin" />
            </div>
          )}

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map((exercise) => {
              const isAdded = addedExercises.some(
                (ex) => ex.exerciseId === exercise.exerciseId,
              );

              return (
                <Card key={exercise.exerciseId}>
                  {exercise.gifUrl && (
                    <img src={exercise.gifUrl} alt={exercise.name} />
                  )}

                  <CardHeader>
                    <CardTitle>{exercise.name}</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => onSelectExercise(exercise)}
                      disabled={isAdded}
                    >
                      {isAdded ? "Adicionado" : "Adicionar"}
                    </Button>
                  </CardHeader>

                  <CardContent className="flex flex-wrap gap-1">
                    {exercise.targetMuscles?.map((m) => (
                      <Badge key={m}>{m}</Badge>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {nextPage && (
            <div className="flex justify-center mt-6">
              <Button onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Carregando..." : "Carregar mais"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
