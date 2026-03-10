"use server";

import { db } from "@/lib/db";
import { ProjectStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ─── Types ───────────────────────────────────────────────────

type ProjectInput = {
  name: string;
  clientId: string;
  status?: ProjectStatus;
  startDate?: Date | null;
  dueDate?: Date | null;
  budget?: number | null;
  monthlyCost?: number | null;
  annualCost?: number | null;
  tags?: string[];
  notes?: string | null;
};

// ─── Queries ─────────────────────────────────────────────────

export async function getProjects() {
  return db.project.findMany({
    include: {
      client: { select: { id: true, name: true } },
      _count: { select: { invoices: true, issues: true, tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectById(id: string) {
  return db.project.findUnique({
    where: { id },
    include: {
      client: true,
      invoices: { orderBy: { createdAt: "desc" } },
      issues: {
        include: { assignee: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
      },
      tasks: {
        include: {
          assignee: { select: { id: true, name: true, avatar: true } },
          category: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

// ─── Mutations ───────────────────────────────────────────────

export async function createProject(data: ProjectInput) {
  const project = await db.project.create({
    data: {
      name: data.name,
      clientId: data.clientId,
      status: data.status,
      startDate: data.startDate,
      dueDate: data.dueDate,
      budget: data.budget,
      monthlyCost: data.monthlyCost,
      annualCost: data.annualCost,
      tags: data.tags ?? [],
      notes: data.notes,
    },
  });
  revalidatePath("/projects");
  revalidatePath("/clients");
  return project;
}

export async function updateProject(id: string, data: Partial<ProjectInput>) {
  const project = await db.project.update({ where: { id }, data });
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return project;
}

export async function deleteProject(id: string) {
  await db.project.delete({ where: { id } });
  revalidatePath("/projects");
  revalidatePath("/clients");
}
