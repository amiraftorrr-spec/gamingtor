import { useState, useEffect } from "react";
import "../styles/css/amir.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import ScrollAnimations from "./ScrollAnimations";

export default function Index() {
  const [usdRate, setUsdRate] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const welcomeMsg ="به دنیای بازی خوش آمدید اینجا جایی است که سرگرمی و هیجان با یکدیگر ترکیب می شوند ";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let i = -1;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + welcomeMsg.charAt(i));
      i++;
      if (i >= welcomeMsg.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // -------------------- Scroll to top --------------------
  // const [showScroll, setShowScroll] = useState(false);
  // const scrollToTop = () => {
  //   const scrollContainer =
  //     document.scrollingElement || document.documentElement;
  //   scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
  // };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setShowScroll(window.scrollY > 300);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // -------------------- Dark and Light Mode --------------------
  const [isLight, setIsLight] = useState(
    localStorage.getItem("theme") === "light",
  );

  useEffect(() => {
    document.body.classList.toggle("light-mode", isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  }, [isLight]);

  const toggleTheme = () => setIsLight((prev) => !prev);

  // ___________api__________________

  useEffect(() => {
    let interval;
    const fetchUsdRate = async () => {
      try {
        const cached = JSON.parse(localStorage.getItem("navasan_usd"));
        const now = Date.now();
        const TWELVE_HOURS = 12 * 60 * 60 * 1000;
        let expiry;

        if (cached && now - cached.timestamp < TWELVE_HOURS) {
          setUsdRate(cached.rate);
          expiry = cached.timestamp + TWELVE_HOURS;
        } else {
          const res = await fetch(
            "https://api.navasan.tech/latest/?api_key=free6Yks7pS1SkOrIHPzUX76dXDovqiL",
          );
          const data = await res.json();
          const rate = Number(data.harat_naghdi_sell.value);
          setUsdRate(rate);
          expiry = now + TWELVE_HOURS;

          localStorage.setItem(
            "navasan_usd",
            JSON.stringify({
              rate,
              timestamp: now,
            }),
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
      }
    };

    fetchUsdRate();

    return () => clearInterval(interval); // پاکسازی interval هنگام unmount
  }, []);

  //////////////////////////////////////////////////

  // -------------------- Smooth scroll --------------------
  const handleScrollLink = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // -------------------- Cart --------------------
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || [],
  );
  const [cartVisible, setCartVisible] = useState(false);

  const saveCart = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const addToCart = (item) => {
    if (!cart.some((i) => i.name === item.name)) saveCart([...cart, item]);
    else alert("این آیتم قبلاً به سبد اضافه شده است.");
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    saveCart(newCart);
  };

  const clearCart = () => {
    if (confirm("مگه نمیخوای از ما خرید کنی 😢")) saveCart([]);
  };

  const placeOrder = () => {
    alert("سفارش ثبت شد مشتیییی❤️");
    saveCart([]);
  };

  // ______________________________________________________________

  const convertToToman = (dollarStr) => {
    if (!usdRate) return "در حال دریافت نرخ دلار...";

    const price = parseFloat(dollarStr.replace("$", ""));
    const toman = price * usdRate;

    return toman.toLocaleString("fa-IR") + " تومان";
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + parseFloat(item.price.replace("$", "")),
    0,
  );

  const totalToman = usdRate
    ? (totalPrice * usdRate).toLocaleString("fa-IR") + " تومان"
    : null;

  // _________________________________________________________________________

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

  // --------------------  games --------------------

  const games = [
    {
      name: "The Last of Us",
      price: "$59.99",
      img: "the last of us.webp",
      link: "/games/last-of-us",
      desc: "یک داستان احساسی در دنیای آخرالزمانی",
    },
    {
      name: "Elden Ring",
      price: "$69.99",
      img: "elden ring.webp",
      link: "/games/elden-ring",
      desc: "یک حماسه فانتزی تاریک پر از ماجراجویی",
    },
    {
      name: "Cyberpunk 2077",
      price: "$49.99",
      img: "2077.webp",
      link: "/games/cyberpunk-2077",
      desc: "ورود به دنیایی آینده‌نگر و نقش‌آفرینی",
    },
    {
      name: "God of War: Ragnarok",
      price: "$59.99",
      img: "god of war.webp",
      link: "/games/god-of-war",
      desc: "تجربه‌ای حماسی از اساطیر نورس",
    },
    {
      name: "Grand Theft Auto V",
      price: "$29.99",
      img: "gtav.webp",
      link: "/games/gta-v",
      desc: "زندگی جرم و جنایت در یک دنیای باز",
    },
    {
      name: "Red Dead Redemption",
      price: "$39.99",
      img: "red dead.webp",
      link: "/games/red-dead",
      desc: "وسترن حماسی",
    },
    {
      name: "Hogwarts Legacy",
      price: "$59.99",
      img: "hogwarts.webp",
      link: "#",
      desc: "دنیای جادوگری",
    },
    {
      name: "Resident Evil 4",
      price: "$49.99",
      img: "re4.webp",
      link: "#",
      desc: "ترس و بقا",
    },
    {
      name: "Sekiro",
      price: "$44.99",
      img: "sekiro.webp",
      link: "#",
      desc: "چالش سامورایی",
    },
    {
      name: "Assassin's Creed",
      price: "$39.99",
      img: "ass.webp",
      link: "#",
      desc: "تاریخ مخفی",
    },
    {
      name: "Far Cry 3",
      price: "$34.99",
      img: "far3.webp",
      link: "#",
      desc: "اکشن جهان‌باز",
    },
    {
      name: "Mortal Kombat",
      price: "$29.99",
      img: "mortal.webp",
      link: "#",
      desc: "مبارزه کلاسیک",
    },

    // بازی‌های جدید اضافه شده
    {
      name: "Detroit: Become Human",
      price: "$39.99",
      img: "detroid.webp",
      link: "#",
      desc: "یک داستان تعاملی با انتخاب‌های متعدد   ",
    },
    {
      name: "Little Nightmares 2",
      price: "$34.99",
      img: "litlle.webp",
      link: "#",
      desc: "ترسناک و معمایی، دنیای تاریک و رازآلود",
    },
    {
      name: "Dark Souls 3",
      price: "$49.99",
      img: "dark.webp",
      link: "#",
      desc: "چالش حماسی و مبارزه سخت    ",
    },
    {
      name: "Forza Horizon 5",
      price: "$59.99",
      img: "for.webp",
      link: "#",
      desc: "تجربه رانندگی آزاد و مسابقات هیجان‌انگیز",
    },
    {
      name: "Days Gone",
      price: "$44.99",
      img: "days.webp",
      link: "#",
      desc: "پارکور و زامبی‌ها، بقا در دنیایی آخرالزمانی",
    },
    {
      name: "Stray",
      price: "$29.99",
      img: "stray.webp",
      link: "#",
      desc: "یک تجربه اکشن و مهیج با داستان جذاب",
    },
  ];

  const STEP = 3;
  const [visibleCount, setVisibleCount] = useState(6);

  const showMore = () =>
    setVisibleCount((prev) => Math.min(prev + STEP, games.length));
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

  const servers = [
    {
      id: 1,
      img: "/images/server1.webp",
      title: "گیم سرور های گیم آپ",
      desc: "توی گیم سرور های گیم‌آپ میتونید بازی های مختلف رو با دوستاتون آنلاین بازی کنید.",
    },
    { id: 2, img: "/server2.webp" },
    { id: 3, img: "/server3.webp" },
    { id: 4, img: "/server4.webp" },
    { id: 5, img: "/server5.webp" },
  ];

  return (
    <>
      <ScrollAnimations />
      <div className="satr">
        <header>
          <nav>
            <div className="aks-div">
              <a href="#">
                <span className="header_logo">
                  <img
                    src="i-want-a-logo-that-has-the-text-gaming-tor-and-beh (5).webp"
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
              <div className="button-borders">
                <Link to="./Register">
                  <button className="primary-button">ورود/ثبت نام</button>
                </Link>
              </div>
            </div>

            <div
              id="cart-icon-container"
              onClick={() => setCartVisible(!cartVisible)}
            >
              <i className="bi bi-cart-fill" id="cart-icon"></i>
              <span id="cart-count">{cart.length}</span>
            </div>
          </nav>

          <hr className="hhrr" />
          <div id="progress-container">
            <div id="progress-bar" style={{ width: `${scrollPercent}%` }}></div>
          </div>

          <div className="button-borderss theme-switch-container">
            <label className="switch">
              <input
                type="checkbox"
                checked={!isLight}
                onChange={() => setIsLight((prev) => !prev)}
              />
              <span className="slider"></span>
              <i className="bi bi-sun-fill off"></i>
              <i className="bi bi-moon-fill on"></i>
            </label>
          </div>

          <div className="container" id="home" style={{ marginBottom: "30px" }}>
            <h1>خانه‌ای جدید برای عاشقان بازی</h1>
            <p
              id="welcome-msg"
              className="welcome-typing "
              style={{ fontSize: "larger" }}
            >
              {typedText}
            </p>
            <a href="#about">
              <button className="btt">
                بیشتر <span></span>
              </button>
            </a>
          </div>
        </header>

        <main>
          {/* درباره ما */}
          <div className="about" id="about">
            <div className="aboutimg">
              <img src="4000_4_07-Photoroom.webp" alt="about us picture" />
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
              <Link to={"./about"}>
                {" "}
                <button className="btt">
                  ادامه خواندن <span></span>
                </button>
              </Link>
            </div>
          </div>

          {/* کارت‌ها */}
          <div className="containerrr">
            <h1 className="titr" id="games">
              بازی‌ها
            </h1>

            <div className="custom-cards-container">
              {games.slice(0, visibleCount).map((game, index) => (
                <div className="custom-card fade-slide" key={index}>
                  <img src={game.img} alt={game.name} />
                  <h1>{game.name}</h1>
                  <p>{game.desc}</p>
                  <div className="pricing">{game.price}</div>
                  <Link to={game.link}>
                    <button className="custom-button-unique-123">بیشتر</button>
                  </Link>
                  <span> </span>
                  <button
                    className="custom-button-unique-123 add-to-cart"
                    onClick={() => addToCart(game)}
                  >
                    افزودن
                  </button>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "30px" }}>
              {visibleCount < games.length && (
                <button
                  onClick={showMore}
                  style={{
                    fontSize: "40px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#00ff7f",
                  }}
                >
                  <i className="bi bi-chevron-down"></i>
                </button>
              )}

              {visibleCount > 6 && (
                <button
                  onClick={showLess}
                  style={{
                    fontSize: "40px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#00ff7f",
                    marginLeft: "10px",
                  }}
                >
                  <i className="bi bi-chevron-up"></i>
                </button>
              )}
            </div>
          </div>

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
                  <button className="gameup-btn">مشاهده</button>
                </div>

                {/* LEFT */}
                <div className="gameup-cards">
                  <div className="card c1">
                    <img src="/server2.webp" />
                  </div>
                  <div className="card c2">
                    <img src="/server3.webp" />
                  </div>
                  <div className="card c3">
                    <img src="/server4.webp" />
                  </div>
                  <div className="card c4">
                    <img src="/server5.webp" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ___________________________________/ */}
          {/* تماس با ما */}
          <div className="contactpage" id="contact">
            <div className="contact-content">
              <div className="contact-img">
                <img src="/contact-us.webp" className="cp" />
              </div>
              <div className="contact-form-container-unique">
                <h2 className="contact-h2">ارتباط با ما</h2>
                <div className="input-container">
                  <input type="text" placeholder=" " id="name" />
                  <label htmlFor="name">نام</label>
                </div>
                <div className="input-container">
                  <input type="email" placeholder=" " id="email" />
                  <label htmlFor="email">ایمیل</label>
                </div>
                <div className="input-container">
                  <textarea placeholder=" " id="message" rows="13"></textarea>
                  <label htmlFor="message">پیام خود را بنویسید...</label>
                </div>
                <button className="contact-btn">ثبت</button>
              </div>
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
                  <a href="" className="fa">
                    <i className="bi bi-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="" className="tw">
                    <i className="bi bi-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="" className="in">
                    <i className="bi bi-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="" className="yt">
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
            <p>Made with &#x1F496; by amir af tor©</p>
          </div>
        </footer>

        {/* {showScroll && (
          <button onClick={scrollToTop} id="scrollBtn">
            <i className="bi bi-caret-up-fill"></i>
          </button>
        )} */}

        {/* Cart Panel */}
        {cartVisible && (
          <div id="cart-panel" className="show">
            <div className="cart-header">
              <h3>سبد خرید</h3>
              <button onClick={() => setCartVisible(false)}>&times;</button>
            </div>
            <div id="cart-items">
              {cart.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{
                        width: "90px",
                        height: "50px",
                        borderRadius: "10px",
                      }}
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
                  </div>
                  <button
                    style={{ marginLeft: "auto" }}
                    onClick={() => removeFromCart(index)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {cart.length > 0 && (
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  <hr style={{ margin: "10px 0", borderColor: "#999" }} />
                  <strong>جمع کل:</strong>
                  <div style={{ margin: "5px 0" }}>
                    <span style={{ color: "#00ff7f" }}>
                      ${totalPrice.toFixed(2)}
                    </span>
                    <br />
                    <span style={{ color: "#ccc" }}>
                      {totalToman || "در حال محاسبه..."}
                    </span>
                    <br />

                    {usdRate && (
                      <small style={{ color: "#aaa" }}>
                        دلار = {usdRate.toLocaleString("fa-IR")} تومان <br />
                        {countdown !== null && (
                          <span>
                            آپدیت بعدی: {Math.floor(countdown / 3600000)} ساعت{" "}
                            {Math.floor((countdown % 3600000) / 60000)} دقیقه
                          </span>
                        )}
                      </small>
                    )}
                  </div>

                  <button
                    onClick={placeOrder}
                    className={`cpan ${isLight ? "light-btn" : "dark-btn"}`}
                  >
                    ثبت
                  </button>
                  <button
                    onClick={clearCart}
                    className={`cpan ${isLight ? "light-btn" : "dark-btn"}`}
                    style={{ marginLeft: "10px" }}
                  >
                    حذف همه
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
