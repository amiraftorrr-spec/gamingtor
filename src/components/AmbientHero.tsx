"use client";

import { useState } from "react";
import { Game } from "@/types/game";
import { GAMES } from "@/data/games";

interface AmbientHeroProps {
  onSelectGame: (game: Game) => void;
  welcomeMsg: string;
}

const FEATURED_GAMES = [
  { game: GAMES[2], label: "سایبرپانک ۲۰۷۷", color: "#00f0ff", glow: "rgba(0, 240, 255, 0.4)" },
  { game: GAMES[3], label: "گاد آو وار", color: "#00a8ff", glow: "rgba(0, 168, 255, 0.4)" },
  { game: GAMES[5], label: "رد دد ۲", color: "#e84118", glow: "rgba(232, 65, 24, 0.4)" },
  { game: GAMES[1], label: "الدن رینگ", color: "#f1c40f", glow: "rgba(241, 196, 15, 0.4)" },
  { game: GAMES[0], label: "لست آو آس", color: "#2ed573", glow: "rgba(46, 213, 115, 0.4)" },
];

export default function AmbientHero({ onSelectGame, welcomeMsg }: AmbientHeroProps) {
  const [activeTheme, setActiveTheme] = useState(FEATURED_GAMES[0]);

  return (
    <>
      {/* Dynamic Ambient Background Glow */}
      <div
        className="ambient-glow-layer"
        style={{
          background: `radial-gradient(ellipse 65% 45% at 50% 25%, ${activeTheme.glow} 0%, rgba(0,0,0,0) 70%)`,
        }}
      >
        <div
          className="ambient-orb"
          style={{
            width: "500px",
            height: "500px",
            top: "5%",
            right: "15%",
            backgroundColor: activeTheme.color,
          }}
        />
        <div
          className="ambient-orb"
          style={{
            width: "400px",
            height: "400px",
            top: "15%",
            left: "15%",
            backgroundColor: activeTheme.color,
            opacity: 0.35,
          }}
        />
      </div>

      <div className="container" id="home" style={{ marginBottom: "30px", position: "relative", zIndex: 10 }}>
        <h1 style={{ textShadow: `0 0 25px ${activeTheme.glow}` }}>
          خانه‌ای جدید برای عاشقان بازی
        </h1>
        <p
          id="welcome-msg"
          className="welcome-typing"
          style={{ fontSize: "larger" }}
        >
          {welcomeMsg}
        </p>

        {/* Featured Game Atmosphere Switchers */}
        <div className="hero-game-chips">
          {FEATURED_GAMES.map((item) => {
            const isActive = activeTheme.game.id === item.game.id;
            return (
              <button
                key={item.game.id}
                type="button"
                className={`hero-chip ${isActive ? "active" : ""}`}
                style={
                  {
                    "--chip-color": item.color,
                    "--chip-glow": item.glow,
                  } as React.CSSProperties
                }
                onClick={() => {
                  setActiveTheme(item);
                  onSelectGame(item.game);
                }}
                onMouseEnter={() => setActiveTheme(item)}
                aria-label={`تغییر اتمسفر به تم ${item.label}`}
              >
                <span
                  className="hero-chip-dot"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "center" }}>
          <a href="#games" className="btt" style={{ textDecoration: "none" }}>
            مشاهده بازی‌ها <span></span>
          </a>
          <a
            href="#sys-checker"
            className="btt"
            style={{
              textDecoration: "none",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            تست سیستم <span></span>
          </a>
        </div>
      </div>
    </>
  );
}
