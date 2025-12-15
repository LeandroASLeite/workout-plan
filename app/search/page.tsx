"use client";

import { useEffect, useState, useMemo } from "react";
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
import { Loader2, Search, Dumbbell } from "lucide-react";

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

export default function ExercisesPage() {
  const [bodyParts, setBodyParts] = useState<Array<{ name: string }>>([]);
  const [muscles, setMuscles] = useState<Array<{ name: string }>>([]);
  const [equipments, setEquipments] = useState<Array<{ name: string }>>([]);

  const [activeTab, setActiveTab] = useState("muscle");
  const [visibleTabs, setVisibleTabs] = useState<{ [k: string]: boolean }>({
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
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Carrega apenas os dados das categorias no início (mantive isso,
  // mas não os exibimos até o usuário clicar em "Mostrar ...").
  useEffect(() => {
    async function load() {
      try {
        const [bp, ms, eq] = await Promise.all([
          getBodyPart(),
          getMuscles(),
          getEquipments(),
        ]);

        setBodyParts(bp.data || []);
        setMuscles(ms.data || []);
        setEquipments(eq.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    }
    load();
  }, []);

  // Busca exercícios ao clicar numa opção
  async function buscarExercicios(
    name: string,
    category: "muscle" | "equipment" | "bodyPart"
  ) {
    setLoading(true);
    setExercises([]);
    setSelectedFilter({ name, category });

    try {
      let res;

      if (category === "muscle") res = await getExerciseByMuscle(name);
      if (category === "equipment") res = await getExerciseByEquipment(name);
      if (category === "bodyPart") res = await getExerciseByBodyPart(name);

      if (res?.data) setExercises(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

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
      default:
        return muscles;
    }
  };

  const toggleVisibleTab = (tab: string) => {
    setVisibleTabs((prev) => ({ ...prev, [tab]: !prev[tab] }));
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* TÍTULO */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Dumbbell className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Explorar Exercícios</h1>
          </div>
          <p className="text-muted-foreground">
            Filtre exercícios por músculo, parte do corpo ou equipamento.
          </p>
        </div>

        {/* BUSCA */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar exercícios por nome, músculo ou equipamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-base"
            />
          </div>
        </div>

        {/* TABS */}
        <div className="mb-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="muscle">Músculos</TabsTrigger>
              <TabsTrigger value="bodyPart">Partes do Corpo</TabsTrigger>
              <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {/* Botão para mostrar/ocultar as opções da tab selecionada */}
              <div className="mb-4">
                <Button
                  onClick={() => toggleVisibleTab(activeTab)}
                  variant="outline"
                  className="w-full"
                >
                  {visibleTabs[activeTab]
                    ? `Ocultar ${
                        activeTab === "muscle"
                          ? "músculos"
                          : activeTab === "bodyPart"
                          ? "partes do corpo"
                          : "equipamentos"
                      }`
                    : `Mostrar ${
                        activeTab === "muscle"
                          ? "músculos"
                          : activeTab === "bodyPart"
                          ? "partes do corpo"
                          : "equipamentos"
                      }`}
                </Button>
              </div>

              {/* Só exibe as opções se o usuário clicou em "Mostrar ..." */}
              {visibleTabs[activeTab] ? (
                <div className="flex flex-wrap gap-2">
                  {getCategoryItems().map((item) => (
                    <Button
                      key={item.name}
                      onClick={() =>
                        buscarExercicios(
                          item.name,
                          activeTab as "muscle" | "equipment" | "bodyPart"
                        )
                      }
                      variant={
                        selectedFilter?.name === item.name &&
                        selectedFilter?.category === activeTab
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="capitalize text-xs sm:text-sm"
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Clique em "Mostrar" para ver as opções.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* RESULTADOS */}
        <div>
          {!selectedFilter && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Dumbbell className="mx-auto w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhum filtro selecionado</p>
                <p className="text-muted-foreground">
                  Clique em "Mostrar" em uma das abas e selecione uma opção.
                </p>
              </CardContent>
            </Card>
          )}

          {loading && (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  Carregando exercícios...
                </p>
              </div>
            </div>
          )}

          {!loading && selectedFilter && filteredExercises.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <p className="text-lg font-medium">
                  Nenhum exercício encontrado
                </p>
                <p className="text-muted-foreground">
                  Tente mudar a opção selecionada ou refinar a busca.
                </p>
              </CardContent>
            </Card>
          )}

          {!loading && filteredExercises.length > 0 && (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {filteredExercises.length} exercício
                {filteredExercises.length !== 1 ? "s" : ""} encontrado
              </p>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredExercises.map((exercise) => (
                  <Card
                    key={exercise.exerciseId}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col"
                  >
                    {exercise.gifUrl && (
                      <div className="relative w-full bg-muted overflow-hidden h-48 sm:h-56">
                        <img
                          src={exercise.gifUrl}
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-2">
                        {exercise.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-3">
                      {/* MÚSCULOS ALVO */}
                      {exercise.targetMuscles?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-2">
                            MÚSCULOS ALVO
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {exercise.targetMuscles.map((muscle) => (
                              <Badge key={muscle} className="text-xs">
                                {muscle}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* MÚSCULOS SECUNDÁRIOS */}
                      {exercise.secondaryMuscles?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-2">
                            MÚSCULOS SECUNDÁRIOS
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {exercise.secondaryMuscles.map((muscle) => (
                              <Badge
                                key={muscle}
                                variant="secondary"
                                className="text-xs"
                              >
                                {muscle}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* EQUIPAMENTOS */}
                      {exercise.equipments?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-2">
                            EQUIPAMENTOS
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {exercise.equipments.map((eq) => (
                              <Badge
                                key={eq}
                                variant="outline"
                                className="text-xs"
                              >
                                {eq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
