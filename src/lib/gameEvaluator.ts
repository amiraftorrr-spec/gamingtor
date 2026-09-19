import { Game } from "@/types/game";
import { SynthesizedHardware } from "./hardwareDetector";

export interface EvaluatedGame {
  game: Game;
  status: "ultra" | "smooth" | "playable" | "heavy";
  statusBadge: string;
  statusColor: string;
  estimatedFps: string;
  fpsNumber: number;
  recommendedPreset: string;
  optimizationTip: string;
  bottleneck?: "cpu" | "gpu" | "ram" | null;
  matchScore: number; // 0 - 100
}

export function evaluateGameForHardware(
  game: Game,
  hw: SynthesizedHardware
): EvaluatedGame {
  const gpuTier = hw.gpu.tier;
  const gpuScore =
    gpuTier === "S+"
      ? 100
      : gpuTier === "S"
      ? 90
      : gpuTier === "A"
      ? 78
      : gpuTier === "B"
      ? 60
      : gpuTier === "C"
      ? 42
      : 25;
  const cpuScore = hw.cpu.score || (hw.cpu.tier === "S+" ? 100 : hw.cpu.tier === "S" ? 90 : hw.cpu.tier === "A" ? 80 : hw.cpu.tier === "B" ? 65 : 40);
  const ramGb = hw.ram.gb;
  const tierScore = game.tierScore || 3; // 1 (light) to 5 (heavy)

  // Calculate composite match score for this game
  let effectiveScore = (gpuScore * 0.6 + cpuScore * 0.3 + Math.min(ramGb * 4, 30) * 0.33) * (6 - tierScore) * 0.35;
  effectiveScore = Math.min(Math.max(Math.round(effectiveScore), 15), 100);

  let status: "ultra" | "smooth" | "playable" | "heavy" = "playable";
  let statusBadge = "روان و مطلوب (۴۵ الی ۵۵ فریم)";
  let statusColor = "#2ed573";
  let estimatedFps = "۴۵-۵۵ FPS";
  let fpsNumber = 50;
  let recommendedPreset = "کیفیت Medium + DLSS/FSR";
  let optimizationTip = "با فعال‌سازی DLSS/FSR و تنظیم سایه‌ها روی حالت Medium، فریم‌ریت پایدار کاملاً در دسترس است.";
  let bottleneck: "cpu" | "gpu" | "ram" | null = null;

  if (ramGb < 12 && tierScore >= 4) {
    bottleneck = "ram";
  } else if (gpuScore < 45 && tierScore >= 3) {
    bottleneck = "gpu";
  } else if (cpuScore < 50 && tierScore >= 4) {
    bottleneck = "cpu";
  }

  // Tier 1 & 2 games (e.g. GTA V, Little Nightmares, Far Cry 3)
  if (tierScore <= 2) {
    if (gpuScore >= 40 && cpuScore >= 45) {
      status = "ultra";
      statusBadge = "⚡ فوق‌العاده و حداکثر کیفیت (60+ FPS)";
      statusColor = "#00ff7f";
      estimatedFps = "۷۵-۱۲۰+ FPS (Ultra 1080p)";
      fpsNumber = 100;
      recommendedPreset = "کیفیت Ultra / Maximum Settings";
      optimizationTip = "سیستم شما این بازی را با حداکثر جزییات گرافیکی و بالاترین نرخ فریم به راحتی اجرا می‌کند.";
    } else {
      status = "smooth";
      statusBadge = "روان و پایدار (۶۰ فریم کامل)";
      statusColor = "#2ed573";
      estimatedFps = "۵۵-۶۰ FPS (High Settings)";
      fpsNumber = 60;
      recommendedPreset = "کیفیت High 1080p";
      optimizationTip = "اجرای روان و بدون افت فریم با تنظیمات گرافیکی بالا تضمین شده است.";
    }
  } 
  // Tier 3 & 4 games (e.g. Elden Ring, God of War, RDR2, The Last of Us)
  else if (tierScore <= 4) {
    if (gpuScore >= 75 && cpuScore >= 75 && ramGb >= 16) {
      status = "ultra";
      statusBadge = "⚡ فوق‌العاده و اولترا (60+ FPS)";
      statusColor = "#00ff7f";
      estimatedFps = "۶۵-۹۰ FPS (High/Ultra Settings)";
      fpsNumber = 85;
      recommendedPreset = "کیفیت High / Ultra + DLSS Quality";
      optimizationTip = "توان گرافیکی و پردازشی عالی؛ می‌توانید از بالاترین جزییات با رزولوشن 1080p یا 1440p لذت ببرید.";
    } else if (gpuScore >= 45 && cpuScore >= 55) {
      status = "smooth";
      statusBadge = "روان و مطلوب (۴۵ الی ۵۵ فریم)";
      statusColor = "#00d2d3";
      estimatedFps = "۴۵-۵۵ FPS (Medium/High Settings)";
      fpsNumber = 55;
      recommendedPreset = "کیفیت Medium + DLSS/FSR Balanced";
      optimizationTip = "با فعال‌سازی DLSS یا FSR Balanced، تجربه گیم‌پلی بسیار روان و پایدار نزدیک ۶۰ فریم خواهید داشت.";
    } else {
      status = "playable";
      statusBadge = "قابل بازی (۳۵ الی ۴۵ فریم)";
      statusColor = "#ff9f43";
      estimatedFps = "۳۵-۴۵ FPS (Low/Medium Settings)";
      fpsNumber = 40;
      recommendedPreset = "کیفیت Low/Medium + FSR Performance";
      optimizationTip = "برای دستیابی به فریم پایدار، تنظیمات گرافیکی روی Low یا Medium و رزولوشن داینامیک پیشنهاد می‌شود.";
    }
  } 
  // Tier 5 games (e.g. Cyberpunk 2077, Alan Wake 2, Black Myth Wukong)
  else {
    if (gpuScore >= 80 && cpuScore >= 80 && ramGb >= 16) {
      status = "ultra";
      statusBadge = "⚡ اولترا با ری‌تریسینگ (60+ FPS)";
      statusColor = "#00ff7f";
      estimatedFps = "۶۰-۸۰ FPS (Ultra + Ray Tracing / DLSS)";
      fpsNumber = 75;
      recommendedPreset = "کیفیت Ultra + DLSS / Frame Generation";
      optimizationTip = "سیستم شما در بالاترین رده قرار دارد و قادر است ری‌تریسینگ کامل و فناوری‌های نسل جدید را اجرا کند.";
    } else if (gpuScore >= 55 && cpuScore >= 60) {
      status = "smooth";
      statusBadge = "روان (۴۵ الی ۵۵ فریم با DLSS)";
      statusColor = "#00d2d3";
      estimatedFps = "۴۵-۵۵ FPS (Medium Settings + DLSS)";
      fpsNumber = 50;
      recommendedPreset = "کیفیت Medium + DLSS/FSR Quality";
      optimizationTip = "این بازی بسیار سنگین است اما با هوش مصنوعی DLSS یا FSR تجربه‌ای بسیار خوب و روان خواهید داشت.";
    } else if (gpuScore >= 40) {
      status = "playable";
      statusBadge = "سنگین (نیازمند بهینه‌سازی)";
      statusColor = "#ff9f43";
      estimatedFps = "۳۰-۴۰ FPS (Low Settings)";
      fpsNumber = 35;
      recommendedPreset = "کیفیت Low / رزولوشن داینامیک";
      optimizationTip = "این عنوان گرافیکی سنگین است؛ برای تجربه روان‌تر پیشنهاد می‌شود رزولوشن داینامیک یا FSR Performance فعال گردد.";
    } else {
      status = "heavy";
      statusBadge = "سنگین / نیازمند ارتقای سخت‌افزار";
      statusColor = "#ff5252";
      estimatedFps = "۲۰-۳۰ FPS (Low 720p)";
      fpsNumber = 25;
      recommendedPreset = "کیفیت Low 720p / FSR Ultra Performance";
      optimizationTip = "این بازی به توان پردازشی و حافظه ویدیویی بالاتری نیاز دارد. کاهش رزولوشن به 720p الزامی است.";
    }
  }

  return {
    game,
    status,
    statusBadge,
    statusColor,
    estimatedFps,
    fpsNumber,
    recommendedPreset,
    optimizationTip,
    bottleneck,
    matchScore: effectiveScore,
  };
}
