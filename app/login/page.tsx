/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell } from "lucide-react";

import { login, register } from "@/services/auth.service"; // <- IMPORT REAL
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegister) {
        // validação
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem.");
        }

        await register(email, password, name);
        router.push("/login");
      } else {
        await login(email, password);
        router.push("/dashboard");
      }
    } catch (error: any) {
      alert("Erro: " + error.message);
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isRegister ? "Criar Conta" : "Bem-vindo"}
          </h1>
          <p className="text-muted-foreground">
            {isRegister
              ? "Registre-se para começar seus treinos"
              : "Faça login para acessar seus treinos"}
          </p>
        </div>

        {/* Card de Login/Register */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              {isRegister ? "Registrar" : "Login"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isRegister
                ? "Preencha os dados abaixo para criar sua conta"
                : "Acesse sua conta com email e senha"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Confirmar Senha (apenas Registro) */}
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-foreground">
                    Confirmar Senha
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Botão */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading
                  ? "Processando..."
                  : isRegister
                  ? "Criar Conta"
                  : "Entrar"}
              </Button>
            </form>

            {/* Alternar login/registro */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isRegister ? "Já tem uma conta?" : "Não tem uma conta?"}
                <button
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="ml-1 font-semibold text-primary hover:underline"
                >
                  {isRegister ? "Faça login" : "Registre-se"}
                </button>
              </p>
            </div>

            {/* Voltar */}
            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-primary hover:underline">
                Voltar para home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
