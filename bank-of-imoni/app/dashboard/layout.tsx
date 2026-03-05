import Providers from "@/components/providers";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { Suspense } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <div className="h-full flex flex-col-reverse md:flex-row">
        <aside className="w-full md:w-auto">
          <Suspense>
            <Sidebar />
          </Suspense>
        </aside>

        <div className="bg-muted md:bg-white md:drop-shadow-xl md:rounded-2xl md:m-3 flex-1 flex flex-col overflow-hidden">
          <Suspense>
            <Navbar />
          </Suspense>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
