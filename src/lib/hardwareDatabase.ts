export interface GpuSpec {
  id: string;
  name: string;
  vendor: "NVIDIA" | "AMD" | "Intel" | "Apple" | "Qualcomm" | "Other";
  vram: string;
  vramGb: number;
  tier: "S+" | "S" | "A" | "B" | "C" | "D";
  tierScore?: number;
  score: number; // 0 - 100
  architecture?: string;
  isDiscrete?: boolean;
  isLaptop?: boolean;
  chipCodename?: string;
  pciDeviceIds?: string[];
  codecs?: { av1: boolean; hevc10: boolean; vp9_2: boolean };
}

export interface CpuSpec {
  id: string;
  name: string;
  vendor: "Intel" | "AMD" | "Apple" | "Qualcomm" | "Other";
  cores: number;
  threads: number;
  tier: "S+" | "S" | "A" | "B" | "C" | "D";
  score: number; // 0 - 100
  generation?: string;
  isLaptop?: boolean;
}

// 🎮 Comprehensive GPU Database (300+ entries)
export const GPU_DATABASE: GpuSpec[] = [
  // --- NVIDIA RTX 50 Series (Blackwell) ---
  { id: "rtx-5090", name: "NVIDIA GeForce RTX 5090", vendor: "NVIDIA", vram: "32 GB GDDR7", vramGb: 32, tier: "S+", tierScore: 6.0, score: 100, isDiscrete: true, architecture: "blackwell" },
  { id: "rtx-5080", name: "NVIDIA GeForce RTX 5080", vendor: "NVIDIA", vram: "16 GB GDDR7", vramGb: 16, tier: "S+", tierScore: 5.7, score: 98, isDiscrete: true, architecture: "blackwell" },
  { id: "rtx-5070-ti", name: "NVIDIA GeForce RTX 5070 Ti", vendor: "NVIDIA", vram: "16 GB GDDR7", vramGb: 16, tier: "S+", tierScore: 5.4, score: 94, isDiscrete: true, architecture: "blackwell" },
  { id: "rtx-5070", name: "NVIDIA GeForce RTX 5070", vendor: "NVIDIA", vram: "12 GB GDDR7", vramGb: 12, tier: "S", tierScore: 5.1, score: 90, isDiscrete: true, architecture: "blackwell" },
  { id: "rtx-5060-ti", name: "NVIDIA GeForce RTX 5060 Ti", vendor: "NVIDIA", vram: "12 GB GDDR7", vramGb: 12, tier: "A", tierScore: 4.5, score: 82, isDiscrete: true, architecture: "blackwell" },
  { id: "rtx-5060", name: "NVIDIA GeForce RTX 5060", vendor: "NVIDIA", vram: "8 GB GDDR7", vramGb: 8, tier: "A", tierScore: 4.2, score: 76, isDiscrete: true, architecture: "blackwell" },

  // --- NVIDIA RTX 40 Series (Ada Lovelace) ---
  { id: "rtx-4090", name: "NVIDIA GeForce RTX 4090", vendor: "NVIDIA", vram: "24 GB GDDR6X", vramGb: 24, tier: "S+", tierScore: 5.5, score: 100, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-4090-d", name: "NVIDIA GeForce RTX 4090 D", vendor: "NVIDIA", vram: "24 GB GDDR6X", vramGb: 24, tier: "S+", tierScore: 5.4, score: 98, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-4080-super", name: "NVIDIA GeForce RTX 4080 Super", vendor: "NVIDIA", vram: "16 GB GDDR6X", vramGb: 16, tier: "S+", tierScore: 5.3, score: 96, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-4080", name: "NVIDIA GeForce RTX 4080", vendor: "NVIDIA", vram: "16 GB GDDR6X", vramGb: 16, tier: "S+", tierScore: 5.2, score: 94, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-4070-ti-super", name: "NVIDIA GeForce RTX 4070 Ti Super", vendor: "NVIDIA", vram: "16 GB GDDR6X", vramGb: 16, tier: "S", tierScore: 4.9, score: 90, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-4070-ti", name: "NVIDIA GeForce RTX 4070 Ti", vendor: "NVIDIA", vram: "12 GB GDDR6X", vramGb: 12, tier: "S", tierScore: 4.7, score: 87, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-4070-super", name: "NVIDIA GeForce RTX 4070 Super", vendor: "NVIDIA", vram: "12 GB GDDR6X", vramGb: 12, tier: "S", tierScore: 4.6, score: 85, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-4070", name: "NVIDIA GeForce RTX 4070", vendor: "NVIDIA", vram: "12 GB GDDR6X", vramGb: 12, tier: "S", tierScore: 4.4, score: 81, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-4060-ti-16gb", name: "NVIDIA GeForce RTX 4060 Ti 16GB", vendor: "NVIDIA", vram: "16 GB GDDR6", vramGb: 16, tier: "A", tierScore: 4.1, score: 76, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-4060-ti", name: "NVIDIA GeForce RTX 4060 Ti", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "A", tierScore: 4.0, score: 74, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-4060", name: "NVIDIA GeForce RTX 4060", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "A", tierScore: 3.7, score: 68, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-4090-laptop", name: "NVIDIA GeForce RTX 4090 Laptop GPU", vendor: "NVIDIA", vram: "16 GB GDDR6", vramGb: 16, tier: "S+", tierScore: 5.0, score: 91, isDiscrete: true, isLaptop: true, chipCodename: "AD103", pciDeviceIds: ["2717", "2757"], architecture: "ada-lovelace" },
  { id: "rtx-4080-laptop", name: "NVIDIA GeForce RTX 4080 Laptop GPU", vendor: "NVIDIA", vram: "12 GB GDDR6", vramGb: 12, tier: "S", tierScore: 4.6, score: 84, isDiscrete: true, isLaptop: true, chipCodename: "AD104", pciDeviceIds: ["27e0", "27a0"], architecture: "ada-lovelace" },
  { id: "rtx-4070-laptop", name: "NVIDIA GeForce RTX 4070 Laptop GPU", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "A", tierScore: 4.0, score: 73, isDiscrete: true, isLaptop: true, chipCodename: "AD106", pciDeviceIds: ["2820", "2860"], architecture: "ada-lovelace" },
  { id: "rtx-4060-laptop", name: "NVIDIA GeForce RTX 4060 Laptop GPU", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "A", tierScore: 3.6, score: 66, isDiscrete: true, isLaptop: true, chipCodename: "AD107", pciDeviceIds: ["28a0", "28e0"], architecture: "ada-lovelace" },
  { id: "rtx-4050-laptop", name: "NVIDIA GeForce RTX 4050 Laptop GPU", vendor: "NVIDIA", vram: "6 GB GDDR6", vramGb: 6, tier: "B", tierScore: 3.2, score: 58, isDiscrete: true, isLaptop: true, chipCodename: "AD107", pciDeviceIds: ["28e1", "28a1"], architecture: "ada-lovelace" },
  { id: "rtx-6000-ada", name: "NVIDIA RTX 6000 Ada Generation", vendor: "NVIDIA", vram: "48 GB GDDR6", vramGb: 48, tier: "S+", tierScore: 5.6, score: 100, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-5000-ada", name: "NVIDIA RTX 5000 Ada Generation", vendor: "NVIDIA", vram: "32 GB GDDR6", vramGb: 32, tier: "S+", tierScore: 5.2, score: 93, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-4500-ada", name: "NVIDIA RTX 4500 Ada Generation", vendor: "NVIDIA", vram: "24 GB GDDR6", vramGb: 24, tier: "S", tierScore: 4.8, score: 88, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-4000-ada", name: "NVIDIA RTX 4000 Ada Generation", vendor: "NVIDIA", vram: "20 GB GDDR6", vramGb: 20, tier: "S", tierScore: 4.5, score: 82, isDiscrete: true, architecture: "ada-lovelace" },
  { id: "rtx-2000-ada", name: "NVIDIA RTX 2000 Ada Generation", vendor: "NVIDIA", vram: "16 GB GDDR6", vramGb: 16, tier: "A", tierScore: 3.8, score: 70, isDiscrete: true, architecture: "ada-lovelace" },

  // --- NVIDIA RTX 30 Series (Ampere) ---
  { id: "rtx-3090-ti", name: "NVIDIA GeForce RTX 3090 Ti", vendor: "NVIDIA", vram: "24 GB GDDR6X", vramGb: 24, tier: "S+", tierScore: 5.1, score: 92, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-3090", name: "NVIDIA GeForce RTX 3090", vendor: "NVIDIA", vram: "24 GB GDDR6X", vramGb: 24, tier: "S", tierScore: 4.9, score: 88, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-3080-ti", name: "NVIDIA GeForce RTX 3080 Ti", vendor: "NVIDIA", vram: "12 GB GDDR6X", vramGb: 12, tier: "S", tierScore: 4.8, score: 86, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-3080-12gb", name: "NVIDIA GeForce RTX 3080 12GB", vendor: "NVIDIA", vram: "12 GB GDDR6X", vramGb: 12, tier: "S", tierScore: 4.7, score: 84, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-3080", name: "NVIDIA GeForce RTX 3080", vendor: "NVIDIA", vram: "10 GB GDDR6X", vramGb: 10, tier: "S", tierScore: 4.6, score: 83, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-3070-ti", name: "NVIDIA GeForce RTX 3070 Ti", vendor: "NVIDIA", vram: "8 GB GDDR6X", vramGb: 8, tier: "A", tierScore: 4.2, score: 77, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-3070", name: "NVIDIA GeForce RTX 3070", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "A", tierScore: 4.0, score: 74, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-3060-ti", name: "NVIDIA GeForce RTX 3060 Ti", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "A", tierScore: 3.8, score: 70, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-3060-12gb", name: "NVIDIA GeForce RTX 3060 12GB", vendor: "NVIDIA", vram: "12 GB GDDR6", vramGb: 12, tier: "B", tierScore: 3.4, score: 62, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-3060", name: "NVIDIA GeForce RTX 3060", vendor: "NVIDIA", vram: "12 GB GDDR6", vramGb: 12, tier: "B", tierScore: 3.4, score: 62, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-3060-8gb", name: "NVIDIA GeForce RTX 3060 8GB", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.2, score: 57, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-3050-8gb", name: "NVIDIA GeForce RTX 3050 8GB", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 2.9, score: 52, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-3050", name: "NVIDIA GeForce RTX 3050", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 2.9, score: 52, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-3050-6gb", name: "NVIDIA GeForce RTX 3050 6GB", vendor: "NVIDIA", vram: "6 GB GDDR6", vramGb: 6, tier: "C", tierScore: 2.5, score: 46, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-3080-ti-laptop", name: "NVIDIA GeForce RTX 3080 Ti Laptop GPU", vendor: "NVIDIA", vram: "16 GB GDDR6", vramGb: 16, tier: "S", tierScore: 4.6, score: 82, isDiscrete: true, isLaptop: true, chipCodename: "GA103", pciDeviceIds: ["2420"], architecture: "ampere" },
  { id: "rtx-3080-laptop", name: "NVIDIA GeForce RTX 3080 Laptop GPU", vendor: "NVIDIA", vram: "8 GB / 16 GB GDDR6", vramGb: 16, tier: "S", tierScore: 4.4, score: 78, isDiscrete: true, isLaptop: true, chipCodename: "GA104", pciDeviceIds: ["249c", "24dc"], architecture: "ampere" },
  { id: "rtx-3070-ti-laptop", name: "NVIDIA GeForce RTX 3070 Ti Laptop GPU", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "A", tierScore: 4.0, score: 72, isDiscrete: true, isLaptop: true, chipCodename: "GA104", pciDeviceIds: ["24a0", "24e0"], architecture: "ampere" },
  { id: "rtx-3070-laptop", name: "NVIDIA GeForce RTX 3070 Laptop GPU", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "A", tierScore: 3.8, score: 68, isDiscrete: true, isLaptop: true, chipCodename: "GA104", pciDeviceIds: ["249d", "24dd"], architecture: "ampere" },
  { id: "rtx-3060-laptop", name: "NVIDIA GeForce RTX 3060 Laptop GPU", vendor: "NVIDIA", vram: "6 GB GDDR6", vramGb: 6, tier: "B", tierScore: 3.3, score: 60, isDiscrete: true, isLaptop: true, chipCodename: "GA106", pciDeviceIds: ["2503", "2504", "2520", "2560"], architecture: "ampere" },
  { id: "rtx-3050-ti-laptop", name: "NVIDIA GeForce RTX 3050 Ti Laptop GPU", vendor: "NVIDIA", vram: "4 GB GDDR6", vramGb: 4, tier: "B", tierScore: 2.8, score: 55, isDiscrete: true, isLaptop: true, chipCodename: "GA107", pciDeviceIds: ["25a0", "25e0"], architecture: "ampere" },
  { id: "rtx-3050-laptop", name: "NVIDIA GeForce RTX 3050 Laptop GPU", vendor: "NVIDIA", vram: "4 GB GDDR6", vramGb: 4, tier: "B", tierScore: 2.7, score: 52, isDiscrete: true, isLaptop: true, chipCodename: "GA107", pciDeviceIds: ["25a2", "25a9", "25a5", "25ec"], architecture: "ampere" },
  { id: "rtx-a6000", name: "NVIDIA RTX A6000", vendor: "NVIDIA", vram: "48 GB GDDR6", vramGb: 48, tier: "S+", tierScore: 5.0, score: 90, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-a5000", name: "NVIDIA RTX A5000", vendor: "NVIDIA", vram: "24 GB GDDR6", vramGb: 24, tier: "S", tierScore: 4.6, score: 82, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-a4000", name: "NVIDIA RTX A4000", vendor: "NVIDIA", vram: "16 GB GDDR6", vramGb: 16, tier: "A", tierScore: 3.9, score: 72, isDiscrete: true, architecture: "ampere" },
  { id: "rtx-a2000", name: "NVIDIA RTX A2000", vendor: "NVIDIA", vram: "6 GB / 12 GB GDDR6", vramGb: 6, tier: "B", tierScore: 3.1, score: 56, isDiscrete: true, architecture: "ampere" },

  // --- NVIDIA RTX 20 Series & Turing ---
  { id: "titan-rtx", name: "NVIDIA TITAN RTX", vendor: "NVIDIA", vram: "24 GB GDDR6", vramGb: 24, tier: "S", tierScore: 4.6, score: 82, isDiscrete: true, architecture: "turing" },
  { id: "rtx-2080-ti", name: "NVIDIA GeForce RTX 2080 Ti", vendor: "NVIDIA", vram: "11 GB GDDR6", vramGb: 11, tier: "A", tierScore: 4.1, score: 75, isDiscrete: true, architecture: "turing" },
  { id: "rtx-2080-super", name: "NVIDIA GeForce RTX 2080 Super", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "A", tierScore: 3.9, score: 71, isDiscrete: true, architecture: "turing" },
  { id: "rtx-2080", name: "NVIDIA GeForce RTX 2080", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "A", tierScore: 3.7, score: 68, isDiscrete: true, architecture: "turing" },
  { id: "rtx-2070-super", name: "NVIDIA GeForce RTX 2070 Super", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "A", tierScore: 3.6, score: 66, isDiscrete: true, architecture: "turing" },
  { id: "rtx-2070", name: "NVIDIA GeForce RTX 2070", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.4, score: 62, isDiscrete: true, architecture: "turing" },
  { id: "rtx-2060-super", name: "NVIDIA GeForce RTX 2060 Super", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.3, score: 60, isDiscrete: true, architecture: "turing" },
  { id: "rtx-2060-12gb", name: "NVIDIA GeForce RTX 2060 12GB", vendor: "NVIDIA", vram: "12 GB GDDR6", vramGb: 12, tier: "B", tierScore: 3.1, score: 57, isDiscrete: true, architecture: "turing" },
  { id: "rtx-2060", name: "NVIDIA GeForce RTX 2060", vendor: "NVIDIA", vram: "6 GB GDDR6", vramGb: 6, tier: "B", tierScore: 3.0, score: 55, isDiscrete: true, architecture: "turing" },
  { id: "rtx-2050", name: "NVIDIA GeForce RTX 2050 Mobile", vendor: "NVIDIA", vram: "4 GB GDDR6", vramGb: 4, tier: "B", tierScore: 2.6, score: 46, isDiscrete: true, isLaptop: true, chipCodename: "GA107", pciDeviceIds: ["25ad", "25af"], architecture: "ampere" },
  { id: "rtx-2050-laptop", name: "NVIDIA GeForce RTX 2050 Laptop GPU", vendor: "NVIDIA", vram: "4 GB GDDR6", vramGb: 4, tier: "B", tierScore: 2.6, score: 46, isDiscrete: true, isLaptop: true, chipCodename: "GA107", pciDeviceIds: ["25ad", "25af"], architecture: "ampere" },
  { id: "rtx-2080-super-laptop", name: "NVIDIA GeForce RTX 2080 Super Laptop GPU", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "A", tierScore: 3.6, score: 66, isDiscrete: true, isLaptop: true, chipCodename: "TU104", pciDeviceIds: ["1ed3"], architecture: "turing" },
  { id: "rtx-2080-laptop", name: "NVIDIA GeForce RTX 2080 Laptop GPU", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.4, score: 62, isDiscrete: true, isLaptop: true, chipCodename: "TU104", pciDeviceIds: ["1ed0"], architecture: "turing" },
  { id: "rtx-2070-super-laptop", name: "NVIDIA GeForce RTX 2070 Super Laptop GPU", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.3, score: 60, isDiscrete: true, isLaptop: true, chipCodename: "TU104", pciDeviceIds: ["1f14"], architecture: "turing" },
  { id: "rtx-2070-laptop", name: "NVIDIA GeForce RTX 2070 Laptop GPU", vendor: "NVIDIA", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.1, score: 56, isDiscrete: true, isLaptop: true, chipCodename: "TU106", pciDeviceIds: ["1f10"], architecture: "turing" },
  { id: "rtx-2060-laptop", name: "NVIDIA GeForce RTX 2060 Laptop GPU", vendor: "NVIDIA", vram: "6 GB GDDR6", vramGb: 6, tier: "B", tierScore: 2.8, score: 51, isDiscrete: true, isLaptop: true, chipCodename: "TU106", pciDeviceIds: ["1f11", "1f15"], architecture: "turing" },

  // --- NVIDIA GTX 16 & 10 Series (Pascal / Turing GTX) ---
  { id: "gtx-1660-ti", name: "NVIDIA GeForce GTX 1660 Ti", vendor: "NVIDIA", vram: "6 GB GDDR6", vramGb: 6, tier: "B", tierScore: 2.7, score: 50, isDiscrete: true, architecture: "turing" },
  { id: "gtx-1660-super", name: "NVIDIA GeForce GTX 1660 Super", vendor: "NVIDIA", vram: "6 GB GDDR6", vramGb: 6, tier: "B", tierScore: 2.6, score: 49, isDiscrete: true, architecture: "turing" },
  { id: "gtx-1660", name: "NVIDIA GeForce GTX 1660", vendor: "NVIDIA", vram: "6 GB GDDR5", vramGb: 6, tier: "B", tierScore: 2.5, score: 46, isDiscrete: true, architecture: "turing" },
  { id: "gtx-1650-super", name: "NVIDIA GeForce GTX 1650 Super", vendor: "NVIDIA", vram: "4 GB GDDR6", vramGb: 4, tier: "C", tierScore: 2.3, score: 43, isDiscrete: true, architecture: "turing" },
  { id: "gtx-1650-g6", name: "NVIDIA GeForce GTX 1650 GDDR6", vendor: "NVIDIA", vram: "4 GB GDDR6", vramGb: 4, tier: "C", tierScore: 2.1, score: 39, isDiscrete: true, architecture: "turing" },
  { id: "gtx-1650", name: "NVIDIA GeForce GTX 1650", vendor: "NVIDIA", vram: "4 GB GDDR5", vramGb: 4, tier: "C", tierScore: 2.0, score: 38, isDiscrete: true, architecture: "turing" },
  { id: "gtx-1630", name: "NVIDIA GeForce GTX 1630", vendor: "NVIDIA", vram: "4 GB GDDR6", vramGb: 4, tier: "D", tierScore: 1.5, score: 28, isDiscrete: true, architecture: "turing" },
  { id: "gtx-1660-ti-laptop", name: "NVIDIA GeForce GTX 1660 Ti Laptop GPU", vendor: "NVIDIA", vram: "6 GB GDDR6", vramGb: 6, tier: "B", tierScore: 2.6, score: 47, isDiscrete: true, isLaptop: true, chipCodename: "TU116", pciDeviceIds: ["2191"], architecture: "turing" },
  { id: "gtx-1650-ti-laptop", name: "NVIDIA GeForce GTX 1650 Ti Laptop GPU", vendor: "NVIDIA", vram: "4 GB GDDR6", vramGb: 4, tier: "C", tierScore: 2.2, score: 41, isDiscrete: true, isLaptop: true, chipCodename: "TU117", pciDeviceIds: ["1f95"], architecture: "turing" },
  { id: "gtx-1650-laptop", name: "NVIDIA GeForce GTX 1650 Laptop GPU", vendor: "NVIDIA", vram: "4 GB GDDR5/GDDR6", vramGb: 4, tier: "C", tierScore: 2.0, score: 37, isDiscrete: true, isLaptop: true, chipCodename: "TU117", pciDeviceIds: ["1f91", "1f99"], architecture: "turing" },

  { id: "titan-xp", name: "NVIDIA TITAN Xp", vendor: "NVIDIA", vram: "12 GB GDDR5X", vramGb: 12, tier: "A", tierScore: 3.8, score: 70, isDiscrete: true, architecture: "pascal" },
  { id: "gtx-1080-ti", name: "NVIDIA GeForce GTX 1080 Ti", vendor: "NVIDIA", vram: "11 GB GDDR5X", vramGb: 11, tier: "A", tierScore: 3.5, score: 65, isDiscrete: true, architecture: "pascal" },
  { id: "gtx-1080", name: "NVIDIA GeForce GTX 1080", vendor: "NVIDIA", vram: "8 GB GDDR5X", vramGb: 8, tier: "B", tierScore: 3.1, score: 57, isDiscrete: true, architecture: "pascal" },
  { id: "gtx-1070-ti", name: "NVIDIA GeForce GTX 1070 Ti", vendor: "NVIDIA", vram: "8 GB GDDR5", vramGb: 8, tier: "B", tierScore: 2.9, score: 54, isDiscrete: true, architecture: "pascal" },
  { id: "gtx-1070", name: "NVIDIA GeForce GTX 1070", vendor: "NVIDIA", vram: "8 GB GDDR5", vramGb: 8, tier: "B", tierScore: 2.7, score: 50, isDiscrete: true, architecture: "pascal" },
  { id: "gtx-1060-6gb", name: "NVIDIA GeForce GTX 1060 6GB", vendor: "NVIDIA", vram: "6 GB GDDR5", vramGb: 6, tier: "C", tierScore: 2.3, score: 42, isDiscrete: true, architecture: "pascal" },
  { id: "gtx-1060-3gb", name: "NVIDIA GeForce GTX 1060 3GB", vendor: "NVIDIA", vram: "3 GB GDDR5", vramGb: 3, tier: "C", tierScore: 2.0, score: 38, isDiscrete: true, architecture: "pascal" },
  { id: "gtx-1050-ti", name: "NVIDIA GeForce GTX 1050 Ti", vendor: "NVIDIA", vram: "4 GB GDDR5", vramGb: 4, tier: "C", tierScore: 1.7, score: 32, isDiscrete: true, architecture: "pascal" },
  { id: "gtx-1050", name: "NVIDIA GeForce GTX 1050", vendor: "NVIDIA", vram: "2 GB GDDR5", vramGb: 2, tier: "D", tierScore: 1.4, score: 26, isDiscrete: true, architecture: "pascal" },
  { id: "gt-1030", name: "NVIDIA GeForce GT 1030", vendor: "NVIDIA", vram: "2 GB GDDR5", vramGb: 2, tier: "D", tierScore: 1.0, score: 18, isDiscrete: true, architecture: "pascal" },
  { id: "gtx-1080-laptop", name: "NVIDIA GeForce GTX 1080 Laptop GPU", vendor: "NVIDIA", vram: "8 GB GDDR5X", vramGb: 8, tier: "B", tierScore: 3.0, score: 55, isDiscrete: true, architecture: "pascal" },
  { id: "gtx-1070-laptop", name: "NVIDIA GeForce GTX 1070 Laptop GPU", vendor: "NVIDIA", vram: "8 GB GDDR5", vramGb: 8, tier: "B", tierScore: 2.6, score: 48, isDiscrete: true, architecture: "pascal" },
  { id: "gtx-1060-laptop", name: "NVIDIA GeForce GTX 1060 Laptop GPU", vendor: "NVIDIA", vram: "6 GB GDDR5", vramGb: 6, tier: "C", tierScore: 2.1, score: 40, isDiscrete: true, architecture: "pascal" },
  { id: "gtx-1050-ti-laptop", name: "NVIDIA GeForce GTX 1050 Ti Laptop GPU", vendor: "NVIDIA", vram: "4 GB GDDR5", vramGb: 4, tier: "C", tierScore: 1.6, score: 30, isDiscrete: true, architecture: "pascal" },
  { id: "gtx-1050-laptop", name: "NVIDIA GeForce GTX 1050 Laptop GPU", vendor: "NVIDIA", vram: "2 GB / 4 GB GDDR5", vramGb: 2, tier: "D", tierScore: 1.3, score: 24, isDiscrete: true, architecture: "pascal" },

  // --- NVIDIA GeForce MX Series ---
  { id: "mx570", name: "NVIDIA GeForce MX570", vendor: "NVIDIA", vram: "2 GB GDDR6", vramGb: 2, tier: "C", tierScore: 1.9, score: 36, isDiscrete: true, architecture: "ampere" },
  { id: "mx550", name: "NVIDIA GeForce MX550", vendor: "NVIDIA", vram: "2 GB GDDR6", vramGb: 2, tier: "C", tierScore: 1.7, score: 32, isDiscrete: true, architecture: "turing" },
  { id: "mx450", name: "NVIDIA GeForce MX450", vendor: "NVIDIA", vram: "2 GB GDDR5/GDDR6", vramGb: 2, tier: "C", tierScore: 1.5, score: 29, isDiscrete: true, architecture: "turing" },
  { id: "mx350", name: "NVIDIA GeForce MX350", vendor: "NVIDIA", vram: "2 GB GDDR5", vramGb: 2, tier: "D", tierScore: 1.2, score: 23, isDiscrete: true, architecture: "pascal" },
  { id: "mx330", name: "NVIDIA GeForce MX330", vendor: "NVIDIA", vram: "2 GB GDDR5", vramGb: 2, tier: "D", tierScore: 1.0, score: 19, isDiscrete: true, architecture: "pascal" },
  { id: "mx250", name: "NVIDIA GeForce MX250", vendor: "NVIDIA", vram: "2 GB GDDR5", vramGb: 2, tier: "D", tierScore: 1.0, score: 18, isDiscrete: true, architecture: "pascal" },
  { id: "mx150", name: "NVIDIA GeForce MX150", vendor: "NVIDIA", vram: "2 GB GDDR5", vramGb: 2, tier: "D", tierScore: 0.9, score: 16, isDiscrete: true, architecture: "pascal" },

  // --- NVIDIA GTX 900 & 700 Series ---
  { id: "gtx-980-ti", name: "NVIDIA GeForce GTX 980 Ti", vendor: "NVIDIA", vram: "6 GB GDDR5", vramGb: 6, tier: "C", tierScore: 2.3, score: 44, isDiscrete: true, architecture: "maxwell" },
  { id: "gtx-980", name: "NVIDIA GeForce GTX 980", vendor: "NVIDIA", vram: "4 GB GDDR5", vramGb: 4, tier: "C", tierScore: 2.1, score: 40, isDiscrete: true, architecture: "maxwell" },
  { id: "gtx-970", name: "NVIDIA GeForce GTX 970", vendor: "NVIDIA", vram: "4 GB GDDR5", vramGb: 4, tier: "C", tierScore: 1.9, score: 36, isDiscrete: true, architecture: "maxwell" },
  { id: "gtx-960", name: "NVIDIA GeForce GTX 960", vendor: "NVIDIA", vram: "2 GB / 4 GB GDDR5", vramGb: 2, tier: "D", tierScore: 1.3, score: 25, isDiscrete: true, architecture: "maxwell" },
  { id: "gtx-950", name: "NVIDIA GeForce GTX 950", vendor: "NVIDIA", vram: "2 GB GDDR5", vramGb: 2, tier: "D", tierScore: 1.1, score: 21, isDiscrete: true, architecture: "maxwell" },
  { id: "gtx-780-ti", name: "NVIDIA GeForce GTX 780 Ti", vendor: "NVIDIA", vram: "3 GB GDDR5", vramGb: 3, tier: "D", tierScore: 1.5, score: 30, isDiscrete: true, architecture: "kepler" },
  { id: "gtx-780", name: "NVIDIA GeForce GTX 780", vendor: "NVIDIA", vram: "3 GB GDDR5", vramGb: 3, tier: "D", tierScore: 1.3, score: 26, isDiscrete: true, architecture: "kepler" },
  { id: "gtx-770", name: "NVIDIA GeForce GTX 770", vendor: "NVIDIA", vram: "2 GB / 4 GB GDDR5", vramGb: 2, tier: "D", tierScore: 1.2, score: 24, isDiscrete: true, architecture: "kepler" },
  { id: "gtx-760", name: "NVIDIA GeForce GTX 760", vendor: "NVIDIA", vram: "2 GB GDDR5", vramGb: 2, tier: "D", tierScore: 1.0, score: 20, isDiscrete: true, architecture: "kepler" },
  { id: "gtx-750-ti", name: "NVIDIA GeForce GTX 750 Ti", vendor: "NVIDIA", vram: "2 GB GDDR5", vramGb: 2, tier: "D", tierScore: 0.9, score: 18, isDiscrete: true, architecture: "maxwell" },
  { id: "gt-730", name: "NVIDIA GeForce GT 730", vendor: "NVIDIA", vram: "2 GB GDDR5/DDR3", vramGb: 2, tier: "D", tierScore: 0.5, score: 10, isDiscrete: true, architecture: "kepler" },
  { id: "gt-710", name: "NVIDIA GeForce GT 710", vendor: "NVIDIA", vram: "1 GB / 2 GB DDR3", vramGb: 1, tier: "D", tierScore: 0.3, score: 6, isDiscrete: true, architecture: "kepler" },

  // --- AMD Radeon RX 7000 Series (RDNA 3) ---
  { id: "rx-7900-xtx", name: "AMD Radeon RX 7900 XTX", vendor: "AMD", vram: "24 GB GDDR6", vramGb: 24, tier: "S+", tierScore: 5.4, score: 97, isDiscrete: true, architecture: "rdna3" },
  { id: "rx-7900-xt", name: "AMD Radeon RX 7900 XT", vendor: "AMD", vram: "20 GB GDDR6", vramGb: 20, tier: "S+", tierScore: 5.0, score: 91, isDiscrete: true, architecture: "rdna3" },
  { id: "rx-7900-gre", name: "AMD Radeon RX 7900 GRE", vendor: "AMD", vram: "16 GB GDDR6", vramGb: 16, tier: "S", tierScore: 4.7, score: 86, isDiscrete: true, architecture: "rdna3" },
  { id: "rx-7800-xt", name: "AMD Radeon RX 7800 XT", vendor: "AMD", vram: "16 GB GDDR6", vramGb: 16, tier: "S", tierScore: 4.5, score: 82, isDiscrete: true, architecture: "rdna3" },
  { id: "rx-7700-xt", name: "AMD Radeon RX 7700 XT", vendor: "AMD", vram: "12 GB GDDR6", vramGb: 12, tier: "A", tierScore: 4.1, score: 75, isDiscrete: true, architecture: "rdna3" },
  { id: "rx-7600-xt", name: "AMD Radeon RX 7600 XT", vendor: "AMD", vram: "16 GB GDDR6", vramGb: 16, tier: "B", tierScore: 3.5, score: 65, isDiscrete: true, architecture: "rdna3" },
  { id: "rx-7600", name: "AMD Radeon RX 7600", vendor: "AMD", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.4, score: 62, isDiscrete: true, architecture: "rdna3" },
  { id: "rx-7900m", name: "AMD Radeon RX 7900M", vendor: "AMD", vram: "16 GB GDDR6", vramGb: 16, tier: "S", tierScore: 4.6, score: 84, isDiscrete: true, architecture: "rdna3" },
  { id: "rx-7600m-xt", name: "AMD Radeon RX 7600M XT", vendor: "AMD", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.3, score: 60, isDiscrete: true, architecture: "rdna3" },
  { id: "rx-7600s", name: "AMD Radeon RX 7600S", vendor: "AMD", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.1, score: 56, isDiscrete: true, architecture: "rdna3" },

  // --- AMD Radeon RX 6000 Series (RDNA 2) ---
  { id: "rx-6950-xt", name: "AMD Radeon RX 6950 XT", vendor: "AMD", vram: "16 GB GDDR6", vramGb: 16, tier: "S", tierScore: 4.8, score: 88, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6900-xt", name: "AMD Radeon RX 6900 XT", vendor: "AMD", vram: "16 GB GDDR6", vramGb: 16, tier: "S", tierScore: 4.7, score: 85, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6800-xt", name: "AMD Radeon RX 6800 XT", vendor: "AMD", vram: "16 GB GDDR6", vramGb: 16, tier: "S", tierScore: 4.5, score: 81, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6800", name: "AMD Radeon RX 6800", vendor: "AMD", vram: "16 GB GDDR6", vramGb: 16, tier: "A", tierScore: 4.2, score: 76, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6750-xt", name: "AMD Radeon RX 6750 XT", vendor: "AMD", vram: "12 GB GDDR6", vramGb: 12, tier: "A", tierScore: 3.9, score: 72, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6700-xt", name: "AMD Radeon RX 6700 XT", vendor: "AMD", vram: "12 GB GDDR6", vramGb: 12, tier: "A", tierScore: 3.8, score: 70, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6700", name: "AMD Radeon RX 6700", vendor: "AMD", vram: "10 GB GDDR6", vramGb: 10, tier: "B", tierScore: 3.5, score: 65, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6650-xt", name: "AMD Radeon RX 6650 XT", vendor: "AMD", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.4, score: 62, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6600-xt", name: "AMD Radeon RX 6600 XT", vendor: "AMD", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.3, score: 60, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6600", name: "AMD Radeon RX 6600", vendor: "AMD", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.0, score: 55, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6500-xt", name: "AMD Radeon RX 6500 XT", vendor: "AMD", vram: "4 GB / 8 GB GDDR6", vramGb: 4, tier: "C", tierScore: 1.9, score: 36, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6400", name: "AMD Radeon RX 6400", vendor: "AMD", vram: "4 GB GDDR6", vramGb: 4, tier: "D", tierScore: 1.6, score: 30, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6850m-xt", name: "AMD Radeon RX 6850M XT", vendor: "AMD", vram: "12 GB GDDR6", vramGb: 12, tier: "A", tierScore: 4.1, score: 75, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6800m", name: "AMD Radeon RX 6800M", vendor: "AMD", vram: "12 GB GDDR6", vramGb: 12, tier: "A", tierScore: 3.9, score: 71, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6700m", name: "AMD Radeon RX 6700M", vendor: "AMD", vram: "10 GB GDDR6", vramGb: 10, tier: "B", tierScore: 3.4, score: 63, isDiscrete: true, architecture: "rdna2" },
  { id: "rx-6600m", name: "AMD Radeon RX 6600M", vendor: "AMD", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.1, score: 56, isDiscrete: true, architecture: "rdna2" },

  // --- AMD Radeon RX 5000 & Vega & RX 500/400 ---
  { id: "rx-5700-xt", name: "AMD Radeon RX 5700 XT", vendor: "AMD", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.2, score: 58, isDiscrete: true, architecture: "rdna1" },
  { id: "rx-5700", name: "AMD Radeon RX 5700", vendor: "AMD", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.0, score: 54, isDiscrete: true, architecture: "rdna1" },
  { id: "rx-5600-xt", name: "AMD Radeon RX 5600 XT", vendor: "AMD", vram: "6 GB GDDR6", vramGb: 6, tier: "B", tierScore: 2.7, score: 50, isDiscrete: true, architecture: "rdna1" },
  { id: "rx-5500-xt", name: "AMD Radeon RX 5500 XT", vendor: "AMD", vram: "4 GB / 8 GB GDDR6", vramGb: 4, tier: "C", tierScore: 2.1, score: 38, isDiscrete: true, architecture: "rdna1" },
  { id: "radeon-vii", name: "AMD Radeon VII", vendor: "AMD", vram: "16 GB HBM2", vramGb: 16, tier: "B", tierScore: 3.3, score: 60, isDiscrete: true, architecture: "vega" },
  { id: "rx-vega-64", name: "AMD Radeon RX Vega 64", vendor: "AMD", vram: "8 GB HBM2", vramGb: 8, tier: "B", tierScore: 2.7, score: 50, isDiscrete: true, architecture: "vega" },
  { id: "rx-vega-56", name: "AMD Radeon RX Vega 56", vendor: "AMD", vram: "8 GB HBM2", vramGb: 8, tier: "B", tierScore: 2.5, score: 46, isDiscrete: true, architecture: "vega" },
  { id: "rx-590", name: "AMD Radeon RX 590", vendor: "AMD", vram: "8 GB GDDR5", vramGb: 8, tier: "C", tierScore: 2.1, score: 40, isDiscrete: true, architecture: "gcn" },
  { id: "rx-580", name: "AMD Radeon RX 580", vendor: "AMD", vram: "4 GB / 8 GB GDDR5", vramGb: 8, tier: "C", tierScore: 2.0, score: 38, isDiscrete: true, architecture: "gcn" },
  { id: "rx-570", name: "AMD Radeon RX 570", vendor: "AMD", vram: "4 GB / 8 GB GDDR5", vramGb: 4, tier: "C", tierScore: 1.8, score: 34, isDiscrete: true, architecture: "gcn" },
  { id: "rx-560", name: "AMD Radeon RX 560", vendor: "AMD", vram: "2 GB / 4 GB GDDR5", vramGb: 4, tier: "D", tierScore: 1.3, score: 24, isDiscrete: true, architecture: "gcn" },
  { id: "rx-550", name: "AMD Radeon RX 550", vendor: "AMD", vram: "2 GB / 4 GB GDDR5", vramGb: 2, tier: "D", tierScore: 0.9, score: 17, isDiscrete: true, architecture: "gcn" },
  { id: "rx-480", name: "AMD Radeon RX 480", vendor: "AMD", vram: "4 GB / 8 GB GDDR5", vramGb: 8, tier: "C", tierScore: 1.9, score: 36, isDiscrete: true, architecture: "gcn" },
  { id: "rx-470", name: "AMD Radeon RX 470", vendor: "AMD", vram: "4 GB / 8 GB GDDR5", vramGb: 4, tier: "C", tierScore: 1.7, score: 32, isDiscrete: true, architecture: "gcn" },
  { id: "rx-460", name: "AMD Radeon RX 460", vendor: "AMD", vram: "2 GB / 4 GB GDDR5", vramGb: 2, tier: "D", tierScore: 1.1, score: 22, isDiscrete: true, architecture: "gcn" },
  { id: "r9-fury-x", name: "AMD Radeon R9 Fury X", vendor: "AMD", vram: "4 GB HBM", vramGb: 4, tier: "C", tierScore: 2.1, score: 39, isDiscrete: true, architecture: "gcn" },
  { id: "r9-390x", name: "AMD Radeon R9 390X", vendor: "AMD", vram: "8 GB GDDR5", vramGb: 8, tier: "C", tierScore: 1.9, score: 35, isDiscrete: true, architecture: "gcn" },
  { id: "r9-390", name: "AMD Radeon R9 390", vendor: "AMD", vram: "8 GB GDDR5", vramGb: 8, tier: "C", tierScore: 1.8, score: 33, isDiscrete: true, architecture: "gcn" },
  { id: "r9-380", name: "AMD Radeon R9 380", vendor: "AMD", vram: "2 GB / 4 GB GDDR5", vramGb: 4, tier: "D", tierScore: 1.3, score: 25, isDiscrete: true, architecture: "gcn" },
  { id: "r9-290x", name: "AMD Radeon R9 290X", vendor: "AMD", vram: "4 GB GDDR5", vramGb: 4, tier: "C", tierScore: 1.7, score: 32, isDiscrete: true, architecture: "gcn" },
  { id: "r9-280x", name: "AMD Radeon R9 280X", vendor: "AMD", vram: "3 GB GDDR5", vramGb: 3, tier: "D", tierScore: 1.4, score: 26, isDiscrete: true, architecture: "gcn" },

  // --- Intel Arc & Dedicated GPUs ---
  { id: "arc-a770-16gb", name: "Intel Arc A770 16GB", vendor: "Intel", vram: "16 GB GDDR6", vramGb: 16, tier: "A", tierScore: 3.7, score: 68, isDiscrete: true, architecture: "alchemist" },
  { id: "arc-a770", name: "Intel Arc A770", vendor: "Intel", vram: "16 GB GDDR6", vramGb: 16, tier: "A", tierScore: 3.7, score: 68, isDiscrete: true, architecture: "alchemist" },
  { id: "arc-a770-8gb", name: "Intel Arc A770 8GB", vendor: "Intel", vram: "8 GB GDDR6", vramGb: 8, tier: "A", tierScore: 3.6, score: 66, isDiscrete: true, architecture: "alchemist" },
  { id: "arc-a750", name: "Intel Arc A750", vendor: "Intel", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.4, score: 62, isDiscrete: true, architecture: "alchemist" },
  { id: "arc-a580", name: "Intel Arc A580", vendor: "Intel", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 3.0, score: 55, isDiscrete: true, architecture: "alchemist" },
  { id: "arc-a380", name: "Intel Arc A380", vendor: "Intel", vram: "6 GB GDDR6", vramGb: 6, tier: "C", tierScore: 1.9, score: 36, isDiscrete: true, architecture: "alchemist" },
  { id: "arc-a310", name: "Intel Arc A310", vendor: "Intel", vram: "4 GB GDDR6", vramGb: 4, tier: "D", tierScore: 1.4, score: 26, isDiscrete: true, architecture: "alchemist" },
  { id: "arc-a770m", name: "Intel Arc A770M", vendor: "Intel", vram: "16 GB GDDR6", vramGb: 16, tier: "B", tierScore: 3.4, score: 62, isDiscrete: true, architecture: "alchemist" },
  { id: "arc-a730m", name: "Intel Arc A730M", vendor: "Intel", vram: "12 GB GDDR6", vramGb: 12, tier: "B", tierScore: 3.0, score: 55, isDiscrete: true, architecture: "alchemist" },
  { id: "arc-a570m", name: "Intel Arc A570M", vendor: "Intel", vram: "8 GB GDDR6", vramGb: 8, tier: "B", tierScore: 2.7, score: 49, isDiscrete: true, architecture: "alchemist" },
  { id: "arc-a550m", name: "Intel Arc A550M", vendor: "Intel", vram: "8 GB GDDR6", vramGb: 8, tier: "C", tierScore: 2.4, score: 45, isDiscrete: true, architecture: "alchemist" },
  { id: "arc-a370m", name: "Intel Arc A370M", vendor: "Intel", vram: "4 GB GDDR6", vramGb: 4, tier: "C", tierScore: 1.8, score: 33, isDiscrete: true, architecture: "alchemist" },
  { id: "arc-a350m", name: "Intel Arc A350M", vendor: "Intel", vram: "4 GB GDDR6", vramGb: 4, tier: "D", tierScore: 1.4, score: 26, isDiscrete: true, architecture: "alchemist" },

  // --- Intel Integrated GPUs ---
  { id: "intel-arc-140v", name: "Intel Arc 140V (Lunar Lake)", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 4, tier: "B", tierScore: 2.6, score: 48, isDiscrete: false, architecture: "battlemage" },
  { id: "intel-arc-130v", name: "Intel Arc 130V (Lunar Lake)", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 4, tier: "C", tierScore: 2.2, score: 41, isDiscrete: false, architecture: "battlemage" },
  { id: "intel-arc-igpu-8core", name: "Intel Arc Graphics 8-Core (Meteor Lake)", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 2, tier: "C", tierScore: 2.0, score: 38, isDiscrete: false, architecture: "alchemist" },
  { id: "intel-arc-igpu", name: "Intel Arc Graphics (Core Ultra)", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 2, tier: "C", tierScore: 1.8, score: 34, isDiscrete: false, architecture: "alchemist" },
  { id: "intel-iris-xe", name: "Intel Iris Xe Graphics", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 2, tier: "C", tierScore: 1.6, score: 30, isDiscrete: false, architecture: "xe" },
  { id: "intel-iris-xe-96eu", name: "Intel Iris Xe Graphics 96EU", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 2, tier: "C", tierScore: 1.6, score: 30, isDiscrete: false, architecture: "xe" },
  { id: "intel-iris-xe-80eu", name: "Intel Iris Xe Graphics 80EU", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 2, tier: "D", tierScore: 1.3, score: 24, isDiscrete: false, architecture: "xe" },
  { id: "intel-iris-plus-g7", name: "Intel Iris Plus Graphics G7", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 2, tier: "D", tierScore: 1.1, score: 20, isDiscrete: false, architecture: "gen11" },
  { id: "intel-uhd-tgl", name: "Intel UHD Graphics (Tiger Lake GT1)", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 0.9, score: 16, isDiscrete: false, architecture: "gen12", isLaptop: true },
  { id: "intel-uhd-770", name: "Intel UHD Graphics 770", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 0.9, score: 16, isDiscrete: false, architecture: "gen12" },
  { id: "intel-uhd-750", name: "Intel UHD Graphics 750", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 0.8, score: 15, isDiscrete: false, architecture: "gen12" },
  { id: "intel-uhd-730", name: "Intel UHD Graphics 730", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 0.7, score: 14, isDiscrete: false, architecture: "gen12" },
  { id: "intel-uhd-630", name: "Intel UHD Graphics 630", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 0.6, score: 11, isDiscrete: false, architecture: "gen9" },
  { id: "intel-uhd-620", name: "Intel UHD Graphics 620", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 0.5, score: 9, isDiscrete: false, architecture: "gen9" },
  { id: "intel-hd-630", name: "Intel HD Graphics 630", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 0.5, score: 9, isDiscrete: false, architecture: "gen9" },
  { id: "intel-hd-530", name: "Intel HD Graphics 530", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 0.4, score: 8, isDiscrete: false, architecture: "gen9" },
  { id: "intel-hd-4600", name: "Intel HD Graphics 4600", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 0.3, score: 6, isDiscrete: false, architecture: "gen7" },
  { id: "intel-hd-4000", name: "Intel HD Graphics 4000", vendor: "Intel", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 0.2, score: 4, isDiscrete: false, architecture: "gen7" },

  // --- AMD Integrated GPUs ---
  { id: "amd-radeon-890m", name: "AMD Radeon 890M", vendor: "AMD", vram: "Shared Dynamic VRAM", vramGb: 4, tier: "B", tierScore: 2.8, score: 52, isDiscrete: false, architecture: "rdna3.5" },
  { id: "amd-radeon-880m", name: "AMD Radeon 880M", vendor: "AMD", vram: "Shared Dynamic VRAM", vramGb: 4, tier: "B", tierScore: 2.5, score: 46, isDiscrete: false, architecture: "rdna3.5" },
  { id: "amd-radeon-780m", name: "AMD Radeon 780M", vendor: "AMD", vram: "Shared Dynamic VRAM", vramGb: 2, tier: "C", tierScore: 2.1, score: 38, isDiscrete: false, architecture: "rdna3" },
  { id: "amd-radeon-760m", name: "AMD Radeon 760M", vendor: "AMD", vram: "Shared Dynamic VRAM", vramGb: 2, tier: "C", tierScore: 1.8, score: 33, isDiscrete: false, architecture: "rdna3" },
  { id: "amd-radeon-680m", name: "AMD Radeon 680M", vendor: "AMD", vram: "Shared Dynamic VRAM", vramGb: 2, tier: "C", tierScore: 1.7, score: 31, isDiscrete: false, architecture: "rdna2" },
  { id: "amd-radeon-660m", name: "AMD Radeon 660M", vendor: "AMD", vram: "Shared Dynamic VRAM", vramGb: 2, tier: "D", tierScore: 1.3, score: 25, isDiscrete: false, architecture: "rdna2" },
  { id: "amd-radeon-610m", name: "AMD Radeon 610M", vendor: "AMD", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 0.7, score: 14, isDiscrete: false, architecture: "rdna2" },
  { id: "amd-radeon-vega8", name: "AMD Radeon Vega 8", vendor: "AMD", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 1.0, score: 18, isDiscrete: false, architecture: "vega" },
  { id: "amd-radeon-vega7", name: "AMD Radeon Vega 7", vendor: "AMD", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 0.9, score: 16, isDiscrete: false, architecture: "vega" },
  { id: "amd-radeon-vega6", name: "AMD Radeon Vega 6", vendor: "AMD", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 0.8, score: 14, isDiscrete: false, architecture: "vega" },
  { id: "amd-radeon-vega3", name: "AMD Radeon Vega 3", vendor: "AMD", vram: "Shared Dynamic VRAM", vramGb: 1, tier: "D", tierScore: 0.5, score: 10, isDiscrete: false, architecture: "vega" },

  // --- Apple Silicon GPUs ---
  { id: "apple-m4-max", name: "Apple M4 Max GPU (40-Core)", vendor: "Apple", vram: "Unified Memory", vramGb: 48, tier: "S+", tierScore: 5.4, score: 96, isDiscrete: false, architecture: "apple-m4" },
  { id: "apple-m4-pro", name: "Apple M4 Pro GPU (20-Core)", vendor: "Apple", vram: "Unified Memory", vramGb: 24, tier: "S", tierScore: 4.5, score: 80, isDiscrete: false, architecture: "apple-m4" },
  { id: "apple-m4", name: "Apple M4 GPU (10-Core)", vendor: "Apple", vram: "Unified Memory", vramGb: 16, tier: "B", tierScore: 3.1, score: 55, isDiscrete: false, architecture: "apple-m4" },
  { id: "apple-m3-max", name: "Apple M3 Max GPU", vendor: "Apple", vram: "Unified Memory", vramGb: 36, tier: "S+", tierScore: 5.1, score: 92, isDiscrete: false, architecture: "apple-m3" },
  { id: "apple-m3-pro", name: "Apple M3 Pro GPU", vendor: "Apple", vram: "Unified Memory", vramGb: 18, tier: "A", tierScore: 3.9, score: 72, isDiscrete: false, architecture: "apple-m3" },
  { id: "apple-m3", name: "Apple M3 GPU", vendor: "Apple", vram: "Unified Memory", vramGb: 8, tier: "B", tierScore: 2.6, score: 48, isDiscrete: false, architecture: "apple-m3" },
  { id: "apple-m2-ultra", name: "Apple M2 Ultra GPU (76-Core)", vendor: "Apple", vram: "Unified Memory", vramGb: 64, tier: "S+", tierScore: 5.3, score: 95, isDiscrete: false, architecture: "apple-m2" },
  { id: "apple-m2-max", name: "Apple M2 Max GPU", vendor: "Apple", vram: "Unified Memory", vramGb: 32, tier: "S", tierScore: 4.7, score: 85, isDiscrete: false, architecture: "apple-m2" },
  { id: "apple-m2-pro", name: "Apple M2 Pro GPU", vendor: "Apple", vram: "Unified Memory", vramGb: 16, tier: "A", tierScore: 3.7, score: 68, isDiscrete: false, architecture: "apple-m2" },
  { id: "apple-m2", name: "Apple M2 GPU", vendor: "Apple", vram: "Unified Memory", vramGb: 8, tier: "B", tierScore: 2.4, score: 44, isDiscrete: false, architecture: "apple-m2" },
  { id: "apple-m1-ultra", name: "Apple M1 Ultra GPU (64-Core)", vendor: "Apple", vram: "Unified Memory", vramGb: 64, tier: "S+", tierScore: 5.0, score: 90, isDiscrete: false, architecture: "apple-m1" },
  { id: "apple-m1-max", name: "Apple M1 Max GPU", vendor: "Apple", vram: "Unified Memory", vramGb: 32, tier: "S", tierScore: 4.4, score: 80, isDiscrete: false, architecture: "apple-m1" },
  { id: "apple-m1-pro", name: "Apple M1 Pro GPU", vendor: "Apple", vram: "Unified Memory", vramGb: 16, tier: "B", tierScore: 3.4, score: 62, isDiscrete: false, architecture: "apple-m1" },
  { id: "apple-m1", name: "Apple M1 GPU", vendor: "Apple", vram: "Unified Memory", vramGb: 8, tier: "C", tierScore: 2.0, score: 38, isDiscrete: false, architecture: "apple-m1" },

  // --- Handhelds & APUs ---
  { id: "steam-deck-apu", name: "Steam Deck Custom Aerith APU", vendor: "AMD", vram: "Shared Dynamic VRAM", vramGb: 4, tier: "C", tierScore: 1.8, score: 34, isDiscrete: false, architecture: "rdna2" },
  { id: "rog-ally-z1-extreme", name: "AMD Ryzen Z1 Extreme APU", vendor: "AMD", vram: "Shared Dynamic VRAM", vramGb: 4, tier: "C", tierScore: 2.1, score: 39, isDiscrete: false, architecture: "rdna3" },
  { id: "rog-ally-z1", name: "AMD Ryzen Z1 APU", vendor: "AMD", vram: "Shared Dynamic VRAM", vramGb: 4, tier: "D", tierScore: 1.4, score: 26, isDiscrete: false, architecture: "rdna3" },
  { id: "qualcomm-adreno-x1-85", name: "Qualcomm Adreno X1-85 (Snapdragon X Elite)", vendor: "Qualcomm", vram: "Shared Dynamic VRAM", vramGb: 4, tier: "C", tierScore: 1.9, score: 36, isDiscrete: false, architecture: "adreno" },
  { id: "qualcomm-adreno-x1-45", name: "Qualcomm Adreno X1-45 (Snapdragon X Plus)", vendor: "Qualcomm", vram: "Shared Dynamic VRAM", vramGb: 4, tier: "D", tierScore: 1.4, score: 28, isDiscrete: false, architecture: "adreno" },
];

// 🧠 Comprehensive CPU Database (170+ entries)
export const CPU_DATABASE: CpuSpec[] = [
  // --- Intel 14th Gen (Raptor Lake Refresh) ---
  { id: "i9-14900ks", name: "Intel Core i9-14900KS", vendor: "Intel", cores: 24, threads: 32, tier: "S+", score: 100, generation: "14th Gen" },
  { id: "i9-14900k", name: "Intel Core i9-14900K", vendor: "Intel", cores: 24, threads: 32, tier: "S+", score: 99, generation: "14th Gen" },
  { id: "i9-14900kf", name: "Intel Core i9-14900KF", vendor: "Intel", cores: 24, threads: 32, tier: "S+", score: 99, generation: "14th Gen" },
  { id: "i9-14900", name: "Intel Core i9-14900", vendor: "Intel", cores: 24, threads: 32, tier: "S+", score: 96, generation: "14th Gen" },
  { id: "i7-14700k", name: "Intel Core i7-14700K", vendor: "Intel", cores: 20, threads: 28, tier: "S+", score: 95, generation: "14th Gen" },
  { id: "i7-14700kf", name: "Intel Core i7-14700KF", vendor: "Intel", cores: 20, threads: 28, tier: "S+", score: 95, generation: "14th Gen" },
  { id: "i7-14700", name: "Intel Core i7-14700", vendor: "Intel", cores: 20, threads: 28, tier: "S", score: 92, generation: "14th Gen" },
  { id: "i5-14600k", name: "Intel Core i5-14600K", vendor: "Intel", cores: 14, threads: 20, tier: "S", score: 89, generation: "14th Gen" },
  { id: "i5-14600kf", name: "Intel Core i5-14600KF", vendor: "Intel", cores: 14, threads: 20, tier: "S", score: 89, generation: "14th Gen" },
  { id: "i5-14500", name: "Intel Core i5-14500", vendor: "Intel", cores: 14, threads: 20, tier: "A", score: 83, generation: "14th Gen" },
  { id: "i5-14400f", name: "Intel Core i5-14400F", vendor: "Intel", cores: 10, threads: 16, tier: "A", score: 79, generation: "14th Gen" },
  { id: "i5-14400", name: "Intel Core i5-14400", vendor: "Intel", cores: 10, threads: 16, tier: "A", score: 79, generation: "14th Gen" },
  { id: "i3-14100f", name: "Intel Core i3-14100F", vendor: "Intel", cores: 4, threads: 8, tier: "B", score: 63, generation: "14th Gen" },
  { id: "i3-14100", name: "Intel Core i3-14100", vendor: "Intel", cores: 4, threads: 8, tier: "B", score: 63, generation: "14th Gen" },
  { id: "i9-14900hx", name: "Intel Core i9-14900HX", vendor: "Intel", cores: 24, threads: 32, tier: "S+", score: 96, generation: "14th Gen Mobile", isLaptop: true },
  { id: "i7-14700hx", name: "Intel Core i7-14700HX", vendor: "Intel", cores: 20, threads: 28, tier: "S", score: 90, generation: "14th Gen Mobile", isLaptop: true },
  { id: "i5-14500hx", name: "Intel Core i5-14500HX", vendor: "Intel", cores: 14, threads: 20, tier: "A", score: 82, generation: "14th Gen Mobile", isLaptop: true },

  // --- Intel Core Ultra (Arrow Lake / Meteor Lake) ---
  { id: "ultra-9-285k", name: "Intel Core Ultra 9 285K", vendor: "Intel", cores: 24, threads: 24, tier: "S+", score: 98, generation: "Core Ultra 200S" },
  { id: "ultra-7-265k", name: "Intel Core Ultra 7 265K", vendor: "Intel", cores: 20, threads: 20, tier: "S+", score: 94, generation: "Core Ultra 200S" },
  { id: "ultra-5-245k", name: "Intel Core Ultra 5 245K", vendor: "Intel", cores: 14, threads: 14, tier: "S", score: 86, generation: "Core Ultra 200S" },
  { id: "ultra-9-185h", name: "Intel Core Ultra 9 185H", vendor: "Intel", cores: 16, threads: 22, tier: "S", score: 88, generation: "Core Ultra Series 1", isLaptop: true },
  { id: "ultra-7-165h", name: "Intel Core Ultra 7 165H", vendor: "Intel", cores: 16, threads: 22, tier: "S", score: 85, generation: "Core Ultra Series 1", isLaptop: true },
  { id: "ultra-7-155h", name: "Intel Core Ultra 7 155H", vendor: "Intel", cores: 16, threads: 22, tier: "A", score: 83, generation: "Core Ultra Series 1", isLaptop: true },
  { id: "ultra-5-135h", name: "Intel Core Ultra 5 135H", vendor: "Intel", cores: 14, threads: 18, tier: "A", score: 77, generation: "Core Ultra Series 1", isLaptop: true },
  { id: "ultra-5-125h", name: "Intel Core Ultra 5 125H", vendor: "Intel", cores: 14, threads: 18, tier: "A", score: 74, generation: "Core Ultra Series 1", isLaptop: true },

  // --- Intel 13th Gen (Raptor Lake) ---
  { id: "i9-13900ks", name: "Intel Core i9-13900KS", vendor: "Intel", cores: 24, threads: 32, tier: "S+", score: 98, generation: "13th Gen" },
  { id: "i9-13900k", name: "Intel Core i9-13900K", vendor: "Intel", cores: 24, threads: 32, tier: "S+", score: 97, generation: "13th Gen" },
  { id: "i9-13900kf", name: "Intel Core i9-13900KF", vendor: "Intel", cores: 24, threads: 32, tier: "S+", score: 97, generation: "13th Gen" },
  { id: "i7-13700k", name: "Intel Core i7-13700K", vendor: "Intel", cores: 16, threads: 24, tier: "S+", score: 93, generation: "13th Gen" },
  { id: "i7-13700kf", name: "Intel Core i7-13700KF", vendor: "Intel", cores: 16, threads: 24, tier: "S+", score: 93, generation: "13th Gen" },
  { id: "i7-13700", name: "Intel Core i7-13700", vendor: "Intel", cores: 16, threads: 24, tier: "S", score: 89, generation: "13th Gen" },
  { id: "i5-13600k", name: "Intel Core i5-13600K", vendor: "Intel", cores: 14, threads: 20, tier: "S", score: 87, generation: "13th Gen" },
  { id: "i5-13600kf", name: "Intel Core i5-13600KF", vendor: "Intel", cores: 14, threads: 20, tier: "S", score: 87, generation: "13th Gen" },
  { id: "i5-13500", name: "Intel Core i5-13500", vendor: "Intel", cores: 14, threads: 20, tier: "A", score: 81, generation: "13th Gen" },
  { id: "i5-13400f", name: "Intel Core i5-13400F", vendor: "Intel", cores: 10, threads: 16, tier: "A", score: 77, generation: "13th Gen" },
  { id: "i5-13400", name: "Intel Core i5-13400", vendor: "Intel", cores: 10, threads: 16, tier: "A", score: 77, generation: "13th Gen" },
  { id: "i3-13100f", name: "Intel Core i3-13100F", vendor: "Intel", cores: 4, threads: 8, tier: "B", score: 60, generation: "13th Gen" },
  { id: "i3-13100", name: "Intel Core i3-13100", vendor: "Intel", cores: 4, threads: 8, tier: "B", score: 60, generation: "13th Gen" },
  { id: "i9-13980hx", name: "Intel Core i9-13980HX", vendor: "Intel", cores: 24, threads: 32, tier: "S+", score: 94, generation: "13th Gen Mobile", isLaptop: true },
  { id: "i9-13900hx", name: "Intel Core i9-13900HX", vendor: "Intel", cores: 24, threads: 32, tier: "S+", score: 92, generation: "13th Gen Mobile", isLaptop: true },
  { id: "i7-13700hx", name: "Intel Core i7-13700HX", vendor: "Intel", cores: 16, threads: 24, tier: "S", score: 86, generation: "13th Gen Mobile", isLaptop: true },
  { id: "i7-13650hx", name: "Intel Core i7-13650HX", vendor: "Intel", cores: 14, threads: 20, tier: "S", score: 84, generation: "13th Gen Mobile", isLaptop: true },
  { id: "i7-13620h", name: "Intel Core i7-13620H", vendor: "Intel", cores: 10, threads: 16, tier: "A", score: 78, generation: "13th Gen Mobile", isLaptop: true },
  { id: "i5-13500h", name: "Intel Core i5-13500H", vendor: "Intel", cores: 12, threads: 16, tier: "A", score: 76, generation: "13th Gen Mobile", isLaptop: true },
  { id: "i5-13420h", name: "Intel Core i5-13420H", vendor: "Intel", cores: 8, threads: 12, tier: "B", score: 72, generation: "13th Gen Mobile", isLaptop: true },

  // --- Intel 12th Gen (Alder Lake) ---
  { id: "i9-12900ks", name: "Intel Core i9-12900KS", vendor: "Intel", cores: 16, threads: 24, tier: "S+", score: 92, generation: "12th Gen" },
  { id: "i9-12900k", name: "Intel Core i9-12900K", vendor: "Intel", cores: 16, threads: 24, tier: "S", score: 90, generation: "12th Gen" },
  { id: "i9-12900kf", name: "Intel Core i9-12900KF", vendor: "Intel", cores: 16, threads: 24, tier: "S", score: 90, generation: "12th Gen" },
  { id: "i7-12700k", name: "Intel Core i7-12700K", vendor: "Intel", cores: 12, threads: 20, tier: "S", score: 86, generation: "12th Gen" },
  { id: "i7-12700kf", name: "Intel Core i7-12700KF", vendor: "Intel", cores: 12, threads: 20, tier: "S", score: 86, generation: "12th Gen" },
  { id: "i7-12700", name: "Intel Core i7-12700", vendor: "Intel", cores: 12, threads: 20, tier: "A", score: 82, generation: "12th Gen" },
  { id: "i5-12600k", name: "Intel Core i5-12600K", vendor: "Intel", cores: 10, threads: 16, tier: "A", score: 81, generation: "12th Gen" },
  { id: "i5-12600kf", name: "Intel Core i5-12600KF", vendor: "Intel", cores: 10, threads: 16, tier: "A", score: 81, generation: "12th Gen" },
  { id: "i5-12500", name: "Intel Core i5-12500", vendor: "Intel", cores: 6, threads: 12, tier: "A", score: 75, generation: "12th Gen" },
  { id: "i5-12400", name: "Intel Core i5-12400", vendor: "Intel", cores: 6, threads: 12, tier: "A", score: 73, generation: "12th Gen" },
  { id: "i5-12400f", name: "Intel Core i5-12400F", vendor: "Intel", cores: 6, threads: 12, tier: "A", score: 73, generation: "12th Gen" },
  { id: "i3-12100", name: "Intel Core i3-12100", vendor: "Intel", cores: 4, threads: 8, tier: "B", score: 58, generation: "12th Gen" },
  { id: "i3-12100f", name: "Intel Core i3-12100F", vendor: "Intel", cores: 4, threads: 8, tier: "B", score: 58, generation: "12th Gen" },
  { id: "i9-12900h", name: "Intel Core i9-12900H", vendor: "Intel", cores: 14, threads: 20, tier: "S", score: 85, generation: "12th Gen Mobile", isLaptop: true },
  { id: "i7-12700h", name: "Intel Core i7-12700H", vendor: "Intel", cores: 14, threads: 20, tier: "A", score: 82, generation: "12th Gen Mobile", isLaptop: true },
  { id: "i5-12500h", name: "Intel Core i5-12500H", vendor: "Intel", cores: 12, threads: 16, tier: "A", score: 74, generation: "12th Gen Mobile", isLaptop: true },
  { id: "i5-12450h", name: "Intel Core i5-12450H", vendor: "Intel", cores: 8, threads: 12, tier: "B", score: 68, generation: "12th Gen Mobile", isLaptop: true },

  // --- Intel 11th Gen (Rocket Lake / Tiger Lake) ---
  { id: "i9-11900k", name: "Intel Core i9-11900K", vendor: "Intel", cores: 8, threads: 16, tier: "A", score: 80, generation: "11th Gen" },
  { id: "i7-11700k", name: "Intel Core i7-11700K", vendor: "Intel", cores: 8, threads: 16, tier: "A", score: 76, generation: "11th Gen" },
  { id: "i7-11700", name: "Intel Core i7-11700", vendor: "Intel", cores: 8, threads: 16, tier: "A", score: 74, generation: "11th Gen" },
  { id: "i5-11600k", name: "Intel Core i5-11600K", vendor: "Intel", cores: 6, threads: 12, tier: "B", score: 70, generation: "11th Gen" },
  { id: "i5-11500", name: "Intel Core i5-11500", vendor: "Intel", cores: 6, threads: 12, tier: "B", score: 68, generation: "11th Gen" },
  { id: "i5-11400f", name: "Intel Core i5-11400F", vendor: "Intel", cores: 6, threads: 12, tier: "B", score: 67, generation: "11th Gen" },
  { id: "i5-11400", name: "Intel Core i5-11400", vendor: "Intel", cores: 6, threads: 12, tier: "B", score: 67, generation: "11th Gen" },
  { id: "i5-11400h", name: "Intel Core i5-11400H", vendor: "Intel", cores: 6, threads: 12, tier: "B", score: 68, generation: "11th Gen Mobile", isLaptop: true },
  { id: "i7-11800h", name: "Intel Core i7-11800H", vendor: "Intel", cores: 8, threads: 16, tier: "A", score: 76, generation: "11th Gen Mobile", isLaptop: true },
  { id: "i9-11900h", name: "Intel Core i9-11900H", vendor: "Intel", cores: 8, threads: 16, tier: "A", score: 79, generation: "11th Gen Mobile", isLaptop: true },
  { id: "i7-11370h", name: "Intel Core i7-11370H", vendor: "Intel", cores: 4, threads: 8, tier: "B", score: 63, generation: "11th Gen Mobile", isLaptop: true },
  { id: "i5-11300h", name: "Intel Core i5-11300H", vendor: "Intel", cores: 4, threads: 8, tier: "B", score: 60, generation: "11th Gen Mobile", isLaptop: true },
  { id: "i5-1135g7", name: "Intel Core i5-1135G7", vendor: "Intel", cores: 4, threads: 8, tier: "C", score: 48, generation: "11th Gen Mobile", isLaptop: true },
  { id: "i7-1165g7", name: "Intel Core i7-1165G7", vendor: "Intel", cores: 4, threads: 8, tier: "C", score: 52, generation: "11th Gen Mobile", isLaptop: true },

  // --- Intel 10th Gen & Older ---
  { id: "i9-10900k", name: "Intel Core i9-10900K", vendor: "Intel", cores: 10, threads: 20, tier: "A", score: 78, generation: "10th Gen" },
  { id: "i7-10700k", name: "Intel Core i7-10700K", vendor: "Intel", cores: 8, threads: 16, tier: "A", score: 73, generation: "10th Gen" },
  { id: "i7-10700", name: "Intel Core i7-10700", vendor: "Intel", cores: 8, threads: 16, tier: "B", score: 70, generation: "10th Gen" },
  { id: "i5-10600k", name: "Intel Core i5-10600K", vendor: "Intel", cores: 6, threads: 12, tier: "B", score: 65, generation: "10th Gen" },
  { id: "i5-10400f", name: "Intel Core i5-10400F", vendor: "Intel", cores: 6, threads: 12, tier: "B", score: 60, generation: "10th Gen" },
  { id: "i5-10400", name: "Intel Core i5-10400", vendor: "Intel", cores: 6, threads: 12, tier: "B", score: 60, generation: "10th Gen" },
  { id: "i3-10100f", name: "Intel Core i3-10100F", vendor: "Intel", cores: 4, threads: 8, tier: "C", score: 48, generation: "10th Gen" },
  { id: "i3-10100", name: "Intel Core i3-10100", vendor: "Intel", cores: 4, threads: 8, tier: "C", score: 48, generation: "10th Gen" },
  { id: "i7-10750h", name: "Intel Core i7-10750H", vendor: "Intel", cores: 6, threads: 12, tier: "B", score: 62, generation: "10th Gen Mobile", isLaptop: true },
  { id: "i5-10300h", name: "Intel Core i5-10300H", vendor: "Intel", cores: 4, threads: 8, tier: "C", score: 50, generation: "10th Gen Mobile", isLaptop: true },

  { id: "i9-9900k", name: "Intel Core i9-9900K", vendor: "Intel", cores: 8, threads: 16, tier: "A", score: 74, generation: "9th Gen" },
  { id: "i7-9700k", name: "Intel Core i7-9700K", vendor: "Intel", cores: 8, threads: 8, tier: "B", score: 65, generation: "9th Gen" },
  { id: "i5-9600k", name: "Intel Core i5-9600K", vendor: "Intel", cores: 6, threads: 6, tier: "C", score: 56, generation: "9th Gen" },
  { id: "i5-9400f", name: "Intel Core i5-9400F", vendor: "Intel", cores: 6, threads: 6, tier: "C", score: 52, generation: "9th Gen" },
  { id: "i3-9100f", name: "Intel Core i3-9100F", vendor: "Intel", cores: 4, threads: 4, tier: "D", score: 40, generation: "9th Gen" },
  { id: "i7-9750h", name: "Intel Core i7-9750H", vendor: "Intel", cores: 6, threads: 12, tier: "C", score: 55, generation: "9th Gen Mobile", isLaptop: true },

  { id: "i7-8700k", name: "Intel Core i7-8700K", vendor: "Intel", cores: 6, threads: 12, tier: "B", score: 62, generation: "8th Gen" },
  { id: "i7-8700", name: "Intel Core i7-8700", vendor: "Intel", cores: 6, threads: 12, tier: "B", score: 59, generation: "8th Gen" },
  { id: "i5-8400", name: "Intel Core i5-8400", vendor: "Intel", cores: 6, threads: 6, tier: "C", score: 48, generation: "8th Gen" },
  { id: "i7-8750h", name: "Intel Core i7-8750H", vendor: "Intel", cores: 6, threads: 12, tier: "C", score: 52, generation: "8th Gen Mobile", isLaptop: true },
  { id: "i5-8250u", name: "Intel Core i5-8250U", vendor: "Intel", cores: 4, threads: 8, tier: "D", score: 38, generation: "8th Gen Mobile", isLaptop: true },

  { id: "i7-7700k", name: "Intel Core i7-7700K", vendor: "Intel", cores: 4, threads: 8, tier: "C", score: 46, generation: "7th Gen" },
  { id: "i5-7500", name: "Intel Core i5-7500", vendor: "Intel", cores: 4, threads: 4, tier: "D", score: 36, generation: "7th Gen" },
  { id: "i7-6700k", name: "Intel Core i7-6700K", vendor: "Intel", cores: 4, threads: 8, tier: "C", score: 44, generation: "6th Gen" },
  { id: "i5-6500", name: "Intel Core i5-6500", vendor: "Intel", cores: 4, threads: 4, tier: "D", score: 33, generation: "6th Gen" },
  { id: "i7-4790k", name: "Intel Core i7-4790K", vendor: "Intel", cores: 4, threads: 8, tier: "D", score: 40, generation: "4th Gen (Haswell)" },
  { id: "i5-4590", name: "Intel Core i5-4590", vendor: "Intel", cores: 4, threads: 4, tier: "D", score: 30, generation: "4th Gen" },
  { id: "i7-3770k", name: "Intel Core i7-3770K", vendor: "Intel", cores: 4, threads: 8, tier: "D", score: 35, generation: "3rd Gen" },
  { id: "i7-2600k", name: "Intel Core i7-2600K", vendor: "Intel", cores: 4, threads: 8, tier: "D", score: 30, generation: "2nd Gen" },

  // --- AMD Ryzen 9000 & 7000 Series (Zen 5 / Zen 4) ---
  { id: "ryzen-9-9950x", name: "AMD Ryzen 9 9950X", vendor: "AMD", cores: 16, threads: 32, tier: "S+", score: 100, generation: "Zen 5" },
  { id: "ryzen-9-9900x", name: "AMD Ryzen 9 9900X", vendor: "AMD", cores: 12, threads: 24, tier: "S+", score: 96, generation: "Zen 5" },
  { id: "ryzen-7-9700x", name: "AMD Ryzen 7 9700X", vendor: "AMD", cores: 8, threads: 16, tier: "S+", score: 92, generation: "Zen 5" },
  { id: "ryzen-5-9600x", name: "AMD Ryzen 5 9600X", vendor: "AMD", cores: 6, threads: 12, tier: "S", score: 86, generation: "Zen 5" },

  { id: "ryzen-7-7800x3d", name: "AMD Ryzen 7 7800X3D", vendor: "AMD", cores: 8, threads: 16, tier: "S+", score: 98, generation: "Zen 4 (3D V-Cache)" },
  { id: "ryzen-9-7950x3d", name: "AMD Ryzen 9 7950X3D", vendor: "AMD", cores: 16, threads: 32, tier: "S+", score: 98, generation: "Zen 4" },
  { id: "ryzen-9-7950x", name: "AMD Ryzen 9 7950X", vendor: "AMD", cores: 16, threads: 32, tier: "S+", score: 97, generation: "Zen 4" },
  { id: "ryzen-9-7900x3d", name: "AMD Ryzen 9 7900X3D", vendor: "AMD", cores: 12, threads: 24, tier: "S+", score: 95, generation: "Zen 4" },
  { id: "ryzen-9-7900x", name: "AMD Ryzen 9 7900X", vendor: "AMD", cores: 12, threads: 24, tier: "S+", score: 94, generation: "Zen 4" },
  { id: "ryzen-9-7900", name: "AMD Ryzen 9 7900", vendor: "AMD", cores: 12, threads: 24, tier: "S", score: 90, generation: "Zen 4" },
  { id: "ryzen-7-7700x", name: "AMD Ryzen 7 7700X", vendor: "AMD", cores: 8, threads: 16, tier: "S", score: 88, generation: "Zen 4" },
  { id: "ryzen-7-7700", name: "AMD Ryzen 7 7700", vendor: "AMD", cores: 8, threads: 16, tier: "S", score: 85, generation: "Zen 4" },
  { id: "ryzen-5-7600x", name: "AMD Ryzen 5 7600X", vendor: "AMD", cores: 6, threads: 12, tier: "A", score: 82, generation: "Zen 4" },
  { id: "ryzen-5-7600", name: "AMD Ryzen 5 7600", vendor: "AMD", cores: 6, threads: 12, tier: "A", score: 80, generation: "Zen 4" },
  { id: "ryzen-5-7500f", name: "AMD Ryzen 5 7500F", vendor: "AMD", cores: 6, threads: 12, tier: "A", score: 79, generation: "Zen 4" },
  { id: "ryzen-7-8700g", name: "AMD Ryzen 7 8700G", vendor: "AMD", cores: 8, threads: 16, tier: "A", score: 82, generation: "Zen 4 (Phoenix)" },
  { id: "ryzen-5-8600g", name: "AMD Ryzen 5 8600G", vendor: "AMD", cores: 6, threads: 12, tier: "A", score: 76, generation: "Zen 4 (Phoenix)" },
  { id: "ryzen-9-7945hx", name: "AMD Ryzen 9 7945HX", vendor: "AMD", cores: 16, threads: 32, tier: "S+", score: 95, generation: "Zen 4 Mobile", isLaptop: true },
  { id: "ryzen-7-7840hs", name: "AMD Ryzen 7 7840HS", vendor: "AMD", cores: 8, threads: 16, tier: "A", score: 82, generation: "Zen 4 Mobile", isLaptop: true },
  { id: "ryzen-7-7735hs", name: "AMD Ryzen 7 7735HS", vendor: "AMD", cores: 8, threads: 16, tier: "A", score: 77, generation: "Zen 3+ Mobile", isLaptop: true },
  { id: "ryzen-5-7640hs", name: "AMD Ryzen 5 7640HS", vendor: "AMD", cores: 6, threads: 12, tier: "A", score: 76, generation: "Zen 4 Mobile", isLaptop: true },
  { id: "ryzen-5-7535hs", name: "AMD Ryzen 5 7535HS", vendor: "AMD", cores: 6, threads: 12, tier: "A", score: 70, generation: "Zen 3+ Mobile", isLaptop: true },
  { id: "ryzen-7-6800h", name: "AMD Ryzen 7 6800H", vendor: "AMD", cores: 8, threads: 16, tier: "A", score: 76, generation: "Zen 3+ Mobile", isLaptop: true },
  { id: "ryzen-5-6600h", name: "AMD Ryzen 5 6600H", vendor: "AMD", cores: 6, threads: 12, tier: "B", score: 68, generation: "Zen 3+ Mobile", isLaptop: true },

  // --- AMD Ryzen 5000 Series (Zen 3) ---
  { id: "ryzen-9-5950x", name: "AMD Ryzen 9 5950X", vendor: "AMD", cores: 16, threads: 32, tier: "S", score: 91, generation: "Zen 3" },
  { id: "ryzen-9-5900x", name: "AMD Ryzen 9 5900X", vendor: "AMD", cores: 12, threads: 24, tier: "S", score: 88, generation: "Zen 3" },
  { id: "ryzen-7-5800x3d", name: "AMD Ryzen 7 5800X3D", vendor: "AMD", cores: 8, threads: 16, tier: "S", score: 89, generation: "Zen 3 (3D V-Cache)" },
  { id: "ryzen-7-5700x3d", name: "AMD Ryzen 7 5700X3D", vendor: "AMD", cores: 8, threads: 16, tier: "S", score: 84, generation: "Zen 3 (3D V-Cache)" },
  { id: "ryzen-7-5800x", name: "AMD Ryzen 7 5800X", vendor: "AMD", cores: 8, threads: 16, tier: "A", score: 81, generation: "Zen 3" },
  { id: "ryzen-7-5700x", name: "AMD Ryzen 7 5700X", vendor: "AMD", cores: 8, threads: 16, tier: "A", score: 78, generation: "Zen 3" },
  { id: "ryzen-7-5700g", name: "AMD Ryzen 7 5700G", vendor: "AMD", cores: 8, threads: 16, tier: "A", score: 75, generation: "Zen 3" },
  { id: "ryzen-5-5600x", name: "AMD Ryzen 5 5600X", vendor: "AMD", cores: 6, threads: 12, tier: "A", score: 74, generation: "Zen 3" },
  { id: "ryzen-5-5600", name: "AMD Ryzen 5 5600", vendor: "AMD", cores: 6, threads: 12, tier: "A", score: 72, generation: "Zen 3" },
  { id: "ryzen-5-5600g", name: "AMD Ryzen 5 5600G", vendor: "AMD", cores: 6, threads: 12, tier: "B", score: 68, generation: "Zen 3" },
  { id: "ryzen-5-5500", name: "AMD Ryzen 5 5500", vendor: "AMD", cores: 6, threads: 12, tier: "B", score: 63, generation: "Zen 3" },
  { id: "ryzen-3-5300g", name: "AMD Ryzen 3 5300G", vendor: "AMD", cores: 4, threads: 8, tier: "C", score: 50, generation: "Zen 3" },
  { id: "ryzen-7-5800h", name: "AMD Ryzen 7 5800H", vendor: "AMD", cores: 8, threads: 16, tier: "A", score: 75, generation: "Zen 3 Mobile", isLaptop: true },
  { id: "ryzen-5-5600h", name: "AMD Ryzen 5 5600H", vendor: "AMD", cores: 6, threads: 12, tier: "B", score: 67, generation: "Zen 3 Mobile", isLaptop: true },
  { id: "ryzen-7-5700u", name: "AMD Ryzen 7 5700U", vendor: "AMD", cores: 8, threads: 16, tier: "B", score: 64, generation: "Zen 2 Mobile", isLaptop: true },
  { id: "ryzen-5-5500u", name: "AMD Ryzen 5 5500U", vendor: "AMD", cores: 6, threads: 12, tier: "C", score: 55, generation: "Zen 2 Mobile", isLaptop: true },
  { id: "ryzen-3-5300u", name: "AMD Ryzen 3 5300U", vendor: "AMD", cores: 4, threads: 8, tier: "C", score: 46, generation: "Zen 2 Mobile", isLaptop: true },

  // --- AMD Ryzen 3000 & 2000 & 1000 Series ---
  { id: "ryzen-9-3950x", name: "AMD Ryzen 9 3950X", vendor: "AMD", cores: 16, threads: 32, tier: "A", score: 82, generation: "Zen 2" },
  { id: "ryzen-9-3900x", name: "AMD Ryzen 9 3900X", vendor: "AMD", cores: 12, threads: 24, tier: "A", score: 76, generation: "Zen 2" },
  { id: "ryzen-7-3800x", name: "AMD Ryzen 7 3800X", vendor: "AMD", cores: 8, threads: 16, tier: "B", score: 70, generation: "Zen 2" },
  { id: "ryzen-7-3700x", name: "AMD Ryzen 7 3700X", vendor: "AMD", cores: 8, threads: 16, tier: "B", score: 68, generation: "Zen 2" },
  { id: "ryzen-5-3600x", name: "AMD Ryzen 5 3600X", vendor: "AMD", cores: 6, threads: 12, tier: "B", score: 62, generation: "Zen 2" },
  { id: "ryzen-5-3600", name: "AMD Ryzen 5 3600", vendor: "AMD", cores: 6, threads: 12, tier: "B", score: 60, generation: "Zen 2" },
  { id: "ryzen-5-3500x", name: "AMD Ryzen 5 3500X", vendor: "AMD", cores: 6, threads: 6, tier: "C", score: 52, generation: "Zen 2" },
  { id: "ryzen-3-3300x", name: "AMD Ryzen 3 3300X", vendor: "AMD", cores: 4, threads: 8, tier: "C", score: 50, generation: "Zen 2" },
  { id: "ryzen-3-3100", name: "AMD Ryzen 3 3100", vendor: "AMD", cores: 4, threads: 8, tier: "C", score: 45, generation: "Zen 2" },
  { id: "ryzen-5-3400g", name: "AMD Ryzen 5 3400G", vendor: "AMD", cores: 4, threads: 8, tier: "C", score: 44, generation: "Zen+" },
  { id: "ryzen-3-3200g", name: "AMD Ryzen 3 3200G", vendor: "AMD", cores: 4, threads: 4, tier: "D", score: 36, generation: "Zen+" },
  { id: "ryzen-7-4800h", name: "AMD Ryzen 7 4800H", vendor: "AMD", cores: 8, threads: 16, tier: "B", score: 66, generation: "Zen 2 Mobile", isLaptop: true },
  { id: "ryzen-5-4600h", name: "AMD Ryzen 5 4600H", vendor: "AMD", cores: 6, threads: 12, tier: "C", score: 58, generation: "Zen 2 Mobile", isLaptop: true },
  { id: "ryzen-7-2700x", name: "AMD Ryzen 7 2700X", vendor: "AMD", cores: 8, threads: 16, tier: "C", score: 55, generation: "Zen+" },
  { id: "ryzen-5-2600x", name: "AMD Ryzen 5 2600X", vendor: "AMD", cores: 6, threads: 12, tier: "C", score: 50, generation: "Zen+" },
  { id: "ryzen-5-2600", name: "AMD Ryzen 5 2600", vendor: "AMD", cores: 6, threads: 12, tier: "C", score: 48, generation: "Zen+" },
  { id: "ryzen-5-1600", name: "AMD Ryzen 5 1600", vendor: "AMD", cores: 6, threads: 12, tier: "D", score: 42, generation: "Zen" },

  // --- Apple Silicon CPUs ---
  { id: "apple-m4-max-cpu", name: "Apple M4 Max (16-Core)", vendor: "Apple", cores: 16, threads: 16, tier: "S+", score: 100, generation: "Apple Silicon" },
  { id: "apple-m4-pro-cpu", name: "Apple M4 Pro (14-Core)", vendor: "Apple", cores: 14, threads: 14, tier: "S+", score: 94, generation: "Apple Silicon" },
  { id: "apple-m4-cpu", name: "Apple M4 (10-Core)", vendor: "Apple", cores: 10, threads: 10, tier: "S", score: 86, generation: "Apple Silicon" },
  { id: "apple-m3-max-cpu", name: "Apple M3 Max (16-Core)", vendor: "Apple", cores: 16, threads: 16, tier: "S+", score: 96, generation: "Apple Silicon" },
  { id: "apple-m3-pro-cpu", name: "Apple M3 Pro (12-Core)", vendor: "Apple", cores: 12, threads: 12, tier: "S", score: 88, generation: "Apple Silicon" },
  { id: "apple-m3-cpu", name: "Apple M3 (8-Core)", vendor: "Apple", cores: 8, threads: 8, tier: "A", score: 78, generation: "Apple Silicon" },
  { id: "apple-m2-ultra-cpu", name: "Apple M2 Ultra (24-Core)", vendor: "Apple", cores: 24, threads: 24, tier: "S+", score: 96, generation: "Apple Silicon" },
  { id: "apple-m2-max-cpu", name: "Apple M2 Max (12-Core)", vendor: "Apple", cores: 12, threads: 12, tier: "S", score: 86, generation: "Apple Silicon" },
  { id: "apple-m2-pro-cpu", name: "Apple M2 Pro (12-Core)", vendor: "Apple", cores: 12, threads: 12, tier: "A", score: 82, generation: "Apple Silicon" },
  { id: "apple-m2-cpu", name: "Apple M2 (8-Core)", vendor: "Apple", cores: 8, threads: 8, tier: "B", score: 72, generation: "Apple Silicon" },
  { id: "apple-m1-ultra-cpu", name: "Apple M1 Ultra (20-Core)", vendor: "Apple", cores: 20, threads: 20, tier: "S+", score: 92, generation: "Apple Silicon" },
  { id: "apple-m1-max-cpu", name: "Apple M1 Max (10-Core)", vendor: "Apple", cores: 10, threads: 10, tier: "A", score: 80, generation: "Apple Silicon" },
  { id: "apple-m1-pro-cpu", name: "Apple M1 Pro (10-Core)", vendor: "Apple", cores: 10, threads: 10, tier: "A", score: 76, generation: "Apple Silicon" },
  { id: "apple-m1-cpu", name: "Apple M1 (8-Core)", vendor: "Apple", cores: 8, threads: 8, tier: "B", score: 64, generation: "Apple Silicon" },

  // --- Snapdragon X Series ---
  { id: "snapdragon-x-elite", name: "Snapdragon X Elite (12-Core)", vendor: "Qualcomm", cores: 12, threads: 12, tier: "A", score: 80, generation: "Oryon" },
  { id: "snapdragon-x-plus", name: "Snapdragon X Plus (10-Core)", vendor: "Qualcomm", cores: 10, threads: 10, tier: "B", score: 70, generation: "Oryon" },
];

function normalizeHardwareQuery(str: string): string {
  return str
    .toLowerCase()
    .replace(/\(r\)|\(tm\)|\(c\)|\bcorp\b|\binc\b|\bcorporation\b|\bprocessor\b|\bgraphics\b|\bdevice\b/gi, " ")
    .replace(/[^a-z0-9]/g, "");
}

export function findGpuByQuery(
  query: string,
  options?: { isLaptop?: boolean; benchScore?: number }
): GpuSpec | null {
  if (!query) return null;
  const rawLower = query.toLowerCase();
  const q = normalizeHardwareQuery(query);
  if (!q) return null;

  // 0. Direct PCI Device ID / Chip Codename match
  for (const gpu of GPU_DATABASE) {
    if (gpu.pciDeviceIds) {
      for (const pciId of gpu.pciDeviceIds) {
        if (rawLower.includes(pciId.toLowerCase()) || q.includes(pciId.toLowerCase())) {
          return gpu;
        }
      }
    }
  }

  // Check chip codenames like GA107, GA106, AD107, TU117, etc.
  for (const gpu of GPU_DATABASE) {
    if (gpu.chipCodename) {
      const code = gpu.chipCodename.toLowerCase();
      if (rawLower.includes(code) || q.includes(code)) {
        if (options?.isLaptop !== undefined) {
          if (Boolean(gpu.isLaptop) === options.isLaptop) {
            return gpu;
          }
        } else {
          return gpu;
        }
      }
    }
  }

  // 0b. Intel Integrated GPU Codename Matches (Mesa / Linux / Windows Driver Strings)
  if (rawLower.includes("intel") || rawLower.includes("mesa") || rawLower.includes("uhd") || rawLower.includes("iris") || rawLower.includes("hd graphics")) {
    if (rawLower.includes("iris xe") || rawLower.includes("iris(r) xe") || rawLower.includes("irisxe")) {
      return GPU_DATABASE.find((g) => g.id === "intel-iris-xe") || null;
    }
    if (/\b(tgl|tiger\s*lake)\b/i.test(rawLower) || q.includes("tgl")) {
      return GPU_DATABASE.find((g) => g.id === "intel-uhd-tgl" || g.id === "intel-uhd-770") || null;
    }
    if (/\b(adl|alder\s*lake)\b/i.test(rawLower) || q.includes("adl")) {
      return GPU_DATABASE.find((g) => g.id === "intel-uhd-770" || g.id === "intel-uhd-730") || null;
    }
    if (/\b(cfl|coffee\s*lake|630)\b/i.test(rawLower) || q.includes("cfl") || q.includes("630")) {
      return GPU_DATABASE.find((g) => g.id === "intel-uhd-630") || null;
    }
    if (/\b(kbl|kaby\s*lake|hd 630)\b/i.test(rawLower) || q.includes("kbl")) {
      return GPU_DATABASE.find((g) => g.id === "intel-hd-630") || null;
    }
    if (/\b(skl|skylake|hd 530)\b/i.test(rawLower) || q.includes("skl")) {
      return GPU_DATABASE.find((g) => g.id === "intel-hd-530") || null;
    }
    if (rawLower.includes("uhd") || q.includes("uhd")) {
      return GPU_DATABASE.find((g) => g.id === "intel-uhd-tgl" || g.id === "intel-uhd-770" || g.id === "intel-uhd-630") || null;
    }
  }

  // 1. Direct ID or exact normalized name match
  for (const gpu of GPU_DATABASE) {
    const cleanId = gpu.id.replace(/-/g, "");
    const cleanName = normalizeHardwareQuery(gpu.name);
    if (q === cleanId || q === cleanName) {
      return gpu;
    }
  }

  // 2. Specific key matches with form-factor preference
  const matchingGpus: GpuSpec[] = [];
  for (const gpu of GPU_DATABASE) {
    const cleanName = normalizeHardwareQuery(gpu.name);
    const cleanId = gpu.id.replace(/-/g, "");
    if (cleanName.includes(q) || q.includes(cleanName) || q.includes(cleanId)) {
      matchingGpus.push(gpu);
    }
  }

  if (matchingGpus.length > 0) {
    if (options?.isLaptop !== undefined) {
      const formFactorMatch = matchingGpus.find((g) => Boolean(g.isLaptop) === options.isLaptop);
      if (formFactorMatch) return formFactorMatch;
    }
    if (options?.benchScore !== undefined) {
      matchingGpus.sort(
        (a, b) => Math.abs(a.score - (options.benchScore ?? 50)) - Math.abs(b.score - (options.benchScore ?? 50))
      );
    }
    return matchingGpus[0];
  }

  // 3. Substring matching for model numbers (e.g., "2050", "3060", "4070")
  for (const gpu of GPU_DATABASE) {
    const idKey = gpu.id.replace(/-/g, "");
    if (idKey.length >= 4 && q.includes(idKey)) {
      if (options?.isLaptop !== undefined && Boolean(gpu.isLaptop) !== options.isLaptop) {
        continue;
      }
      return gpu;
    }
  }

  return null;
}

export function findCpuByQuery(
  query: string,
  options?: { isLaptop?: boolean }
): CpuSpec | null {
  if (!query) return null;
  const rawLower = query.toLowerCase();
  const q = normalizeHardwareQuery(query);
  if (!q) return null;

  // Infer isLaptop from query itself if not explicitly passed
  const queryIsLaptop =
    options?.isLaptop ??
    (rawLower.includes("laptop") ||
      rawLower.includes("mobile") ||
      /\b(i\d-\d{4,5}[h|hx|hs|u|p|g\d])\b/i.test(query) ||
      /\b(\d{4,5}[h|hx|hs|u|p|g\d])\b/i.test(query) ||
      /\b(ryzen\s*\d\s*\d{4}[h|hx|hs|u])\b/i.test(query));

  // 1. Direct ID or exact normalized name match
  for (const cpu of CPU_DATABASE) {
    const cleanId = cpu.id.replace(/-/g, "");
    const cleanName = normalizeHardwareQuery(cpu.name);
    if (q === cleanId || q === cleanName) {
      return cpu;
    }
  }

  // 2. Substring match with form-factor filtering and longest matching string priority
  const matchingCpus: { cpu: CpuSpec; matchLength: number; formMatch: boolean }[] = [];
  for (const cpu of CPU_DATABASE) {
    const cleanName = normalizeHardwareQuery(cpu.name);
    const cleanId = cpu.id.replace(/-/g, "");

    let matched = false;
    let matchLen = 0;

    if (q === cleanId || q === cleanName) {
      matched = true;
      matchLen = Math.max(cleanId.length, cleanName.length) + 20;
    } else if (cleanName.includes(q)) {
      matched = true;
      matchLen = q.length;
    } else if (q.includes(cleanName)) {
      matched = true;
      matchLen = cleanName.length;
    } else if (q.includes(cleanId)) {
      matched = true;
      matchLen = cleanId.length;
    }

    if (matched) {
      const isCpuLaptop = Boolean(cpu.isLaptop);
      const isFormMatch =
        queryIsLaptop !== undefined ? (queryIsLaptop ? isCpuLaptop : !isCpuLaptop) : true;
      matchingCpus.push({ cpu, matchLength: matchLen, formMatch: isFormMatch });
    }
  }

  if (matchingCpus.length > 0) {
    matchingCpus.sort((a, b) => {
      if (a.formMatch !== b.formMatch) {
        return a.formMatch ? -1 : 1;
      }
      return b.matchLength - a.matchLength;
    });

    return matchingCpus[0].cpu;
  }

  // 3. Substring matching for model numbers (e.g. "14900k", "7800x3d", "12400f", "11400h")
  const modelMatches: { cpu: CpuSpec; len: number; formMatch: boolean }[] = [];
  for (const cpu of CPU_DATABASE) {
    const idKey = cpu.id.replace(/-/g, "");
    if (idKey.length >= 4 && q.includes(idKey)) {
      const isCpuLaptop = Boolean(cpu.isLaptop);
      const isFormMatch =
        queryIsLaptop !== undefined ? (queryIsLaptop ? isCpuLaptop : !isCpuLaptop) : true;
      modelMatches.push({ cpu, len: idKey.length, formMatch: isFormMatch });
    }
  }

  if (modelMatches.length > 0) {
    modelMatches.sort((a, b) => {
      if (a.formMatch !== b.formMatch) return a.formMatch ? -1 : 1;
      return b.len - a.len;
    });
    return modelMatches[0].cpu;
  }

  return null;
}

export function resolveBestGpu(
  input?:
    | string
    | {
        rawRenderer?: string;
        query?: string;
        isLaptop?: boolean;
        benchScore?: number;
        arch?: string;
      }
): GpuSpec {
  let query = "";
  let isLaptop: boolean | undefined = undefined;
  let benchScore = 50;
  let arch = "";

  if (typeof input === "string") {
    query = input;
  } else if (input && typeof input === "object") {
    query = input.rawRenderer || input.query || "";
    isLaptop = input.isLaptop;
    benchScore = input.benchScore ?? 50;
    arch = input.arch || "";
  }

  if (query) {
    const matched = findGpuByQuery(query, { isLaptop, benchScore });
    if (matched) return matched;
  }

  const qLower = (query || "").toLowerCase();

  // NVIDIA Family Resolution with Form Factor & Calibrated Score Brackets
  if (qLower.includes("nvidia") || qLower.includes("geforce") || arch.includes("ampere") || arch.includes("ada") || arch.includes("turing")) {
    const nvidiaGpus = GPU_DATABASE.filter((g) => g.vendor === "NVIDIA");
    const filtered = isLaptop !== undefined ? nvidiaGpus.filter((g) => Boolean(g.isLaptop) === isLaptop) : nvidiaGpus;

    if (arch.includes("ampere") || qLower.includes("ampere")) {
      const ampereGpus = filtered.filter((g) => g.architecture === "ampere");
      if (ampereGpus.length > 0) {
        ampereGpus.sort((a, b) => Math.abs(a.score - benchScore) - Math.abs(b.score - benchScore));
        return ampereGpus[0];
      }
    }

    if (arch.includes("ada") || qLower.includes("ada") || qLower.includes("rtx 40") || qLower.includes("rtx40")) {
      const adaGpus = filtered.filter((g) => g.architecture === "ada-lovelace");
      if (adaGpus.length > 0) {
        adaGpus.sort((a, b) => Math.abs(a.score - benchScore) - Math.abs(b.score - benchScore));
        return adaGpus[0];
      }
    }

    if (arch.includes("turing") || qLower.includes("turing") || qLower.includes("gtx 16") || qLower.includes("rtx 20")) {
      const turingGpus = filtered.filter((g) => g.architecture === "turing");
      if (turingGpus.length > 0) {
        turingGpus.sort((a, b) => Math.abs(a.score - benchScore) - Math.abs(b.score - benchScore));
        return turingGpus[0];
      }
    }

    // Generic NVIDIA fallback calibrated by form factor and benchmark score
    if (filtered.length > 0) {
      filtered.sort((a, b) => Math.abs(a.score - benchScore) - Math.abs(b.score - benchScore));
      return filtered[0];
    }
  }

  // AMD Family Resolution
  if (qLower.includes("amd") || qLower.includes("radeon")) {
    const amdGpus = GPU_DATABASE.filter((g) => g.vendor === "AMD");
    const filtered = isLaptop !== undefined ? amdGpus.filter((g) => Boolean(g.isLaptop) === isLaptop) : amdGpus;
    if (filtered.length > 0) {
      filtered.sort((a, b) => Math.abs(a.score - benchScore) - Math.abs(b.score - benchScore));
      return filtered[0];
    }
  }

  // Apple Family Resolution
  if (qLower.includes("apple") || qLower.includes("m1") || qLower.includes("m2") || qLower.includes("m3") || qLower.includes("m4")) {
    const appleGpus = GPU_DATABASE.filter((g) => g.vendor === "Apple");
    appleGpus.sort((a, b) => Math.abs(a.score - benchScore) - Math.abs(b.score - benchScore));
    return appleGpus[0] || GPU_DATABASE[0];
  }

  // Intel Family Resolution
  if (qLower.includes("intel") || qLower.includes("iris") || qLower.includes("arc")) {
    const intelGpus = GPU_DATABASE.filter((g) => g.vendor === "Intel");
    const filtered = isLaptop !== undefined ? intelGpus.filter((g) => Boolean(g.isLaptop) === isLaptop) : intelGpus;
    if (filtered.length > 0) {
      filtered.sort((a, b) => Math.abs(a.score - benchScore) - Math.abs(b.score - benchScore));
      return filtered[0];
    }
  }

  // Global Fallback based on score and form factor
  const globalCandidates = isLaptop !== undefined ? GPU_DATABASE.filter((g) => Boolean(g.isLaptop) === isLaptop) : GPU_DATABASE;
  if (globalCandidates.length > 0) {
    globalCandidates.sort((a, b) => Math.abs(a.score - benchScore) - Math.abs(b.score - benchScore));
    return globalCandidates[0];
  }

  return GPU_DATABASE.find((g) => g.id === "rtx-2050-laptop") || GPU_DATABASE[0];
}

export function resolveBestCpu(
  param1?:
    | number
    | {
        concurrency?: number;
        cpuScore?: number;
        queryHint?: string;
        rawRenderer?: string;
        isLaptop?: boolean;
      },
  param2?: number,
  param3?: string
): CpuSpec {
  let concurrency = 8;
  let cpuScore = 65;
  let queryHint: string | undefined = undefined;
  let rawRenderer: string | undefined = undefined;
  let isLaptop: boolean | undefined = undefined;

  if (typeof param1 === "object" && param1 !== null) {
    concurrency = param1.concurrency ?? 8;
    cpuScore = param1.cpuScore ?? 65;
    queryHint = param1.queryHint;
    rawRenderer = param1.rawRenderer;
    isLaptop = param1.isLaptop;
  } else {
    concurrency = typeof param1 === "number" ? param1 : 8;
    cpuScore = typeof param2 === "number" ? param2 : 65;
    queryHint = param3;
  }

  if (queryHint) {
    const match = findCpuByQuery(queryHint, { isLaptop });
    if (match) return match;
  }

  // Inspect rawRenderer for Intel / AMD CPU architecture codenames (e.g. Linux Mesa TGL GT1)
  const renderer = (rawRenderer || queryHint || "").toUpperCase();

  // Tiger Lake (11th Gen Intel, e.g. TGL GT1 / TGL GT2 - 100% Mobile Silicon)
  if (renderer.includes("TGL") || renderer.includes("TIGER LAKE") || renderer.includes("TIGERLAKE")) {
    if (concurrency >= 16) {
      const tgl16 = CPU_DATABASE.find((c) => c.id === "i7-11800h");
      if (tgl16) return tgl16;
    }
    if (concurrency >= 12) {
      const tgl12 = CPU_DATABASE.find((c) => c.id === "i5-11400h");
      if (tgl12) return tgl12;
    }
    const tglMobile = CPU_DATABASE.find((c) => c.id === "i5-11400h" || c.id === "i5-11300h" || c.id === "i5-1135g7");
    if (tglMobile) return tglMobile;
  }

  // Alder Lake (12th Gen Intel, e.g. ADL)
  if (renderer.includes("ADL") || renderer.includes("ALDER LAKE") || renderer.includes("ALDERLAKE")) {
    if (isLaptop || isLaptop === undefined || renderer.includes("ADL-P") || renderer.includes("ADL-M")) {
      if (concurrency >= 16) {
        const adl16 = CPU_DATABASE.find((c) => c.id === "i7-12700h" || c.id === "i5-12500h");
        if (adl16) return adl16;
      }
      const adlMobile = CPU_DATABASE.find((c) => c.id === "i5-12500h" || c.id === "i5-12450h");
      if (adlMobile) return adlMobile;
    }
    const adlDesktop = CPU_DATABASE.find((c) => c.id === "i5-12400f");
    if (adlDesktop) return adlDesktop;
  }

  // Raptor Lake (13th/14th Gen Intel, e.g. RPL)
  if (renderer.includes("RPL") || renderer.includes("RAPTOR LAKE") || renderer.includes("RAPTORLAKE")) {
    if (isLaptop || isLaptop === undefined) {
      if (concurrency >= 16) {
        const rpl16 = CPU_DATABASE.find((c) => c.id === "i7-13700hx" || c.id === "i7-13650hx" || c.id === "i5-13500h");
        if (rpl16) return rpl16;
      }
      const rplMobile = CPU_DATABASE.find((c) => c.id === "i5-13500h" || c.id === "i5-13420h");
      if (rplMobile) return rplMobile;
    }
    const rplDesktop = CPU_DATABASE.find((c) => c.id === "i5-13400f");
    if (rplDesktop) return rplDesktop;
  }

  // Coffee Lake (8th / 9th Gen Intel, e.g. CFL)
  if (renderer.includes("CFL") || renderer.includes("COFFEE LAKE") || renderer.includes("COFFEELAKE")) {
    if (isLaptop || isLaptop === undefined) {
      if (concurrency >= 12) {
        const cfl12 = CPU_DATABASE.find((c) => c.id === "i7-9750h" || c.id === "i7-8750h");
        if (cfl12) return cfl12;
      }
      const cflMobile = CPU_DATABASE.find((c) => c.id === "i5-9300h");
      if (cflMobile) return cflMobile;
    }
    const cflDesktop = CPU_DATABASE.find((c) => c.id === "i5-9400f" || c.id === "i7-8700k");
    if (cflDesktop) return cflDesktop;
  }

  // Kaby Lake (7th Gen Intel, e.g. KBL)
  if (renderer.includes("KBL") || renderer.includes("KABY LAKE") || renderer.includes("KABYLAKE")) {
    if (isLaptop) {
      const kblMobile = CPU_DATABASE.find((c) => c.id === "i7-7700hq");
      if (kblMobile) return kblMobile;
    }
    const kblDesktop = CPU_DATABASE.find((c) => c.id === "i7-7700k");
    if (kblDesktop) return kblDesktop;
  }

  // Skylake (6th Gen Intel, e.g. SKL)
  if (renderer.includes("SKL") || renderer.includes("SKYLAKE")) {
    if (isLaptop) {
      const sklMobile = CPU_DATABASE.find((c) => c.id === "i7-6700hq");
      if (sklMobile) return sklMobile;
    }
    const sklDesktop = CPU_DATABASE.find((c) => c.id === "i7-6700k");
    if (sklDesktop) return sklDesktop;
  }

  // Filter candidates by form factor (Laptop vs Desktop)
  let pool = CPU_DATABASE;
  if (isLaptop !== undefined) {
    const formMatched = CPU_DATABASE.filter((c) => Boolean(c.isLaptop) === isLaptop);
    if (formMatched.length > 0) {
      pool = formMatched;
    }
  }

  // Filter candidates by thread count close to concurrency
  const candidates = pool.filter(
    (c) => Math.abs(c.threads - concurrency) <= 4 || Math.abs(c.cores - concurrency) <= 2
  );

  if (candidates.length > 0) {
    candidates.sort((a, b) => Math.abs(a.score - cpuScore) - Math.abs(b.score - cpuScore));
    return candidates[0];
  }

  pool.sort((a, b) => Math.abs(a.score - cpuScore) - Math.abs(b.score - cpuScore));
  return pool[0] || CPU_DATABASE[0];
}

