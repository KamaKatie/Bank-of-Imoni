import { Suspense } from "react";
import { CategoriesSidebar } from "@/components/categories/categories-sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function CategoriesLayout({ children }: LayoutProps) {
  return (
    <div className="h-full flex w-full overflow-hidden">
      <Suspense>
        <CategoriesSidebar />
      </Suspense>

      <main className="flex-1 h-full overflow-y-auto w-full">{children}</main>
    </div>
  );
}
