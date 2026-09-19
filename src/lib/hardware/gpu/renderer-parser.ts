// Multi-Stage Hardware Renderer Normalizer & Suffix Extractor

export interface ParsedGpuString {
  raw: string;
  normalized: string;
  vendor: "NVIDIA" | "AMD" | "Intel" | "Apple" | "Qualcomm" | "Unknown";
  series?: string;
  modelNumber?: string;
  suffixes: string[];
  isLaptop: boolean;
  isDiscrete: boolean;
  architectureHint?: string;
  pciDeviceId?: string;
}

export function parseAndNormalizeRenderer(rawRenderer: string): ParsedGpuString {
  const raw = rawRenderer || "";
  let text = raw;

  // Extract PCI ID if present, e.g. [10de:25ad] or [1002:73df]
  let pciDeviceId: string | undefined = undefined;
  const pciMatch = text.match(/\[([0-9a-fA-F]{4}):([0-9a-fA-F]{4})\]/);
  if (pciMatch) {
    pciDeviceId = `${pciMatch[1]}:${pciMatch[2]}`.toLowerCase();
  }

  // 1. Strip ANGLE prefix & backends
  text = text.replace(/^ANGLE\s*\(([^,]+),\s*/i, "");
  text = text.replace(/\s+Direct3D.*$/i, "");
  text = text.replace(/\s+vs_\d+_\d+.*$/i, "");
  text = text.replace(/\s+OpenGL.*$/i, "");
  text = text.replace(/\s+Vulkan.*$/i, "");
  text = text.replace(/\/PCIe\/SSE2/i, "");
  text = text.replace(/\[[0-9a-fA-F]{4}:[0-9a-fA-F]{4}\]/g, "");
  text = text.replace(/\s*\(0x[0-9a-fA-F]+\)/g, "");
  text = text.replace(/\s*\(rev\s+[0-9a-fA-F]+\)/gi, "");
  text = text.replace(/\s*\(R\)|\s*\(TM\)/gi, "");
  text = text.replace(/^controller:\s*/i, "");
  text = text.replace(/^VGA compatible controller:\s*/i, "");
  text = text.replace(/^3D controller:\s*/i, "");

  // 2. Check bracketed clean name e.g. GA107 [GeForce RTX 2050]
  const bracket = text.match(/\[(.*?)\]/);
  if (bracket && bracket[1] && /GeForce|Radeon|RTX|GTX|Arc|Iris|UHD/i.test(bracket[1])) {
    text = bracket[1].trim();
  } else {
    text = text.replace(/\s*\(.*\)$/, "").trim();
  }

  const upper = text.toUpperCase();
  const rawUpper = raw.toUpperCase();

  // Detect Vendor
  let vendor: "NVIDIA" | "AMD" | "Intel" | "Apple" | "Qualcomm" | "Unknown" = "Unknown";
  if (upper.includes("NVIDIA") || upper.includes("GEFORCE") || upper.includes("RTX") || upper.includes("GTX") || upper.includes("QUADRO") || rawUpper.includes("GA10") || rawUpper.includes("AD10")) {
    vendor = "NVIDIA";
  } else if (upper.includes("AMD") || upper.includes("RADEON") || upper.includes("RX") || upper.includes("RADV") || upper.includes("NAVI")) {
    vendor = "AMD";
  } else if (upper.includes("INTEL") || upper.includes("IRIS") || upper.includes("ARC") || upper.includes("UHD") || upper.includes("HD GRAPHICS") || upper.includes("TGL") || upper.includes("ADL")) {
    vendor = "Intel";
  } else if (upper.includes("APPLE") || upper.includes("M1") || upper.includes("M2") || upper.includes("M3") || upper.includes("M4")) {
    vendor = "Apple";
  } else if (upper.includes("QUALCOMM") || upper.includes("ADRENO") || upper.includes("SNAPDRAGON")) {
    vendor = "Qualcomm";
  }

  // Detect Laptop signatures
  const isLaptop =
    rawUpper.includes("LAPTOP") ||
    rawUpper.includes("MOBILE") ||
    rawUpper.includes("MAX-Q") ||
    rawUpper.includes("GA107M") ||
    rawUpper.includes("GA106M") ||
    rawUpper.includes("AD107M") ||
    rawUpper.includes("AD106M") ||
    rawUpper.includes("TU117M") ||
    rawUpper.includes("TGL") ||
    rawUpper.includes("ADL-P") ||
    rawUpper.includes("680M") ||
    rawUpper.includes("780M") ||
    rawUpper.includes("890M") ||
    rawUpper.includes("IRIS XE");

  // Detect discrete vs integrated
  const isDiscrete =
    vendor === "NVIDIA" ||
    (vendor === "AMD" && (upper.includes("RX") || upper.includes("R9") || upper.includes("R7") || upper.includes("PRO") || rawUpper.includes("NAVI"))) ||
    (vendor === "Intel" && (upper.includes("ARC") || upper.includes("A770") || upper.includes("A750") || upper.includes("A580") || upper.includes("B580") || upper.includes("B570")));

  // Detect architecture hint
  let architectureHint: string | undefined = undefined;
  if (rawUpper.includes("BLACKWELL") || rawUpper.includes("GB20")) architectureHint = "Blackwell";
  else if (rawUpper.includes("ADA") || rawUpper.includes("AD10")) architectureHint = "Ada Lovelace";
  else if (rawUpper.includes("AMPERE") || rawUpper.includes("GA10")) architectureHint = "Ampere";
  else if (rawUpper.includes("TURING") || rawUpper.includes("TU11") || rawUpper.includes("TU10")) architectureHint = "Turing";
  else if (rawUpper.includes("PASCAL") || rawUpper.includes("GP10")) architectureHint = "Pascal";
  else if (rawUpper.includes("RDNA3") || rawUpper.includes("NAVI3")) architectureHint = "RDNA 3";
  else if (rawUpper.includes("RDNA2") || rawUpper.includes("NAVI2")) architectureHint = "RDNA 2";
  else if (rawUpper.includes("BATTLEMAGE")) architectureHint = "Battlemage";
  else if (rawUpper.includes("ALCHEMIST")) architectureHint = "Alchemist";

  // Extract Suffixes
  const suffixes: string[] = [];
  if (/\bTI\b/i.test(text)) suffixes.push("Ti");
  if (/\bSUPER\b/i.test(text)) suffixes.push("Super");
  if (/\bXTX\b/i.test(text)) suffixes.push("XTX");
  else if (/\bXT\b/i.test(text)) suffixes.push("XT");
  if (/\bGRE\b/i.test(text)) suffixes.push("GRE");
  if (isLaptop) suffixes.push("Laptop");

  // Canonical normalization
  let normalized = text;
  if (vendor === "NVIDIA" && !/nvidia/i.test(normalized)) {
    normalized = `NVIDIA ${normalized}`.trim();
  } else if (vendor === "AMD" && !/amd/i.test(normalized)) {
    normalized = `AMD ${normalized}`.trim();
  } else if (vendor === "Intel" && normalized.includes("Mesa Intel")) {
    normalized = normalized.replace(/Mesa Intel\s*/i, "Intel ");
  }

  return {
    raw,
    normalized,
    vendor,
    suffixes,
    isLaptop,
    isDiscrete,
    architectureHint,
    pciDeviceId,
  };
}

export function parseRendererString(raw: string, _vendorHint?: string) {
  const parsed = parseAndNormalizeRenderer(raw);
  const rawUpper = (raw || "").toUpperCase();
  return {
    ...parsed,
    cleanName: parsed.normalized,
    isAngleWrapper: rawUpper.includes("ANGLE"),
    isMesaDriver: rawUpper.includes("MESA") || rawUpper.includes("RADV"),
  };
}
