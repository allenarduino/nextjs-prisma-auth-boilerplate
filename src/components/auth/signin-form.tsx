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
                setMessage('Sign in successful! Redirecting...');
                // Redirect to home page
                setTimeout(() => {
                    router.push('/');
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
