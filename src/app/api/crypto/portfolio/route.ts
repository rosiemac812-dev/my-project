import { NextResponse } from "next/server";
import { getCryptoPortfolio } from "@/lib/db";

export async function GET() {
  try {
    const portfolio = getCryptoPortfolio();
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Crypto portfolio error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}
