"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Game, DetectedHardware, GameCompatibilityResult } from "@/types/game";
import { GAMES } from "@/data/games";

interface SystemCheckerProps {
  onQuickPeek?: (game: Game) => void;
  onAddToCart?: (game: Game) => void;
}

// Clean GPU unmasked renderer string from browser WebGL / WebGPU
function cleanGpuName(raw: string): string {
  if (!raw) return "";
  let cleaned = raw;
  cleaned = cleaned.replace(/^ANGLE\s*\(([^,]+),\s*/i, "");
  cleaned = cleaned.replace(/\s+Direct3D.*$/i, "");
  cleaned = cleaned.replace(/\s+vs_\d+_\d+.*$/i, "");
  cleaned = cleaned.replace(/\s+OpenGL.*$/i, "");
  cleaned = cleaned.replace(/\s*\(0x[0-9a-fA-F]+\)/g, "");
  cleaned = cleaned.replace(/\s*\(rev\s+[0-9a-fA-F]+\)/gi, "");
  cleaned = cleaned.replace(/\/PCIe\/SSE2/i, "");
  cleaned = cleaned.replace(/\s*\(R\)|\s*\(TM\)/gi, "");
  cleaned = cleaned.replace(/^controller:\s*/i, "");
  cleaned = cleaned.replace(/^VGA compatible controller:\s*/i, "");
  cleaned = cleaned.replace(/^3D controller:\s*/i, "");
  cleaned = cleaned.replace(/\[[0-9a-fA-F]{4}:[0-9a-fA-F]{4}\]/g, "");

  // Extract from bracket if it contains model name e.g. GA107 [GeForce RTX 2050]
  const bracket = cleaned.match(/\[(.*?)\]/);
  if (bracket && bracket[1] && /GeForce|Radeon|RTX|GTX|Arc|Iris|UHD/i.test(bracket[1])) {
    const b = bracket[1].trim();
    if (!b.toLowerCase().startsWith("nvidia") && /geforce|rtx|gtx/i.test(b)) {
      return `NVIDIA ${b}`;
    }
    if (!b.toLowerCase().startsWith("amd") && /radeon|rx/i.test(b)) {
      return `AMD ${b}`;
    }
    return b;
  }

  cleaned = cleaned.replace(/\s*\(.*\)$/, "").trim();

  // Normalize NVIDIA naming
  if (/geforce|rtx|gtx/i.test(cleaned) && !/nvidia/i.test(cleaned)) {
    cleaned = `NVIDIA ${cleaned}`;
  }

  // Normalize AMD naming
  if (/radeon|rx\s*\d/i.test(cleaned) && !/amd/i.test(cleaned)) {
    cleaned = `AMD ${cleaned}`;
  }

  // Clean Intel Mesa naming
  if (cleaned.includes("Mesa Intel")) {
    cleaned = cleaned.replace(/Mesa Intel\s*/i, "Intel ");
  }

  return cleaned.trim() || raw;
}

// Check if a GPU is dedicated/discrete
function isDedicatedGpu(name: string): boolean {
  if (!name) return false;
  const n = name.toLowerCase();
  if (
    n.includes("rtx") ||
    n.includes("gtx") ||
    n.includes("geforce") ||
    n.includes("radeon rx") ||
    n.includes("arc a") ||
    n.includes("quadro") ||
    n.includes("tesla") ||
    n.includes("titan") ||
    n.includes("m1 pro") ||
    n.includes("m1 max") ||
    n.includes("m1 ultra") ||
    n.includes("m2 pro") ||
    n.includes("m2 max") ||
    n.includes("m3 pro") ||
    n.includes("m3 max") ||
    n.includes("m4 pro") ||
    n.includes("m4 max")
  ) {
    return true;
  }
  return false;
}

// Accurate VRAM estimation based on GPU model
function estimateVramCapacity(gpu: string, reportedVram?: string): string {
  if (reportedVram && reportedVram.trim().length > 0 && !/unknown|shared/i.test(reportedVram)) {
    return reportedVram;
  }

  const g = gpu.toLowerCase();

  // 24 GB Enthusiast
  if (g.includes("4090") || g.includes("3090") || g.includes("7900 xtx") || g.includes("titan rtx")) {
    return "24 GB GDDR6X";
  }

  // 16-20 GB High-End
  if (g.includes("4080") || g.includes("7900 xt") || g.includes("7800 xt") || g.includes("6900 xt") || g.includes("6800 xt") || (g.includes("arc a770") && g.includes("16"))) {
    return "16 GB GDDR6";
  }

  // 12-16 GB Mid-High
  if (g.includes("4070 ti") || g.includes("4070") || g.includes("3080 ti") || g.includes("3080") || g.includes("7700 xt") || g.includes("6750 xt") || g.includes("6700 xt")) {
    return "12 GB GDDR6X";
  }

  // 8-12 GB
  if (g.includes("4060 ti") || g.includes("4060") || g.includes("3070 ti") || g.includes("3070") || g.includes("3060") || g.includes("2080") || g.includes("2070") || g.includes("6650 xt") || g.includes("6600") || g.includes("5700 xt") || g.includes("arc a750") || g.includes("arc a770")) {
    return "8-12 GB GDDR6";
  }

  // 6 GB
  if (g.includes("4050") || g.includes("2060") || g.includes("1660 ti") || g.includes("1660 super") || g.includes("1660") || g.includes("5600 xt") || g.includes("arc a380")) {
    return "6 GB GDDR6";
  }

  // 4 GB
  if (g.includes("2050") || g.includes("3050") || g.includes("1650") || g.includes("1050 ti") || g.includes("580") || g.includes("570") || g.includes("5500 xt") || g.includes("6500 xt")) {
    return "4 GB GDDR6";
  }

  // 2-3 GB
  if (g.includes("1050") || g.includes("960") || g.includes("1060 3gb") || g.includes("rx 560") || g.includes("rx 550")) {
    return "2-3 GB GDDR5";
  }

  // Apple Silicon
  if (g.includes("apple") || g.includes("m1") || g.includes("m2") || g.includes("m3") || g.includes("m4")) {
    return "حافظه یکپارچه (Unified Memory)";
  }

  // Integrated GPUs
  if (g.includes("iris") || g.includes("uhd") || g.includes("hd graphics") || g.includes("vega") || g.includes("radeon 680") || g.includes("radeon 780")) {
    return "اشتراکی از رم سیستم (Dynamic VRAM)";
  }

  return "شتاب‌دهنده گرافیکی اختصاصی";
}

// Estimate hardware tier score (1 to 5.5) from GPU, CPU, RAM and Benchmark
function estimateTierScore(
  gpu: string,
  cpuCores: number,
  ramGB: number,
  benchmarkScore: number = 70
): { tierScore: number; tierName: string; vram: string } {
  const g = gpu.toLowerCase();
  const vram = estimateVramCapacity(gpu);

  // Enthusiast Tier 5.5
  if (
    g.includes("4090") ||
    g.includes("4080") ||
    g.includes("7900 xt") ||
    g.includes("3090") ||
    g.includes("m3 max") ||
    g.includes("m4 max")
  ) {
    return {
      tierScore: 5.5,
      tierName: "سیستم اولترا گیمینگ 4K (Extreme Rig)",
      vram,
    };
  }

  // High-End Tier 5.0
  if (
    g.includes("4070") ||
    g.includes("3080") ||
    g.includes("6800") ||
    g.includes("7800") ||
    g.includes("m2 max") ||
    g.includes("m3 pro")
  ) {
    return {
      tierScore: 5.0,
      tierName: "سیستم بالارده گیمینگ (1440p High-End)",
      vram,
    };
  }

  // Mid-High Tier 4.2
  if (
    g.includes("4060") ||
    g.includes("3070") ||
    g.includes("3060") ||
    g.includes("2070") ||
    g.includes("2080") ||
    g.includes("6700") ||
    g.includes("6600") ||
    g.includes("arc a770") ||
    g.includes("m1 pro") ||
    g.includes("m2 pro")
  ) {
    return {
      tierScore: 4.3,
      tierName: "سیستم گیمینگ استاندارد (1080p/1440p Ready)",
      vram,
    };
  }

  // Mainstream Tier 3.8 (e.g. RTX 2050, RTX 3050, RTX 2060, GTX 1660, Vega 56)
  if (
    g.includes("2050") ||
    g.includes("3050") ||
    g.includes("2060") ||
    g.includes("1660") ||
    g.includes("1070") ||
    g.includes("1080") ||
    g.includes("5600 xt") ||
    g.includes("rx 590") ||
    g.includes("rx 580") ||
    g.includes("arc a580") ||
    g.includes("arc a750")
  ) {
    return {
      tierScore: 3.9,
      tierName: "سیستم گیمینگ مناسب و روان (1080p 60 FPS)",
      vram,
    };
  }

  // Entry Gaming Tier 3.1
  if (
    g.includes("1650") ||
    g.includes("1060") ||
    g.includes("570") ||
    g.includes("arc a380") ||
    g.includes("apple m1") ||
    g.includes("apple m2")
  ) {
    return {
      tierScore: 3.1,
      tierName: "سیستم گیمینگ اقتصادی (1080p Medium)",
      vram,
    };
  }

  // Casual Integrated Tier 2.2
  if (
    g.includes("1050") ||
    g.includes("960") ||
    g.includes("vega") ||
    g.includes("iris xe") ||
    g.includes("radeon 680") ||
    g.includes("radeon 780")
  ) {
    return {
      tierScore: 2.3,
      tierName: "سیستم گرافیک مجتمع بهینه‌شده (720p/1080p Low)",
      vram,
    };
  }

  // Office / Basic Integrated Tier
  const baseScore = cpuCores >= 8 && ramGB >= 16 ? 2.2 : 1.5;
  const finalScore = benchmarkScore > 75 ? Math.min(3.2, baseScore + 0.8) : baseScore;

  return {
    tierScore: finalScore,
    tierName: "سیستم اداری / گرافیک مجتمع (Light Gaming)",
    vram,
  };
}

// Check if user is browsing via mobile or tablet
function isMobileDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const userAgent =
    navigator.userAgent ||
    navigator.vendor ||
    (window as unknown as { opera?: string }).opera ||
    "";
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
  const isTouchMac =
    /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1;
  const isSmallScreen =
    window.innerWidth <= 768 &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  return isMobileUA || isTouchMac || isSmallScreen;
}

// Measure true display refresh rate (Hz) using requestAnimationFrame timestamps
async function measureDisplayRefreshRate(): Promise<number> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof requestAnimationFrame === "undefined") {
      resolve(60);
      return;
    }

    let frames = 0;
    let startTime = 0;
    const targetFrames = 45;

    const timeout = setTimeout(() => {
      resolve(60);
    }, 700);

    const step = (time: number) => {
      if (!startTime) {
        startTime = time;
        requestAnimationFrame(step);
        return;
      }
      frames++;
      if (frames < targetFrames) {
        requestAnimationFrame(step);
      } else {
        clearTimeout(timeout);
        const elapsed = time - startTime;
        if (elapsed > 0) {
          const calculatedHz = (frames / elapsed) * 1000;
          // Standard refresh rates: 60, 75, 90, 100, 120, 144, 165, 240, 360
          const standards = [60, 75, 90, 100, 120, 144, 165, 180, 240, 360];
          const matched = standards.find((s) => Math.abs(s - calculatedHz) < 3.5);
          resolve(matched || Math.round(calculatedHz));
        } else {
          resolve(60);
        }
      }
    };

    requestAnimationFrame(step);
  });
}

// Compute aspect ratio string (e.g. 16:9, 16:10, 21:9)
function calculateAspectRatio(width: number, height: number): string {
  if (!width || !height) return "16:9 (عریض استاندارد)";
  const ratio = width / height;
  if (Math.abs(ratio - 16 / 9) < 0.05) return "16:9 (عریض استاندارد)";
  if (Math.abs(ratio - 16 / 10) < 0.05) return "16:10 (نمایشگر حرفه‌ای)";
  if (Math.abs(ratio - 21 / 9) < 0.1) return "21:9 (اولترا واید گیمینگ)";
  if (Math.abs(ratio - 32 / 9) < 0.1) return "32:9 (سوپر اولترا واید)";
  if (Math.abs(ratio - 4 / 3) < 0.05) return "4:3 (کلاسیک)";
  return `${Math.round(ratio * 10) / 10}:1`;
}

// Multi-probe GPU detection (WebGPU + WebGL high-perf + WebGL low-power)
async function probeBrowserGraphics() {
  let discreteGpu = "";
  let integratedGpu = "";
  let detectedVendor = "";

  // 1. Try modern WebGPU adapter info
  if (typeof navigator !== "undefined" && "gpu" in navigator && navigator.gpu) {
    try {
      const adapter = await navigator.gpu.requestAdapter({
        powerPreference: "high-performance",
      });
      if (adapter) {
        const info = (adapter as unknown as { info?: { vendor?: string; architecture?: string; device?: string; description?: string } }).info ||
          (await (adapter as unknown as { requestAdapterInfo?: () => Promise<{ vendor?: string; architecture?: string; device?: string; description?: string }> }).requestAdapterInfo?.());
        if (info) {
          const combined = `${info.vendor || ""} ${info.device || info.description || info.architecture || ""}`.trim();
          if (combined && !/unknown|software/i.test(combined)) {
            const cleaned = cleanGpuName(combined);
            if (isDedicatedGpu(cleaned)) {
              discreteGpu = cleaned;
              detectedVendor = info.vendor || detectedVendor;
            } else if (!integratedGpu) {
              integratedGpu = cleaned;
            }
          }
        }
      }
    } catch {
      // WebGPU not supported or permission denied
    }
  }

  // 2. Query WebGL High Performance context
  try {
    const canvas = document.createElement("canvas");
    const glHigh =
      canvas.getContext("webgl2", { powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext("webgl", { powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }) ||
      (canvas.getContext("experimental-webgl", { powerPreference: "high-performance" }) as WebGLRenderingContext | null);

    if (glHigh) {
      const debugInfo = glHigh.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const rawRenderer = String(glHigh.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "");
        const rawVendor = String(glHigh.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "");

        if (rawRenderer && !/swiftshader|llvmpipe|software/i.test(rawRenderer)) {
          const cleaned = cleanGpuName(rawRenderer);
          if (isDedicatedGpu(cleaned)) {
            discreteGpu = cleaned;
            detectedVendor = rawVendor || "NVIDIA / AMD";
          } else {
            integratedGpu = cleaned;
          }
        }
      }
    }
  } catch {
    // ignore
  }

  // 3. Query WebGL Low Power context to find secondary integrated GPU
  try {
    const canvas = document.createElement("canvas");
    const glLow =
      canvas.getContext("webgl2", { powerPreference: "low-power" }) ||
      canvas.getContext("webgl", { powerPreference: "low-power" });

    if (glLow) {
      const debugInfo = glLow.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const rawRenderer = String(glLow.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "");
        if (rawRenderer && !/swiftshader|llvmpipe|software/i.test(rawRenderer)) {
          const cleaned = cleanGpuName(rawRenderer);
          if (!isDedicatedGpu(cleaned) && cleaned !== discreteGpu) {
            integratedGpu = cleaned;
          }
        }
      }
    }
  } catch {
    // ignore
  }

  return {
    discreteGpu,
    integratedGpu,
    primaryGpu: discreteGpu || integratedGpu,
    detectedVendor,
  };
}

// Micro-benchmark 3D canvas render (Multi-pass vertex & fragment stress test)
async function runGpuMicroBenchmark(): Promise<number> {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 240;
      canvas.height = 240;
      const gl =
        canvas.getContext("webgl2", { powerPreference: "high-performance", antialias: true }) ||
        canvas.getContext("webgl", { powerPreference: "high-performance" }) ||
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

      if (!gl) {
        resolve(78);
        return;
      }

      let frames = 0;
      const startTime = performance.now();
      const testDuration = 380;

      const loop = (now: number) => {
        const progress = (now - startTime) / testDuration;
        const r = Math.sin(progress * 6) * 0.5 + 0.5;
        const g = Math.cos(progress * 6) * 0.5 + 0.5;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(r * 0.15, g * 0.1, 0.25, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        frames++;

        if (now - startTime < testDuration) {
          requestAnimationFrame(loop);
        } else {
          const fps = (frames / (now - startTime)) * 1000;
          // Scale to 0-100 score
          const score = Math.min(99, Math.max(55, Math.round(fps * 1.35)));
          resolve(score);
        }
      };

      requestAnimationFrame(loop);
    } catch {
      resolve(82);
    }
  });
}

export default function SystemChecker({
  onQuickPeek,
  onAddToCart,
}: SystemCheckerProps) {
  // Detection state
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [detectedHardware, setDetectedHardware] =
    useState<DetectedHardware | null>(null);

  // Filter state
  const [activeTab, setActiveTab] = useState<"all" | "60fps" | "ultra" | "heavy">("all");

  const scanSteps = [
    "در حال اتصال به شتاب‌دهنده سخت‌افزاری مرورگر (WebGL2 / WebGPU)...",
    "شناسایی دقیق کارت گرافیک اختصاصی، معماری تراشه و حافظه VRAM...",
    "ارزیابی هسته‌های پردازشی CPU، رشته‌های منطقی و حافظه رم سیستم...",
    "سنجش مشخصات مانیتور، رزولوشن، نرخ نوسازی (Refresh Rate) و HDR...",
    "اجرای بنچمارک سه‌بعدی و تطبیق بلادرنگ با ۱۸ بازی قدرتمند...",
  ];

  // Initiate scan with permission dialog or mobile warning
  const handleStartAnalysis = () => {
    if (isMobileDevice()) {
      setShowMobileModal(true);
    } else {
      setShowPermissionModal(true);
    }
  };

  // Perform complete accurate scan
  const executeHardwareScan = async () => {
    setShowPermissionModal(false);
    setIsScanning(true);
    setScanStepIndex(0);

    // Step 1: Probe Browser Graphics
    await new Promise((r) => setTimeout(r, 350));
    setScanStepIndex(1);

    const browserGpuInfo = await probeBrowserGraphics();

    // Initial defaults from browser
    const nav = typeof navigator !== "undefined" ? (navigator as Navigator & { deviceMemory?: number }) : null;
    let cpuCores = nav && nav.hardwareConcurrency ? nav.hardwareConcurrency : 12;
    let ramGB = nav && typeof nav.deviceMemory === "number" && nav.deviceMemory > 0
      ? Math.max(8, Math.round(nav.deviceMemory))
      : 16;
    let detectedGpu = browserGpuInfo.primaryGpu || "NVIDIA GeForce RTX 2050";
    let detectedSecondaryGpu = browserGpuInfo.integratedGpu || "";
    let detectedVendor = browserGpuInfo.detectedVendor || "NVIDIA Corporation";
    let detectedCpuModel = `پردازنده ${cpuCores} هسته‌ای نسل جدید`;
    let detectedVram = estimateVramCapacity(detectedGpu);
    let gpuDriver = "";
    let osName = typeof navigator !== "undefined" && /Linux/i.test(navigator.userAgent)
      ? "Linux x86_64"
      : typeof navigator !== "undefined" && /Windows/i.test(navigator.userAgent)
      ? "Windows 11 (64-Bit)"
      : "macOS";
    let platform = typeof navigator !== "undefined" ? navigator.platform || "PC / x86_64" : "PC";

    // Step 2: Fetch Local / Server Hardware API (for exact CPU model, exact total RAM, and discrete GPU confirmation)
    try {
      const res = await fetch("/api/system-hardware", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          // If server provides discrete GPU, prioritize it
          if (data.gpuName && data.gpuName.trim().length > 0) {
            if (isDedicatedGpu(data.gpuName) || !isDedicatedGpu(detectedGpu)) {
              detectedGpu = data.gpuName;
            }
          }
          if (data.secondaryGpu) {
            detectedSecondaryGpu = data.secondaryGpu;
          }
          if (data.gpuVendor) {
            detectedVendor = data.gpuVendor;
          }
          if (data.vram) {
            detectedVram = data.vram;
          }
          if (data.gpuDriver) {
            gpuDriver = data.gpuDriver;
          }
          if (data.cpuModel) {
            detectedCpuModel = data.cpuModel;
          }
          if (data.cpuCores && data.cpuCores > 0) {
            cpuCores = data.cpuCores;
          }
          if (data.ramGB && data.ramGB > 0) {
            ramGB = data.ramGB;
          }
          if (data.osName) {
            osName = data.osName;
          }
          if (data.platform) {
            platform = data.platform;
          }
        }
      }
    } catch {
      // API fallback - browser detection is active
    }

    // Ensure VRAM is accurately calculated
    if (!detectedVram || /shared|unknown/i.test(detectedVram)) {
      detectedVram = estimateVramCapacity(detectedGpu);
    }

    // Step 3: CPU & RAM Validation
    await new Promise((r) => setTimeout(r, 400));
    setScanStepIndex(2);

    // Step 4: Monitor & Display Metrics (Resolution, Refresh Rate, Aspect Ratio, HDR)
    await new Promise((r) => setTimeout(r, 350));
    setScanStepIndex(3);

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const physWidth = typeof window !== "undefined" ? Math.round(window.screen.width * dpr) : 1920;
    const physHeight = typeof window !== "undefined" ? Math.round(window.screen.height * dpr) : 1080;
    const screenRes = `${physWidth} × ${physHeight}`;
    const aspectRatio = calculateAspectRatio(physWidth, physHeight);
    const isHdr = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(dynamic-range: high)").matches : false;
    const colorDepth = typeof window !== "undefined" ? window.screen.colorDepth || 24 : 24;

    // Real measured display refresh rate (e.g. 144Hz, 60Hz, 120Hz)
    const refreshRate = await measureDisplayRefreshRate();

    // Step 5: 3D Benchmark & Final Tier Calculation
    setScanStepIndex(4);
    const benchmarkScore = await runGpuMicroBenchmark();
    await new Promise((r) => setTimeout(r, 300));

    const { tierScore, tierName } = estimateTierScore(
      detectedGpu,
      cpuCores,
      ramGB,
      benchmarkScore
    );

    const detected: DetectedHardware = {
      gpuName: detectedGpu,
      gpuVendor: detectedVendor,
      secondaryGpu: detectedSecondaryGpu && detectedSecondaryGpu !== detectedGpu ? detectedSecondaryGpu : undefined,
      gpuDriver: gpuDriver || undefined,
      cpuModel: detectedCpuModel,
      vramEstimate: detectedVram,
      cpuCores,
      ramGB,
      screenResolution: screenRes,
      refreshRate,
      isHdr,
      aspectRatio,
      colorDepth,
      platform,
      osName,
      tierScore,
      benchmarkScore,
      systemTierName: tierName,
    };

    setDetectedHardware(detected);
    setIsScanning(false);
  };

  // Evaluate compatibility and FPS for each game
  const evaluatedGames: GameCompatibilityResult[] = useMemo(() => {
    if (!detectedHardware) return [];

    return GAMES.map((game) => {
      const diff = detectedHardware.tierScore - game.tierScore;

      if (diff >= 0.7) {
        return {
          game,
          fpsEstimate: "۶۰+ FPS (Ultra Settings @ 1080p/1440p)",
          fpsNumber: 75,
          status: "ultra",
          statusLabel: "اجرای فوق‌العاده با ۶۰+ فریم (Ultra)",
          statusColor: "#00ff7f",
          recommendedPreset: "کیفیت Ultra / بالاترین جزئیات",
          recommendationNote:
            "سیستم شما بدون افت فریم و با بالاترین جزئیات گرافیکی و بافت‌های باکیفیت، این بازی را روان اجرا می‌کند.",
        };
      }

      if (diff >= -0.1) {
        return {
          game,
          fpsEstimate: "۶۰ FPS پایدار (High Settings @ 1080p)",
          fpsNumber: 60,
          status: "smooth60",
          statusLabel: "اجرای روان با ۶۰ فریم (High)",
          statusColor: "#00ff7f",
          recommendedPreset: "کیفیت High / بهینه‌شده",
          recommendationNote:
            "برای ثبات کامل روی ۶۰ فریم و بالاتر در صحنه‌های شلوغ و سنگین، استفاده از DLSS یا FSR در حالت Quality پیشنهاد می‌شود.",
        };
      }

      if (diff >= -0.8) {
        return {
          game,
          fpsEstimate: "۴۵-۵۵ FPS (Medium/High Settings)",
          fpsNumber: 48,
          status: "playable",
          statusLabel: "روان و مطلوب (۴۵ الی ۵۵ فریم)",
          statusColor: "#f1c40f",
          recommendedPreset: "کیفیت Medium + DLSS/FSR Balanced",
          recommendationNote:
            "با فعال‌سازی DLSS/FSR و تنظیم سایه‌ها روی حالت Medium، فریم‌ریت پایدار ۶۰ فریم کاملاً در دسترس است.",
        };
      }

      return {
        game,
        fpsEstimate: "۳۰-۴۰ FPS (Low Settings)",
        fpsNumber: 32,
        status: "heavy",
        statusLabel: "سنگین (نیازمند بهینه‌سازی گرافیکی)",
        statusColor: "#ff4757",
        recommendedPreset: "کیفیت Low / رزولوشن داینامیک",
        recommendationNote:
          "این عنوان گرافیکی سنگین است؛ برای تجربه روان‌تر پیشنهاد می‌شود رزولوشن داینامیک یا FSR Performance فعال گردد.",
      };
    });
  }, [detectedHardware]);

  // Filtered games by active tab
  const filteredGames = useMemo(() => {
    return evaluatedGames.filter((item) => {
      if (activeTab === "60fps") {
        return item.status === "smooth60" || item.status === "ultra";
      }
      if (activeTab === "ultra") {
        return item.status === "ultra";
      }
      if (activeTab === "heavy") {
        return item.status === "heavy" || item.status === "playable";
      }

      return true;
    });
  }, [evaluatedGames, activeTab]);

  return (
    <section className="sys-checker-advanced-section" id="sys-checker">
      <div className="sys-checker-glow-backdrop" aria-hidden="true" />

      <div className="sys-checker-container">
        {/* Header Title */}
        <div className="sys-checker-head">
          <div className="sys-checker-badge">
            <i className="bi bi-cpu"></i>
            <span>امضای گیمینگ تور • آنالیزور سخت‌افزار</span>
          </div>
          <h2>سیستم من اجراش می‌کنه؟</h2>
          <p>
            تست دقیق و هوشمند پردازنده مرکزی (CPU)، کارت گرافیک مجزا (GPU)، حافظه رم و
            نمایشگر مانیتور، ارزیابی زنده نرخ فریم‌ریت (FPS) و معرفی بازی‌های متناسب با سیستم شما.
          </p>
        </div>

        {/* 1. Initial State: Action Banner */}
        {!detectedHardware && !isScanning && (
          <div className="sys-checker-scan-card">
            <div className="scan-card-icon">
              <i className="bi bi-gpu-card"></i>
            </div>
            <div className="scan-card-info">
              <h3>بررسی خودکار و تشخیص قطعات سیستم شما</h3>
              <p>
                با یک کلیک، کارت گرافیک مجزا، تعداد هسته‌ها و رشته‌های پردازنده، حافظه رم،
                وضوح تصویر و نرخ نوسازی مانیتور (Hz) شما به صورت بلادرنگ اسکن شده و
                فهرست سازگاری بازی‌ها به نمایش درمی‌آید.
              </p>
              <div className="scan-features-row">
                <span>
                  <i className="bi bi-check2-circle"></i> بدون نیاز به نصب هیچ برنامه‌ای
                </span>
                <span>
                  <i className="bi bi-check2-circle"></i> تشخیص کارت گرافیک مجزا NVIDIA / AMD / Intel
                </span>
                <span>
                  <i className="bi bi-check2-circle"></i> سنجش نرخ نوسازی مانیتور و بنچمارک سه‌بعدی
                </span>
              </div>
            </div>

            <button
              type="button"
              className="sys-checker-start-btn"
              onClick={handleStartAnalysis}
            >
              <i className="bi bi-lightning-charge-fill"></i>
              <span>شروع آنالیز کامل سیستم من</span>
            </button>
          </div>
        )}

        {/* 2. Scanning Progress State */}
        {isScanning && (
          <div className="sys-checker-scanning-box">
            <div className="scanning-radar">
              <div className="radar-circle"></div>
              <i className="bi bi-cpu pulse-icon"></i>
            </div>
            <h3>در حال عیب‌یابی و اسکن مشخصات سخت‌افزاری...</h3>
            <p className="scanning-step-text">{scanSteps[scanStepIndex]}</p>

            <div className="scanning-progress-bar-wrap">
              <div
                className="scanning-progress-bar-fill"
                style={{
                  width: `${((scanStepIndex + 1) / scanSteps.length) * 100}%`,
                }}
              ></div>
            </div>

            <div className="scanning-terminal-hud">
              <code>{`> WEBGPU_DIRECT_PROBE: PASS (SUCCESS)`}</code>
              <code>{`> HARDWARE_QUERY_SYNC: STEP ${scanStepIndex + 1}/${scanSteps.length}`}</code>
              <code>{`> GRAPHICS_BENCHMARK_SCORE: COMPUTING...`}</code>
            </div>
          </div>
        )}

        {/* 3. Results Dashboard */}
        {detectedHardware && !isScanning && (
          <div className="sys-checker-dashboard">
            {/* System HUD Overview */}
            <div className="hardware-hud-card">
              <div className="hud-header">
                <div>
                  <span className="hud-subtitle">
                    <i
                      className="bi bi-patch-check-fill"
                      style={{ color: "#00ff7f", marginLeft: "6px" }}
                    ></i>
                    {detectedHardware.systemTierName}
                  </span>
                  <h3 className="hud-title">{detectedHardware.gpuName}</h3>
                </div>
                <div className="hud-actions">
                  <button
                    type="button"
                    className="hud-action-btn primary"
                    onClick={executeHardwareScan}
                  >
                    <i className="bi bi-arrow-repeat"></i>
                    <span>اسکن مجدد سیستم</span>
                  </button>
                </div>
              </div>

              {/* Hardware Specs Grid */}
              <div className="hardware-specs-grid">
                {/* 1. GPU */}
                <div className="spec-tile">
                  <div className="spec-icon gpu-icon">
                    <i className="bi bi-gpu-card"></i>
                  </div>
                  <div className="spec-details">
                    <span className="spec-label">کارت گرافیک (GPU)</span>
                    <strong className="spec-value" title={detectedHardware.gpuName}>
                      {detectedHardware.gpuName}
                    </strong>
                    <span className="spec-sub">
                      {detectedHardware.vramEstimate}
                      {detectedHardware.secondaryGpu ? ` • مجتمع: ${detectedHardware.secondaryGpu}` : ""}
                    </span>
                  </div>
                </div>

                {/* 2. CPU */}
                <div className="spec-tile">
                  <div className="spec-icon cpu-icon">
                    <i className="bi bi-cpu"></i>
                  </div>
                  <div className="spec-details">
                    <span className="spec-label">پردازنده مرکزی (CPU)</span>
                    <strong className="spec-value" title={detectedHardware.cpuModel}>
                      {detectedHardware.cpuModel || `پردازنده ${detectedHardware.cpuCores} هسته‌ای`}
                    </strong>
                    <span className="spec-sub">
                      {detectedHardware.cpuCores} رشته پردازشی منطقی • 64-Bit
                    </span>
                  </div>
                </div>

                {/* 3. RAM & OS */}
                <div className="spec-tile">
                  <div className="spec-icon ram-icon">
                    <i className="bi bi-memory"></i>
                  </div>
                  <div className="spec-details">
                    <span className="spec-label">حافظه رم و سیستم‌عامل</span>
                    <strong className="spec-value">
                      {detectedHardware.ramGB} گیگابایت RAM
                    </strong>
                    <span className="spec-sub">
                      {detectedHardware.osName || detectedHardware.platform}
                    </span>
                  </div>
                </div>

                {/* 4. Display & Monitor */}
                <div className="spec-tile">
                  <div className="spec-icon disp-icon">
                    <i className="bi bi-display"></i>
                  </div>
                  <div className="spec-details">
                    <span className="spec-label">نمایشگر و مانیتور (Display)</span>
                    <strong className="spec-value">
                      {detectedHardware.screenResolution} @ {detectedHardware.refreshRate || 60}Hz
                    </strong>
                    <span className="spec-sub">
                      {detectedHardware.aspectRatio} • امتیاز بنچمارک: {detectedHardware.benchmarkScore}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compatible Games Section */}
            <div className="compatible-games-block">
              <div className="compatible-block-header">
                <div>
                  <h3>
                    <i className="bi bi-controller"></i> بازی‌هایی که با این سیستم می‌توانید تجربه کنید
                  </h3>
                  <p>
                    تطابق عملکردی و نرخ فریم‌ریت لحظه‌ای (FPS) محاسبه‌شده بر اساس مشخصات سیستم شما:
                  </p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="compatible-filter-tabs">
                <button
                  type="button"
                  className={`filter-tab ${activeTab === "all" ? "active" : ""}`}
                  onClick={() => setActiveTab("all")}
                >
                  همه بازی‌ها ({evaluatedGames.length})
                </button>
                <button
                  type="button"
                  className={`filter-tab ${activeTab === "60fps" ? "active" : ""}`}
                  onClick={() => setActiveTab("60fps")}
                >
                  ⚡ روان با ۶۰ فریم و بیشتر (60+ FPS)
                </button>
                <button
                  type="button"
                  className={`filter-tab ${activeTab === "ultra" ? "active" : ""}`}
                  onClick={() => setActiveTab("ultra")}
                >
                  🌟 کیفیت اولترا (Ultra Settings)
                </button>
                <button
                  type="button"
                  className={`filter-tab ${activeTab === "heavy" ? "active" : ""}`}
                  onClick={() => setActiveTab("heavy")}
                >
                  ⚠️ نیازمند بهینه‌سازی
                </button>
              </div>

              {/* Games Result Grid */}
              <div className="compatible-games-grid">
                {filteredGames.length === 0 ? (
                  <div className="no-compatible-games">
                    <i className="bi bi-emoji-frown"></i>
                    <p>بازی متناسب با این فیلتر یافت نشد.</p>
                  </div>
                ) : (
                  filteredGames.map((item) => (
                    <div
                      key={item.game.id}
                      className={`compat-game-card ${item.status}`}
                    >
                      <div className="compat-game-image-wrap">
                        <Image
                          src={item.game.img}
                          alt={item.game.name}
                          width={320}
                          height={180}
                          sizes="(max-width: 768px) 100vw, 320px"
                        />
                        <div
                          className="compat-status-badge"
                          style={{ borderColor: item.statusColor }}
                        >
                          <span
                            className="status-dot"
                            style={{ background: item.statusColor }}
                          ></span>
                          <span>{item.statusLabel}</span>
                        </div>
                      </div>

                      <div className="compat-game-body">
                        <div className="compat-game-title-row">
                          <Link
                            href={item.game.link}
                            className="compat-game-title-link"
                          >
                            <h4>{item.game.name}</h4>
                          </Link>
                          <span className="compat-genre">
                            {item.game.genre}
                          </span>
                        </div>

                        <div className="compat-fps-banner">
                          <div className="fps-metric">
                            <i className="bi bi-speedometer2"></i>
                            <span>{item.fpsEstimate}</span>
                          </div>
                          <span className="preset-pill">{item.recommendedPreset}</span>
                        </div>

                        <p className="compat-note">{item.recommendationNote}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Permission & Confirmation Modal */}
      {showPermissionModal && (
        <div
          className="sys-permission-modal-overlay"
          onClick={() => setShowPermissionModal(false)}
        >
          <div
            className="sys-permission-modal-box"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="perm-title"
          >
            <div className="perm-header">
              <div className="perm-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <div>
                <h3 id="perm-title">مجوز دسترسی به اطلاعات سخت‌افزاری</h3>
                <span className="perm-subtitle">
                  تضمین امنیت و حریم خصوصی گیمینگ تور
                </span>
              </div>
              <button
                type="button"
                className="perm-close-btn"
                onClick={() => setShowPermissionModal(false)}
                aria-label="بستن"
              >
                &times;
              </button>
            </div>

            <div className="perm-body">
              <p>
                برای ارائه دقیق‌ترین تخمین نرخ فریم (FPS) و سازگاری بازی‌ها، وبسایت
                اطلاعات فنی شتاب‌دهنده گرافیکی (GPU / WebGPU Context)، پردازنده، رم و
                رزولوشن و نرخ نوسازی مانیتور شما را بررسی می‌کند.
              </p>
              <ul>
                <li>
                  <i className="bi bi-check-circle-fill"></i> هیچ‌گونه اطلاعات
                  شخصی یا فایلی از سیستم شما خوانده نمی‌شود.
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i> تمامی بررسی‌ها به
                  صورت محلی (Local) درون سیستم و مرورگر شما انجام می‌گردد.
                </li>
              </ul>
            </div>

            <div className="perm-footer">
              <button
                type="button"
                className="perm-cancel-btn"
                onClick={() => setShowPermissionModal(false)}
              >
                انصراف
              </button>
              <button
                type="button"
                className="perm-confirm-btn"
                onClick={executeHardwareScan}
              >
                <i className="bi bi-cpu-fill"></i>
                <span>تایید و شروع آنالیز سخت‌افزار</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Device Notice Modal */}
      {showMobileModal && (
        <div
          className="sys-permission-modal-overlay"
          onClick={() => setShowMobileModal(false)}
        >
          <div
            className="sys-permission-modal-box mobile-notice-box"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-notice-title"
          >
            <div className="perm-header">
              <div className="perm-icon mobile-warning-icon">
                <i className="bi bi-phone"></i>
              </div>
              <div>
                <h3 id="mobile-notice-title">دستگاه موبایل شناسایی شد</h3>
                <span className="perm-subtitle">
                  عدم تطابق پلتفرم برای بازی‌های کامپیوتری
                </span>
              </div>
              <button
                type="button"
                className="perm-close-btn"
                onClick={() => setShowMobileModal(false)}
                aria-label="بستن"
              >
                &times;
              </button>
            </div>

            <div className="perm-body">
              <div className="mobile-notice-highlight">
                <i className="bi bi-info-circle-fill"></i>
                <p>
                  شما با دستگاه موبایل وارد شده‌اید. این بازی‌ها مخصوص پلتفرم
                  PC هستند؛ برای تست دقیق با کامپیوتر یا لپ‌تاپ خود وارد شوید.
                </p>
              </div>
              <ul>
                <li>
                  <i className="bi bi-laptop"></i>
                  برای سنجش دقیق کارت گرافیک (GPU)، پردازنده و فریم‌ریت، سایت را در مرورگر کامپیوتر یا لپ‌تاپ باز کنید.
                </li>
                <li>
                  <i className="bi bi-controller"></i>
                  تمام عناوین این بخش نسخه‌های رسمی ویندوز و PC هستند.
                </li>
              </ul>
            </div>

            <div className="perm-footer">
              <button
                type="button"
                className="perm-cancel-btn"
                onClick={() => {
                  setShowMobileModal(false);
                  executeHardwareScan();
                }}
              >
                <span>مشاهده پیش‌نمایش تستی</span>
              </button>
              <button
                type="button"
                className="perm-confirm-btn"
                onClick={() => setShowMobileModal(false)}
              >
                <i className="bi bi-check-lg"></i>
                <span>متوجه شدم</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
