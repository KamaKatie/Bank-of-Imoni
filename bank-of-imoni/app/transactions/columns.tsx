"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Database } from "@/types/database.types";
import Image from "next/image";

import { Button } from "@/components/ui/button";

type Tables = Database["public"]["Tables"];
type TransactionsTable = Tables["transactions"];
type CategoriesTable = Tables["categories"];
type AccountTable = Tables["accounts"];

export type TransactionsWithCategoriesandAccounts = TransactionsTable["Row"] & {
  categories: CategoriesTable["Row"] | null;
  accounts: AccountTable["Row"] | null;
};

export const columns: ColumnDef<TransactionsWithCategoriesandAccounts>[] = [
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"));
      const type = row.original.type;

      const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "JPY",
      }).format(amount);

      const colorClass =
        type === "income"
          ? "text-green-600 font-medium"
          : type === "expense"
            ? "text-red-600 font-light"
            : "text-foreground";

      return (
        <div>
          <span className={`${colorClass}`}>{formattedAmount}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date");
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(new Date(date));

      return <div className="flex items-center">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description");

      if (typeof description !== "string") {
        return <div>{description}</div>;
      }

      return (
        <div>
          {description
            .split(" ")
            .map((word, index) => {
              if (word.length === 0) return word;

              // If first word and it's already all uppercase, keep it as-is
              if (index === 0 && word === word.toUpperCase()) {
                return word;
              }

              // Otherwise capitalize first letter, lowercase the rest
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(" ")}
        </div>
      );
    },
  },
  {
    id: "category",
    header: "Category",
    accessorFn: (row) => row.categories,
    cell: ({ getValue }) => {
      const category = getValue<{
        name: string;
        data_url: string | null;
      } | null>();

      if (!category) {
        return <div>Uncategorised</div>;
      }

      return (
        <div className="flex items-center gap-2">
          {category.data_url && (
            <Image
              src={category.data_url}
              alt={category.name}
              width={20}
              height={20}
            />
          )}
          <span>{category.name}</span>
        </div>
      );
    },
  },
];
