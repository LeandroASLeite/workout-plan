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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Dumbbell } from "lucide-react";

// ========================
// RETRY COM BACKOFF (MESMO DO MODAL)
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

export default function ExercisesPage() {
  const [bodyParts, setBodyParts] = useState<Array<{ name: string }>>([]);
  const [equipments, setEquipments] = useState<Array<{ name: string }>>([]);

  const [activeTab, setActiveTab] = useState("muscle");
  const [visibleTabs, setVisibleTabs] = useState<any>({});

  const [selectedFilter, setSelectedFilter] = useState<{
    name: string;
    category: "muscle" | "equipment" | "bodyPart";
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);

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
        console.error(err);
      }
    }

    load();
  }, []);

  // ========================
  // FETCH EXERCÍCIOS
  // ========================
  const fetchExercises = async (
    name: string,
    category: "muscle" | "equipment" | "bodyPart",
  ) => {
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
        setExercises(res.data);
        setNextPage(res.metadata?.nextPage || null);
      } else {
        setExercises([]);
        setNextPage(null);
      }
    } catch (err) {
      console.error(err);
      setExercises([]);
      setNextPage(null);
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // LOAD MORE (MESMO PADRÃO)
  // ========================
  const loadMore = async () => {
    if (!nextPage || loadingMore) return;

    setLoadingMore(true);

    try {
      const res = await fetchWithRetry(() => getNextPage(nextPage));

      if (res?.data) {
        setExercises((prev) => [...prev, ...res.data]);
        setNextPage(res.metadata?.nextPage || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  // ========================
  // SELECT (ANTI-SPAM)
  // ========================
  const buscarExercicios = (
    name: string,
    category: "muscle" | "equipment" | "bodyPart",
  ) => {
    if (loading || loadingMore) return;

    setSelectedFilter({ name, category });
    setExercises([]);
    setNextPage(null);

    fetchExercises(name, category);
  };

  // ========================
  // FILTRO LOCAL
  // ========================
  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) return exercises;

    const q = searchQuery.toLowerCase();

    return exercises.filter(
      (ex) =>
        ex.name.toLowerCase().includes(q) ||
        ex.targetMuscles?.some((m) => m.toLowerCase().includes(q)) ||
        ex.equipments?.some((e) => e.toLowerCase().includes(q)),
    );
  }, [exercises, searchQuery]);

  const getCategoryItems = () => {
    if (activeTab === "muscle") {
      return fixedMuscles.map((name) => ({ name }));
    }
    if (activeTab === "bodyPart") return bodyParts;
    if (activeTab === "equipment") return equipments;
    return [];
  };

  const toggleVisibleTab = (tab: string) =>
    setVisibleTabs((prev: any) => ({
      ...prev,
      [tab]: !prev[tab],
    }));

  // ========================
  // UI
  // ========================
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Dumbbell className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Explorar Exercícios</h1>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-4 h-4" />
          <Input
            className="pl-10"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="muscle">Músculos</TabsTrigger>
            <TabsTrigger value="bodyPart">Corpo</TabsTrigger>
            <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Button onClick={() => toggleVisibleTab(activeTab)}>
              Mostrar opções
            </Button>

            {visibleTabs[activeTab] && (
              <div className="flex flex-wrap gap-2 mt-4">
                {getCategoryItems().map((item) => (
                  <Button
                    key={`${item.name}-${activeTab}`}
                    size="sm"
                    variant={
                      selectedFilter?.name === item.name ? "default" : "outline"
                    }
                    onClick={() =>
                      buscarExercicios(item.name, activeTab as any)
                    }
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {loading && (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin" />
          </div>
        )}

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {filteredExercises.map((ex) => (
            <Card key={ex.exerciseId}>
              {ex.gifUrl && <img src={ex.gifUrl} alt={ex.name} />}
              <CardHeader>
                <CardTitle>{ex.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1">
                {ex.targetMuscles?.map((m) => (
                  <Badge key={m}>{m}</Badge>
                ))}
              </CardContent>
            </Card>
          ))}
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
  );
}
