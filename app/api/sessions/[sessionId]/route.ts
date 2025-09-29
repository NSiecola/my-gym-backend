import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { sessionId: string } }) {
    const client = await db.connect();
    try {
        const sessionId = params.sessionId;

        const queryText = `
            SELECT 
                s.id, 
                s.weight, 
                s.reps, 
                s.notes,
                s.created_at,
                e.name as exercise_name -- Pega o 'name' da tabela exercises e renomeia para 'exercise_name'
            FROM 
                sets s -- 's' é um apelido para a tabela 'sets' para facilitar a escrita
            JOIN 
                exercises e ON s.exercise_id = e.id -- 'e' é um apelido para 'exercises'
            WHERE 
                s.session_id = $1 -- Filtra para pegar apenas as séries da sessão que nos interessa
            ORDER BY
                s.created_at ASC; -- Ordena as séries da mais antiga para a mais nova
        `;

        const queryParams = [sessionId];
        const result = await client.query(queryText, queryParams);

        return NextResponse.json(result.rows);

    } catch (error) {
        console.error('Erro ao buscar detalhes da sessão:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}