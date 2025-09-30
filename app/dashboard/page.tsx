'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Routine {
  id: number;
  name: string;
  user_id: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect executa este código assim que a página é carregada no navegador
  useEffect(() => {
    const fetchRoutines = async () => {
      // 1. Buscamos o token que salvamos no localStorage
      const token = localStorage.getItem('authToken');

      // 2. Se não houver token, redirecionamos para o login.
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // 3. Fazemos a chamada para a nossa API de rotinas (rota protegida)
        const response = await fetch('/api/routines', {
          method: 'GET',
          headers: {
            // 4. Anexamos o token no cabeçalho 'Authorization' para passar pelo middleware
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar dados. Por favor, faça o login novamente.');
        }

        const data = await response.json();
        setRoutines(data); // Guardamos as rotinas no estado do componente

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false); // Marcamos que o carregamento terminou
      }
    };

    fetchRoutines();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full mt-10">
        <p>Carregando seu dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-foreground">Seu Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Minhas Rotinas de Treino</CardTitle>
        </CardHeader>
        <CardContent>
          {routines.length > 0 ? (
            <ul className="space-y-2">
              {routines.map((routine) => (
                <li key={routine.id} className="p-3 rounded-md bg-card border">
                  {routine.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>Você ainda não criou nenhuma rotina.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}