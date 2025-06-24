import type { Metadata } from "next";
// import localFont from "next/font/local";
import { Inter } from 'next/font/google'
import "./globals.css";
import { Header } from "@/components/Header";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

// const pretendard = localFont({
//   src: "../fonts/PretendardVariable.woff2",
//   display: "swap",
//   weight: "45 920",
//   variable: "--font-pretendard",
// });
const inter = Inter({ subsets: ['latin'] })

// export const revalidate = 3600;
// export const fetchCache = 'force-cache';

export const metadata: Metadata = {
  title: "팔구삼 893",
  description: "중고 경매 사이트",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const isLoggedIn = cookieStore.has("accessToken");
  
  return (
    <html lang="ko">
      <body
        className={inter.className}
        // className={`${pretendard.variable} font-pretendard`}
      >
        <header className="sticky top-0 z-50 border-b bg-background">
          <div className="flex h-16 items-center px-32">
            <Header isLoggedIn={isLoggedIn} />
          </div>
        </header>
        {children}
        <SpeedInsights />
        <Analytics />
        {/* Toaster 컴포넌트 추가 */}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              zIndex: 9999,
              padding: '20px',
            },
          }}
        />
      </body>
    </html>
  );
}
