# ⚡ Inicio Rápido - Windows + Anaconda

## 🎯 3 Pasos para Empezar

### 1️⃣ Obtén tu API Key (2 minutos)

Ve a: https://aistudio.google.com/apikey

→ Click en **"Create API Key"**
→ Copia la key (empieza con `AIza...`)

---

### 2️⃣ Abre Anaconda Prompt

```bash
# Crear entorno con Node.js
conda create -n oraculo nodejs=20 -c conda-forge -y

# Activar entorno
conda activate oraculo

# Clonar proyecto
git clone https://github.com/pat031-prog/Oraculo-Pampa.git
cd Oraculo-Pampa

# Instalar y construir
npm install
npm run build:portable
```

---

### 3️⃣ Ejecutar

```bash
# Opción A: Script automático
INICIAR.bat

# Opción B: Manual
node servidor-portable.js
```

→ Abre: **http://localhost:3000**
→ Pega tu API key cuando te la pida
→ ¡Listo!

---

## 🔬 Probar el Monitor de Bifurcación

### Click en: **🔬 Monitor de Bifurcación**

### Ejemplo 1 - Texto Normal:
```
El mercado mostró estabilidad.
Las exportaciones mantienen su tendencia.
```
→ Resultado: ✓ **ESTABLE**

### Ejemplo 2 - Cisne Negro:
```
COLAPSO CRÍTICO: Hiperinflación instantánea por evento cuántico.
Ruptura del paradigma económico. Transición de fase irreversible.
```
→ Resultado: ⚠️ **BIFURCACIÓN DETECTADA**

---

## 🎮 Comandos de Consola

Presiona `F12` en el navegador → Pestaña "Console":

```javascript
// Configurar múltiples APIs
configureApis()

// Agregar proveedores
addGemini("tu_api_key")
addGroq("tu_api_key")
addDeepInfra("tu_api_key")

// Ver configuración
console.table(window.PortableConfig.getApiConfigs())
```

---

## 🆘 Ayuda Rápida

**Servidor no inicia?**
```bash
conda activate oraculo
node --version  # Debe mostrar v20.x.x
```

**Puerto ocupado?**
```bash
set PORT=8080
node servidor-portable.js
```

**API key no funciona?**
```javascript
// En consola del navegador (F12)
clearAllApis()
addGemini("TU_KEY_CORRECTA")
// Recarga la página (F5)
```

---

## 📚 Documentación Completa

→ **TUTORIAL-WINDOWS-ANACONDA.md**: Tutorial detallado paso a paso
→ **README-PORTABLE.md**: Documentación técnica completa
→ **README.md**: Conceptos del GYOA Reflex Stack

---

**¡A detectar Cisnes Negros! 🦢🔬**
