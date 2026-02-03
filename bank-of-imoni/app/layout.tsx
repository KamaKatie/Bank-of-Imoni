import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Bank of Imoni",
};

const geistSans = Geist_Mono({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} antialiased bg-emerald-700 h-screen overflow-hidden`}
      >
        <div className="h-full grid grid-rows-[1fr_auto] md:grid-rows-[auto_1fr]">
          <div className="row-start-2 md:row-start-1">
            <Navbar />
          </div>
          <main className="bg-white drop-shadow-2xl md:rounded-2xl md:mx-3 md:mb-3 overflow-y-auto row-start-1 md:row-start-2">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
