"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ─── Types ───────────────────────────────────────────────────

type CategoryInput = {
  name: string;
  emoji: string;
  color: string;
  isCustom?: boolean;
};

// ─── Queries ─────────────────────────────────────────────────

export async function getCategories() {
  return db.category.findMany({
    include: { _count: { select: { tasks: true } } },
    orderBy: [{ isCustom: "asc" }, { name: "asc" }],
  });
}

export async function getCategoryById(id: string) {
  return db.category.findUnique({
    where: { id },
    include: { _count: { select: { tasks: true } } },
  });
}

// ─── Mutations ───────────────────────────────────────────────

export async function createCategory(data: CategoryInput) {
  const category = await db.category.create({
    data: { ...data, isCustom: true },
  });
  revalidatePath("/settings/categories");
  revalidatePath("/tasks");
  return category;
}

export async function updateCategory(id: string, data: Partial<CategoryInput>) {
  const category = await db.category.update({ where: { id }, data });
  revalidatePath("/settings/categories");
  revalidatePath("/tasks");
  return category;
}

export async function deleteCategory(id: string) {
  await db.category.delete({ where: { id } });
  revalidatePath("/settings/categories");
  revalidatePath("/tasks");
}
