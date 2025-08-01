// components/GoogleAuthButton.tsx
'use client';
import { CalendarIcon, CheckIcon} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

export default function GoogleAuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar si ya hay una sesión activa
    const checkSession = () => {
      // Aquí deberías verificar el estado de autenticación
      // Por ejemplo, si usas el contexto de autenticación de Firebase
      const user = localStorage.getItem('user');
      if (user) {
        setIsLoggedIn(true);
      }
    };

    checkSession();
  }, []);

  const handleAuthClick = async () => {
    try {
      const response = await fetch('/api/auth/google');
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error al iniciar autenticación:', error);
    }
  };

  if (isLoggedIn) {
      return (
        <button
          onClick={handleAuthClick}
          className="flex items-center justify-center px-4 py-2 bg-tertiary text-primary border border-primary rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-not-allowed"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
           <CalendarIcon className="w-5 h-5" /> <CheckIcon className="w-3 h-3 mt-4" />
        </button>
      );
    }
    return (
      <button
        onClick={handleAuthClick}
        className="flex items-center justify-center px-4 py-2 bg-primary text-secondary rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        <CalendarIcon className="w-5 h-5 mr-2" />
        Vincular con Google Calendar <CalendarIcon className="w-5 h-5 ml-2" />
      </button>
    );
  };