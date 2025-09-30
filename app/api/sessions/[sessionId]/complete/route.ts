import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * @description Finaliza uma sessão de treino, preenchendo o end_time.
 */
export async function PATCH(request: Request, { params }: { params: { sessionId: string } }) {
    const client = await db.connect();
    try {
        const headersList = headers();
        const userId = (await headersList).get('x-user-id');
        const sessionId = params.sessionId;

        if (!userId) {
            return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
        }

        const queryText = `
            UPDATE workout_sessions
            SET end_time = now()
            WHERE id = $1 AND user_id = $2
            RETURNING *;
        `;
        
        const queryParams = [sessionId, userId];
        const result = await client.query(queryText, queryParams);

        if (result.rows.length === 0) {
            return NextResponse.json({ message: 'Sessão de treino não encontrada ou acesso negado' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);

    } catch (error) {
        console.error('Erro ao finalizar sessão:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}