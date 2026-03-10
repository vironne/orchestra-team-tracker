"use client";

import { deleteIssue, updateIssueStatus } from "@/app/actions/issues";
import { ISSUE_STATUS, type IssueStatusKey } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function IssueActions({
  issueId,
  currentStatus,
}: {
  issueId: string;
  currentStatus: IssueStatusKey;
}) {
  async function handleStatusChange(status: IssueStatusKey) {
    try {
      await updateIssueStatus(issueId, status);
      toast.success("Statut mis à jour");
    } catch {
      toast.error("Erreur");
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer cette issue ?")) return;
    try {
      await deleteIssue(issueId);
      toast.success("Issue supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {Object.entries(ISSUE_STATUS).map(([key, val]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleStatusChange(key as IssueStatusKey)}
            className={cn(currentStatus === key && "bg-accent")}
          >
            {val.emoji} {val.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-400 focus:text-red-400"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
