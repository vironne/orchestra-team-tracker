"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ─── Types ───────────────────────────────────────────────────

export type ContactInfo = {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
};

type ClientInput = {
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  contacts?: ContactInfo[];
  notes?: string | null;
};

// ─── Queries ─────────────────────────────────────────────────

export async function getClients() {
  return db.client.findMany({
    include: { projects: { select: { id: true, status: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getClientById(id: string) {
  return db.client.findUnique({
    where: { id },
    include: {
      projects: {
        include: {
          invoices: true,
          issues: true,
          _count: { select: { tasks: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

// ─── Mutations ───────────────────────────────────────────────

export async function createClient(data: ClientInput) {
  // Validate required fields
  if (!data.name || !data.name.trim()) {
    return { success: false as const, error: "Le nom de l'entreprise est requis" };
  }

  // Sanitize contacts — ensure it's a clean JSON-serializable array
  const cleanContacts = (data.contacts ?? [])
    .filter((c) => c && typeof c.name === "string" && c.name.trim() !== "")
    .map((c) => ({
      name: c.name.trim(),
      email: c.email?.trim() || "",
      phone: c.phone?.trim() || "",
      role: c.role?.trim() || "",
    }));

  try {
    const client = await db.client.create({
      data: {
        name: data.name.trim(),
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        company: data.company?.trim() || null,
        contacts: cleanContacts,
        notes: data.notes?.trim() || null,
      },
    });
    revalidatePath("/clients");
    return { success: true as const, data: client };
  } catch (error) {
    console.error("[createClient] Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false as const, error: `Impossible de créer l'entreprise: ${message}` };
  }
}

export async function updateClient(id: string, data: Partial<ClientInput>) {
  try {
    const client = await db.client.update({ where: { id }, data });
    revalidatePath("/clients");
    revalidatePath(`/clients/${id}`);
    return { success: true as const, data: client };
  } catch (error) {
    console.error("[updateClient] Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false as const, error: `Impossible de mettre à jour l'entreprise: ${message}` };
  }
}

export async function deleteClient(id: string) {
  try {
    await db.client.delete({ where: { id } });
    revalidatePath("/clients");
    return { success: true as const };
  } catch (error) {
    console.error("[deleteClient] Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false as const, error: `Impossible de supprimer l'entreprise: ${message}` };
  }
}
