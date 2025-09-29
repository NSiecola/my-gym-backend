import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { sessionId: string } }) {
    const client = await db.connect();
    try {
        const sessionId = params.sessionId;

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