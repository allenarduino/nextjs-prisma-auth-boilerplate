'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';

// Type guard for Zod errors
function isZodError(error: unknown): error is { issues: Array<{ path?: string[]; message: string }> } {
    return Boolean(error && typeof error === 'object' && 'name' in error && error.name === 'ZodError' && 'issues' in error);
}

export function RegisterForm() {
    const [formData, setFormData] = useState<RegisterInput>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Partial<RegisterInput>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof RegisterInput]) {
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
            const validatedData = registerSchema.parse(formData);

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validatedData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.details) {
                    // Handle validation errors from API
                    const apiErrors: Partial<RegisterInput> = {};
                    data.details.forEach((error: { path?: string[]; message: string }) => {
                        if (error.path) {
                            apiErrors[error.path[0] as keyof RegisterInput] = error.message;
                        }
                    });
                    setErrors(apiErrors);
                } else {
                    setMessage(data.error || 'Registration failed');
                }
                return;
            }

            setMessage(data.message);
            // Redirect to login page after successful registration
            setTimeout(() => {
                router.push('/auth/signin');
            }, 3000);
        } catch (error) {
            if (isZodError(error)) {
                // Handle client-side validation errors
                const validationErrors: Partial<RegisterInput> = {};
                error.issues.forEach((issue) => {
                    if (issue.path) {
                        validationErrors[issue.path[0] as keyof RegisterInput] = issue.message;
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

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter your name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

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

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                {message && (
                    <div className={`p-3 rounded-md ${message.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creating account...' : 'Create account'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
