import './globals.css'
import { Montserrat } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { Suspense } from 'react'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata = {
  title: '성라클럽',
  description: '테니스 경기 기록 및 관리 시스템',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${montserrat.className} bg-gradient-to-br from-green-50 to-blue-50 min-h-screen`}>
        <Navbar />
        <main className="container mx-auto px-4 md:px-6 py-4 md:py-8">
          <Suspense fallback={
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                <span className="text-lg text-gray-600 font-medium">불러오는 중...</span>
              </div>
            </div>
          }>
            {children}
          </Suspense>
        </main>
        <div className="fixed -bottom-20 -left-20 w-40 h-40 bg-yellow-300 rounded-full opacity-10"></div>
        <div className="fixed -top-20 -right-20 w-40 h-40 bg-yellow-300 rounded-full opacity-10"></div>
      </body>
    </html>
  )
}
