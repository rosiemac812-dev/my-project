import { NextRequest, NextResponse } from "next/server";
import { executeCryptoSwap } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromAsset, toAsset, amount } = body;

    if (!fromAsset || !toAsset || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid swap parameters" }, { status: 400 });
    }

    const result = executeCryptoSwap(fromAsset, toAsset, Number(amount));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Crypto swap error:", error);
    return NextResponse.json({ error: "Swap execution failed" }, { status: 500 });
  }
}
