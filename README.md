# 🌿 Zenda – Tu Asistente Inteligente para Terapia

**Zenda** es una aplicación web moderna para psicólogos y terapeutas que centraliza la gestión de pacientes, la programación de sesiones y la documentación clínica.  
Integra herramientas inteligentes impulsadas por IA para ayudarte a dedicar más tiempo a lo que realmente importa: tus pacientes.

---

## ✨ Funcionalidades Principales

- **📋 Gestión de Pacientes**: Registra y organiza información de forma centralizada y segura.
- **📅 Calendario Interactivo**: Agenda sesiones con vistas de mes, semana y día, y gestión por arrastrar/soltar.
- **🔗 Integración con Google Calendar**: Sincroniza automáticamente tus citas para tener todo en un solo lugar.
- **📝 Notas Inteligentes con IA**:
  - **Transcripción Automática**: Convierte audios de tus sesiones en texto preciso.
  - **Formateo Clínico Instantáneo**: Pasa de notas en bruto a formatos SOAP o DAP en un clic.
  - **Resúmenes Rápidos**: Obtén resúmenes concisos para revisar casos en segundos.
- **🤖 Asistente Clínico IA**: Haz preguntas sobre las notas y recibe insights útiles.
- **📊 Informes Profesionales**: Genera informes de progreso en PDF listos para compartir.
- **🔒 Autenticación Segura**: Registro e inicio de sesión protegidos con Firebase Authentication.

---

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/)
- **Backend y DB**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **IA**: [Genkit](https://firebase.google.com/docs/genkit)
- **Validación y Formularios**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

---

## 📂 Estructura del Proyecto

```

/src
├── app           # Rutas y páginas (Next.js App Router)
├── components    # Componentes reutilizables por funcionalidad
├── ai            # Flujos y configuración de IA con Genkit
├── lib           # Configuración Firebase, utilidades y tipos
├── context       # Contextos globales (ej. AuthContext)
└── hooks         # Hooks personalizados

```

---

## 🆕 Changelog – v1.0 (Lanzamiento Inicial)

**Funcionalidades:**
- Gestión integral de pacientes
- Calendario interactivo con integración a Google Calendar
- Notas inteligentes (transcripción, formateo, resúmenes y consultas IA)
- Informes de progreso en PDF
- Autenticación segura con opciones de inicio de sesión social
- Proceso de eliminación de cuenta con reautenticación

**Mejoras de UI/UX:**
- Interfaz refinada y responsiva en dispositivos móviles
- Menús de navegación optimizados
- Página de inicio con carrusel automático
- Términos y condiciones claros y accesibles

---

## 👥 Equipo

**Zenda es posible gracias a un equipo joven, multidisciplinario y apasionado:**
- **Josimar Acosta** – Full-Stack Developer  
- **María De Los Ríos** – Full-Stack Developer  
- **María Madrigal** – UI Designer  
- **Juan Gallardo** – FCA Mentor  

💚 *Trabajamos para que cada psicólogo pueda concentrarse en lo más importante: acompañar a sus pacientes.*