import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    email: string,
    token: string,
    name?: string
) {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: 'Verify your email address',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to NextAuth Boilerplate!</h2>
          <p>Hi ${name || 'there'},</p>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Verify Email
          </a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
        });
    } catch (error) {
        console.error('Failed to send verification email:', error);
        throw new Error('Failed to send verification email');
    }
}

export async function sendPasswordResetEmail(
    email: string,
    token: string
) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: 'Reset your password',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hi there,</p>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Reset Password
          </a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>For security reasons, this link can only be used once.</p>
        </div>
      `,
        });
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
}
