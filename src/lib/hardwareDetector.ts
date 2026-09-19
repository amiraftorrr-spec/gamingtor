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
} from "./hardwareDatabase";

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
  };
  ram: {
    gb: number;
    totalGb: number;
    label: string;
    isEstimated: boolean;
  };
  display: DisplayInfo;
  benchmark: BenchmarkMetrics;
  os: {
    name: string;
    platform: string;
    arch: string;
    formFactor?: "laptop" | "desktop";
    isLaptop?: boolean;
  };
  tier: "S+" | "S" | "A" | "B" | "C" | "D";
  overallTier: "S+" | "S" | "A" | "B" | "C" | "D";
  tierTitle: string;
  overallScore: number;
  detectionConfidence: "high" | "medium" | "estimated";
}

// Clean GPU unmasked renderer string from browser WebGL / WebGPU
export function cleanGpuName(raw: string): string {
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
export function isDedicatedGpu(name: string): boolean {
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
  if (typeof navigator === "undefined" || !("gpu" in navigator)) {
    return { supported: false };
  }

  try {
    const gpuNav = (navigator as unknown as { gpu?: {
      requestAdapter: (opt?: { powerPreference?: string }) => Promise<unknown>;
    } }).gpu;
    if (!gpuNav) return { supported: false };

    const highAdapter = (await gpuNav.requestAdapter({
      powerPreference: "high-performance",
    })) as {
      info?: { architecture?: string; vendor?: string; description?: string; device?: string };
      requestAdapterInfo?: () => Promise<{ architecture?: string; vendor?: string; description?: string; device?: string }>;
      limits?: { maxBufferSize?: number; maxStorageBufferBindingSize?: number };
    } | null;

    let highInfo = highAdapter?.info;
    if (!highInfo && highAdapter?.requestAdapterInfo) {
      highInfo = await highAdapter.requestAdapterInfo();
    }

    let lowInfo: { architecture?: string; vendor?: string; description?: string; device?: string } | undefined;
    try {
      const lowAdapter = (await gpuNav.requestAdapter({
        powerPreference: "low-power",
      })) as {
        info?: { architecture?: string; vendor?: string; description?: string; device?: string };
        requestAdapterInfo?: () => Promise<{ architecture?: string; vendor?: string; description?: string; device?: string }>;
      } | null;
      lowInfo = lowAdapter?.info;
      if (!lowInfo && lowAdapter?.requestAdapterInfo) {
        lowInfo = await lowAdapter.requestAdapterInfo();
      }
    } catch {}

    const maxBufBytes = highAdapter?.limits?.maxBufferSize || 0;
    const maxBufferSizeMb = Math.round(maxBufBytes / (1024 * 1024));

    return {
      supported: !!highAdapter,
      architecture: highInfo?.architecture,
      vendor: highInfo?.vendor,
      description: highInfo?.description || highInfo?.device,
      maxBufferSizeMb,
      highPerfGpu: highInfo?.description || highInfo?.device || highInfo?.architecture,
      lowPowerGpu: lowInfo?.description || lowInfo?.device || lowInfo?.architecture,
    };
  } catch {
    return { supported: false };
  }
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
  const result = {
    highPerfRenderer: "",
    highPerfVendor: "",
    lowPowerRenderer: "",
    maxTextureSize: 8192,
    hasBptcCompression: false,
    hasS3tcCompression: false,
    hasFloatColor: false,
  };

  if (typeof document === "undefined") return result;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl2", { powerPreference: "high-performance" }) as WebGL2RenderingContext) ||
      (canvas.getContext("webgl", { powerPreference: "high-performance" }) as WebGLRenderingContext);

    if (gl) {
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      if (dbg) {
        result.highPerfRenderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "";
        result.highPerfVendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || "";
      } else {
        result.highPerfRenderer = gl.getParameter(gl.RENDERER) || "";
        result.highPerfVendor = gl.getParameter(gl.VENDOR) || "";
      }

      result.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 8192;
      result.hasBptcCompression = !!gl.getExtension("EXT_texture_compression_bptc");
      result.hasS3tcCompression = !!gl.getExtension("WEBGL_compressed_texture_s3tc");
      result.hasFloatColor = !!gl.getExtension("EXT_color_buffer_float");
    }

    // Try low power context
    try {
      const lowCanvas = document.createElement("canvas");
      const lowGl =
        (lowCanvas.getContext("webgl2", { powerPreference: "low-power" }) as WebGL2RenderingContext) ||
        (lowCanvas.getContext("webgl", { powerPreference: "low-power" }) as WebGLRenderingContext);
      if (lowGl) {
        const dbg = lowGl.getExtension("WEBGL_debug_renderer_info");
        if (dbg) {
          result.lowPowerRenderer = lowGl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "";
        }
      }
    } catch {}
  } catch {}

  return result;
}

// 3. Media Capabilities Probing (Hardware Codec Silicon Support)
export async function probeMediaCapabilities(): Promise<{
  hasAv1Decode: boolean;
  hasHevc10Decode: boolean;
  hasVp9Profile2Decode: boolean;
}> {
  const result = {
    hasAv1Decode: false,
    hasHevc10Decode: false,
    hasVp9Profile2Decode: false,
  };

  if (typeof navigator === "undefined" || !navigator.mediaCapabilities) {
    return result;
  }

  try {
    const checks = [
      // AV1 4K 60FPS
      navigator.mediaCapabilities
        .decodingInfo({
          type: "file",
          video: {
            contentType: 'video/mp4; codecs="av01.0.08M.10"',
            width: 3840,
            height: 2160,
            bitrate: 20000000,
            framerate: 60,
          },
        })
        .then((res) => {
          result.hasAv1Decode = res.supported && res.powerEfficient;
        })
        .catch(() => {}),

      // HEVC Main 10 HDR
      navigator.mediaCapabilities
        .decodingInfo({
          type: "file",
          video: {
            contentType: 'video/mp4; codecs="hvc1.1.6.L93.B0"',
            width: 3840,
            height: 2160,
            bitrate: 25000000,
            framerate: 60,
          },
        })
        .then((res) => {
          result.hasHevc10Decode = res.supported && res.powerEfficient;
        })
        .catch(() => {}),

      // VP9 Profile 2 (10-bit HDR)
      navigator.mediaCapabilities
        .decodingInfo({
          type: "file",
          video: {
            contentType: 'video/webm; codecs="vp09.02.10.10.01.09.16.09.01"',
            width: 3840,
            height: 2160,
            bitrate: 20000000,
            framerate: 60,
          },
        })
        .then((res) => {
          result.hasVp9Profile2Decode = res.supported && res.powerEfficient;
        })
        .catch(() => {}),
    ];

    await Promise.all(checks);
  } catch {}

  return result;
}

// Helper: calculate aspect ratio
export function calculateAspectRatio(physW: number, physH: number): string {
  if (!physW || !physH) return "16:9 (عریض استاندارد)";
  const ratio = physW / physH;
  if (Math.abs(ratio - 16 / 9) < 0.05) return "16:9 (عریض استاندارد)";
  if (Math.abs(ratio - 16 / 10) < 0.05) return "16:10 (نمایشگر حرفه‌ای)";
  if (Math.abs(ratio - 21 / 9) < 0.08) return "21:9 (اولترا واید گیمینگ)";
  if (Math.abs(ratio - 32 / 9) < 0.1) return "32:9 (سوپر اولترا واید)";
  if (Math.abs(ratio - 4 / 3) < 0.05) return "4:3 (کلاسیک)";

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(physW, physH);
  const aspectW = Math.round(physW / divisor);
  const aspectH = Math.round(physH / divisor);
  return `${aspectW}:${aspectH}`;
}

// 4. Real Display Refresh Rate & Screen Metrics
export function measureDisplayMetrics(sampleFrames = 10): Promise<DisplayInfo> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof window.screen === "undefined") {
      resolve({
        resolution: "1920 × 1080",
        width: 1920,
        height: 1080,
        physicalWidth: 1920,
        physicalHeight: 1080,
        dpr: 1,
        refreshRate: 60,
        isHdr: false,
        aspectRatio: "16:9",
        colorDepth: 24,
      });
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const logW = window.screen.width || 1920;
    const logH = window.screen.height || 1080;
    const physW = Math.round(logW * dpr);
    const physH = Math.round(logH * dpr);

    const aspectStr = calculateAspectRatio(physW, physH);

    const isHdr =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(dynamic-range: high)").matches ||
          window.matchMedia("(color-gamut: p3)").matches
        : false;

    let isResolved = false;
    const fallbackTimer = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        resolve({
          resolution: `${physW} × ${physH}`,
          width: logW,
          height: logH,
          physicalWidth: physW,
          physicalHeight: physH,
          dpr,
          refreshRate: 60,
          isHdr,
          aspectRatio: aspectStr,
          colorDepth: window.screen.colorDepth || 24,
        });
      }
    }, 250);

    // Measure refresh rate
    let frameCount = 0;
    let startTime = 0;
    const intervals: number[] = [];
    let lastTime = 0;

    const onFrame = (now: number) => {
      if (isResolved) return;

      if (startTime === 0) {
        startTime = now;
        lastTime = now;
        requestAnimationFrame(onFrame);
        return;
      }

      intervals.push(now - lastTime);
      lastTime = now;
      frameCount++;

      if (frameCount >= sampleFrames) {
        isResolved = true;
        clearTimeout(fallbackTimer);
        intervals.sort((a, b) => a - b);
        const mid = Math.floor(intervals.length / 2);
        const medianInterval = intervals[mid];
        let estimatedHz = Math.round(1000 / medianInterval);

        if (Math.abs(estimatedHz - 60) <= 4) estimatedHz = 60;
        else if (Math.abs(estimatedHz - 75) <= 4) estimatedHz = 75;
        else if (Math.abs(estimatedHz - 100) <= 4) estimatedHz = 100;
        else if (Math.abs(estimatedHz - 120) <= 4) estimatedHz = 120;
        else if (Math.abs(estimatedHz - 144) <= 6) estimatedHz = 144;
        else if (Math.abs(estimatedHz - 165) <= 6) estimatedHz = 165;
        else if (Math.abs(estimatedHz - 240) <= 10) estimatedHz = 240;
        else if (Math.abs(estimatedHz - 360) <= 15) estimatedHz = 360;

        resolve({
          resolution: `${physW} × ${physH}`,
          width: logW,
          height: logH,
          physicalWidth: physW,
          physicalHeight: physH,
          dpr,
          refreshRate: estimatedHz || 60,
          isHdr,
          aspectRatio: aspectStr,
          colorDepth: window.screen.colorDepth || 24,
        });
      } else {
        requestAnimationFrame(onFrame);
      }
    };

    requestAnimationFrame(onFrame);
  });
}

// 5. WebAssembly CPU & ALU Micro-Benchmark
export async function runWasmCpuBenchmark(): Promise<{
  cpuScore: number;
  gflops: number;
  multiCoreFactor: number;
  wasmSupported: boolean;
  durationMs: number;
}> {
  const wasmSupported = typeof WebAssembly !== "undefined";
  try {
    // Valid minimal WebAssembly module running recursive/arithmetic math loop
    // Compiled from: int test(int n) { int s = 0; for(int i=0; i<n; i++) s += (i * 3) ^ (i >> 2); return s; }
    const wasmBytes = new Uint8Array([
      0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, // \0asm v1
      0x01, 0x06, 0x01, 0x60, 0x01, 0x7f, 0x01, 0x7f, // type: (i32) -> i32
      0x03, 0x02, 0x01, 0x00,                         // func 0: type 0
      0x07, 0x08, 0x01, 0x04, 0x74, 0x65, 0x73, 0x74, 0x00, 0x00, // export "test" func 0
      0x0a, 0x22, 0x01, 0x20, 0x02, 0x01, 0x7f, 0x01, 0x7f, // code body with locals
      0x01, 0x01, 0x41, 0x00, 0x21, 0x01, 0x41, 0x00, 0x21, 0x02, // loop setup
      0x03, 0x40, 0x20, 0x02, 0x20, 0x00, 0x4e, 0x0d, 0x01, // loop condition
      0x20, 0x01, 0x20, 0x02, 0x41, 0x03, 0x6c, 0x20, 0x02, 0x41, 0x02, 0x77, 0x73, 0x6a, 0x21, 0x01,
      0x20, 0x02, 0x41, 0x01, 0x6a, 0x21, 0x02, 0x0c, 0x00, 0x0b, // loop end
      0x20, 0x01, 0x0b                                // return s
    ]);

    let testFn: (n: number) => number;

    if (wasmSupported) {
      const module = await WebAssembly.instantiate(wasmBytes);
      testFn = module.instance.exports.test as (n: number) => number;
    } else {
      // Pure JS fallback
      testFn = (n: number) => {
        let s = 0;
        for (let i = 0; i < n; i++) s += (i * 3) ^ (i >> 2);
        return s;
      };
    }

    const iterations = 5000000;
    const start = performance.now();
    testFn(iterations);
    const durationMs = Math.max(performance.now() - start, 1);

    // Rate calculation
    const opsPerSec = (iterations / (durationMs / 1000));
    const gflops = Number((opsPerSec / 100000000).toFixed(1));

    // Score from 30 (slow) to 100 (ultra fast modern desktop CPU)
    let score = Math.round(Math.min(Math.max((gflops / 6.0) * 80 + 20, 30), 100));

    const concurrency = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 8 : 8;
    const multiCoreFactor = Math.min(concurrency * 0.82, 18);

    return {
      cpuScore: score,
      gflops,
      multiCoreFactor,
      wasmSupported,
      durationMs,
    };
  } catch {
    return {
      cpuScore: 70,
      gflops: 3.5,
      multiCoreFactor: 6.5,
      wasmSupported,
      durationMs: 25,
    };
  }
}

// 6. WebGL 3D Offscreen Micro-Benchmark (GPU Speed)
export function runWebGLGpuBenchmark(): Promise<number> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve(60);
      return;
    }

    const fallbackTimer = setTimeout(() => {
      resolve(60);
    }, 250);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 240;
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

      if (!gl) {
        clearTimeout(fallbackTimer);
        resolve(55);
        return;
      }

      // Simple fragment shader doing procedural noise math
      const vsSource = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;
      const fsSource = `
        precision mediump float;
        uniform float t;
        void main() {
          vec2 uv = gl_FragCoord.xy / vec2(320.0, 240.0);
          float col = sin(uv.x * 20.0 + t) * cos(uv.y * 20.0 + t);
          gl_FragColor = vec4(vec3(col), 1.0);
        }
      `;

      const vs = gl.createShader(gl.VERTEX_SHADER)!;
      gl.shaderSource(vs, vsSource);
      gl.compileShader(vs);

      const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(fs, fsSource);
      gl.compileShader(fs);

      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );

      const posAttr = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(posAttr);
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

      const tUniform = gl.getUniformLocation(prog, "t");

      const pixelBuf = new Uint8Array(4);
      const loops = 15;
      const start = performance.now();
      for (let i = 0; i < loops; i++) {
        gl.uniform1f(tUniform, i * 0.1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelBuf);
      }
      const duration = Math.max(performance.now() - start, 1);
      const avgMs = duration / loops;
      const fps = Math.min(Math.max(Math.round(1000 / avgMs), 30), 240);

      clearTimeout(fallbackTimer);
      resolve(fps);
    } catch {
      clearTimeout(fallbackTimer);
      resolve(60);
    }
  });
}

// 7. Calibrated GPU Mathematical Compute Shader Benchmark (Raymarching SDF)
export function runCalibratedGpuBenchmark(): Promise<{
  gpuScore: number;
  computeFps: number;
  renderTimeMs: number;
}> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve({ gpuScore: 50, computeFps: 60, renderTimeMs: 16 });
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const gl =
        (canvas.getContext("webgl2", { powerPreference: "high-performance" }) as WebGL2RenderingContext) ||
        (canvas.getContext("webgl", { powerPreference: "high-performance" }) as WebGLRenderingContext);

      if (!gl) {
        resolve({ gpuScore: 50, computeFps: 60, renderTimeMs: 16 });
        return;
      }

      const vsSource = `
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      const fsSource = `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_res;

        float map(vec3 p) {
          float d = length(p) - 1.0;
          d += sin(p.x * 8.0 + u_time) * sin(p.y * 8.0 + u_time) * sin(p.z * 8.0) * 0.1;
          for (int i = 0; i < 4; i++) {
            p = abs(p) / dot(p, p) - vec3(0.5, 0.5, 0.5);
          }
          return min(d, length(p) - 0.2);
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
          vec3 ro = vec3(0.0, 0.0, -3.0);
          vec3 rd = normalize(vec3(uv, 1.0));
          float t = 0.0;
          for (int i = 0; i < 32; i++) {
            vec3 p = ro + rd * t;
            float d = map(p);
            t += d * 0.5;
            if (d < 0.005 || t > 8.0) break;
          }
          vec3 col = vec3(1.0 / (1.0 + t * t * 0.15));
          gl_FragColor = vec4(col, 1.0);
        }
      `;

      const vs = gl.createShader(gl.VERTEX_SHADER)!;
      gl.shaderSource(vs, vsSource);
      gl.compileShader(vs);

      const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(fs, fsSource);
      gl.compileShader(fs);

      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );

      const posAttr = gl.getAttribLocation(prog, "position");
      gl.enableVertexAttribArray(posAttr);
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

      const timeLoc = gl.getUniformLocation(prog, "u_time");
      const resLoc = gl.getUniformLocation(prog, "u_res");
      gl.uniform2f(resLoc, 256, 256);

      const pixelBuf = new Uint8Array(4);

      // Warmup pass
      gl.uniform1f(timeLoc, 0.1);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelBuf);

      const numFrames = 10;
      const start = performance.now();

      for (let i = 0; i < numFrames; i++) {
        gl.uniform1f(timeLoc, (i + 1) * 0.2);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        // Force GPU execution pipeline synchronization barrier
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelBuf);
      }

      const totalTime = Math.max(performance.now() - start, 1);
      const avgFrameTimeMs = totalTime / numFrames;
      const computeFps = Math.round(1000 / avgFrameTimeMs);

      // Calibrated GPU score (0 - 100)
      let gpuScore = Math.round(100 - avgFrameTimeMs * 4.2);
      gpuScore = Math.min(Math.max(gpuScore, 20), 100);

      resolve({
        gpuScore,
        computeFps,
        renderTimeMs: Math.round(avgFrameTimeMs * 10) / 10,
      });
    } catch {
      resolve({ gpuScore: 50, computeFps: 60, renderTimeMs: 16 });
    }
  });
}

// 0. Poimandres Detect-GPU Industry-Standard Classifier with strict timeout fallback
export async function probeDetectGPU(): Promise<{
  gpu?: string;
  isMobile?: boolean;
  tier?: number;
  fps?: number;
  type?: string;
}> {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const benchmarksURL =
      typeof window !== "undefined" && window.location?.origin
        ? `${window.location.origin}/benchmarks`
        : "/benchmarks";

    const detectPromise = getGPUTier({
      benchmarksURL,
      failIfMajorPerformanceCaveat: false,
    });
    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 1200)
    );
    const tierResult = await Promise.race([detectPromise, timeoutPromise]);
    if (!tierResult) {
      return {};
    }
    return {
      gpu: tierResult.gpu,
      isMobile: tierResult.isMobile,
      tier: tierResult.tier,
      fps: tierResult.fps,
      type: tierResult.type,
    };
  } catch {
    return {};
  }
}

// 8. Device Form Factor Intelligence (Laptop vs Desktop Classifier)
export async function detectDeviceFormFactor(
  dualGpuDetected = false,
  rendererHint = ""
): Promise<DeviceFormFactor> {
  let hasBattery = false;
  let isCharging: boolean | undefined = undefined;
  let batteryFound = false;

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
          // In Chromium on Linux/Windows desktops, getBattery() sometimes returns level=1, charging=true, chargingTime=0, dischargingTime=Infinity
          // On actual laptops: battery.level < 1.0 or dischargingTime < Infinity or chargingTime > 0 or charging === false
          const isRealBattery =
            battery.level < 1.0 ||
            battery.charging === false ||
            (typeof battery.dischargingTime === "number" && battery.dischargingTime !== Infinity && !isNaN(battery.dischargingTime)) ||
            (typeof battery.chargingTime === "number" && battery.chargingTime > 0 && battery.chargingTime !== Infinity);

          if (isRealBattery) {
            batteryFound = true;
            hasBattery = true;
            isCharging = battery.charging;
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

  // Mobile silicon architecture keywords present in Mesa/DirectX/WebGL
  const isMobileSilicon =
    rLower.includes("laptop gpu") ||
    rLower.includes("mobile") ||
    rLower.includes("max-q") ||
    rLower.includes("tgl") ||
    rLower.includes("tiger lake") ||
    rLower.includes("tigerlake") ||
    rLower.includes("iris xe") ||
    rLower.includes("iris(r) xe") ||
    rLower.includes("iris plus") ||
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

  // Explicit desktop silicon keywords
  const isDesktopSilicon =
    rLower.includes("pcie") ||
    rLower.includes("desktop") ||
    rLower.includes("super") ||
    (rLower.includes("ti") && !rLower.includes("laptop") && !rLower.includes("mobile"));

  // Typical laptop resolution indicators (1366x768, 1536x864, or touch device)
  const isLaptopAspect =
    (screenW === 1536 && screenH === 864) ||
    (screenW === 1366 && screenH === 768) ||
    (touchPoints > 0 && screenW <= 1600);

  let isLaptop = false;
  let confidence: "high" | "medium" | "low" = "medium";

  if (isMobileSilicon) {
    isLaptop = true;
    confidence = "high";
  } else if (isDesktopSilicon && !batteryFound) {
    isLaptop = false;
    confidence = "high";
  } else if (batteryFound) {
    isLaptop = true;
    confidence = "high";
  } else if (dualGpuDetected && !isDesktopSilicon) {
    isLaptop = true;
    confidence = "medium";
  } else if (isLaptopAspect && !isDesktopSilicon) {
    isLaptop = true;
    confidence = "low";
  } else {
    // Default to Desktop when no battery or mobile silicon signature is present
    isLaptop = false;
    confidence = "medium";
  }

  return {
    isLaptop,
    confidence,
    hasBattery,
    isCharging,
    isOptimusDualGpu: dualGpuDetected,
    dpr,
  };
}

// 9. Master Hardware Synthesizer (100% Client-Side Detection Engine)
export async function synthesizeClientHardware(customOverrides?: {
  gpuId?: string;
  cpuId?: string;
  ramGb?: number;
}): Promise<SynthesizedHardware> {
  // 1. Probing detect-gpu, WebGPU & WebGL for dual-GPU Optimus switchable graphics
  const [detectGpu, webGpu, webGl] = await Promise.all([
    probeDetectGPU(),
    probeWebGPU(),
    probeWebGL(),
  ]);

  const dualGpuDetected = Boolean(
    (webGl.lowPowerRenderer &&
      webGl.highPerfRenderer &&
      webGl.lowPowerRenderer.toLowerCase() !== webGl.highPerfRenderer.toLowerCase()) ||
    (detectGpu.gpu && webGl.highPerfRenderer && !detectGpu.gpu.toLowerCase().includes(webGl.highPerfRenderer.toLowerCase()))
  );

  const rawRendererCandidates = `${webGl.highPerfRenderer || ""} ${webGl.lowPowerRenderer || ""} ${detectGpu.gpu || ""} ${webGpu.description || ""} ${webGpu.highPerfGpu || ""}`;

  // 2. Parallel probing of display, codecs, benchmarks, and form factor
  const [codecs, display, wasmBench, gpuFps, calibratedGpu, formFactor] = await Promise.all([
    probeMediaCapabilities(),
    measureDisplayMetrics(),
    runWasmCpuBenchmark(),
    runWebGLGpuBenchmark(),
    runCalibratedGpuBenchmark(),
    detectDeviceFormFactor(dualGpuDetected, rawRendererCandidates),
  ]);

  const isLaptop = formFactor.isLaptop || Boolean(detectGpu.isMobile);
  const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 8 : 8;
  const rawRam = typeof navigator !== "undefined" ? (navigator as { deviceMemory?: number }).deviceMemory || 8 : 8;

  // Identify GPU
  let detectedGpuSpec: GpuSpec | null = null;
  let secondaryGpuName: string | undefined = undefined;

  // If user provided custom override
  if (customOverrides?.gpuId) {
    detectedGpuSpec = GPU_DATABASE.find((g) => g.id === customOverrides.gpuId) || null;
  }

  if (!detectedGpuSpec) {
    const candidateStrings = [
      webGpu.highPerfGpu || "",
      webGl.highPerfRenderer || "",
      detectGpu.gpu || "",
      webGpu.description || "",
      webGl.lowPowerRenderer || "",
      webGl.highPerfVendor || "",
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
      if (integratedGpu && integratedGpu.id !== discreteGpu.id) {
        secondaryGpuName = `${integratedGpu.name} (گرافیک مجتمع نمایشگر)`;
      }
    } else if (integratedGpu) {
      // Check if discrete silicon codename / PCI ID is present in raw renderer strings (e.g. GA107, 25ad)
      const rLowerAll = rawRendererCandidates.toLowerCase();
      const hasDiscreteChipCodename =
        /\b(ga107|ga106|ad107|ad106|tu117|tu116|navi|alchemist)\b/i.test(rLowerAll) ||
        /\b(25ad|25a2|2560|2520)\b/i.test(rLowerAll);

      if (hasDiscreteChipCodename) {
        const dgpuMatch = findGpuByQuery(rLowerAll, { isLaptop, benchScore: calibratedGpu.gpuScore });
        if (dgpuMatch && dgpuMatch.isDiscrete) {
          detectedGpuSpec = dgpuMatch;
          secondaryGpuName = `${integratedGpu.name} (گرافیک مجتمع نمایشگر)`;
        } else {
          detectedGpuSpec = integratedGpu;
        }
      } else {
        // Truly an integrated GPU (Intel Iris Xe, AMD Radeon 780M, Intel UHD 770, etc.)
        detectedGpuSpec = integratedGpu;
      }
    }
  }

  // Check architecture hint and resolve best GPU if not directly matched
  if (!detectedGpuSpec) {
    const primaryStr = detectGpu.gpu || webGl.highPerfRenderer || webGpu.description || webGpu.highPerfGpu || "";
    detectedGpuSpec = resolveBestGpu({
      rawRenderer: primaryStr || rawRendererCandidates,
      query: primaryStr,
      isLaptop,
      benchScore: calibratedGpu.gpuScore,
      arch: webGpu.architecture,
    });
  }

  // Secondary GPU check (e.g. Intel Iris Xe / UHD alongside NVIDIA RTX Mobile)
  if (!secondaryGpuName && webGl.lowPowerRenderer && webGl.lowPowerRenderer !== webGl.highPerfRenderer) {
    const lowMatch = findGpuByQuery(webGl.lowPowerRenderer, { isLaptop: true });
    if (lowMatch && lowMatch.id !== detectedGpuSpec?.id) {
      secondaryGpuName = lowMatch.name;
    } else if (webGl.lowPowerRenderer.includes("Intel")) {
      secondaryGpuName = "Intel UHD / Iris Xe Graphics (مجتمع)";
    }
  }

  // Identify CPU
  let detectedCpuSpec: CpuSpec | null = null;
  if (customOverrides?.cpuId) {
    detectedCpuSpec = CPU_DATABASE.find((c) => c.id === customOverrides.cpuId) || null;
  }

  if (!detectedCpuSpec) {
    const rawRenderer = webGl.highPerfRenderer || detectGpu.gpu || rawRendererCandidates;
    detectedCpuSpec = resolveBestCpu({
      concurrency: cores,
      cpuScore: wasmBench.cpuScore,
      rawRenderer,
      isLaptop,
    });
  }

  // Dynamic fallback spec guarantee
  const fallbackGpu = resolveBestGpu({
    rawRenderer: rawRendererCandidates,
    isLaptop: formFactor.isLaptop,
    benchScore: calibratedGpu.gpuScore,
  });
  const finalGpuSpec = detectedGpuSpec || fallbackGpu;

  const fallbackCpu = resolveBestCpu({
    concurrency: cores,
    cpuScore: wasmBench.cpuScore,
    rawRenderer: rawRendererCandidates,
    isLaptop: formFactor.isLaptop,
  });
  const finalCpuSpec = detectedCpuSpec || fallbackCpu;

  // Estimate RAM intelligently
  let ramGb = customOverrides?.ramGb;
  let isEstimatedRam = false;

  if (!ramGb) {
    if (finalGpuSpec.score >= 85 || finalCpuSpec.threads >= 16) {
      ramGb = 32;
    } else if (finalGpuSpec.score >= 50 || finalCpuSpec.threads >= 12 || rawRam >= 8) {
      ramGb = 16;
    } else {
      ramGb = 8;
    }
    isEstimatedRam = true;
  }

  // OS Info
  let osName = "Windows 11 / 10 64-Bit";
  if (typeof navigator !== "undefined") {
    const ua = navigator.userAgent;
    if (ua.includes("Linux")) osName = "Linux (x86_64)";
    else if (ua.includes("Macintosh") || ua.includes("Mac OS")) osName = "macOS";
    else if (ua.includes("Android")) osName = "Android OS";
  }

  // Calculate overall performance tier and gaming score
  const gpuScore = finalGpuSpec.score || calibratedGpu.gpuScore || 50;
  const cpuScore = finalCpuSpec.score || wasmBench.cpuScore || 60;
  const ramScore = Math.min(ramGb * 5, 100);
  const benchOverall = Math.round(gpuScore * 0.6 + cpuScore * 0.3 + (wasmBench.cpuScore / 100) * 10);

  let overallTier: "S+" | "S" | "A" | "B" | "C" | "D" = "B";
  let tierTitle = "سیستم گیمینگ مناسب و استاندارد (1080p 60 FPS)";

  if (benchOverall >= 92) {
    overallTier = "S+";
    tierTitle = "سیستم پرچمدار گیمینگ و استریم (4K Ultra + Ray Tracing)";
  } else if (benchOverall >= 82) {
    overallTier = "S";
    tierTitle = "سیستم فوق‌حرفه‌ای (1440p / 4K Gaming)";
  } else if (benchOverall >= 68) {
    overallTier = "A";
    tierTitle = "سیستم گیمینگ قدرتمند (1440p High / 1080p Ultra)";
  } else if (benchOverall >= 48) {
    overallTier = "B";
    tierTitle = "سیستم گیمینگ مناسب و روان (1080p 60 FPS)";
  } else if (benchOverall >= 32) {
    overallTier = "C";
    tierTitle = "سیستم گیمینگ اقتصادی / ورزش‌های الکترونیک (Esports)";
  } else {
    overallTier = "D";
    tierTitle = "سیستم پایه / نیازمند بهینه‌سازی گرافیکی";
  }

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
      isLaptop: finalGpuSpec.isLaptop ?? formFactor.isLaptop,
      secondaryGpu: secondaryGpuName,
    },
    cpu: {
      id: finalCpuSpec.id,
      name: finalCpuSpec.name,
      vendor: finalCpuSpec.vendor,
      cores: finalCpuSpec.cores,
      threads: finalCpuSpec.threads,
      tier: finalCpuSpec.tier,
      generation: finalCpuSpec.generation,
      score: finalCpuSpec.score,
      isLaptop: finalCpuSpec.isLaptop ?? formFactor.isLaptop,
    },
    ram: {
      gb: ramGb,
      totalGb: ramGb,
      label: `${ramGb} گیگابایت RAM`,
      isEstimated: isEstimatedRam,
    },
    display,
    benchmark: {
      cpuScore: wasmBench.cpuScore,
      gpuFps,
      gpuScore: calibratedGpu.gpuScore,
      gflops: wasmBench.gflops,
      multiCoreFactor: wasmBench.multiCoreFactor,
      overallScore: benchOverall,
    },
    os: {
      name: osName,
      platform: typeof navigator !== "undefined" ? navigator.platform || "x86_64" : "x86_64",
      arch: "64-Bit",
      formFactor: formFactor.isLaptop ? "laptop" : "desktop",
      isLaptop: formFactor.isLaptop,
    },
    tier: overallTier,
    overallTier,
    tierTitle,
    overallScore: benchOverall,
    detectionConfidence: webGpu.supported ? "high" : "medium",
  };
}
