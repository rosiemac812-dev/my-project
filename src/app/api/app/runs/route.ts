import { NextRequest, NextResponse } from "next/server";
import { getPipelineRuns } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 50;
    const workflowId = searchParams.get("workflowId") ? Number(searchParams.get("workflowId")) : undefined;

    const runs = getPipelineRuns(limit, workflowId);
    return NextResponse.json({ runs });
  } catch (error) {
    console.error("GET runs error:", error);
    return NextResponse.json({ error: "Failed to fetch runs" }, { status: 500 });
  }
}
