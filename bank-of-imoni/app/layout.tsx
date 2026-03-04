import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
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
          <div className="h-full flex flex-col-reverse md:flex-row">
            <aside className="w-full md:w-auto">
              <Sidebar />
            </aside>

            <div className="bg-muted md:bg-white md:drop-shadow-xl md:rounded-2xl md:m-3 flex-1 flex flex-col overflow-hidden">
              <Suspense>
                <Navbar />
              </Suspense>
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </body>
      </Providers>
    </html>
  );
}
