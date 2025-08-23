import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/mail';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = forgotPasswordSchema.parse(body);

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal if user exists or not for security
            return NextResponse.json(
                { message: 'If an account with that email exists, a password reset link has been sent.' },
                { status: 200 }
            );
        }

        // Delete any existing password reset tokens for this user
        await prisma.passwordResetToken.deleteMany({
            where: { email },
        });

        // Create new password reset token
        const token = crypto.randomUUID();
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expires,
            },
        });

        // Send password reset email
        await sendPasswordResetEmail(email, token);

        return NextResponse.json(
            { message: 'If an account with that email exists, a password reset link has been sent.' },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        console.error('Password reset request error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
