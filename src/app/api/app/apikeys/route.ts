import { NextRequest, NextResponse } from "next/server";
import { getApiKeys, createApiKey, deleteApiKey } from "@/lib/db";

export async function GET() {
  try {
    const keys = getApiKeys();
    return NextResponse.json({ keys });
  } catch (error) {
    console.error("GET api keys error:", error);
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Key name is required" }, { status: 400 });
    }

    const result = createApiKey(name);
    return NextResponse.json({
      success: true,
      key: result.key,
      item: result.item,
    });
  } catch (error) {
    console.error("POST api key error:", error);
    return NextResponse.json({ error: "Failed to generate API key" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Key ID is required" }, { status: 400 });
    }

    deleteApiKey(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE api key error:", error);
    return NextResponse.json({ error: "Failed to revoke API key" }, { status: 500 });
  }
}
