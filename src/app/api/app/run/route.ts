import { NextRequest, NextResponse } from "next/server";
import { getWorkflowById, recordPipelineRun } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workflowId, inputPayload } = body;

    if (!workflowId) {
      return NextResponse.json({ error: "Workflow ID is required" }, { status: 400 });
    }

    const workflow = getWorkflowById(Number(workflowId));
    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    const promptText =
      typeof inputPayload === "string"
        ? inputPayload
        : JSON.stringify(inputPayload || { message: "Test payload trigger" });

    // Simulate realistic agentic workflow multi-node execution
    let parsedNodes: Array<{ id: string; name: string; type: string }> = [];
    try {
      parsedNodes = JSON.parse(workflow.nodes_json);
    } catch {
      parsedNodes = [{ id: "n1", name: "Default Step", type: "llm" }];
    }

    const stepExecutions = parsedNodes.map((node, index) => {
      const stepLatency = Math.floor(12 + Math.random() * 35);
      return {
        nodeId: node.id,
        nodeName: node.name,
        type: node.type,
        stepIndex: index + 1,
        latencyMs: stepLatency,
        status: "success",
        telemetry: {
          cacheHit: index === 1,
          tokens: Math.floor(80 + Math.random() * 240),
        },
      };
    });

    const totalLatency = stepExecutions.reduce((acc, curr) => acc + curr.latencyMs, 14);
    const tokensUsed = stepExecutions.reduce((acc, curr) => acc + curr.telemetry.tokens, 210);
    const costEstimate = `$0.00${Math.floor(tokensUsed * 0.12)}`;

    // Generate tailored synthesis output based on category
    let simulatedOutput: Record<string, unknown> = {};

    if (workflow.category === "Customer Support") {
      simulatedOutput = {
        resolution_status: "RESOLVED_AUTO",
        intent: "billing_invoice_dispute",
        confidence: "99.2%",
        sentiment: "neutral_urgent",
        suggested_reply:
          "Hello! We have reviewed your invoice #9812. The discrepancy was due to an automatic prorated seat expansion. We have credited $49.00 to your account.",
        action_dispatched: "Zendesk API update & Slack #support-alerts notification sent",
      };
    } else if (workflow.category === "Revenue Ops") {
      simulatedOutput = {
        lead_score: 94,
        tier: "Tier 1 - High Propensity",
        enriched_company: {
          name: "Vortex Scale AI",
          employees: "150-250",
          industry: "Cloud Infrastructure",
          current_stack: ["Next.js", "PostgreSQL", "AWS"],
        },
        assigned_ae: "Sarah Chen",
        action_dispatched: "Hubspot deal created & calendar invite queued",
      };
    } else if (workflow.category === "Finance & Legal") {
      simulatedOutput = {
        document_type: "SEC Form 10-Q (Q3)",
        gross_margin: "68.4% (vs 70.1% expected)",
        delta_explanation: "Supply chain freight cost inflation noted in Footnote 4",
        risk_level: "LOW - Covered by cash reserves ($42.8M)",
        compliance_check: "PASSED (SOX 404 certified)",
      };
    } else {
      simulatedOutput = {
        execution_status: "COMPLETED",
        workflow_name: workflow.name,
        processed_input_length: promptText.length,
        synthesis: "Successfully chained autonomous reasoning nodes and delivered response.",
        validation_code: "OK_200",
      };
    }

    // Save run record to database
    const savedRun = recordPipelineRun({
      workflow_id: workflow.id,
      workflow_name: workflow.name,
      input_payload: promptText,
      output_payload: JSON.stringify(simulatedOutput),
      latency_ms: totalLatency,
      tokens_used: tokensUsed,
      cost: costEstimate,
      status: "success",
    });

    return NextResponse.json({
      success: true,
      runId: savedRun.id,
      workflow: {
        id: workflow.id,
        name: workflow.name,
        category: workflow.category,
      },
      stats: {
        totalLatencyMs: totalLatency,
        tokensUsed,
        costEstimate,
        status: "success",
      },
      steps: stepExecutions,
      output: simulatedOutput,
    });
  } catch (error) {
    console.error("Run pipeline error:", error);
    return NextResponse.json({ error: "Failed to execute pipeline" }, { status: 500 });
  }
}
