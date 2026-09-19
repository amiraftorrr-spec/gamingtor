// Safe Client-Side Memory Pressure Probe & Memory Class Estimator

import { MemoryDetectionResult, MemoryClass, EvidenceItem } from "../types";

export async function probeMemory(skipStressTest = false): Promise<MemoryDetectionResult> {
  const reportedGb = typeof navigator !== "undefined" && "deviceMemory" in navigator
    ? (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8
    : 8;

  const evidence: EvidenceItem[] = [
    {
      source: "navigator",
      property: "deviceMemory",
      value: `${reportedGb} GB (محدود به سقف ۸ گیگابایت مرورگر)`,
      confidence: 0.7,
      reliability: "direct",
      description: "مقدار گزارش‌شده توسط مرورگر (حداکثر ۸ گیگابایت بر اساس استاندارد حریم خصوصی W3C)",
    },
  ];

  let maxAllocatedMb = 0;
  let allocationTestPassed = false;
  let bandwidthMBps: number | undefined = undefined;

  // Safe progressive memory allocation experiment
  if (!skipStressTest && typeof window !== "undefined") {
    const testSizesMb = [256, 512, 1024, 2048, 3072]; // safe incremental chunks

    for (const sizeMb of testSizesMb) {
      try {
        const bytes = sizeMb * 1024 * 1024;
        const tStart = performance.now();
        // Allocate buffer and perform sparse write to commit physical pages
        const buffer = new Uint8Array(bytes);
        const stride = 4096; // 1 page stride
        for (let i = 0; i < bytes; i += stride) {
          buffer[i] = (i & 0xff);
        }
        const tEnd = performance.now();
        const durationMs = tEnd - tStart;

        maxAllocatedMb = sizeMb;
        allocationTestPassed = true;

        if (durationMs > 0) {
          bandwidthMBps = Math.round((sizeMb / (durationMs / 1000)));
        }

        // Intentionally dereference for garbage collection
        (buffer as unknown as null) = null;
      } catch {
        // Allocation threshold reached or memory pressure signal received
        break;
      }
    }

    if (maxAllocatedMb >= 2048) {
      evidence.push({
        source: "memoryTest",
        property: "heapAllocation",
        value: `${maxAllocatedMb} MB در یک بافر منفرد`,
        confidence: 0.85,
        reliability: "strong",
        description: "توانایی تخصیص بدون خطای بیش از ۲ گیگابایت حافظه در تب، نشان‌دهنده رم ۱۶ گیگابایت یا بالاتر است.",
      });
    }
  }

  // Determine estimated memory class and true physical RAM estimate
  let estimatedClass: MemoryClass = "8 - 16 GB";
  let estimatedGb = 16;
  let confidence = 0.75;
  let memorySource: "navigator-capped" | "allocation-experiment" | "hardware-fusion-estimate" = "hardware-fusion-estimate";

  if (maxAllocatedMb >= 3072) {
    estimatedClass = "32 GB+";
    estimatedGb = 32;
    confidence = 0.82;
    memorySource = "allocation-experiment";
  } else if (maxAllocatedMb >= 1024 || reportedGb >= 8) {
    estimatedClass = "16 - 32 GB";
    estimatedGb = 16;
    confidence = 0.80;
    memorySource = "hardware-fusion-estimate";
  } else if (reportedGb >= 4) {
    estimatedClass = "8 - 16 GB";
    estimatedGb = 8;
    confidence = 0.75;
    memorySource = "navigator-capped";
  } else {
    estimatedClass = "<= 4 GB";
    estimatedGb = 4;
    confidence = 0.85;
    memorySource = "navigator-capped";
  }

  return {
    reportedGb,
    estimatedClass,
    estimatedGb,
    confidence,
    memorySource,
    isEstimated: true,
    allocationTestPassed,
    maxAllocatedMb,
    bandwidthMBps,
    evidence,
  };
}

export function estimateMemoryClass(reportedGb: number, maxAllocatedMb: number): MemoryClass {
  if (maxAllocatedMb >= 3072) {
    return "32 GB+";
  } else if (maxAllocatedMb >= 1024 || reportedGb >= 8) {
    return "16 - 32 GB";
  } else if (reportedGb >= 4) {
    return "4 - 8 GB";
  } else {
    return "<= 4 GB";
  }
}

export const runMemoryAllocationProbe = probeMemory;
