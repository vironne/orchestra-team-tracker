import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await db.client.create({
      data: {
        name: "Test API " + Date.now(),
        email: null,
        phone: null,
        company: null,
        contacts: [{ name: "Test Contact", email: "test@test.com", phone: "", role: "DG" }],
        notes: null,
      },
    });
    // Clean up
    await db.client.delete({ where: { id: client.id } });
    return NextResponse.json({ success: true, client });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("[test-create] ERROR:", error);
    return NextResponse.json({ success: false, error: message, stack }, { status: 500 });
  }
}
