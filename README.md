# CaliDevs Apps Dashboard

Dashboard centralizado para todas las aplicaciones de CaliDevs con sistema de autenticación compartido usando Firebase.

## 🏗️ Estructura del Proyecto

```
calidevs-apps/
├── index.html              # Dashboard principal con login
├── netlify.toml            # Configuración de Netlify
├── js/
│   └── auth-service.js     # Módulo de autenticación centralizado
└── apps/
    ├── note-taker-ai/
    │   └── index.html      # App de notas con IA
    ├── quality-control/
    │   └── index.html      # Control de calidad de proyectos
    └── font-mixer/
        └── index.html      # Mezclador de tipografías (gratuita)
```

## 🔐 Sistema de Autenticación

El sistema usa **Firebase Authentication** para manejar usuarios de forma centralizada:

- **Email/Password**: Registro e inicio de sesión tradicional
- **Sesión persistente**: Una vez logeado, el usuario permanece autenticado en todas las apps
- **Datos en Firestore**: Perfiles de usuario y configuraciones almacenadas en la nube

### Flujo de Autenticación

1. **Desde el Dashboard**: El usuario inicia sesión una vez y puede acceder a todas las apps premium
2. **Acceso directo a una App Premium**: Si el usuario accede directamente a la URL de una app premium, se le pedirá iniciar sesión
3. **Apps gratuitas**: No requieren autenticación y son accesibles para cualquier visitante

## 📱 Aplicaciones Disponibles

### 📝 Note Taker AI (Premium)
- **Requiere login**: ✅
- **Ruta**: `/apps/note-taker-ai/`
- **Funcionalidad**: Captura de notas por voz/texto con procesamiento IA
- **Features**:
  - 🎤 Grabación de voz con transcripción automática (Whisper API)
  - ✨ Extracción automática de tareas con IA (GPT-4o-mini)
  - 👥 Asignación de responsables del equipo (Sara, Anthony, Ian, JC, Marlene, Papá, Daniel, Carlos Armando)
  - ⚡ Prioridades (Alta/Media/Baja) y fechas límite
  - 📊 Vistas: Captura, Sesiones, Todos los Pendientes, Por Prioridad, Equipo, Archivo
  - 📋 Exportación a CSV y portapapeles
  - ⚙️ Configuración de OpenAI API Key por usuario

**Datos en Firestore**:
```
users/{userId}/
  settings/{settingsId}/
    - apiKey (OpenAI)
  sessions/{sessionId}/
    - timestamp, date, time
    - originalText
    - tasks[]
```

### 📊 Quality Control (Premium)
- **Requiere login**: ✅
- **Ruta**: `/apps/quality-control/`
- **Funcionalidad**: Sistema de control de calidad para proyectos web
- **Features**:
  - 📁 Gestión de proyectos web con nombre, cliente y URL
  - ✅ Checklist completo de calidad web con 6 categorías:
    - ⚡ SEO y Rendimiento (opcional)
    - ✨ Pre-Lanzamiento
    - 🔒 Seguridad y Técnico
    - 🌍 Migración y Deploy (opcional)
    - 😊 UX y Accesibilidad (opcional)
    - 📚 Entrega y Capacitación (opcional)
  - ⭐ Activar/desactivar categorías opcionales según el proyecto
  - 📝 Notas personalizadas por cada tarea
  - 📈 Barra de progreso visual
  - ✏️ Edición de información del proyecto
  - 🎉 Marcar proyectos como completados
  - 🗑️ Eliminación con doble confirmación

**Datos en Firestore**:
```
users/{userId}/
  qualityProjects/{projectId}/
    - name, client, url
    - completed, completedDate
    - createdAt
    - checklist{} (estado de cada tarea)
    - notes{} (notas por tarea)
    - expandedCategories{} (estado UI)
    - categoryEnabled{} (categorías opcionales)
```

### 🔤 Font Mixer (Gratuita)
- **Requiere login**: ❌
- **Ruta**: `/apps/font-mixer/`
- **Funcionalidad**: Explorador de combinaciones tipográficas de Google Fonts
- **Features**:
  - 🔍 Búsqueda en 1000+ fuentes de Google Fonts
  - 🎨 Generación automática de 20 combinaciones perfectas basadas en reglas de diseño
  - 🎲 Fuente aleatoria sin repeticiones (historial de últimas 30)
  - 🎛️ Controles de tamaño para títulos (24-80px) y cuerpo (12-32px)
  - 🔄 Transformaciones de texto (normal, mayúsculas, minúsculas, capitalizado)
  - ✏️ Vista previa editable en vivo (contenteditable)
  - 🎭 Modo "Mezcla Manual" con modal para selección independiente
  - 📱 Completamente responsive

**Google Fonts API Key**: `AIzaSyDFyf5K_8VqOBPHrjL9SBJ8RvAkYl5mXPk`

## 🚀 Deployment en Netlify

### Drag & Drop en Netlify

1. Ve a [Netlify Drop](https://app.netlify.com/drop)
2. Arrastra el archivo `calidevs-apps.zip` (o la carpeta completa)
3. Espera a que se despliegue
4. Tu dashboard estará disponible en la URL generada

**Nota**: El archivo `netlify.toml` ya está configurado correctamente:
- Sin redirects innecesarios
- Headers de seguridad configurados
- Cache optimizado para archivos JS

## ⚙️ Configuración de Firebase

El proyecto usa las siguientes credenciales de Firebase (ya configuradas en todas las apps):

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDYu8pGr9ceS4vLxCKm2i_QwXaMu-Eq0dU",
    authDomain: "note-taker-ai-8bc38.firebaseapp.com",
    projectId: "note-taker-ai-8bc38",
    storageBucket: "note-taker-ai-8bc38.firebasestorage.app",
    messagingSenderId: "491247346612",
    appId: "1:491247346612:web:848d99e0f9331b897408e1",
    measurementId: "G-K0N0PNGSQD"
};
```

### Estructura Completa de Firestore

```
users/
  {userId}/
    - email: string
    - displayName: string
    - createdAt: timestamp
    - lastLogin: timestamp
    - apps:
        - noteTakerAI: { enabled: true }
    
    settings/
      {settingsId}/
        - apiKey: string (OpenAI API Key)
        - updatedAt: timestamp
    
    sessions/
      {sessionId}/
        - timestamp: ISO string
        - date: string ("DD MMM YYYY")
        - time: string ("HH:MM")
        - originalText: string
        - tasks: array[
            {
              description: string
              client: string
              urgency: "Alta"|"Media"|"Baja"
              type: "Trabajo"|"Personal"
              dueDate: "DD/MM/YYYY" | null
              responsibles: string[]
              completed: boolean
            }
          ]
    
    qualityProjects/
      {projectId}/
        - name: string
        - client: string
        - url: string
        - completed: boolean
        - completedDate: ISO string | null
        - createdAt: ISO string
        - checklist: object (taskId: boolean)
        - notes: object (taskId: string)
        - expandedCategories: object (catId: boolean)
        - categoryEnabled: object (catId: boolean)
```

## 🎨 Tema de Diseño CaliDevs

### Paleta de Colores

```css
/* Fondos */
--bg-dark: #091a28;          /* Fondo principal */
--bg-darker: #1a202c;        /* Fondo más oscuro */
--bg-card: #3d4a5c;          /* Fondo de tarjetas */
--bg-card-hover: #4a5a6e;    /* Hover de tarjetas */

/* Acentos */
--accent: #FF6B35;           /* Naranja principal */
--accent-hover: #ff8555;     /* Naranja hover */
--accent-glow: rgba(255, 107, 53, 0.3); /* Glow effect */

/* Textos */
--light: #f8f6f3;                      /* Texto principal */
--light-muted: rgba(248, 246, 243, 0.7); /* Texto secundario */
--light-faded: rgba(248, 246, 243, 0.5); /* Texto atenuado */

/* Estados */
--success: #48bb78;          /* Verde éxito */
--warning: #ecc94b;          /* Amarillo advertencia */
--danger: #fc8181;           /* Rojo peligro */
--border: rgba(248, 246, 243, 0.1); /* Bordes */
```

### Tipografía

- **Familia**: Plus Jakarta Sans (Google Fonts)
- **Pesos**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

### Efectos Visuales

- Gradientes lineales en botones y acentos
- Efectos glow con box-shadow
- Animaciones fadeInUp con delays escalonados
- Transiciones suaves (0.2s - 0.4s)
- Border radius redondeados (12px - 24px)

## 📝 Agregar Nuevas Apps

Para agregar una nueva aplicación al dashboard:

### 1. Crear la estructura

```bash
mkdir apps/nueva-app
# Crear index.html dentro
```

### 2. Template para App Premium (con login)

Copia la estructura de `apps/quality-control/index.html`:

```html
<!-- Auth Overlay -->
<div id="authOverlay" class="auth-overlay">
  <!-- Login/registro form -->
</div>

<!-- Main App -->
<div id="app">
  <!-- Sidebar + contenido -->
</div>

<!-- Firebase Integration -->
<script type="module">
  import { initializeApp } from 'firebase...';
  // Misma configuración de Firebase
  // onAuthStateChanged para manejar sesión
</script>
```

### 3. Template para App Gratuita (sin login)

Copia la estructura de `apps/font-mixer/index.html`:

```html
<!-- No auth overlay, solo contenido directo -->
<header class="header">
  <!-- Link de regreso al dashboard -->
</header>

<main>
  <!-- Tu contenido aquí -->
</main>

<!-- Sin Firebase, solo funcionalidad -->
```

### 4. Actualizar el Dashboard

En `index.html` principal, agrega un nuevo card:

```html
<div class="app-card" data-app="tuApp" data-requires-auth="true">
  <div class="app-card-banner">
    <div class="app-icon">🎯</div>
  </div>
  <div class="app-card-content">
    <h3 class="app-name">Tu App</h3>
    <p class="app-description">Descripción de tu app</p>
    <div class="app-meta">
      <span class="app-tag premium">🔐 Premium</span>
      <span class="app-tag category">Categoría</span>
    </div>
    <div class="app-actions">
      <a href="./apps/tu-app/index.html" class="app-btn app-btn-primary">
        Abrir App
      </a>
    </div>
  </div>
</div>
```

### 5. Actualizar contadores

- Cambiar `<h3 id="statApps">3</h3>` al nuevo número
- Cambiar `<span class="section-badge">3</span>` al nuevo número

## 🔧 Desarrollo Local

Para trabajar en el proyecto localmente:

### Requisitos

- Servidor HTTP local (los módulos ES6 requieren protocolo HTTP)
- Navegador moderno con soporte ES6+

### Opciones de servidor local

```bash
# Opción 1: Python
python -m http.server 8000
# Luego abrir http://localhost:8000

# Opción 2: Node.js
npx http-server
# Luego abrir http://localhost:8080

# Opción 3: VS Code Live Server
# Instalar extensión "Live Server"
# Click derecho en index.html → "Open with Live Server"
```

### Testing de Autenticación

Firebase funciona perfectamente en localhost. Puedes:

1. Crear cuentas de prueba
2. Probar flujos de login/logout
3. Verificar persistencia de sesión
4. Probar apps premium y gratuitas

## 🐛 Troubleshooting

### El sidebar se abre con cada click (Quality Control)

**Solución**: Ya corregido en la última versión. El problema era que `switchTab()` llamaba a `toggleSidebar()` en cada acción. Ahora solo se cierra el sidebar cuando se hace click desde la navegación en móvil.

### Error de CORS con Firebase

Firebase requiere que la app se sirva desde un servidor HTTP, no con `file://`. Usa cualquiera de las opciones de servidor local mencionadas arriba.

### Las fuentes de Google Fonts no cargan (Font Mixer)

Verifica que tengas conexión a internet. La app carga fuentes dinámicamente desde la API de Google Fonts.

## 📄 Licencia

Proyecto privado de CaliDevs. Todos los derechos reservados © 2024.

---

**Última actualización**: Noviembre 2024  
**Versión**: 1.0.0  
**Apps activas**: 3 (Note Taker AI, Quality Control, Font Mixer)
