"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dumbbell, Smartphone, Video } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center px-4 py-20 md:py-32">
        <div className="w-full max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl text-foreground">
            Monte seus treinos e pesquise exercícios de forma rápida
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Acesse sua ficha de treino de qualquer lugar e explore exercícios
            completos com GIFs e instruções.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Login / Registrar
              </Button>
            </Link>

            <Link href="/search">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent"
              >
                Pesquisar Exercícios (Anônimo)
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Características do App
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1 */}
            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">
                  Monte seus treinos personalizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Crie rotinas de treino customizadas de acordo com seus
                  objetivos e disponibilidade.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">
                  Acesse no celular, em qualquer lugar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Sua ficha de treino está sempre com você, totalmente
                  sincronizada e acessível offline.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">
                  Explore exercícios com vídeos e GIFs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Acesse uma biblioteca completa de exercícios com vídeos e
                  instruções detalhadas da API ExerciseDB.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
