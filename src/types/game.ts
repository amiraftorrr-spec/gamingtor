export interface SystemRequirements {
  os?: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
}

export interface Game {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  img: string;
  link: string;
  desc: string;
  genre: string;
  rating: number;
  themeColor: string;
  ambientGlow: string;
  releaseYear?: number;
  minSpecs: SystemRequirements;
  recSpecs: SystemRequirements;
  tierScore: number; // 1 (low) to 5 (extreme demanding) for hardware benchmark
}

export interface CartItem extends Game {
  quantity: number;
}

export interface DetectedHardware {
  gpuName: string;
  gpuVendor: string;
  cpuModel?: string;
  vramEstimate: string;
  cpuCores: number;
  ramGB: number;
  screenResolution: string;
  platform: string;
  tierScore: number; // 1 to 5.5
  benchmarkScore: number;
  systemTierName: string;
}

export interface GameCompatibilityResult {
  game: Game;
  fpsEstimate: string;
  fpsNumber: number;
  status: "ultra" | "smooth60" | "playable" | "heavy";
  statusLabel: string;
  statusColor: string;
  recommendedPreset: string;
  recommendationNote: string;
}
