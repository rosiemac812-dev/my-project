import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

export async function GET() {
  try {
    // Generate realistic orderbook depth for ORBX/USDT
    const midPrice = 14.85;
    const bids = Array.from({ length: 8 }, (_, i) => {
      const price = midPrice - (i + 1) * 0.04;
      const amount = Math.floor(150 + Math.random() * 850);
      return { price: Number(price.toFixed(3)), amount, total: Number((price * amount).toFixed(2)) };
    });

    const asks = Array.from({ length: 8 }, (_, i) => {
      const price = midPrice + (i + 1) * 0.04;
      const amount = Math.floor(150 + Math.random() * 850);
      return { price: Number(price.toFixed(3)), amount, total: Number((price * amount).toFixed(2)) };
    }).reverse();

    return NextResponse.json({
      prices: siteConfig.cryptoPrices,
      stats: siteConfig.marketStats,
      orderBook: {
        pair: "ORBX/USDT",
        midPrice,
        bids,
        asks,
      },
    });
  } catch (error) {
    console.error("Crypto market API error:", error);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}
