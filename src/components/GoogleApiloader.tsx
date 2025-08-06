'use client';

import Script from 'next/script';

export default function GoogleApiLoader() {
  return (
    <Script
      src="https://apis.google.com/js/api.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('Google API script loaded successfully');
        // Aquí podrías agregar lógica adicional cuando el script se carga
      }}
      onError={(e) => {
        console.error('Google API script failed to load', e);
      }}
    />
  );
}