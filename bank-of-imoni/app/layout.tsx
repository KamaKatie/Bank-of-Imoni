import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Bank of Imoni",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon.png",
  },
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
        className={`${geistSans.className} antialiased md:bg-muted h-screen overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
