"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types/game";
import { GAMES } from "@/data/games";

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGameForQuickPeek: (game: Game) => void;
  usdRate: number | null;
}

const CATEGORIES = [
  { id: "all", label: "همه بازی‌ها" },
  { id: "action", label: "اکشن / حماسی" },
  { id: "rpg", label: "نقش‌آفرینی" },
  { id: "open-world", label: "جهان‌باز" },
  { id: "horror", label: "ترسناک و بقا" },
];

export default function SpotlightSearch({
  isOpen,
  onClose,
  onSelectGameForQuickPeek,
  usdRate,
}: SpotlightSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Filter games
  const filteredGames = GAMES.filter((game) => {
    const matchesQuery =
      game.name.toLowerCase().includes(query.toLowerCase()) ||
      game.desc.toLowerCase().includes(query.toLowerCase()) ||
      game.genre.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;

    if (selectedCategory === "all") return true;
    if (selectedCategory === "action")
      return game.genre.includes("اکشن") || game.genre.includes("حماسی");
    if (selectedCategory === "rpg")
      return game.genre.includes("نقش‌آفرینی") || game.genre.includes("سولز");
    if (selectedCategory === "open-world")
      return game.genre.includes("جهان‌باز");
    if (selectedCategory === "horror")
      return game.genre.includes("ترسناک") || game.genre.includes("بقا");

    return true;
  });

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredGames.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredGames.length - 1
        );
      } else if (e.key === "Enter" && filteredGames[selectedIndex]) {
        e.preventDefault();
        const chosen = filteredGames[selectedIndex];
        onClose();
        onSelectGameForQuickPeek(chosen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredGames, selectedIndex, onClose, onSelectGameForQuickPeek]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const formatToman = (numericPrice: number) => {
    if (!usdRate) return null;
    return Math.round(numericPrice * usdRate).toLocaleString("fa-IR") + " تومان";
  };

  return (
    <div
      className="spotlight-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="جستجوی سریع بازی‌ها"
    >
      <div className="spotlight-container">
        {/* Header */}
        <div className="spotlight-search-header">
          <i className="bi bi-search search-icon" aria-hidden="true"></i>
          <input
            ref={inputRef}
            type="text"
            className="spotlight-search-input"
            placeholder="جستجوی سریع بازی، سبک، داستان... (تایپ کنید)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <span className="spotlight-kbd-badge">ESC</span>
        </div>

        {/* Category filter pills */}
        <div className="spotlight-filter-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`spotlight-pill ${
                selectedCategory === cat.id ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedIndex(0);
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <ul className="spotlight-results-list" ref={listRef} role="listbox">
          {filteredGames.length > 0 ? (
            filteredGames.map((game, index) => {
              const isSelected = index === selectedIndex;
              const toman = formatToman(game.numericPrice);

              return (
                <li
                  key={game.id}
                  role="option"
                  aria-selected={isSelected}
                  className={`spotlight-item ${isSelected ? "selected" : ""}`}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => {
                    onClose();
                    onSelectGameForQuickPeek(game);
                  }}
                >
                  <Image
                    src={game.img}
                    alt={game.name}
                    width={58}
                    height={40}
                    className="spotlight-item-thumb"
                  />
                  <div className="spotlight-item-info">
                    <div className="spotlight-item-title">
                      <span>{game.name}</span>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: "rgba(255, 70, 85, 0.15)",
                          color: "#ff4655",
                          border: "1px solid rgba(255, 70, 85, 0.3)",
                        }}
                      >
                        ⭐ {game.rating}
                      </span>
                    </div>
                    <div className="spotlight-item-genre">{game.genre}</div>
                  </div>
                  <div className="spotlight-item-price">
                    <span className="spotlight-price-usd">{game.price}</span>
                    {toman && (
                      <span className="spotlight-price-toman">{toman}</span>
                    )}
                  </div>
                </li>
              );
            })
          ) : (
            <li
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "#8395a7",
                fontSize: "0.95rem",
              }}
            >
              <i
                className="bi bi-controller"
                style={{ fontSize: "2rem", display: "block", marginBottom: "8px" }}
              ></i>
              بازی با عنوان «{query}» یافت نشد.
            </li>
          )}
        </ul>

        {/* Footer shortcuts */}
        <div className="spotlight-footer">
          <div className="spotlight-footer-keys">
            <span>
              <kbd className="spotlight-kbd-badge">↑</kbd>{" "}
              <kbd className="spotlight-kbd-badge">↓</kbd> پیمایش
            </span>
            <span>
              <kbd className="spotlight-kbd-badge">↵</kbd> پیش‌نمایش سریع
            </span>
          </div>
          <span>{filteredGames.length} بازی آماده اجرا</span>
        </div>
      </div>
    </div>
  );
}
