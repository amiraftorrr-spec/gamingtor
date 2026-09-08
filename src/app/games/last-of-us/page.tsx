"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function TheLastOfUsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="game-detail-page min-h-screen bg-[#040410] text-white p-8 rtl" dir="rtl">
      <h2 className="text-4xl font-bold text-center mb-8">The Last of Us</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col gap-4 lg:w-1/2">
          <img
            src="/last1.webp"
            alt="Last of Us 1"
            className="rounded-lg shadow-lg"
          />
          <img
            src="/last2.webp"
            alt="Last of Us 2"
            className="rounded-lg shadow-lg"
          />
          <img
            src="/last3.webp"
            alt="Last of Us 3"
            className="rounded-lg shadow-lg"
          />
          <img
            src="/last4.webp"
            alt="Last of Us 4"
            className="rounded-lg shadow-lg"
          />
          <img
            src="/last5.webp"
            alt="Last of Us 5"
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="lg:w-1/2 space-y-6 text-right rtl">
          <p className="text-[#c27575] text-lg">
            آخرین بازمانده از ما[۱] (انگلیسی: The Last of Us) یک بازی ویدئویی
            اکشن-ماجراجویی است که توسط ناتی داگ توسعه یافته و به‌وسیلهٔ سونی
            کامپیوتر انترتینمنت در سال ۲۰۱۳ عرضه شد. داستان بازی در سراسر ایالات
            متحده پس از پسارستاخیزی رخ می‌دهد و بازیکن باید جوئل، که وظیفه
            اسکورت دختر نوجوان، الی، را بر عهده دارد را کنترل کند. آخرین
            بازمانده از ما از دید سوم شخص بازی می‌شود. بازیکنان از اسلحه گرم و
            سلاح‌های بداهه استفاده می‌کنند و می‌توانند از مخفی‌کاری برای دفاع در
            برابر انسان‌های خصمانه و موجودات همنوع‌خوار آلوده به عفونت قارچی جهش
            یافته در ژن سرچماقی‌ها استفاده کنند. این بازی به‌طور رسمی در ۱۰
            دسامبر ۲۰۱۱ در همایش جوایز بازی ویدئویی اسپایک معرفی شد. در نمایشگاه
            ای۳ ۲۰۱۲، آخرین بازمانده از ما توانست ۵ جایزه از جمله بهترین نمایش،
            بهترین بازی، بهترین بازی کنسولی، بهترین اکشن ماجراجویی و بهترین صدا
            را از آن خود کند. به عنوان یکی از بهترین بازی‌های ویدئویی نسل هفتم
            کنسول‌های بازی، آخرین بازمانده از ما توانست بیش از ۲۵۰ جایزه برترین
            بازی سال را دریافت کند و یکی از موفق‌ترین بازی‌های تاریخ در این
            زمینه محسوب می‌شود و بدین سبب یکی از برترین بازی‌های ویدئویی تمام
            دوران‌ها در نظر گرفته می‌شود. آخرین بازمانده از ما پس از
            اتومبیل‌دزدی بزرگ ۵، عنوان دومین بازی پرفروش سال ۲۰۱۳ را از آن خود
            کرد و تا اوت ۲۰۱۴ توانسته بیش از ۸ میلیون نسخه در سراسر جهان به فروش
            برساند. نسخهٔ جدید و بروز شده از لحاظ گرافیکی این بازی به نام آخرین
            بازمانده از ما بازسازی شده (به انگلیسی: The Last Of Us Remastered)
            نیز برای پلی‌استیشن ۴ در ژوئیه ۲۰۱۴ منتشر شده‌است. این نسخه همچنین
            دارای محتوای قابل دانلود شامل مرحله‌ای به نام رها شده می‌باشد که در
            ۱۴ فوریه ۲۰۱۴ عرضه گردید. دنبالهٔ این بازی با عنوان آخرین بازمانده
            از ما قسمت ۲ در دسامبر ۲۰۱۶ رونمایی شد و در تاریخ ۱۹ ژوئن ۲۰۲۰ به
            صورت انحصاری برای کنسول پلی‌استیشن ۴ منتشر شد.
          </p>

          <h3 className="text-yellow-400 text-2xl font-semibold">گیم پلی</h3>
          <hr className="border-yellow-400" />
          <p className="text-[#c27575]">
            آخرین بازمانده از ما یک بازی اکشن ماجراجویی و ترس و بقا با دوربین
            سوم شخص است. بازیکن کنترل شخصیت جوئل را به‌دست می‌گیرد، درحالی که
            دختری به نام الی همراه شماست و توسط هوش مصنوعی هدایت می‌شود. روند
            بازی به صورت مرحله‌ای می‌باشد به این گونه که بازی از مرحله اول شروع
            می‌شود و بازیکن در ابتدای هر مرحله در مبدأ مسیری قرار دارد و باید به
            سمت مقصد حرکت کند و در مسیر هرگاه با دشمنان خود روبرو شد باید با
            آن‌ها درگیر شود و شکستشان دهد و اگر الی توسط دشمنان به خطر افتاد
            بازیکن باید الی را نجات دهد و از او محافظت کند، در نتیجه پس از رسیدن
            به مقصد بازیکن آن مرحله را تمام کرده و وارد مرحله بعدی می‌شود.
            سلاح‌ها در این بازی توسط بازیکن جمع‌آوری می‌شود، یعنی بازیکن برای
            برداشتن سلاح جدید مجبور به رها کردن سلاحی که در دست دارد نیست. هر
            سلاح در جای خاصی قرار داده شده و بازیکن اگر نتواند آن سلاح را پیدا
            کند آن سلاح را از دست داده‌است. بازیکنان همچنین می‌توانند مواردی
            مانند الکل، پارچه، ماده منفجره و… را در محیط بازی پیدا کرده و پس از
            رساندن این ماده‌ها به حد نصاب آیتم‌هایی مانند کیت سلامت، کوکتل
            مولوتوف، بمب دودزا و… را کرفت کنند. کرفت کردن هر آیتم در ابتدا قفل
            می‌باشد تا زمانی که بازیکن نتواند آن آیتم را در محیط بازی پیدا کند
            کرفت کردن آن آیتم نیز باز می شود حالا چند عکس از بازی مشاهده می
            کنید{" "}
          </p>

          <h3 className="text-yellow-400 text-2xl font-semibold">داستان</h3>
          <hr className="border-yellow-400" />
          <p className="text-[#c27575]">
            در سال ۲۰۱۳ میلادی قارچی در جهان شیوع پیدا می‌کند که افراد مبتلا را
            به موجودات خونخواری تبدیل می‌کند که اختیار کارهایشان را ندارند و
            ناخودآگاه به افراد سالم حمله‌ور می‌شوند. بیست سال از شیوع قارچ
            می‌گذرد و در سال ۲۰۳۳ دیگر تمدنی وجود ندارد و چیزی حدود شصت درصد از
            مردم جهان یا مفقودالاثر شده‌اند یا به ویروس مبتلا شده‌اند. حال گروهی
            به نام فایرفلایز به رهبری شخصی به نام مارلین تشکیل شده‌است که آن‌ها
            معتقدند برای مقابله با این قارچ راهی وجود دارد و هدف از تشکیل این
            گروه پیدا کردن راه مقابله و بازگشت دوباره به زندگی معمولی است. دختری
            چهارده ساله به نام الی یکبار در معرض این قارچ قرار گرفته اما به این
            قارچ مبتلا نشده و وقتی مارلین متوجه وجود الی و اتفاقی که براش پیش
            آمده می‌شود، معتقد می‌شود که الی راه حل مقابله با این قارچ است
            مارلین وظیفه رساندن الی به آزمایشگاه فایرفلایز را به یک قاچاقچی به
            نام جوئل می‌سپارد، جوئل و الی که در ابتدا نسبت به هم بی‌احساس بودن،
            اما هرچه به آزمایشگاه فایرفلایز نزدیک‌تر می‌شوند نسبت به هم وابستگی
            بیشتری پیدا می‌کنند و جوئل تبدیل به تنها کسی می‌شود که الی به آن
            اطمینان کامل دارد…
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
                      AMD RYZEN 5 1500X INTEL CORE i7-4770K
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">کارت گرافیک</td>
                    <td className="border border-yellow-400 p-2">
                      AMD RADEON 470 (4 GB) NVIDIA GEFORCE GTX 970 (4 GB)
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

            <div className="flex-1">
              <h5 className="text-yellow-400 font-semibold mb-2">
                سیستم پیشنهادی
              </h5>
              <table className="table-auto border border-yellow-400 text-white w-full">
                <tbody>
                  <tr>
                    <td className="border border-yellow-400 p-2">سیستم عامل</td>
                    <td className="border border-yellow-400 p-2">
                      WINDOWS 10 / 11 64-BIT (VERSION 1909+)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">پردازنده</td>
                    <td className="border border-yellow-400 p-2">
                      AMD RYZEN 5 3600X / INTEL CORE i7-8700
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">کارت گرافیک</td>
                    <td className="border border-yellow-400 p-2">
                      NVIDIA GEFORCE RTX 2070 SUPER (8 GB) / AMD RADEON RX 6600 XT (8 GB)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">رم</td>
                    <td className="border border-yellow-400 p-2">16 گیگابایت</td>
                  </tr>
                  <tr>
                    <td className="border border-yellow-400 p-2">فضای خالی</td>
                    <td className="border border-yellow-400 p-2">
                      100 گیگابایت NVMe SSD
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="text-yellow-400 text-2xl font-semibold mt-6">بازخورد</h3>
          <hr className="border-yellow-400" />
          <p className="text-[#c27575]">
            آخرین بازمانده از ما بسیار مورد تحسین منتقدان و وبگاه‌های نقد بازی
            قرار گرفت و توانست بیش از ۵۰ نمره کامل را از آن‌ها دریافت کند و با
            میانگین امتیاز ۹۵٫۰۹ و ۹۵ از ۱۰۰ به ترتیب در وبگاه‌های گیم‌رنکینگز و
            متاکریتیک قرار دارد. این بازی در ایالت انگلستان به مدت شش هفته در
            شماره یک جدول پر فروش‌ها قرار داشت. آخرین بازمانده از ما در هفته اول
            فروش توانست ۱٫۳ میلیون نسخه و در هفته سوم ۳٫۴ میلیون نسخه در سرتاسر
            جهان بفروش برساند، که این فروش آن را به پرفروش‌ترین بازی زمان عرضه در
            سال ۲۰۱۳ مبدل نمود که بعد از عرضه شدن اتومبیل‌دزدی بزرگ ۵ عنوان
            پرفروش‌ترین به این بازی سپرده شد. آخرین بازمانده از ما تا ژوئیه ۲۰۱۴
            توانسته بیش از ۷ میلیون نسخه در سراسر جهان به فروش برساند. همچنین این
            بازی با دریافت ۲۵۷ جایزه «بازی سال» یکی از پرافتخارترین بازی های
            تاریخ است.
          </p>

          {/* دکمه خرید */}
          <div className="flex gap-10 mt-6 items-center justify-center">
            <a
              href="https://store.steampowered.com/app/1888930/The_Last_of_Us_Part_I/"
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
