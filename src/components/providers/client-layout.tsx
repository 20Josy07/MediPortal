"use client";

import { AuthProvider } from "./auth-provider";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider basePath="/api/auth" refetchOnWindowFocus={false} refetchInterval={0}>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
