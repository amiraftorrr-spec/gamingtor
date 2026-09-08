"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function GtaVPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="game-detail-page min-h-screen bg-[#040410] text-white p-8 rtl" dir="rtl">
      <h2 className="text-4xl font-bold text-center mb-8">GTA V</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col gap-4 lg:w-1/2">
          <img
            src="/gta1.webp"
            alt="GTA V 1"
            className="rounded-lg shadow-lg"
          />
          <img
            src="/gta2.webp"
            alt="GTA V 2"
            className="rounded-lg shadow-lg"
          />
          <img
            src="/gta3.webp"
            alt="GTA V 3"
            className="rounded-lg shadow-lg"
          />
          <img
            src="/gta4.webp"
            alt="GTA V 4"
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="lg:w-1/2 space-y-6 text-right rtl">
          <p className="text-[#c27575] text-lg">
            اتومبیل‌دزدی بزرگ ۵ (به انگلیسی: Grand Theft Auto V) یک بازی ویدئویی
            در سبک اکشن-ماجراجویی است که توسط راک‌استار نورث توسعه یافته و
            به‌وسیلهٔ راک‌استار گیمز منتشر شده‌است. این بازی در سراسر جهان برای
            پلتفرم‌های مختلف عرضه شد و رکورد پرفروش‌ترین سرگرمی تاریخ را با بیش
            از یک میلیارد دلار فروش در سه روز ابتدایی شکست. داستان در ایالت خیالی
            سن آندریاس که بر اساس کالیفرنیای جنوبی طراحی شده، جریان دارد و ماجرای
            سه شخصیت اصلی: مایکل دی سانتا، فرانکلین کلینتون و ترور فیلیپس را
            روایت می‌کند که در تلاش برای انجام سرقت‌های بزرگ تحت فشار یک آژانس
            فاسد دولتی و مجرمان قدرتمند هستند.
          </p>

          <h3 className="text-yellow-400 text-2xl font-semibold">گیم پلی</h3>
          <hr className="border-yellow-400" />
          <p className="text-[#c27575]">
            اتومبیل‌دزدی بزرگ ۵ یک بازی اکشن-ماجراجویی است که می‌تواند از دید
            سوم‌شخص یا اول‌شخص بازی شود. بازیکنان برای پیشرفت در داستان،
            مأموریت‌هایی با اهداف خطی و مشخص را کامل می‌کنند. در بیرون از مراحل،
            بازیکنان آزادانه در دنیای جهان‌باز بازی به کاوش می‌پردازند. دنیای
            بازی شامل مناطق حومه سن آندریاس شامل شهرستان بلین و شهر خیالی لوس
            سانتوس است. بازیکنان می‌توانند با پای پیاده بدوند، بپرند، شنا کنند یا
            از وسایل نقلیه مختلف نظیر خودروها، قایق‌ها، هواپیماها و بالگردها برای
            پیمایش دنیای بازی استفاده کنند.
          </p>

          <h3 className="text-yellow-400 text-2xl font-semibold">داستان</h3>
          <hr className="border-yellow-400" />
          <p className="text-[#c27575]">
            نه سال پس از سرقت ناموفق در لودندورف، مایکل تاونلی با نام مستعار مایکل
            دی سانتا به همراه خانواده‌اش در لوس سانتوس تحت برنامه حفاظت از شاهدان
            زندگی آرامی دارد. پس از آشنایی با فرانکلین کلینتون، یک دلال خودروهای
            لوکس، و حوادثی که منجر به بدهی سنگین مایکل به یک سردسته مافیای مواد
            مخدر می‌شود، مایکل دوباره به دنیای جرم و جنایت بازمی‌گردد. این موضوع
            باعث جلب توجه ترور فیلیپس، شریک قدیمی مایکل می‌شود که سال‌ها فکر
            می‌کرد مایکل کشته شده است...
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
                      Windows 10 64 Bit, Windows 8.1 64 Bit
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">پردازنده</td>
                    <td className="border border-yellow-400 p-2">
                      Intel Core 2 Quad CPU Q6600 @ 2.40GHz
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">کارت گرافیک</td>
                    <td className="border border-yellow-400 p-2">
                      NVIDIA 9800 GT 1GB / AMD HD 4870 1GB
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">رم</td>
                    <td className="border border-yellow-400 p-2">4 گیگابایت</td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">فضای خالی</td>
                    <td className="border border-yellow-400 p-2">
                      72 گیگابایت
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
                      Windows 10 64 Bit
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">پردازنده</td>
                    <td className="border border-yellow-400 p-2">
                      Intel Core i5 3470 @ 3.2GHz / AMD X8 FX-8350 @ 4GHz
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">کارت گرافیک</td>
                    <td className="border border-yellow-400 p-2">
                      NVIDIA GTX 660 2GB / AMD HD 7870 2GB
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">رم</td>
                    <td className="border border-yellow-400 p-2">8 گیگابایت</td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">فضای خالی</td>
                    <td className="border border-yellow-400 p-2">
                      72 گیگابایت
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="text-yellow-400 text-2xl font-semibold mt-6">بازخورد</h3>
          <hr className="border-yellow-400" />
          <p className="text-[#c27575]">
            بازی به طور گسترده‌ای به عنوان یکی از بهترین بازی‌های ویدیویی ساخته شده
            مورد تحسین منتقدان قرار گرفت و رکوردهای پرفروش‌ترین محصول تفریحی را
            به خود اختصاص داد.
          </p>

          <div className="flex gap-10 mt-6 items-center justify-center">
            <a
              href="https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/"
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
