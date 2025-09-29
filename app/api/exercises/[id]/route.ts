import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * @description Edita/Atualiza um exercício existente.
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const client = await db.connect();
    try {
        const id = params.id;
        const body = await request.json();
        const { name, muscle_group } = body;

        if (!name && !muscle_group) {
            return NextResponse.json({ message: 'Pelo menos um campo (nome ou grupo muscular) deve ser fornecido' }, { status: 400 });
        }

        const queryText = `
            UPDATE exercises 
            SET 
                name = COALESCE($1, name), -- COALESCE usa o novo valor ($1), mas se ele for nulo, mantém o valor antigo (name).
                muscle_group = COALESCE($2, muscle_group)
            WHERE id = $3
            RETURNING *;
        `;

        const queryParams = [name || null, muscle_group || null, id];
        const result = await client.query(queryText, queryParams);

        if (result.rows.length === 0) {
            return NextResponse.json({ message: `Exercício com ID ${id} não encontrado` }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);

    } catch (error) {
        console.error('Erro ao atualizar exercício:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}


/**
 * @description Deleta um exercício existente.
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const client = await db.connect();
    try {
        const id = params.id;

        const queryText = `
            DELETE FROM exercises 
            WHERE id = $1
            RETURNING *; 
        `;

        const queryParams = [id];
        const result = await client.query(queryText, queryParams);

        if (result.rows.length === 0) {
            return NextResponse.json({ message: `Exercício com ID ${id} não encontrado` }, { status: 404 });
        }
        
        // Retorna o item que foi deletado, como estamos fazendo aqui com status 200.
        return NextResponse.json(result.rows[0]);

    } catch (error) {
        console.error('Erro ao deletar exercício:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}