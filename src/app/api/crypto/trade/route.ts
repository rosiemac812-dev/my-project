import { NextRequest, NextResponse } from "next/server";
import { executeCryptoTrade } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pair, side, order_type, price, amount } = body;

    if (!pair || !side || !price || !amount) {
      return NextResponse.json({ error: "Missing required trade fields" }, { status: 400 });
    }

    const result = executeCryptoTrade({
      pair,
      side: side === "sell" ? "sell" : "buy",
      order_type: order_type || "market",
      price: Number(price),
      amount: Number(amount),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Crypto trade error:", error);
    return NextResponse.json({ error: "Trade execution failed" }, { status: 500 });
  }
}
