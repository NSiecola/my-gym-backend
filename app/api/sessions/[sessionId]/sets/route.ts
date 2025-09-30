import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: Request, { params }: { params: { sessionId: string } }) {
    const client = await db.connect();
    try {
        const headersList = headers();
        const userId = (await headersList).get('x-user-id');

        const sessionId = params.sessionId;

        if (!userId) {
            return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
        }

        const sessionCheckQuery = 'SELECT user_id FROM workout_sessions WHERE id = $1';
        const sessionCheckResult = await client.query(sessionCheckQuery, [sessionId]);

        if (sessionCheckResult.rows.length === 0 || sessionCheckResult.rows[0].user_id.toString() !== userId) {
            return NextResponse.json({ message: 'Acesso proibido a esta sessão de treino' }, { status: 403 }); // 403 Forbidden
        }

        const body = await request.json();
        const { exercise_id, weight, reps, notes } = body;

        if (!exercise_id || weight === undefined || reps === undefined) {
            return NextResponse.json({ message: 'exercise_id, weight e reps são obrigatórios' }, { status: 400 });
        }

        const queryText = `
            INSERT INTO sets (session_id, exercise_id, weight, reps, notes) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *;
        `;
        const queryParams = [sessionId, exercise_id, weight, reps, notes || null];

        const result = await client.query(queryText, queryParams);

        return NextResponse.json(result.rows[0], { status: 201 });

    } catch (error) {
        console.error('Erro ao adicionar série:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}