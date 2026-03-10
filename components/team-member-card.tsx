"use client";

import { MemberAvatar } from "@/components/member-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteTeamMember } from "@/app/actions/team";
import { Trash2, Mail } from "lucide-react";
import { toast } from "sonner";

type Member = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string | null;
  _count: { assignedTasks: number; assignedIssues: number };
};

export function TeamMemberCard({ member }: { member: Member }) {
  async function handleDelete() {
    if (!confirm(`Supprimer ${member.name} de l'équipe ?`)) return;
    try {
      await deleteTeamMember(member.id);
      toast.success("Membre supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardContent className="flex items-start gap-4 p-4">
        <MemberAvatar
          name={member.name}
          avatar={member.avatar}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-medium truncate">{member.name}</h3>
          {member.role && (
            <p className="text-sm text-muted-foreground">{member.role}</p>
          )}
          <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
            <Mail className="h-3 w-3" />
            {member.email}
          </p>
          <div className="mt-2 flex gap-3 text-xs text-zinc-500">
            <span>{member._count.assignedTasks} tâches</span>
            <span>{member._count.assignedIssues} bugs</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-zinc-500 hover:text-red-400"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
