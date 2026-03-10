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
import { createProject } from "@/app/actions/projects";
import { Plus } from "lucide-react";
import { toast } from "sonner";

type Client = { id: string; name: string };

export function ProjectFormDialog({ clients }: { clients: Client[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      await createProject({
        name: form.get("name") as string,
        clientId: form.get("clientId") as string,
        status: (form.get("status") as ProjectStatusKey) || "nouveau",
        budget: form.get("budget") ? Number(form.get("budget")) : null,
        monthlyCost: form.get("monthlyCost") ? Number(form.get("monthlyCost")) : null,
        annualCost: form.get("annualCost") ? Number(form.get("annualCost")) : null,
        dueDate: form.get("dueDate")
          ? new Date(form.get("dueDate") as string)
          : null,
        notes: (form.get("notes") as string) || null,
      });
      toast.success("Projet créé");
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
          Nouveau projet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau projet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du projet</Label>
            <Input id="name" name="name" required placeholder="Site e-commerce…" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId">Entreprise</Label>
            <Select name="clientId" required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une entreprise" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select name="status" defaultValue="nouveau">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PROJECT_STATUS).map(([key, val]) => (
                    <SelectItem key={key} value={key}>
                      {val.emoji} {val.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (€)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                step="0.01"
                placeholder="15000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="monthlyCost">Coût mensuel (€)</Label>
              <Input
                id="monthlyCost"
                name="monthlyCost"
                type="number"
                step="0.01"
                placeholder="500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualCost">Coût annuel (€)</Label>
              <Input
                id="annualCost"
                name="annualCost"
                type="number"
                step="0.01"
                placeholder="5000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Deadline</Label>
            <Input id="dueDate" name="dueDate" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Détails du projet…"
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
