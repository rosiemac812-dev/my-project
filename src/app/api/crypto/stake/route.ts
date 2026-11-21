import { NextRequest, NextResponse } from "next/server";
import { stakeCryptoTokens, getCryptoStakes } from "@/lib/db";

export async function GET() {
  try {
    const stakes = getCryptoStakes();
    return NextResponse.json({ stakes });
  } catch (error) {
    console.error("Crypto stakes GET error:", error);
    return NextResponse.json({ error: "Failed to fetch stakes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symbol, amount, durationDays, apy } = body;

    if (!symbol || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid staking parameters" }, { status: 400 });
    }

    const result = stakeCryptoTokens(symbol, Number(amount), Number(durationDays || 365), Number(apy || 24.8));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Crypto stake error:", error);
    return NextResponse.json({ error: "Staking transaction failed" }, { status: 500 });
  }
}
