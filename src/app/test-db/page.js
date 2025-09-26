'use client'

import { useEffect, useState } from 'react'

export default function TestDatabase() {
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)

    const testConnection = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/test-db')
            const data = await response.json()
            setResult(JSON.stringify(data, null, 2))
        } catch (error) {
            setResult(`Error: ${error.message}`)
        }
        setLoading(false)
    }

    useEffect(() => {
        testConnection()
    }, [])

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">🔍 Test de Conexión a Base de Datos</h1>

            <button
                onClick={testConnection}
                disabled={loading}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? 'Probando...' : 'Probar Conexión'}
            </button>

            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {result || 'Cargando...'}
            </pre>

            <div className="mt-4 text-sm text-gray-600">
                <p>Esta página de prueba verifica:</p>
                <ul className="list-disc ml-6">
                    <li>Si las variables de entorno están configuradas</li>
                    <li>Si MySQL está corriendo</li>
                    <li>Si las credenciales son correctas</li>
                    <li>Si la base de datos &apos;dgproducciones&apos; existe</li>
                </ul>
            </div>
        </div>
    )
}