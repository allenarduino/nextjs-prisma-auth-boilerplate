import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    Settings
                </h1>

                {/* Settings content goes here */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Application Settings</h3>
                    <p className="text-gray-600">Your application settings will be displayed here.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
