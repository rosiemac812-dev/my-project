import { NextRequest, NextResponse } from "next/server";
import { getWorkflows, createWorkflow, updateWorkflow, deleteWorkflow } from "@/lib/db";

export async function GET() {
  try {
    const workflows = getWorkflows();
    return NextResponse.json({ workflows });
  } catch (error) {
    console.error("GET workflows error:", error);
    return NextResponse.json({ error: "Failed to fetch workflows" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, category, nodes } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Workflow name is required" }, { status: 400 });
    }

    const workflow = createWorkflow({
      name,
      description,
      category: category || "Custom",
      nodes: nodes || [
        { id: "node-1", type: "trigger", name: "HTTP Webhook Event", config: {} },
        { id: "node-2", type: "llm", name: "Inference Reasoner", config: { model: "Gemini 2.0 Flash" } },
        { id: "node-3", type: "action", name: "JSON Webhook Dispatch", config: {} },
      ],
    });

    return NextResponse.json({ success: true, workflow });
  } catch (error) {
    console.error("POST workflow error:", error);
    return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, description, category, status, nodes } = body;

    if (!id) {
      return NextResponse.json({ error: "Workflow ID is required" }, { status: 400 });
    }

    const success = updateWorkflow(Number(id), { name, description, category, status, nodes });
    return NextResponse.json({ success });
  } catch (error) {
    console.error("PATCH workflow error:", error);
    return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Workflow ID is required" }, { status: 400 });
    }

    const success = deleteWorkflow(Number(id));
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE workflow error:", error);
    return NextResponse.json({ error: "Failed to delete workflow" }, { status: 500 });
  }
}
