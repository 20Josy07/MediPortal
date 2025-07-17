
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Settings, User as UserIcon } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProfileSettingsForm } from "./profile-settings-form";


export function DashboardNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };
  
  const getTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    const titleMap: { [key: string]: string } = {
      dashboard: 'Principal',
      patients: 'Pacientes',
      sessions: 'Sesiones',
      notes: 'Notas',
      analysis: 'Análisis',
      metrics: 'Métricas',
      documents: 'Documentos',
      billing: 'Facturación',
      settings: 'Configuración',
    };

    return titleMap[lastSegment] || 'Dashboard';
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
           <div className="hidden md:block">
            <SidebarTrigger />
          </div>
          <h1 className="text-lg font-semibold whitespace-nowrap">
            {getTitle()}
          </h1>
        </div>
       
        <div className="flex w-full items-center justify-end gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 rounded-full p-2">
                 <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || undefined} alt="User avatar" />
                  <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block ml-2">{user?.displayName || 'Usuario'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem onSelect={() => setIsProfileModalOpen(true)}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Administrar mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                 </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Configura tu cuenta</DialogTitle>
            <DialogDescription>
              Configura tu cuenta y las preferencias de la aplicación
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
              <ProfileSettingsForm onSuccess={() => setIsProfileModalOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
