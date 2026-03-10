"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateTeamMember } from "@/app/actions/team";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

type Member = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string | null;
};

export function EditTeamMemberDialog({ member }: { member: Member }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      await updateTeamMember(member.id, {
        name: form.get("name") as string,
        email: form.get("email") as string,
        role: (form.get("role") as string) || null,
        avatar: (form.get("avatar") as string) || null,
      });
      toast.success("Membre mis à jour");
      setOpen(false);
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-zinc-500 hover:text-zinc-300"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le membre</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nom</Label>
            <Input
              id="edit-name"
              name="name"
              required
              defaultValue={member.name}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              name="email"
              type="email"
              required
              defaultValue={member.email}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role">Rôle</Label>
            <Input
              id="edit-role"
              name="role"
              defaultValue={member.role ?? ""}
              placeholder="Développeur, Designer, Chef de projet…"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-avatar">URL Avatar (optionnel)</Label>
            <Input
              id="edit-avatar"
              name="avatar"
              type="url"
              defaultValue={member.avatar ?? ""}
              placeholder="https://…"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
