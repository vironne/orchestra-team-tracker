"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Users,
  Bug,
  Receipt,
  ClipboardList,
  User,
  UsersRound,
  Tags,
  Menu,
  FolderKanban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

const navSections = [
  {
    label: "PROJETS",
    items: [
      { href: "/projects", label: "Projets", icon: BarChart3 },
      { href: "/clients", label: "Entreprises", icon: Users },
      { href: "/bugs", label: "Bugs", icon: Bug, disabled: true },
      { href: "/invoices", label: "Factures", icon: Receipt, disabled: true },
    ],
  },
  {
    label: "TÂCHES",
    items: [
      { href: "/tasks", label: "Toutes les tâches", icon: ClipboardList },
      { href: "/my-tasks", label: "Mes tâches", icon: User },
    ],
  },
  {
    label: "RÉGLAGES",
    items: [
      { href: "/settings/team", label: "Équipe", icon: UsersRound },
      { href: "/settings/categories", label: "Catégories", icon: Tags },
    ],
  },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-zinc-800 px-4">
        <Link
          href="/projects"
          className="flex items-center gap-2 font-bold"
          onClick={onNavigate}
        >
          <FolderKanban className="h-5 w-5 text-violet-400" />
          <span className="text-sm">Orchestra Tracker</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-2 text-[0.65rem] font-semibold uppercase tracking-wider text-zinc-500">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                const Icon = item.icon;

                if (item.disabled) {
                  return (
                    <span
                      key={item.href}
                      className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-zinc-600 cursor-not-allowed"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      <span className="ml-auto text-[0.6rem] uppercase text-zinc-700">
                        P2
                      </span>
                    </span>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-zinc-800 text-white font-medium"
                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-zinc-800 md:bg-zinc-950">
      <NavContent />
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-56 bg-zinc-950 p-0 border-zinc-800">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <NavContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
