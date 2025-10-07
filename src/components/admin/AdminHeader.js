'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import ChangePasswordModal from './ChangePasswordModal';

export default function AdminHeader() {
    const { user, logout } = useAuth();
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            try {
                await logout();
            } catch (error) {
                console.error('Error durante logout:', error);
                // Incluso si hay error, forzar logout local
                logout();
            }
        }
    };

    return (
        <>
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Image
                                src="/images/logo/logo.png"
                                alt="DG Producciones"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                            />
                            
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Información del usuario */}
                            <div className="text-sm text-gray-700">
                                <span className="font-medium">{user?.name}</span>
                                <span className="text-gray-500 ml-1">({user?.role})</span>
                            </div>

                            {/* Menú desplegable del usuario */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 hover:bg-gray-100"
                                >
                                    <span className="sr-only">Abrir menú de usuario</span>
                                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <svg className="ml-1 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="py-1">
                                            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                                                <div className="font-medium">{user?.name}</div>
                                                <div className="text-gray-500">{user?.email}</div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setShowChangePassword(true);
                                                    setShowUserMenu(false);
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7 7h-2l-4-4h2a3 3 0 003-3 6 6 0 016-6z" />
                                                </svg>
                                                Cambiar Contraseña
                                            </button>

                                            <button
                                                onClick={async () => {
                                                    setShowUserMenu(false);
                                                    await handleLogout();
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Cerrar menú si se hace clic fuera */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}

            {/* Modal de cambio de contraseña */}
            <ChangePasswordModal
                isOpen={showChangePassword}
                onClose={() => setShowChangePassword(false)}
            />
        </>
    );
}