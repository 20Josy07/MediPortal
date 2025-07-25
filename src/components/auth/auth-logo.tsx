
"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export function AuthLogo() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoLight = "https://i.postimg.cc/HntBCkhT/Logo-Zenda-Light.png";
  const logoDark = "https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png";

  if (!mounted) {
    // Render a placeholder or nothing until the theme is determined
    return (
        <div style={{width: '80px', height: '80px'}} className="mx-auto mb-4"></div>
    );
  }

  const currentLogo = resolvedTheme === "dark" ? logoDark : logoLight;

  return (
    <Image
      src={currentLogo}
      alt="Logo Zenda"
      width={80}
      height={80}
      className="mx-auto mb-4 h-auto w-auto max-w-[80px]"
      priority
    />
  );
}
