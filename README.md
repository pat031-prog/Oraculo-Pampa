Oráculo Pampa v2.0

Una consola de prospectiva estratégica y un prototipo funcional de un "Echo Agent" neuro-simbólico.

1. Concepto Central: El "GYOA Reflex Stack"

Oráculo Pampa no es un simple dashboard o una interfaz de chat. Es una implementación de un prototipo de la arquitectura de IA "GYOA (Grow-Your-Own-AI) Reflex Stack". Este modelo fusiona un componente neural (un LLM) con un componente simbólico (la lógica de la aplicación) para producir análisis robustos, estructurados y validados.

Esta arquitectura se basa en el paradigma de equipos "Blue/Red/Purple":

Equipo Azul (Generador Neural): El motor de IA generativa (Google Gemini). Aporta el conocimiento base, la fluidez y la capacidad de síntesis creativa (generateContent y generateContentWithSearch).

Equipo Rojo (Guardián Simbólico): La lógica de la aplicación y los system prompts (constants.ts). Impone reglas estrictas, estructura, formato y restricciones al Equipo Azul. Actúa como el crítico que valida y moldea la salida.

Equipo Púrpura (Orquestador Lógico): Los componentes de React (App.tsx, LiveAnalysisSection.tsx). Orquestan el flujo, reciben la intención del usuario, fusionan las reglas del Equipo Rojo con la consulta, invocan al Equipo Azul y presentan el resultado final y refinado.

Todo el análisis se enmarca dentro del concepto de la "Quíntuple Entropía" (Tecnológica, Económica, Social, Geopolítica y Astrofísica), sirviendo como un "Echo Agent" especializado en el dominio de la prospectiva estratégica para Argentina.

2. Características y Herramientas

La aplicación está organizada en módulos que actúan como facetas especializadas de este "Echo Agent":

🧬 Síntesis Convergente (ResumenSection): Un dashboard de inicio que utiliza IA pasiva para generar alertas de alta prioridad, síntesis políticas y "micro-acciones" basadas en el contexto actual.

📡 Motor Guardián (LiveAnalysisSection): La implementación central del "GYOA Reflex Stack". Permite al usuario realizar consultas en lenguaje natural que son respondidas por el stack híbrido (Red/Blue/Purple) utilizando búsqueda web en tiempo real para un análisis fundamentado.

📚 Análisis de Documentos (DocumentAnalysisSection): Una demostración de la computación en el borde (edge computing). El usuario carga archivos PDF, que son procesados localmente en el navegador usando pdf.js para extraer el texto. Solo el texto extraído (no los archivos) se envía al "Reflex Stack" para un análisis profundo, alineándose con los principios de eficiencia y descentralización de "EchoNet".

📊 Indicadores Clave (IndicadoresSection): Un módulo híbrido que muestra datos estáticos (gráficos Recharts del PBI y Deuda) junto con datos generados por IA (tabla de proyecciones demográficas). Activa el modal de IA para análisis profundos.

🕸️ Mapa Sistémico (MapaSistemicoSection): Un visualizador interactivo (SVG) que permite al usuario seleccionar "vectores entrópicos" (Tecnología, Economía, etc.) para disparar análisis de IA específicos sobre sus interconexiones.

🔮 Almanac (ProyeccionesSection): Un generador de prospectiva que selecciona aleatoriamente 4 análisis de un conjunto predefinido y los genera en paralelo, simulando un "almanaque" de futuros posibles.

🌞🌱🎭 Vectores de Dominio (ClimaSection, CampoCannabisSection, CulturaSection): Secciones de contenido estático y semi-estático que proporcionan un análisis base sobre vectores entrópicos específicos.

3. Arquitectura: Un Híbrido Neuro-Simbólico

Este proyecto opera bajo un modelo híbrido neuro-simbólico:

Frontend (Componente Simbólico y Orquestador): Construido con React y TypeScript. Esta no es solo una capa de "vista". Es el núcleo lógico de la aplicación. Define las reglas simbólicas (Red Team), gestiona el estado y orquesta el flujo de datos (Purple Team).

Backend (Componente Neural): La API de Google Gemini. Actúa como el motor generativo (Blue Team), proporcionando la capacidad de procesamiento de lenguaje y conocimiento mundial.

Procesamiento en el Borde (Edge): El uso de pdf.js y Recharts (cargados desde CDN) para realizar tareas pesadas (renderizado de gráficos y extracción de texto de PDF) directamente en el navegador del cliente. Esto reduce drásticamente la carga del servidor, protege la privacidad del usuario (los archivos no se suben) y valida los principios de eficiencia energética y descentralización de las investigaciones Ultra-Efficient AI y EchoNet.

4. Tech Stack

Framework: React 18

Lenguaje: TypeScript

Bundler: Vite

Estilos: Tailwind CSS (cargado vía CDN)

Motor de IA: Google Gemini API (gemini-2.5-flash)

Gráficos: Recharts (cargado vía CDN)

Procesamiento de Archivos: PDF.js (cargado vía CDN)

5. Instalación y Ejecución

Para ejecutar este proyecto localmente:

Clonar el repositorio:

git clone [URL-DEL-REPOSITORIO]
cd oraculo-pampa


Instalar dependencias:

npm install


Configurar la API Key:
Este proyecto utiliza vite para gestionar variables de entorno. Deberás crear un archivo .env.local en la raíz del proyecto.

touch .env.local


Abre el archivo .env.local y añade tu clave de API de Google Gemini:

GEMINI_API_KEY=TU_API_KEY_AQUI


Referencia: vite.config.ts y services/geminiService.ts.

Ejecutar el servidor de desarrollo:

npm run dev


Abrir la aplicación:
Abre tu navegador y ve a http://localhost:3000 (o el puerto que Vite indique).

5.1. Versión Portable

Si prefieres una versión que requiera menos configuración y dependencias, existe una **versión portable** de Oráculo Pampa.

Inicio rápido (Windows):

INICIAR.bat


Inicio rápido (Linux/Mac):

./iniciar.sh


La versión portable:
- Requiere solo Node.js (sin instalar todas las dependencias de desarrollo)
- Configura la API key mediante un prompt interactivo
- Usa un servidor HTTP simple sin dependencias externas
- Es ideal para distribución y uso rápido

Para más detalles, consulta README-PORTABLE.md.

6. La Visión: De Prototipo a Paradigma

"Oráculo Pampa" es más que una aplicación; es un prototipo de investigación. Demuestra que la arquitectura "GYOA Reflex Stack" es viable para crear agentes de IA especializados. Sirve como un "Echo Agent" de dominio específico que valida los principios de la computación eficiente y descentralizada en el borde, sentando las bases conceptuales para las arquitecturas "MMUL+Helix" (compresión simbólica) y "EchoNet" (redes de agentes descentralizados).
