
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
import { Logo } from "@/components/icons";
import {
  Users,
  Calendar,
  BarChart2,
  LineChart,
  FileText,
  CreditCard,
  LifeBuoy,
  Home,
  NotebookText,
  HelpCircle,
  MessageSquare,
  Video,
} from "lucide-react";
import * as React from 'react';


export function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Logo className="w-7 h-7 text-primary" />
          <span className="font-bold text-lg">Psicólogo</span>
        </Link>
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
                Notas
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/dashboard/analysis")}
            >
              <Link href="/dashboard/analysis">
                <BarChart2 />
                Análisis
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/metrics"}
            >
              <Link href="/dashboard/metrics">
                <LineChart />
                Métricas
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/documents"}
            >
              <Link href="/dashboard/documents">
                <FileText />
                Documentos
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/billing"}
            >
              <Link href="/dashboard/billing">
                <CreditCard />
                Facturación
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
                    <Link href="#">
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
                    <Link href="#">
                      <Video />
                      Tutoriales en video
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
