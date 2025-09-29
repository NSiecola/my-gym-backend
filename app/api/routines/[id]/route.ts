import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * @description Edita/Atualiza uma rotina existente.
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const client = await db.connect();
    try {
        const id = params.id; 
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ message: 'O campo "name" é obrigatório' }, { status: 400 });
        }

        const queryText = `
            UPDATE routines 
            SET name = $1
            WHERE id = $2
            RETURNING *;
        `;
        
        const queryParams = [name, id];
        const result = await client.query(queryText, queryParams);

        if (result.rows.length === 0) {
            return NextResponse.json({ message: `Rotina com ID ${id} não encontrada` }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);

    } catch (error) {
        console.error('Erro ao atualizar rotina:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}

/**
 * @description Deleta uma rotina existente.
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const client = await db.connect();
    try {
        const id = params.id;

        const queryText = `
            DELETE FROM routines 
            WHERE id = $1
            RETURNING *; 
        `;
        
        const queryParams = [id];
        const result = await client.query(queryText, queryParams);

        if (result.rows.length === 0) {
            return NextResponse.json({ message: `Rotina com ID ${id} não encontrada` }, { status: 404 });
        }
        
        return NextResponse.json(result.rows[0]);

    } catch (error) {
        console.error('Erro ao deletar rotina:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}