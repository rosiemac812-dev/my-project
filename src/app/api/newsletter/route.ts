import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/db";
import { isValidEmail } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const result = addSubscriber(email);

    return NextResponse.json({
      success: true,
      alreadyExists: result.alreadyExists,
      message: result.alreadyExists
        ? "You're already subscribed to our engineering updates!"
        : "Subscribed! You'll receive our monthly changelog and architecture breakdowns.",
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }
}
