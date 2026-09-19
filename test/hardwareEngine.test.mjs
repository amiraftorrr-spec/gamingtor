import { describe, it } from "node:test";
import assert from "node:assert/strict";

// We will import the compiled or direct modules
import {
  GPU_DATABASE,
  CPU_DATABASE,
  findGpuByQuery,
  findCpuByQuery,
  resolveBestGpu,
  resolveBestCpu,
} from "../src/lib/hardwareDatabase.ts";
import {
  cleanGpuName,
  isDedicatedGpu,
  calculateAspectRatio,
  runWasmCpuBenchmark,
  synthesizeClientHardware,
} from "../src/lib/hardwareDetector.ts";
import { evaluateGameForHardware } from "../src/lib/gameEvaluator.ts";
import { GAMES } from "../src/data/games.ts";

describe("🎮 Hardware Database & Query Engine Tests", () => {
  it("should have comprehensive GPU database with 200+ entries", () => {
    assert.ok(GPU_DATABASE.length >= 200, `GPU DB count is ${GPU_DATABASE.length}, expected >= 200`);
    const nvidia4090 = GPU_DATABASE.find((g) => g.id === "rtx-4090");
    assert.ok(nvidia4090, "RTX 4090 should exist in GPU database");
    assert.strictEqual(nvidia4090.tierScore, 5.5);
    assert.strictEqual(nvidia4090.tier, "S+");
  });

  it("should have comprehensive CPU database with 150+ entries", () => {
    assert.ok(CPU_DATABASE.length >= 150, `CPU DB count is ${CPU_DATABASE.length}, expected >= 150`);
    const ryzen7800 = CPU_DATABASE.find((c) => c.id === "ryzen-7-7800x3d");
    assert.ok(ryzen7800, "Ryzen 7 7800X3D should exist in CPU database");
    assert.strictEqual(ryzen7800.tier, "S+");
    assert.strictEqual(ryzen7800.threads, 16);
  });

  it("should accurately resolve GPU queries (Exact & Fuzzy Match)", () => {
    // 1. RTX 2050 Mobile
    const g2050 = findGpuByQuery("NVIDIA GeForce RTX 2050 Laptop GPU");
    assert.ok(g2050, "RTX 2050 should be matched");
    assert.strictEqual(g2050.tier, "B");
    assert.strictEqual(g2050.vramGb, 4);
    assert.ok(g2050.vram.includes("4 GB"));

    // 1b. GA107 Codename & PCI ID 0x25ad match for RTX 2050
    const g2050Chip = findGpuByQuery("NVIDIA Corporation GA107 (rev a1) [10de:25ad]");
    assert.ok(g2050Chip, "GA107 / 0x25ad should resolve to RTX 2050 Laptop GPU");
    assert.strictEqual(g2050Chip.id, "rtx-2050");
    assert.strictEqual(g2050Chip.vramGb, 4);

    // 2. RTX 4060 Ti
    const g4060ti = findGpuByQuery("GeForce RTX 4060 Ti 16GB");
    assert.ok(g4060ti, "RTX 4060 Ti should be matched");
    assert.strictEqual(g4060ti.tier, "A");

    // 3. AMD Radeon RX 7800 XT
    const rx7800 = findGpuByQuery("AMD Radeon RX 7800 XT");
    assert.ok(rx7800, "RX 7800 XT should be matched");
    assert.strictEqual(rx7800.tier, "S");

    // 4. Intel Iris Xe Graphics
    const iris = findGpuByQuery("Intel(R) Iris(R) Xe Graphics");
    assert.ok(iris, "Iris Xe should be matched");
    assert.strictEqual(iris.isDiscrete, false);
    assert.strictEqual(iris.tier, "C");

    // 5. Apple M3 Max
    const m3max = findGpuByQuery("Apple M3 Max GPU");
    assert.ok(m3max, "Apple M3 Max should be matched");
    assert.strictEqual(m3max.tier, "S+");
  });

  it("should accurately resolve CPU queries", () => {
    // 1. Intel Core i5-12400F
    const i5 = findCpuByQuery("Intel Core i5-12400F 12th Gen");
    assert.ok(i5, "i5-12400F should be matched");
    assert.strictEqual(i5.threads, 12);
    assert.strictEqual(i5.tier, "A");

    // 2. AMD Ryzen 5 5600X
    const r5600 = findCpuByQuery("AMD Ryzen 5 5600X 6-Core Processor");
    assert.ok(r5600, "Ryzen 5 5600X should be matched");
    assert.strictEqual(r5600.threads, 12);

    // 3. Intel Core i9-14900K
    const i9 = findCpuByQuery("14th Gen Intel(R) Core(TM) i9-14900K");
    assert.ok(i9, "i9-14900K should be matched");
    assert.strictEqual(i9.tier, "S+");
    assert.strictEqual(i9.threads, 32);

    // 4. Mobile CPU: Intel Core i5-11400H
    const i5m = findCpuByQuery("11th Gen Intel(R) Core(TM) i5-11400H @ 2.70GHz");
    assert.ok(i5m, "i5-11400H Mobile should be matched");
    assert.strictEqual(i5m.isLaptop, true);
    assert.strictEqual(i5m.threads, 12);
  });

  it("should fallback gracefully using resolveBestGpu and resolveBestCpu with laptop awareness", () => {
    // Unknown string with vendor clue on Laptop form factor
    const fallbackNvidiaLaptop = resolveBestGpu({
      rawRenderer: "ANGLE (NVIDIA, NVIDIA Generic Direct3D11 vs_5_0 ps_5_0, D3D11)",
      isLaptop: true,
      benchScore: 48,
      arch: "ampere",
    });
    assert.ok(fallbackNvidiaLaptop, "Should resolve a valid GPU spec");
    assert.strictEqual(fallbackNvidiaLaptop.vendor, "NVIDIA");
    assert.strictEqual(fallbackNvidiaLaptop.id, "rtx-2050", "Ampere laptop with ~48 bench score must resolve to RTX 2050 4GB");
    assert.strictEqual(fallbackNvidiaLaptop.vramGb, 4);

    // Fallback CPU from thread count and benchmark score on Laptop form factor
    const fallbackLaptopCpu = resolveBestCpu({ concurrency: 12, cpuScore: 68, isLaptop: true });
    assert.ok(fallbackLaptopCpu, "Should resolve laptop CPU");
    assert.strictEqual(fallbackLaptopCpu.isLaptop, true);
    assert.strictEqual(fallbackLaptopCpu.threads, 12);

    // Intel Mesa Silicon Signature: TGL GT1 -> Intel Core i5-11400H (12 threads mobile)
    const tglCpu = resolveBestCpu({
      concurrency: 12,
      rawRenderer: "ANGLE (Intel, Mesa Intel(R) UHD Graphics (TGL GT1), OpenGL ES 3.2)",
      isLaptop: true,
    });
    assert.ok(tglCpu, "Should resolve Tiger Lake CPU");
    assert.strictEqual(tglCpu.id, "i5-11400h");
    assert.strictEqual(tglCpu.name, "Intel Core i5-11400H");
    assert.strictEqual(tglCpu.threads, 12);

    // AMD Ryzen Desktop Signature: Zen 4 / 16 threads -> Ryzen 7 7800X3D
    const r7800Cpu = resolveBestCpu({
      concurrency: 16,
      rawRenderer: "AMD Radeon RX 7800 XT (RADV NAVI32)",
      queryHint: "Zen 4",
      isLaptop: false,
    });
    assert.ok(r7800Cpu, "Should resolve Ryzen Zen 4 Desktop CPU");
    assert.strictEqual(r7800Cpu.vendor, "AMD");
    assert.strictEqual(r7800Cpu.threads, 16);

    // AMD Ryzen Laptop Signature: Phoenix / 780M -> Ryzen 7 7840HS
    const r7840Cpu = resolveBestCpu({
      concurrency: 16,
      rawRenderer: "AMD Radeon 780M (Phoenix)",
      isLaptop: true,
    });
    assert.ok(r7840Cpu, "Should resolve Ryzen 7 7840HS Laptop CPU");
    assert.strictEqual(r7840Cpu.id, "ryzen-7-7840hs");
    assert.strictEqual(r7840Cpu.isLaptop, true);

    // Apple Silicon Signature: Apple M3 (16 threads / Max)
    const m3MaxCpu = resolveBestCpu({
      concurrency: 16,
      rawRenderer: "Apple M3 Max GPU",
      isLaptop: true,
    });
    assert.ok(m3MaxCpu, "Should resolve Apple M3 Max CPU");
    assert.strictEqual(m3MaxCpu.id, "apple-m3-max-cpu");
    assert.strictEqual(m3MaxCpu.vendor, "Apple");
  });
});

describe("🔬 Hardware Detection & Benchmarking Tests", () => {
  it("should clean messy GPU unmasked renderer strings", () => {
    assert.strictEqual(
      cleanGpuName("ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0, D3D11)"),
      "NVIDIA GeForce RTX 3070"
    );
    assert.strictEqual(
      cleanGpuName("Mesa Intel(R) UHD Graphics 630 (CFL GT2)"),
      "Intel UHD Graphics 630"
    );
    assert.strictEqual(
      cleanGpuName("3D controller: NVIDIA Corporation GA107M [GeForce RTX 3050 Mobile] [10de:25a2] (rev a1)"),
      "NVIDIA GeForce RTX 3050 Mobile"
    );
  });

  it("should accurately identify dedicated vs integrated GPUs", () => {
    assert.strictEqual(isDedicatedGpu("NVIDIA GeForce RTX 4070"), true);
    assert.strictEqual(isDedicatedGpu("AMD Radeon RX 6700 XT"), true);
    assert.strictEqual(isDedicatedGpu("Intel Arc A770"), true);
    assert.strictEqual(isDedicatedGpu("Intel Iris Xe Graphics"), false);
    assert.strictEqual(isDedicatedGpu("Intel UHD Graphics 770"), false);
    assert.strictEqual(isDedicatedGpu("AMD Radeon Vega 8"), false);
  });

  it("should accurately calculate aspect ratios", () => {
    assert.strictEqual(calculateAspectRatio(1920, 1080), "16:9 (عریض استاندارد)");
    assert.strictEqual(calculateAspectRatio(2560, 1440), "16:9 (عریض استاندارد)");
    assert.strictEqual(calculateAspectRatio(3440, 1440), "21:9 (اولترا واید گیمینگ)");
    assert.strictEqual(calculateAspectRatio(5120, 1440), "32:9 (سوپر اولترا واید)");
    assert.strictEqual(calculateAspectRatio(2560, 1600), "16:10 (نمایشگر حرفه‌ای)");
  });

  it("should execute in-memory WebAssembly benchmark and return GFLOPS + CPU score", async () => {
    const bench = await runWasmCpuBenchmark();
    assert.ok(bench, "Wasm benchmark must return an object");
    assert.ok(bench.wasmSupported, "WebAssembly must be supported");
    assert.ok(typeof bench.durationMs === "number" && bench.durationMs >= 0);
    assert.ok(typeof bench.gflops === "number" && bench.gflops > 0);
    assert.ok(typeof bench.cpuScore === "number" && bench.cpuScore >= 0 && bench.cpuScore <= 100);
  });

  it("should synthesize complete hardware profile with tier rating", async () => {
    const hw = await synthesizeClientHardware({
      gpuId: "rtx-3060",
      cpuId: "i5-12400",
      ramGb: 16,
    });

    assert.ok(hw, "Hardware profile must be synthesized");
    assert.strictEqual(hw.gpu.name, "NVIDIA GeForce RTX 3060");
    assert.strictEqual(hw.cpu.name, "Intel Core i5-12400");
    assert.strictEqual(hw.ram.totalGb, 16);
    assert.strictEqual(hw.tier, "B");
    assert.ok(hw.tierTitle.includes("گیمینگ") || hw.tier === "B");
  });
});

describe("🎯 18-Game Performance & Compatibility Engine Tests", () => {
  it("should evaluate all 18 games for High-End Tier S system (RTX 4080)", async () => {
    const hw = await synthesizeClientHardware({
      gpuId: "rtx-4080",
      cpuId: "i7-14700k",
      ramGb: 32,
    });

    const evaluated = GAMES.map((g) => evaluateGameForHardware(g, hw));
    assert.strictEqual(evaluated.length, 18, "Must evaluate all 18 games");

    // All games should be ultra on RTX 4080
    for (const item of evaluated) {
      assert.strictEqual(item.status, "ultra", `Game ${item.game.name} should be 'ultra' on RTX 4080`);
      assert.ok(item.fpsNumber >= 60, `Game ${item.game.name} FPS should be >= 60`);
      assert.ok(item.statusBadge.length > 0);
      assert.ok(item.recommendedPreset.length > 0);
      assert.ok(item.optimizationTip.length > 0);
    }
  });

  it("should evaluate demanding games for Mainstream Tier B system (RTX 2050 Mobile / 4GB)", async () => {
    const hw = await synthesizeClientHardware({
      gpuId: "rtx-2050",
      cpuId: "i5-11400h",
      ramGb: 16,
    });

    // Cyberpunk 2077 should be playable with 45-55 FPS with DLSS on RTX 2050
    const cp = GAMES.find((g) => g.id === "cyberpunk-2077");
    assert.ok(cp, "Cyberpunk must exist");
    const cpEval = evaluateGameForHardware(cp, hw);
    assert.ok(
      cpEval.status === "playable" || cpEval.status === "smooth",
      `Cyberpunk status was ${cpEval.status}`
    );
    assert.ok(cpEval.recommendedPreset.includes("Medium") || cpEval.recommendedPreset.includes("DLSS"));

    // GTA V should run at 60+ FPS on RTX 2050
    const gta = GAMES.find((g) => g.id === "gta-v");
    assert.ok(gta, "GTA V must exist");
    const gtaEval = evaluateGameForHardware(gta, hw);
    assert.ok(
      gtaEval.status === "ultra" || gtaEval.status === "smooth",
      `GTA V status was ${gtaEval.status}`
    );
    assert.ok(gtaEval.fpsNumber >= 60);
  });

  it("should evaluate low-end integrated graphics Tier D system correctly", async () => {
    const hw = await synthesizeClientHardware({
      gpuId: "intel-uhd-630",
      cpuId: "i3-10100",
      ramGb: 8,
    });

    const cp = GAMES.find((g) => g.id === "cyberpunk-2077");
    assert.ok(cp);
    const cpEval = evaluateGameForHardware(cp, hw);
    assert.strictEqual(cpEval.status, "heavy", "Cyberpunk should be 'heavy' on Intel UHD 630");
    assert.ok(cpEval.fpsNumber <= 40);
  });
});
