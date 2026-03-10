"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_STATUS } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";

type Client = { id: string; name: string };

export function ProjectFilters({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/projects?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        defaultValue={searchParams.get("status") ?? "all"}
        onValueChange={(v) => updateFilter("status", v)}
      >
        <SelectTrigger className="w-[150px] h-8 text-xs">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          {Object.entries(PROJECT_STATUS).map(([key, val]) => (
            <SelectItem key={key} value={key}>
              {val.emoji} {val.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("client") ?? "all"}
        onValueChange={(v) => updateFilter("client", v)}
      >
        <SelectTrigger className="w-[150px] h-8 text-xs">
          <SelectValue placeholder="Entreprise" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les entreprises</SelectItem>
          {clients.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
