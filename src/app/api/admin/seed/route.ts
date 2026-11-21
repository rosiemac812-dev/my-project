import { NextResponse } from "next/server";
import { seedDemoData } from "@/lib/db";

export async function POST() {
  try {
    seedDemoData();
    return NextResponse.json({ success: true, message: "Sample leads and inquiries seeded successfully!" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed demo data" }, { status: 500 });
  }
}
