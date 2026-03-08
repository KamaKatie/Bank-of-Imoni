"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import useTransactions from "@/hooks/use-transactions";

interface CategoryTransactionsTableProps {
  categoryId: string;
}

export const CategoryTransactionsTable: React.FC<
  CategoryTransactionsTableProps
> = ({ categoryId }) => {
  const { transactions } = useTransactions();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
5
  const yenFormatter = useMemo(
    () =>
      new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
        minimumFractionDigits: 0,
      }),
    []
  );

  const categoryTransactions = useMemo(
    () => transactions.filter((tx: any) => tx.category === categoryId),
    [transactions, categoryId]
  );

  const totalPages = Math.ceil(categoryTransactions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = categoryTransactions.slice(startIndex, endIndex);

  if (categoryTransactions.length === 0)
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No transaction data for this category.
      </div>
    );

  return (
    <div className="w-full overflow-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>When</TableHead>
            <TableHead>What</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Who</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedTransactions.map((tx: any) => (
            <TableRow key={tx.id}>
              <TableCell>
                {new Date(tx.date).toLocaleDateString("ja-JP", {
                  month: "numeric",
                  day: "numeric",
                })}
              </TableCell>

              <TableCell>
                <Link href={`/dashboard/transactions/${tx.id}`}>
                  {tx.description}
                </Link>
              </TableCell>

              <TableCell className="text-muted-foreground">
                {tx.type === "expense"
                  ? `-${yenFormatter.format(tx.amount)}`
                  : yenFormatter.format(tx.amount)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {tx.payer?.image ? (
                    <div className="relative h-6 w-6 overflow-hidden rounded-full border">
                      <Image
                        src={tx.payer.image}
                        alt={tx.payer.first_name || "User"}
                        fill
                        className="object-cover aspect-square"
                      />
                    </div>
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                      {tx.payer?.first_name?.[0]}
                      {tx.payer?.last_name?.[0]}
                    </div>
                  )}

                  <span className="font-medium text-foreground">
                    {tx.payer?.first_name}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end space-x-2 py-3">
        <Button
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
