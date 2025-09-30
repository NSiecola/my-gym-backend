// app/api/auth/login/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

export async function POST(request: Request) {
    const client = await db.connect();
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: 'Email e senha são obrigatórios' }, { status: 400 });
        }

        const queryText = 'SELECT * FROM users WHERE email = $1';
        const queryParams = [email];
        const result = await client.query(queryText, queryParams);

        if (result.rows.length === 0) {
            return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
        }

        const user = result.rows[0];

        const passwordsMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordsMatch) {
            return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
        }

        const payload = {
            id: user.id,
            email: user.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

        return NextResponse.json({
            message: 'Login bem-sucedido',
            token: token
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    } finally {
        client.release();
    }
}