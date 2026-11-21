import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scenarioId } = body;

    const scenario = siteConfig.demoScenarios.find((s) => s.id === scenarioId) || siteConfig.demoScenarios[0];

    // Simulate realistic execution latency
    return NextResponse.json({
      success: true,
      scenario,
      timestamp: new Date().toISOString(),
      stats: {
        totalLatencyMs: 140,
        tokensProcessed: 1420,
        costEstimate: "$0.0018",
        accuracyConfidence: "99.2%",
      },
    });
  } catch (error) {
    console.error("Demo API error:", error);
    return NextResponse.json({ error: "Failed to run simulation." }, { status: 500 });
  }
}
