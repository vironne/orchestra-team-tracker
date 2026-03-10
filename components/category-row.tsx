"use client";

import { CategoryBadge } from "@/components/category-badge";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/app/actions/categories";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type CategoryWithCount = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  isCustom: boolean;
  _count: { tasks: number };
};

export function CategoryRow({ category }: { category: CategoryWithCount }) {
  async function handleDelete() {
    if (!confirm(`Supprimer la catégorie "${category.name}" ?`)) return;
    try {
      await deleteCategory(category.id);
      toast.success("Catégorie supprimée");
    } catch {
      toast.error("Erreur : cette catégorie a peut-être des tâches liées.");
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-800 px-4 py-3">
      <span className="text-2xl">{category.emoji}</span>
      <div className="min-w-0 flex-1">
        <h3 className="font-medium capitalize">{category.name}</h3>
        <p className="text-xs text-muted-foreground">
          {category._count.tasks} tâche{category._count.tasks !== 1 ? "s" : ""}
          {category.isCustom && " · Custom"}
        </p>
      </div>
      <CategoryBadge
        emoji={category.emoji}
        name={category.name}
        color={category.color}
      />
      {category.isCustom && (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-zinc-500 hover:text-red-400"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
