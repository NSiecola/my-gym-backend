'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Calendar, BarChart, Plus } from 'lucide-react';

interface WorkoutSession {
  id: number;
  routine_name: string;
  start_time: string;
  end_time: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/sessions', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar dados.');
        }

        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error(error);
        localStorage.removeItem('authToken');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [router]);

  // Função para formatar a data para o padrão brasileiro
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return <p className="text-center mt-10">Carregando seu dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Seu Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo de volta! Aqui está um resumo da sua atividade.</p>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/workout">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Iniciar Treino</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Comece uma nova sessão agora.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/routines">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gerenciar Rotinas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Crie e edite suas rotinas de treino.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/exercises">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Exercícios</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Gerencie sua biblioteca de exercícios.</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Histórico Recente */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Treinos Recentes</CardTitle>
          <CardDescription>Suas últimas sessões concluídas.</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length > 0 ? (
            <ul className="space-y-3">
              {sessions.slice(0, 5).map((session) => ( // Mostra apenas os últimos 5
                <li key={session.id} className="flex justify-between items-center p-3 rounded-md bg-card border">
                  <div>
                    <p className="font-semibold">{session.routine_name || "Treino Livre"}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(session.start_time)}</p>
                  </div>
                  {session.end_time ? (
                    <span className="text-xs font-medium text-green-400">Concluído</span>
                  ) : (
                    <span className="text-xs font-medium text-yellow-400">Em Andamento</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhum treino registrado ainda.</p>
              <Link href="/workout">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Começar Primeiro Treino
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}