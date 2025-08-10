
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Users,
  Calendar,
  LifeBuoy,
  Home,
  NotebookText,
  HelpCircle,
  MessageSquare,
  Video,
  Shield,
  FileText as FileTextIcon,
  BarChart2,
} from "lucide-react";
import * as React from 'react';
import Image from "next/image";


export function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image alt="Zenda Logo" loading="lazy" width="28" height="28" src="https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png" style={{color: 'transparent'}} />
          <span className="font-bold text-lg ">Zenda</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard"}
            >
              <Link href="/dashboard">
                <Home />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/patients"}
            >
              <Link href="/dashboard/patients">
                <Users />
                Pacientes
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/sessions"}
            >
              <Link href="/dashboard/sessions">
                <Calendar />
                Sesiones
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/notes"}
            >
              <Link href="/dashboard/notes">
                <NotebookText />
                Notas Inteligentes
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
       <SidebarFooter className="p-2 flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpen(!open)}
              isActive={pathname.startsWith("/dashboard/support")}
            >
              <LifeBuoy />
              Ayuda/Soporte
            </SidebarMenuButton>
             {open && (
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/support/quick-guide'}>
                    <Link href="/dashboard/support/quick-guide">
                      <HelpCircle />
                      Guía rápida
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                   <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/support/chat'}>
                    <Link href="/dashboard/support/chat">
                      <MessageSquare />
                      Preguntas Frecuentes
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                   <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/support/tutorials'}>
                    <Link href="/dashboard/support/tutorials">
                      <Video />
                      Tutoriales en video
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
           <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/terms'}>
                    <Link href="/terms">
                        <FileTextIcon />
                        Términos y condiciones
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/privacy'}>
                    <Link href="/privacy">
                        <Shield />
                        Política de seguridad
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
