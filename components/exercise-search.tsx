"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ExerciseSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function ExerciseSearch({
  onSearch,
  isLoading,
}: ExerciseSearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Digite o nome do exercício (ex: push-ups, squats)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="px-6">
        {isLoading ? "Buscando..." : "Buscar"}
      </Button>
    </form>
  );
}
