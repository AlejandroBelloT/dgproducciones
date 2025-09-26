'use client'

import { useState } from 'react'

const STATUS_CONFIG = {
    nuevo: {
        label: 'Nuevo',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    contactado: {
        label: 'Contactado',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    seguimiento: {
        label: 'En Seguimiento',
        color: 'bg-green-100 text-green-800 border-green-200'
    },
    cerrado: {
        label: 'Cerrado',
        color: 'bg-gray-100 text-gray-800 border-gray-200'
    }
}

export default function StatusBadge({ status, onChange, id, disabled = false }) {
    const [isEditing, setIsEditing] = useState(false)

    const handleStatusChange = async (newStatus) => {
        if (onChange && !disabled) {
            try {
                await onChange(id, newStatus)
                setIsEditing(false)
            } catch (error) {
                console.error('Error updating status:', error)
            }
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
    }

    if (isEditing && !disabled) {
        return (
            <div className="flex gap-1 flex-wrap">
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => handleStatusChange(key)}
                        className={`px-2 py-1 rounded text-xs border hover:opacity-80 transition-opacity ${config.color}`}
                        title={`Cambiar a ${config.label}`}
                    >
                        {config.label}
                    </button>
                ))}
                <button
                    onClick={handleCancel}
                    className="px-2 py-1 rounded text-xs border bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    title="Cancelar"
                >
                    ✕
                </button>
            </div>
        )
    }

    const currentStatus = STATUS_CONFIG[status] || STATUS_CONFIG.nuevo

    return (
        <button
            onClick={() => !disabled && setIsEditing(true)}
            className={`px-3 py-1 rounded-full text-sm border transition-opacity ${disabled
                    ? 'cursor-not-allowed opacity-60'
                    : 'hover:opacity-80 cursor-pointer'
                } ${currentStatus.color}`}
            title={disabled ? 'No disponible' : 'Click para cambiar estado'}
            disabled={disabled}
        >
            {currentStatus.label}
        </button>
    )
}