"use server";

import { db } from "@/lib/db";
import { IssueStatus, IssuePriority, IssueType } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ─── Types ───────────────────────────────────────────────────

type IssueInput = {
  projectId: string;
  title: string;
  description?: string | null;
  status?: IssueStatus;
  priority?: IssuePriority;
  type?: IssueType;
  assigneeId?: string | null;
};

// ─── Common includes ─────────────────────────────────────────

const issueIncludes = {
  assignee: { select: { id: true, name: true, avatar: true } },
  project: { select: { id: true, name: true, client: { select: { id: true, name: true } } } },
} as const;

// ─── Queries ─────────────────────────────────────────────────

export async function getIssues() {
  return db.issue.findMany({
    include: issueIncludes,
    orderBy: { createdAt: "desc" },
  });
}

export async function getIssuesByProject(projectId: string) {
  return db.issue.findMany({
    where: { projectId },
    include: issueIncludes,
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
  });
}

export async function getIssueById(id: string) {
  return db.issue.findUnique({
    where: { id },
    include: issueIncludes,
  });
}

// ─── Mutations ───────────────────────────────────────────────

export async function createIssue(data: IssueInput) {
  const issue = await db.issue.create({ data });
  revalidatePath(`/projects/${data.projectId}`);
  revalidatePath("/bugs");
  revalidatePath("/my-tasks");
  return issue;
}

export async function updateIssue(id: string, data: Partial<IssueInput>) {
  const issue = await db.issue.update({
    where: { id },
    data,
    include: { project: { select: { id: true } } },
  });
  revalidatePath(`/projects/${issue.project.id}`);
  revalidatePath("/bugs");
  revalidatePath("/my-tasks");
  return issue;
}

export async function updateIssueStatus(id: string, status: IssueStatus) {
  const issue = await db.issue.update({
    where: { id },
    data: { status },
    include: { project: { select: { id: true } } },
  });
  revalidatePath(`/projects/${issue.project.id}`);
  revalidatePath("/bugs");
  return issue;
}

export async function deleteIssue(id: string) {
  const issue = await db.issue.delete({
    where: { id },
    include: { project: { select: { id: true } } },
  });
  revalidatePath(`/projects/${issue.project.id}`);
  revalidatePath("/bugs");
  revalidatePath("/my-tasks");
}
