"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("[DEBUG] Dashboard montou");

    console.log("[DEBUG] auth.currentUser inicial:", auth.currentUser);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("[DEBUG] onAuthStateChanged disparou. USER:", user);

      if (!user) {
        console.log("[DEBUG] Nenhum usuário logado → redirecionando...");
        router.push("/login");
        return;
      }

      console.log("[DEBUG] Usuário encontrado:", user.uid);

      // Buscar Firestore
      try {
        console.log("[DEBUG] Buscando usuário no Firestore...");

        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        console.log("[DEBUG] Resultado Firestore:", snap.exists(), snap.data());

        if (snap.exists()) {
          setUserName(snap.data().name);
        } else {
          console.log("[DEBUG] Documento do usuário NÃO existe no Firestore");
        }
      } catch (err) {
        console.log("[DEBUG] ERRO FIRESTORE:", err);
      }

      setLoading(false);
    });

    return () => {
      console.log("[DEBUG] Limpando listener onAuthStateChanged");
      unsubscribe();
    };
  }, []);

  if (loading) {
    console.log("[DEBUG] Renderizando: Carregando...");
    return (
      <main className="p-8">
        <h1 className="text-xl">Carregando...</h1>
      </main>
    );
  }

  console.log("[DEBUG] Renderizando Dashboard FINAL com nome:", userName);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Bem-vindo, {userName} 👋</h1>

      <p className="mt-2 text-muted-foreground">
        Aqui ficará seu painel de treinos.
      </p>

      <div className="mt-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Seu treino de hoje</h2>
        <p>Ainda não há treinos cadastrados.</p>
      </div>
    </main>
  );
}
