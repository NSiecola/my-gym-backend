import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    const client = await db.connect();
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: 'Email e senha são obrigatórios' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const queryText = `
            INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING id, email, created_at; 
        `; 

        const queryParams = [email, hashedPassword];
        const result = await client.query(queryText, queryParams);

        return NextResponse.json(result.rows[0], { status: 201 });

    } catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
            return NextResponse.json({ message: 'Este email já está em uso' }, { status: 409 });
        }
        console.error('Erro ao registrar usuário:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}