#!/bin/bash
# Script de inicio para Linux/Mac - Oráculo Pampa Portable

echo ""
echo "========================================"
echo "  ORACULO PAMPA v2.0 - Portable"
echo "========================================"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js no está instalado."
    echo "   Por favor instala Node.js desde https://nodejs.org/"
    echo ""
    exit 1
fi

# Mostrar versión de Node.js
NODE_VERSION=$(node --version)
echo "✓ Node.js detectado: $NODE_VERSION"
echo ""

# Verificar si existe la carpeta dist-portable
if [ ! -d "dist-portable" ]; then
    echo "⚠️  La carpeta dist-portable no existe."
    echo "   Generando build portable..."
    echo ""

    # Verificar si npm está disponible
    if ! command -v npm &> /dev/null; then
        echo "❌ ERROR: npm no está disponible."
        echo "   Por favor instala Node.js desde https://nodejs.org/"
        echo ""
        exit 1
    fi

    # Instalar dependencias si no existen
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependencias..."
        npm install
        if [ $? -ne 0 ]; then
            echo ""
            echo "❌ ERROR: Falló la instalación de dependencias"
            exit 1
        fi
        echo ""
    fi

    # Hacer el build
    echo "🔨 Creando build portable..."
    npm run build:portable
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ ERROR: Falló la creación del build"
        exit 1
    fi
    echo ""
    echo "✓ Build completado!"
    echo ""
fi

# Iniciar el servidor
echo "🚀 Iniciando servidor portable..."
echo ""

node servidor-portable.cjs

# Si el servidor falla
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ ERROR: El servidor falló al iniciar"
    exit 1
fi
