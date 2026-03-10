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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_PRIORITY, type TaskPriorityKey } from "@/lib/constants";
import { createTask } from "@/app/actions/tasks";
import { Plus } from "lucide-react";
import { toast } from "sonner";

type CategoryOption = { id: string; name: string; emoji: string };
type MemberOption = { id: string; name: string };
type ProjectOption = {
  id: string;
  name: string;
  clientName: string;
};

export function TaskFormDialog({
  categories,
  members,
  projects,
}: {
  categories: CategoryOption[];
  members: MemberOption[];
  projects: ProjectOption[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Group projects by client
  const projectsByClient = projects.reduce<
    Record<string, { clientName: string; projects: { id: string; name: string }[] }>
  >((acc, p) => {
    if (!acc[p.clientName]) {
      acc[p.clientName] = { clientName: p.clientName, projects: [] };
    }
    acc[p.clientName].projects.push({ id: p.id, name: p.name });
    return acc;
  }, {});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      const projectId = form.get("projectId") as string;
      const assigneeId = form.get("assigneeId") as string;
      await createTask({
        title: form.get("title") as string,
        description: (form.get("description") as string) || null,
        categoryId: form.get("categoryId") as string,
        priority: (form.get("priority") as TaskPriorityKey) || "normal",
        assigneeId: assigneeId && assigneeId !== "none" ? assigneeId : null,
        projectId: projectId && projectId !== "none" ? projectId : null,
        dueDate: form.get("dueDate")
          ? new Date(form.get("dueDate") as string)
          : null,
      });
      toast.success("Tâche créée");
      setOpen(false);
    } catch {
      toast.error("Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Nouvelle tâche
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle tâche</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Envoyer facture #003…"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select name="categoryId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.emoji} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priorité</Label>
              <Select name="priority" defaultValue="normal">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_PRIORITY).map(([key, val]) => (
                    <SelectItem key={key} value={key}>
                      {val.emoji} {val.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Assigné à</Label>
              <Select name="assigneeId" defaultValue="none">
                <SelectTrigger>
                  <SelectValue placeholder="Personne" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non assigné</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      👤 {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Entreprise / Projet</Label>
              <Select name="projectId" defaultValue="none">
                <SelectTrigger>
                  <SelectValue placeholder="🏢 Orchestra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">🏢 Orchestra (interne)</SelectItem>
                  {Object.values(projectsByClient).map((group) => (
                    <SelectGroup key={group.clientName}>
                      <SelectLabel className="text-xs text-zinc-500">
                        🏢 {group.clientName}
                      </SelectLabel>
                      {group.projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          📁 {p.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Date d&apos;échéance</Label>
            <Input id="dueDate" name="dueDate" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Détails de la tâche…"
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
              {loading ? "Création…" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
