"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useUserTransactions } from "@/hooks/use-user-transactions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentTransactionsProps {
  limit?: number;
}

export const UserTransactions: React.FC<RecentTransactionsProps> = ({
  limit = 12,
}) => {
  const { accounts, transactions } = useUserTransactions({ limit });

  const yenFormatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  });

  const accountMap: Record<
    string,
    { id: string; name: string; icon?: string }
  > = {};
  accounts.forEach((acc: any) => {
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
          {transactions.map((tx: any) => {
            const account = accountMap[tx.paid_by_account];
            return (
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
