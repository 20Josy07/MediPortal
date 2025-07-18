
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, KeyRound, Settings2 } from "lucide-react";

const settingsItems = [
  {
    icon: User,
    title: "Profile Settings",
    description: "Manage your personal information",
    content: "Here you can manage your profile settings.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Configure reminder and alert preferences",
    content: "Here you can manage your notification preferences.",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Manage your account security settings",
    content: "Here you can manage your security settings.",
  },
  {
    icon: KeyRound,
    title: "API Keys & Integrations",
    description: "Manage third-party service connections",
    content: "Here you can manage your API keys and integrations.",
  },
    {
    icon: Settings2,
    title: "Clinic Settings",
    description: "Configure clinic information and preferences",
    content: "Here you can manage your clinic settings.",
  },
];

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your account and application preferences
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {settingsItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg bg-card">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-center gap-4">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-semibold text-base">{item.title}</p>
                  <p className="text-sm text-muted-foreground font-normal">{item.description}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
                {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
