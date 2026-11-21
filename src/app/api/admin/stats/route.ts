import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/lib/db";

export async function GET() {
  try {
    const metrics = getDashboardMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (error) {
    console.error("Admin stats GET error:", error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
