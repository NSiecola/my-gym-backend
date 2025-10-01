import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    const client = await db.connect();
    try {
        const headersList = headers();
        const userId = (await headersList).get('x-user-id');

        const body = await request.json();
        const { routine_name } = body;

        if (!userId) {
            return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
        }

        const queryText = `
            INSERT INTO workout_sessions (user_id, routine_name)
            VALUES ($1, $2)
            RETURNING *;
        `;

        const queryParams = [userId, routine_name || null];

        const result = await client.query(queryText, queryParams);
        return NextResponse.json(result.rows[0], { status: 201 });

    } catch (error) {
        console.error('Erro ao criar sessão de treino:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}

/**
 * @description Lista todas as sessões de treino de um usuário autenticado.
 */
export async function GET(request: Request) {
    const client = await db.connect();
    try {
        const headersList = headers();
        const userId = (await headersList).get('x-user-id');

        if (!userId) {
            return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
        }

        const queryText = `
            SELECT * FROM workout_sessions 
            WHERE user_id = $1 
            ORDER BY start_time DESC; -- ORDER BY DESC ordena do mais novo para o mais antigo
        `;
        const queryParams = [userId];

        const result = await client.query(queryText, queryParams);

        return NextResponse.json(result.rows);

    } catch (error) {
        console.error('Erro ao buscar histórico de sessões:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}