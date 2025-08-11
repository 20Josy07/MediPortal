
"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function AuthLogo() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [logoSrc, setLogoSrc] = useState("https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png"); // Default dark logo

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const currentTheme = resolvedTheme || theme;
      if (currentTheme === 'light') {
        setLogoSrc("https://i.postimg.cc/HntBCkhT/Logo-Zenda-Light.png");
      } else {
        setLogoSrc("https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png");
      }
    }
  }, [theme, resolvedTheme, mounted]);

  return (
    <Image
      src={logoSrc}
      alt="Logo Zenda"
      width={80}
      height={80}
      className="mx-auto mb-4 h-auto w-auto max-w-[80px]"
      priority
      key={logoSrc} // Add key to force re-render on src change
    />
  );
}
