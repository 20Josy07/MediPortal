# 🌿 Zenda – Tu Asistente Inteligente para Terapia  

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"></a>
  <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://zendapsi.com"><img src="https://img.shields.io/badge/Web-Zendapsi.com-brightgreen?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License"></a>
</p>

<p align="center">
  <img src="docs/screenshots/mockup-dashboard.png" alt="Vista del dashboard de Zenda" width="800"/>
</p>

**Zenda** es una aplicación web moderna para psicólogos y terapeutas que centraliza la gestión de pacientes, la programación de sesiones y la documentación clínica, integrando herramientas inteligentes impulsadas por IA.

---

## ✨ Funcionalidades Principales  

- **📋 Gestión de Pacientes**: Información centralizada y segura.  
- **📅 Calendario Interactivo**: Agenda con vistas de mes, semana y día.  
- **🔗 Integración con Google Calendar**: Sincroniza automáticamente tus citas.  
- **📝 Notas Inteligentes con IA**: Transcripción, formateo clínico (SOAP/DAP) y resúmenes.  
- **🤖 Asistente Clínico IA**: Pregunta y recibe insights sobre las notas.  
- **📊 Informes Profesionales**: Exporta PDF listos para entregar.  
- **🔒 Autenticación Segura**: Con inicio de sesión social mediante Google.  

---

## 🛠️ Stack Tecnológico  

| Categoría      | Herramientas |
|----------------|--------------|
| **Framework**  | [Next.js](https://nextjs.org/) |
| **Lenguaje**   | [TypeScript](https://www.typescriptlang.org/) |
| **UI**         | [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/) |
| **Backend/DB** | [Firebase](https://firebase.google.com/) |
| **IA**         | [Genkit](https://firebase.google.com/docs/genkit) |
| **Autenticación** | [Auth.js (NextAuth)](https://authjs.dev/) |
| **Formularios**| [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) |

---

## ⚙️ Configuración de Entorno

Para ejecutar el proyecto localmente, necesitas configurar las siguientes variables de entorno en un archivo `.env.local`:

```env
# Variables de Firebase (obtenidas desde tu consola de Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Variables de Autenticación con Google (Auth.js v5)
# Estas credenciales se obtienen desde la Google Cloud Console
AUTH_SECRET= # Un string aleatorio de 32 caracteres. Puedes generar uno con `openssl rand -base64 32`
AUTH_URL=http://localhost:3000 # En producción, usa tu dominio principal
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# URL del Webhook para recordatorios (Make/Integromat)
MAKE_WEBHOOK_URL=
```

### Configuración de Google OAuth

Es crucial que la **URI de Redirección Autorizada** en tus credenciales de Google Cloud coincida exactamente con la configuración de Auth.js. Para el entorno local, debe ser:

`http://localhost:3000/api/auth/callback/google`

Para producción, reemplaza `http://localhost:3000` con tu dominio.

---

## 📸 Vista Previa  

<p align="center">
  <img src="docs/screenshots/login.png" alt="Zenda Login" width="400"/>  
  <img src="docs/screenshots/calendar.png" alt="Zenda Calendar" width="400"/>  
</p>  

> 💡 Agrega más capturas en `docs/screenshots/` para mostrar otras funciones.

---

## 🆕 Changelog – v1.0  

- **Gestión integral de pacientes**  
- **Calendario interactivo + Google Calendar**  
- **Notas inteligentes con IA**  
- **Informes PDF automáticos**  
- **UI responsiva y optimizada**  

---

## 👥 Equipo  

💚 *Zenda es posible gracias a un equipo joven y multidisciplinario:*  

- [**Josimar Acosta**](#) – Full-Stack Developer  
- [**María De Los Ríos**](#) – Full-Stack Developer  
- [**María Madrigal**](#) – UI Designer  
- [**Juan Gallardo**](#) – FCA Mentor  

---

## 📲 Conecta con nosotros  

[![Website](https://img.shields.io/badge/Web-Zendapsi.com-green?style=for-the-badge&logo=google-chrome)](https://zendapsi.com)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Zenda-blue?style=for-the-badge&logo=linkedin)](#)  
[![Instagram](https://img.shields.io/badge/Instagram-Zenda-purple?style=for-the-badge&logo=instagram)](#)  
[![Twitter](https://img.shields.io/badge/Twitter-Zenda-blue?style=for-the-badge&logo=twitter)](#)  

---
