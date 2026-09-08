"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function Cyberpunk2077Page() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen bg-[#040410] text-white p-8 rtl" dir="rtl">
      <h2 className="text-4xl font-bold text-center mb-8">Cyberpunk 2077</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col gap-4 lg:w-1/2">
          <img
            src="/c1.webp"
            alt="Cyberpunk 1"
            className="rounded-lg shadow-lg"
          />
          <img
            src="/c2.webp"
            alt="Cyberpunk 2"
            className="rounded-lg shadow-lg"
          />
          <img
            src="/c3.webp"
            alt="Cyberpunk 3"
            className="rounded-lg shadow-lg"
          />
          <img
            src="/c4.webp"
            alt="Cyberpunk 4"
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="lg:w-1/2 space-y-6 text-right rtl">
          <p className="text-[#c27575] text-lg">
            سایبرپانک ۲۰۷۷ (به انگلیسی: Cyberpunk 2077) یک بازی ویدئویی در سبک
            نقش‌آفرینی اکشن است که توسط سی‌دی پروجکت رد توسعه یافته و به‌وسیلهٔ
            سی‌دی پراجکت در ۱۰ دسامبر ۲۰۲۰ برای مایکروسافت ویندوز، گوگل استادیا
            و کنسول‌های پلی‌استیشن ۴ و ایکس‌باکس وان منتشر شده‌است. این بازی
            همچنین در ۱۵ فوریه ۲۰۲۲ برای پلی‌استیشن ۵ و اکس‌باکس سری اکس/اس عرضه
            شد. در تریلر نمایش داده شده در ای۳ ۲۰۱۹ مشخص شد که کیانو ریوز،
            هنرپیشه کانادایی، با استفاده از موشِن کَپچِر و صداگذاری در نقش شخصیت
            جانی سیلورهند ایفای نقش می‌کند. این بازی برگرفته از فرنچایز
            سایبرپانک است و داستان آن در پادآرمان‌شهر نایت سیتی، جهانی باز که از
            ۶ منطقهٔ مشخص تشکیل شده‌است اتفاق می‌افتد. در این بازی که از زاویه
            دید اول شخص دنبال می‌شود بازیکن کنترل یک فرد مزدور با عنوان V را در
            دست خواهد داشت که می‌تواند با کسب تجربه در سه کلاس مهارت کسب کند.
          </p>

          <h3 className="text-yellow-400 text-2xl font-semibold">گیم پلی</h3>
          <hr className="border-yellow-400" />
          <p className="text-[#c27575]">
            سایبرپانک ۲۰۷۷ یک بازی نقش‌آفرینی اکشن در زاویه دید اول شخص است.
            بازیکن کنترل فردی به نام «وی: V» را در اختیار دارد و می‌تواند صدا،
            چهره، مو، ریش و سبیل، لباس‌ها، ظاهر بدنی و مهارت‌های V را شخصی‌سازی
            کند. پنج دستهٔ آماری در بازی وجود دارد، بدن، هوش، واکنش، فنی و
            خونسردی. بازیکن باید برای ارتقا و خرید ایمپلنت‌های سایبری با یک
            ریپرداک ملاقات کند. بازیکن می‌تواند سنگرگیری و هدف‌گیری کند، بدود،
            بپرد و سر بخورد. سه نوع سلاح وجود دارد که قابل شخصی‌سازی و تغییر
            هستند: قدرت، فناوری (که به دیوارها نفوذ می‌کند) و هوشمند. اسلحه‌های
            دوربرد برای کمانه کردن گلوله‌ها در جهت هدف و کاهش سرعت آن‌ها مجهز
            می‌شوند. استفادهٔ پیاپی از یک سلاح باعث افزایش دقت و سرعت خشاب پرکنی
            آن می‌شود که در انیمیشنهای شخصیت مشخص است. اسلحه‌سازان سلاح‌ها را
            تغییر و ارتقا می‌دهند و همچنین می‌توان سلاح‌های جدید از آن‌ها
            خریداری کرد یا سلاح‌های قدیمی را به آن‌ها فروخت. قابل توجه است که
            بازی را می‌توان حتی بدون کشتن کسی، با استفاده از گزینه‌های غیرکشنده
            برای سلاح و نرم‌افزارهای سایبری به پایان رساند. کلان‌شهر جهان‌باز
            نایت‌سیتی متشکل از شش منطقه است: سیتی‌سنتر، واتسون، وست‌بروک،
            هی‌وود، پسیفیکا و سانتو دومینگو. منطقهٔ اطراف شهر که بدلندز
            (Badlands) نام دارد نیز قابل کاوش است. عابران پیاده در برابر برخورد
            وسایل نقلیه آسیب‌پذیر هستند. بسته به مکان، بازیکن اگر مرتکب جرمی شود
            به پلیس گزارش داده می‌شود. همچنین ایستگاه‌های رادیویی مختلفی وجود
            دارند که می‌توان به آن‌ها گوش داد. چرخهٔ کامل روز و شب و آب و هوای
            پویا بر نحوهٔ رفتار شخصیت‌های غیر بازیکن تأثیر می‌گذارند. V یک واحد
            آپارتمان و یک گاراژ در اختیار دارد. نایت‌سیتی دارای شخصیت‌های
            غیرانگلیسی زبان است که زبان‌های آن‌ها را می‌توان با امپلنت‌های مخصوص
            ترجمه کرد. (Braindance) دستگاهی است که به بازیکن اجازه می‌دهد
            تجربیات دیگران را تجربه کند. امتیازات تجربه از مأموریت‌های اصلی به
            دست می‌آیند و آمار را تقویت می‌کنند. مأموریت‌های جانبی، مهارت‌های
            بازکردن قفل، فروشندگان، مکان‌ها و مأموریت‌های اضافی را دربردارند.
            مأموریت‌ها از شخصیت‌هایی گرفته می‌شوند که به عنوان (Fixer) شناخته
            می‌شوند. مواد مصرفی مانند نوشابه برای افزایش جان استفاده می‌شوند.
            اشیا را می‌توان در موجودی (inventory) بررسی کرد. مینی‌گیم‌ها شامل هک
            کردن، بوکس، مسابقات اتومبیل‌رانی، هنرهای رزمی و میادین تیراندازی
            است. انتخاب‌های بازیکن در طول بازی به پایان‌های مختلف می‌انجامد.
          </p>

          <h3 className="text-yellow-400 text-2xl font-semibold">داستان</h3>
          <hr className="border-yellow-400" />
          <p className="text-[#c27575]">
            بازی با انتخاب یکی از سه مسیر زندگی برای شخصیت بازیکن، V آغاز
            می‌شود: Nomad, Streetkid, Corpo. هر سه مسیر زندگی شامل شروع یک زندگی
            جدید در نایت‌سیتی با اراذل محلی از جمله جکی ولز، و داشتن
            ماجراجوییهای مختلف با یک نت‌رانر به نام T-Bug است. یک دلال محلی به
            نام دکستر دشان (Dexter DeShawn), V و جکی را اسخدام می‌کند تا یک
            بایوچیپ را که به نام (the Relic) شناخته می‌شود، از شرکت آراساکا
            بدزدند. آن‌ها Relic را بدست می‌آورند اما وقتی شاهد قتل رئیس شرکت،
            سابورو آراساکا به دست پسر خیانتکارش یورینوبو آراساکا می‌شوند نقشه به
            هم می‌خورد. یورینوبو قتل را با عنوان مسمومیت پنهان و یک عملیات
            امنیتی را آغاز می‌کند که در آن نت‌رانرهای آراساکا تی باگ را می‌کشند.
            V و جکی فرار می‌کنند، اما جکی در طی فرار به طرز مرگباری مجروح می‌شود
            و قاب محافظ Relic آسیب می‌بیند. این مسئله V را مجبور می‌کند تا
            بایوچیب را در سایبرافزار سرش وارد کند. جکی می‌میرد. V به آپارتمان
            دشان می‌رود و دشان که از توجه ناخواستهٔ پلیس خشمگین شده‌است به سر V
            شلیک و او را در محل دفن زباله در خارج از شهر رها می‌کند تا بمیرد. پس
            از بیدار شدن، V توسط شبح دیجیتال کهنه سرباز جنگ، تبدیل شده به ستارهٔ
            نمادین راک، جانی سیلورهند (Johnny Silverhand) (کیانو ریوز)، که گمان
            می‌رود در سال ۲۰۲۳ در جریان یک حملهٔ هسته‌ای به برج آراساکا جان
            باخت، تسخیر می‌شود. V از گفته‌های ویکتور وکتور، ripperdoc خود، متوجه
            می‌شود که گلولهٔ دشان نانوتکنولوژی رستاخیز را بر روی بایوچیپ ایجاد
            کرده، آسیب‌های وارده به مغز V را ترمیم کرده و اما فرآیندی
            برگشت‌ناپذیر برای بازنویسی خاطراتش با خاطرات جانی شروع شده‌است. و
            برای V تنها چند هفته باقی مانده تا این فرایند تکمیل شود و پس از آن
            او جان خود را از دست می‌دهد. بایوچیپ را نمی‌توان خارج کرد، بنابراین
            V باید راهی برای حذف جانی و زنده ماندن پیدا کند.
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
                      WINDOWS 10 64-BIT VERSION 1909 OR NEWER
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">پردازنده</td>
                    <td className="border border-yellow-400 p-2">
                      Intel Core i7-6800 یا AMD Ryzen 5 1600
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">کارت گرافیک</td>
                    <td className="border border-yellow-400 p-2">
                      Nvidia GTX 1060 یا AMD RX 580
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">رم</td>
                    <td className="border border-yellow-400 p-2">12 گیگابایت</td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">فضای خالی</td>
                    <td className="border border-yellow-400 p-2">
                      70 گیگابایت SSD
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
                      WINDOWS 10 64-BIT VERSION 1909 OR NEWER
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">پردازنده</td>
                    <td className="border border-yellow-400 p-2">
                      AMD RYZEN 5 3600X INTEL CORE i7-8700
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">کارت گرافیک</td>
                    <td className="border border-yellow-400 p-2">
                      AMD RADEON RX 5800 XT (8 GB) AMD RADEON RX 6600 XT (8 GB)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">رم</td>
                    <td className="border border-yellow-400 p-2">16 گیگابایت</td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">فضای خالی</td>
                    <td className="border border-yellow-400 p-2">
                      100 گیگابایت SSD
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="text-yellow-400 text-2xl font-semibold mt-6">بازخورد</h3>
          <hr className="border-yellow-400" />
          <p className="text-[#c27575]">
            سایبرپانک ۲۰۷۷ با تحسین‌های گسترده از جهت روایت داستان، شخصیت‌پردازی
            و گرافیک خیره‌کننده شهر نایت سیتی همراه شد. دنیای پرجزئیات و غنی
            بازی همراه با موسیقی شگفت‌انگیز توانست توجه میلیون‌ها بازیکن را در
            سراسر جهان جلب کند.
          </p>

          <div className="flex gap-10 mt-6 items-center justify-center">
            <a
              href="https://store.steampowered.com/app/1091500/Cyberpunk_2077/"
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
