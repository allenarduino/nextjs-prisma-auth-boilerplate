'use client';

import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { UserAvatarDropdown } from './user-avatar-dropdown';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 w-full z-[60]">
                <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
                    </div>

                    {/* User Avatar */}
                    <UserAvatarDropdown />
                </div>
            </div>

            {/* Content Area with Sidebar */}
            <div className="flex-1 flex">
                {/* Sidebar */}
                <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

                {/* Main content */}
                <div className="flex-1 flex flex-col">
                    {/* Page content */}
                    <main className="flex-1 p-6 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
