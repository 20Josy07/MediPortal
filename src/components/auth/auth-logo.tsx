
"use client";

import Image from "next/image";

export function AuthLogo() {
  // Always use a single, consistent logo URL to prevent hydration mismatches.
  // This logo should be visible on both light and dark backgrounds.
  const logoUrl = "https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png";

  return (
    <Image
      src={logoUrl}
      alt="Logo Zenda"
      width={80}
      height={80}
      className="mx-auto mb-4 h-auto w-auto max-w-[80px]"
      priority
    />
  );
}
