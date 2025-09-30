import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers'; 

/**
 * @description Lista todas as rotinas de um usuário específico, autenticado via token.
 */
export async function GET(request: Request) {
    const client = await db.connect();
    try {
        const headersList = headers();
        const userId = (await headersList).get('x-user-id');

        if (!userId) {
            return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
        }

        const queryText = 'SELECT * FROM routines WHERE user_id = $1 ORDER BY name ASC';
        const queryParams = [userId];

        const result = await client.query(queryText, queryParams);
        return NextResponse.json(result.rows);

    } catch (error) {
        console.error('Erro ao buscar rotinas:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}

/**
 * @description Cria uma nova rotina de treino.
 */
export async function POST(request: Request) {
    const client = await db.connect();
    try {
        const headersList = headers();
        const userId = (await headersList).get('x-user-id');

        const body = await request.json();
        const { name } = body;

        if (!userId) {
            return NextResponse.json({ message: 'Usuário não autenticado' }, { status: 401 });
        }

        if (!name) {
            return NextResponse.json({ message: 'Nome é obrigatório' }, { status: 400 });
        }

        const queryText = `
            INSERT INTO routines (name, user_id) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
        const queryParams = [name, userId];

        const result = await client.query(queryText, queryParams);

        return NextResponse.json(result.rows[0], { status: 201 });

    } catch (error) {
        console.error('Erro ao criar rotina:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}