'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

function isZodError(error: unknown): error is { issues: { path?: string[]; message: string }[] } {
    return typeof error === 'object' && error !== null && 'issues' in error;
}

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState<ResetPasswordInput>({
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Partial<ResetPasswordInput>>({});
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);

    const resetPassword = useCallback(async () => {
        if (!token) {
            setMessage('Invalid reset token');
            return;
        }

        try {
            // Validate input
            const validatedData = resetPasswordSchema.parse(formData);

            // Send password reset request
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password: validatedData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.error || 'Failed to reset password');
                return;
            }

            setMessage('Password reset successfully! Redirecting to sign in...');

            // Redirect to sign in page after 2 seconds
            setTimeout(() => {
                router.push('/auth/signin');
            }, 2000);
        } catch (error) {
            if (isZodError(error)) {
                // Handle client-side validation errors
                const validationErrors: Partial<ResetPasswordInput> = {};
                error.issues.forEach((issue) => {
                    if (issue.path) {
                        validationErrors[issue.path[0] as keyof ResetPasswordInput] = issue.message;
                    }
                });
                setErrors(validationErrors);
            } else {
                setMessage('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    }, [token, formData, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof ResetPasswordInput]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setMessage('');
        setIsLoading(true);

        await resetPassword();
    };

    useEffect(() => {
        if (!token) {
            setMessage('Invalid reset token. Please request a new password reset link.');
            setIsValidToken(false);
        } else {
            setIsValidToken(true);
        }
    }, [token]);

    if (!isValidToken) {
        return (
            <div className="text-center">
                <div className="p-3 rounded-md bg-red-50 text-red-800 mb-4">
                    {message || 'Invalid reset token'}
                </div>
                <a
                    href="/auth/forgot-password"
                    className="font-medium text-primary hover:text-primary-hover"
                >
                    Request new reset link
                </a>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                </label>
                <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-gray-900 ${errors.password ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Enter your new password"
                    />
                </div>
                {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                </label>
                <div className="mt-1">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-gray-900 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Confirm your new password"
                    />
                </div>
                {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
            </div>

            {message && (
                <div className={`p-3 rounded-md ${message.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                    {message}
                </div>
            )}

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </div>

            <div className="text-center">
                <a
                    href="/auth/signin"
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    Back to sign in
                </a>
            </div>
        </form>
    );
}
