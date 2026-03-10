"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ─── Types ───────────────────────────────────────────────────

type TeamMemberInput = {
  name: string;
  email: string;
  avatar?: string | null;
  role?: string | null;
};

// ─── Queries ─────────────────────────────────────────────────

export async function getTeamMembers() {
  return db.teamMember.findMany({
    include: {
      _count: {
        select: { assignedTasks: true, assignedIssues: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getTeamMemberById(id: string) {
  return db.teamMember.findUnique({
    where: { id },
    include: {
      assignedTasks: {
        include: {
          category: true,
          project: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      assignedIssues: {
        include: {
          project: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

// ─── Mutations ───────────────────────────────────────────────

export async function createTeamMember(data: TeamMemberInput) {
  const member = await db.teamMember.create({ data });
  revalidatePath("/settings/team");
  return member;
}

export async function updateTeamMember(id: string, data: Partial<TeamMemberInput>) {
  const member = await db.teamMember.update({ where: { id }, data });
  revalidatePath("/settings/team");
  return member;
}

export async function deleteTeamMember(id: string) {
  await db.teamMember.delete({ where: { id } });
  revalidatePath("/settings/team");
}
