import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingButton } from "@/components/floating-button";
import Providers from "@/components/providers";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { Suspense } from "react";

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
      <Providers>
        <body
          className={`${geistSans.className} antialiased md:bg-muted h-screen overflow-hidden`}
        >
          {/* Change: Use flex-col-reverse for mobile, flex-row for md+ */}
          <div className="h-full flex flex-col-reverse md:flex-row">
            {/* Sidebar container */}
            <aside className="w-full md:w-auto">
              <Sidebar />
            </aside>

            {/* Main Content Area */}
            <div className="bg-white md:drop-shadow-xl md:rounded-2xl md:my-3 md:ml-6 md:mr-3 flex-1 flex flex-col overflow-hidden">
              <Suspense>
                <Navbar />
              </Suspense>
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>

            <FloatingButton />
          </div>
        </body>
      </Providers>
    </html>
  );
}
