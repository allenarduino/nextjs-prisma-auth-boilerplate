import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth-utils';
import { loginSchema } from '@/lib/validations/auth';

// Type guard for Zod errors
function isZodError(error: unknown): error is { issues: Array<{ path?: string[]; message: string }> } {
    return Boolean(error && typeof error === 'object' && 'name' in error && error.name === 'ZodError' && 'issues' in error);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = loginSchema.parse(body);

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check if user has password (credentials user)
        if (!user.passwordHash) {
            return NextResponse.json(
                { error: 'This account was created with OAuth. Please sign in with Google.' },
                { status: 401 }
            );
        }

        // Check if email is verified
        if (!user.emailVerified) {
            return NextResponse.json(
                { error: 'Please verify your email before signing in' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, user.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Return user data (without sensitive information)
        return NextResponse.json({
            message: 'Authentication successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                emailVerified: user.emailVerified,
            },
        });

    } catch (error) {
        if (isZodError(error)) {
            return NextResponse.json(
                { error: 'Invalid input data', details: error.issues },
                { status: 400 }
            );
        }

        console.error('Sign in error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
