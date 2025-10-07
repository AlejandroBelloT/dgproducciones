import { ContactActions } from '../AdminComponents'

const DEPARTMENT_CONFIG = {
    produccion: { label: 'Producción', color: 'bg-teal-100 text-teal-800' },
    comercial: { label: 'Comercial', color: 'bg-amber-100 text-amber-800' },
    administracion: { label: 'Administración', color: 'bg-purple-100 text-purple-800' },
    creativo: { label: 'Creativo', color: 'bg-pink-100 text-pink-800' }
}

export default function TeamCard({
    member,
    onEdit,
    onDelete,
    loading = false
}) {
    const departmentConfig = DEPARTMENT_CONFIG[member.department] || {
        label: member.department,
        color: 'bg-gray-100 text-gray-800'
    }

    const handleDelete = () => {
        if (confirm(`¿Estás seguro de eliminar a ${member.name}?`)) {
            onDelete(member.id)
        }
    }

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 bg-white">
            {/* Photo Section - Centered */}
            <div className="flex gap-4 items-center mb-4">
                {member.photo ? (
                    <img
                        src={member.photo}
                        alt={`Foto de ${member.name}`}
                        className="w-24 h-24 md:w-48 md:h-48 object-cover rounded-full border-2 border-gray-200 shadow-sm mb-3"
                        onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                        }}
                    />
                ) : null}
                <div
                    className={`w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center text-teal-600 text-2xl border-2 border-gray-200 mb-3 ${member.photo ? 'hidden' : 'flex'
                        }`}
                >
                    👤
                </div>

                {/* Member Info - Centered */}
                <div className="text-center mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {member.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                        {member.role}
                    </p>
                    <span className={`inline-block text-xs px-3 py-1 rounded-full ${departmentConfig.color}`}>
                        {departmentConfig.label}
                    </span>
                </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4 text-center">
                <div className="flex items-center justify-center text-sm text-gray-600">
                    <span className="mr-2">📞</span>
                    <span className="truncate">{member.phone}</span>
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                    <span className="mr-2">📧</span>
                    <span className="truncate">{member.email}</span>
                </div>

            </div>

            {/* Action Buttons - Centered */}
            <div className="flex justify-center gap-2 mb-4">
                <button
                    onClick={() => onEdit(member)}
                    disabled={loading}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                    title="Editar colaborador"
                >
                    <span>✏️</span>
                    <span className="text-sm font-medium">Editar</span>
                </button>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                    title="Eliminar colaborador"
                >
                    <span>🗑️</span>
                    <span className="text-sm font-medium">Eliminar</span>
                </button>
            </div>

            {/* Contact Actions */}
            <div className="border-t pt-3">
                <ContactActions
                    email={member.email}
                    phone={member.phone}
                    name={member.name}
                    context="team"
                />
            </div>
        </div>
    )
}