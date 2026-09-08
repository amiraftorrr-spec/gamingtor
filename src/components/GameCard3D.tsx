"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types/game";

interface GameCard3DProps {
  game: Game;
  index: number;
  onQuickPeek: (game: Game) => void;
  onAddToCart: (game: Game) => void;
}

export default function GameCard3D({
  game,
  index,
  onQuickPeek,
  onAddToCart,
}: GameCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, background: "" });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // max -10deg to 10deg
    const rotateY = ((x - centerX) / centerX) * 10;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );
    setGlareStyle({
      opacity: 0.35,
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)`,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlareStyle({ opacity: 0, background: "" });
  }, []);

  return (
    <div
      ref={cardRef}
      className="card-3d-wrapper custom-card fade-slide"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {/* Glare effect */}
      <div
        className="card-glare-overlay"
        style={{
          opacity: glareStyle.opacity,
          background: glareStyle.background,
        }}
      />

      {/* Quick Peek Floating Button (Icon only) */}
      <button
        type="button"
        className="card-quick-peek-btn"
        onClick={(e) => {
          e.stopPropagation();
          onQuickPeek(game);
        }}
        aria-label={`پیش‌نمایش سریع ${game.name}`}
        title={`پیش‌نمایش سریع ${game.name}`}
      >
        <i className="bi bi-eye-fill"></i>
      </button>

      {/* Card Image */}
      <Image
        src={game.img}
        alt={game.name}
        width={640}
        height={360}
        sizes="(max-width: 700px) 90vw, (max-width: 1200px) 30vw, 360px"
      />

      <h1>{game.name}</h1>
      <p>{game.desc}</p>
      <div className="pricing">{game.price}</div>

      <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
        {game.link !== "#" ? (
          <Link
            href={game.link}
            className="custom-button-unique-123"
            aria-label={`مشاهده جزییات بیشتر بازی ${game.name}`}
          >
            بیشتر
            <span className="sr-only"> درباره بازی {game.name}</span>
          </Link>
        ) : (
          <button
            type="button"
            className="custom-button-unique-123"
            onClick={() => onQuickPeek(game)}
            aria-label={`مشاهده مشخصات ${game.name}`}
          >
            مشخصات
          </button>
        )}

        <button
          type="button"
          className="custom-button-unique-123 add-to-cart"
          onClick={() => onAddToCart(game)}
          aria-label={`افزودن ${game.name} به سبد خرید`}
        >
          افزودن
        </button>
      </div>
    </div>
  );
}
