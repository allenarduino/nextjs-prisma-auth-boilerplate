'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';

// Type guard for Zod errors
function isZodError(error: unknown): error is { issues: Array<{ path?: string[]; message: string }> } {
    return Boolean(error && typeof error === 'object' && 'name' in error && error.name === 'ZodError' && 'issues' in error);
}

export function SignInForm() {
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState<LoginInput>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Partial<LoginInput>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof LoginInput]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setErrors({});

        try {
            // Validate form data
            const validatedData = loginSchema.parse(formData);

            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validatedData),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.error || 'Sign in failed');
                return;
            }

            // Sign in successful - now use NextAuth to create session
            const result = await signIn('credentials', {
                email: validatedData.email,
                password: validatedData.password,
                redirect: false,
            });

            if (result?.error) {
                setMessage(result.error);
                return;
            }

            if (result?.ok) {
                setMessage('Sign in successful! Redirecting to dashboard...');
                // Redirect to dashboard
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            }
        } catch (error) {
            if (isZodError(error)) {
                // Handle client-side validation errors
                const validationErrors: Partial<LoginInput> = {};
                error.issues.forEach((issue) => {
                    if (issue.path) {
                        validationErrors[issue.path[0] as keyof LoginInput] = issue.message;
                    }
                });
                setErrors(validationErrors);
            } else {
                setMessage('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };



    if (!mounted) {
        return (
            <div className="w-full max-w-md mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter your password"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                {message && (
                    <div className={`p-3 rounded-md ${message.includes('successful') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                </button>
            </form>


            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <a href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}
