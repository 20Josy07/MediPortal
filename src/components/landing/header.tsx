"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "#testimonials", label: "Testimonios" },
  { href: "#mission", label: "Misión" },
];

export function LandingHeader() {
  return (
    <header className="px-4 lg:px-12 py-4 flex items-center justify-between bg-[#3D224E] border-b border-white/10 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <Image src="https://i.postimg.cc/59L8Lbsj/og-image.png" alt="Alumbra Logo" width={32} height={32} />
        <span className="font-bold border border-white/50 rounded-full px-3 py-1 text-sm">prototype</span>
      </Link>
      
      <nav className="hidden lg:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium hover:text-[hsl(var(--highlight-yellow))] transition-colors"
            prefetch={false}
          >
            {link.label}
          </Link>
        ))}
        <Button asChild className="bg-primary hover:bg-primary/90 rounded-full px-6 py-2 text-sm font-bold">
          <Link href="/login">Iniciar sesión</Link>
        </Button>
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden bg-transparent border-0 hover:bg-white/10">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-background border-l-border">
          <Link href="/" className="mr-6 flex items-center gap-2 mb-6">
             <Image src="https://i.postimg.cc/59L8Lbsj/og-image.png" alt="Alumbra Logo" width={32} height={32} />
             <span className="font-bold">Alumbra</span>
          </Link>
          <div className="grid gap-4 py-6">
            {navLinks.map((link) => (
               <Link
                key={link.href}
                href={link.href}
                className="flex w-full items-center py-2 text-lg font-semibold hover:text-accent"
                prefetch={false}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="bg-primary hover:bg-primary/90 rounded-full px-6 py-4 text-base font-bold w-full mt-4">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
