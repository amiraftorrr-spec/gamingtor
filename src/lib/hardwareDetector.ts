// Master Hardware Synthesizer & Client-Side Detection Engine (Next.js & Browser Safe)

import { getGPUTier } from "@pmndrs/detect-gpu";
import {
  GPU_DATABASE,
  CPU_DATABASE,
  GpuSpec,
  CpuSpec,
  findGpuByQuery,
  findCpuByQuery,
  resolveBestGpu,
  resolveBestCpu,
  resolveCpuCandidates,
} from "./hardwareDatabase";

import {
  EvidenceItem,
  VramInfo,
  GpuDetectionResult,
  CpuDetectionResult,
  MemoryDetectionResult,
  DisplayDetectionResult,
  MediaCapabilitiesResult,
  FormFactorResult,
  DualGpuResult,
  CodecSupportItem,
} from "./hardware/types";

import {
  probeWebGpuAdapters,
  runWebGpuComputeBenchmark,
  WebGpuAdapterData,
} from "./hardware/gpu/webgpu";

import { probeWebGl, runWebGlFallbackBenchmark } from "./hardware/gpu/webgl";
import { parseAndNormalizeRenderer } from "./hardware/gpu/renderer-parser";
import { runWasmCpuBenchmarkSuite } from "./hardware/cpu/wasm-benchmark";
import { probeMemory } from "./hardware/memory/memory-probe";
import { probeMediaCapabilitiesMatrix } from "./hardware/media/capabilities";
import { classifyFormFactor } from "./hardware/device/form-factor";
import { formatConfidenceTier } from "./hardware/fusion/evidence-engine";

export interface DisplayInfo {
  resolution: string;
  width: number;
  height: number;
  physicalWidth: number;
  physicalHeight: number;
  dpr: number;
  refreshRate: number;
  isHdr: boolean;
  aspectRatio: string;
  colorDepth: number;
}

export interface BenchmarkMetrics {
  cpuScore: number; // 0 - 100
  gpuFps: number; // Offscreen benchmark FPS
  gpuScore?: number; // Offscreen compute shader score (0 - 100)
  gflops: number; // Estimated single-thread GFLOPS
  multiCoreFactor: number;
  overallScore: number;
}

export interface DeviceFormFactor {
  isLaptop: boolean;
  confidence: "high" | "medium" | "low";
  hasBattery: boolean;
  isCharging?: boolean;
  isOptimusDualGpu: boolean;
  dpr: number;
}

export interface SynthesizedHardware {
  gpu: {
    id?: string;
    name: string;
    vendor: string;
    vram: string;
    vramGb: number;
    tier: "S+" | "S" | "A" | "B" | "C" | "D";
    architecture?: string;
    isDiscrete: boolean;
    isLaptop?: boolean;
    secondaryGpu?: string;
    confidence?: number;
    confidenceTier?: "very-high" | "high" | "moderate" | "low" | "uncertain";
    vramSource?: string;
    vramIsEstimated?: boolean;
  };
  cpu: {
    id?: string;
    name: string;
    vendor: string;
    cores: number;
    threads: number;
    tier: "S+" | "S" | "A" | "B" | "C" | "D";
    generation?: string;
    score: number;
    isLaptop?: boolean;
    confidence?: number;
    confidenceTier?: "very-high" | "high" | "moderate" | "low" | "uncertain";
    candidates?: CpuSpec[];
  };
  ram: {
    gb: number;
    totalGb: number;
    label: string;
    isEstimated: boolean;
    estimatedClass?: string;
    confidence?: number;
  };
  display: DisplayInfo;
  benchmark: BenchmarkMetrics;
  os: {
    name: string;
    platform: string;
    arch: string;
    formFactor?: "laptop" | "desktop";
    isLaptop?: boolean;
    formFactorConfidence?: number;
  };
  tier: "S+" | "S" | "A" | "B" | "C" | "D";
  overallTier: "S+" | "S" | "A" | "B" | "C" | "D";
  tierTitle: string;
  overallScore: number;
  detectionConfidence: "high" | "medium" | "estimated";
  evidenceList?: EvidenceItem[];
  mediaMatrix?: CodecSupportItem[];
  webGpuDetails?: WebGpuAdapterData;
  debugLogs?: string[];
}

// Clean GPU unmasked renderer string from browser WebGL / WebGPU
export function cleanGpuName(raw: string): string {
  if (!raw) return "";
  const parsed = parseAndNormalizeRenderer(raw);
  return parsed.normalized || raw;
}

// Check if a GPU is dedicated/discrete
export function isDedicatedGpu(name: string): boolean {
  if (!name) return false;
  const parsed = parseAndNormalizeRenderer(name);
  return parsed.isDiscrete;
}

// 1. WebGPU Probing
export async function probeWebGPU(): Promise<{
  supported: boolean;
  architecture?: string;
  vendor?: string;
  description?: string;
  maxBufferSizeMb?: number;
  highPerfGpu?: string;
  lowPowerGpu?: string;
}> {
  const data = await probeWebGpuAdapters();
  const maxBufBytes = data.limits.maxBufferSize || 0;
  const maxBufferSizeMb = Math.round(maxBufBytes / (1024 * 1024));

  return {
    supported: data.supported,
    architecture: data.highPerfInfo?.architecture || data.lowPowerInfo?.architecture,
    vendor: data.highPerfInfo?.vendor || data.lowPowerInfo?.vendor,
    description: data.highPerfInfo?.description || data.highPerfInfo?.device || data.lowPowerInfo?.description,
    maxBufferSizeMb,
    highPerfGpu: data.highPerfInfo?.description || data.highPerfInfo?.device || data.highPerfInfo?.architecture,
    lowPowerGpu: data.lowPowerInfo?.description || data.lowPowerInfo?.device || data.lowPowerInfo?.architecture,
  };
}

// 2. WebGL Probing
export function probeWebGL(): {
  highPerfRenderer: string;
  highPerfVendor: string;
  lowPowerRenderer: string;
  maxTextureSize: number;
  hasBptcCompression: boolean;
  hasS3tcCompression: boolean;
  hasFloatColor: boolean;
} {
  const glData = probeWebGl();
  return {
    highPerfRenderer: glData.highPerfRenderer,
    highPerfVendor: glData.highPerfVendor,
    lowPowerRenderer: glData.lowPowerRenderer || "",
    maxTextureSize: glData.maxTextureSize,
    hasBptcCompression: true,
    hasS3tcCompression: true,
    hasFloatColor: true,
  };
}

// 3. detect-gpu library wrapper
export async function probeDetectGPU(): Promise<{
  tier?: number;
  type?: string;
  isMobile?: boolean;
  gpu?: string;
  device?: string;
  fps?: number;
}> {
  if (typeof window === "undefined") return {};
  try {
    const tier = await getGPUTier();
    return {
      tier: tier.tier,
      type: tier.type,
      isMobile: tier.isMobile,
      gpu: tier.gpu,
      device: tier.device,
      fps: tier.fps,
    };
  } catch {
    return {};
  }
}

// 4. Media Capabilities Probing
export async function probeMediaCapabilities(): Promise<{
  av1Supported: boolean;
  hevcSupported: boolean;
  vp9HdrSupported: boolean;
  av1PowerEfficient: boolean;
}> {
  const mediaRes = await probeMediaCapabilitiesMatrix();
  return {
    av1Supported: mediaRes.av1_4k60,
    hevcSupported: mediaRes.hevc_main10_4k60,
    vp9HdrSupported: mediaRes.vp9_p2_4k60,
    av1PowerEfficient: mediaRes.av1_4k60,
  };
}

// 5. Display & Refresh Rate Measure
export async function measureDisplayMetrics(): Promise<DisplayInfo> {
  if (typeof window === "undefined") {
    return {
      resolution: "1920 x 1080 (FHD)",
      width: 1920,
      height: 1080,
      physicalWidth: 1920,
      physicalHeight: 1080,
      dpr: 1,
      refreshRate: 60,
      isHdr: false,
      aspectRatio: "16:9 (عریض)",
      colorDepth: 24,
    };
  }

  const dpr = window.devicePixelRatio || 1;
  const screenW = window.screen?.width || 1920;
  const screenH = window.screen?.height || 1080;
  const physicalW = Math.round(screenW * dpr);
  const physicalH = Math.round(screenH * dpr);

  let isHdr = false;
  try {
    isHdr = window.matchMedia("(dynamic-range: high)").matches;
  } catch {}

  const colorDepth = window.screen?.colorDepth || 24;

  const refreshRate = await new Promise<number>((resolve) => {
    let frameCount = 0;
    let startTime: number | null = null;
    function countFrame(now: number) {
      if (!startTime) startTime = now;
      frameCount++;
      if (now - startTime < 350) {
        requestAnimationFrame(countFrame);
      } else {
        const measured = Math.round((frameCount / (now - startTime)) * 1000);
        if (measured >= 230) resolve(240);
        else if (measured >= 160) resolve(165);
        else if (measured >= 135) resolve(144);
        else if (measured >= 115) resolve(120);
        else if (measured >= 85) resolve(90);
        else if (measured >= 70) resolve(75);
        else resolve(60);
      }
    }
    requestAnimationFrame(countFrame);
  });

  const aspect = calculateAspectRatio(physicalW, physicalH);

  let resLabel = `${physicalW} x ${physicalH}`;
  if (physicalW >= 3840 || physicalH >= 2160) resLabel += " (4K Ultra HD)";
  else if (physicalW >= 2560 || physicalH >= 1440) resLabel += " (2K QHD)";
  else if (physicalW >= 1920 || physicalH >= 1080) resLabel += " (1080p FHD)";

  return {
    resolution: resLabel,
    width: screenW,
    height: screenH,
    physicalWidth: physicalW,
    physicalHeight: physicalH,
    dpr,
    refreshRate,
    isHdr,
    aspectRatio: aspect,
    colorDepth,
  };
}

export function calculateAspectRatio(w: number, h: number): string {
  if (!w || !h || h === 0) return "16:9 (عریض استاندارد)";
  const ratio = w / h;

  if (ratio >= 3.4 && ratio <= 3.65) return "32:9 (سوپر اولترا واید)";
  if (ratio >= 2.25 && ratio <= 2.45) return "21:9 (اولترا واید گیمینگ)";
  if (ratio >= 1.70 && ratio <= 1.82) return "16:9 (عریض استاندارد)";
  if (ratio >= 1.55 && ratio <= 1.65) return "16:10 (نمایشگر حرفه‌ای)";
  if (ratio >= 1.30 && ratio <= 1.38) return "4:3 (کلاسیک)";

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(w, h);
  const ratioW = Math.round(w / divisor);
  const ratioH = Math.round(h / divisor);
  return `${ratioW}:${ratioH}`;
}

// 6. WebAssembly CPU Benchmark
export async function runWasmCpuBenchmark(): Promise<{
  wasmSupported: boolean;
  cpuScore: number;
  durationMs: number;
  gflops: number;
}> {
  const suite = await runWasmCpuBenchmarkSuite();
  return {
    wasmSupported: suite.wasmSupported,
    cpuScore: suite.cpuScore,
    durationMs: suite.durationMs,
    gflops: suite.gflops,
  };
}

// 7. WebGL GPU Benchmark
export async function runWebGLGpuBenchmark(): Promise<number> {
  const res = await runWebGlFallbackBenchmark();
  return res.fps;
}

// Calibrated GPU compute benchmark (WebGPU compute preferred, WebGL fallback)
export async function runCalibratedGpuBenchmark(): Promise<{
  gpuScore: number;
  isCompute: boolean;
  durationMs: number;
}> {
  const webGpuBench = await runWebGpuComputeBenchmark();
  if (webGpuBench.success) {
    return {
      gpuScore: webGpuBench.overallScore,
      isCompute: true,
      durationMs: webGpuBench.durationMs,
    };
  }

  const glBench = await runWebGlFallbackBenchmark();
  return {
    gpuScore: glBench.gpuScore,
    isCompute: false,
    durationMs: glBench.durationMs,
  };
}

// 8. Device Form Factor Classifier
export async function detectDeviceFormFactor(
  dualGpuDetected = false,
  rendererHint = ""
): Promise<DeviceFormFactor> {
  const res = await classifyFormFactor(dualGpuDetected, rendererHint);
  return {
    isLaptop: res.type === "laptop",
    confidence: res.confidence >= 0.85 ? "high" : res.confidence >= 0.7 ? "medium" : "low",
    hasBattery: res.hasBattery,
    isCharging: res.isCharging,
    isOptimusDualGpu: res.isOptimusDualGpu,
    dpr: res.dpr,
  };
}

// 9. Master Hardware Synthesizer & Evidence Aggregator
export async function synthesizeClientHardware(customOverrides?: {
  gpuId?: string;
  cpuId?: string;
  ramGb?: number;
}): Promise<SynthesizedHardware> {
  const debugLogs: string[] = [];
  const evidenceList: EvidenceItem[] = [];

  debugLogs.push("🚀 آغاز اسکن بلادرنگ سخت‌افزار کلاینت...");

  // 1. Probing WebGPU, WebGL, and detect-gpu concurrently
  const [detectGpu, webGpuAdapters, webGl] = await Promise.all([
    probeDetectGPU(),
    probeWebGpuAdapters(),
    probeWebGL(),
  ]);

  debugLogs.push(`WebGL High-Perf Renderer: ${webGl.highPerfRenderer || "نامشخص"}`);
  if (webGpuAdapters.supported) {
    debugLogs.push(`WebGPU High-Perf Adapter: ${webGpuAdapters.highPerfInfo?.description || "شناسایی شد"}`);
  }

  const dualGpuDetected = Boolean(
    webGpuAdapters.hasDualAdapters ||
    (webGl.lowPowerRenderer &&
      webGl.highPerfRenderer &&
      webGl.lowPowerRenderer.toLowerCase() !== webGl.highPerfRenderer.toLowerCase())
  );

  const rawRendererCandidates = `${webGl.highPerfRenderer || ""} ${webGl.lowPowerRenderer || ""} ${detectGpu.gpu || ""} ${webGpuAdapters.highPerfInfo?.description || ""} ${webGpuAdapters.lowPowerInfo?.description || ""}`;

  // 2. Parallel probing of display, media matrix, benchmarks, memory, and form factor
  const [mediaMatrix, display, wasmBench, calibratedGpu, memoryResult, formFactorResult] = await Promise.all([
    probeMediaCapabilitiesMatrix(),
    measureDisplayMetrics(),
    runWasmCpuBenchmarkSuite(),
    runCalibratedGpuBenchmark(),
    probeMemory(false),
    classifyFormFactor(dualGpuDetected, rawRendererCandidates),
  ]);

  debugLogs.push(`WASM SIMD Status: ${wasmBench.wasmSimdSupported ? "فعال (v128)" : "اسکالر"}`);
  debugLogs.push(`Memory Classification: ${memoryResult.estimatedClass}`);
  debugLogs.push(`Form Factor Decision: ${formFactorResult.type} (${Math.round(formFactorResult.confidence * 100)}%)`);

  // Merge evidence items
  evidenceList.push(...formFactorResult.evidence);
  evidenceList.push(...memoryResult.evidence);
  evidenceList.push(...mediaMatrix.evidence);

  const isLaptop = formFactorResult.type === "laptop";
  const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 8 : 8;

  // 3. GPU Identification Pipeline
  let detectedGpuSpec: GpuSpec | null = null;
  let secondaryGpuName: string | undefined = undefined;
  let gpuConfidence = 0.85;

  if (customOverrides?.gpuId) {
    detectedGpuSpec = GPU_DATABASE.find((g) => g.id === customOverrides.gpuId) || null;
    gpuConfidence = 1.0;
  }

  if (!detectedGpuSpec) {
    const candidateStrings = [
      webGpuAdapters.highPerfInfo?.description || "",
      webGl.highPerfRenderer || "",
      detectGpu.gpu || "",
      webGpuAdapters.lowPowerInfo?.description || "",
      webGl.lowPowerRenderer || "",
    ].filter(Boolean);

    let discreteGpu: GpuSpec | null = null;
    let integratedGpu: GpuSpec | null = null;

    for (const str of candidateStrings) {
      const match = findGpuByQuery(str, {
        isLaptop,
        benchScore: calibratedGpu.gpuScore,
      });
      if (match) {
        if (match.isDiscrete) {
          if (!discreteGpu) {
            discreteGpu = match;
          } else {
            const currentIsLaptop = Boolean(discreteGpu.isLaptop);
            const matchIsLaptop = Boolean(match.isLaptop);
            if (matchIsLaptop === isLaptop && currentIsLaptop !== isLaptop) {
              discreteGpu = match;
            } else if (match.name.length > discreteGpu.name.length) {
              discreteGpu = match;
            }
          }
        } else {
          if (!integratedGpu) integratedGpu = match;
        }
      }
    }

    if (discreteGpu) {
      detectedGpuSpec = discreteGpu;
      gpuConfidence = 0.94;
      evidenceList.push({
        source: "webgl",
        property: "GPU Model Match",
        value: discreteGpu.name,
        confidence: 0.94,
        reliability: "direct",
        description: "رشته ارائه‌دهنده وب‌جی‌ال با پایگاه داده کارت‌های گرافیک مجزا تطبیق داده شد.",
      });

      if (integratedGpu && integratedGpu.id !== discreteGpu.id) {
        secondaryGpuName = `${integratedGpu.name} (گرافیک مجتمع نمایشگر)`;
      }
    } else if (integratedGpu) {
      detectedGpuSpec = integratedGpu;
      gpuConfidence = 0.9;
    }
  }

  if (!detectedGpuSpec) {
    const primaryStr = detectGpu.gpu || webGl.highPerfRenderer || webGpuAdapters.highPerfInfo?.description || "";
    detectedGpuSpec = resolveBestGpu({
      rawRenderer: primaryStr || rawRendererCandidates,
      query: primaryStr,
      isLaptop,
      benchScore: calibratedGpu.gpuScore,
      arch: webGpuAdapters.highPerfInfo?.architecture,
    });
    gpuConfidence = 0.78;
  }

  const finalGpuSpec = detectedGpuSpec || GPU_DATABASE[0];

  // 4. CPU Identification Pipeline
  let detectedCpuSpec: CpuSpec | null = null;
  let cpuConfidence = 0.82;
  const rawRendererForCpu = webGl.highPerfRenderer || detectGpu.gpu || rawRendererCandidates;

  if (customOverrides?.cpuId) {
    detectedCpuSpec = CPU_DATABASE.find((c) => c.id === customOverrides.cpuId) || null;
    cpuConfidence = 1.0;
  }

  if (!detectedCpuSpec) {
    detectedCpuSpec = resolveBestCpu({
      concurrency: cores,
      cpuScore: wasmBench.cpuScore,
      rawRenderer: rawRendererForCpu,
      isLaptop,
    });
    cpuConfidence = 0.85;

    evidenceList.push({
      source: "wasm",
      property: "CPU Performance Tier",
      value: `${detectedCpuSpec.name} (${cores} Threads)`,
      confidence: cpuConfidence,
      reliability: "strong",
      description: "بر اساس تعداد رشته‌های فعال و بنچمارک محاسباتی WebAssembly تطبیق داده شد.",
    });
  }

  const finalCpuSpec = detectedCpuSpec || CPU_DATABASE[0];

  const cpuCandidates = resolveCpuCandidates({
    concurrency: cores,
    cpuScore: wasmBench.cpuScore,
    rawRenderer: rawRendererForCpu,
    isLaptop,
  });

  // 5. RAM Fusion Logic
  let ramGb = customOverrides?.ramGb;
  let isEstimatedRam = false;

  if (!ramGb) {
    ramGb = memoryResult.estimatedGb;
    if (finalGpuSpec.score >= 88 || finalCpuSpec.threads >= 16) {
      ramGb = Math.max(ramGb, 32);
    } else if (finalGpuSpec.score >= 55 || finalCpuSpec.threads >= 12) {
      ramGb = Math.max(ramGb, 16);
    }
    isEstimatedRam = true;
  }

  // 6. Overall Performance Rating
  const gpuScore = finalGpuSpec.score || calibratedGpu.gpuScore || 50;
  const cpuScore = finalCpuSpec.score || wasmBench.cpuScore || 60;
  const benchOverall = Math.round(gpuScore * 0.6 + cpuScore * 0.3 + (wasmBench.cpuScore / 100) * 10);

  let overallTier: "S+" | "S" | "A" | "B" | "C" | "D" = "B";
  let tierTitle = "سیستم گیمینگ مناسب و استاندارد (1080p 60 FPS)";

  if (benchOverall >= 92) {
    overallTier = "S+";
    tierTitle = "سیستم پرچمدار گیمینگ و استریم (4K Ultra + Ray Tracing)";
  } else if (benchOverall >= 82) {
    overallTier = "S";
    tierTitle = "سیستم فوق‌حرفه‌ای (1440p / 4K Gaming)";
  } else if (benchOverall >= 70) {
    overallTier = "A";
    tierTitle = "سیستم قدرتمند گیمینگ (1080p High / Ultra)";
  } else if (benchOverall >= 52) {
    overallTier = "B";
    tierTitle = "سیستم گیمینگ استاندارد (1080p Medium / 60 FPS)";
  } else if (benchOverall >= 35) {
    overallTier = "C";
    tierTitle = "سیستم سبک و گرافیک مجتمع (720p / 1080p Low)";
  } else {
    overallTier = "D";
    tierTitle = "سیستم پایه برای بازی‌های کلاسیک";
  }

  // 7. OS Info
  let osName = "Windows 11 / 10 64-Bit";
  if (typeof navigator !== "undefined") {
    const ua = navigator.userAgent;
    if (ua.includes("Linux")) osName = "Linux (x86_64)";
    else if (ua.includes("Macintosh") || ua.includes("Mac OS")) osName = "macOS";
    else if (ua.includes("Android")) osName = "Android OS";
  }

  const gpuConfFormatted = formatConfidenceTier(gpuConfidence);
  const cpuConfFormatted = formatConfidenceTier(cpuConfidence);

  return {
    gpu: {
      id: finalGpuSpec.id,
      name: finalGpuSpec.name,
      vendor: finalGpuSpec.vendor,
      vram: finalGpuSpec.vram,
      vramGb: finalGpuSpec.vramGb,
      tier: finalGpuSpec.tier,
      architecture: finalGpuSpec.architecture,
      isDiscrete: finalGpuSpec.isDiscrete,
      isLaptop: finalGpuSpec.isLaptop,
      secondaryGpu: secondaryGpuName,
      confidence: gpuConfidence,
      confidenceTier: gpuConfFormatted.tier,
      vramSource: "مشخصات فنی ثابت مدل تطبیق‌داده‌شده",
      vramIsEstimated: true,
    },
    cpu: {
      id: finalCpuSpec.id,
      name: finalCpuSpec.name,
      vendor: finalCpuSpec.vendor,
      cores: finalCpuSpec.cores,
      threads: cores,
      tier: finalCpuSpec.tier,
      generation: finalCpuSpec.generation,
      score: finalCpuSpec.score,
      isLaptop: finalCpuSpec.isLaptop,
      confidence: cpuConfidence,
      confidenceTier: cpuConfFormatted.tier,
      candidates: cpuCandidates,
    },
    ram: {
      gb: ramGb,
      totalGb: ramGb,
      label: `${ramGb} گیگابایت (تخمینی بر اساس تست بافر)`,
      isEstimated: isEstimatedRam,
      estimatedClass: memoryResult.estimatedClass,
      confidence: memoryResult.confidence,
    },
    display,
    benchmark: {
      cpuScore: wasmBench.cpuScore,
      gpuFps: calibratedGpu.gpuScore,
      gpuScore: calibratedGpu.gpuScore,
      gflops: wasmBench.gflops,
      multiCoreFactor: Number((cores * 0.85).toFixed(1)),
      overallScore: benchOverall,
    },
    os: {
      name: osName,
      platform: typeof navigator !== "undefined" ? navigator.platform : "Win32",
      arch: "x86_64",
      formFactor: formFactorResult.type === "unknown" ? undefined : formFactorResult.type,
      isLaptop,
      formFactorConfidence: formFactorResult.confidence,
    },
    tier: overallTier,
    overallTier,
    tierTitle,
    overallScore: benchOverall,
    detectionConfidence: gpuConfidence >= 0.9 ? "high" : gpuConfidence >= 0.75 ? "medium" : "estimated",
    evidenceList,
    mediaMatrix: mediaMatrix.matrix,
    webGpuDetails: webGpuAdapters,
    debugLogs,
  };
}

export const detectClientHardwareScientific = synthesizeClientHardware;
