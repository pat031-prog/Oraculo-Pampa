#!/usr/bin/env node
/**
 * Script de Validación para Oráculo Pampa
 *
 * Verifica que todo esté configurado correctamente antes de iniciar.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║  🔍 ORÁCULO PAMPA - Validación de Setup              ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

let allChecksPass = true;

/**
 * Check 1: Node.js version
 */
console.log('✓ Verificando Node.js...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion >= 14) {
    console.log(`  ✅ Node.js ${nodeVersion} (OK)\n`);
} else {
    console.log(`  ❌ Node.js ${nodeVersion} (Requiere >= 14.x)\n`);
    allChecksPass = false;
}

/**
 * Check 2: Required directories
 */
console.log('✓ Verificando estructura de archivos...');
const requiredDirs = [
    'components',
    'components/sections',
    'services',
    'public'
];

requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`  ✅ /${dir}`);
    } else {
        console.log(`  ❌ /${dir} (faltante)`);
        allChecksPass = false;
    }
});
console.log('');

/**
 * Check 3: Required files
 */
console.log('✓ Verificando archivos críticos...');
const requiredFiles = [
    'index.html',
    'App.tsx',
    'types.ts',
    'constants.ts',
    'servidor-portable.js',
    'public/portable-config.js',
    'services/bifurcationService.ts',
    'services/multiApiService.ts',
    'components/sections/BifurcationMonitorSection.tsx'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} (faltante)`);
        allChecksPass = false;
    }
});
console.log('');

/**
 * Check 4: Dependencies
 */
console.log('✓ Verificando dependencias...');
const packageJsonPath = path.join(__dirname, 'package.json');

if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log(`  ✅ package.json encontrado`);

    const hasReact = packageJson.dependencies && packageJson.dependencies['react'];
    const hasReactDom = packageJson.dependencies && packageJson.dependencies['react-dom'];

    if (hasReact && hasReactDom) {
        console.log(`  ✅ React ${packageJson.dependencies['react']}`);
    } else {
        console.log(`  ❌ Dependencias de React faltantes`);
        allChecksPass = false;
    }

    const hasVite = packageJson.devDependencies && packageJson.devDependencies['vite'];
    if (hasVite) {
        console.log(`  ✅ Vite ${packageJson.devDependencies['vite']}`);
    } else {
        console.log(`  ❌ Vite faltante`);
        allChecksPass = false;
    }
} else {
    console.log(`  ❌ package.json no encontrado`);
    allChecksPass = false;
}
console.log('');

/**
 * Check 5: node_modules
 */
console.log('✓ Verificando node_modules...');
if (fs.existsSync('node_modules')) {
    console.log(`  ✅ node_modules instalado\n`);
} else {
    console.log(`  ⚠️  node_modules no encontrado`);
    console.log(`     Ejecuta: npm install\n`);
    allChecksPass = false;
}

/**
 * Check 6: Build directory
 */
console.log('✓ Verificando build portable...');
if (fs.existsSync('dist-portable')) {
    const hasIndexHtml = fs.existsSync('dist-portable/index.html');
    const hasAssets = fs.existsSync('dist-portable/assets');
    const hasConfig = fs.existsSync('dist-portable/portable-config.js');

    if (hasIndexHtml && hasAssets && hasConfig) {
        console.log(`  ✅ Build portable completo\n`);
    } else {
        console.log(`  ⚠️  Build portable incompleto`);
        console.log(`     Ejecuta: npm run build:portable\n`);
        allChecksPass = false;
    }
} else {
    console.log(`  ⚠️  dist-portable no encontrado`);
    console.log(`     Ejecuta: npm run build:portable\n`);
    allChecksPass = false;
}

/**
 * Check 7: Port availability
 */
console.log('✓ Verificando disponibilidad del puerto 3000...');
const testServer = http.createServer();

testServer.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`  ⚠️  Puerto 3000 en uso`);
        console.log(`     Usa: set PORT=8080 && node servidor-portable.js\n`);
    } else {
        console.log(`  ⚠️  Error al verificar puerto: ${err.message}\n`);
    }
});

testServer.once('listening', () => {
    console.log(`  ✅ Puerto 3000 disponible\n`);
    testServer.close();
});

testServer.listen(3000);

// Wait for port check to complete
setTimeout(() => {
    /**
     * Final summary
     */
    console.log('═══════════════════════════════════════════════════════\n');

    if (allChecksPass) {
        console.log('🎉 ¡TODO LISTO!\n');
        console.log('Próximos pasos:\n');
        console.log('  1. Ejecuta: node servidor-portable.js');
        console.log('  2. Abre: http://localhost:3000');
        console.log('  3. Configura tu API key de Gemini\n');
        console.log('📚 Lee TUTORIAL-WINDOWS-ANACONDA.md para más detalles\n');
    } else {
        console.log('⚠️  SETUP INCOMPLETO\n');
        console.log('Acciones requeridas:\n');
        console.log('  1. npm install');
        console.log('  2. npm run build:portable');
        console.log('  3. Revisa los errores arriba\n');
    }

    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(allChecksPass ? 0 : 1);
}, 1000);
