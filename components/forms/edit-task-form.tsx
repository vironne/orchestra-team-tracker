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
import { TASK_STATUS, TASK_PRIORITY } from "@/lib/constants";
import type { TaskStatusKey, TaskPriorityKey } from "@/lib/constants";
import { updateTask } from "@/app/actions/tasks";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

type CategoryOption = { id: string; name: string; emoji: string };
type MemberOption = { id: string; name: string };
type ProjectOption = { id: string; name: string; clientName: string };

type TaskData = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  categoryId: string | null;
  assigneeId: string | null;
  projectId: string | null;
  dueDate: Date | string | null;
};

export function EditTaskDialog({
  task,
  categories,
  members,
  projects,
}: {
  task: TaskData;
  categories: CategoryOption[];
  members: MemberOption[];
  projects: ProjectOption[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const projectsByClient = projects.reduce<
    Record<string, { clientName: string; projects: { id: string; name: string }[] }>
  >((acc, p) => {
    if (!acc[p.clientName]) {
      acc[p.clientName] = { clientName: p.clientName, projects: [] };
    }
    acc[p.clientName].projects.push({ id: p.id, name: p.name });
    return acc;
  }, {});

  const dueDateStr = task.dueDate
    ? new Date(task.dueDate).toISOString().split("T")[0]
    : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      const projectId = form.get("projectId") as string;
      const assigneeId = form.get("assigneeId") as string;
      await updateTask(task.id, {
        title: form.get("title") as string,
        description: (form.get("description") as string) || null,
        status: form.get("status") as TaskStatusKey,
        priority: form.get("priority") as TaskPriorityKey,
        categoryId: form.get("categoryId") as string,
        assigneeId: assigneeId && assigneeId !== "none" ? assigneeId : null,
        projectId: projectId && projectId !== "none" ? projectId : null,
        dueDate: form.get("dueDate")
          ? new Date(form.get("dueDate") as string)
          : null,
      });
      toast.success("Tâche mise à jour");
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
        <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-300">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier la tâche</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Titre</Label>
            <Input id="edit-title" name="title" required defaultValue={task.title} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select name="status" defaultValue={task.status}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_STATUS).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.emoji} {val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priorité</Label>
              <Select name="priority" defaultValue={task.priority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_PRIORITY).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.emoji} {val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select name="categoryId" defaultValue={task.categoryId ?? undefined}>
                <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.emoji} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assigné à</Label>
              <Select name="assigneeId" defaultValue={task.assigneeId ?? "none"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non assigné</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>👤 {m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Projet</Label>
              <Select name="projectId" defaultValue={task.projectId ?? "none"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">🏢 Orchestra (interne)</SelectItem>
                  {Object.values(projectsByClient).map((group) => (
                    <SelectGroup key={group.clientName}>
                      <SelectLabel className="text-xs text-zinc-500">🏢 {group.clientName}</SelectLabel>
                      {group.projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>📁 {p.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Échéance</Label>
              <Input name="dueDate" type="date" defaultValue={dueDateStr} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea id="edit-desc" name="description" rows={3} defaultValue={task.description ?? ""} />
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
