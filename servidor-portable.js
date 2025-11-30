#!/usr/bin/env node
/**
 * Servidor HTTP Simple para Oráculo Pampa (Versión Portable)
 *
 * Este servidor usa solo módulos nativos de Node.js, sin dependencias externas.
 * Permite ejecutar la aplicación sin necesidad de instalar npm packages.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuración
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist-portable');

// Tipos MIME
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
};

/**
 * Obtener el tipo MIME basado en la extensión del archivo
 */
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
}

/**
 * Servir archivos estáticos
 */
function serveFile(res, filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 - Archivo no encontrado');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Error del servidor');
            }
            return;
        }

        const mimeType = getMimeType(filePath);
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
    });
}

/**
 * Crear el servidor HTTP
 */
const server = http.createServer((req, res) => {
    // Agregar headers CORS para desarrollo
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Parsear la URL
    let urlPath = req.url.split('?')[0];

    // Si es la raíz, servir index.html
    if (urlPath === '/') {
        urlPath = '/index.html';
    }

    // Construir la ruta completa del archivo
    const filePath = path.join(DIST_DIR, urlPath);

    // Verificar que el archivo esté dentro del directorio dist
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(DIST_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 - Acceso prohibido');
        return;
    }

    // Verificar si el archivo existe
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Si no es un archivo, intentar servir index.html (para SPA routing)
            const indexPath = path.join(DIST_DIR, 'index.html');
            serveFile(res, indexPath);
        } else {
            // Servir el archivo
            serveFile(res, filePath);
        }
    });
});

/**
 * Iniciar el servidor
 */
server.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  🌟 ORÁCULO PAMPA v2.0 - Servidor Portable');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log(`  ✓ Servidor ejecutándose en: http://localhost:${PORT}`);
    console.log(`  ✓ Directorio: ${DIST_DIR}`);
    console.log('');
    console.log('  📝 Instrucciones:');
    console.log('     1. Abre tu navegador en http://localhost:' + PORT);
    console.log('     2. La primera vez te pedirá tu API key de Google Gemini');
    console.log('     3. Obtén tu API key en: https://aistudio.google.com/apikey');
    console.log('');
    console.log('  🛑 Para detener el servidor: Ctrl+C');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
});

/**
 * Manejo de errores
 */
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: El puerto ${PORT} ya está en uso.`);
        console.error(`   Intenta con otro puerto: PORT=3001 node servidor-portable.js\n`);
    } else {
        console.error('\n❌ Error del servidor:', err.message, '\n');
    }
    process.exit(1);
});

/**
 * Manejo de señales de terminación
 */
process.on('SIGINT', () => {
    console.log('\n\n✓ Servidor detenido correctamente.\n');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n✓ Servidor detenido correctamente.\n');
    process.exit(0);
});
