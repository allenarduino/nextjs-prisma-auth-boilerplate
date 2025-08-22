'use client';

import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';

export function useAuth() {
    const { data: session, status, update } = useSession();

    return {
        session,
        status,
        isAuthenticated: !!session,
        isLoading: status === 'loading',
        user: session?.user,
        signIn: (provider?: string) => signIn(provider),
        signOut: () => signOut(),
        update,
    };
}
