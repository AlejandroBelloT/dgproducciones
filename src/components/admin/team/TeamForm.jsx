import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const DEPARTMENTS = [
    { value: 'produccion', label: '🎭 Producción' },
    { value: 'comercial', label: '💼 Comercial' },
    { value: 'administracion', label: '📊 Administración' },
    { value: 'creativo', label: '🎨 Creativo' }
]

const INITIAL_FORM_DATA = {
    name: '',
    role: '',
    phone: '',
    email: '',
    photo: null,
    department: 'produccion'
}

export default function TeamForm({
    isVisible,
    editingMember,
    onSubmit,
    onCancel,
    loading = false
}) {
    const [formData, setFormData] = useState(
        editingMember || INITIAL_FORM_DATA
    )
    const [photoPreview, setPhotoPreview] = useState(
        editingMember?.photo || null
    )
    const [errors, setErrors] = useState({})

    // Handle form field changes
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }))
        }
    }

    // Handle photo upload
    const handlePhotoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    photo: 'Solo se permiten archivos JPG y PNG'
                }))
                return
            }

            // Validate file size (5MB)
            const maxSize = 5 * 1024 * 1024
            if (file.size > maxSize) {
                setErrors(prev => ({
                    ...prev,
                    photo: 'El archivo es demasiado grande. Máximo 5MB'
                }))
                return
            }

            setFormData(prev => ({ ...prev, photo: file }))
            setPhotoPreview(URL.createObjectURL(file))
            setErrors(prev => ({ ...prev, photo: null }))
        }
    }

    // Validate form
    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido'
        }

        if (!formData.role.trim()) {
            newErrors.role = 'El rol es requerido'
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El email no es válido'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        const formDataToSend = new FormData()
        formDataToSend.append('name', formData.name.trim())
        formDataToSend.append('role', formData.role.trim())
        formDataToSend.append('phone', formData.phone.trim())
        formDataToSend.append('email', formData.email.trim())
        formDataToSend.append('department', formData.department)

        if (formData.photo) {
            formDataToSend.append('photo', formData.photo)
        }

        if (editingMember) {
            formDataToSend.append('id', editingMember.id)
        }

        const result = await onSubmit(formDataToSend, editingMember ? 'update' : 'create')

        if (result.success) {
            resetForm()
        } else {
            // Handle server errors
            setErrors(prev => ({
                ...prev,
                submit: result.error || 'Error al guardar el colaborador'
            }))
        }
    }

    // Reset form to initial state
    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA)
        setPhotoPreview(null)
        setErrors({})
    }

    // Handle cancel
    const handleCancel = () => {
        resetForm()
        onCancel()
    }

    if (!isVisible) return null

    return (
        <Card className="shadow-lg">
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl">
                    {editingMember ? 'Editar Colaborador' : 'Nuevo Colaborador'}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {errors.submit}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Left Column */}
                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base ${errors.name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Ej: Juan Pérez"
                                    disabled={loading}
                                />
                                {errors.name && (
                                    <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cargo/Rol *
                                </label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => handleChange('role', e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base ${errors.role ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Ej: Productor de Eventos"
                                    disabled={loading}
                                />
                                {errors.role && (
                                    <p className="text-red-600 text-xs mt-1">{errors.role}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Departamento
                                </label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => handleChange('department', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base"
                                    disabled={loading}
                                >
                                    {DEPARTMENTS.map(dept => (
                                        <option key={dept.value} value={dept.value}>
                                            {dept.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base ${errors.phone ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="+56 9 XXXX XXXX"
                                    disabled={loading}
                                />
                                {errors.phone && (
                                    <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base ${errors.email ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="nombre@dgproducciones.cl"
                                    disabled={loading}
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto de Perfil
                                </label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={handlePhotoChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                                    disabled={loading}
                                />
                                {errors.photo && (
                                    <p className="text-red-600 text-xs mt-1">{errors.photo}</p>
                                )}
                                {photoPreview && (
                                    <div className="mt-2">
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="w-full sm:flex-1 md:flex-none"
                        >
                            {loading ? 'Guardando...' :
                                editingMember ? 'Actualizar Colaborador' : 'Agregar Colaborador'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}