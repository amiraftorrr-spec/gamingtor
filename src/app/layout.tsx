import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Gaming Tor | گیمینگ تور",
  description: "خانه‌ای جدید برای عاشقان بازی",
  metadataBase: new URL("http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Gaming Tor | گیمینگ تور",
    description: "خانه‌ای جدید برای عاشقان بازی",
    type: "website",
    locale: "fa_IR",
    url: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/android-chrome-512x512.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LenisProvider>{children}</LenisProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
