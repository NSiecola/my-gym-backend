'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Plus, ChevronRight } from 'lucide-react';

interface WorkoutSession { id: number; routine_name: string; start_time: string; end_time: string | null; }
const calculateDuration = (start: string, end: string | null): string => { if (!end) return 'Em andamento'; const durationMs = new Date(end).getTime() - new Date(start).getTime(); const minutes = Math.round(durationMs / 60000); return `${minutes} min`; };

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) { router.push('/login'); return; }
      try {
        const response = await fetch('/api/sessions', { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error('Falha ao buscar dados.');
        const data = await response.json();
        setSessions(data);
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    fetchSessions();
  }, [router]);
  const totalWorkouts = sessions.length;
  const totalTime = '...';
  const currentStreak = '...';
  if (isLoading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-10">
        <section>
          <h2 className="text-4xl font-bold">Bem-vindo de volta!</h2>
          <p className="text-muted-foreground mt-2">Pronto para o próximo treino?</p>
          <div className="mt-6 flex gap-4 justify-center">
            <Link href="/workout">
              <Button className="h-14 w-70 text-lg bg-white text-black hover:bg-gray-200 cursor-pointer flex items-center justify-center">
                <div className="flex items-center justify-center">
                  <Play className="!h-5 !w-5 mr-1" />
                  <span>Iniciar Treino Rápido</span>
                </div>
              </Button>
            </Link>
            <Link href="/routines">
              <Button variant="outline" className="h-14 w-70 text-lg cursor-pointer">
                <div className="flex items-center justify-center">
                  <Plus className="!h-5 !w-5 mr-1" />
                  <span>Criar Nova Rotina</span>
                </div>
              </Button>
            </Link>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Histórico de Treinos</h3>
            <Link href="/history" className="text-sm text-primary hover:underline">Ver tudo</Link>
          </div>
          <div className="space-y-4"> 
            {sessions.slice(0, 4).map((session) => (
              <Link href={`/history/${session.id}`} key={session.id}>
                <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-transparent hover:border-primary transition-colors cursor-pointer">
                  <div>
                    <p className="font-semibold text-lg">{session.routine_name || 'Treino Livre'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.start_time).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {' • '}
                      {calculateDuration(session.start_time, session.end_time)}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-3 gap-4">
          <Card className="bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Treinos este mês</p>
              <p className="text-3xl font-bold">{totalWorkouts}</p> 
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Tempo total</p>
              <p className="text-3xl font-bold">{totalTime}</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Sequência atual</p>
              <p className="text-3xl font-bold">{currentStreak}</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}