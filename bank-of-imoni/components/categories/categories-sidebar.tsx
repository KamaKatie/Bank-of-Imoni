"use client";

import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "lucide-react/dynamic";
import { ScrollArea } from "@/components/ui/scroll-area";
import { slugify, cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CategoriesSidebar() {
  const { categories } = useCategories();
  const pathname = usePathname();

  // Define the base path
  const isRootPath = pathname === "/dashboard/categories";

  return (
    <aside
      className={cn(
        "flex-col border-r h-full bg-background transition-all",
        // Mobile: Show only if on the root list page. Hide if a category is selected.
        isRootPath ? "flex w-full" : "hidden",
        // Desktop: Always show as a sidebar
        "md:flex md:w-64",
      )}
    >
      <ScrollArea className="flex-1 h-full">
        <div className="p-4">
          <Button variant="outline" className="w-full">
            Add Category
          </Button>
        </div>
        <div className="flex flex-col h-full">
          {categories?.map((category) => {
            const href = `/dashboard/categories/${slugify(category.name)}`;
            const isActive = pathname === href;

            return (
              <Link key={category.id} href={href}>
                <div
                  className={cn(
                    "flex gap-3 items-center p-2 border-b mx-4 my-2 rounded-xl transition-all h-full hover:bg-accent",
                    isActive
                      ? "bg-muted text-emerald-700 font-medium shadow-sm"
                      : "border-transparent",
                  )}
                >
                  <DynamicIcon
                    name={category.icon as any}
                    className={cn(
                      "w-8 h-8 rounded-full p-2 transition-colors",
                      isActive ? "bg-white text-emerald-700" : "bg-muted",
                    )}
                  />
                  {/* Remove 'hidden md:block' so text is visible on mobile list */}
                  <div className="truncate text-lg md:text-base">{category.name}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
