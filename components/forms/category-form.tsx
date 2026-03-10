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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCategory } from "@/app/actions/categories";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const COLORS = [
  { value: "green", label: "Vert" },
  { value: "blue", label: "Bleu" },
  { value: "violet", label: "Violet" },
  { value: "orange", label: "Orange" },
  { value: "red", label: "Rouge" },
  { value: "yellow", label: "Jaune" },
  { value: "gray", label: "Gris" },
];

const colorDots: Record<string, string> = {
  green: "bg-emerald-500",
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  gray: "bg-zinc-500",
};

export function CategoryFormDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      await createCategory({
        name: form.get("name") as string,
        emoji: form.get("emoji") as string,
        color: form.get("color") as string,
      });
      toast.success("Catégorie créée");
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
          Nouvelle catégorie
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Nouvelle catégorie</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-[60px_1fr] gap-3">
            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji</Label>
              <Input
                id="emoji"
                name="emoji"
                required
                placeholder="🎯"
                className="text-center text-lg"
                maxLength={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Design"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Couleur</Label>
            <Select name="color" defaultValue="blue">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLORS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-3 w-3 rounded-full ${colorDots[c.value]}`}
                      />
                      {c.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
