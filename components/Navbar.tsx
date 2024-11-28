"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActivePath = (path: string) => pathname === path;

  const navLinks = [
    { href: "/games", label: "경기 결과" },
    { href: "/versus", label: "상대 전적" },
    { href: "/rankings", label: "전체 랭킹" },
    { href: "/games/new", label: "경기 등록" },
    { href: "/players/list", label: "선수 목록" },
  ];

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-green-100 transition-colors"
            >
              클럽 매칭 테스트
            </Link>
          </div>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isActivePath(link.href)
                    ? "bg-green-700 text-white shadow-inner"
                    : "text-green-100 hover:bg-green-500/30"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 모바일 햄버거 버튼 */}
          <div className="md:hidden flex items-center z-50">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-green-100 
                hover:text-white hover:bg-green-500/30 focus:outline-none focus:ring-2 
                focus:ring-inset focus:ring-green-100"
            >
              <span className="sr-only">메뉴 열기</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div
        className={`${isMenuOpen ? "block" : "hidden"} md:hidden bg-green-700`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActivePath(link.href)
                  ? "bg-green-600 text-white"
                  : "text-green-100 hover:bg-green-500/30 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
