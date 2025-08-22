'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyPage() {
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const verifyEmail = useCallback(async (token: string) => {
        try {
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
                // Redirect to sign in after 3 seconds
                setTimeout(() => {
                    router.push('/auth/signin');
                }, 3000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Verification failed');
            }
        } catch {
            setStatus('error');
            setMessage('An unexpected error occurred');
        }
    }, [router]);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided');
            return;
        }

        verifyEmail(token);
    }, [token, verifyEmail]);

    if (status === 'verifying') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verifying your email...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${status === 'success' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    {status === 'success' ? (
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>

                <h2 className={`mt-6 text-3xl font-extrabold ${status === 'success' ? 'text-green-900' : 'text-red-900'
                    }`}>
                    {status === 'success' ? 'Email Verified!' : 'Verification Failed'}
                </h2>

                <p className={`mt-2 text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {message}
                </p>

                {status === 'success' && (
                    <p className="mt-4 text-sm text-gray-600">
                        Redirecting you to sign in page...
                    </p>
                )}

                <div className="mt-6">
                    <a
                        href="/auth/signin"
                        className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                        Go to Sign In
                    </a>
                </div>
            </div>
        </div>
    );
}
