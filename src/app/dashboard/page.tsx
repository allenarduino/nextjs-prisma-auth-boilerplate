import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    Dashboard
                </h1>

                {/* Dashboard content goes here */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome!</h3>
                        <p className="text-gray-600">This is your dashboard. Start building your app here.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Stats</h3>
                        <p className="text-gray-600">Your application statistics will appear here.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Recent Activity</h3>
                        <p className="text-gray-600">Track your latest activities and updates.</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
