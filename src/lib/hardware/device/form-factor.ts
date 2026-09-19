// Multi-Signal Form Factor Classifier (Laptop vs Desktop vs Unknown)

import { FormFactorResult, EvidenceItem } from "../types";

export async function classifyFormFactor(
  isOptimusDualGpu = false,
  rendererHint = ""
): Promise<FormFactorResult> {
  const evidence: EvidenceItem[] = [];
  let hasBattery = false;
  let isCharging: boolean | undefined = undefined;
  let batteryFound = false;

  // 1. Probing Battery API
  if (typeof navigator !== "undefined" && "getBattery" in navigator) {
    try {
      const getBattery = (
        navigator as unknown as {
          getBattery?: () => Promise<{
            charging: boolean;
            level: number;
            chargingTime?: number;
            dischargingTime?: number;
          }>;
        }
      ).getBattery;

      if (getBattery) {
        const battery = await getBattery();
        if (battery && typeof battery.charging === "boolean") {
          // Desktops on Chromium return level=1, charging=true, dischargingTime=Infinity
          // True laptop has level < 1.0 or charging === false or finite dischargingTime
          const isRealBattery =
            battery.level < 1.0 ||
            battery.charging === false ||
            (typeof battery.dischargingTime === "number" &&
              battery.dischargingTime !== Infinity &&
              !isNaN(battery.dischargingTime)) ||
            (typeof battery.chargingTime === "number" &&
              battery.chargingTime > 0 &&
              battery.chargingTime !== Infinity);

          if (isRealBattery) {
            batteryFound = true;
            hasBattery = true;
            isCharging = battery.charging;
            evidence.push({
              source: "battery",
              property: "Battery Status",
              value: `Level: ${Math.round(battery.level * 100)}%, Charging: ${battery.charging}`,
              confidence: 0.95,
              reliability: "direct",
              description: "باتری واقعی فیزیکی در سیستم شناسایی شد که نشان‌دهنده دستگاه لپ‌تاپ / پرتابل است.",
            });
          }
        }
      }
    } catch {}
  }

  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const screenW = typeof window !== "undefined" && window.screen ? window.screen.width : 1920;
  const screenH = typeof window !== "undefined" && window.screen ? window.screen.height : 1080;
  const touchPoints = typeof navigator !== "undefined" ? navigator.maxTouchPoints || 0 : 0;
  const rLower = (rendererHint || "").toLowerCase();

  // 2. Mobile Silicon Signature
  const isMobileSilicon =
    rLower.includes("laptop gpu") ||
    rLower.includes("mobile") ||
    rLower.includes("max-q") ||
    rLower.includes("tgl") ||
    rLower.includes("tiger lake") ||
    rLower.includes("iris xe") ||
    rLower.includes("radeon 680m") ||
    rLower.includes("radeon 780m") ||
    rLower.includes("radeon 890m") ||
    rLower.includes("adl-p") ||
    rLower.includes("adl-m") ||
    rLower.includes("rpl-p") ||
    rLower.includes("meteor lake") ||
    rLower.includes("lunar lake") ||
    rLower.includes("apple m") ||
    /\b(ga107m|ga106m|ad107m|ad106m|tu117m)\b/i.test(rLower);

  if (isMobileSilicon) {
    evidence.push({
      source: "webgl",
      property: "Mobile Architecture Silicon",
      value: "تراشه گرافیکی/پردازشی با معماری ویژه لپ‌تاپ",
      confidence: 0.92,
      reliability: "strong",
      description: "شناسه معماری یا تراشه متعلق به پلتفرم‌های موبایل و لپ‌تاپ است.",
    });
  }

  // 3. Desktop Silicon Signature
  const isDesktopSilicon =
    rLower.includes("pcie") ||
    rLower.includes("desktop") ||
    rLower.includes("super") ||
    (rLower.includes("ti") && !rLower.includes("laptop") && !rLower.includes("mobile"));

  if (isDesktopSilicon && !batteryFound) {
    evidence.push({
      source: "webgl",
      property: "Desktop PCIe Silicon",
      value: "کارت گرافیک دسکتاپ مجزا",
      confidence: 0.9,
      reliability: "strong",
      description: "شناسه گرافیک متعلق به نسخه کامل دسکتاپ PCIe می‌باشد.",
    });
  }

  // 4. Decision Matrix
  let type: "laptop" | "desktop" | "unknown" = "desktop";
  let confidence = 0.8;

  if (isMobileSilicon || batteryFound) {
    type = "laptop";
    confidence = batteryFound ? 0.95 : 0.88;
  } else if (isDesktopSilicon && !batteryFound) {
    type = "desktop";
    confidence = 0.92;
  } else if (isOptimusDualGpu && !isDesktopSilicon) {
    type = "laptop";
    confidence = 0.82;
  } else if ((screenW === 1366 && screenH === 768) || (screenW === 1536 && screenH === 864)) {
    type = "laptop";
    confidence = 0.7;
  } else {
    type = "desktop";
    confidence = 0.8;
  }

  return {
    type,
    confidence,
    hasBattery,
    isCharging,
    isOptimusDualGpu,
    dpr,
    touchPoints,
    evidence,
  };
}

export const determineFormFactor = classifyFormFactor;
