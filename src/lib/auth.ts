import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import { prisma } from './prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: 'openid email profile',
                },
            },
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.passwordHash) {
                    return null;
                }

                // Check if email is verified
                if (!user.emailVerified) {
                    throw new Error('Please verify your email before signing in');
                }

                // Verify password
                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.passwordHash
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role || 'USER';
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub!;
                session.user.role = token.role as string;
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            console.log('SignIn callback:', { user, account, profile });

            // For Google OAuth users, ensure they have a role
            if (account?.provider === 'google' && user) {
                try {
                    // Update user role if not set
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { role: user.role || 'USER' }
                    });
                } catch (error) {
                    console.error('Error in signIn callback:', error);
                }
            }
            return true;
        },
        async redirect({ url, baseUrl }) {
            console.log('Redirect callback:', { url, baseUrl });

            // After sign in, redirect to dashboard
            if (url.startsWith(baseUrl)) {
                return `${baseUrl}/dashboard`;
            }
            // After sign out, redirect to home
            else if (url.startsWith('/')) {
                return `${baseUrl}${url}`;
            }
            return baseUrl;
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
});
