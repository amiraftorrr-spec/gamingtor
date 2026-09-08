import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

interface CachedRate {
  rate: number;
  updatedAt: number;
  source: string;
}

// In-memory cache across requests on the server
let cachedRateData: CachedRate | null = null;

export async function GET() {
  const now = Date.now();

  // If cache is fresh (< 2 hours), return cached data immediately without calling the external API
  if (cachedRateData && now - cachedRateData.updatedAt < TWO_HOURS_MS) {
    const nextUpdateIn = TWO_HOURS_MS - (now - cachedRateData.updatedAt);
    return NextResponse.json(
      {
        rate: cachedRateData.rate,
        source: `${cachedRateData.source}-cached`,
        updatedAt: cachedRateData.updatedAt,
        nextUpdateIn,
        success: true,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=7200, stale-while-revalidate=3600",
        },
      }
    );
  }

  // Otherwise, fetch fresh rate from API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch("https://call.tgju.org/ajax.json", {
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const rial = Number(
        String(data?.current?.price_dollar_rl?.p ?? "").replace(/,/g, "")
      );
      if (Number.isFinite(rial) && rial > 0) {
        const tomanRate = Math.round(rial / 10);
        cachedRateData = {
          rate: tomanRate,
          updatedAt: now,
          source: "tgju",
        };

        return NextResponse.json(
          {
            rate: tomanRate,
            source: "tgju",
            updatedAt: now,
            nextUpdateIn: TWO_HOURS_MS,
            success: true,
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=7200, stale-while-revalidate=3600",
            },
          }
        );
      }
    }
  } catch (error) {
    console.warn("TGJU dollar rate request failed:", error);
  }

  // If fetch failed but we have previous cached data, keep using it instead of fallback
  if (cachedRateData) {
    return NextResponse.json({
      rate: cachedRateData.rate,
      source: `${cachedRateData.source}-stale`,
      updatedAt: cachedRateData.updatedAt,
      nextUpdateIn: 10 * 60 * 1000, // retry in 10 mins
      success: true,
    });
  }

  // Fallback if never fetched before
  const defaultFallback = 220000;
  cachedRateData = {
    rate: defaultFallback,
    updatedAt: now,
    source: "fallback",
  };

  return NextResponse.json({
    rate: defaultFallback,
    source: "fallback",
    updatedAt: now,
    nextUpdateIn: TWO_HOURS_MS,
    success: true,
  });
}
