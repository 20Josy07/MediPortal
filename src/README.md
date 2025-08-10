# Zenda - Tu Asistente Inteligente para Terapia

Zenda es una aplicación web moderna diseñada para psicólogos y terapeutas, que simplifica la gestión de pacientes, la programación de sesiones y la documentación clínica a través de herramientas inteligentes impulsadas por IA.

## ✨ Funcionalidades Clave

- **Gestión de Pacientes**: Registra y organiza la información de tus pacientes de forma centralizada.
- **Calendario de Sesiones**: Agenda y visualiza todas tus citas en un calendario interactivo con vistas de mes, semana y día.
- **Integración con Google Calendar**: Sincroniza las sesiones de Zenda con tu calendario de Google para una gestión unificada.
- **Notas Inteligentes**:
    - **Transcripción de Audio**: Graba o sube el audio de tus sesiones y obtén una transcripción automática.
    - **Formateo Automático**: Convierte notas en bruto a formatos estándar como SOAP o DAP con un solo clic.
    - **Resúmenes con IA**: Genera resúmenes concisos de notas extensas para una revisión rápida.
- **Asistente de IA**: Chatea con una IA para hacer preguntas sobre las notas de un paciente y obtener insights.
- **Informes de Progreso**: Genera informes de evolución terapéutica completos y profesionales, listos para descargar en PDF.
- **Autenticación Segura**: Sistema de registro e inicio de sesión con Firebase Authentication.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI**: [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Base de Datos**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Funcionalidades de IA**: [Genkit](https://firebase.google.com/docs/genkit)
- **Manejo de Formularios**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🛠️ Cómo Empezar

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd zenda-app
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Configura tus variables de entorno. Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales de Firebase y Google Cloud:
   ```
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...

   # Google Calendar API Configuration
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

### Ejecutar la Aplicación

Para iniciar el servidor de desarrollo, ejecuta:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 📁 Estructura del Proyecto

- **`/src/app`**: Contiene todas las rutas y páginas de la aplicación, siguiendo la estructura del App Router de Next.js.
- **`/src/components`**: Componentes reutilizables de React, organizados por funcionalidad (auth, dashboard, ui).
- **`/src/ai`**: Flujos y configuración de Genkit para las funcionalidades de inteligencia artificial.
- **`/src/lib`**: Funciones de utilidad, configuración de Firebase, y definiciones de tipos (`types.ts`).
- **`/src/context`**: Contiene el `AuthContext` para la gestión de la autenticación en toda la aplicación.
- **`/src/hooks`**: Hooks personalizados como `useToast` y `useMobile`.

---

## Changelog

### v1.0 - Lanzamiento Inicial

¡Estamos emocionados de lanzar la primera versión de Zenda! Esta versión incluye un conjunto completo de herramientas diseñadas para potenciar la práctica clínica de los psicólogos.

**Funcionalidades Principales:**
- **Gestión Integral de Pacientes**: Creación y administración de perfiles de pacientes, con seguimiento de su estado e información relevante.
- **Calendario de Sesiones Interactivo**: Agenda y gestiona citas con vistas de mes, semana y día, y una interfaz de arrastrar y soltar.
- **Integración con Google Calendar**: Sincroniza las sesiones de Zenda con tu calendario personal de Google para una gestión unificada.
- **Notas Inteligentes con IA**:
  - **Transcripción de Audio a Texto**: Graba o sube audios de sesiones y obtén transcripciones automáticas y precisas.
  - **Reformateo a Estándares Clínicos**: Convierte notas en bruto a formatos como SOAP y DAP con un solo clic.
  - **Asistente de IA para Consultas**: Chatea con una IA para obtener resúmenes, identificar patrones y extraer información clave de las notas.
- **Informes de Progreso Automatizados**: Genera informes de evolución terapéutica en formato PDF, listos para ser compartidos.
- **Autenticación Segura**: Sistema de inicio de sesión y registro protegido con Firebase Authentication, incluyendo opciones de inicio de sesión social con Google.
- **Flujo de Eliminación de Cuenta Seguro**: Implementación de un sistema de reautenticación para garantizar la eliminación segura y definitiva de la cuenta y los datos del usuario.

**Mejoras de Usabilidad y UI:**
- **Interfaz de Usuario Refinada**: Se han realizado ajustes de diseño en toda la aplicación, incluyendo la correcta visualización del favicon, mejoras en el pie de página y menús de navegación más intuitivos.
- **Experiencia Móvil Optimizada**: Se ha mejorado la responsividad del menú de navegación en dispositivos móviles para una experiencia fluida en cualquier pantalla.
- **Experiencia de Usuario Mejorada**: Se ha simplificado el formulario de inicio de sesión y se ha añadido un carrusel con desplazamiento automático e infinito en la página de inicio para una presentación más dinámica.
- **Páginas Legales Claras**: Se han actualizado las instrucciones en la página de eliminación de datos y se han clarificado los términos y condiciones.