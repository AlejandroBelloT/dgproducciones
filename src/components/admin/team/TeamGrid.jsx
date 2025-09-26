import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import TeamCard from './TeamCard'

export default function TeamGrid({
    team,
    onEdit,
    onDelete,
    loading = false,
    searchTerm = '',
    departmentFilter = 'all'
}) {
    // Filter team based on search and department
    const filteredTeam = team.filter(member => {
        const matchesSearch = !searchTerm ||
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesDepartment = departmentFilter === 'all' ||
            member.department === departmentFilter

        return matchesSearch && matchesDepartment
    })

    // Loading state
    if (loading) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                        <span className="ml-3 text-gray-600">Cargando equipo...</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Empty state
    if (team.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Directorio del Equipo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No hay colaboradores registrados
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Comienza agregando el primer miembro de tu equipo
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // No results for filters
    if (filteredTeam.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>
                        Directorio del Equipo ({team.length} colaboradores)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No se encontraron colaboradores
                        </h3>
                        <p className="text-gray-600">
                            Prueba ajustando los filtros de búsqueda
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Directorio del Equipo ({filteredTeam.length}
                    {filteredTeam.length !== team.length && ` de ${team.length}`} colaboradores)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTeam.map((member) => (
                        <TeamCard
                            key={member.id}
                            member={member}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            loading={loading}
                        />
                    ))}
                </div>

                {/* Results summary for filtered view */}
                {filteredTeam.length !== team.length && (
                    <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                        Mostrando {filteredTeam.length} de {team.length} colaboradores
                        {searchTerm && ` que coinciden con "${searchTerm}"`}
                        {departmentFilter !== 'all' && ` en ${departmentFilter}`}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}