import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * @description Lista todos os exercícios do banco de dados.
 */
export async function GET(request: Request) {
    const client = await db.connect();
    try {
        const result = await client.query('SELECT * FROM exercises ORDER BY name ASC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar exercícios:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}

/**
 * @description Cria um novo exercício.
 */
export async function POST(request: Request) {
    const client = await db.connect();
    try {
        const body = await request.json();
        const { name, muscle_group } = body;

        if (!name) {
            return NextResponse.json({ message: 'O nome do exercício é obrigatório' }, { status: 400 });
        }

        const queryText = `
            INSERT INTO exercises (name, muscle_group) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
        const queryParams = [name, muscle_group || null];

        const result = await client.query(queryText, queryParams);

        return NextResponse.json(result.rows[0], { status: 201 });

    } catch (error) {
        // Código '23505' no PostgreSQL é erro de violação de chave única (UNIQUE constraint).
        if ((error as { code: string }).code === '23505') {
             return NextResponse.json({ message: 'Este exercício já existe' }, { status: 409 }); // 409 Conflict
        }
        console.error('Erro ao criar exercício:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}