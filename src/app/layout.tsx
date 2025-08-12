import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Poppins } from "next/font/google";
import Script from "next/script";
import ClientLayout from "@/components/providers/client-layout";


const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: "Zenda | Software de Gestión para Psicólogos con IA",
  description: "Optimiza tu práctica clínica con Zenda. Gestiona pacientes, agenda sesiones, transcribe audios y genera notas clínicas con inteligencia artificial. Creado para psicólogos y terapeutas.",
  keywords: ["software para psicólogos", "gestión de pacientes", "notas clínicas", "terapia", "inteligencia artificial", "psicología", "Zenda"],
  authors: [{ name: "Zenda Team" }],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Zenda | Software de Gestión para Psicólogos con IA",
    description: "Optimiza tu práctica clínica con Zenda. Gestiona pacientes, agenda sesiones, transcribe audios y genera notas clínicas con inteligencia artificial.",
    url: "https://www.zendapsi.com", // Assuming this will be the final URL
    siteName: "Zenda",
    images: [
      {
        url: "https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png", // Main OG image
        width: 1200,
        height: 630,
        alt: "Logo de Zenda sobre un fondo representativo de la app.",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenda | Software de Gestión para Psicólogos con IA",
    description: "Optimiza tu práctica clínica con Zenda. Gestiona pacientes, agenda sesiones, transcribe audios y genera notas clínicas con inteligencia artificial.",
    images: ["https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${poppins.variable} font-body antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <ClientLayout>
            {children}
            <Toaster />
          </ClientLayout>
        </ThemeProvider>
         <Script id="facebook-sdk-setup" strategy="afterInteractive">
          {`
            window.fbAsyncInit = function() {
              FB.init({
                appId      : 'your-app-id',
                cookie     : true,
                xfbml      : true,
                version    : 'v20.0'
              });
              FB.AppEvents.logPageView();
            };

            (function(d, s, id){
               var js, fjs = d.getElementsByTagName(s)[0];
               if (d.getElementById(id)) {return;}
               js = d.createElement(s); js.id = id;
               js.src = "https://connect.facebook.net/en_US/sdk.js";
               fjs.parentNode.insertBefore(js, fjs);
             }(document, 'script', 'facebook-jssdk'));
          `}
        </Script>
      </body>
    </html>
  );
}
