import { NextResponse } from "next/server";
import { getCryptoTransactions, getCryptoOrders } from "@/lib/db";

export async function GET() {
  try {
    const transactions = getCryptoTransactions();
    const orders = getCryptoOrders();
    return NextResponse.json({ transactions, orders });
  } catch (error) {
    console.error("Crypto tx error:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}
