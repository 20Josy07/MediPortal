import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FilePenLine,
  FolderPlus,
  Landmark,
  Upload,
  Search,
  Recycle,
  FileText,
  Shield,
  BookOpen,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const collections = [
  {
    icon: FilePenLine,
    title: "Contratos de Pacientes",
    count: 1,
    color: "text-blue-500",
  },
  {
    icon: Landmark,
    title: "Facturas 2024",
    count: 2,
    color: "text-green-500",
  },
  {
    icon: Recycle,
    title: "Recursos Terapéuticos",
    count: 2,
    color: "text-purple-500",
  },
  {
    icon: FileText,
    title: "Plantillas de Informes",
    count: 2,
    color: "text-orange-500",
  },
  {
    icon: Shield,
    title: "Documentos Legales",
    count: 0,
    color: "text-red-500",
  },
  {
    icon: BookOpen,
    title: "Material de Estudio",
    count: 0,
    color: "text-indigo-500",
  },
];

export default function DocumentsPage() {
  return (
    <div className="flex-1 space-y-8">
      <DashboardHeader title="Mis Documentos de Práctica" />

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar en todos los documentos..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <FolderPlus className="mr-2 h-4 w-4" />
          Nueva Colección
        </Button>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Nuevo Documento
        </Button>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-bold tracking-tight">Colecciones</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <Card
              key={collection.title}
              className="group cursor-pointer transition-all hover:border-primary hover:shadow-lg"
            >
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div
                  className={`rounded-lg bg-card p-3 ring-1 ring-border group-hover:ring-primary ${collection.color}`}
                >
                  <collection.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{collection.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {collection.count}{" "}
                    {collection.count === 1 ? "documento" : "documentos"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}