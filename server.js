const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

// Configuración para cPanel
const dev = false // Siempre producción en cPanel
const port = process.env.PORT || 3000
const hostname = process.env.HOST || 'localhost'

console.log('🚀 Iniciando DG Producciones...')
console.log(`📍 Puerto: ${port}`)
console.log(`🏠 Host: ${hostname}`)
console.log(`⚙️ Modo: ${dev ? 'development' : 'production'}`)

// Inicializar Next.js
const app = next({
    dev,
    hostname,
    port,
    conf: {
        // Configuración optimizada para cPanel
        poweredByHeader: false,
        generateEtags: false,
        compress: true
    }
})

const handle = app.getRequestHandler()

app.prepare()
    .then(() => {
        console.log('✅ Next.js preparado correctamente')

        const server = createServer(async (req, res) => {
            try {
                // Headers de seguridad básicos
                res.setHeader('X-Powered-By', 'DG Producciones')

                const parsedUrl = parse(req.url, true)
                await handle(req, res, parsedUrl)
            } catch (err) {
                console.error('❌ Error manejando petición:', req.url, err.message)

                // Error response
                res.statusCode = 500
                res.setHeader('Content-Type', 'text/html; charset=utf-8')
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Error Temporal - DG Producciones</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                            h1 { color: #e74c3c; }
                        </style>
                    </head>
                    <body>
                        <h1>Error Temporal</h1>
                        <p>DG Producciones está experimentando un problema técnico.</p>
                        <p>Por favor, intenta de nuevo en unos momentos.</p>
                        <hr>
                        <small>Error ID: ${Date.now()}</small>
                    </body>
                    </html>
                `)
            }
        })

        server.listen(port, hostname, (err) => {
            if (err) {
                console.error('❌ Error iniciando servidor:', err)
                throw err
            }

            console.log('🎉 ¡DG Producciones funcionando!')
            console.log(`🌐 Disponible en: http://${hostname}:${port}`)
            console.log(`📱 Modo: ${dev ? 'development' : 'production'}`)
            console.log('⏰ Iniciado:', new Date().toLocaleString())
        })

        // Manejo de señales para cierre limpio
        process.on('SIGTERM', () => {
            console.log('🛑 Cerrando servidor...')
            server.close(() => {
                console.log('✅ Servidor cerrado correctamente')
                process.exit(0)
            })
        })

    })
    .catch((err) => {
        console.error('❌ Error preparando Next.js:', err)
        process.exit(1)
    })

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err)
    process.exit(1)
})