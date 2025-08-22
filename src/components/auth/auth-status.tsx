'use client';

import { useAuth } from '@/hooks/use-auth';

export function AuthStatus() {
    const { user, isAuthenticated, isLoading, signOut } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <div>Not signed in</div>;
    }

    return (
        <div>
            <p>Signed in as {user?.email}</p>
            <p>Role: {user?.role}</p>
            <button onClick={() => signOut()}>Sign out</button>
        </div>
    );
}
