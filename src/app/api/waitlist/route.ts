import { NextRequest, NextResponse } from "next/server";
import { addWaitlistEntry, getWaitlistCount } from "@/lib/db";
import { isValidEmail } from "@/lib/utils";

export async function GET() {
  try {
    const count = getWaitlistCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Waitlist GET error:", error);
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, role, team_size, use_case } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter a valid full name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid work email address." },
        { status: 400 }
      );
    }

    const result = addWaitlistEntry({
      name,
      email,
      company,
      role,
      team_size,
      use_case,
    });

    return NextResponse.json({
      success: true,
      position: result.position,
      alreadyExists: result.alreadyExists || false,
      message: result.alreadyExists
        ? "You're already on the waitlist! We'll reach out soon."
        : "You've successfully secured your spot on the OrbitX early access waitlist!",
    });
  } catch (error) {
    console.error("Waitlist POST error:", error);
    return NextResponse.json(
      { error: "Failed to process waitlist entry. Please try again." },
      { status: 500 }
    );
  }
}
