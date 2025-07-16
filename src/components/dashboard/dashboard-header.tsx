import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="lg:hidden" />
        <h2 className="text-3xl font-bold tracking-tight font-headline">{title}</h2>
      </div>
    </div>
  );
}
