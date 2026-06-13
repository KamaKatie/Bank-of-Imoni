"use client";

import * as React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Toaster } from "@/components/ui/sonner";
import { SettlementCard } from "@/components/transactions/settlement-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { ButtonGroup } from "@/components/ui/button-group";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import { Sheet, List, BanknoteArrowUp, BanknoteArrowDown } from "lucide-react";

import useTransactions from "@/hooks/use-transactions";
import { useAccounts } from "@/hooks/use-accounts";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function Page() {
  const { transactions, users, categories, refresh } = useTransactions();
  const formAccounts = useAccounts();

  const [viewMode, setViewMode] = React.useState<"table" | "list">("table");

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: transactions,
    columns,
    state: { sorting, columnFilters, columnVisibility, pagination },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const calculatePageSize = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.offsetHeight;
        // Define your estimated row heights
        const rowHeight = viewMode === "table" ? 45 : 55;

        // Calculate, leaving a bit of "buffer" for headers/padding
        const newPageSize = Math.floor(containerHeight / rowHeight);

        // Ensure we have at least 1 item
        table.setPageSize(Math.max(1, newPageSize));
      }
    };

    calculatePageSize();
    window.addEventListener("resize", calculatePageSize);
    return () => window.removeEventListener("resize", calculatePageSize);
  }, [viewMode, table]);

  const categoryList = React.useMemo(() => {
    const categorySet = new Set<string>();
    transactions.forEach((item: any) => {
      const categoryName = item.categories?.name;
      categorySet.add(categoryName || "Uncategorised");
    });
    return Array.from(categorySet).sort();
  }, [transactions]);

  const categoryColumn = table.getColumn("category");
  const currentFilter = (categoryColumn?.getFilterValue() as string) || "All";
  const allCategories = ["All", ...categoryList];

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex flex-col p-4 h-full w-full gap-4">
        {/* Top Header: Actions & Filters */}
        <div className="md:hidden block">
          <SettlementCard />
        </div>
        <div className="flex justify-between gap-2 bg-slate-50 p-2 rounded-lg border">
          <div className="flex gap-2 w-full">
            <ButtonGroup>
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

            <Input
              placeholder="Search..."
              value={
                (table.getColumn("description")?.getFilterValue() as string) ??
                ""
              }
              onChange={(e) =>
                table.getColumn("description")?.setFilterValue(e.target.value)
              }
              className="bg-white"
            />

            {/* Category Filter */}
            <Select
              value={currentFilter}
              onValueChange={(value) => {
                categoryColumn?.setFilterValue(
                  value === "All" ? undefined : value,
                );
              }}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* View Switcher */}
            <ButtonGroup>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("table")}
              >
                <Sheet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </ButtonGroup>
          </div>
        </div>

        {/* View Rendering */}
        <div ref={containerRef} className="flex-1 overflow-auto">
          {viewMode === "table" ? (
            <DataTable table={table} columns={columns} />
          ) : (
            <div className="flex flex-col gap-2">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <div
                    key={row.id}
                    className="p-4 border rounded-xl bg-white shadow-sm hover:border-emerald-700 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {new Date(
                          (row.original as any).date,
                        ).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "numeric",
                        })}{" "}
                        -{" "}
                        {(row.original as any).categories?.name ||
                          "Uncategorised"}
                      </span>
                      <span
                        className={`font-mono font-bold ${(row.original as any).type === "expense" ? "text-red-500" : "text-green-500"}`}
                      >
                        {(row.original as any).type === "expense" ? "-" : "+"}
                        {(row.original as any).amount}
                      </span>
                    </div>
                    <p className="font-medium">
                      {(row.original as any).description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-5 text-center text-muted-foreground">
                  No transactions found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Unified Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <span className="text-sm text-muted-foreground mr-4">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
