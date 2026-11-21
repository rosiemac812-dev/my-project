import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pair = "ORBX/USDT", amount = 100 } = body;

    const coin = siteConfig.cryptoPrices.find((c) => `${c.symbol}/USDT` === pair) || siteConfig.cryptoPrices[0];

    return NextResponse.json({
      success: true,
      simulation: {
        pair,
        fillPrice: coin.price,
        amount,
        totalUsd: coin.price * Number(amount),
        networkFee: "$0.00",
        settlementTimeMs: 1.2,
        route: "OrbitX L2 Relayer → Liquidity Vault",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Demo API error:", error);
    return NextResponse.json({ error: "Failed to run simulation." }, { status: 500 });
  }
}
