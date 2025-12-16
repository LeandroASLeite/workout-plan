"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  getBodyPart,
  getMuscles,
  getEquipments,
  getExerciseByMuscle,
  getExerciseByEquipment,
  getExerciseByBodyPart,
} from "@/services/exerciseApi.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, X } from "lucide-react";

type Exercise = {
  id: string;
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  equipments: string[];
  bodyParts: string[];
  instructions: string[];
};

type Props = {
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  addedExercises: Exercise[];
};

const fixedMuscles = [
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
];

export default function ExercisesModal({
  onClose,
  onSelectExercise,
  addedExercises = [],
}: Props) {
  const [bodyParts, setBodyParts] = useState<{ name: string }[]>([]);
  const [equipments, setEquipments] = useState<{ name: string }[]>([]);
  const [activeTab, setActiveTab] = useState<
    "muscle" | "bodyPart" | "equipment"
  >("muscle");
  const [visibleTabs, setVisibleTabs] = useState({
    muscle: false,
    bodyPart: false,
    equipment: false,
  });
  const [selectedFilter, setSelectedFilter] = useState<{
    name: string;
    category: "muscle" | "equipment" | "bodyPart";
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Carregar categorias
  useEffect(() => {
    async function load() {
      try {
        const [bp, ms, eq] = await Promise.all([
          getBodyPart(),
          getMuscles(),
          getEquipments(),
        ]);
        setBodyParts(bp.data || []);
        setEquipments(eq.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInitial(false);
      }
    }
    load();
  }, []);

  // Fetch exercícios
  const fetchExercises = useCallback(
    async (
      name: string,
      category: "muscle" | "equipment" | "bodyPart",
      url?: string
    ) => {
      if (!url) setExercises([]);
      if (url) setLoadingMore(true);
      else setLoadingInitial(true);

      try {
        let res;
        if (!url) {
          if (category === "muscle") res = await getExerciseByMuscle(name);
          if (category === "equipment")
            res = await getExerciseByEquipment(name);
          if (category === "bodyPart") res = await getExerciseByBodyPart(name);
        } else {
          res = await fetch(url).then((r) => r.json());
        }

        if (res?.data) {
          setExercises((prev) => [...prev, ...res.data]);
          setNextPageUrl(res.metadata?.nextPage || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInitial(false);
        setLoadingMore(false);
      }
    },
    []
  );

  const buscarExercicios = (
    name: string,
    category: "muscle" | "equipment" | "bodyPart"
  ) => {
    setSelectedFilter({ name, category });
    fetchExercises(name, category);
  };

  // Infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          nextPageUrl &&
          selectedFilter &&
          !loadingMore
        ) {
          fetchExercises(
            selectedFilter.name,
            selectedFilter.category,
            nextPageUrl
          );
        }
      },
      { rootMargin: "200px" }
    );

    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [nextPageUrl, selectedFilter, fetchExercises, loadingMore]);

  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) return exercises;
    const q = searchQuery.toLowerCase();
    return exercises.filter(
      (ex) =>
        ex.name.toLowerCase().includes(q) ||
        ex.targetMuscles?.some((m) => m.toLowerCase().includes(q)) ||
        ex.equipments?.some((e) => e.toLowerCase().includes(q))
    );
  }, [exercises, searchQuery]);

  const getCategoryItems = () => {
    switch (activeTab) {
      case "bodyPart":
        return bodyParts;
      case "equipment":
        return equipments;
      case "muscle":
        return fixedMuscles.map((name) => ({ name }));
      default:
        return [];
    }
  };

  const toggleVisibleTab = (tab: string) =>
    setVisibleTabs((prev) => ({ ...prev, [tab]: !prev[tab] }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-16 overflow-auto">
      <div className="bg-background w-full max-w-5xl rounded-lg shadow-lg p-6 relative">
        <div className=" mb-8">
          <Button
            onClick={onClose}
            variant="ghost"
            className="absolute top-4 right-4"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="muscle">Músculos</TabsTrigger>
            <TabsTrigger value="bodyPart">Partes do Corpo</TabsTrigger>
            <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Button
              onClick={() => toggleVisibleTab(activeTab)}
              variant="outline"
              className="w-full mb-2"
            >
              {visibleTabs[activeTab] ? "Ocultar opções" : "Mostrar opções"}
            </Button>
            {visibleTabs[activeTab] && (
              <div className="flex flex-wrap gap-2">
                {getCategoryItems().map((item) => (
                  <Button
                    key={item.name}
                    size="sm"
                    variant={
                      selectedFilter?.name === item.name &&
                      selectedFilter?.category === activeTab
                        ? "default"
                        : "outline"
                    }
                    onClick={() => buscarExercicios(item.name, activeTab)}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="max-h-[60vh] overflow-auto">
          {loadingInitial && exercises.length === 0 && (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {filteredExercises.length === 0 && !loadingInitial && (
            <p className="text-center text-muted-foreground py-6">
              Nenhum exercício encontrado
            </p>
          )}

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map((exercise) => {
              const isAdded = addedExercises?.some(
                (ex) => ex.exerciseId === exercise.exerciseId
              );

              return (
                <Card
                  key={exercise.exerciseId}
                  className="flex flex-col hover:shadow-lg transition-shadow"
                >
                  {exercise.gifUrl && (
                    <div className="relative w-full h-40 sm:h-48 bg-muted overflow-hidden">
                      <img
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="flex justify-between items-center pb-2">
                    <CardTitle className="text-sm sm:text-base line-clamp-2">
                      {exercise.name}
                    </CardTitle>
                    <Button
                      size="sm"
                      onClick={() => onSelectExercise(exercise)}
                      disabled={isAdded}
                    >
                      {isAdded ? "Adicionado" : "Adicionar"}
                    </Button>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-1">
                    {exercise.targetMuscles?.map((m) => (
                      <Badge key={m} className="text-xs">
                        {m}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {loadingMore && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}

          <div ref={loadMoreRef} />
        </div>
      </div>
    </div>
  );
}
