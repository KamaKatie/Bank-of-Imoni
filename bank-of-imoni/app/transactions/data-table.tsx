"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

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
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import useTransactions from "@/hooks/use-transactions";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // 1. Initialize pagination state
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10, // Initial fallback
  });

  const router = useRouter();
  const containerRef = React.useRef<HTMLDivElement>(null);

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
    onPaginationChange: setPagination, // 2. Add handler
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination, // 3. Connect state
    },
  });

  // 4. Dynamic Page Size Logic
  React.useLayoutEffect(() => {
    const calculatePageSize = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const headerHeight = 50; // Standard Shadcn TableHeader height
        const rowHeight = 40; // Standard row height (adjust if your rows are taller)

        const availableHeight = containerHeight - headerHeight;
        const calculatedPageSize = Math.floor(availableHeight / rowHeight);

        if (
          calculatedPageSize > 0 &&
          calculatedPageSize !== pagination.pageSize
        ) {
          setPagination((prev) => ({
            ...prev,
            pageSize: calculatedPageSize,
          }));
        }
      }
    };

    calculatePageSize();
    window.addEventListener("resize", calculatePageSize);
    return () => window.removeEventListener("resize", calculatePageSize);
  }, [pagination.pageSize]);

  const category = React.useMemo(() => {
    const categorySet = new Set<string>();
    data.forEach((item) => {
      const categoryName = (item as { categories?: { name?: string } | null })
        .categories?.name;
      categorySet.add(categoryName || "Uncategorised");
    });
    return Array.from(categorySet).sort();
  }, [data]);

  const categoryColumn = table.getColumn("category");
  const currentFilter = (categoryColumn?.getFilterValue() as string) || "All";
  const allCategories = ["All", ...category];
  const { accounts, users, categories, refresh } = useTransactions();

  return (
    <div className="flex flex-col w-full h-full min-h-[500px]">
      <div className="gap-2 flex flex-row items-center justify-between p-3">
        <ButtonGroup>
          <TransactionDialog
            type="expense"
            title="Add expense"
            icon={<BanknoteArrowUp />}
            accounts={accounts}
            users={users}
            categories={categories}
            onTransactionCreated={refresh}
          />
          <TransactionDialog
            type="income"
            title="Add income"
            icon={<BanknoteArrowDown />}
            accounts={accounts}
            users={users}
            categories={categories}
            onTransactionCreated={refresh}
          />
        </ButtonGroup>
        <div className="flex gap-2">
          <Input
            placeholder="Search"
            value={
              (table.getColumn("description")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("description")?.setFilterValue(event.target.value)
            }
            className="md:w-80 w-min bg-muted"
          />
          {categories.length > 0 && (
            <Select
              value={currentFilter}
              onValueChange={(value) => {
                categoryColumn?.setFilterValue(
                  value === "All" ? undefined : value,
                );
              }}
            >
              <SelectTrigger className="md:min-w-[200px] bg-muted">
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
          <div className="hidden md:grid">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* 5. The containerRef and flex-1 allow this div to fill the space */}
      <div
        ref={containerRef}
        className="bg-white flex-1 overflow-hidden rounded-md border shadow-sm md:mx-3"
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="bg-slate-100 hover:bg-slate-100"
                key={headerGroup.id}
              >
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
                    className="cursor-pointer hover:bg-blue-50 even:bg-slate-50 h-[40px]" // Fixed height for calculation accuracy
                    onClick={() => router.push(`/transactions/${uuid}`)}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center md:justify-end justify-center space-x-2 py-3 px-3 shrink-0">
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
