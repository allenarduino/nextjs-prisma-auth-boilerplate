import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';
import { sendVerificationEmail } from '@/lib/mail';
import { registerSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = registerSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user with emailVerified = null
        await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                emailVerified: null,
                role: 'USER',
            },
        });

        // Generate verification token
        const verificationToken = await prisma.emailVerificationToken.create({
            data: {
                email,
                token: crypto.randomUUID(),
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
        });

        // Send verification email
        await sendVerificationEmail(email, verificationToken.token, name);

        return NextResponse.json(
            {
                message: 'User registered successfully. Please check your email to verify your account.'
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input data', details: error.issues },
                { status: 400 }
            );
        }

        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
