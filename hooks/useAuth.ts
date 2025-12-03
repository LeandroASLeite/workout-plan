// src/hooks/useAuth.ts

"use client";

import { useEffect, useState } from "react";
import { listenAuthChanges } from "@/services/auth.service";
import { User } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { user, loading, isLogged: !!user };
}
