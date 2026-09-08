"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function GodOfWarPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="game-detail-page min-h-screen bg-[#040410] text-white p-8 rtl" dir="rtl">
      <h2 className="text-4xl font-bold text-center mb-8">
        God of War: Ragnarök
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col gap-4 lg:w-1/2">
          <img
            src="/god1.webp"
            alt="God of War 1"
            className="rounded-lg shadow-lg"
          />
          <img
            src="/god2.webp"
            alt="God of War 2"
            className="rounded-lg shadow-lg"
          />
          <img
            src="/god3.webp"
            alt="God of War 3"
            className="rounded-lg shadow-lg"
          />
          <img
            src="/god4.webp"
            alt="God of War 4"
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="lg:w-1/2 space-y-6 text-right rtl">
          <p className="text-[#c27575] text-lg">
            خدای جنگ: رگناروک (به انگلیسی: God of War: Ragnarök) یک بازی ویدئویی
            در سبک اکشن-ماجراجویی است که توسط استودیو سنتا مونیکا توسعه یافته و
            به‌وسیلهٔ سونی اینتراکتیو انترتینمنت منتشر شده‌است. این بازی در
            تاریخ ۹ نوامبر ۲۰۲۲، برای کنسول‌های پلی‌استیشن ۴ و پلی‌استیشن ۵ [۱]
            و در تاریخ ۱۹ سپتامبر ۲۰۲۴، برای مایکروسافت ویندوز در سراسر جهان
            عرضه شد. رگناروک به عنوان نهمین قسمت در مجموعه بازی‌های خدای جنگ
            به‌شمار می‌رود و دنبالهٔ نسخه سال ۲۰۱۸ خدای جنگ محسوب می‌شود و
            کارگردان آن اریک ویلیامز است که در تولید اکثر نسخه‌های خدای جنگ نقش
            کلیدی داشته‌است. این بازی همانند نسخه پیشین، با الهام از
            اسطوره‌شناسی اسکاندیناوی و در نروژ باستان روایت می‌شود و شخصیت اصلی
            بازی کماکان کریتوس است. داستان بازی با اقتباس از وقایع رگناروک
            می‌باشد، مجموعه رخدادهایی که فرجام خدایان یا پایان جهان را در اساطیر
            اسکاندیناوی رقم می‌زند و مرگ خدایان نورس را به تصویر می‌کشد که در
            بازی قبلی، بعد از اینکه کریتوس خدای آسیر بالدر را کشت، اتفاق خواهد
            افتاد. در ماه پس از اعلامیه بازی در سپتامبر ۲۰۲۰، بسیاری از
            روزنامه‌نگاران و وبسایت‌های بازی، رگناروک را به عنوان یکی از مورد
            انتظارترین بازی‌های خود در نظر گرفتند؛ این بازی به ترتیب جوایز «بازی
            بیش از همه خواستنی» و «بازی بیش از همه ذکرشده» را از جوایز گلدن
            جوی‌استیک ۲۰۲۰ و پلی‌استیشن. بلاگ به دست آورد. این بازی در ابتدا
            قرار بود در سال ۲۰۲۱ عرضه شود، اما به دلیل دنیاگیری کووید-۱۹ بر
            توسعهٔ بازی، انتشار آن به تأخیر افتاد.
          </p>

          <h3 className="text-yellow-400 text-2xl font-semibold">گیم پلی</h3>
          <hr className="border-yellow-400" />
          <p className="text-[#c27575]">
            کریتوس در این دی‌ال‌سی با ورود به والهالا، وارد اتاق‌ها و محیط‌های
            مختلف می‌شود و با پاسکازی محیط از انمی‌ها و گشت و گذار می‌تواند
            صندوق‌هایی را به که عنوان پاداش قرار داده‌ شده‌اند‌ باز کند. این
            صندوق‌ها برای قوی‌تر شدن کریتوس در نظر گرفته‌ شده‌اند. در این بسته
            الحاقی اگر کریتوس بمیرد مجدد در کنار دروازه والهالا ظاهر خواهد شد.
            در این بسته که روگ لایک است با مردن کریتوس تمام دستاورد‌های خود را
            از دست نمی‌دهید و با پیشروی در بازی تعدادی آیتم از جمله: Mastery
            Seal را بدست می‌‌آورید که مانند پول در بازی عمل می‌کند و با استفاده
            از آن می‌توانید کریتوس را بیش از پیش قوی کنید‌. در بسته الحاقی
            والهالا سیستم مبارزات به‌ این شکل است که با وارد شدن هرباره از
            دروازه والهالا به داخل آن، در انتهای هر رویارویی با دشمنان و شکست
            دادن آنها برای او جوایزی ظاهر می‌شود. برخی از پاداش‌ها عبارتند از:
            افزایش رونیک اتک، افزایش Stat، پرک‌هایی برای سلاح‌ها و موارد دیگر،
            این پاداش‌ها تعیین کننده نحوه مبارزه کردن پلیر است، پاداش‌های به
            گونه‌ای هستند که به خوبی می‌توانید Build مورد نیاز خود را بسازید و
            به شکلی که دوست دارید بازی را تجربه کنید. برای دوباره زنده شدن
            کریتوس می‌توانید به صورت دائم دو سنگ Resurrection را بسازید‌. در این
            بسته مینی‌باس‌های متعدد و بسیاری وجود دارد. از نظر فنی این بسته
            تجربه‌ای روان را از بازی ارائه می‌دهد و بازیکنان شاهد افت‌فریم و
            باگ‌‌ نیستند.[۴] ساندترک‌هایی برای این بسته در نظر گرفته شده‌اند که
            در سبک و کانسپت خدای جنگ ۲۰۱۸ و خدای جنگ: رگناروک هستند اما ترک‌هایی
            هم وجود دارند که از ساندترک‌های نسخه‌های سری یونانی بازی هستند و
            بعضی از آنها حتی با سبک موسیقی نسخه‌های سری نورس هم آمیخته شده‌اند.
            شمشیر‌ الیمپوس و اسکین سری یونانی کریتوس هم از موارد اضافه شده به
            بازی هستند و بازیکن با پیشروی در بازی شمشیر الیمپوس و با تمام کردن
            آن از اسکین سری یونانی می‌تواند استفاده کند، شمشیر الیمپوس قابلیت
            استفاده به صورت سلاح دائم (مانند: تبر، تیغه‌های آشوب و نیزه دراپنیر)
            را ندارد و فقط در حالت ریج یا خشم کریتوس می‌توان آن را تا پایان مدت
            ریج استفاده کرد.
          </p>

          <h3 className="text-yellow-400 text-2xl font-semibold">داستان</h3>
          <hr className="border-yellow-400" />
          <p className="text-[#c27575]">
            فریا که یکی از طلسم‌های اودین (Odin) را باطل کرد و دوباره توانایی
            مبارزه را به‌دست آورده، همچنان می‌خواهد انتقام بالدر را از کریتوس
            بگیرد. آترئوس آرام‌وقرار ندارد و وقتی یک گرگ به اسم فنریر را از دست
            می‌دهد، ناآرام‌تر می‌شود. کریتوس به پسر خود می‌گوید که آن‌ها باید
            برای از راه رسیدن روزی آماده باشند که دیگر چاره‌ای جز نبرد ندارند.
            ولی آترئوس به‌عنوان یک نوجوان با مهارت‌های مبارزه‌ای بهبودیافته نسبت
            به قبل، صبور نیست. او عطش پیدا کردن جواب چند سؤال مهم درباره‌ی
            رگناروک را دارد...
          </p>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h5 className="text-yellow-400 font-semibold mb-2">
                حداقل سیستم مورد نیاز
              </h5>
              <table className="table-auto border border-yellow-400 text-white w-full">
                <tbody>
                  <tr>
                    <td className="border border-yellow-400 p-2">سیستم عامل</td>
                    <td className="border border-yellow-400 p-2">
                      Windows 10 64-bit (Version 1909+)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">پردازنده</td>
                    <td className="border border-yellow-400 p-2">
                      Intel Core i5-4670K / AMD Ryzen 3 1200
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">کارت گرافیک</td>
                    <td className="border border-yellow-400 p-2">
                      NVIDIA GeForce GTX 1060 (6 GB) / AMD Radeon RX 5500 XT (8 GB)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">رم</td>
                    <td className="border border-yellow-400 p-2">16 گیگابایت</td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">فضای خالی</td>
                    <td className="border border-yellow-400 p-2">
                      190 گیگابایت SSD
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-1">
              <h5 className="text-yellow-400 font-semibold mb-2">
                سیستم پیشنهادی
              </h5>
              <table className="table-auto border border-yellow-400 text-white w-full">
                <tbody>
                  <tr>
                    <td className="border border-yellow-400 p-2">سیستم عامل</td>
                    <td className="border border-yellow-400 p-2">
                      Windows 10 / 11 64-bit
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">پردازنده</td>
                    <td className="border border-yellow-400 p-2">
                      Intel Core i5-8600 / AMD Ryzen 5 3600
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">کارت گرافیک</td>
                    <td className="border border-yellow-400 p-2">
                      NVIDIA GeForce RTX 2060 Super (8 GB) / AMD Radeon RX 5700 (8 GB)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">رم</td>
                    <td className="border border-yellow-400 p-2">16 گیگابایت</td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">فضای خالی</td>
                    <td className="border border-yellow-400 p-2">
                      190 گیگابایت SSD
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="text-yellow-400 text-2xl font-semibold mt-6">بازخورد</h3>
          <hr className="border-yellow-400" />
          <p className="text-[#c27575]">
            خدای جنگ رگناروک در پلی‌استیشن ۵ بر اساس بازبینی جمعی وبگاه متاکریتیک
            امتیاز ۹۴/۱۰۰ را کسب کرده‌است که نشان‌دهندهٔ «تحسین همگانی» است.
            امتیاز این بازی با قسمت ۲۰۰۵ و ۲۰۱۸ در متاکریتیک برابری کرد.
          </p>

          <div className="flex gap-10 mt-6 items-center justify-center">
            <a
              href="https://store.steampowered.com/app/2322010/God_of_War_Ragnark/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-gradient-to-r from-yellow-400 to-red-600 text-black font-bold py-2 px-6 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer">
                استیم
              </button>
            </a>
            <Link href="/">
              <button className="bg-gradient-to-r from-red-600 to-yellow-400 text-black font-bold py-2 px-6 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer">
                بازگشت
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
