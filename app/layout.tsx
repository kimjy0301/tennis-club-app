import "./globals.css";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "경기 기록 테스트",
  description: "테니스 경기 기록 및 관리 시스템",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  minimumScale: 1.0,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={`${montserrat.className} bg-gradient-to-br from-green-50 to-blue-50 min-h-screen`}
      >
        <Navbar />
        <main className="container mx-auto px-4 md:px-6 py-4 md:py-8">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </main>
        <div className="fixed -bottom-20 -left-20 w-40 h-40 bg-yellow-300 rounded-full opacity-10 pointer-events-none"></div>
        <div className="fixed -top-20 -right-20 w-40 h-40 bg-yellow-300 rounded-full opacity-10 pointer-events-none"></div>
      </body>
    </html>
  );
}
