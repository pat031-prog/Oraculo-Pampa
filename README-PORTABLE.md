# 📦 Oráculo Pampa v2.0 - Versión Portable

Esta es la **versión portable** de Oráculo Pampa, diseñada para ejecutarse con mínimas dependencias y sin necesidad de instalar todas las herramientas de desarrollo.

## 🚀 Inicio Rápido

### Requisitos
- **Node.js** (versión 14 o superior) - Solo para el servidor HTTP
- **Navegador web moderno** (Chrome, Firefox, Edge, Safari)
- **API Key de Google Gemini** ([Obtener aquí](https://aistudio.google.com/apikey))

### Pasos para Ejecutar

#### Opción 1: Usando el Servidor Portable (Recomendado)

1. **Descarga o clona el repositorio**
   ```bash
   git clone [URL-DEL-REPOSITORIO]
   cd Oraculo-Pampa
   ```

2. **Genera el build portable (solo la primera vez)**
   ```bash
   npm install
   npm run build:portable
   ```

3. **Ejecuta el servidor portable**
   ```bash
   node servidor-portable.js
   ```

   O usando npm:
   ```bash
   npm run start:portable
   ```

4. **Abre tu navegador**
   - Ve a: `http://localhost:3000`
   - La primera vez te pedirá tu API key de Google Gemini
   - Ingresa tu API key (se guardará en localStorage)

#### Opción 2: Distribuir la Carpeta Portable

Si quieres distribuir la aplicación a otros usuarios sin que tengan que hacer el build:

1. **Copia estos archivos/carpetas a una ubicación:**
   ```
   📁 oraculo-pampa-portable/
   ├── 📁 dist-portable/        (carpeta completa)
   ├── 📄 servidor-portable.js
   └── 📄 README-PORTABLE.md     (este archivo)
   ```

2. **Los usuarios solo necesitan:**
   - Tener Node.js instalado
   - Ejecutar: `node servidor-portable.js`
   - Abrir el navegador en `http://localhost:3000`

## 🔑 Configuración de la API Key

### Primera Vez
Al abrir la aplicación por primera vez, aparecerá un prompt solicitando tu API key de Google Gemini.

**¿Dónde obtener la API key?**
1. Ve a https://aistudio.google.com/apikey
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API key (o usa una existente)
4. Copia la key y pégala en el prompt

### Gestión de la API Key

La API key se guarda en el **localStorage** de tu navegador. Puedes gestionarla usando la consola del navegador:

**Actualizar la API key:**
```javascript
updateApiKey()
```

**Eliminar la API key:**
```javascript
clearApiKey()
```

Luego recarga la página para que los cambios surtan efecto.

## 🛠️ Personalización

### Cambiar el Puerto del Servidor

Por defecto el servidor usa el puerto **3000**. Para cambiarlo:

```bash
PORT=8080 node servidor-portable.js
```

### Usar un Servidor HTTP Alternativo

Si no quieres usar Node.js, puedes servir la carpeta `dist-portable` con cualquier servidor HTTP:

**Python 3:**
```bash
cd dist-portable
python -m http.server 3000
```

**Python 2:**
```bash
cd dist-portable
python -m SimpleHTTPServer 3000
```

**PHP:**
```bash
cd dist-portable
php -S localhost:3000
```

## 📂 Estructura de la Versión Portable

```
dist-portable/
├── index.html              # Punto de entrada
├── portable-config.js      # Configuración de API key
└── assets/
    └── index-[hash].js     # Bundle de la aplicación
```

## 🔒 Seguridad y Privacidad

- **La API key se guarda localmente** en tu navegador (localStorage)
- **No se envía a ningún servidor** excepto a la API de Google Gemini
- **Los archivos PDF** se procesan localmente en tu navegador
- **No se requiere backend** - Todo funciona en el cliente

## ⚠️ Solución de Problemas

### El servidor no inicia
- Verifica que Node.js esté instalado: `node --version`
- Verifica que el puerto no esté en uso
- Intenta con otro puerto: `PORT=8080 node servidor-portable.js`

### La API key no funciona
- Verifica que la key sea válida en https://aistudio.google.com/apikey
- Actualiza la key en la consola: `updateApiKey()`
- Revisa la consola del navegador para errores

### Errores de CORS
- Usa el servidor portable incluido (`servidor-portable.js`)
- O configura CORS en tu servidor HTTP alternativo

### La aplicación no carga
- Verifica que estés accediendo desde `http://localhost:3000` y no desde `file://`
- Verifica que todos los archivos en `dist-portable` estén presentes
- Revisa la consola del navegador para errores

## 🆚 Diferencias con la Versión de Desarrollo

| Característica | Versión Desarrollo | Versión Portable |
|---------------|-------------------|------------------|
| **Instalación** | npm install (todas las deps) | Solo Node.js |
| **API Key** | Variable de entorno (.env) | Prompt interactivo |
| **Servidor** | Vite dev server | Servidor HTTP simple |
| **Build** | No requerido | Pre-compilado |
| **Hot Reload** | ✅ Sí | ❌ No |
| **Source Maps** | ✅ Sí | ❌ No |
| **Tamaño** | ~300MB (node_modules) | ~250KB (dist) |

## 📝 Notas Adicionales

### Reconstruir la Versión Portable

Si haces cambios al código fuente, regenera el build:

```bash
npm run build:portable
```

### Uso Sin Internet (Limitado)

La aplicación **requiere internet** para:
- Conectar con la API de Google Gemini
- Cargar bibliotecas desde CDN (Tailwind, Recharts, PDF.js)

No es posible usarla completamente offline.

### Performance

La versión portable está optimizada para producción:
- Código minificado
- Tree-shaking aplicado
- Assets optimizados
- Sin sourcemaps para reducir tamaño

## 📞 Soporte

Si tienes problemas con la versión portable:
1. Revisa la sección de **Solución de Problemas**
2. Verifica la consola del navegador para errores
3. Abre un issue en el repositorio con los detalles

---

**¡Listo para explorar el futuro con Oráculo Pampa! 🔮✨**
