'use client';

import '../globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }) {
    return (
        <AuthProvider>
            <ProtectedRoute>
                <div className="min-h-screen bg-background text-foreground">
                    <AdminHeader />
                    <main>
                        {children}
                    </main>
                </div>
            </ProtectedRoute>
        </AuthProvider>
    );
}
