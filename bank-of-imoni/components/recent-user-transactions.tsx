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

interface UserRecentTransactionsProps {
  limit?: number;
}

export const UserRecentTransactions: React.FC<UserRecentTransactionsProps> = ({
  limit = 5,
}) => {
  const { accounts, transactions } = useRecentUserTransactions({ limit });

  const yenFormatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  });

  // Map account IDs to account objects for easy lookup
  const accountMap: Record<string, { id: string; name: string }> = {};
  accounts.forEach((acc) => {
    accountMap[acc.id] = acc;
  });

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
          {transactions.map((tx) => {
            const account = accountMap[tx.paid_by_account]; // lookup full account
            return (
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
                    src={account?.icon || ""}
                    alt={account?.name}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
