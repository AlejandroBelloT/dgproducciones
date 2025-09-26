"use client";
import { useEffect } from 'react';

export default function Modal({ open, isOpen, onClose, title, children, footer, size = "default", className = "" }) {
    const isModalOpen = open || isOpen;

    useEffect(() => {
        function onEsc(e) {
            if (e.key === 'Escape') onClose?.();
        }
        if (isModalOpen) {
            document.addEventListener('keydown', onEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', onEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen, onClose]);

    if (!isModalOpen) return null;

    const sizeClasses = {
        default: "w-full max-w-lg",
        fullscreen: "w-full h-full max-w-none max-h-none",
        large: "w-full max-w-4xl",
        medium: "w-full max-w-2xl"
    };

    if (size === "fullscreen") {
        return (
            <div className={`fixed inset-0 z-50 ${className}`}>
                <div className="absolute inset-0" onClick={onClose} />
                <div className="relative z-10 w-full h-full">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative z-10 ${sizeClasses[size]} rounded-lg border border-neutral-200 bg-white shadow-lg ${className}`}>
                {title ? <div className="p-4 border-b border-neutral-200 text-base font-semibold">{title}</div> : null}
                <div className="p-4">{children}</div>
                {footer ? <div className="p-3 border-t border-neutral-200 flex justify-end gap-2">{footer}</div> : null}
            </div>
        </div>
    );
}
