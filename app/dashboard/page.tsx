"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/services/firebase";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, LogOut } from "lucide-react";
import ExercisesModal from "@/components/exercisesModal";
import ConfirmationModal from "@/components/confirmationModal";
import { doc, getDoc, setDoc } from "firebase/firestore";

const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState("Segunda");
  const [groupExercises, setGroupExercises] = useState<{
    [day: string]: Exercise[];
  }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const router = useRouter();

  // Carregar usuário e exercícios
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) setUserName(userSnap.data().name);

        const exercisesSnap = await getDoc(doc(db, "userExercises", user.uid));
        if (exercisesSnap.exists())
          setGroupExercises(exercisesSnap.data() as any);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // Adicionar exercício
  const handleAddExercise = async (exercise: Exercise) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    setGroupExercises((prev) => {
      const dayList = prev[activeDay] || [];
      if (dayList.some((ex) => ex.exerciseId === exercise.exerciseId))
        return prev;
      return { ...prev, [activeDay]: [...dayList, exercise] };
    });

    const ref = doc(db, "userExercises", uid);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    await setDoc(ref, {
      ...data,
      [activeDay]: data[activeDay]
        ? [...data[activeDay], exercise]
        : [exercise],
    });

    setModalOpen(false);
  };

  const requestRemoveExercise = (exerciseId: string) => {
    setConfirmAction(() => () => handleRemoveExercise(exerciseId));
    setConfirmOpen(true);
  };

  const handleRemoveExercise = async (exerciseId: string) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    setGroupExercises((prev) => {
      const dayList = prev[activeDay] || [];
      return {
        ...prev,
        [activeDay]: dayList.filter((ex) => ex.exerciseId !== exerciseId),
      };
    });

    const ref = doc(db, "userExercises", uid);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    await setDoc(ref, {
      ...data,
      [activeDay]: (data[activeDay] || []).filter(
        (ex: any) => ex.exerciseId !== exerciseId
      ),
    });
  };

  // Logout com confirmação
  const requestLogout = () => {
    setConfirmAction(() => handleLogout);
    setConfirmOpen(true);
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="p-8">
        <h1 className="text-xl">Carregando...</h1>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-8">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bem-vindo,</h1>
          <h2 className="text-2xl font-semibold">{userName}</h2>
        </div>
        <Button
          variant="outline"
          onClick={requestLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      <div className="mt-6">
        <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
          <TabsList className="w-full bg-gray-100 grid grid-cols-6 text-center text-xs sm:text-sm  border-b border-muted/50 h-full">
            {daysOfWeek.map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="w-full py-2 sm:py-3 text-sm sm:text-base"
              >
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeDay} className="mt-4 space-y-4">
            <Button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto mb-4"
            >
              Adicionar Exercício
            </Button>

            {/* Lista de exercícios */}
            {groupExercises[activeDay]?.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {groupExercises[activeDay].map((ex) => (
                  <Card
                    key={ex.exerciseId}
                    className="flex flex-col hover:shadow-lg transition-shadow relative"
                  >
                    {/* Imagem */}
                    {ex.gifUrl && (
                      <div className="relative w-full h-48 sm:h-56 bg-muted overflow-hidden">
                        <img
                          src={ex.gifUrl}
                          alt={ex.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    {/* Botão de remover exercício */}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => requestRemoveExercise(ex.exerciseId)}
                    >
                      X
                    </Button>

                    <CardHeader className="flex justify-between items-center pb-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {ex.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-2">
                      {/* Músculos alvo */}
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

                      {/* Músculos secundários */}
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

                      {/* Equipamentos */}
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
                ))}
              </div>
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

      {/* Modais */}
      {modalOpen && (
        <ExercisesModal
          onClose={() => setModalOpen(false)}
          onSelectExercise={handleAddExercise}
          addedExercises={groupExercises[activeDay]}
        />
      )}

      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmAction}
      />
    </main>
  );
}
