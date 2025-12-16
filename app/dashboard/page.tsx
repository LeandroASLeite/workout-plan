"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/services/firebase";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import ExercisesModal from "@/components/exercisesModal";
import { doc, getDoc, setDoc } from "firebase/firestore";

type Exercise = {
  id: string;
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  equipments: string[];
};

const daysOfWeek = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState("Segunda");
  const [groupExercises, setGroupExercises] = useState<{
    [day: string]: Exercise[];
  }>({});
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setUserName(snap.data().name);

        // Carregar exercícios do Firestore
        const exercisesRef = doc(db, "userExercises", user.uid);
        const exercisesSnap = await getDoc(exercisesRef);
        if (exercisesSnap.exists()) {
          setGroupExercises(exercisesSnap.data() as any);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleAddExercise = async (exercise: Exercise) => {
    setGroupExercises((prev) => {
      const dayList = prev[activeDay] || [];
      if (dayList.some((ex) => ex.exerciseId === exercise.exerciseId))
        return prev;
      return { ...prev, [activeDay]: [...dayList, exercise] };
    });

    // Salvar no Firestore
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const ref = doc(db, "userExercises", uid);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    const updatedData = {
      ...data,
      [activeDay]: data[activeDay]
        ? [...data[activeDay], exercise]
        : [exercise],
    };
    await setDoc(ref, updatedData);

    setModalOpen(false);
  };

  if (loading) {
    return (
      <main className="p-8">
        <h1 className="text-xl">Carregando...</h1>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Bem-vindo, {userName} 👋</h1>
      <p className="mt-2 text-muted-foreground">
        Aqui ficará seu painel de treinos.
      </p>

      {/* Tabs dos dias da semana */}
      <div className="mt-6">
        <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
          <TabsList className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day) => (
              <TabsTrigger key={day} value={day} className="text-xs sm:text-sm">
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeDay} className="mt-4 space-y-4">
            {/* Botão Adicionar exercício */}
            <Button onClick={() => setModalOpen(true)} className="w-full">
              Adicionar Exercício
            </Button>

            {/* Lista de exercícios adicionados */}
            {groupExercises[activeDay]?.length > 0 ? (
              groupExercises[activeDay].map((ex) => (
                <Card
                  key={ex.exerciseId}
                  className="flex flex-col hover:shadow-lg transition-shadow"
                >
                  {ex.gifUrl && (
                    <div className="relative w-full overflow-hidden h-40 sm:h-48 bg-muted">
                      <img
                        src={ex.gifUrl}
                        alt={ex.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="flex justify-between items-center pb-2">
                    <CardTitle className="text-lg">{ex.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-2">
                    {ex.targetMuscles?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          Músculos Alvo:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {ex.targetMuscles.map((m) => (
                            <span
                              key={m}
                              className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {ex.secondaryMuscles?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          Músculos Secundários:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {ex.secondaryMuscles.map((m) => (
                            <span
                              key={m}
                              className="bg-secondary/20 text-secondary text-xs px-2 py-0.5 rounded"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {ex.equipments?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          Equipamentos:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {ex.equipments.map((e) => (
                            <span
                              key={e}
                              className="bg-muted/50 text-muted-foreground text-xs px-2 py-0.5 rounded"
                            >
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center flex flex-col items-center gap-4">
                  <Dumbbell className="w-12 h-12 text-muted-foreground opacity-50" />
                  <p className="text-lg font-medium">
                    Nenhum exercício adicionado
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ExercisesModal
          onClose={() => setModalOpen(false)}
          onSelectExercise={handleAddExercise}
          addedExercises={groupExercises[activeDay]}
        />
      )}
    </main>
  );
}
