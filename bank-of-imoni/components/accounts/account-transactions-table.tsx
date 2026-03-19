"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DynamicIcon } from "lucide-react/dynamic";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SlidersHorizontal,
  BanknoteArrowUp,
  BanknoteArrowDown,
} from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import useTransactions from "@/hooks/use-transactions";
import { useAccounts } from "@/hooks/use-accounts";
import { useAccountTransactions } from "@/hooks/use-account-transactions";
import type { Database } from "@/database.types";

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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

interface AccountTransactionsTableProps {
  accountId: string;
}

export function AccountTransactionsTable({
  accountId,
}: AccountTransactionsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 14,
  });

  const router = useRouter();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { transactions, loading } = useAccountTransactions(accountId);
  const { users, categories, refresh } = useTransactions();
  const formAccounts = useAccounts();

  const [data, setData] = React.useState(transactions);

  React.useEffect(() => {
    setData(transactions);
  }, [transactions]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  const category = React.useMemo(() => {
    const categorySet = new Set<string>();
    data.forEach((item: TransactionsWithCategoriesandAccounts) => {
      const categoryName = (item as { categories?: { name?: string } | null })
        .categories?.name;
      categorySet.add(categoryName || "Uncategorised");
    });
    return Array.from(categorySet).sort();
  }, [data]);

  const categoryColumn = table.getColumn("category");
  const currentFilter = (categoryColumn?.getFilterValue() as string) || "All";
  const allCategories = ["All", ...category];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="text-sm text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="gap-2 flex flex-row items-center justify-between p-3 w-full">
        <ButtonGroup className="w-full">
          <TransactionDialog
            type="expense"
            title="Add expense"
            icon={<BanknoteArrowUp />}
            accounts={formAccounts.accounts}
            users={users}
            categories={categories}
            onTransactionCreated={refresh}
          />
          <TransactionDialog
            type="income"
            title="Add income"
            icon={<BanknoteArrowDown />}
            accounts={formAccounts.accounts}
            users={users}
            categories={categories}
            onTransactionCreated={refresh}
          />
        </ButtonGroup>

        <div className="flex gap-2">
          {categories.length > 0 && (
            <Select
              value={currentFilter}
              onValueChange={(value) => {
                categoryColumn?.setFilterValue(
                  value === "All" ? undefined : value,
                );
              }}
            >
              <SelectTrigger className="bg-muted">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {allCategories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="cursor-pointer"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        className="bg-white flex-1 overflow-hidden md:mx-3"
      >
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const uuid = (row.original as { id: string }).id;
                return (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() =>
                      router.push(`/dashboard/transactions/${uuid}`)
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No transactions found for this account.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-3 px-3 shrink-0">
        <Button
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

const columns: ColumnDef<TransactionsWithCategoriesandAccounts>[] = [
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

      return <div className="flex items-center gap-2">{formattedDate}</div>;
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
        <div className="flex items-center gap-2">
          <span className={`${colorClass}`}>{formattedAmount}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "What",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;

      if (typeof description !== "string") {
        return <div>{description}</div>;
      }

      return (
        <div className="flex items-center gap-2 overflow-hidden">
          <span>
            {description
              .split(" ")
              .map((word, index) => {
                if (word.length === 0) return word;
                if (index === 0 && word === word.toUpperCase()) {
                  return word;
                }
                return (
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
              })
              .join(" ")}
          </span>
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

      if (!filterValue || filterValue === "All") {
        return true;
      }

      if (filterValue === "Uncategorised") {
        return !category;
      }

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
        <div className="flex items-center gap-2">
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
];

export { columns };
