'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dumbbell, Mail, Lock, Zap, History, Plus } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Algo deu errado no login');
      }
      localStorage.setItem('authToken', data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black p-4">
      <Card className="w-full max-w-md bg-[#18181B] border-gray-800 z-10">
        <CardContent className="p-8 space-y-6">

          <div className="text-center space-y-2">
            <Dumbbell className="mx-auto h-10 w-10 text-white" />
            <h1 className="text-3xl font-bold text-white">MyGym</h1>
            <p className="text-gray-400">Sua plataforma de treinos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white focus:ring-white"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white focus:ring-white"
              />
            </div>

            <div className="text-right">
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Esqueceu a senha?
              </Link>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button className="w-full bg-white text-black hover:bg-gray-200 font-bold cursor-pointer" type="submit">
              Entrar
            </Button>
          </form>

          <div className="text-center text-sm text-gray-400">
            Não tem uma conta?{' '}
            <Link href="/register" className="font-bold text-white hover:underline">
              Cadastre-se
            </Link>
          </div>

        </CardContent>
      </Card>

      <section className="w-full max-w-4xl mt-16 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 border border-gray-800 rounded-lg bg-[#18181B]">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-lg">Simples e Rápido</h3>
            <p className="text-sm text-gray-400">
              Registre suas séries em segundos durante o treino.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 border border-gray-800 rounded-lg bg-[#18181B]">
              <History className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-lg">Histórico Completo</h3>
            <p className="text-sm text-gray-400">
              Acompanhe sua evolução exercício por exercício.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 border border-gray-800 rounded-lg bg-[#18181B]">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-lg">Totalmente Customizável</h3>
            <p className="text-sm text-gray-400">
              Crie suas rotinas e exercícios personalizados.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}