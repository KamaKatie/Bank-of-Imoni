"use client";

import { useParams } from "next/navigation";
import { useCategories } from "@/hooks/use-categories";
import { slugify } from "@/lib/utils";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import CategorySpendingChart from "@/components/categories/category-spending-chart";
import { CategoryTransactionsTable } from "@/components/categories/category-recent-transactions";

export default function Page() {
  const { categories } = useCategories();
  const params = useParams();
  const slugParam = params.slug as string;

  const category = categories.find((cat) => slugParam === slugify(cat.name));
  return (
    <div className="flex flex-col h-full items-center w-full">
      <div className="flex p-4 w-full items-center justify-between border-b">
        <p>
          Viewing details for{" "}
          <span className="font-bold text-emerald-600 underline">
            {category?.name}
          </span>
        </p>
        <ButtonGroup>
          <Button variant={"outline"}>Edit Category</Button>
        </ButtonGroup>
      </div>
      <main className="p-4 w-full h-full overflow-auto flex flex-col gap-4">
        <div className="w-full">
          <CategorySpendingChart categoryId={category?.id} />
        </div>
        <div className="bg-card rounded-xl border shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Recent Transactions
          </div>
          <div className="flex-1">
            <CategoryTransactionsTable categoryId={category?.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
