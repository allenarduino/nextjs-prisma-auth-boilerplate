'use client';

import { useState } from 'react';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

function isZodError(error: unknown): error is { issues: { path?: string[]; message: string }[] } {
    return typeof error === 'object' && error !== null && 'issues' in error;
}

export function ForgotPasswordForm() {
    const [formData, setFormData] = useState<ForgotPasswordInput>({
        email: '',
    });
    const [errors, setErrors] = useState<Partial<ForgotPasswordInput>>({});
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof ForgotPasswordInput]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setMessage('');
        setIsLoading(true);

        try {
            // Validate input
            const validatedData = forgotPasswordSchema.parse(formData);

            // Send password reset request
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(validatedData),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.error || 'Failed to send password reset email');
                return;
            }

            setMessage(data.message);
            setFormData({ email: '' }); // Clear form on success
        } catch (error) {
            if (isZodError(error)) {
                // Handle client-side validation errors
                const validationErrors: Partial<ForgotPasswordInput> = {};
                error.issues.forEach((issue) => {
                    if (issue.path) {
                        validationErrors[issue.path[0] as keyof ForgotPasswordInput] = issue.message;
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-gray-900 ${errors.email ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Enter your email address"
                    />
                </div>
                {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            {message && (
                <div className={`p-3 rounded-md ${message.includes('sent') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
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
                    {isLoading ? 'Sending...' : 'Send reset link'}
                </button>
            </div>

            <div className="text-center">
                <a
                    href="/auth/signin"
                    className="font-medium text-primary hover:text-primary-hover"
                >
                    Back to sign in
                </a>
            </div>
        </form>
    );
}
