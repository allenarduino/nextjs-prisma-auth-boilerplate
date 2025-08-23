'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
    const { isAuthenticated, signOut } = useAuth();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-blue-600">
                            NextAuth Boilerplate
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => signOut()}
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signin"
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
