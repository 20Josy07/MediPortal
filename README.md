# Zenda - Tu Asistente Inteligente para Terapia

Zenda es una aplicación web moderna diseñada para psicólogos y terapeutas, que simplifica la gestión de pacientes, la programación de sesiones y la documentación clínica a través de herramientas inteligentes impulsadas por IA.

## ✨ Funcionalidades Clave

- **Gestión de Pacientes**: Registra y organiza la información de tus pacientes de forma centralizada.
- **Calendario de Sesiones**: Agenda y visualiza todas tus citas en un calendario interactivo con vistas de mes, semana y día.
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
4. Configura tus variables de entorno. Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales de Firebase:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
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
