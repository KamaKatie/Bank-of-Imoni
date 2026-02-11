"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Database } from "@/types/database.types";
import { DynamicIcon } from "lucide-react/dynamic";
import Image from "next/image";

type Tables = Database["public"]["Tables"];
type TransactionsTable = Tables["transactions"];
type CategoriesTable = Tables["categories"];
type AccountTable = Tables["accounts"];
type ProfilesTable = Tables["profiles"];

export type TransactionsWithCategoriesandAccounts = TransactionsTable["Row"] & {
  categories: CategoriesTable["Row"] | null;
  accounts:
    | (AccountTable["Row"] & {
        profiles: ProfilesTable["Row"] | null;
      })
    | null;
};

export const columns: ColumnDef<TransactionsWithCategoriesandAccounts>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          When
        </button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as string | number | Date;
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
      }).format(new Date(date));

      return (
        <div className="flex items-center justify-center gap-2">
          {formattedDate}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
        </button>
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
          ? "text-green-600 font-semibold"
          : type === "expense"
            ? "text-red-600"
            : "text-foreground";

      return (
        <div className="flex items-center justify-center gap-2">
          <span className={`${colorClass}`}>{formattedAmount}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "What",
    cell: ({ row }) => {
      const description: React.ReactNode = row.getValue("description");

      if (typeof description !== "string") {
        return <div>{description}</div>;
      }

      return (
        <div className="flex items-center justify-center gap-2">
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
    filterFn: (row, columnId, filterValue) => {
      const category = row.getValue<{
        name: string;
        icon: string | null;
      } | null>(columnId);

      // Show everything
      if (!filterValue || filterValue === "All") {
        return true;
      }

      // Uncategorised rows
      if (filterValue === "Uncategorised") {
        return !category;
      }

      // Match by category name
      return category?.name === filterValue;
    },
    cell: ({ getValue }) => {
      const category = getValue<{
        name: string;
        icon: string | null;
      } | null>();

      if (!category) {
        return <div>Uncategorised</div>;
      }

      return (
        <div className="flex items-center justify-center gap-2">
          {category.icon && (
            <DynamicIcon
              name={category.icon as "type"}
              size={15}
              strokeWidth={1}
            />
          )}
          <span className="hidden md:grid font-light">{category.name}</span>
        </div>
      );
    },
  },
  {
    id: "By",
    header: "By",
    cell: ({ row }) => {
      const profile = row.original.accounts?.profiles;
      return (
        <div className="flex items-center justify-center gap-2">
          {profile?.image && (
            <Image
              src={profile.image}
              alt={profile.first_name}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          {profile?.first_name}
        </div>
      );
    },
  },
];
