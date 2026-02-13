import { useState, useEffect } from "react";
import "../../styles/css/amir.css";

export default function Home() {
  // -------------------- Welcome typing --------------------
  const welcomeMsg =
    "به دنیای بازی‌ خوش آمدید. اینجا جایی است که سرگرمی و هیجان با هم ترکیب می‌شوند";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + welcomeMsg.charAt(i));
      i++;
      if (i >= welcomeMsg.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // -------------------- Scroll to top --------------------
  const [showScroll, setShowScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------- Dark / Light Mode --------------------
  const [isLight, setIsLight] = useState(
    localStorage.getItem("theme") === "light"
  );

  useEffect(() => {
    document.body.classList.toggle("light-mode", isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  }, [isLight]);

  const toggleTheme = () => setIsLight((prev) => !prev);

  // -------------------- Smooth scroll for links --------------------
  const handleScrollLink = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // -------------------- Cart --------------------
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [cartVisible, setCartVisible] = useState(false);

  const saveCart = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const addToCart = (item) => {
    if (!cart.some((i) => i.name === item.name)) {
      const newCart = [...cart, item];
      saveCart(newCart);
    } else {
      alert("این آیتم قبلاً به سبد اضافه شده است.");
    }
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    saveCart(newCart);
  };

  const clearCart = () => {
    if (confirm("مگه نمیخوای از ما خرید کنی 😢")) {
      saveCart([]);
    }
  };

  const placeOrder = () => {
    alert("سفارش ثبت شد مشتیییی❤️");
    saveCart([]);
  };

  const convertToToman = (dollarStr) => {
    const price = parseFloat(dollarStr.replace("$", ""));
    const toman = price * 83000;
    return toman.toLocaleString("fa-IR") + " تومان";
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + parseFloat(item.price.replace("$", "")),
    0
  );

  // -------------------- Progress Bar --------------------
  const [scrollPercent, setScrollPercent] = useState(0);
  useEffect(() => {
    const handleProgress = () => {
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setScrollPercent((window.scrollY / docHeight) * 100);
    };
    window.addEventListener("scroll", handleProgress);
    return () => window.removeEventListener("scroll", handleProgress);
  }, []);

  // -------------------- Sample games --------------------
  const games = [
    {
      name: "The Last of Us",
      price: "$59.99",
      img: "./images/the last of us.jpg",
      link: "./pages/last of us.html",
    },
    {
      name: "Elden Ring",
      price: "$69.99",
      img: "./images/elden ring.jpg",
      link: "./pages/elden ring.html",
    },
    {
      name: "Cyberpunk 2077",
      price: "$49.99",
      img: "./images/2077.jpg",
      link: "./pages/2077.html",
    },
  ];

  return (
    <>
      <header>
        <nav>
          <div className="aks-div">
            <a href="#">
              <span className="header_logo">
                <img
                  src="./images/i-want-a-logo-that-has-the-text-gaming-tor-and-beh (5).png"
                  alt=""
                  className="akss"
                />
              </span>
            </a>
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

          <div className="masterc">
            <button className="primary-button" onClick={toggleTheme}>
              {isLight ? "🌞" : "🌙"}
            </button>
          </div>
        </nav>
        <hr className="hhrr" />
        <div id="progress-container">
          <div
            id="progress-bar"
            style={{ width: `${scrollPercent}%` }}
          ></div>
        </div>

        <div className="container" id="home" style={{ marginBottom: "30px" }}>
          <h1>خانه‌ای جدید برای عاشقان بازی</h1>
          <p id="welcome-msg">{typedText}</p>
        </div>
      </header>

      <main>
        <h2 id="games">بازی‌ها</h2>
        <div className="custom-cards-container">
          {games.map((game, index) => (
            <div className="custom-card" key={index}>
              <img src={game.img} alt={game.name} />
              <h1>{game.name}</h1>
              <div className="pricing">{game.price}</div>
              <a href={game.link}>
                <button>بیشتر</button>
              </a>
              <button
                className="add-to-cart"
                onClick={() => addToCart(game)}
              >
                افزودن
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* ---------- Scroll to top button ---------- */}
      {showScroll && (
        <button id="scrollBtn" onClick={scrollToTop}>
          ⬆
        </button>
      )}

      {/* ---------- Cart Panel ---------- */}
      {cartVisible && (
        <div id="cart-panel" className="show">
          <div className="cart-header">
            <h3>سبد خرید</h3>
            <button onClick={() => setCartVisible(false)}>&times;</button>
          </div>
          <div id="cart-items">
            {cart.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "10px" }}>
                <img
                  src={item.img}
                  alt={item.name}
                  style={{ width: "90px", height: "50px", borderRadius: "10px" }}
                />
                <div>
                  <strong>{item.name}</strong>
                  <br />
                  <span style={{ color: "#00ff7f" }}>{item.price}</span>
                  <br />
                  <span style={{ color: "#ccc", fontSize: "12px" }}>
                    {convertToToman(item.price)}
                  </span>
                </div>
                <button onClick={() => removeFromCart(index)}>🗑️</button>
              </div>
            ))}
            {cart.length > 0 && (
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <hr style={{ margin: "10px 0", borderColor: "#999" }} />
                <strong>جمع کل:</strong>
                <div style={{ margin: "5px 0" }}>
                  <span style={{ color: "#00ff7f" }}>${totalPrice.toFixed(2)}</span>
                  <br />
                  <span style={{ color: "#ccc" }}>
                    {convertToToman(`$${totalPrice.toFixed(2)}`)}
                  </span>
                </div>
                <br />
                <button onClick={placeOrder}>ثبت سفارش</button>
                <button onClick={clearCart} style={{ marginLeft: "10px" }}>
                  حذف همه
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
