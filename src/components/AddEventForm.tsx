'use client';

import { useState } from 'react';
import { CalendarIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AddEventForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startDateTime: new Date(formData.startDateTime).toISOString(),
          endDateTime: new Date(formData.endDateTime).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el evento');
      }

      const data = await response.json();
      console.log('Evento creado:', data);
      onClose();
      // Aquí podrías actualizar la lista de eventos o mostrar un mensaje de éxito
    } catch (err) {
      console.error('Error:', err);
      setError('Error al crear el evento. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Nuevo Evento
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título del evento
            </label>
            <input
              type="text"
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Inicio
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  id="startDateTime"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            
            <div>
              <label htmlFor="endDateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fin
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  id="endDateTime"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                <ClockIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Creando...' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}