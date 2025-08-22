import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { error: 'Verification token is required' },
                { status: 400 }
            );
        }

        // Find and validate verification token
        const verificationToken = await prisma.emailVerificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            return NextResponse.json(
                { error: 'Invalid verification token' },
                { status: 400 }
            );
        }

        if (verificationToken.expires < new Date()) {
            // Delete expired token
            await prisma.emailVerificationToken.delete({
                where: { token },
            });
            return NextResponse.json(
                { error: 'Verification token has expired' },
                { status: 400 }
            );
        }

        // Update user email verification status
        await prisma.user.update({
            where: { email: verificationToken.email },
            data: { emailVerified: new Date() },
        });

        // Delete used verification token
        await prisma.emailVerificationToken.delete({
            where: { token },
        });

        return NextResponse.json(
            { message: 'Email verified successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
