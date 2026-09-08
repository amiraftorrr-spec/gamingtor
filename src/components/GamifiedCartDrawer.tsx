"use client";

import { useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { CartItem, Game } from "@/types/game";

interface GamifiedCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (gameId: string, delta: number) => void;
  onRemoveItem: (gameId: string) => void;
  onClearCart: () => void;
  usdRate: number | null;
  countdown: number | null;
}

const MILESTONES = [
  { threshold: 50, reward: "کد ۵٪ تخفیف: GAMER5", icon: "bi-tag-fill" },
  { threshold: 100, reward: "کد ۱۰٪ تخفیف + والپیپر 4K: GAMER10", icon: "bi-gift-fill" },
  { threshold: 150, reward: "عضویت VIP + کد ۱۵٪: VIPGAMER", icon: "bi-trophy-fill" },
];

export default function GamifiedCartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  usdRate,
  countdown,
}: GamifiedCartDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalUsd = cart.reduce(
    (sum, item) => sum + item.numericPrice * item.quantity,
    0
  );

  const totalToman = usdRate
    ? Math.round(totalUsd * usdRate).toLocaleString("fa-IR") + " تومان"
    : null;

  // Next milestone calculation
  const nextMilestone =
    MILESTONES.find((m) => totalUsd < m.threshold) || MILESTONES[MILESTONES.length - 1];
  const maxThreshold = MILESTONES[MILESTONES.length - 1].threshold;
  const progressPercent = Math.min(100, Math.round((totalUsd / maxThreshold) * 100));

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.info("سبد خرید شما در حال حاضر خالی است!");
      return;
    }
    toast.success("سفارش شما با موفقیت ثبت شد! مشتییی هستی ❤️");
    onClearCart();
    onClose();
  };

  return (
    <div
      className="cart-drawer-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="سبد خرید گیمینگ تور"
    >
      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-drawer-header">
          <h3>
            <i className="bi bi-bag-check-fill" style={{ color: "#ff4655" }}></i>
            سبد خرید گیمرها ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h3>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={onClose}
            aria-label="بستن سبد خرید"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Gamified Reward Milestone Progress */}
        <div className="cart-milestone-box">
          <div className="milestone-text-row">
            <span>
              {totalUsd >= maxThreshold ? (
                <strong style={{ color: "#00ff7f" }}>
                  🎉 تمامی پاداش‌های گیمینگ آنلاک شد!
                </strong>
              ) : (
                <>
                  فقط{" "}
                  <strong style={{ color: "#ff4655" }}>
                    ${(nextMilestone.threshold - totalUsd).toFixed(2)}
                  </strong>{" "}
                  تا آنلاک پاداش بعدی:
                </>
              )}
            </span>
            <span style={{ color: "#00ff7f" }}>{progressPercent}%</span>
          </div>

          <div className="milestone-track">
            <div
              className="milestone-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="milestone-reward-pill">
            <i className={`bi ${nextMilestone.icon}`}></i>
            <span>{nextMilestone.reward}</span>
          </div>
        </div>

        {/* Item list */}
        <div className="cart-items-container">
          {cart.length > 0 ? (
            cart.map((item) => {
              const itemToman = usdRate
                ? Math.round(item.numericPrice * item.quantity * usdRate).toLocaleString(
                    "fa-IR"
                  ) + " تومان"
                : null;

              return (
                <div key={item.id} className="cart-item-row">
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={70}
                    height={48}
                    className="cart-item-thumb"
                  />
                  <div className="cart-item-details">
                    <div className="cart-item-title">{item.name}</div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span className="cart-item-price-usd">
                        ${(item.numericPrice * item.quantity).toFixed(2)}
                      </span>
                      {itemToman && (
                        <span className="cart-item-price-toman">{itemToman}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="cart-qty-controls">
                    <button
                      type="button"
                      className="cart-qty-btn"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      aria-label="افزایش تعداد"
                    >
                      +
                    </button>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="cart-qty-btn"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      aria-label="کاهش تعداد"
                    >
                      -
                    </button>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    className="cart-item-remove-btn"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`حذف ${item.name} از سبد`}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>
              );
            })
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3.5rem 1rem",
                color: "#8395a7",
              }}
            >
              <i
                className="bi bi-cart-x"
                style={{ fontSize: "3rem", display: "block", marginBottom: "1rem", color: "#57606f" }}
              ></i>
              <p style={{ fontSize: "1rem", margin: 0 }}>سبد خرید شما خالی است</p>
              <p style={{ fontSize: "0.8rem", color: "#57606f", marginTop: "4px" }}>
                یک بازی خفن انتخاب کن و به ماجراجویی بپیوند!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span style={{ color: "#a4b0be" }}>مجموع کل ارزی:</span>
              <span className="cart-total-usd">${totalUsd.toFixed(2)}</span>
            </div>

            {totalToman && (
              <div className="cart-summary-row" style={{ marginBottom: "14px" }}>
                <span style={{ color: "#a4b0be" }}>معادل تومانی روز:</span>
                <span style={{ color: "#fff", fontWeight: 700 }}>{totalToman}</span>
              </div>
            )}

            {usdRate && (
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "#718093",
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>نرخ مرجع: {usdRate.toLocaleString("fa-IR")} تومان</span>
                {countdown !== null && (
                  <span>
                    آپدیت بعدی: {Math.floor((countdown % 3600000) / 60000)} دقیقه دیگر
                  </span>
                )}
              </div>
            )}

            <button
              type="button"
              className="cart-checkout-btn"
              onClick={handleCheckout}
            >
              <i className="bi bi-credit-card-2-front-fill"></i>
              نهایی‌سازی و پرداخت سفارش
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm("آیا مطمئنید می‌خواهید سبد خرید را خالی کنید؟")) {
                  onClearCart();
                }
              }}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                color: "#718093",
                fontSize: "0.78rem",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              خالی کردن سبد خرید
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
