// Master Hardware Types & Evidence Data Models (100% Client-Side In-Browser Engine)

import { GpuSpec, CpuSpec } from "../hardwareDatabase";

export type EvidenceSource =
  | "webgpu"
  | "webgl"
  | "wasm"
  | "benchmark"
  | "mediaCapabilities"
  | "navigator"
  | "screen"
  | "battery"
  | "memoryTest"
  | "database";

export type ReliabilityLevel = "direct" | "strong" | "estimated" | "weak";

export interface EvidenceItem {
  source: EvidenceSource;
  property: string;
  value: unknown;
  confidence: number; // 0.0 - 1.0
  reliability: ReliabilityLevel;
  description: string;
}

export interface VramInfo {
  value: number; // in GB
  displayString: string;
  unit: string;
  source: "direct" | "model-spec" | "candidate-range" | "estimated";
  confidence: number;
  isEstimated: boolean;
}

export interface GpuBenchmarkScores {
  fp32Score: number; // 0 - 100
  integerScore?: number;
  memoryBandwidthScore?: number;
  computeThroughputScore: number;
  renderFps: number;
  rawGflops?: number;
  isWebGpuCompute: boolean;
}

export interface GpuDetectionResult {
  matchedGpu: GpuSpec;
  candidates: { gpu: GpuSpec; confidence: number; reason: string }[];
  confidence: number; // 0.0 - 1.0
  confidenceTier: "very-high" | "high" | "moderate" | "low" | "uncertain";
  isDiscrete: boolean;
  isLaptop: boolean;
  rawRenderer: string;
  normalizedRenderer: string;
  unmaskedVendor: string;
  webgpuInfo?: {
    vendor?: string;
    architecture?: string;
    device?: string;
    description?: string;
    features?: string[];
    limits?: Record<string, number>;
  };
  vram: VramInfo;
  benchmarks: GpuBenchmarkScores;
  secondaryGpu?: {
    name: string;
    isDiscrete: boolean;
    vram?: string;
  };
  evidence: EvidenceItem[];
}

export interface CpuBenchmarkScores {
  scalarInteger: number;
  scalarFloat: number;
  simdFloat?: number;
  simdInteger?: number;
  memoryCopyMBps?: number;
  wasmSupported: boolean;
  wasmSimdSupported: boolean;
  gflops: number;
  cpuScore: number; // 0 - 100
  durationMs: number;
}

export interface CpuDetectionResult {
  matchedCpu: CpuSpec;
  candidates: { cpu: CpuSpec; confidence: number; reason: string }[];
  confidence: number; // 0.0 - 1.0
  confidenceTier: "very-high" | "high" | "moderate" | "low" | "uncertain";
  threads: number;
  performanceTier: "enthusiast" | "high" | "upper-mid" | "mid" | "entry";
  benchmarks: CpuBenchmarkScores;
  isLaptop: boolean;
  evidence: EvidenceItem[];
}

export type MemoryClass = "<= 4 GB" | "4 - 8 GB" | "8 - 16 GB" | "16 - 32 GB" | "32 GB+";

export interface MemoryDetectionResult {
  reportedGb: number; // from navigator.deviceMemory (max 8)
  estimatedClass: MemoryClass;
  estimatedGb: number;
  confidence: number;
  memorySource: "navigator-capped" | "allocation-experiment" | "hardware-fusion-estimate";
  isEstimated: boolean;
  allocationTestPassed: boolean;
  maxAllocatedMb: number;
  bandwidthMBps?: number;
  evidence: EvidenceItem[];
}

export interface CodecSupportItem {
  codec: string;
  profile: string;
  resolution: string;
  fps: number;
  supported: boolean;
  smooth: boolean;
  powerEfficient: boolean;
}

export interface MediaCapabilitiesResult {
  matrix: CodecSupportItem[];
  av1_4k60: boolean;
  hevc_main10_4k60: boolean;
  vp9_p2_4k60: boolean;
  h264_1080p60: boolean;
  hardwareDecoderLikely: boolean;
  evidence: EvidenceItem[];
}

export interface DisplayDetectionResult {
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
  evidence: EvidenceItem[];
}

export interface FormFactorResult {
  type: "laptop" | "desktop" | "unknown";
  confidence: number;
  hasBattery: boolean;
  isCharging?: boolean;
  isOptimusDualGpu: boolean;
  dpr: number;
  touchPoints: number;
  evidence: EvidenceItem[];
}

export interface DualGpuResult {
  hasMultipleLikelyGPUs: boolean;
  integratedGPU?: GpuSpec;
  discreteGPU?: GpuSpec;
  confidence: number;
  evidence: EvidenceItem[];
}

export interface MasterAnalysisReport {
  timestamp: number;
  version: string;
  gpu: GpuDetectionResult;
  cpu: CpuDetectionResult;
  memory: MemoryDetectionResult;
  display: DisplayDetectionResult;
  media: MediaCapabilitiesResult;
  formFactor: FormFactorResult;
  dualGpu: DualGpuResult;
  overallScore: number;
  overallTier: "S+" | "S" | "A" | "B" | "C" | "D";
  tierTitle: string;
  evidenceGraph: EvidenceItem[];
  rawDebugLogs: string[];
}
