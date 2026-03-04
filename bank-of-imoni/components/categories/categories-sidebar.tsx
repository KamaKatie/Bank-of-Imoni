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

  return (
    <aside className="hidden md:flex md:w-64 flex-col border-r h-full bg-background">
      <ScrollArea className="flex-1 h-full">
        <div className="p-4">
          <Button variant="outline" className="w-full">
            Add Category
          </Button>
        </div>
        <div className="flex flex-col h-full">
          {categories?.map((category) => {
            const href = `/categories/${slugify(category.name)}`;
            const isActive = pathname === href;

            return (
              <Link key={category.id} href={href}>
                <div
                  className={cn(
                    "flex gap-3 items-center p-2 border-b mx-4 my-1 rounded-xl transition-all h-full hover:bg-accent",
                    isActive
                      ? "bg-muted font-medium shadow-sm"
                      : "border-transparent text-muted-foreground",
                  )}
                >
                  <DynamicIcon
                    // Casting 'as any' prevents the Lucide union-type error
                    name={category.icon as any}
                    className={cn(
                      "w-8 h-8 rounded-full p-2 transition-colors",
                      isActive
                        ? "bg-muted-foreground text-primary-foreground"
                        : "bg-muted",
                    )}
                  />
                  <div className="truncate text-sm hidden md:block">
                    {category.name}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
