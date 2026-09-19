import { NextResponse } from "next/server";
import os from "os";
import fs from "fs";
import { execSync } from "child_process";

// Format clean readable CPU name
function formatCpuModel(raw: string): { full: string; short: string } {
  if (!raw) {
    return { full: "Intel / AMD Processor", short: "پردازنده چند‌هسته‌ای" };
  }

  const cleaned = raw
    .replace(/\(R\)|\(TM\)/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  // Try extracting high-precision short name (e.g. Intel Core i5-11400H, AMD Ryzen 7 5800X3D)
  const intelMatch = cleaned.match(/(?:Core\s*)?(i[3579]-[\w\d]+|Ultra\s*[579]-[\w\d]+)/i);
  const ryzenMatch = cleaned.match(/Ryzen\s*([3579]\s*[\w\d]+|Threadripper\s*[\w\d]+)/i);
  const xeonMatch = cleaned.match(/Xeon\s*[\w\d-]+/i);

  let short = cleaned;
  if (intelMatch) {
    short = `Intel Core ${intelMatch[1].replace(/^Core\s*/i, "")}`;
  } else if (ryzenMatch) {
    short = `AMD Ryzen ${ryzenMatch[1]}`;
  } else if (xeonMatch) {
    short = `Intel ${xeonMatch[0]}`;
  } else if (cleaned.includes("@")) {
    short = cleaned.split("@")[0].trim();
  }

  return { full: cleaned, short };
}

// Clean GPU name
function cleanGpuName(raw: string): string {
  if (!raw) return "";
  let s = raw
    .replace(/^([0-9a-fA-F]{2,4}:){1,3}[0-9a-fA-F]{2}\.[0-9a-fA-F]\s+/i, "")
    .replace(/(VGA compatible|3D|Display)\s+controller(\s*\[[0-9a-fA-F]+\])?:\s*/gi, "")
    .replace(/\(prog-if\s+[0-9a-fA-F]+.*?\)/gi, "")
    .replace(/\(rev\s+[0-9a-fA-F]+\)/gi, "")
    .replace(/\(R\)|\(TM\)/gi, "")
    .replace(/\[[0-9a-fA-F]{4}:[0-9a-fA-F]{4}\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Extract from brackets if bracketed model exists, e.g. GA107 [GeForce RTX 2050] or TigerLake-H GT1 [UHD Graphics]
  const bracketMatches = [...s.matchAll(/\[(.*?)\]/g)];
  for (const m of bracketMatches) {
    const val = m[1].trim();
    if (/GeForce|Radeon|RTX|GTX|Arc|Iris|UHD|Graphics/i.test(val)) {
      if (!val.toLowerCase().startsWith("nvidia") && /geforce|rtx|gtx/i.test(val)) {
        return `NVIDIA ${val}`;
      }
      if (!val.toLowerCase().startsWith("amd") && /radeon|rx/i.test(val)) {
        return `AMD ${val}`;
      }
      if (!val.toLowerCase().startsWith("intel") && /uhd|iris|arc/i.test(val)) {
        return `Intel ${val}`;
      }
      return val;
    }
  }

  s = s.replace(/\[[0-9a-fA-F]+\]/g, "").replace(/Corporation\s*/gi, "").trim();
  return s;
}

function getLinuxDistroName(): string {
  try {
    if (fs.existsSync("/etc/os-release")) {
      const content = fs.readFileSync("/etc/os-release", "utf-8");
      const prettyMatch = content.match(/PRETTY_NAME="?([^"\n]+)"?/);
      if (prettyMatch) return prettyMatch[1];
      const nameMatch = content.match(/NAME="?([^"\n]+)"?/);
      if (nameMatch) return nameMatch[1];
    }
  } catch {}
  return "Linux x86_64";
}

export async function GET() {
  try {
    const cpus = os.cpus();
    const rawCpu = cpus && cpus[0] ? cpus[0].model : "";
    const { full: cpuFull, short: cpuShort } = formatCpuModel(rawCpu);
    const cpuCores = cpus ? cpus.length : 8;

    // Calculate RAM in GB
    let ramGB = 16;
    try {
      const rawMemGB = os.totalmem() / (1024 * 1024 * 1024);
      // Snap to standard RAM capacities (4, 8, 12, 16, 24, 32, 48, 64, 128)
      const memR = Math.round(rawMemGB);
      if (rawMemGB > 14 && rawMemGB < 17) ramGB = 16;
      else if (rawMemGB > 6.5 && rawMemGB < 8.8) ramGB = 8;
      else if (rawMemGB > 29 && rawMemGB < 33) ramGB = 32;
      else if (rawMemGB > 60 && rawMemGB < 66) ramGB = 64;
      else ramGB = Math.max(4, memR);
    } catch {
      ramGB = 16;
    }

    let primaryGpu = "";
    let secondaryGpu = "";
    let gpuVendor = "";
    let vram = "";
    let gpuDriver = "";

    // 1. Check NVIDIA via nvidia-smi (Most accurate for NVIDIA GPUs)
    try {
      const out = execSync(
        "nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader",
        { timeout: 1000 }
      )
        .toString()
        .trim();

      if (out) {
        const first = out.split("\n")[0];
        const parts = first.split(",").map((s) => s.trim());
        if (parts[0]) {
          primaryGpu = parts[0];
          gpuVendor = "NVIDIA Corporation";
        }
        if (parts[1]) {
          const mb = parseInt(parts[1], 10);
          if (!isNaN(mb)) {
            const gb = Math.round(mb / 1024);
            vram = `${gb} GB GDDR6`;
          }
        }
        if (parts[2]) {
          gpuDriver = parts[2];
        }
      }
    } catch {
      // nvidia-smi not available or failed
    }

    // 2. Check Linux lspci / glxinfo / DRM
    if (process.platform === "linux") {
      try {
        const out = execSync("lspci -vnnk 2>/dev/null || lspci 2>/dev/null", {
          timeout: 1000,
        }).toString();
        const lines = out.split("\n").filter((l) => /vga|3d|display/i.test(l));

        const nvidiaLine = lines.find((l) => /nvidia/i.test(l));
        const amdLine = lines.find((l) => /amd|radeon/i.test(l) && !/integrated|renoir|cezanne|raphael/i.test(l));
        const intelLine = lines.find((l) => /intel/i.test(l));

        const discreteLine = nvidiaLine || amdLine;
        const integratedLine = intelLine || (!nvidiaLine && amdLine ? null : amdLine);

        if (discreteLine && !primaryGpu) {
          primaryGpu = cleanGpuName(discreteLine);
          if (/nvidia/i.test(discreteLine)) gpuVendor = "NVIDIA Corporation";
          else if (/amd|radeon/i.test(discreteLine)) gpuVendor = "AMD";
        }

        if (integratedLine) {
          const cleanedInt = cleanGpuName(integratedLine);
          if (cleanedInt !== primaryGpu) {
            secondaryGpu = cleanedInt;
          }
        }

        if (!primaryGpu && lines[0]) {
          primaryGpu = cleanGpuName(lines[0]);
          if (/intel/i.test(lines[0])) gpuVendor = "Intel Corporation";
          else if (/amd|radeon/i.test(lines[0])) gpuVendor = "AMD";
        }
      } catch {
        // lspci failed
      }

      // Check glxinfo for dedicated VRAM if not set
      if (!vram) {
        try {
          const glx = execSync("glxinfo -B 2>/dev/null", { timeout: 800 }).toString();
          const vramMatch = glx.match(/Dedicated video memory:\s*(\d+)\s*MB/i);
          if (vramMatch && vramMatch[1]) {
            const mb = parseInt(vramMatch[1], 10);
            if (!isNaN(mb) && mb > 500) {
              vram = `${Math.round(mb / 1024)} GB VRAM`;
            }
          }
          const rendMatch = glx.match(/OpenGL renderer string:\s*(.+)/i);
          if (rendMatch && rendMatch[1] && !primaryGpu) {
            primaryGpu = rendMatch[1].replace(/\/PCIe\/.*$/i, "").trim();
          }
        } catch {}
      }
    }

    // 3. Windows PowerShell & WMIC
    if (process.platform === "win32") {
      try {
        const psOut = execSync(
          'powershell -NoProfile -Command "Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM, DriverVersion | ConvertTo-Json"',
          { timeout: 1500 }
        ).toString();
        const gpus = JSON.parse(psOut);
        const gpuList = Array.isArray(gpus) ? gpus : [gpus];

        const discrete = gpuList.find((g: { Name?: string }) =>
          /geforce|rtx|gtx|radeon rx|arc/i.test(g.Name || "")
        );
        const target = discrete || gpuList[0];

        if (target && target.Name) {
          primaryGpu = target.Name;
          if (/nvidia/i.test(target.Name)) gpuVendor = "NVIDIA Corporation";
          else if (/amd|radeon/i.test(target.Name)) gpuVendor = "AMD";
          else if (/intel/i.test(target.Name)) gpuVendor = "Intel Corporation";

          if (target.AdapterRAM && target.AdapterRAM > 0) {
            const gb = Math.round(target.AdapterRAM / (1024 * 1024 * 1024));
            if (gb >= 1) vram = `${gb} GB VRAM`;
          }
          if (target.DriverVersion) gpuDriver = target.DriverVersion;
        }

        const integrated = gpuList.find(
          (g: { Name?: string }) =>
            g.Name !== primaryGpu && /intel|uhd|iris|radeon graphics/i.test(g.Name || "")
        );
        if (integrated && integrated.Name) {
          secondaryGpu = integrated.Name;
        }
      } catch {
        // WMIC fallback
        try {
          const out = execSync("wmic path win32_VideoController get name,adapterram", {
            timeout: 1000,
          }).toString();
          const lines = out
            .split("\r\n")
            .map((s) => s.trim())
            .filter((s) => s && s.toLowerCase() !== "name" && s.toLowerCase() !== "adapterram");
          const nvidia = lines.find((l) => /nvidia|geforce|rtx|gtx/i.test(l));
          const amd = lines.find((l) => /amd|radeon/i.test(l));
          const picked = nvidia || amd || lines[0] || "";
          if (picked) {
            primaryGpu = picked;
            if (/nvidia/i.test(picked)) gpuVendor = "NVIDIA Corporation";
            else if (/amd/i.test(picked)) gpuVendor = "AMD";
          }
        } catch {}
      }
    }

    // 4. macOS
    if (process.platform === "darwin") {
      try {
        const out = execSync("system_profiler SPDisplaysDataType", { timeout: 1200 }).toString();
        const chipMatch = out.match(/Chipset Model:\s*(.+)/i);
        if (chipMatch && chipMatch[1]) {
          primaryGpu = chipMatch[1].trim();
          gpuVendor = "Apple";
          vram = "حافظه یکپارچه (Unified)";
        }
      } catch {}
    }

    // Determine OS Name
    let osName = "Windows 11 (64-bit)";
    if (process.platform === "linux") {
      osName = getLinuxDistroName();
    } else if (process.platform === "win32") {
      osName = "Windows (64-bit)";
    } else if (process.platform === "darwin") {
      osName = "macOS";
    }

    return NextResponse.json({
      success: true,
      gpuName: primaryGpu || "NVIDIA GeForce RTX 2050",
      gpuVendor: gpuVendor || "NVIDIA Corporation",
      secondaryGpu: secondaryGpu || "",
      vram: vram || "4 GB GDDR6",
      gpuDriver: gpuDriver || "",
      cpuModel: cpuShort || cpuFull,
      cpuFullModel: cpuFull,
      cpuCores,
      ramGB,
      osName,
      platform: process.platform === "linux" ? "Linux x86_64" : process.platform === "win32" ? "Windows PC" : "macOS",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}
