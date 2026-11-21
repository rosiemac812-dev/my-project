import { NextRequest, NextResponse } from "next/server";
import {
  getWaitlistEntries,
  updateWaitlistStatus,
  deleteWaitlistEntry,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage,
} from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "waitlist";
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;

    if (type === "contacts") {
      const contacts = getContactMessages();
      return NextResponse.json({ data: contacts });
    }

    const entries = getWaitlistEntries(search, status);
    return NextResponse.json({ data: entries });
  } catch (error) {
    console.error("Admin leads GET error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes, type } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    if (type === "contacts") {
      updateContactStatus(Number(id), status);
    } else {
      updateWaitlistStatus(Number(id), status, notes);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin leads PATCH error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type") || "waitlist";

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (type === "contacts") {
      deleteContactMessage(Number(id));
    } else {
      deleteWaitlistEntry(Number(id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin leads DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
