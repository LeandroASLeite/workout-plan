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

  // ========================
  // LOAD USER + EXERCISES
  // ========================
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const [userSnap, exercisesSnap] = await Promise.all([
          getDoc(doc(db, "users", user.uid)),
          getDoc(doc(db, "userExercises", user.uid)),
        ]);

        if (userSnap.exists()) {
          setUserName(userSnap.data().name);
        }

        if (exercisesSnap.exists()) {
          setGroupExercises(exercisesSnap.data() as any);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // ========================
  // ADD EXERCISE
  // ========================
  const handleAddExercise = async (exercise: Exercise) => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;

    // 🔥 optimistic update
    setGroupExercises((prev) => {
      const dayList = prev[activeDay] || [];

      if (dayList.some((ex) => ex.exerciseId === exercise.exerciseId)) {
        return prev;
      }

      return {
        ...prev,
        [activeDay]: [...dayList, exercise],
      };
    });

    try {
      const ref = doc(db, "userExercises", uid);
      const snap = await getDoc(ref);

      const data = snap.exists() ? snap.data() : {};
      const currentList = data[activeDay] || [];

      // 🔒 evita duplicação no banco
      const alreadyExists = currentList.some(
        (ex: Exercise) => ex.exerciseId === exercise.exerciseId,
      );

      if (alreadyExists) return;

      await setDoc(
        ref,
        {
          ...data,
          [activeDay]: [...currentList, exercise],
        },
        { merge: true },
      );
    } catch (err) {
      console.error("Erro ao salvar exercício:", err);
    } finally {
      setModalOpen(false);
    }
  };

  // ========================
  // REMOVE EXERCISE
  // ========================
  const requestRemoveExercise = (exerciseId: string) => {
    setConfirmAction(() => () => handleRemoveExercise(exerciseId));
    setConfirmOpen(true);
  };

  const handleRemoveExercise = async (exerciseId: string) => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;

    // 🔥 optimistic update
    setGroupExercises((prev) => {
      const dayList = prev[activeDay] || [];

      return {
        ...prev,
        [activeDay]: dayList.filter((ex) => ex.exerciseId !== exerciseId),
      };
    });

    try {
      const ref = doc(db, "userExercises", uid);
      const snap = await getDoc(ref);

      const data = snap.exists() ? snap.data() : {};
      const updatedList = (data[activeDay] || []).filter(
        (ex: Exercise) => ex.exerciseId !== exerciseId,
      );

      await setDoc(
        ref,
        {
          ...data,
          [activeDay]: updatedList,
        },
        { merge: true },
      );
    } catch (err) {
      console.error("Erro ao remover exercício:", err);
    } finally {
      setConfirmOpen(false);
    }
  };

  // ========================
  // LOGOUT
  // ========================
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
        <Tabs value={activeDay} onValueChange={setActiveDay}>
          <TabsList className="w-full grid grid-cols-6">
            {daysOfWeek.map((day) => (
              <TabsTrigger key={day} value={day}>
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeDay} className="mt-4 space-y-4">
            <Button onClick={() => setModalOpen(true)}>
              Adicionar Exercício
            </Button>

            {groupExercises[activeDay]?.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {groupExercises[activeDay].map((ex) => (
                  <Card key={ex.exerciseId} className="relative">
                    {ex.gifUrl && (
                      <img
                        src={ex.gifUrl}
                        alt={ex.name}
                        className="w-full h-48 object-contain"
                      />
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => requestRemoveExercise(ex.exerciseId)}
                    >
                      X
                    </Button>

                    <CardHeader>
                      <CardTitle>{ex.name}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2">
                      {ex.targetMuscles?.map((m) => (
                        <span key={m} className="text-xs">
                          {m}
                        </span>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Dumbbell className="mx-auto mb-2 opacity-50" />
                  Nenhum exercício
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {modalOpen && (
        <ExercisesModal
          onClose={() => setModalOpen(false)}
          onSelectExercise={handleAddExercise}
          addedExercises={groupExercises[activeDay] || []}
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
