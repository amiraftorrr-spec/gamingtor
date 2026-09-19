"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types/game";
import { GAMES } from "@/data/games";
import {
  SynthesizedHardware,
  synthesizeClientHardware,
} from "@/lib/hardwareDetector";
import {
  GPU_DATABASE,
  CPU_DATABASE,
  GpuSpec,
  CpuSpec,
} from "@/lib/hardwareDatabase";
import { evaluateGameForHardware, EvaluatedGame } from "@/lib/gameEvaluator";

interface SystemCheckerProps {
  onQuickPeek?: (game: Game) => void;
  onAddToCart?: (game: Game) => void;
}

const STORAGE_KEY = "gamingtor_user_hardware_v2";

export default function SystemChecker({
  onQuickPeek,
  onAddToCart,
}: SystemCheckerProps) {
  const [hasScanned, setHasScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showRefineModal, setShowRefineModal] = useState(false);

  // Hardware State
  const [hardware, setHardware] = useState<SynthesizedHardware | null>(null);

  // Custom Overrides (State & Search)
  const [overrideGpuId, setOverrideGpuId] = useState<string>("");
  const [overrideCpuId, setOverrideCpuId] = useState<string>("");
  const [overrideRamGb, setOverrideRamGb] = useState<number>(16);

  // Refine Modal Search Inputs
  const [gpuSearch, setGpuSearch] = useState("");
  const [cpuSearch, setCpuSearch] = useState("");

  // Game Filter State
  const [activeFilter, setActiveFilter] = useState<"all" | "smooth" | "ultra" | "heavy">("all");

  const resultsRef = useRef<HTMLDivElement>(null);

  // Load custom hardware from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.gpuId) setOverrideGpuId(parsed.gpuId);
        if (parsed.cpuId) setOverrideCpuId(parsed.cpuId);
        if (parsed.ramGb) setOverrideRamGb(parsed.ramGb);
      }
    } catch {}
  }, []);

  // Run hardware detection
  const executeScan = async (
    customGpuId?: string,
    customCpuId?: string,
    customRamGb?: number
  ) => {
    setIsScanning(true);
    setScanStep(1);
    setScanLogs(["> INITIATING_CLIENT_HARDWARE_PROBE..."]);

    const timer1 = setTimeout(() => {
      setScanStep(2);
      setScanLogs((prev) => [...prev, "> WEBGPU_SILICON_PROBE: CHECKING ADAPTER..."]);
    }, 200);

    const timer2 = setTimeout(() => {
      setScanStep(3);
      setScanLogs((prev) => [...prev, "> WEBCODECS_HARDWARE_DECODE: PROBING AV1/HEVC..."]);
    }, 450);

    const timer3 = setTimeout(() => {
      setScanStep(4);
      setScanLogs((prev) => [...prev, "> WASM_MICRO_BENCHMARK: COMPUTING GFLOPS & MULTI-CORE..."]);
    }, 700);

    const timer4 = setTimeout(() => {
      setScanStep(5);
      setScanLogs((prev) => [...prev, "> SYNTHESIZING_HARDWARE_MATRIX: 100% COMPLETE"]);
    }, 950);

    try {
      const gId = customGpuId !== undefined ? customGpuId : overrideGpuId || undefined;
      const cId = customCpuId !== undefined ? customCpuId : overrideCpuId || undefined;
      const rGb = customRamGb !== undefined ? customRamGb : overrideRamGb || undefined;

      const hw = await synthesizeClientHardware({
        gpuId: gId,
        cpuId: cId,
        ramGb: rGb,
      });

      setTimeout(() => {
        setHardware(hw);
        setIsScanning(false);
        setHasScanned(true);

        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 1200);
    } catch (err) {
      console.error("Hardware scan error:", err);
      setIsScanning(false);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  const handleStartScanClick = () => {
    const isMobile =
      typeof navigator !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      setShowMobileModal(true);
    } else {
      setShowPermissionModal(true);
    }
  };

  const handleConfirmScan = () => {
    setShowPermissionModal(false);
    setShowMobileModal(false);
    executeScan();
  };

  const handleSaveRefinements = (gpuId: string, cpuId: string, ramGb: number) => {
    setOverrideGpuId(gpuId);
    setOverrideCpuId(cpuId);
    setOverrideRamGb(ramGb);
    setShowRefineModal(false);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ gpuId, cpuId, ramGb })
      );
    } catch {}

    executeScan(gpuId, cpuId, ramGb);
  };

  const handleResetToAuto = () => {
    setOverrideGpuId("");
    setOverrideCpuId("");
    setOverrideRamGb(16);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setShowRefineModal(false);
    executeScan("", "", 16);
  };

  // Filtered hardware options for Refine Modal
  const filteredGpus: GpuSpec[] = useMemo(() => {
    if (!gpuSearch.trim()) return GPU_DATABASE.slice(0, 24);
    const q = gpuSearch.toLowerCase();
    return GPU_DATABASE.filter(
      (g) => g.name.toLowerCase().includes(q) || g.vendor.toLowerCase().includes(q)
    );
  }, [gpuSearch]);

  const filteredCpus: CpuSpec[] = useMemo(() => {
    if (!cpuSearch.trim()) return CPU_DATABASE.slice(0, 24);
    const q = cpuSearch.toLowerCase();
    return CPU_DATABASE.filter(
      (c) => c.name.toLowerCase().includes(q) || c.vendor.toLowerCase().includes(q)
    );
  }, [cpuSearch]);

  // Evaluated Games based on detected hardware
  const evaluatedGames: EvaluatedGame[] = useMemo(() => {
    if (!hardware) return [];
    return GAMES.map((g) => evaluateGameForHardware(g, hardware));
  }, [hardware]);

  const filteredGames = useMemo(() => {
    if (activeFilter === "all") return evaluatedGames;
    if (activeFilter === "smooth") return evaluatedGames.filter((g) => g.status === "smooth" || g.status === "ultra");
    if (activeFilter === "ultra") return evaluatedGames.filter((g) => g.status === "ultra");
    if (activeFilter === "heavy") return evaluatedGames.filter((g) => g.status === "playable" || g.status === "heavy");
    return evaluatedGames;
  }, [evaluatedGames, activeFilter]);

  return (
    <section id="sys-checker" className="sys-checker-advanced-section" ref={resultsRef}>
      <div className="sys-checker-glow-backdrop" aria-hidden="true" />

      <div className="sys-checker-container">
        {/* Section Header */}
        <div className="sys-checker-head">
          <div className="sys-checker-badge">
            <i className="bi bi-cpu"></i>
            <span>آنالیزور سخت‌افزار گیمینگ تور • هوش مصنوعی کلاینت</span>
          </div>
          <h2>سیستم من اجراش می‌کنه؟</h2>
          <p>
            تست دقیق و ۱۰۰٪ درون مرورگر کارت گرافیک مجزا (GPU)، پردازنده (CPU)، حافظه رم و نرخ نوسازی مانیتور،
            سنجش زنده توان پردازشی و محاسبه نرخ فریم‌ریت (FPS) ۱۸ بازی محبوب دنیا بدون نیاز به نصب هرگونه فایل.
          </p>
        </div>

        {/* 1. Initial Launch State */}
        {!hasScanned && !isScanning && (
          <div className="sys-checker-scan-card">
            <div className="scan-card-icon">
              <i className="bi bi-gpu-card"></i>
            </div>
            <div className="scan-card-info">
              <h3>بررسی فوری و تخصصی قطعات سیستم شما</h3>
              <p>
                با یک کلیک، کارت گرافیک، سرعت پردازش کدهای سه‌بعدی و هوش مصنوعی، تعداد هسته‌ها، حافظه رم و وضوح تصویر نمایشگر مانیتور
                شما به صورت بلادرنگ اسکن شده و لیست بازی‌های قابل اجرا با تخمین فریم نمایش داده می‌شود.
              </p>
              <div className="scan-features-row">
                <span>
                  <i className="bi bi-shield-check"></i> ۱۰۰٪ امن درون مرورگر و بدون نیاز به نصب
                </span>
                <span>
                  <i className="bi bi-lightning-charge"></i> تشخیص هوشمند گرافیک مجزا NVIDIA / AMD / Intel
                </span>
                <span>
                  <i className="bi bi-display"></i> سنجش واقعی نرخ نوسازی مانیتور (Hz) و بنچمارک سه‌بعدی
                </span>
              </div>
            </div>
            <button
              type="button"
              className="sys-checker-start-btn"
              onClick={handleStartScanClick}
              aria-label="شروع آنالیز کامل سیستم من"
            >
              <i className="bi bi-lightning-charge-fill"></i>
              <span>شروع آنالیز هوشمند سیستم من</span>
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
            <h3>در حال تست و عیب‌یابی مشخصات سخت‌افزاری...</h3>
            <p className="scanning-step-text">
              {scanStep === 1 && "در حال برقراری ارتباط با شتاب‌دهنده سخت‌افزاری مرورگر..."}
              {scanStep === 2 && "در حال بررسی معماری پردازنده گرافیکی (WebGPU / WebGL2)..."}
              {scanStep === 3 && "در حال اعتبارسنجی رمزگشای سخت‌افزاری ویدیو (AV1/HEVC)..."}
              {scanStep === 4 && "در حال اجرای بنچمارک محاسباتی WebAssembly..."}
              {scanStep >= 5 && "در حال تطبیق با پایگاه داده ۱۸ بازی گیمینگ..."}
            </p>

            <div className="scanning-progress-bar-wrap">
              <div
                className="scanning-progress-bar-fill"
                style={{ width: `${(scanStep / 5) * 100}%` }}
              ></div>
            </div>

            <div className="scanning-terminal-hud">
              {scanLogs.map((log, idx) => (
                <code key={idx}>{log}</code>
              ))}
            </div>
          </div>
        )}

        {/* 3. Finished HUD State */}
        {hasScanned && hardware && !isScanning && (
          <div className="sys-checker-dashboard">
            {/* Top Bar with System Tier & Refine Button */}
            <div className="hardware-hud-card">
              <div className="hud-header">
                <div>
                  <span className="hud-subtitle">
                    <i
                      className="bi bi-patch-check-fill"
                      style={{ color: "#00ff7f", marginLeft: "6px" }}
                    ></i>
                    {hardware.tierTitle}
                  </span>
                  <h3 className="hud-title">
                    {hardware.gpu.name}
                    {hardware.gpu.secondaryGpu && (
                      <span className="secondary-gpu-chip" style={{ fontSize: "0.85rem", opacity: 0.8, marginRight: "10px" }}>
                        (مجتمع: {hardware.gpu.secondaryGpu})
                      </span>
                    )}
                  </h3>
                </div>

                <div className="hud-actions" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="hud-action-btn secondary"
                    onClick={() => setShowRefineModal(true)}
                    title="انتخاب دستی یا تغییر قطعات برای تست سیستم‌های دیگر"
                  >
                    <i className="bi bi-sliders"></i>
                    <span>تغییر یا انتخاب دقیق قطعات</span>
                  </button>
                  <button
                    type="button"
                    className="hud-action-btn primary"
                    onClick={() => executeScan()}
                    title="اسکن مجدد مشخصات سیستم"
                  >
                    <i className="bi bi-arrow-repeat"></i>
                    <span>اسکن مجدد</span>
                  </button>
                </div>
              </div>

              {/* Hardware Grid 4 Tiles */}
              <div className="hardware-specs-grid">
                {/* Tile 1: GPU */}
                <div
                  className="spec-tile cursor-pointer"
                  onClick={() => setShowRefineModal(true)}
                  title="کلیک برای تغییر کارت گرافیک"
                >
                  <div className="spec-icon gpu-icon">
                    <i className="bi bi-gpu-card"></i>
                  </div>
                  <div className="spec-details">
                    <span className="spec-label">کارت گرافیک (GPU)</span>
                    <strong className="spec-value">{hardware.gpu.name}</strong>
                    <span className="spec-sub">
                      {hardware.gpu.vram} • {hardware.gpu.isDiscrete ? "کارت مجزا (Dedicated)" : "مجتمع (Integrated)"}
                    </span>
                  </div>
                </div>

                {/* Tile 2: CPU */}
                <div
                  className="spec-tile cursor-pointer"
                  onClick={() => setShowRefineModal(true)}
                  title="کلیک برای تغییر پردازنده"
                >
                  <div className="spec-icon cpu-icon">
                    <i className="bi bi-cpu"></i>
                  </div>
                  <div className="spec-details">
                    <span className="spec-label">پردازنده مرکزی (CPU)</span>
                    <strong className="spec-value">{hardware.cpu.name}</strong>
                    <span className="spec-sub">
                      {hardware.cpu.threads} رشته پردازشی • امتیاز بنچمارک: {hardware.benchmark.cpuScore}/100
                    </span>
                  </div>
                </div>

                {/* Tile 3: RAM & OS */}
                <div
                  className="spec-tile cursor-pointer"
                  onClick={() => setShowRefineModal(true)}
                  title="کلیک برای تغییر میزان رم"
                >
                  <div className="spec-icon ram-icon">
                    <i className="bi bi-memory"></i>
                  </div>
                  <div className="spec-details">
                    <span className="spec-label">حافظه رم و سیستم‌عامل</span>
                    <strong className="spec-value">{hardware.ram.label}</strong>
                    <span className="spec-sub">
                      {hardware.os.name} • سرعت: {hardware.benchmark.gflops} GFLOPS
                    </span>
                  </div>
                </div>

                {/* Tile 4: Display */}
                <div className="spec-tile">
                  <div className="spec-icon disp-icon">
                    <i className="bi bi-display"></i>
                  </div>
                  <div className="spec-details">
                    <span className="spec-label">نمایشگر و مانیتور (Display)</span>
                    <strong className="spec-value">
                      {hardware.display.resolution} @ {hardware.display.refreshRate}Hz
                    </strong>
                    <span className="spec-sub">
                      {hardware.display.aspectRatio} {hardware.display.isHdr ? "• مجهز به HDR" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compatible Games Matrix Block */}
            <div className="compatible-games-block">
              <div className="compatible-block-header">
                <div>
                  <h3>
                    <i className="bi bi-controller"></i>
                    <span>بازی‌هایی که با این سیستم می‌توانید تجربه کنید</span>
                  </h3>
                  <p>
                    تطابق عملکردی و نرخ فریم‌ریت لحظه‌ای (FPS) محاسبه‌شده بر اساس مشخصات سیستم شما:
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="compatible-filter-tabs">
                  <button
                    type="button"
                    className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
                    onClick={() => setActiveFilter("all")}
                  >
                    همه بازی‌ها ({evaluatedGames.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-tab ${activeFilter === "smooth" ? "active" : ""}`}
                    onClick={() => setActiveFilter("smooth")}
                  >
                    ⚡ روان با ۶۰ فریم و بیشتر (60+ FPS)
                  </button>
                  <button
                    type="button"
                    className={`filter-tab ${activeFilter === "ultra" ? "active" : ""}`}
                    onClick={() => setActiveFilter("ultra")}
                  >
                    🌟 کیفیت اولترا (Ultra)
                  </button>
                  <button
                    type="button"
                    className={`filter-tab ${activeFilter === "heavy" ? "active" : ""}`}
                    onClick={() => setActiveFilter("heavy")}
                  >
                    ⚠️ نیازمند بهینه‌سازی
                  </button>
                </div>
              </div>

              {/* Games Grid */}
              <div className="compatible-games-grid">
                {filteredGames.map((item) => (
                  <div key={item.game.id} className={`compat-game-card ${item.status}`}>
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
                        <span>{item.statusBadge}</span>
                      </div>
                    </div>

                    <div className="compat-game-body">
                      <div className="compat-game-title-row">
                        <Link href={item.game.link} className="compat-game-title-link">
                          <h4>{item.game.name}</h4>
                        </Link>
                        <span className="compat-genre">{item.game.genre}</span>
                      </div>

                      <div className="compat-fps-banner">
                        <div className="fps-metric">
                          <i className="bi bi-speedometer2"></i>
                          <span>{item.estimatedFps}</span>
                        </div>
                        <span className="preset-pill">{item.recommendedPreset}</span>
                      </div>

                      <p className="compat-note">{item.optimizationTip}</p>

                      {/* Action buttons if props provided */}
                      {(onQuickPeek || onAddToCart) && (
                        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                          {onQuickPeek && (
                            <button
                              type="button"
                              className="hud-action-btn secondary"
                              style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                              onClick={() => onQuickPeek(item.game)}
                            >
                              پیش‌نمایش سریع
                            </button>
                          )}
                          {onAddToCart && (
                            <button
                              type="button"
                              className="hud-action-btn primary"
                              style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                              onClick={() => onAddToCart(item.game)}
                            >
                              افزودن به سبد
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Permission / Privacy Modal */}
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
                    تضمین ۱۰۰٪ امنیت و حریم خصوصی گیمینگ تور
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
                  اطلاعات فنی شتاب‌دهنده گرافیکی (WebGPU / WebGL)، پردازنده، رم و
                  رزولوشن و نرخ نوسازی مانیتور شما را به صورت بلادرنگ ارزیابی می‌کند.
                </p>
                <ul>
                  <li>
                    <i className="bi bi-check-circle-fill"></i> هیچ‌گونه اطلاعات
                    شخصی یا فایلی از سیستم شما خوانده یا نصب نمی‌شود.
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i> تمامی بررسی‌ها به
                    صورت کاملاً محلی (Client-Side) درون مرورگر شما انجام می‌گردد.
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
                  onClick={handleConfirmScan}
                >
                  <i className="bi bi-cpu-fill"></i>
                  <span>تایید و شروع آنالیز سخت‌افزار</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. Mobile Device Notice Modal */}
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
                    executeScan();
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

        {/* 6. Refine / Manual Hardware Override Modal */}
        {showRefineModal && (
          <div
            className="sys-permission-modal-overlay"
            onClick={() => setShowRefineModal(false)}
          >
            <div
              className="sys-permission-modal-box refine-modal-box"
              style={{ maxWidth: "650px" }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="perm-header">
                <div className="perm-icon">
                  <i className="bi bi-sliders"></i>
                </div>
                <div>
                  <h3 id="refine-title">انتخاب یا تغییر قطعات سیستم (Hardware Selector)</h3>
                  <span className="perm-subtitle">
                    برای تست سیستم‌های دیگر یا ویرایش قطعات، کارت گرافیک و پردازنده مورد نظر را انتخاب کنید
                  </span>
                </div>
                <button
                  type="button"
                  className="perm-close-btn"
                  onClick={() => setShowRefineModal(false)}
                  aria-label="بستن"
                >
                  &times;
                </button>
              </div>

              <div className="perm-body" style={{ maxHeight: "65vh", overflowY: "auto", padding: "1.5rem" }}>
                {/* GPU Selector */}
                <div className="refine-group" style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: "700", color: "#00ff7f", fontSize: "0.92rem" }}>
                    <i className="bi bi-gpu-card" style={{ marginLeft: "6px" }}></i>
                    کارت گرافیک (GPU):
                  </label>
                  <input
                    type="text"
                    className="refine-input"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "10px",
                      color: "#fff",
                      marginBottom: "8px",
                    }}
                    placeholder="جستجوی کارت گرافیک (مثلاً 4060, 3060, 2050, 7800 XT, Iris Xe)..."
                    value={gpuSearch}
                    onChange={(e) => setGpuSearch(e.target.value)}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
                      gap: "6px",
                      maxHeight: "130px",
                      overflowY: "auto",
                      padding: "4px",
                      background: "rgba(0,0,0,0.2)",
                      borderRadius: "8px",
                    }}
                  >
                    {filteredGpus.map((gpu) => (
                      <button
                        key={gpu.id}
                        type="button"
                        style={{
                          textAlign: "right",
                          padding: "6px 8px",
                          background: overrideGpuId === gpu.id ? "rgba(0,255,127,0.25)" : "rgba(255,255,255,0.05)",
                          border: overrideGpuId === gpu.id ? "1px solid #00ff7f" : "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "6px",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "0.78rem",
                        }}
                        onClick={() => setOverrideGpuId(gpu.id)}
                      >
                        <div style={{ fontWeight: "700" }}>{gpu.name}</div>
                        <div style={{ fontSize: "0.7rem", color: "#a4b0be" }}>{gpu.vram}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CPU Selector */}
                <div className="refine-group" style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: "700", color: "#00d2d3", fontSize: "0.92rem" }}>
                    <i className="bi bi-cpu" style={{ marginLeft: "6px" }}></i>
                    پردازنده مرکزی (CPU):
                  </label>
                  <input
                    type="text"
                    className="refine-input"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "10px",
                      color: "#fff",
                      marginBottom: "8px",
                    }}
                    placeholder="جستجوی پردازنده (مثلاً i5 12400, Ryzen 5 5600, i7 13700)..."
                    value={cpuSearch}
                    onChange={(e) => setCpuSearch(e.target.value)}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
                      gap: "6px",
                      maxHeight: "130px",
                      overflowY: "auto",
                      padding: "4px",
                      background: "rgba(0,0,0,0.2)",
                      borderRadius: "8px",
                    }}
                  >
                    {filteredCpus.map((cpu) => (
                      <button
                        key={cpu.id}
                        type="button"
                        style={{
                          textAlign: "right",
                          padding: "6px 8px",
                          background: overrideCpuId === cpu.id ? "rgba(0,210,211,0.25)" : "rgba(255,255,255,0.05)",
                          border: overrideCpuId === cpu.id ? "1px solid #00d2d3" : "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "6px",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "0.78rem",
                        }}
                        onClick={() => setOverrideCpuId(cpu.id)}
                      >
                        <div style={{ fontWeight: "700" }}>{cpu.name}</div>
                        <div style={{ fontSize: "0.7rem", color: "#a4b0be" }}>{cpu.threads} رشته • {cpu.generation || cpu.vendor}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* RAM Selector */}
                <div className="refine-group">
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: "700", color: "#c084fc", fontSize: "0.92rem" }}>
                    <i className="bi bi-memory" style={{ marginLeft: "6px" }}></i>
                    حافظه رم (RAM):
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[4, 8, 12, 16, 24, 32, 64].map((gb) => (
                      <button
                        key={gb}
                        type="button"
                        style={{
                          padding: "8px 14px",
                          background: overrideRamGb === gb ? "rgba(168,85,247,0.35)" : "rgba(255,255,255,0.05)",
                          border: overrideRamGb === gb ? "1px solid #c084fc" : "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          color: "#fff",
                          cursor: "pointer",
                          fontWeight: overrideRamGb === gb ? "700" : "500",
                          fontSize: "0.85rem",
                        }}
                        onClick={() => setOverrideRamGb(gb)}
                      >
                        {gb} گیگابایت
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="perm-footer">
                <button
                  type="button"
                  className="perm-cancel-btn"
                  onClick={handleResetToAuto}
                >
                  <i className="bi bi-arrow-counterclockwise" style={{ marginLeft: "4px" }}></i>
                  <span>بازنشانی به تشخیص خودکار</span>
                </button>
                <button
                  type="button"
                  className="perm-confirm-btn"
                  onClick={() => handleSaveRefinements(overrideGpuId, overrideCpuId, overrideRamGb)}
                >
                  <i className="bi bi-check2-circle"></i>
                  <span>اعمال و محاسبه مجدد فریم‌ریت</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
