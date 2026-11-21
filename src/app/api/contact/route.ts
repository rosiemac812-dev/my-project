import { NextRequest, NextResponse } from "next/server";
import { addContactMessage } from "@/lib/db";
import { isValidEmail } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, interest } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
    }

    if (!message || message.trim().length < 5) {
      return NextResponse.json({ error: "Please enter a descriptive message." }, { status: 400 });
    }

    const result = addContactMessage({
      name,
      email,
      subject: subject || "General Inquiry",
      message,
      interest: interest || "General",
    });

    return NextResponse.json({
      success: true,
      id: result.id,
      message: "Thank you for reaching out! Our team will respond within 24 business hours.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
