"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types/game";

interface QuickPeekModalProps {
  game: Game | null;
  onClose: () => void;
  onAddToCart: (game: Game) => void;
  usdRate: number | null;
}

export default function QuickPeekModal({
  game,
  onClose,
  onAddToCart,
  usdRate,
}: QuickPeekModalProps) {
  useEffect(() => {
    if (!game) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [game, onClose]);

  if (!game) return null;

  const toman = usdRate
    ? Math.round(game.numericPrice * usdRate).toLocaleString("fa-IR") + " تومان"
    : null;

  return (
    <div
      className="quickpeek-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`پیش‌نمایش سریع بازی ${game.name}`}
    >
      <div className="quickpeek-modal">
        {/* Close button */}
        <button
          className="quickpeek-close-btn"
          onClick={onClose}
          aria-label="بستن پنجره"
        >
          <i className="bi bi-x-lg"></i>
        </button>

        {/* Banner */}
        <div className="quickpeek-banner">
          <Image
            src={game.img}
            alt={game.name}
            fill
            className="quickpeek-banner-img"
            sizes="(max-width: 900px) 100vw, 820px"
          />
          <div className="quickpeek-banner-gradient"></div>
        </div>

        {/* Content */}
        <div className="quickpeek-body">
          <div className="quickpeek-header-row">
            <div>
              <h3 className="quickpeek-title">{game.name}</h3>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    color: "#ff4655",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                  }}
                >
                  {game.genre}
                </span>
                {game.releaseYear && (
                  <span
                    style={{
                      color: "#8395a7",
                      fontSize: "0.8rem",
                      background: "rgba(255, 255, 255, 0.06)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    سال انتشار: {game.releaseYear}
                  </span>
                )}
              </div>
            </div>

            <div className="quickpeek-rating-badge">
              <i className="bi bi-star-fill"></i>
              <span>{game.rating} / 5</span>
            </div>
          </div>

          <p
            style={{
              color: "#c8d6e5",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              margin: "1rem 0",
            }}
          >
            {game.desc}
          </p>

          {/* System Requirements Grid */}
          <div className="quickpeek-specs-grid">
            <div className="quickpeek-spec-box">
              <h4>
                <i className="bi bi-cpu"></i> حداقل سیستم مورد نیاز
              </h4>
              {game.minSpecs.os && (
                <div className="quickpeek-spec-item">
                  <span>سیستم عامل:</span> {game.minSpecs.os}
                </div>
              )}
              <div className="quickpeek-spec-item">
                <span>پردازنده:</span> {game.minSpecs.cpu}
              </div>
              <div className="quickpeek-spec-item">
                <span>کارت گرافیک:</span> {game.minSpecs.gpu}
              </div>
              <div className="quickpeek-spec-item">
                <span>حافظه رم:</span> {game.minSpecs.ram}
              </div>
              <div className="quickpeek-spec-item">
                <span>فضای دیسک:</span> {game.minSpecs.storage}
              </div>
            </div>

            <div className="quickpeek-spec-box">
              <h4 style={{ color: "#00ff7f" }}>
                <i className="bi bi-speedometer2"></i> سیستم پیشنهادی (۶۰+ FPS)
              </h4>
              {game.recSpecs.os && (
                <div className="quickpeek-spec-item">
                  <span>سیستم عامل:</span> {game.recSpecs.os}
                </div>
              )}
              <div className="quickpeek-spec-item">
                <span>پردازنده:</span> {game.recSpecs.cpu}
              </div>
              <div className="quickpeek-spec-item">
                <span>کارت گرافیک:</span> {game.recSpecs.gpu}
              </div>
              <div className="quickpeek-spec-item">
                <span>حافظه رم:</span> {game.recSpecs.ram}
              </div>
              <div className="quickpeek-spec-item">
                <span>فضای دیسک:</span> {game.recSpecs.storage}
              </div>
            </div>
          </div>

          {/* Price & Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 900,
                  color: "#00ff7f",
                }}
              >
                {game.price}
              </div>
              {toman && (
                <div style={{ fontSize: "0.85rem", color: "#8395a7" }}>
                  {toman}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="custom-button-unique-123 add-to-cart"
                onClick={() => {
                  onAddToCart(game);
                  onClose();
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0.6rem 1.4rem",
                  fontSize: "0.9rem",
                }}
              >
                <i className="bi bi-cart-plus"></i> افزودن به سبد
              </button>

              {game.link !== "#" ? (
                <Link
                  href={game.link}
                  className="btt"
                  onClick={onClose}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none",
                    padding: "0.6rem 1.4rem",
                    fontSize: "0.9rem",
                  }}
                >
                  صفحه اختصاصی
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
