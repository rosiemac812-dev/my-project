import { NextResponse } from "next/server";
import { getAppStats } from "@/lib/db";

export async function GET() {
  try {
    const stats = getAppStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("App stats GET error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
