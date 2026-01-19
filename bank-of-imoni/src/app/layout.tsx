import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bank of Imoni",
  description: "Imoni needs money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-green-50">
      <body>
        {children}
      </body>
    </html>
  );
}
