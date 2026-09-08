"use client";

import React from "react";
import Link from "next/link";

export default function RedDeadRedemptionPage() {
  return (
    <div className="game-detail-page min-h-screen bg-[#040410] px-6 py-12 text-white rtl text-center" dir="rtl">
      <p className="text-2xl text-yellow-400 mb-8">داریم روش کار میکنیم</p>
      <Link href="/">
        <button className="bg-gradient-to-r from-red-600 to-yellow-400 text-black font-bold py-2 px-6 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer">
          بازگشت به خانه
        </button>
      </Link>
    </div>
  );
}
