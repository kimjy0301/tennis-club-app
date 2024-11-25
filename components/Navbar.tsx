'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="tennis-gradient text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl tennis-ball">🎾</span>
              <span className="text-xl font-bold group-hover:text-yellow-300 transition-colors">
                성라클럽
              </span>
            </Link>
          </div>
          
          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium 
                ${pathname === '/'
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                } transition-all duration-200`}
            >
              경기 기록
            </Link>
            <Link
              href="/players"
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium 
                ${pathname === '/players'
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                } transition-all duration-200`}
            >
              선수 통계
            </Link>
            <Link
              href="/games/new"
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium 
                ${pathname === '/games/new'
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                } transition-all duration-200`}
            >
              새 경기
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/80 
                hover:text-white hover:bg-white/10 focus:outline-none"
            >
              <span className="sr-only">메뉴 열기</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden bg-green-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/games"
              className={`block px-3 py-2 rounded-md text-base font-medium 
                ${pathname === '/games'
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
            >
              경기 기록
            </Link>
            <Link
              href="/players"
              className={`block px-3 py-2 rounded-md text-base font-medium 
                ${pathname === '/players'
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
            >
              선수 통계
            </Link>
            <Link
              href="/games/new"
              className={`block px-3 py-2 rounded-md text-base font-medium 
                ${pathname === '/games/new'
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
            >
              새 경기
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
} 