import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function ProfilePage() {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    Profile
                </h1>

                {/* Profile content goes here */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
                    <p className="text-gray-600">Your profile information will be displayed here.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
