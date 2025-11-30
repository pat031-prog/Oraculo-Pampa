@echo off
REM Script de inicio para Windows - Oráculo Pampa Portable

echo.
echo ========================================
echo   ORACULO PAMPA v2.0 - Portable
echo ========================================
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no esta instalado.
    echo Por favor instala Node.js desde https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Verificar si existe la carpeta dist-portable
if not exist "dist-portable" (
    echo La carpeta dist-portable no existe.
    echo Generando build portable...
    echo.

    REM Verificar si npm está disponible
    where npm >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: npm no esta disponible.
        echo Por favor instala Node.js desde https://nodejs.org/
        echo.
        pause
        exit /b 1
    )

    REM Instalar dependencias si no existen
    if not exist "node_modules" (
        echo Instalando dependencias...
        call npm install
        if %ERRORLEVEL% NEQ 0 (
            echo ERROR: Fallo al instalar dependencias
            pause
            exit /b 1
        )
    )

    REM Hacer el build
    echo Creando build portable...
    call npm run build:portable
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Fallo al crear el build
        pause
        exit /b 1
    )
    echo.
    echo Build completado!
    echo.
)

REM Iniciar el servidor
echo Iniciando servidor portable...
echo.
node servidor-portable.cjs

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: El servidor fallo al iniciar
    pause
    exit /b 1
)

pause
