"use client";

import React from "react";
import Image from "next/image";
import { useRecentUserTransactions } from "@/hooks/use-recent-user-transactions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AccountTransactionsTableProps {
  accountId: string;
  limit?: number;
}

export const AccountTransactionsTable: React.FC<
  AccountTransactionsTableProps
> = ({ accountId, limit = 10 }) => {
  const { accounts, transactions, isLoading, error } =
    useRecentUserTransactions({ limit });

  if (isLoading) return <p>Loading transactions...</p>;
  if (error) return <p>Error loading transactions: {error.message}</p>;
  if (!transactions.length) return <p>No transactions found.</p>;

  // Formatter for Japanese Yen
  const yenFormatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  });

  // Map account IDs to account objects
  const accountMap: Record<
    string,
    { id: string; name: string; icon?: string; placeholder_img?: string }
  > = {};
  accounts.forEach((acc) => {
    accountMap[acc.id] = acc;
  });

  // Filter transactions for this account
  const accountTransactions = transactions.filter(
    (tx) => tx.paid_by_account === accountId,
  );
  const account = accountMap[accountId];

  return (
    <div className="w-full overflow-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>When</TableHead>
            <TableHead>What</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Account</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accountTransactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>
                {new Date(tx.date).toLocaleDateString("ja-JP", {
                  month: "numeric",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell>{tx.description}</TableCell>
              <TableCell
                className={
                  tx.type === "expense"
                    ? "text-red-600"
                    : "text-green-600 font-semibold"
                }
              >
                {tx.type === "expense"
                  ? `-${yenFormatter.format(tx.amount)}`
                  : yenFormatter.format(tx.amount)}
              </TableCell>
              <TableCell>
                <Image
                  src={account?.icon || account?.placeholder_img || ""}
                  alt={account?.name || "Account"}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
