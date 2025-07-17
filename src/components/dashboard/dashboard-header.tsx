import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const pathname = usePathname();

  // Only show title on the main dashboard page
  if (pathname !== '/dashboard') {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
    </div>
  );
}
