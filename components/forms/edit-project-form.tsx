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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_STATUS, type ProjectStatusKey } from "@/lib/constants";
import { updateProject } from "@/app/actions/projects";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

type Client = { id: string; name: string };

type ProjectData = {
  id: string;
  name: string;
  clientId: string;
  status: string;
  budget: number | null;
  monthlyCost: number | null;
  annualCost: number | null;
  dueDate: Date | string | null;
  notes: string | null;
};

export function EditProjectDialog({
  project,
  clients,
}: {
  project: ProjectData;
  clients: Client[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dueDateStr = project.dueDate
    ? new Date(project.dueDate).toISOString().split("T")[0]
    : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      await updateProject(project.id, {
        name: form.get("name") as string,
        clientId: form.get("clientId") as string,
        status: form.get("status") as ProjectStatusKey,
        budget: form.get("budget") ? Number(form.get("budget")) : null,
        monthlyCost: form.get("monthlyCost") ? Number(form.get("monthlyCost")) : null,
        annualCost: form.get("annualCost") ? Number(form.get("annualCost")) : null,
        dueDate: form.get("dueDate") ? new Date(form.get("dueDate") as string) : null,
        notes: (form.get("notes") as string) || null,
      });
      toast.success("Projet mis à jour");
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
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-300">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le projet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nom du projet</Label>
            <Input name="name" required defaultValue={project.name} />
          </div>

          <div className="space-y-2">
            <Label>Entreprise</Label>
            <Select name="clientId" defaultValue={project.clientId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select name="status" defaultValue={project.status}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(PROJECT_STATUS).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.emoji} {val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Budget (€)</Label>
              <Input name="budget" type="number" step="0.01" defaultValue={project.budget ?? ""} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Coût mensuel (€)</Label>
              <Input name="monthlyCost" type="number" step="0.01" defaultValue={project.monthlyCost ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Coût annuel (€)</Label>
              <Input name="annualCost" type="number" step="0.01" defaultValue={project.annualCost ?? ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input name="dueDate" type="date" defaultValue={dueDateStr} />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea name="notes" rows={3} defaultValue={project.notes ?? ""} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading}>{loading ? "Enregistrement…" : "Enregistrer"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
