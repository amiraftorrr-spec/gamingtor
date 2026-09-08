"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function AboutUs() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    "پشتیبانی 24 ساعته",
    "تحویل سریع",
    "4 سال تجربه",
    "بهترین کیفیت",
    "قیمت مناسب",
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-[#040410] text-white px-[10%] py-20 font-[shab] min-h-screen"
    >
      <div
        className={`max-w-[1400px] mx-auto space-y-16 transition-all duration-1000 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-20"
        }`}
      >
        {/* عنوان */}
        <h2 className="text-[2.5em] text-[#ff4655] text-right">درباره ما</h2>

        {/* intro */}
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <p className="text-[1.2em] leading-8 text-right flex-1">
            &quot;گیمینگ تور، خانه‌ای برای گیمرها!&quot; اگر شما هم یکی از
            عاشقان بازی‌ها هستید، جای درستی اومدید. در گیمینگ تور، دنیای گیمینگ
            از دیدگاه‌های مختلف بررسی میشه؛ از جدیدترین اخبار صنعت بازی و
            تحلیل‌های تخصصی تا نقد و بررسی‌های عمیق و تحلیل‌های جزیی. ما به شما
            کمک می‌کنیم تا همیشه از آخرین روندها و بهترین بازی‌ها باخبر بشید، و
            البته اینجا جاییه که می‌تونید تجربه‌های هیجان‌انگیز خودتون رو با
            دیگر گیمرها به اشتراک بذارید. چه شما طرفدار بازی‌های قدیمی باشید، چه
            علاقه‌مند به بازی‌های مستقل و نوآورانه، ما براتون محتوای جذاب و
            متنوعی داریم که دنیای بازی‌ها رو برای شما جذاب‌تر از همیشه می‌کنه.
          </p>

          <img
            src="/astro-Photoroom.webp"
            alt="Astro"
            className="w-[300px] lg:w-[350px] object-contain drop-shadow-[0_0_25px_rgba(255,70,85,0.5)]"
          />
        </div>

        {/* ویژگی‌ها */}
        <div className="flex justify-start mt-16 flex-wrap gap-8">
          {features.map((text, i) => (
            <h2
              key={i}
              className="text-[1.6em] font-bold text-yellow-400 px-4 py-2 rounded-md border-4 border-transparent animate-float"
              style={{
                animation: `float 3s ease-in-out ${i * 0.2}s infinite alternate, rgbLoop 6s linear ${
                  i * 0.5
                }s infinite`,
              }}
            >
              {text}
            </h2>
          ))}
        </div>

        {/* content */}
        <div className="max-w-[700px] space-y-10 text-center mt-20">
          <div className="ml">
            <h3 className="text-[1.8em] text-[#f9ce34] mb-3">ما کی هستیم؟</h3>
            <p className="leading-8">
              ما یک تیم از عاشقان دنیای بازی هستیم که می‌خوایم تجربه‌ی گیمرها رو
              به سطح بالاتری ببریم! از جدیدترین بازی‌ها تا مستقل‌های خلاقانه، ما
              همه رو دنبال می‌کنیم و بهترین تحلیل‌ها و راهنماها رو ارائه می‌دیم.
            </p>
          </div>

          <div>
            <h3 className="text-[1.8em] text-[#f9ce34] mb-3">هدف ما چیه؟</h3>
            <p className="leading-8">
              هدف ما اینه که یه جامعه‌ی پرانرژی از گیمرها بسازیم که در اون بتونی
              نقدها، راهنماها، ترفندها و حتی دوستان جدید برای بازی پیدا کنی!
            </p>
          </div>

          <div>
            <h3 className="text-[1.8em] text-[#f9ce34] mb-3">
              چرا ما رو انتخاب کنید؟
            </h3>
            <ul className="space-y-3">
              <li>✅ جدیدترین اخبار و بررسی‌ها</li>
              <li>✅ نقدهای واقعی و بی‌طرفانه</li>
              <li>✅ راهنماهای حرفه‌ای برای بازی‌ها</li>
              <li>✅ جامعه‌ای فعال از گیمرها</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[1.8em] text-[#f9ce34] mb-3">تماس با ما</h3>
            <p>
              📧 ایمیل: <strong>GamingTor@gmail.com</strong>
            </p>
            <p>
              📍 آدرس: <strong>قزوین، مینودر، فلکه هما</strong>
            </p>
            <p>📱 ما را در شبکه‌های اجتماعی دنبال کنید!</p>
          </div>
        </div>

        <div
          className="feedback-section mt-20 text-center relative"
          style={{ height: "120px", userSelect: "none" }}
        >
          <h3 className="text-[1.8em] mb-5 text-white">
            آیا این اطلاعات مفید بود؟
          </h3>
          <div
            className="flex justify-center gap-8 relative h-full items-center"
            style={{ position: "relative" }}
            onContextMenu={(e) => e.preventDefault()}
          >
            <button
              className="feedback-btn yes-btn"
              onClick={() => alert("نظر شما ثبت شد!")}
              draggable={false}
            >
              بله
            </button>
            <button
              className="feedback-btn no-btn"
              draggable={false}
              onClick={() => alert("خاب که چی")}
              onMouseEnter={(e) => {
                const btn = e.currentTarget;
                const parent = btn.parentElement;
                if (!parent) return;
                const parentWidth = parent.offsetWidth;
                const parentHeight = parent.offsetHeight;
                const btnWidth = btn.offsetWidth;
                const btnHeight = btn.offsetHeight;

                const maxX = parentWidth - btnWidth;
                const maxY = parentHeight - btnHeight;
                const randomX = Math.floor(Math.random() * Math.max(maxX, 0));
                const randomY = Math.floor(Math.random() * Math.max(maxY, 0));

                btn.style.position = "absolute";
                btn.style.left = randomX + "px";
                btn.style.top = randomY + "px";
              }}
            >
              خیر
            </button>
          </div>

          <style>{`
            .feedback-btn {
              padding: 12px 30px;
              font-size: 1.2em;
              font-weight: bold;
              border: none;
              border-radius: 10px;
              cursor: pointer;
              transition: all 0.3s ease;
              pointer-events: auto;
            }

            .yes-btn {
              background-color: #28a745;
              color: white;
            }

            .yes-btn:hover {
              background-color: #1e7e34;
            }

            .no-btn {
              background-color: #dc3545;
              color: white;
            }

            .no-btn:hover {
              background-color: #c82333;
            }
          `}</style>
        </div>

        {/* دکمه بازگشت به هوم */}
        <div className="flex justify-center mt-20">
          <button
            onClick={() => router.push("/")}
            className="bg-[#ff4655] hover:bg-[#f9ce34] text-black font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-lg cursor-pointer"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes rgbLoop {
          0% {
            border-color: rgb(255, 0, 0);
          }
          16% {
            border-color: rgb(255, 165, 0);
          }
          33% {
            border-color: rgb(255, 255, 0);
          }
          50% {
            border-color: rgb(0, 255, 0);
          }
          66% {
            border-color: rgb(0, 255, 255);
          }
          83% {
            border-color: rgb(0, 0, 255);
          }
          100% {
            border-color: rgb(255, 0, 255);
          }
        }
        .animate-float {
          animation-name: float;
          animation-duration: 3s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </section>
  );
}
