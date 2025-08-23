import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, password } = resetPasswordSchema.parse(body);

        // Find the password reset token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetToken) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Check if token is expired
        if (resetToken.expires < new Date()) {
            // Delete expired token
            await prisma.passwordResetToken.delete({
                where: { id: resetToken.id },
            });

            return NextResponse.json(
                { error: 'Reset token has expired' },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update user's password
        await prisma.user.update({
            where: { email: resetToken.email },
            data: {
                passwordHash: hashedPassword,
            },
        });

        // Delete the used reset token
        await prisma.passwordResetToken.delete({
            where: { id: resetToken.id },
        });

        return NextResponse.json(
            { message: 'Password has been reset successfully' },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input data' },
                { status: 400 }
            );
        }

        console.error('Password reset error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
