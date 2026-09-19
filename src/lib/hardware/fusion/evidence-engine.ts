// Evidence Fusion & Confidence Rating Engine

import { EvidenceItem, ReliabilityLevel } from "../types";

export function formatConfidenceTier(confidence: number): {
  tier: "very-high" | "high" | "moderate" | "low" | "uncertain";
  label: string;
  percentage: number;
  badgeColor: string;
} {
  const percentage = Math.round(confidence * 100);

  if (confidence >= 0.92) {
    return {
      tier: "very-high",
      label: "دقت بسیار بالا (شواهد مستقیم سخت‌افزاری)",
      percentage,
      badgeColor: "#00ff7f",
    };
  } else if (confidence >= 0.82) {
    return {
      tier: "high",
      label: "دقت بالا (تطبیق قوی معماری و بنچمارک)",
      percentage,
      badgeColor: "#2ed573",
    };
  } else if (confidence >= 0.68) {
    return {
      tier: "moderate",
      label: "دقت متوسط (تطبیق مشخصات و رفتار پردازشی)",
      percentage,
      badgeColor: "#00d2d3",
    };
  } else if (confidence >= 0.5) {
    return {
      tier: "low",
      label: "تخمین عملکردی (محدودیت دسترسی مرورگر)",
      percentage,
      badgeColor: "#ffa502",
    };
  } else {
    return {
      tier: "uncertain",
      label: "تخمین تقریبی",
      percentage,
      badgeColor: "#ff4757",
    };
  }
}

export function aggregateEvidence(items: EvidenceItem[]): {
  directCount: number;
  strongCount: number;
  estimatedCount: number;
  overallScore: number;
} {
  let directCount = 0;
  let strongCount = 0;
  let estimatedCount = 0;
  let totalWeightedConfidence = 0;
  let totalWeights = 0;

  for (const item of items) {
    let weight = 1;
    if (item.reliability === "direct") {
      directCount++;
      weight = 4;
    } else if (item.reliability === "strong") {
      strongCount++;
      weight = 2.5;
    } else if (item.reliability === "estimated") {
      estimatedCount++;
      weight = 1.2;
    }

    totalWeightedConfidence += item.confidence * weight;
    totalWeights += weight;
  }

  const overallScore = totalWeights > 0 ? Number((totalWeightedConfidence / totalWeights).toFixed(2)) : 0.7;

  return {
    directCount,
    strongCount,
    estimatedCount,
    overallScore,
  };
}

export class EvidenceFusionEngine {
  private items: EvidenceItem[] = [];
  private logs: string[] = [];

  addLog(msg: string): void {
    this.logs.push(`[${new Date().toISOString()}] ${msg}`);
  }

  getLogs(): string[] {
    return this.logs;
  }

  recordDirect(property: string, value: unknown, confidence: number = 0.95, source: string = "webgl"): void {
    this.items.push({
      property,
      value,
      confidence,
      reliability: "direct",
      source: source as any,
      description: `مشاهده مستقیم پارامتر سخت‌افزاری از طریق ${source}`,
    });
  }

  recordStrongInference(property: string, value: unknown, confidence: number = 0.88, source: string = "hardware-database"): void {
    this.items.push({
      property,
      value,
      confidence,
      reliability: "strong",
      source: source as any,
      description: `استنتاج تطبیقی با پایگاه داده سخت‌افزاری (${source})`,
    });
  }

  recordBenchmarkEstimate(property: string, value: unknown, confidence: number = 0.75, source: string = "wasm-simd"): void {
    this.items.push({
      property,
      value,
      confidence,
      reliability: "estimated",
      source: source as any,
      description: `تخمین عملکردی بر مبنای بنچمارک (${source})`,
    });
  }

  addEvidence(item: EvidenceItem): void {
    this.items.push(item);
  }

  getEvidenceList(): EvidenceItem[] {
    return this.items;
  }

  computeOverallConfidence(): number {
    return aggregateEvidence(this.items).overallScore;
  }

  exportMasterReport(data: Record<string, unknown> = {}): Record<string, unknown> {
    return {
      timestamp: new Date().toISOString(),
      overallConfidence: this.computeOverallConfidence(),
      evidence: this.items,
      logs: this.logs,
      ...data,
    };
  }
}
