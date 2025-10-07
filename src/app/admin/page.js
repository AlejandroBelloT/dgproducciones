'use client';
import { useState } from 'react'
import { useAdminStats } from '@/hooks/useAdminStats'
import AdminNavigation from '@/components/admin/dashboard/AdminNavigation'
import DashboardStats from '@/components/admin/dashboard/DashboardStats'
import DashboardQuickActions from '@/components/admin/dashboard/DashboardQuickActions'
import ContactManagement from '@/components/admin/ContactManagement'
import ContentManagement from '@/components/admin/ContentManagement'
import TeamManagement from '@/components/admin/TeamManagement'
import ProjectManagement from '@/components/admin/ProjectManagement'
import UserManagement from '@/components/admin/UserManagement'
import DashboardTips from '@/components/admin/dashboard/DashboardTips';

export default function AdminDashboard() {
    const [activeSection, setActiveSection] = useState('dashboard')
    const { stats, loading, error, refetchStats } = useAdminStats()

    const handleQuickAction = (sectionId) => {
        setActiveSection(sectionId)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavigation
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                pendingContacts={stats.pendingContacts}
            />
            <main className="max-w-7xl mx-auto px-4 py-8">
                {activeSection === 'dashboard' && (
                    <div className="space-y-6 p-5">
                        <DashboardStats stats={stats} loading={loading} />
                        <DashboardQuickActions stats={stats} onActionClick={handleQuickAction} />
                        <DashboardTips />
                    </div>
                )}
                {activeSection === 'contacts' && <ContactManagement />}
                {activeSection === 'content' && <ContentManagement />}
                {activeSection === 'team' && <TeamManagement />}
                {activeSection === 'projects' && <ProjectManagement />}
                {activeSection === 'users' && <UserManagement />}
            </main>
        </div>
    )
}
