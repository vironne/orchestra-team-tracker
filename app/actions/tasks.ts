"use server";

import { db } from "@/lib/db";
import { TaskStatus, TaskPriority } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ─── Types ───────────────────────────────────────────────────

type TaskInput = {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  categoryId: string;
  assigneeId?: string | null;
  projectId?: string | null;
  dueDate?: Date | null;
};

// ─── Common includes ─────────────────────────────────────────

const taskIncludes = {
  category: true,
  assignee: { select: { id: true, name: true, avatar: true } },
  project: { select: { id: true, name: true, client: { select: { id: true, name: true } } } },
} as const;

// ─── Helpers ─────────────────────────────────────────────────

/** Map task priority to issue priority */
function mapTaskPriorityToIssuePriority(taskPriority: TaskPriority) {
  const map: Record<string, "critical" | "high" | "medium" | "low"> = {
    urgent: "high",
    normal: "medium",
    low: "low",
  };
  return map[taskPriority] ?? "medium";
}

// ─── Queries ─────────────────────────────────────────────────

export async function getTasks() {
  return db.task.findMany({
    include: taskIncludes,
    orderBy: { createdAt: "desc" },
  });
}

export async function getTaskById(id: string) {
  return db.task.findUnique({
    where: { id },
    include: taskIncludes,
  });
}

export async function getTasksByAssignee(assigneeId: string) {
  return db.task.findMany({
    where: { assigneeId },
    include: taskIncludes,
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
  });
}

export async function getTasksByCategory(categoryId: string) {
  return db.task.findMany({
    where: { categoryId },
    include: taskIncludes,
    orderBy: { createdAt: "desc" },
  });
}

// ─── Mutations ───────────────────────────────────────────────

export async function createTask(data: TaskInput) {
  const task = await db.task.create({ data });

  // Auto-create Issue when task is in a "bug"-type category AND linked to a project
  if (data.projectId) {
    try {
      const category = await db.category.findUnique({
        where: { id: data.categoryId },
      });
      // Match categories whose name contains "bug" (case insensitive)
      if (category && /bug/i.test(category.name)) {
        await db.issue.create({
          data: {
            projectId: data.projectId,
            title: data.title,
            description: data.description ?? null,
            status: "open",
            priority: mapTaskPriorityToIssuePriority(data.priority ?? "normal"),
            type: "bug",
            assigneeId: data.assigneeId ?? null,
          },
        });
        revalidatePath(`/projects/${data.projectId}`);
        revalidatePath("/bugs");
      }
    } catch {
      // Non-blocking — issue creation failure shouldn't block the task
    }
  }

  revalidatePath("/tasks");
  revalidatePath("/my-tasks");
  if (data.projectId) revalidatePath(`/projects/${data.projectId}`);
  return task;
}

export async function updateTask(id: string, data: Partial<TaskInput>) {
  const task = await db.task.update({ where: { id }, data });
  revalidatePath("/tasks");
  revalidatePath("/my-tasks");
  return task;
}

export async function deleteTask(id: string) {
  await db.task.delete({ where: { id } });
  revalidatePath("/tasks");
  revalidatePath("/my-tasks");
}
