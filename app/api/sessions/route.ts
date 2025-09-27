import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    const client = await db.connect();

    try {
        const body = await request.json();
        const { user_id, routine_name } = body;

        if (!user_id) {
            return NextResponse.json({ message: 'O ID do usuário (user_id) é obrigatório' }, { status: 400 });
        }

        const queryText = `
            INSERT INTO workout_sessions (user_id, routine_name) 
            VALUES ($1, $2) 
            RETURNING *; 
        `;

        const queryParams = [user_id, routine_name || null];

        const result = await client.query(queryText, queryParams);

        return NextResponse.json(result.rows[0], { status: 201 });

    } catch (error) {
        console.error('Erro ao criar sessão de treino:', error);

        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}