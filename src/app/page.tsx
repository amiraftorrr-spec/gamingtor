"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import ScrollAnimations from "@/components/ScrollAnimations";
import { Game, CartItem } from "@/types/game";
import { GAMES } from "@/data/games";
import SpotlightSearch from "@/components/SpotlightSearch";
import QuickPeekModal from "@/components/QuickPeekModal";
import GameCard3D from "@/components/GameCard3D";
import SystemChecker from "@/components/SystemChecker";
import GamifiedCartDrawer from "@/components/GamifiedCartDrawer";

export default function Home() {
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const welcomeMsg =
    "به دنیای بازی خوش آمدید؛ اینجا جایی است که سرگرمی و هیجان با یکدیگر ترکیب می‌شوند";
  const [typedText, setTypedText] = useState<string>("");

  // -------------------- Typewriter Effect --------------------
  useEffect(() => {
    let i = 0;
    setTypedText(welcomeMsg.charAt(0));
    const interval = setInterval(() => {
      i++;
      if (i < welcomeMsg.length) {
        setTypedText(welcomeMsg.slice(0, i + 1));
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [welcomeMsg]);

  // -------------------- Dark and Light Mode --------------------
  const [isLight, setIsLight] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem("theme");
      const isLightMode = savedTheme === "light";
      setIsLight(isLightMode);
      document.body.classList.toggle("light-mode", isLightMode);
      document.documentElement.classList.toggle("light-mode", isLightMode);
    } catch {
      // ignore
    }

    const handleThemeChange = (e: Event) => {
      try {
        const customEv = e as CustomEvent<{ theme?: string }>;
        const nextTheme =
          customEv?.detail?.theme ?? localStorage.getItem("theme");
        const nextLight = nextTheme === "light";
        setIsLight((prev) => (prev !== nextLight ? nextLight : prev));
        document.body.classList.toggle("light-mode", nextLight);
        document.documentElement.classList.toggle("light-mode", nextLight);
      } catch {
        // ignore
      }
    };

    window.addEventListener("theme-change", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextState = !isLight;
    setIsLight(nextState);
    try {
      localStorage.setItem("theme", nextState ? "light" : "dark");
      document.body.classList.toggle("light-mode", nextState);
      document.documentElement.classList.toggle("light-mode", nextState);
      window.dispatchEvent(
        new CustomEvent("theme-change", {
          detail: { theme: nextState ? "light" : "dark" },
        })
      );
    } catch {
      // ignore
    }
  };

  // ___________api (Strict 2-Hour Cache to protect token quota)__________________
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

    const fetchUsdRate = async () => {
      try {
        const cachedValue = localStorage.getItem("gamingtor_usd_rate");
        const cached = cachedValue ? JSON.parse(cachedValue) : null;
        const now = Date.now();
        let expiry: number;

        if (
          cached &&
          typeof cached.rate === "number" &&
          cached.rate > 0 &&
          now - cached.timestamp < TWO_HOURS_MS
        ) {
          // Strictly read from client cache without hitting API
          setUsdRate(cached.rate);
          expiry = cached.timestamp + TWO_HOURS_MS;
        } else {
          // Cached expired or not found: call backend API (which also has a 2-hour in-memory cache)
          const res = await fetch("/api/usd-rate", { cache: "no-store" });
          if (!res.ok) throw new Error("دریافت نرخ دلار ناموفق بود");
          const data = await res.json();
          const rate = Number(data.rate);
          if (!Number.isFinite(rate) || rate <= 0) {
            throw new Error("نرخ دلار نامعتبر است");
          }
          setUsdRate(rate);
          expiry = now + TWO_HOURS_MS;

          localStorage.setItem(
            "gamingtor_usd_rate",
            JSON.stringify({
              rate,
              timestamp: now,
            })
          );
        }

        interval = setInterval(() => {
          const remaining = expiry - Date.now();
          if (remaining <= 0) {
            clearInterval(interval);
            setCountdown(0);
            fetchUsdRate();
          } else {
            setCountdown(remaining);
          }
        }, 1000);
      } catch (error) {
        console.error("خطا در دریافت نرخ دلار", error);
        setUsdRate((previousRate) => previousRate || 220000);
      }
    };

    fetchUsdRate();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // -------------------- Smooth scroll --------------------
  const handleScrollLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // -------------------- Interactive Cart State --------------------
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gamingtor_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const addToCart = (game: Game) => {
    const existing = cart.find((item) => item.id === game.id);
    if (existing) {
      toast.info(`بازی «${game.name}» از قبل در سبد خرید موجود است!`, {
        toastId: `cart-exist-${game.id}`,
      });
      return;
    }
    const updated = [...cart, { ...game, quantity: 1 }];
    setCart(updated);
    try {
      localStorage.setItem("gamingtor_cart", JSON.stringify(updated));
    } catch {
      // ignore
    }
    toast.success(`بازی «${game.name}» به سبد خرید اضافه شد! 🎮`, {
      toastId: `cart-add-${game.id}`,
    });
  };

  const updateQuantity = (gameId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.id === gameId) {
          const newQty = Math.min(1, item.quantity + delta);
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    setCart(updated);
    try {
      localStorage.setItem("gamingtor_cart", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeItem = (gameId: string) => {
    const updated = cart.filter((item) => item.id !== gameId);
    setCart(updated);
    try {
      localStorage.setItem("gamingtor_cart", JSON.stringify(updated));
    } catch {
      // ignore
    }
    toast.info("بازی از سبد خرید حذف شد", {
      toastId: `cart-remove-${gameId}`,
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("gamingtor_cart");
    } catch {
      // ignore
    }
  };

  // -------------------- Spotlight & Quick Peek --------------------
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [quickPeekGame, setQuickPeekGame] = useState<Game | null>(null);

  // Global Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // -------------------- Fluid Scroll Progress (Direct RAF DOM) --------------------
  useEffect(() => {
    let frameId = 0;
    const progressBar = document.getElementById("progress-bar");

    const handleProgress = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        const docHeight =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        if (progressBar) {
          progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
      });
    };

    handleProgress();
    window.addEventListener("scroll", handleProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleProgress);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  // -------------------- Pagination / Show More --------------------
  const STEP = 3;
  const [visibleCount, setVisibleCount] = useState(6);

  const showMore = () =>
    setVisibleCount((prev) => Math.min(prev + STEP, GAMES.length));
  const showLess = () => {
    const cards = document.querySelectorAll(".custom-card");
    const start = visibleCount - STEP;
    const end = visibleCount;

    for (let i = start; i < end; i++) {
      if (cards[i]) {
        cards[i].classList.add("card-dissolve");
      }
    }

    setTimeout(() => {
      setVisibleCount((prev) => Math.max(prev - STEP, 6));
      window.scrollBy({
        top: -520,
        behavior: "smooth",
      });
    }, 600);
  };

  // -------------------- Contact Form --------------------
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("پیام شما دریافت شد؛ به زودی با شما تماس می‌گیریم! ✉️");
    e.currentTarget.reset();
  };

  return (
    <>
      <ScrollAnimations />
      <div className="satr">
        <header style={{ position: "relative", overflow: "hidden" }}>
          <nav>
            <div className="aks-div">
              <Link href="/" aria-label="صفحه اصلی گیمینگ تور">
                <span className="header_logo">
                  <Image
                    src="/logo.webp"
                    alt="لوگو گیمینگ تور"
                    className="akss"
                    width={180}
                    height={180}
                    priority
                  />
                </span>
              </Link>
            </div>

            <ul>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleScrollLink(e, "contact")}
                >
                  ارتباط با ما
                </a>
              </li>
              <li>
                <a href="#games" onClick={(e) => handleScrollLink(e, "games")}>
                  بازی ها
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleScrollLink(e, "about")}>
                  درباره ما
                </a>
              </li>
              <li>
                <a href="#home" onClick={(e) => handleScrollLink(e, "home")}>
                  خانه
                </a>
              </li>
            </ul>

            <div
              className="masterc"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <div className="button-borders">
                <Link
                  href="/Register"
                  className="primary-button"
                  style={{ display: "inline-flex", textDecoration: "none" }}
                >
                  ورود/ثبت نام
                </Link>
              </div>
            </div>

            {/* Cart Trigger */}
            <button
              id="cart-icon-container"
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="مشاهده سبد خرید"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <i className="bi bi-cart-fill" id="cart-icon"></i>
              <span id="cart-count">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </button>
          </nav>

          <hr className="hhrr" />
          <div id="progress-container">
            <div id="progress-bar" style={{ width: "0%" }}></div>
          </div>

          <div className="button-borderss theme-switch-container">
            <label className="switch" htmlFor="theme-toggle">
              <input
                id="theme-toggle"
                type="checkbox"
                aria-label="تغییر تم تاریک و روشن"
                checked={!isLight}
                onChange={toggleTheme}
              />
              <span className="slider"></span>
              <i className="bi bi-sun-fill off"></i>
              <i className="bi bi-moon-fill on"></i>
            </label>
          </div>

          {/* Hero Section with Fine Contour Glow on Text */}
          <div
            className="container"
            id="home"
            style={{ marginBottom: "30px", position: "relative" }}
          >
            <h1 className="hero-glowing-title">خانه‌ای جدید برای عاشقان بازی</h1>
            <p
              id="welcome-msg"
              className="welcome-typing"
              style={{ fontSize: "larger", position: "relative", zIndex: 2 }}
            >
              {typedText}
            </p>
            <a
              href="#about"
              onClick={(e) => handleScrollLink(e, "about")}
              style={{ position: "relative", zIndex: 2 }}
            >
              <button className="btt" type="button">
                بیشتر <span></span>
              </button>
            </a>
          </div>
        </header>

        <main>
          {/* درباره ما */}
          <div className="about" id="about">
            <div className="aboutimg">
              <Image
                src="/4000_4_07-Photoroom.webp"
                alt="درباره گیمینگ تور"
                width={460}
                height={460}
                sizes="(max-width: 900px) 80vw, 460px"
              />
            </div>
            <div className="contentbx">
              <h2>درباره ما</h2>
              <br />
              <p>
                ما در [گیمینگ تور] گرد هم آمده‌ایم تا دنیایی از بازی‌های جذاب و
                هیجان‌انگیز را به شما ارائه دهیم. از نقد و بررسی <br />
                بازی‌ها گرفته تا اخبار روز صنعت گیم و تجربه‌های چندنفره، هدف ما
                ایجاد مکانی برای تمام گیمرهاست. به ما
                <br /> بپیوندید و در ماجراجویی‌های بی‌پایان دنیای گیم شریک شوید
              </p>
              <Link
                href="/about"
                className="btt"
                style={{ display: "inline-flex", textDecoration: "none" }}
              >
                ادامه خواندن <span></span>
              </Link>
            </div>
          </div>

          {/* کارت‌های بازی ۳ بعدی با پیش‌نمایش سریع */}
          <div className="containerrr">
            <h1 className="titr" id="games">
              بازی‌ها
            </h1>

            <div className="custom-cards-container">
              {GAMES.slice(0, visibleCount).map((game, index) => (
                <GameCard3D
                  key={game.id}
                  game={game}
                  index={index}
                  onQuickPeek={(g) => setQuickPeekGame(g)}
                  onAddToCart={addToCart}
                />
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "30px" }}>
              {visibleCount < GAMES.length && (
                <button
                  onClick={showMore}
                  className="cards-chevron-btn"
                  aria-label="مشاهده بیشتر"
                >
                  <i className="bi bi-chevron-down"></i>
                </button>
              )}

              {visibleCount > 6 && (
                <button
                  onClick={showLess}
                  className="cards-chevron-btn"
                  style={{ marginLeft: "10px" }}
                  aria-label="مشاهده کمتر"
                >
                  <i className="bi bi-chevron-up"></i>
                </button>
              )}
            </div>
          </div>

          {/* بررسی سازگاری سیستم (Can You Run It?) */}
          <SystemChecker
            onQuickPeek={(g) => setQuickPeekGame(g)}
            onAddToCart={addToCart}
          />

          {/* _______________________game server_____________________________ */}
          <section className="gameup-wrapper">
            <div className="gameup-bg">
              <div className="bg-overlay"></div>

              <div className="gameup-inner">
                <div className="gameup-text">
                  <h2>
                    گیم سرور های
                    <span> گیمینگ تور</span>
                  </h2>
                  <p>
                    توی گیم سرور های
                    <span> گیمینگ تور</span>
                    می‌توانید بازی‌های مختلف را با دوستان خود به صورت آنلاین
                    تجربه کنید. در اینجا فرصت دارید تا با دیگر بازیکنان از سراسر
                    جهان رقابت کنید، مهارت‌های خود را بسنجید و لحظاتی پرهیجان و
                    سرگرم‌کننده را به همراه دوستانتان سپری کنید.
                    <br />
                  </p>
                  <button className="gameup-btn" type="button">
                    مشاهده
                  </button>
                </div>

                {/* LEFT */}
                <div className="gameup-cards">
                  <div className="card c1">
                    <Image
                      src="/server2.webp"
                      alt="Server 2"
                      width={260}
                      height={360}
                      sizes="260px"
                    />
                  </div>
                  <div className="card c2">
                    <Image
                      src="/server3.webp"
                      alt="Server 3"
                      width={245}
                      height={328}
                      sizes="245px"
                    />
                  </div>
                  <div className="card c3">
                    <Image
                      src="/server4.webp"
                      alt="Server 4"
                      width={230}
                      height={296}
                      sizes="230px"
                    />
                  </div>
                  <div className="card c4">
                    <Image
                      src="/server5.webp"
                      alt="Server 5"
                      width={215}
                      height={264}
                      sizes="215px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* تماس با ما */}
          <div className="contactpage" id="contact">
            <div className="contact-content">
              <div className="contact-img">
                <Image
                  src="/contact-us.webp"
                  alt="ارتباط با گیمینگ تور - دارک مود"
                  className="cp contact-img-dark"
                  width={640}
                  height={624}
                  sizes="(max-width: 900px) 90vw, 640px"
                />
                <Image
                  src="/contact-us2.webp"
                  alt="ارتباط با گیمینگ تور - لایت مود"
                  className="cp contact-img-light"
                  width={640}
                  height={624}
                  sizes="(max-width: 900px) 90vw, 640px"
                />
              </div>
              <form
                className="contact-form-container-unique"
                onSubmit={handleContactSubmit}
              >
                <h2 className="contact-h2">ارتباط با ما</h2>
                <div className="input-container">
                  <input type="text" placeholder=" " id="name" required />
                  <label htmlFor="name">نام</label>
                </div>
                <div className="input-container">
                  <input type="email" placeholder=" " id="email" required />
                  <label htmlFor="email">ایمیل</label>
                </div>
                <div className="input-container">
                  <textarea
                    placeholder=" "
                    id="message"
                    rows={13}
                    required
                  ></textarea>
                  <label htmlFor="message">پیام خود را بنویسید...</label>
                </div>
                <button type="submit" className="contact-btn">
                  ثبت
                </button>
              </form>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footeremoon">
          <div className="ftmaster">
            <div className="ftcontent">
              <h3>ما را دنبال کنید</h3>
              <ul className="icons">
                <li>
                  <a
                    href="#facebook"
                    onClick={(e) => e.preventDefault()}
                    className="fa"
                    aria-label="صفحه فیسبوک گیمینگ تور"
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="#twitter"
                    onClick={(e) => e.preventDefault()}
                    className="tw"
                    aria-label="صفحه توییتر گیمینگ تور"
                  >
                    <i className="bi bi-twitter"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="#instagram"
                    onClick={(e) => e.preventDefault()}
                    className="in"
                    aria-label="صفحه اینستاگرام گیمینگ تور"
                  >
                    <i className="bi bi-instagram"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="#youtube"
                    onClick={(e) => e.preventDefault()}
                    className="yt"
                    aria-label="کانال یوتیوب گیمینگ تور"
                  >
                    <i className="bi bi-youtube"></i>
                  </a>
                </li>
              </ul>
            </div>
            <div className="ftcontent">
              <h3>لینک های سریع</h3>
              <ul className="fast">
                <li>
                  <a href="#home" className="scroll-link">
                    خانه
                  </a>
                </li>
                <li>
                  <a href="#about" className="scroll-link">
                    درباره ما
                  </a>
                </li>
                <li>
                  <a href="#games" className="scroll-link">
                    بازی ها
                  </a>
                </li>
                <li>
                  <a href="#sys-checker" className="scroll-link">
                    تست سیستم
                  </a>
                </li>
                <li>
                  <a href="#contact" className="scroll-link">
                    ارتباط با ما
                  </a>
                </li>
              </ul>
            </div>
            <div className="ftcontent">
              <h3>راه های ارتباطی</h3>
              <p className="lltt">ایمیل: Gamingtor@gmail.com</p>
              <p className="lltt">آدرس: قزوین مینودر فلکه هما</p>
            </div>
            <div className="ftcontent">
              <h3>گیمینگ تور</h3>
              <p className="lltt">
                تجربه‌ای راحت و لذت‌بخش از بازی‌ها، جایی برای هیجان و سرگرمی شما
              </p>
            </div>
          </div>
          <div className="copyri">
            <p>
              <span>Made with &#x1F496; by amir af tor©</span>
              <span className="footer-version-tag">v 4.3.7</span>
            </p>
          </div>
        </footer>

        {/* 1. Spotlight Search Modal (Ctrl + K) */}
        <SpotlightSearch
          isOpen={isSpotlightOpen}
          onClose={() => setIsSpotlightOpen(false)}
          onSelectGameForQuickPeek={(g) => setQuickPeekGame(g)}
          usdRate={usdRate}
        />

        {/* 2. Quick Peek Modal */}
        <QuickPeekModal
          game={quickPeekGame}
          onClose={() => setQuickPeekGame(null)}
          onAddToCart={addToCart}
          usdRate={usdRate}
        />

        {/* 3. Gamified Cart Drawer */}
        <GamifiedCartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
          usdRate={usdRate}
          countdown={countdown}
        />
      </div>
    </>
  );
}
