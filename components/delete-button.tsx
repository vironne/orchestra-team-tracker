"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteButton({
  action,
  label,
  confirmMessage,
  className,
}: {
  action: () => Promise<void>;
  label: string;
  confirmMessage?: string;
  className?: string;
}) {
  async function handleDelete() {
    if (!confirm(confirmMessage ?? `Supprimer ${label} ?`)) return;
    try {
      await action();
      toast.success(`${label} supprimé(e)`);
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className ?? "h-7 w-7 shrink-0 text-zinc-500 hover:text-red-400"}
      onClick={handleDelete}
      title={`Supprimer ${label}`}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
