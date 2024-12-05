import "./globals.css";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE || "경기 기록 테스트",
  description: "테니스 경기 기록 및 관리 시스템",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  minimumScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={`${montserrat.className} bg-gradient-to-bc from-green-50 to-blue-50 min-h-screen`}
      >
        <Navbar />
        <main className="container mx-auto px-4 md:px-6 py-4 md:py-8 min-h-[calc(100vh-0px)]">
          <Suspense fallback={<div></div>}>{children}</Suspense>
        </main>
        <footer className="text-center py-6 bg-gradient-to-br from-green-500 to-green-800 text-white shadow-lg">
          <p className="text-sm font-semibold ">Created by: Jiyong Kim </p>
          <p className="text-sm mt-2">010-8807-0301</p>
          <p className="text-sm mt-2">© 2024 All Rights Reserved</p>
        </footer>
        <div className="fixed -bottom-20 -left-20 w-40 h-40 bg-yellow-300 rounded-full opacity-10 pointer-events-none"></div>
        <div className="fixed -top-20 -right-20 w-40 h-40 bg-yellow-300 rounded-full opacity-10 pointer-events-none"></div>
      </body>
    </html>
  );
}
