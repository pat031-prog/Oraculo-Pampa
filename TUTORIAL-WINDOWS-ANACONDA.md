# 🪟 Tutorial: Oráculo Pampa en Windows con Anaconda

Guía paso a paso para ejecutar Oráculo Pampa v2.0 con Monitor de Bifurcación en Windows usando Anaconda.

---

## 📋 Requisitos Previos

- ✅ Windows 10/11
- ✅ Anaconda instalado ([Descargar aquí](https://www.anaconda.com/download))
- ✅ Git instalado ([Descargar aquí](https://git-scm.com/download/win))
- ✅ Al menos una API key (recomendado: Google Gemini - GRATIS)

---

## 🚀 Paso 1: Obtener API Keys (GRATIS)

### Opción 1: Google Gemini (Recomendado - Más Generoso)

1. Ve a: https://aistudio.google.com/apikey
2. Inicia sesión con tu cuenta Google
3. Click en **"Create API Key"**
4. Copia la key que aparece (empieza con `AIza...`)

### Opción 2: Groq (Muy Rápido - GRATIS)

1. Ve a: https://console.groq.com/keys
2. Crea una cuenta
3. Click en **"Create API Key"**
4. Copia la key

### Opción 3: DeepInfra (Alternativa)

1. Ve a: https://deepinfra.com/dash/api_keys
2. Regístrate
3. Crea una API key
4. Copia la key

**💡 Tip:** Puedes configurar múltiples APIs para tener fallback automático.

---

## 🔧 Paso 2: Clonar el Repositorio

### 2.1. Abrir Anaconda Prompt

1. Presiona `Win + S`
2. Busca **"Anaconda Prompt"**
3. Click derecho → **"Ejecutar como administrador"** (opcional pero recomendado)

### 2.2. Navegar a tu carpeta de proyectos

```bash
# Ejemplo: ir a Documentos
cd C:\Users\TuUsuario\Documents

# O crear una carpeta para proyectos
mkdir proyectos
cd proyectos
```

### 2.3. Clonar el repositorio

```bash
git clone https://github.com/pat031-prog/Oraculo-Pampa.git
cd Oraculo-Pampa
```

**Nota:** Si no tienes git, descarga el ZIP desde GitHub y descomprímelo.

---

## 🌐 Paso 3: Crear Entorno Conda con Node.js

### 3.1. Crear entorno virtual con Node.js

```bash
# Crear entorno llamado "oraculo" con Node.js 20
conda create -n oraculo nodejs=20 -c conda-forge -y
```

### 3.2. Activar el entorno

```bash
conda activate oraculo
```

**Deberías ver `(oraculo)` al inicio de tu línea de comandos.**

### 3.3. Verificar instalación

```bash
node --version
# Debería mostrar: v20.x.x

npm --version
# Debería mostrar: 10.x.x
```

---

## 📦 Paso 4: Instalar Dependencias y Construir

### 4.1. Instalar dependencias del proyecto

```bash
npm install
```

**Esto tomará 1-2 minutos.**

### 4.2. Construir la versión portable

```bash
npm run build:portable
```

**Deberías ver:**
```
✓ built in 1.12s
dist-portable/index.html
dist-portable/assets/index-xxxxx.js
```

---

## 🎯 Paso 5: Iniciar el Servidor

### Opción A: Script Automático (Más Fácil)

```bash
# Simplemente ejecuta:
INICIAR.bat
```

**¡Eso es todo!** El script hará todo automáticamente.

### Opción B: Manual

```bash
node servidor-portable.js
```

**Deberías ver:**
```
═══════════════════════════════════════════════════════════════
  🌟 ORÁCULO PAMPA v2.0 - Servidor Portable
═══════════════════════════════════════════════════════════════

  ✓ Servidor ejecutándose en: http://localhost:3000
  ✓ Directorio: C:\...\Oraculo-Pampa\dist-portable

  📝 Instrucciones:
     1. Abre tu navegador en http://localhost:3000
     2. La primera vez te pedirá tu API key de Google Gemini
     3. Obtén tu API key en: https://aistudio.google.com/apikey

  🛑 Para detener el servidor: Ctrl+C

═══════════════════════════════════════════════════════════════
```

---

## 🌐 Paso 6: Abrir en el Navegador

1. Abre tu navegador (Chrome, Edge, Firefox)
2. Ve a: **http://localhost:3000**

### Primera Vez: Configuración de APIs

Te aparecerá un diálogo de configuración:

```
🔑 Configuración de API Multi-Proveedor

Oráculo Pampa soporta múltiples proveedores de IA:

1. Google Gemini (https://aistudio.google.com/apikey)
2. Groq (https://console.groq.com/keys)
3. DeepInfra (https://deepinfra.com/dash/api_keys)
4. OpenAI (https://platform.openai.com/api-keys)
5. Anthropic Claude (https://console.anthropic.com/)

Para empezar rápido, configura Gemini (GRATIS):
```

**Click "Aceptar"** y pega tu API key de Gemini.

---

## 🔬 Paso 7: Usar el Monitor de Bifurcación

### 7.1. Navegar al Monitor

1. En el panel izquierdo, click en **"🔬 Monitor de Bifurcación"**

### 7.2. Configurar Múltiples APIs (Opcional)

Abre la consola del navegador (`F12` → pestaña "Console") y ejecuta:

```javascript
// Ver configuración actual
configureApis()

// O agregar APIs directamente:
addGemini("TU_API_KEY_GEMINI")
addGroq("TU_API_KEY_GROQ")
addDeepInfra("TU_API_KEY_DEEPINFRA")
```

### 7.3. Probar con Texto de Ejemplo

**Ejemplo 1 - Texto Normal (debería ser ESTABLE):**

```
El mercado argentino mostró estabilidad durante el último trimestre.
Las exportaciones agrícolas mantienen su tendencia histórica.
La inflación se encuentra dentro de los parámetros esperados.
```

Click **"Analizar Documento"** → Debería marcar como ✓ **Estable**

**Ejemplo 2 - Texto con Alta Entropía (debería detectar BIFURCACIÓN):**

```
ALERTA CRÍTICA: Colapso inesperado de la infraestructura de red cuántica.
Evento de cisne negro en el sector financiero provoca hiperinflación instantánea.
Ruptura del contrato social. Tecnología blockchain declarada obsoleta por computación
neuronal no-localizada. Paradigma económico tradicional completamente invalidado.
Transición de fase irreversible detectada en el tejido socioeconómico.
```

Click **"Analizar Documento"** → Debería detectar ⚠️ **BIFURCACIÓN**

### 7.4. Probar con PDF

1. Click en **"Choose File"**
2. Selecciona un PDF (ej: un reporte económico, paper científico)
3. Espera a que se cargue
4. Click **"Analizar Documento"**
5. Observa el **Z-Score** y la clasificación

---

## 📊 Paso 8: Interpretar Resultados

### Métricas Clave:

| Métrica | Qué Significa | Valor Normal | Valor Crítico |
|---------|---------------|--------------|---------------|
| **Entropy Index** | Complejidad informacional | 0.4 - 0.7 | > 0.85 |
| **Z-Score** | Desviación del historial | -1 a +2 | > 2.5 |
| **Nodos** | Conceptos únicos | Crece gradualmente | Salto brusco |
| **Complejidad** | Densidad del grafo | 0.1 - 0.5 | > 0.7 |

### Interpretación de Severidad:

- 🟢 **STABLE** (Z < 2.5): Información consistente con el paradigma actual
- 🟡 **WARNING** (2.5 ≤ Z < 3.75): Información anómala, requiere atención
- 🔴 **CRITICAL** (Z ≥ 3.75): Bifurcación detectada - Cambio de paradigma

---

## 🛠️ Comandos Útiles

### En Anaconda Prompt:

```bash
# Activar entorno
conda activate oraculo

# Iniciar servidor
node servidor-portable.js

# O usar el script
INICIAR.bat

# Detener servidor
Ctrl + C

# Rebuild (si modificas código)
npm run build:portable

# Ver logs en tiempo real
# (El servidor ya muestra logs automáticamente)
```

### En la Consola del Navegador (F12):

```javascript
// Ver todas las APIs configuradas
configureApis()

// Agregar API
addGemini("tu_api_key")
addGroq("tu_api_key")
addDeepInfra("tu_api_key")
addOpenAI("tu_api_key")
addAnthropic("tu_api_key")

// Eliminar un proveedor
removeApi("gemini")

// Eliminar todas
clearAllApis()

// Ver configuración (tabla)
console.table(window.PortableConfig.getApiConfigs())
```

---

## 🐛 Solución de Problemas

### Problema 1: "node no se reconoce como comando"

**Solución:**
```bash
# Asegúrate de estar en el entorno conda
conda activate oraculo

# Verifica que Node esté instalado
conda list nodejs
```

### Problema 2: "Error: Cannot find module 'X'"

**Solución:**
```bash
# Reinstala dependencias
npm install

# Si persiste, limpia caché
npm cache clean --force
npm install
```

### Problema 3: "Port 3000 already in use"

**Solución:**
```bash
# Usa otro puerto
set PORT=8080
node servidor-portable.js

# O mata el proceso en puerto 3000:
netstat -ano | findstr :3000
# Anota el PID (última columna)
taskkill /PID <numero> /F
```

### Problema 4: "API key not working"

**Solución:**
1. Verifica que la key sea correcta (cópiala de nuevo)
2. En la consola del navegador:
```javascript
clearAllApis()
addGemini("TU_KEY_CORRECTA")
```
3. Recarga la página (`F5`)

### Problema 5: "Bifurcation Monitor no aparece"

**Solución:**
```bash
# Verifica que el build esté actualizado
npm run build:portable

# Reinicia el servidor
# Ctrl+C para detener
node servidor-portable.js
```

---

## 📚 Próximos Pasos

### 1. Experimenta con Diferentes Documentos

- Reportes económicos
- Papers científicos
- Artículos de noticias
- Documentos técnicos

### 2. Compara Proveedores de IA

Configura múltiples APIs y prueba cuál extrae mejores entidades:

```javascript
// Gemini suele ser mejor para español
// Groq es el más rápido
// Claude (Anthropic) es el más preciso
```

### 3. Monitorea Feeds en Tiempo Real

Crea un workflow:
1. Carga documento base (ej: reporte mensual anterior)
2. Carga documento nuevo (reporte actual)
3. Observa si hay bifurcación

### 4. Exporta Resultados

Copia los eventos críticos del historial para análisis posterior.

---

## 🎓 Recursos Adicionales

### Documentación

- **README principal**: Conceptos del GYOA Reflex Stack
- **README-PORTABLE.md**: Detalles de la versión portable
- **Código fuente**: Comentarios explicativos en cada archivo

### APIs Recomendadas (Todas GRATIS con límites generosos)

| Proveedor | Límite Gratuito | Velocidad | Mejor Para |
|-----------|-----------------|-----------|------------|
| **Gemini** | 60 req/min | Rápida | Español, multimodal |
| **Groq** | 30 req/min | Muy rápida | Velocidad |
| **DeepInfra** | 1000 req/día | Media | Modelos open-source |

---

## 💡 Consejos Pro

1. **Configura múltiples APIs** para fallback automático
2. **Usa Groq para testing rápido** (es el más veloz)
3. **Usa Gemini para producción** (mejor balance calidad/velocidad)
4. **Procesa documentos en lotes** para ver patrones evolutivos
5. **Exporta el historial** antes de limpiar datos

---

## 📞 Soporte

Si tienes problemas:

1. Revisa esta guía completa
2. Verifica la consola del navegador (`F12`) para errores
3. Verifica la terminal de Anaconda para logs del servidor
4. Abre un issue en GitHub con:
   - Sistema operativo y versión
   - Versión de Node (`node --version`)
   - Error completo (captura de pantalla)

---

## 🎉 ¡Listo!

Ahora tienes un **detector de Cisnes Negros** basado en Teoría de la Información corriendo en tu Windows.

**¡A detectar bifurcaciones! 🦢🔬**

---

**Última actualización:** 2025-01-30
**Versión:** Oráculo Pampa v2.0 con Monitor de Bifurcación
