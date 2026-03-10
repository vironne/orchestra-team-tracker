export const dynamic = "force-dynamic";

import { getCategories } from "@/app/actions/categories";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { CategoryFormDialog } from "@/components/forms/category-form";
import { CategoryRow } from "@/components/category-row";

export default async function CategoriesPage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  try {
    categories = await getCategories();
  } catch {
    // DB not connected
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catégories"
        description="Gérez les catégories de tâches de l'équipe"
      >
        <CategoryFormDialog />
      </PageHeader>

      {categories.length === 0 ? (
        <EmptyState
          icon="🏷️"
          title="Aucune catégorie"
          description="Ajoutez des catégories pour organiser les tâches (facturation, admin, commercial…)."
        >
          <CategoryFormDialog />
        </EmptyState>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
