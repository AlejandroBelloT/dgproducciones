// src/app/api/proxy/[...slug]/route.js
// Proxy para conectar con la API de cPanel durante desarrollo

const API_BASE = 'https://dgproducciones.cl/api';
const API_KEY = 'dgproducciones_api_key_2025';

async function handler(request, { params }) {
    const { slug } = params;
    const endpoint = Array.isArray(slug) ? slug.join('/') : slug;

    try {
        // Construir URL de destino
        const targetUrl = `${API_BASE}/${endpoint}`;
        const url = new URL(request.url);
        const searchParams = url.searchParams.toString();
        const finalUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl;

        console.log('🔄 Proxy request:', {
            method: request.method,
            endpoint,
            targetUrl: finalUrl
        });

        // Preparar headers
        const headers = {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY,
        };

        // Configurar request
        const requestConfig = {
            method: request.method,
            headers,
        };

        // Agregar body si no es GET
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            const body = await request.text();
            if (body) {
                requestConfig.body = body;
            }
        }

        // Hacer la petición a cPanel
        const response = await fetch(finalUrl, requestConfig);
        const data = await response.text();

        console.log('✅ Proxy response:', {
            status: response.status,
            dataLength: data.length
        });

        // Si es 404, significa que la API no está instalada en cPanel
        if (response.status === 404) {
            console.log('⚠️ API no encontrada en cPanel - usando fallback');

            // Fallback temporal con datos vacíos pero estructura correcta
            const fallbackData = {
                status: 200,
                message: 'API no instalada en cPanel - usando datos temporales',
                data: [],
                timestamp: new Date().toISOString(),
                note: 'Sube los archivos api-server/ a public_html/api/ en cPanel'
            };

            return new Response(JSON.stringify(fallbackData), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
                },
            });
        }

        // Retornar respuesta
        return new Response(data, {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
            },
        });

    } catch (error) {
        console.error('❌ Proxy error:', error);

        return new Response(
            JSON.stringify({
                status: 500,
                message: 'Error en proxy: ' + error.message,
                data: null
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };